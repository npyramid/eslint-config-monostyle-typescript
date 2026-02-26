import type { Rule } from 'eslint';
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
      multiline:
        'For object patterns with {{min}}+ members, use multiline braces and ' +
        'one member per line.',
    },
  },

  create(context) {
    const { sourceCode } = context;

    if (!sourceCode) {
      return {};
    }

    const rawOptions: unknown = context.options[0];
    const rawMinProperties = (
      typeof rawOptions === 'object' && rawOptions !== null && 'minProperties' in rawOptions
    ) ?
      rawOptions.minProperties :
      undefined;
    const rawIndent = (
      typeof rawOptions === 'object' && rawOptions !== null && 'indent' in rawOptions
    ) ?
      rawOptions.indent :
      undefined;
    const minProperties = typeof rawMinProperties === 'number' ? rawMinProperties : 4;
    const indentSize = typeof rawIndent === 'number' ? rawIndent : 2;

    function check(node: Rule.Node): void {
      if (!('properties' in node) || !Array.isArray(node.properties)) {
        return;
      }

      const { properties } = node;

      if (properties.length < minProperties) {
        return;
      }

      const boundaries = getBoundaryTokens(sourceCode, node, {
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
              node,
              indentSize,
            );

            const memberText = properties
              .map(property => sourceCode.getText(property))
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
