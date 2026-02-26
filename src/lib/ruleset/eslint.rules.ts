import { type Linter } from 'eslint';
import eslint from '@eslint/js';
import { Xo } from 'xo';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import { monostyleEslintPlugin } from '../plugin/index.ts';
import { rewriteXoStylisticRules } from '../utils/index.ts';
import xoConfigDefault from './xo.config.ts';

const xoEslintConfigs = Xo.xoToEslintConfig(xoConfigDefault).map((configItem: Linter.Config) => {
  if (configItem?.plugins?.['@stylistic']) {
    return {
      ...configItem,
      rules: rewriteXoStylisticRules(configItem.rules),
      plugins: {
        ...configItem.plugins,
        '@stylistic': stylistic,
      },
    };
  }

  if (configItem?.rules) {
    return {
      ...configItem,
      rules: rewriteXoStylisticRules(configItem.rules),
    };
  }

  return configItem;
});

export const styleRules: Linter.Config[] = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...xoEslintConfigs,
  {
    files: ['**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['../../*', '*/../../*'],
              message: 'Aliases preferred here',
            },
          ],
        },
      ],
    },
  },

  {
    files: [
      '**/*.ts',
      '**/*.cts',
      '**/*.mts',
      '**/*.cjs',
      '**/*.mjs',
    ],
    plugins: {
      monostyle: monostyleEslintPlugin,
    },
    rules: {
      'monostyle/named-specifiers-newline': [
        'error',
        {
          minSpecifiers: 4,
          indent: 2,
        },
      ],
      'monostyle/multiline-array-brackets': [
        'error',
        {
          indent: 2,
        },
      ],
      'monostyle/object-pattern-newline': [
        'error',
        {
          minProperties: 4,
          indent: 2,
        },
      ],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          max: 1,
          maxEOF: 1,
          maxBOF: 0,
        },
      ],
      '@stylistic/padded-blocks': ['error', 'never'],
      '@stylistic/semi-style': ['error', 'last'],
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/max-statements-per-line': ['error', { max: 1 }],
      '@stylistic/eol-last': ['error', 'always'],
      '@stylistic/linebreak-style': ['error', 'unix'],
      '@stylistic/array-bracket-newline': ['error', 'consistent'],
      '@stylistic/array-element-newline': [
        'error',
        {
          consistent: true,
          minItems: 4,
        },
      ],
      '@stylistic/new-parens': ['error', 'always'],
      '@stylistic/object-curly-newline': [
        'error',
        {
          ObjectExpression: { consistent: true, minProperties: 4 },
          ObjectPattern: { consistent: true, minProperties: 4 },
          ImportDeclaration: { consistent: true, minProperties: 4 },
          ExportDeclaration: { consistent: true, minProperties: 4 },
          TSTypeLiteral: 'always',
        },
      ],
      '@stylistic/object-property-newline': [
        'error',
        { allowAllPropertiesOnSameLine: true },
      ],
      '@stylistic/one-var-declaration-per-line': ['error', 'always'],
      '@stylistic/operator-linebreak': ['error', 'after'],
      '@stylistic/no-confusing-arrow': ['error'],
      '@stylistic/newline-per-chained-call': [
        'error',
        { ignoreChainWithDepth: 3 },
      ],
      '@stylistic/function-call-argument-newline': ['error', 'consistent'],
      '@stylistic/function-paren-newline': ['error', 'consistent'],
      '@stylistic/object-curly-spacing': ['error', 'always', { emptyObjects: 'never' }],
      '@stylistic/block-spacing': ['error', 'always'],
      '@stylistic/max-len': [
        'error',
        {
          code: 100,
          ignoreUrls: true,
          ignoreRegExpLiterals: true,
          ignorePattern: '^import.*$',
        },
      ],
      'no-restricted-syntax': [
        'error',
        'ForStatement',
        'FunctionDeclaration[generator=true]',
        'FunctionExpression[generator=true]',
        {
          selector: 'FunctionDeclaration[params.length>3]',
          message: 'Too many params (max 3).',
        },
        {
          selector: 'ArrowFunctionExpression[params.length>3]',
          message: 'Too many params (max 3).',
        },
        {
          selector:
            'FunctionExpression[params.length>3]:not(' +
            'MethodDefinition[kind=\'constructor\'] > FunctionExpression)',
          message: 'Too many params (max 3).',
        },
      ],
      curly: ['error', 'all'],
      'max-params': 'off',
      'no-unexpected-multiline': 'error',
      'new-cap': 'off',
      '@typescript-eslint/naming-convention': [
        'error',
        {
          selector: 'typeAlias',
          format: ['PascalCase'],
          prefix: ['T'],
        },
        {
          selector: 'enum',
          format: ['PascalCase'],
          prefix: ['E'],
        },
      ],
    },
  },
];
