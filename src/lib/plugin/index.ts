import type { Rule } from 'eslint';
import { namedSpecifiersNewlineRule } from './named-specifiers-newline-rule.js';
import { todoTaskReferenceRule } from './todo-task-reference-rule.js';

export const monostyleEslintPlugin: {
  rules: Record<string, Rule.RuleModule>;
} = {
  rules: {
    'named-specifiers-newline': namedSpecifiersNewlineRule,
    'todo-task-reference': todoTaskReferenceRule,
  },
};
