import { type XoConfigItem } from 'xo';

const baseXoConfig: XoConfigItem = {
  space: true,
  react: false,
  semicolon: true,
};

export const xoSettingsPrettier: XoConfigItem[] = [
  {
    prettier: 'compat',
    ...baseXoConfig,
  },
];

export const xoSettings: XoConfigItem[] = [
  {
    ...baseXoConfig,
  },
];
