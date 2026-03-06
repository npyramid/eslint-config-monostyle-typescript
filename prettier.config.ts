import { type Config } from 'prettier';
import prettierConfig from './src/lib/ruleset/prettier-config.ts';

const config: Config = {
  ...prettierConfig,
  overrides: [
    {
      files: ['**/*.ts', '**/*.json'],
      excludeFiles: ['**/*lock*'],
    },
  ],
};

export default config;
