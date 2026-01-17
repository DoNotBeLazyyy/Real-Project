// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * @type {import('eslint').Linter.Config[]}
 */
export default [
    {
        ignores: ['node_modules/**', '@types/**', 'dist/**', '*.config.js', '*.config.ts', '*.json'],
    },
    js.configs.recommended,
    ...tseslint.configs.strict,
    ...tseslint.configs.stylistic,
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                ...globals.node,
            },
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname,
            },
        },
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['../*', '../../*', '../../../*'],
                            message: 'Relative parent imports are not allowed. Please use path aliases (e.g., @utils/...).',
                        },
                    ],
                },
            ],
            'array-bracket-newline': ['off'],
            'array-bracket-spacing': ['error', 'never'],
            'array-element-newline': ['off'],
            'arrow-parens': ['error', 'always'],
            'brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: false,
                },
            ],
            'comma-dangle': ['error', 'never'],
            'dot-location': ['error', 'property'],
            'eol-last': ['error', 'never'],
            'function-paren-newline': ['error', 'consistent'],
            indent: ['error', 4],
            'max-len': [
                'off',
                {
                    code: 200,
                    comments: 80,
                },
            ],
            'newline-per-chained-call': [
                'error',
                {
                    ignoreChainWithDepth: 1,
                },
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1,
                },
            ],
            'object-curly-newline': [
                'error',
                {
                    ImportDeclaration: {
                        minProperties: 5,
                        multiline: true,
                    },
                },
            ],
            'object-curly-spacing': ['error', 'always'],
            'object-property-newline': [
                'error',
                {
                    allowMultiplePropertiesPerLine: true,
                },
            ],
            'operator-linebreak': ['error', 'before'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'space-before-function-paren': ['error', 'never'],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            'no-trailing-spaces': ['error'],
        },
    },
];
