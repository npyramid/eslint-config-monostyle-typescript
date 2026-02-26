import sonarjs from 'eslint-plugin-sonarjs';
import tseslint, { type ConfigArray } from 'typescript-eslint';
import { lintingRules } from './lib/ruleset/eslint.rules.js';
import { nxRules } from './lib/ruleset/nx.rules.js';

export { lintingRules } from './lib/ruleset/eslint.rules.js';
export { nxRules } from './lib/ruleset/nx.rules.js';
export { stylisticRules } from './lib/ruleset/stylistic.rules.js';

export const monostylePresetTs: ConfigArray = [
  ...tseslint.configs.stylistic,
  sonarjs.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...lintingRules,
];

export const monostylePresetNxTs: ConfigArray = [
  ...monostylePresetTs,
  ...nxRules,
];
