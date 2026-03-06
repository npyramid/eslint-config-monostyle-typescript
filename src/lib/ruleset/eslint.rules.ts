import { type Linter } from 'eslint';
import { Xo } from 'xo';
import stylistic from '@stylistic/eslint-plugin';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import { monostyleEslintPlugin } from '../plugin/index.ts';
import { rewriteXoStylisticRules } from '../utils/index.ts';
import { stylisticRules } from './stylistic.rules.ts';
import { xoSettings, xoSettingsPrettier } from './xo.config.ts';

type TXoConfigItem = NonNullable<Parameters<typeof Xo.xoToEslintConfig>[0]>[number];

const toCompatXoConfigs = (xoConfigs: TXoConfigItem[]): Linter.Config[] =>
  Xo.xoToEslintConfig(xoConfigs).map((configItem: Linter.Config) => {
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

const xoEslintRules = toCompatXoConfigs(xoSettings);
const xoEslintRulesPrettier = toCompatXoConfigs(xoSettingsPrettier);

const allFiles = ['**/*.ts', '**/*.cts', '**/*.mts', '**/*.cjs', '**/*.mjs'];

const offRules: Linter.Config = {
  files: allFiles,
  rules: {
    'no-warning-comments': 'off',
    'sonarjs/todo-tag': 'off',
  },
};

const restrictedImportsRule: Linter.Config = {
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
};

const baseRuntimeRules: Linter.RulesRecord = {
  'monostyle/todo-task-reference': [
    'error',
    {
      regexp: String.raw`[a-z][a-z0-9+.-]*://[^\s]*(?:[A-Z][A-Z0-9]+-\d+|issues/\d+)[^\s]*`,
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
        "MethodDefinition[kind='constructor'] > FunctionExpression)",
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
      selector: 'variable',
      types: ['boolean'],
      format: ['camelCase'],
      custom: {
        regex: '^(is|has|can|should|will|did|was|were|needs|allow|supports)[A-Z]',
        match: true,
      },
    },
    {
      selector: 'parameter',
      types: ['boolean'],
      format: ['camelCase'],
      custom: {
        regex: '^(is|has|can|should|will|did|was|were|needs|allow|supports)[A-Z]',
        match: true,
      },
    },
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
};

const monostyleFormattingRules: Linter.RulesRecord = {
  'monostyle/named-specifiers-newline': [
    'error',
    {
      minSpecifiers: 4,
      indent: 2,
    },
  ],
};

export const lintingRules: Linter.Config[] = [
  ...xoEslintRules,
  offRules,
  restrictedImportsRule,

  {
    files: allFiles,
    plugins: {
      monostyle: monostyleEslintPlugin,
      '@stylistic': stylistic,
    },
    rules: {
      ...monostyleFormattingRules,
      ...stylisticRules,
      ...baseRuntimeRules,
    },
  },
];

export const lintingRulesPrettier: Linter.Config[] = [
  ...xoEslintRulesPrettier,
  offRules,
  restrictedImportsRule,
  {
    files: allFiles,
    plugins: {
      monostyle: monostyleEslintPlugin,
    },
    rules: {
      ...baseRuntimeRules,
    },
  },
  // Keep this as the final item so it can disable all formatting-related rules.
  eslintConfigPrettier,
];
