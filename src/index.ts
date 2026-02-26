import sonarjs from 'eslint-plugin-sonarjs';
import type { ConfigArray } from 'typescript-eslint';
import { styleRules } from './lib/ruleset/eslint.rules.js';
import { nxRules } from './lib/ruleset/nx.rules.js';

export { styleRules } from './lib/ruleset/eslint.rules.js';
export { nxRules } from './lib/ruleset/nx.rules.js';

export const monostylePresetTs: ConfigArray = [
  sonarjs.configs.recommended,
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  ...styleRules,
];

export const monostylePresetNxTs: ConfigArray = [
  ...monostylePresetTs,
  ...nxRules,
];
