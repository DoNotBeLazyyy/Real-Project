import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig({
    ignores: [
        'node_modules/**',
        '@types/**',
        'dist/**',
        '.config.js',
        '.config.ts',
        '*.json'
    ],
    languageOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        globals: {
            ...globals.node
        },
        parser: tseslint.parser,
        parserOptions: {
            project: true,
            tsconfigRootDir: import.meta.dirname
        }
    },
    plugins: {
        '@typescript-eslint': tseslint.plugin
    },
    extends: [
        js.configs.recommended,
        ...tseslint.configs.strict,
        ...tseslint.configs.stylistic
    ],
    rules: {
        'array-bracket-newline': 'off',
        'array-bracket-spacing': ['error', 'never'],
        'array-element-newline': 'off',
        'arrow-parens': ['error', 'always'],
        'brace-style': ['error', '1tbs', { allowSingleLine: false }],
        'comma-dangle': ['error', 'never'],
        'dot-location': ['error', 'property'],
        'eol-last': ['error', 'never'],
        'function-paren-newline': ['error', 'consistent'],
        indent: ['error', 4],
        'max-len': 'off',
        'newline-per-chained-call': ['error', { ignoreChainWithDepth: 1 }],
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'object-curly-newline': ['error', { ImportDeclaration: { minProperties: 5, multiline: true } }],
        'object-curly-spacing': ['error', 'always'],
        'object-property-newline': ['error', { allowMultiplePropertiesPerLine: true }],
        'operator-linebreak': ['error', 'before'],
        quotes: ['error', 'single'],
        semi: ['error', 'always'],
        'space-before-function-paren': ['error', 'never'],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/no-empty-function': 'off'
    }
});