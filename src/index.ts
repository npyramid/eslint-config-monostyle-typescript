import sonarjs from "eslint-plugin-sonarjs";
import tseslint, { type ConfigArray } from "typescript-eslint";
import {
  lintingRules,
  lintingRulesPrettier,
} from "./lib/ruleset/eslint.rules.js";
import { nxRules } from "./lib/ruleset/nx.rules.js";

export { lintingRules } from "./lib/ruleset/eslint.rules.js";
export { lintingRulesPrettier } from "./lib/ruleset/eslint.rules.js";
export { nxRules } from "./lib/ruleset/nx.rules.js";
export { stylisticRules } from "./lib/ruleset/stylistic.rules.js";

const typeLintOption = {
  languageOptions: {
    parserOptions: {
      projectService: true,
    },
  },
};

export const monostylePresetTs: ConfigArray = [
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
    ...typeLintOption,
  },
  ...lintingRules,
];

export const monostylePresetNxTs: ConfigArray = [
  ...monostylePresetTs,
  ...nxRules,
];

export const monostylePresetTsPrettier: ConfigArray = [
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    ignores: ["dist/**", "node_modules/**"],
    ...typeLintOption,
  },
  ...lintingRulesPrettier,
];

export const monostylePresetNxTsPrettier: ConfigArray = [
  ...monostylePresetTsPrettier,
  ...nxRules,
];

export { default as prettierConfig } from "./lib/ruleset/prettier-config.js";
