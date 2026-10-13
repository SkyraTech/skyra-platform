import js from '@eslint/js';
import tseslint from 'typescript-eslint';

/**
 * Root ESLint Flat Configuration for Skyra Platform.
 * Provides a framework-agnostic quality gate for TypeScript packages.
 */
export default tseslint.config(
  {
    // Global ignore patterns across the monorepo workspace
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.next/**',
      '**/.turbo/**',
      '**/coverage/**',
      '**/*.tgz',
      '**/skyra-tech-platform-*.tgz',
    ],
  },
  // Core JavaScript recommended rule set
  js.configs.recommended,
  // TypeScript ESLint recommended rule set
  ...tseslint.configs.recommended,
  {
    // Framework-agnostic TypeScript packages (Web Components, utilities)
    files: ['**/*.{ts,tsx,mts,cts}'],
    rules: {
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-eval': 'error',
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'smart'],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
);
