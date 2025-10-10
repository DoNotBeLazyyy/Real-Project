import javascriptESLint from '@eslint/js';
import reactESLintRecommeded from 'eslint-plugin-react/configs/recommended.js';
import reactHookESLintPlugin from 'eslint-plugin-react-hooks';
import reactRefreshESLintPlugin from 'eslint-plugin-react-refresh';
import globals from 'globals';
import typescriptESLint from 'typescript-eslint';

const eslintConfig = typescriptESLint.config(
    javascriptESLint.configs.recommended,
    reactESLintRecommeded,
    ...typescriptESLint.configs.strict,
    ...typescriptESLint.configs.stylistic,
    {
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
            globals: {
                ...globals.browser
            },
            parser: typescriptESLint.parser,
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname
            },
            sourceType: 'module'
        },
        plugins: {
            '@typescript-eslint': typescriptESLint.plugin,
            'react-hooks': reactHookESLintPlugin,
            'react-refresh': reactRefreshESLintPlugin
        },
        rules: {
            'array-bracket-newline': ['off'],
            'array-bracket-spacing': ['error', 'never'],
            'array-element-newline': ['off'],
            'arrow-parens': ['error', 'always'],
            'brace-style': [
                'error',
                '1tbs',
                {
                    allowSingleLine: false
                }
            ],
            'comma-dangle': ['error', 'never'],
            'dot-location': ['error', 'property'],
            'eol-last': ['error', 'never'],
            'function-paren-newline': ['error', 'consistent'],
            indent: ['error', 4],
            'jsx-quotes': ['error', 'prefer-double'],
            'max-len': [
                'off',
                {
                    code: 200,
                    comments: 80
                }
            ],
            'newline-per-chained-call': [
                'error',
                {
                    ignoreChainWithDepth: 1
                }
            ],
            'no-multiple-empty-lines': [
                'error',
                {
                    max: 1
                }
            ],
            'object-curly-newline': [
                'error',
                {
                    ImportDeclaration: {
                        minProperties: 5,
                        multiline: true
                    }
                }
            ],
            'object-curly-spacing': ['error', 'always'],
            'object-property-newline': [
                'error',
                {
                    allowMultiplePropertiesPerLine: true
                }
            ],
            'operator-linebreak': ['error', 'before'],
            quotes: ['error', 'single'],
            semi: ['error', 'always'],
            'space-before-function-paren': ['error', 'never'],
            '@typescript-eslint/ban-ts-comment': 'off',
            '@typescript-eslint/no-empty-function': 'off',
            'react/react-in-jsx-scope': 'off',
            'react-refresh/only-export-components': [
                'warn',
                {
                    allowConstantExport: true
                }
            ],
            'no-trailing-spaces': ['error']
        },
        settings: {
            react: {
                version: 'detect' // React 버전을 자동으로 감지함
            }
        }
    }
);

export default eslintConfig;