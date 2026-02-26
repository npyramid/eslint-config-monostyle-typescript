import sonarjs from 'eslint-plugin-sonarjs';
import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';
import { styleRules } from './lib/ruleset/eslint.rules.js';
import { nxRules } from './lib/ruleset/nx.rules.js';

export { styleRules } from './lib/ruleset/eslint.rules.js';
export { nxRules } from './lib/ruleset/nx.rules.js';

export const monostylePresetTs: tseslint.ConfigArray = [
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  sonarjs.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...styleRules,
];

export const monostylePresetNxTs: tseslint.ConfigArray = [
  ...monostylePresetTs,
  ...nxRules,
];
