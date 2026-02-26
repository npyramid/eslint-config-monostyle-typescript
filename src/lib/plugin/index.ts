import type { Rule } from 'eslint';
import { multilineArrayBracketsRule } from './multiline-array-brackets.js';
import { namedSpecifiersNewlineRule } from './named-specifiers-newline-rule.js';
import { objectPatternNewlineRule } from './object-pattern-newline.js';
import { todoTaskReferenceRule } from './todo-task-reference-rule.js';

export const monostyleEslintPlugin: {
  rules: Record<string, Rule.RuleModule>;
} = {
  rules: {
    'named-specifiers-newline': namedSpecifiersNewlineRule,
    'multiline-array-brackets': multilineArrayBracketsRule,
    'object-pattern-newline': objectPatternNewlineRule,
    'todo-task-reference': todoTaskReferenceRule,
  },
};
