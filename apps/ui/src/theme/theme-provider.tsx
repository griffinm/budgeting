import type {} from '@mui/lab/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/material/themeCssVarsAugmentation';

import CssBaseline from '@mui/material/CssBaseline';
// import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'

// import { useTranslate } from 'src/locales';

import { createTheme } from './create-theme';

// ----------------------------------------------------------------------

type Props = {
  children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
  const theme = createTheme();

  return (
    <MuiThemeProvider
      theme={theme}
      modeStorageKey={'theme-mode'}
    >
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
