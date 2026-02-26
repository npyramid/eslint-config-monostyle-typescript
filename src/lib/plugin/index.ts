import type { Rule } from "eslint";
import { multilineArrayBracketsRule } from "./multiline-array-brackets.ts";
import { namedSpecifiersNewlineRule } from "./named-specifiers-newline-rule.ts";
import { objectPatternNewlineRule } from "./object-pattern-newline.ts";


export const monostyleEslintPlugin: {
  rules: Record<string, Rule.RuleModule>;
} = {
  rules: {
    'named-specifiers-newline': namedSpecifiersNewlineRule,
    'multiline-array-brackets': multilineArrayBracketsRule,
    'object-pattern-newline': objectPatternNewlineRule,
  },
};
