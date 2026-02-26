import { type Linter } from 'eslint';

export const nxRules: Linter.Config[] = [
  {
    ignores: [
      '**/dist',
      '**/.nx/**',
      '**/out-tsc/**',
      '**/tmp/**',
      '**/jest.config.*',
    ],
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.js',
      '**/*.jsx',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: false,
          allow: [
            String.raw`^#src/`,
            String.raw`^#libs/`,
            String.raw`^.*/eslint(\.base)?\.config\.[cm]?[jt]s$`,
          ],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: [
                '*',
              ],
            },
          ],
        },
      ],
      'import-x/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          pathGroups: [
            {
              pattern: '#src/**',
              group: 'internal',
              position: 'before',
            },
            {
              pattern: '#libs/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: [
            'builtin',
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc' },
          warnOnUnassignedImports: true,
          distinctGroup: true,
          sortTypesGroup: false,
          named: false,
        },
      ],
      'import-x/no-extraneous-dependencies': [
        'error',
        { packageDir: ['.'] },
      ],
      'n/no-extraneous-import': 'off',
      'n/no-extraneous-require': 'off',
    },
  },
  {
    files: [
      'apps/*/src/**/*.ts',
      'apps/*/src/**/*.tsx',
      'apps/*/src/**/*.js',
      'apps/*/src/**/*.jsx',
    ],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allowCircularSelfDependency: true,
          allow: [
            String.raw`^#src/`,
            String.raw`^#libs/`,
            String.raw`^.*/eslint(\.base)?\.config\.[cm]?[jt]s$`,
          ],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: [
                '*',
              ],
            },
          ],
        },
      ],
    },
  },
];
