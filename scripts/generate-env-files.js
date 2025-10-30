#!/usr/bin/env node
/**
 * Dynamic Environment File Generator for CI/CD
 * 
 * Automatically discovers all apps in the workspace and generates
 * .env.production files based on environment variables.
 * 
 * Convention:
 * - App in apps/shell → looks for SHELL_AUTH_* env vars
 * - App in apps/remote-domino → looks for DOMINO_AUTH_* env vars
 * - App in apps/remote-oneportal-admin → looks for ONEPORTAL_ADMIN_AUTH_* env vars
 *
 * Required env vars per app:
 * - {APP}_AUTH_CLIENT_ID
 * - {APP}_AUTH_AUTHORITY (or TENANT_ID to infer authority)
 * - {APP}_AUTH_REDIRECT_URI
 * - {APP}_AUTH_SCOPES
 *
 * Shared env vars:
 * - TENANT_ID (used to derive authority when not explicitly provided)
 * - ADMIN_API_BASE_URL (shell and admin apps)
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const APPS_DIR = path.join(ROOT_DIR, 'apps');
const SECRETS_FILE = path.join(ROOT_DIR, '.secrets');
const ENV_FILE = path.join(ROOT_DIR, '.env');

// Color codes for terminal output
const colors = {
    reset: '\x1b[0m',
    bright: '\x1b[1m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    red: '\x1b[31m',
    cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Load key=value pairs from a dotenv-style file into process.env if not already set
 */
function loadEnvFile(filePath) {
    if (!filePath || !fs.existsSync(filePath)) {
        return;
    }

    const content = fs.readFileSync(filePath, 'utf8');
    content.split('\n').forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
            return;
        }

        const delimiterIndex = trimmed.indexOf('=');
        if (delimiterIndex === -1) {
            return;
        }

        const key = trimmed.slice(0, delimiterIndex).trim();
        const value = trimmed.slice(delimiterIndex + 1).trim();

        if (!process.env[key]) {
            process.env[key] = value;
        }
    });
}

/**
 * Extract app name from directory name
 * apps/shell → SHELL
 * apps/remote-domino → DOMINO
 * apps/remote-oneportal-admin → ONEPORTAL_ADMIN
 */
function getAppEnvPrefix(appDirName) {
    if (appDirName === 'shell') {
        return 'SHELL';
    }

    if (appDirName === 'storybook') {
        return null; // Skip Storybook
    }

    // Remove 'remote-' prefix and convert to uppercase with underscores
    const name = appDirName.replace(/^remote-/, '');
    return name.toUpperCase().replace(/-/g, '_');
}

/**
 * Resolve an environment variable using multiple candidate keys
 */
function resolveEnvVar(keys, { required = true } = {}) {
    const candidates = Array.isArray(keys) ? keys : [keys];

    for (const key of candidates) {
        const value = process.env[key];
        if (value) {
            return { key, value };
        }
    }

    if (required) {
        const label = candidates.join(' / ');
        log(`Error: Required environment variable ${label} is not set`, 'red');
    }

    return null;
}

/**
 * Build Azure authority URL from tenant ID when AUTHORITY is not provided
 */
function buildAuthorityFromTenant(envPrefix) {
    const tenantCandidates = [
        `${envPrefix}_TENANT_ID`,
        'TENANT_ID',
    ];

    const tenantResult = resolveEnvVar(tenantCandidates, { required: false });
    if (!tenantResult) {
        return null;
    }

    const tenantId = tenantResult.value;
    if (!tenantId) {
        return null;
    }

    return {
        key: tenantResult.key,
        value: `https://login.microsoftonline.com/${tenantId}`,
        computed: true,
    };
}

/**
 * Generate .env.production file for an app
 */
async function generateEnvFile(appDir, appName, envPrefix) {
    const envFilePath = path.join(appDir, '.env.production');

    log(`\nGenerating environment file for ${appName}...`, 'cyan');

    const authPrefix = `${envPrefix}_AUTH`;

    // Resolve required auth variables
    const clientId = resolveEnvVar([
        `${authPrefix}_CLIENT_ID`,
        `${envPrefix}_CLIENT_ID`,
    ]);

    let authority = resolveEnvVar([
        `${authPrefix}_AUTHORITY`,
        `${envPrefix}_AUTHORITY`,
    ], { required: false });

    const redirectUri = resolveEnvVar([
        `${authPrefix}_REDIRECT_URI`,
        `${envPrefix}_REDIRECT_URI`,
    ]);

    const scopes = resolveEnvVar([
        `${authPrefix}_SCOPES`,
        `${envPrefix}_SCOPES`,
    ]);

    if (!authority) {
        const computedAuthority = buildAuthorityFromTenant(envPrefix);
        if (computedAuthority) {
            authority = computedAuthority;
            log(
                `   INFO: Derived authority from ${computedAuthority.key}: ${computedAuthority.value}`,
                'cyan',
            );
        } else {
            log(
                `Error: Unable to resolve ${authPrefix}_AUTHORITY. Provide AUTHORITY or TENANT_ID.`,
                'red',
            );
        }
    }

    if (!clientId || !authority || !redirectUri || !scopes) {
        log(`Skipping ${appName} - missing required environment variables`, 'yellow');
        return false;
    }

    const postLogout = resolveEnvVar([
        `${authPrefix}_POST_LOGOUT_REDIRECT_URI`,
        `${envPrefix}_POST_LOGOUT_REDIRECT_URI`,
    ], { required: false });

    // Build environment file content
    let envContent = `# Auto-generated by scripts/generate-env-files.js
# DO NOT EDIT MANUALLY - This file is created during CI/CD builds

VITE_${authPrefix}_CLIENT_ID=${clientId.value}
VITE_${authPrefix}_AUTHORITY=${authority.value}
VITE_${authPrefix}_REDIRECT_URI=${redirectUri.value}
VITE_${authPrefix}_SCOPES=${scopes.value}
`;

    if (postLogout?.value) {
        envContent += `VITE_${authPrefix}_POST_LOGOUT_REDIRECT_URI=${postLogout.value}\n`;
    }

    // Add optional API base URL for shell and admin apps
    const apiBaseUrl = resolveEnvVar('ADMIN_API_BASE_URL', { required: false });
    if (apiBaseUrl?.value && (envPrefix === 'SHELL' || envPrefix.includes('ADMIN'))) {
        envContent += `VITE_${envPrefix}_ADMIN_FUNCTIONAPP_API_BASE_URL=${apiBaseUrl.value}\n`;
    }

    const appMode = resolveEnvVar('APP_MODE', { required: false });
    if (appMode?.value) {
        envContent += `VITE_APP_MODE=${appMode.value}\n`;
    }

    // Write file
    await fs.writeFile(envFilePath, envContent, 'utf8');

    log(`   - Created: ${path.relative(ROOT_DIR, envFilePath)}`, 'green');
    log(`   - CLIENT_ID source: ${clientId.key}`, 'reset');
    log(`   - AUTHORITY source: ${authority.key ?? 'derived'}`, 'reset');
    log(`   - REDIRECT_URI: ${redirectUri.value}`, 'reset');
    log(`   - SCOPES: ${scopes.value}`, 'reset');

    return true;
}

/**
 * Main execution
 */
async function main() {
    // Preload local env files for developer convenience (skip in CI where vars are injected)
    const isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
    if (!isCI) {
        loadEnvFile(ENV_FILE);
        loadEnvFile(SECRETS_FILE);
    }

    log('\nStarting dynamic environment file generation...\n', 'bright');

    // Verify apps directory exists
    if (!await fs.pathExists(APPS_DIR)) {
        log(`Error: Apps directory not found at ${APPS_DIR}`, 'red');
        process.exit(1);
    }

    // Get all app directories
    const appDirs = await fs.readdir(APPS_DIR);

    let successCount = 0;
    let skipCount = 0;

    for (const appDirName of appDirs) {
        const appDir = path.join(APPS_DIR, appDirName);
        const stat = await fs.stat(appDir);

        // Skip if not a directory
        if (!stat.isDirectory()) {
            continue;
        }

        // Get environment variable prefix
        const envPrefix = getAppEnvPrefix(appDirName);

        // Skip if no prefix (e.g., storybook)
        if (!envPrefix) {
            log(`Skipping ${appDirName} (excluded from production builds)`, 'yellow');
            skipCount++;
            continue;
        }

        // Generate env file
        const success = await generateEnvFile(appDir, appDirName, envPrefix);

        if (success) {
            successCount++;
        } else {
            skipCount++;
        }
    }

    // Summary
    log('\n' + '='.repeat(60), 'cyan');
    log('Summary:', 'bright');
    log(`   Successfully generated: ${successCount} file(s)`, 'green');

    if (skipCount > 0) {
        log(`   Skipped: ${skipCount} app(s)`, 'yellow');
    }

    log('='.repeat(60) + '\n', 'cyan');

    if (successCount === 0) {
        log('Error: No environment files were generated', 'red');
        log('   Check that required environment variables are set:', 'red');
        log('   - TENANT_ID', 'red');
        log('   - {APP}_CLIENT_ID', 'red');
        log('   - {APP}_REDIRECT_URI', 'red');
        log('   - {APP}_SCOPES', 'red');
        process.exit(1);
    }

    log('Environment file generation complete!\n', 'green');
}

// Run the script
main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
