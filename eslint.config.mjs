import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // TypeScript strict rules
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          fixStyle: 'inline-type-imports',
        },
      ],
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/strict-boolean-expressions': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/await-thenable': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'off',
      '@typescript-eslint/prefer-as-const': 'error',
      '@typescript-eslint/no-confusing-void-expression': 'off',

      // React modern rules
      'react/jsx-curly-brace-presence': ['warn', { props: 'never', children: 'never' }],
      'react/self-closing-comp': ['warn', { component: true, html: true }],
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-boolean-value': ['warn', 'never'],
      'react/jsx-no-leaked-render': ['error', { validStrategies: ['ternary'] }],
      'react/jsx-fragments': ['warn', 'syntax'],
      'react/jsx-no-useless-fragment': 'warn',
      'react/no-array-index-key': 'warn',
      'react-hooks/purity': 'off',

      // Modern JavaScript/ES2022+
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': ['error', 'always'],
      'prefer-template': 'error',
      'prefer-arrow-callback': 'error',
      'no-duplicate-imports': 'error',
      'prefer-destructuring': [
        'warn',
        {
          array: true,
          object: true,
        },
      ],
      'prefer-spread': 'error',
      'prefer-rest-params': 'error',
      'no-useless-concat': 'error',
      'prefer-numeric-literals': 'error',
      'prefer-exponentiation-operator': 'error',
      'prefer-object-spread': 'error',
      'no-async-promise-executor': 'error',
      'require-atomic-updates': 'error',
      'no-return-await': 'off',
      '@typescript-eslint/return-await': 'error',

      // Code quality
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      curly: ['warn', 'multi-line'],
      'no-nested-ternary': 'warn',
      'no-unneeded-ternary': 'warn',
      'no-else-return': ['warn', { allowElseIf: false }],
      'prefer-promise-reject-errors': 'error',
      'no-throw-literal': 'error',

      // Next.js specific
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    '.next/**',
    'out/**',
    'build/**',
    'next-env.d.ts',
    // Additional ignores
    'node_modules/**',
    '*.config.js',
    '*.config.mjs',
    '*.config.ts',
    '.gitignore-nextjs',
    'originalversion/**',
  ]),
]);

export default eslintConfig;
