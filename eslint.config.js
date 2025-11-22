import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  globalIgnores(['dist']),
  {
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      prettier,
    ],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/no-import-type-side-effects': 'error',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-expressions': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', ignoreRestSiblings: true },
      ],
      curly: 'error',
      'default-case': 'error',
      'no-case-declarations': 'off',
      'no-duplicate-imports': ['error', { includeExports: true }],
      'no-unused-vars': 'off',
      'react-hooks/set-state-in-effect': 'off',
      'require-await': 'error',
      'simple-import-sort/exports': 'error',
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            ['^react', '^@?\\w'],
            [
              '^@/components/',
              'components',
              '^\\.(\\.)?/((?!components)[a-z\\d-]+/)?[a-z\\d-]+$',
              '^@/assets/',
            ],
            [
              '/contexts',
              '/hooks/',
              '^@/(?!interfaces)',
              '^@/interfaces',
              '\\.(props|interface)\\u0000$',
            ],
            ['^.+\\.s?css$'],
          ],
        },
      ],
    },
  },
]);
