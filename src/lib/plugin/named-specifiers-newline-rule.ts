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

export const namedSpecifiersNewlineRule: Rule.RuleModule = {
  meta: {
    type: 'layout',
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          minSpecifiers: { type: 'integer', minimum: 0 },
          indent: { type: 'integer', minimum: 0 },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      multiline: 'For {{kind}} with {{min}}+ specifiers, use multiline braces and' +
        ' one specifier per line.',
    },
  },

  create(context) {
    const sourceCode = context.sourceCode as unknown as TSourceCode;

    if (!sourceCode) {
      return {};
    }

    const options = (context.options?.[0] ?? {}) as {
      minSpecifiers?: number; indent?: number;
    };
    const minSpecifiers = options.minSpecifiers ?? 4;
    const indentSize = options.indent ?? 2;

    type TSpecifier = TLocatable & {
      type?: string;
    };

    function check(
      node: Rule.Node,
      specifierType: string,
      kind: 'import' | 'export',
    ): void {
      const specifiers = ((node as {
        specifiers?: TSpecifier[];
      }).specifiers ?? []).filter(
        specifier => specifier?.type === specifierType,
      );

      if (specifiers.length < minSpecifiers) {
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
      const hasSameLineSpecifiers = hasAdjacentMembersOnSameLine(specifiers);

      if (!needsAfter && !needsBefore && !hasSameLineSpecifiers) {
        return;
      }

      const hasCommentsInside = hasCommentsInsideRange(sourceCode, leftCurly, rightCurly);

      context.report({
        node,
        messageId: 'multiline',
        data: { kind, min: String(minSpecifiers) },
        fix: hasCommentsInside ?
          null :
          fixer => {
            const { baseIndent, innerIndent } = getNodeIndentation(
              sourceCode,
              node as TRuleNode,
              indentSize,
            );

            const specText = specifiers
              .map(specifier => sourceCode.getText(specifier as never))
              .join(`,\n${innerIndent}`);

            const replacement = `\n${innerIndent}${specText}\n${baseIndent}`;

            return fixer.replaceTextRange([leftCurly.range[1], rightCurly.range[0]], replacement);
          },
      });
    }

    return {
      ImportDeclaration(node) {
        check(node, 'ImportSpecifier', 'import');
      },
      ExportNamedDeclaration(node) {
        check(node, 'ExportSpecifier', 'export');
      },
    };
  },
};
