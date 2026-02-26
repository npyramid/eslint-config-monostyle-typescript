import { readFileSync } from 'node:fs';
import { join as joinPath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { type Config } from 'jest';

const dirname = fileURLToPath(new URL('.', import.meta.url));

type TSwcJestConfig = Record<string, unknown> & {
  swcrc?: boolean;
};

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
);

const loadSwcJestConfig = (): TSwcJestConfig => {
  const pathToFile = joinPath(dirname, '.spec.swcrc');
  const value = readFileSync(pathToFile, 'utf8');
  const parsedConfig: unknown = JSON.parse(value);

  const config: TSwcJestConfig = { swcrc: false };

  if (isRecord(parsedConfig)) {
    for (const [key, parsedValue] of Object.entries(parsedConfig)) {
      config[key] = parsedValue;
    }
  }

  return config;
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
