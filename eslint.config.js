import { baseConfig } from './packages/config/eslint/index.js';

/**
 * Root ESLint configuration for the monorepo
 *
 * Each package/app has its own eslint.config.js that extends from
 * the shared configs in @one-portal/config/eslint:
 * - baseConfig: For packages without React
 * - reactConfig: For apps and UI packages with React
 *
 * This root config is used when running eslint from the monorepo root,
 * primarily for the lint-staged pre-commit hook.
 */
export default baseConfig;
