import javascriptESLint from '@eslint/js';
import typescriptESLint from '@typescript-eslint';
import globals from 'globals';

const eslintConfig = typescriptESLint.config(
    javascriptESLint.configs.recommended,
    ...typescriptESLint.configs.strict,
    ...typescriptESLint.configs.stylistic,
    {
        ignores: [
            'node_modules/**',
            '@types/**',
            'dist/**',
            '*.config.js',
            '*.config.ts',
            '*.json'
        ],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: {
                ...globals.node // Node globals instead of browser
            },
            parser: typescriptESLint.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dir // make sure your tsconfig.json is in project root
            },
            sourceType: 'module' // Node ESM
        },
        plugins: {
            '@typescript-eslint': typescriptESLint.plugin
        },
        rules: {
            semi: ['error', 'always'],
            quotes: ['error', 'single'],
            indent: ['error', 4],
            'no-multiple-empty-lines': ['error', { max: 1 }],
            'comma-dangle': ['error', 'never'],
            'brace-style': ['error', '1tbs', { allowSingleLine: false }],
            'array-bracket-spacing': ['error', 'never'],
            'object-curly-spacing': ['error', 'always'],
            'space-before-function-paren': ['error', 'never'],
            'eol-last': ['error', 'always'],
            '@typescript-eslint/no-empty-function': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/ban-ts-comment': 'off'
        }
    }
);

export default eslintConfig;