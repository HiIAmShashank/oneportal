import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { baseConfig } from './base.js';

/**
 * React-specific ESLint configuration
 * Extends base config with React and React Hooks rules
 */
export const reactConfig = tseslint.config(
  // Extend base configuration
  ...baseConfig,

  // React-specific config
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // React Hooks rules
      ...reactHooks.configs.recommended.rules,

      // React Refresh rules
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],

      // Allow console in development components
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
    },
  }
);

export default reactConfig;
