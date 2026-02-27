# eslint-config-monostyle-typescript

Opinionated ESLint flat-config presets and custom style rules for TypeScript backend projects and nx monorepos.

## Features

- Including best practices from xo linter and SonarJS plugin
- Added and isolated `@stylistic` rules via `stylisticRules`
- Prebuilt `monostylePresetTs` and optional `monostylePresetNxTs`
- Low-level exports: `lintingRules`, `nxRules`, `stylisticRules`
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

## Nx-oriented setup

```ts
// eslint.config.ts
import { monostylePresetNxTs } from 'eslint-config-monostyle-typescript';

export default monostylePresetNxTs;
```

## Fine-grained setup

```ts
// eslint.config.ts
import {
 lintingRules,
 nxRules,
} from 'eslint-config-monostyle-typescript';

export default [
 ...lintingRules,
 ...nxRules,
];
```

## Included custom rules

- `monostyle/named-specifiers-newline`
- `monostyle/multiline-array-brackets`
- `monostyle/object-pattern-newline`
- `monostyle/todo-task-reference`

### `monostyle/todo-task-reference`

Checks `TODO` / `FIXME` / `WARNING` / `WARN` / `BUG` / `HACK` / `XXX` comments.
Such comments are invalid if they do not contain a task reference.

Configuration accepts one (or several) of:

- `projectSlug` — validates protocol URL with ticket keys like `https://tracker/browse/XXX-1444`
- `urlPattern` — validates protocol URL contains the given fragment (for example `issues/`)
- `regexp` — custom regular expression string matched against protocol URLs

For all options, protocol is mandatory (`https://...`, `http://...`, etc.).

These rules are already enabled by `lintingRules`, `monostylePresetTs`, and `monostylePresetNxTs`.

## Development

```bash
npm install
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
