import { type Linter } from 'eslint';
import { Xo } from 'xo';
import stylistic from '@stylistic/eslint-plugin';
import { monostyleEslintPlugin } from '../plugin/index.ts';
import { rewriteXoStylisticRules } from '../utils/index.ts';
import { stylisticRules } from './stylistic.rules.ts';
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

const allFiles = [
  '**/*.ts',
  '**/*.cts',
  '**/*.mts',
  '**/*.cjs',
  '**/*.mjs',
];

const offRules: Linter.Config = {
  files: allFiles,
  rules: {
    'no-warning-comments': 'off',
    'sonarjs/todo-tag': 'off',
  },
};

export const lintingRules: Linter.Config[] = [
  ...xoEslintConfigs,
  offRules,
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
    files: allFiles,
    plugins: {
      monostyle: monostyleEslintPlugin,
      '@stylistic': stylistic,
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
      'monostyle/todo-task-reference': [
        'error',
        {
          regexp:
            String.raw`[a-z][a-z0-9+.-]*://[^\s]*(?:[A-Z][A-Z0-9]+-\d+|issues/\d+)[^\s]*`,
        },
      ],
      ...stylisticRules,
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
