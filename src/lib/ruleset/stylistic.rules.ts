import { type Linter } from 'eslint';

export const stylisticRules: Linter.RulesRecord = {
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
      ignoreComments: true,
    },
  ],
  '@stylistic/indent': ['error', 2, { SwitchCase: 1 }],
};
