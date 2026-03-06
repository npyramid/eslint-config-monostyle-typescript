import { RuleTester } from 'eslint';
import { monostyleEslintPlugin } from './lib/plugin/index.js';

declare const it: (name: string, test: () => void) => void;
declare const expect: (value: unknown) => {
  toBe: (expected: unknown) => void;
};
const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
});
ruleTester.run(
  'named-specifiers-newline',
  monostyleEslintPlugin.rules['named-specifiers-newline'],
  {
    valid: [
      {
        code: "import { a, b, c } from 'mod';",
      },
      {
        code: "import {\n  a,\n  b,\n  c,\n  d\n} from 'mod';",
      },
      {
        code: [
          'const a = 1;',
          'const b = 2;',
          'const c = 3;',
          'const d = 4;',
          '',
          'export {',
          '  a,',
          '  b,',
          '  c,',
          '  d',
          '};',
        ].join('\n'),
      },
    ],
    invalid: [
      {
        code: "import { a, b, c, d } from 'mod';",
        output: "import {\n  a,\n  b,\n  c,\n  d\n} from 'mod';",
        errors: [{ messageId: 'multiline' }],
      },
      {
        code: [
          'const a = 1;',
          'const b = 2;',
          'const c = 3;',
          'const d = 4;',
          '',
          'export {',
          '  a, b,',
          '  c,',
          '  d',
          '};',
        ].join('\n'),
        output: [
          'const a = 1;',
          'const b = 2;',
          'const c = 3;',
          'const d = 4;',
          '',
          'export {',
          '  a,',
          '  b,',
          '  c,',
          '  d',
          '};',
        ].join('\n'),
        errors: [{ messageId: 'multiline' }],
      },
      {
        code: "import {\n  a, b,\n  // keep\n  c,\n  d\n} from 'mod';",
        output: null,
        errors: [{ messageId: 'multiline' }],
      },
    ],
  },
);

ruleTester.run('todo-task-reference', monostyleEslintPlugin.rules['todo-task-reference'], {
  valid: [
    {
      code: '// TODO: sync with backend in https://tracker.local/browse/XXX-1444\nconst value = 1;',
      options: [{ projectSlug: 'XXX' }],
    },
    {
      code: '// WARNING: details in https://tracker.local/issues/4444\nconst value = 1;',
      options: [{ urlPattern: 'issues/' }],
    },
    {
      code: '/* FIXME: task in https://tracker.local/task/999 */\nconst value = 1;',
      options: [{ regexp: String.raw`task/\d+` }],
    },
    {
      code: '// NOTE: this comment is not tracked\nconst value = 1;',
      options: [{ projectSlug: 'XXX' }],
    },
  ],
  invalid: [
    {
      code: '// TODO: refactor\nconst value = 1;',
      options: [{ projectSlug: 'XXX' }],
      errors: [{ messageId: 'missingTaskReference' }],
    },
    {
      code: '// TODO: sync with backend in XXX-1444\nconst value = 1;',
      options: [{ projectSlug: 'XXX' }],
      errors: [{ messageId: 'missingTaskReference' }],
    },
    {
      code: '// WARNING: still pending\nconst value = 1;',
      options: [{ urlPattern: 'issues/' }],
      errors: [{ messageId: 'missingTaskReference' }],
    },
    {
      code: '/* FIXME: task in tracker.local/task/999 */\nconst value = 1;',
      options: [{ regexp: String.raw`task/\d+` }],
      errors: [{ messageId: 'missingTaskReference' }],
    },
  ],
});

it('runs lint suites', () => {
  expect(true).toBe(true);
});
