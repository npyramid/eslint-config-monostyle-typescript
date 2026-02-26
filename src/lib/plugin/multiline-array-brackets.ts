import type { Rule } from 'eslint';
import type { TSourceCode, TRuleNode } from '../types/index.type.ts';
import {
  getBoundaryTokens,
  getBoundaryNewlineNeeds,
  hasCommentsInsideRange,
  getNodeIndentation,
} from '../utils/index.ts';

export const multilineArrayBracketsRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          indent: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      brackets: 'Multiline arrays must have newlines after `[` and before `]`.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode as TSourceCode;

    if (!sourceCode) {
      return {};
    }

    const options = (context.options?.[0] ?? {}) as {
      indent?: number;
    };
    const indentSize = options.indent ?? 2;

    function check(node: Rule.Node): void {
      if (!node.loc || node.loc.start.line === node.loc.end.line) {
        return;
      }

      const boundaries = getBoundaryTokens(sourceCode, node as TRuleNode, {
        left: '[',
        right: ']',
      });

      if (!boundaries) {
        return;
      }

      const { leftToken: leftBracket, rightToken: rightBracket } = boundaries;

      const newlineNeeds = getBoundaryNewlineNeeds(sourceCode, leftBracket, rightBracket);

      if (!newlineNeeds) {
        return;
      }

      const { needsAfter, needsBefore } = newlineNeeds;

      if (!needsAfter && !needsBefore) {
        return;
      }

      const hasCommentsInside = hasCommentsInsideRange(sourceCode, leftBracket, rightBracket);

      context.report({
        node,
        messageId: 'brackets',
        fix: hasCommentsInside ?
          null :
          fixer => {
            const { baseIndent, innerIndent } = getNodeIndentation(
              sourceCode,
              node as TRuleNode,
              indentSize,
            );

            const fixes: Rule.Fix[] = [];

            if (needsAfter) {
              fixes.push(fixer.insertTextAfterRange(leftBracket.range, `\n${innerIndent}`));
            }

            if (needsBefore) {
              fixes.push(fixer.insertTextBeforeRange(rightBracket.range, `\n${baseIndent}`));
            }

            return fixes;
          },
      });
    }

    return {
      ArrayExpression: check,
      ArrayPattern: check,
    };
  },
};
