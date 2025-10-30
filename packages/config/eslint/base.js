import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Base ESLint configuration for all packages
 * Provides common TypeScript and JavaScript rules
 */
export const baseConfig = tseslint.config(
  // Ignore patterns
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/.turbo/**', '**/coverage/**'],
  },

  // Base config
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{js,mjs,cjs,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    rules: {
      // TypeScript rules
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'warn',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],

      // General rules
      'no-console': ['warn', { allow: ['warn', 'error', 'info'] }],
      'prefer-const': 'error',
      'no-var': 'error',
    },
  }
);

export default baseConfig;
