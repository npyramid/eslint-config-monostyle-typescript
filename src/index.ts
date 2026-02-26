export { styleRules } from './lib/ruleset/eslint.rules.ts';
export { nxRules } from './lib/ruleset/nx.rules.ts';
import { styleRules } from './lib/ruleset/eslint.rules.ts';
import { nxRules } from './lib/ruleset/nx.rules.ts';
import sonarjs from 'eslint-plugin-sonarjs';
import type { ConfigArray } from 'typescript-eslint';

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
