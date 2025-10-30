#!/usr/bin/env node

/**
 * Validates authentication environment configuration
 * Automatically discovers all apps and validates their .env.local files
 *
 * Usage: node scripts/validate-auth-config.js
 */

import { existsSync, readFileSync, readdirSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT_DIR = join(__dirname, '..');

/**
 * Generate app-specific environment variable prefix from app directory name.
 * Matches the logic in packages/auth/src/config/loadAuthConfig.ts
 *
 * @param {string} dirName - Directory name (e.g., 'shell', 'remote-domino')
 * @returns {string} Environment variable prefix (e.g., 'VITE_SHELL_AUTH_')
 */
function generateEnvPrefix(dirName) {
  const appName = dirName.replace(/^remote-/, ''); // Remove 'remote-' prefix if present
  const normalized = appName
    .toUpperCase()
    .replace(/-/g, '_'); // Convert kebab-case to CONSTANT_CASE

  return `VITE_${normalized}_AUTH_`;
}

/**
 * Generate display name from directory name
 * @param {string} dirName - Directory name (e.g., 'shell', 'remote-domino')
 * @returns {string} Display name (e.g., 'Shell', 'Domino')
 */
function generateDisplayName(dirName) {
  const appName = dirName.replace(/^remote-/, '');
  return appName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Generate expected redirect URIs for an app
 * @param {string} dirName - Directory name
 * @param {boolean} isShell - Whether this is the shell app
 * @returns {Object} Expected redirect URIs for different environments
 */
function generateExpectedRedirectURIs(dirName, isShell) {
  const appName = dirName.replace(/^remote-/, '');

  if (isShell) {
    return {
      swa: 'http://localhost:4280/auth/callback',
      vite: 'http://localhost:5000/auth/callback',
      prod: 'https://oneportal.azurestaticapps.net/auth/callback'
    };
  }

  return {
    swa: `http://localhost:4280/apps/${appName}/auth/callback`,
    vite: 'http://localhost:5173/auth/callback',
    prod: `https://oneportal.azurestaticapps.net/apps/${appName}/auth/callback`
  };
}

/**
 * Discover all apps in the repository
 * @returns {Array} Array of app configurations
 */
function discoverApps() {
  const appsDir = join(ROOT_DIR, 'apps');
  const apps = [];

  if (!existsSync(appsDir)) {
    console.error('Apps directory not found:', appsDir);
    process.exit(1);
  }

  const entries = readdirSync(appsDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirName = entry.name;

    // Skip storybook and other non-app directories
    if (dirName === 'storybook' || dirName.startsWith('.')) continue;

    const isShell = dirName === 'shell';
    const appDir = join('apps', dirName);

    apps.push({
      name: generateDisplayName(dirName),
      dir: appDir,
      prefix: generateEnvPrefix(dirName),
      expectedRedirectURI: generateExpectedRedirectURIs(dirName, isShell),
      isShell
    });
  }

  return apps.sort((a, b) => {
    // Shell first, then alphabetically
    if (a.isShell) return -1;
    if (b.isShell) return 1;
    return a.name.localeCompare(b.name);
  });
}

const APPS = discoverApps();

let hasErrors = false;

console.log('Validating OnePortal Authentication Configuration\n');

APPS.forEach(app => {
  const envPath = join(ROOT_DIR, app.dir, '.env.local');
  const examplePath = join(ROOT_DIR, app.dir, '.env.local.example');

  console.log(`\n${app.name}`);
  console.log(`   Location: ${app.dir}`);

  // Check if .env.local exists
  if (!existsSync(envPath)) {
    console.log(`   .env.local NOT FOUND`);
    if (existsSync(examplePath)) {
      console.log(`   Hint: Copy from .env.local.example and update with your Client ID`);
      console.log(`      cp ${app.dir}/.env.local.example ${app.dir}/.env.local`);
    }
    hasErrors = true;
    return;
  }

  console.log(`   .env.local found`);

  // Read and parse .env.local
  const envContent = readFileSync(envPath, 'utf-8');
  const envVars = {};
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    }
  });

  // Validate required variables using app-specific prefix
  const required = [
    `${app.prefix}CLIENT_ID`,
    `${app.prefix}AUTHORITY`,
    `${app.prefix}REDIRECT_URI`,
    `${app.prefix}SCOPES`,
  ];

  let appHasErrors = false;

  required.forEach(varName => {
    if (!envVars[varName]) {
      console.log(`   Missing: ${varName}`);
      appHasErrors = true;
    } else if (envVars[varName].includes('your-') || envVars[varName].includes('-guid-here')) {
      console.log(`   WARNING: ${varName} not updated (still contains placeholder)`);
      appHasErrors = true;
    } else {
      const isSensitive = varName.includes('CLIENT_ID');
      console.log(`   ${varName}: ${isSensitive ? '***' : envVars[varName]}`);
    }
  });

  // Check redirect URI
  const redirectURIKey = `${app.prefix}REDIRECT_URI`;
  if (envVars[redirectURIKey]) {
    const redirectURI = envVars[redirectURIKey];
    const { swa, vite, prod } = app.expectedRedirectURI;

    if (redirectURI === swa) {
      console.log(`   Redirect URI configured for: SWA CLI + Docker`);
    } else if (redirectURI === vite) {
      console.log(`   Redirect URI configured for: Vite Dev Server`);
    } else if (redirectURI === prod) {
      console.log(`   Redirect URI configured for: Production (Azure SWA)`);
    } else {
      console.log(`   WARNING: Redirect URI doesn't match expected patterns:`);
      console.log(`      Current: ${redirectURI}`);
      console.log(`      Expected (SWA):  ${swa}`);
      console.log(`      Expected (Vite): ${vite}`);
      console.log(`      Expected (Prod): ${prod}`);
      appHasErrors = true;
    }
  }

  if (appHasErrors) {
    hasErrors = true;
  }
});

console.log('\n' + '='.repeat(70));

if (hasErrors) {
  console.log('\nConfiguration has errors. Please fix the issues above.\n');
  console.log('See docs/auth/azure-ad-setup.md for setup instructions');
  console.log('See docs/auth/redirect-uris-reference.md for quick reference\n');
  process.exit(1);
} else {
  console.log('\nAll authentication configuration is valid!\n');
  console.log('Next steps:');
  console.log('  1. Ensure Azure AD apps have matching redirect URIs registered');
  console.log('  2. Run: pnpm build && pnpm swa:start');
  console.log('  3. Navigate to: http://localhost:4280');
  console.log('  4. Test sign-in flow\n');
  console.log('See docs/auth/CONFIGURATION-UPDATE.md for testing scenarios\n');
  process.exit(0);
}
