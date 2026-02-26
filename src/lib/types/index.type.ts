import type { Rule } from 'eslint';

export type TLocatable = {
  loc?: {
    start: {
      line: number;
    };
    end: {
      line: number;
    };
  };
};

export type TToken = {
  value: string;
  type: string;
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

export type TRuleNode = Rule.Node & TLocatable;

export type TSourceCode = {
  lines: string[];
  getTokens(
    node: never,
    options: {
      includeComments: boolean;
    }
  ): TToken[];
  getTokenAfter(
    token: never,
    options: {
      includeComments: boolean;
    }
  ): TToken | undefined;
  getTokenBefore(
    token: never,
    options: {
      includeComments: boolean;
    }
  ): TToken | undefined;
  getTokensBetween(
    leftToken: never,
    rightToken: never,
    options: {
      includeComments: boolean;
    }
  ): TToken[];
  getText(node: never): string;
};
