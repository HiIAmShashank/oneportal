/**
 * Shared ESLint configurations for the monorepo
 *
 * @example Base config (for packages without React)
 * ```js
 * import { baseConfig } from '@one-portal/config/eslint';
 * export default baseConfig;
 * ```
 *
 * @example React config (for apps and UI packages)
 * ```js
 * import { reactConfig } from '@one-portal/config/eslint';
 * export default reactConfig;
 * ```
 */

export { baseConfig } from './base.js';
export { reactConfig } from './react.js';
