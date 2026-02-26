import type { Rule } from 'eslint';

type TRuleOptions = {
  projectSlug?: string;
  urlPattern?: string;
  regexp?: string;
};

const TRACKED_KEYWORDS = [
  'TODO',
  'FIXME',
  'WARNING',
  'WARN',
  'BUG',
  'HACK',
  'XXX',
];
const PROTOCOL_URL_REGEXP = /\b[a-z][a-z\d+.-]*:\/\/\S+/gi;

function escapeRegExp(value: string): string {
  return value.replaceAll(/[.*+?^${}()|[\]\\]/g, String.raw`\$&`);
}

function toTaskMatchers(options: TRuleOptions): RegExp[] {
  const matchers: RegExp[] = [];

  if (options.projectSlug) {
    matchers.push(new RegExp(String.raw`\b${escapeRegExp(options.projectSlug)}-\d+\b`, 'i'));
  }

  if (options.urlPattern) {
    matchers.push(new RegExp(escapeRegExp(options.urlPattern), 'i'));
  }

  if (options.regexp) {
    try {
      matchers.push(new RegExp(options.regexp));
    } catch {
      return [];
    }
  }

  return matchers;
}

function hasTaskReferenceInProtocolUrl(comment: string, matchers: RegExp[]): boolean {
  const urls = comment.match(PROTOCOL_URL_REGEXP);

  if (!urls || urls.length === 0) {
    return false;
  }

  return urls.some(url => matchers.some(matcher => {
    matcher.lastIndex = 0;
    return matcher.test(url);
  }));
}

function getKeyword(comment: string): string | undefined {
  const matchedKeyword = TRACKED_KEYWORDS.find(keyword =>
    new RegExp(String.raw`\b${keyword}\b`, 'i').test(comment));

  return matchedKeyword;
}

export const todoTaskReferenceRule: Rule.RuleModule = {
  meta: {
    type: 'problem',
    schema: [
      {
        type: 'object',
        properties: {
          projectSlug: { type: 'string', minLength: 1 },
          urlPattern: { type: 'string', minLength: 1 },
          regexp: { type: 'string', minLength: 1 },
        },
        additionalProperties: false,
        anyOf: [
          { required: ['projectSlug'] },
          { required: ['urlPattern'] },
          { required: ['regexp'] },
        ],
      },
    ],
    messages: {
      missingTaskReference:
        'Comment with {{keyword}} must include a protocol URL with task reference ' +
        'that matches configured rule option.',
    },
  },

  create(context) {
    const rawOptions: unknown = context.options[0];
    const options =
      typeof rawOptions === 'object' && rawOptions !== null ?
        rawOptions as TRuleOptions :
        {};
    const matchers = toTaskMatchers(options);

    if (matchers.length === 0) {
      return {};
    }

    return {
      Program() {
        const { sourceCode } = context;

        for (const comment of sourceCode.getAllComments()) {
          const keyword = getKeyword(comment.value);

          if (!keyword) {
            continue;
          }

          const hasTaskReference = hasTaskReferenceInProtocolUrl(comment.value, matchers);

          if (hasTaskReference) {
            continue;
          }

          if (!comment.loc) {
            continue;
          }

          context.report({
            loc: comment.loc,
            messageId: 'missingTaskReference',
            data: { keyword },
          });
        }
      },
    };
  },
};
