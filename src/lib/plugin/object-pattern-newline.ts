import type { Rule } from 'eslint';

import {
  type TSourceCode,
  type TLocatable,
  type TRuleNode,
} from '../types/index.type.ts';
import {
  getBoundaryTokens,
  getBoundaryNewlineNeeds,
  hasAdjacentMembersOnSameLine,
  hasCommentsInsideRange,
  getNodeIndentation,
} from '../utils/index.ts';

export const objectPatternNewlineRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          minProperties: { type: 'integer', minimum: 0 },
          indent: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      multiline: 'For object patterns with {{min}}+ members, use multiline braces and' +
        ' one member per line.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode as unknown as TSourceCode;

    if (!sourceCode) {
      return {};
    }

    const options = (context.options?.[0] ?? {}) as {
      minProperties?: number; indent?: number;
    };
    const minProperties = options.minProperties ?? 4;
    const indentSize = options.indent ?? 2;

    type TProperty = TLocatable & {
      type?: string;
    };

    function check(node: Rule.Node): void {
      const properties = ((node as {
        properties?: TProperty[];
      }).properties ?? []);

      if (properties.length < minProperties) {
        return;
      }

      const boundaries = getBoundaryTokens(sourceCode, node as TRuleNode, {
        left: '{',
        right: '}',
      });

      if (!boundaries) {
        return;
      }

      const { leftToken: leftCurly, rightToken: rightCurly } = boundaries;

      const newlineNeeds = getBoundaryNewlineNeeds(sourceCode, leftCurly, rightCurly);

      if (!newlineNeeds) {
        return;
      }

      const { needsAfter, needsBefore } = newlineNeeds;
      const hasSameLineMembers = hasAdjacentMembersOnSameLine(properties);

      if (!needsAfter && !needsBefore && !hasSameLineMembers) {
        return;
      }

      const hasCommentsInside = hasCommentsInsideRange(sourceCode, leftCurly, rightCurly);

      context.report({
        node,
        messageId: 'multiline',
        data: { min: String(minProperties) },
        fix: hasCommentsInside ?
          null :
          fixer => {
            const { baseIndent, innerIndent } = getNodeIndentation(
              sourceCode,
              node as TRuleNode,
              indentSize,
            );

            const memberText = properties
              .map(property => sourceCode.getText(property as never))
              .join(`,\n${innerIndent}`);

            const last = properties.at(-1);
            const trailingComma = last?.type === 'RestElement' ? '' : ',';
            const replacement = `\n${innerIndent}${memberText}${trailingComma}\n${baseIndent}`;

            return fixer.replaceTextRange([leftCurly.range[1], rightCurly.range[0]], replacement);
          },
      });
    }

    return {
      ObjectPattern: check,
    };
  },
};
