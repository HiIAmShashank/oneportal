#!/usr/bin/env node
/**
 * Combines individual app builds into a single deployment directory
 * for Azure Static Web Apps single-instance deployment.
 */

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const APPS_DIR = path.join(ROOT_DIR, 'apps');
const BUILD_DIR = path.join(ROOT_DIR, 'dist-deploy');

/**
 * Auto-discover apps from the apps directory
 * @returns {Array} Array of app configurations
 */
function discoverApps() {
  const apps = [];
  const entries = fs.readdirSync(APPS_DIR, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const dirName = entry.name;
    const packageJsonPath = path.join(APPS_DIR, dirName, 'package.json');

    // Skip if no package.json
    if (!fs.existsSync(packageJsonPath)) continue;

    // Read package.json to check for exclusions
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

    // Skip storybook
    if (packageJson.name === '@one-portal/storybook') continue;

    // Handle shell (goes to root) vs remotes (go to subdirectories)
    if (dirName === 'shell') {
      apps.push({
        name: 'shell',
        source: path.join(APPS_DIR, 'shell', 'dist'),
        destination: BUILD_DIR,
        description: 'Shell (Host Application)'
      });
    } else if (dirName.startsWith('remote-')) {
      // Extract app name by removing 'remote-' prefix
      const appName = dirName.replace(/^remote-/, '');
      const displayName = packageJson.name?.replace(/^@[^/]+\//, '').replace(/^remote-/, '');

      apps.push({
        name: appName,
        source: path.join(APPS_DIR, dirName, 'dist'),
        destination: path.join(BUILD_DIR, appName),
        description: `${displayName.charAt(0).toUpperCase() + displayName.slice(1)} Remote App`
      });
    }
  }

  return apps;
}

async function combineBuilds() {
  console.log('Starting build combination...\n');

  // Auto-discover apps
  const APPS = discoverApps();

  if (APPS.length === 0) {
    console.error('Error: No apps found in apps/ directory');
    process.exit(1);
  }

  console.log(`Discovered ${APPS.length} app(s): ${APPS.map(a => a.name).join(', ')}\n`);

  // Step 1: Clean previous build
  console.log('Cleaning previous deployment build...');
  await fs.emptyDir(BUILD_DIR);
  console.log('Cleaned dist-deploy/\n');

  // Step 2: Verify all source directories exist
  console.log('Verifying source builds...');
  for (const app of APPS) {
    const exists = await fs.pathExists(app.source);
    if (!exists) {
      console.error(`Error: ${app.name} build not found at ${app.source}`);
      console.error('   Run "pnpm build" first!');
      process.exit(1);
    }
    console.log(`   - ${app.description}: ${app.source}`);
  }
  console.log('All source builds verified\n');

  // Step 3: Copy each app to destination
  console.log('Copying builds...');
  for (const app of APPS) {
    console.log(`   Copying ${app.description}...`);
    await fs.copy(app.source, app.destination, {
      overwrite: true,
      errorOnExist: false
    });
    console.log(`   - ${app.name} → ${path.relative(ROOT_DIR, app.destination)}`);
  }
  console.log('All builds copied\n');

  // Step 4: Verify remoteEntry.js files exist
  console.log('Verifying Module Federation entry points...');
  const remotes = APPS.filter(app => app.name !== 'shell');
  for (const remote of remotes) {
    const remoteEntryPath = path.join(remote.destination, 'assets/remoteEntry.js');
    const exists = await fs.pathExists(remoteEntryPath);
    if (!exists) {
      console.error(`Warning: remoteEntry.js not found for ${remote.name}`);
      console.error(`   Expected at: ${remoteEntryPath}`);
    } else {
      console.log(`   - ${remote.name}/assets/remoteEntry.js`);
    }
  }
  console.log('Remote entry points verified\n');

  // Step 5: Copy staticwebapp.config.json
  console.log('Copying Azure SWA configuration...');
  const configSource = path.join(ROOT_DIR, 'staticwebapp.config.json');
  const configDest = path.join(BUILD_DIR, 'staticwebapp.config.json');

  if (fs.existsSync(configSource)) {
    fs.copyFileSync(configSource, configDest);
    console.log('   - staticwebapp.config.json copied');
  } else {
    console.log('   Note: staticwebapp.config.json not found (optional)');
  }
  console.log('Configuration copied\n');
  console.log('Build combination complete!\n');
  console.log('Ready to deploy with:');
  console.log('   swa start dist-deploy --port 4280\n');
}

// Run the script
combineBuilds().catch(error => {
  console.error('Error combining builds:', error);
  process.exit(1);
});
