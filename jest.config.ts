import { readFileSync } from 'node:fs';
import { join as joinPath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Config } from 'jest';

const dirname = fileURLToPath(new URL('.', import.meta.url));

type TSwcJestConfig = Record<string, unknown> & {
  swcrc?: boolean;
};

const loadSwcJestConfig = (): TSwcJestConfig => {
  const pathToFile = joinPath(dirname, '.spec.swcrc');
  const value = readFileSync(pathToFile, 'utf8');

  return {
    ...(JSON.parse(value) as TSwcJestConfig),
    swcrc: false,
  };
};

const config = {
  displayName: 'eslint-flat-monostyle',
  testEnvironment: 'node',
  testPathIgnorePatterns: ['<rootDir>/dist/'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', loadSwcJestConfig()],
  },
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  moduleFileExtensions: ['ts', 'js', 'json'],
} satisfies Config;

export default config;
