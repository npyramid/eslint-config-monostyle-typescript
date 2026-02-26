import type { Rule } from 'eslint';
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
      multiline:
        'For {{kind}} with {{min}}+ specifiers, use multiline braces and ' +
        'one specifier per line.',
    },
  },

  create(context) {
    const { sourceCode } = context;

    if (!sourceCode) {
      return {};
    }

    const rawOptions: unknown = context.options[0];
    const rawMinSpecifiers = (
      typeof rawOptions === 'object' && rawOptions !== null && 'minSpecifiers' in rawOptions
    ) ?
      rawOptions.minSpecifiers :
      undefined;
    const rawIndent = (
      typeof rawOptions === 'object' && rawOptions !== null && 'indent' in rawOptions
    ) ?
      rawOptions.indent :
      undefined;
    const minSpecifiers = typeof rawMinSpecifiers === 'number' ? rawMinSpecifiers : 4;
    const indentSize = typeof rawIndent === 'number' ? rawIndent : 2;

    function check(
      node: Rule.Node,
      specifierType: string,
      kind: 'import' | 'export',
    ): void {
      if (!('specifiers' in node) || !Array.isArray(node.specifiers)) {
        return;
      }

      const specifiers = node.specifiers.filter(
        specifier => specifier?.type === specifierType,
      );

      if (specifiers.length < minSpecifiers) {
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
              node,
              indentSize,
            );

            const specText = specifiers
              .map(specifier => sourceCode.getText(specifier))
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
