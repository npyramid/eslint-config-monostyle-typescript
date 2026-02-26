# eslint-flat-monostyle

Opinionated ESLint flat-config presets and custom style rules for TypeScript monorepos.

## Features

- Flat config presets ready to spread into `eslint.config.*`
- Custom plugin rules for multiline imports/exports and bracket formatting
- Prebuilt `styleRules` preset and optional `nxRules` preset
- ESM package with TypeScript declarations

## Install

```bash
npm i -D eslint-flat-monostyle eslint
```

or

```bash
pnpm add -D eslint-flat-monostyle eslint
```

## Quick start

```ts
// eslint.config.ts
import { styleRules } from 'eslint-flat-monostyle';

export default [
	...styleRules,
];
```

## Nx-oriented setup

```ts
// eslint.config.ts
import { nxRules, styleRules } from 'eslint-flat-monostyle';

export default [
	...nxRules,
	...styleRules,
];
```

## Included custom rules

- `monostyle/named-specifiers-newline`
- `monostyle/multiline-array-brackets`
- `monostyle/object-pattern-newline`

These rules are already enabled by `styleRules`.

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
