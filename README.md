# eslint-config-monostyle-typescript

Opinionated ESLint flat-config presets and custom style rules for TypeScript backend projects and nx monorepos.

## Features

- Including best practices from xo linter and SonarJS plugin
- Added and isolated `@stylistic` rules via `stylisticRules`
- Prebuilt `monostylePresetTs` and optional `monostylePresetNxTs`
- Prebuilt `monostylePresetTsPrettier` and optional `monostylePresetNxTsPrettier`
- Low-level exports: `lintingRules`, `lintingRulesPrettier`, `nxRules`, `stylisticRules`
- ESM package with TypeScript declarations

## Install

```bash
npm i -D eslint-config-monostyle-typescript eslint
```

or

```bash
pnpm add -D eslint-config-monostyle-typescript eslint
```

## Quick start

```ts
// eslint.config.ts
import { monostylePresetTs } from 'eslint-config-monostyle-typescript';

export default monostylePresetTs;
```

## Quick start (Prettier-compatible)

```ts
// eslint.config.ts
import { monostylePresetTsPrettier } from 'eslint-config-monostyle-typescript';

export default monostylePresetTsPrettier;
```

This preset uses XO in `prettier: 'compat'` mode and applies `eslint-config-prettier/flat` at the end,
so formatting conflicts between ESLint/XO and Prettier are disabled.

## Nx-oriented setup

```ts
// eslint.config.ts
import { monostylePresetNxTs } from 'eslint-config-monostyle-typescript';

export default monostylePresetNxTs;
```

## Nx-oriented setup (Prettier-compatible)

```ts
// eslint.config.ts
import { monostylePresetNxTsPrettier } from 'eslint-config-monostyle-typescript';

export default monostylePresetNxTsPrettier;
```

## Fine-grained setup

```ts
// eslint.config.ts
import { lintingRules, lintingRulesPrettier, nxRules } from 'eslint-config-monostyle-typescript';

export default [...lintingRulesPrettier, ...nxRules];
```

## Included custom rules

- `monostyle/named-specifiers-newline`
- `monostyle/todo-task-reference`

Array/object multiline formatting is now handled by `@stylistic` rules in `stylisticRules`.

### `monostyle/todo-task-reference`

Checks `TODO` / `FIXME` / `WARNING` / `WARN` / `BUG` / `HACK` / `XXX` comments.
Such comments are invalid if they do not contain a task reference.

Configuration accepts one (or several) of:

- `projectSlug` — validates protocol URL with ticket keys like `https://tracker/browse/XXX-1444`
- `urlPattern` — validates protocol URL contains the given fragment (for example `issues/`)
- `regexp` — custom regular expression string matched against protocol URLs

For all options, protocol is mandatory (`https://...`, `http://...`, etc.).

This rule is already enabled by `lintingRules`, `lintingRulesPrettier`, `monostylePresetTs`,
`monostylePresetTsPrettier`, `monostylePresetNxTs`, and `monostylePresetNxTsPrettier`.

## Development

```bash
npm install
npm run format:check
npm test
npm run build
```

## Publish checklist

- bump version in `package.json`
- run `npm test`
- run `npm run build`
- publish with `npm publish --access public`

## License

MIT
