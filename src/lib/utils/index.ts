import { type Linter } from 'eslint';
import {
  type TSourceCode,
  type TRuleNode,
  type TLocatable,
  type TToken,
} from '../types/index.type.ts';

export function getNodeIndentation(
  sourceCode: TSourceCode,
  node: TRuleNode,
  indentSize: number,
): {
  baseIndent: string;
  innerIndent: string;
} {
  const startLine = (node.loc?.start.line ?? 1) - 1;
  const lineText = sourceCode.lines[startLine] ?? '';
  const baseIndent = getLeadingWhitespace(lineText);

  return {
    baseIndent,
    innerIndent: baseIndent + ' '.repeat(indentSize),
  };
}

export function hasAdjacentMembersOnSameLine(items: TLocatable[]): boolean {
  if (!items.every(item => Boolean(item.loc))) {
    return false;
  }

  return items.slice(1).some((item, index) => {
    const previousLine = items[index].loc?.start.line;
    const currentLine = item.loc?.start.line;

    return previousLine !== undefined && currentLine !== undefined && previousLine === currentLine;
  });
}

export function getBoundaryTokens(
  sourceCode: TSourceCode,
  node: TRuleNode,
  boundaries: {
    left: string;
    right: string;
  },
): {
  leftToken: TToken;
  rightToken: TToken;
} | undefined {
  const tokens = sourceCode.getTokens(node as never, { includeComments: false });
  const leftToken = tokens.find(token => token.value === boundaries.left);
  const rightToken = [...tokens].reverse().find(token => token.value === boundaries.right);

  if (!leftToken || !rightToken) {
    return undefined;
  }

  return { leftToken, rightToken };
}

export function getBoundaryNewlineNeeds(
  sourceCode: TSourceCode,
  leftToken: TToken,
  rightToken: TToken,
): {
  needsAfter: boolean;
  needsBefore: boolean;
} | undefined {
  const nextToken = sourceCode.getTokenAfter(
    leftToken as never,
    { includeComments: false },
  );
  const previousToken = sourceCode.getTokenBefore(rightToken as never, {
    includeComments: false,
  });

  if (!nextToken || !previousToken) {
    return undefined;
  }

  return {
    needsAfter: leftToken.loc.end.line === nextToken.loc.start.line,
    needsBefore: previousToken.loc.end.line === rightToken.loc.start.line,
  };
}

export function hasCommentsInsideRange(
  sourceCode: TSourceCode,
  leftToken: TToken,
  rightToken: TToken,
): boolean {
  return sourceCode
    .getTokensBetween(leftToken as never, rightToken as never, { includeComments: true })
    .some(token => token.type === 'Line' || token.type === 'Block');
}

export const getLeadingWhitespace = (text: string): string => {
  const match = /^\s*/.exec(text);
  return match?.[0] ?? '';
};

export function rewriteXoStylisticRules(rules: Linter.Config['rules']): Linter.Config['rules'] {
  if (!rules) {
    return rules;
  }

  // @stylistic v5 renamed some rule ids. xo still using stylistic v2
  if (rules['@stylistic/func-call-spacing'] && !rules['@stylistic/function-call-spacing']) {
    const {
      '@stylistic/func-call-spacing': funcCallSpacing,
      ...rest
    } = rules;

    return {
      ...rest,
      '@stylistic/function-call-spacing': funcCallSpacing,
    };
  }

  return rules;
}

