import { type Rule, type Linter } from 'eslint';
import {
  type TSourceCode,
  type TLocatable,
  type TToken,
} from '../types/index.type.ts';

type TTokenWithLocAndRange = TToken & {
  loc: {
    start: {
      line: number;
    };
    end: {
      line: number;
    };
  };
  range: [number, number];
};

const hasTokenLocAndRange = (token: TToken): token is TTokenWithLocAndRange => (
  Boolean(token.loc) &&
  Array.isArray(token.range) &&
  token.range.length === 2
);

export function getNodeIndentation(
  sourceCode: TSourceCode,
  node: Rule.Node,
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
  node: Rule.Node,
  boundaries: {
    left: string;
    right: string;
  },
): {
  leftToken: TTokenWithLocAndRange;
  rightToken: TTokenWithLocAndRange;
} | undefined {
  const tokens = sourceCode.getTokens(node, { includeComments: false });
  const leftToken = tokens.find(
    token => token.value === boundaries.left && hasTokenLocAndRange(token),
  );
  const rightToken = [...tokens]
    .toReversed()
    .find(token => token.value === boundaries.right && hasTokenLocAndRange(token));

  if (!leftToken || !rightToken) {
    return undefined;
  }

  return { leftToken, rightToken };
}

export function getBoundaryNewlineNeeds(
  sourceCode: TSourceCode,
  leftToken: TTokenWithLocAndRange,
  rightToken: TTokenWithLocAndRange,
): {
  needsAfter: boolean;
  needsBefore: boolean;
} | undefined {
  const nextToken = sourceCode.getTokenAfter(
    leftToken,
    { includeComments: false },
  );
  const previousToken = sourceCode.getTokenBefore(rightToken, {
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
    .getTokensBetween(leftToken, rightToken, { includeComments: true })
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

