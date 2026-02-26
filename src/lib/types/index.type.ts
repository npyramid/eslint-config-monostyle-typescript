import type { Rule, SourceCode } from 'eslint';

export type TLocatable = Pick<Rule.Node, 'loc'>;

export type TRuleNode = Rule.Node;
export type TSourceCode = SourceCode;
export type TToken = ReturnType<SourceCode['getTokens']>[number];
