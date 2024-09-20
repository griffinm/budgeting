import { defaultSettings } from 'src/components/settings';

// ----------------------------------------------------------------------
const defaultFont = 'Public Sans Variable';
const defaultSettings = {
  colorScheme: 'light',
  direction: 'ltr',
  contrast: 'default',
  navLayout: 'vertical',
  primaryColor: 'default',
  navColor: 'integrate',
  compactLayout: true,
  fontFamily: defaultFont,
} as const;

export const schemeConfig = {
  modeStorageKey: 'theme-mode',
  defaultMode: defaultSettings.colorScheme,
};
