import { useState, useCallback } from 'react';

import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { NavSectionVertical } from './nav-section';

import { NAV_ITEMS } from './data';

// ----------------------------------------------------------------------

const config = {
  gap: 4,
  icon: 24,
  radius: 8,
  subItemHeight: 36,
  rootItemHeight: 44,
  currentRole: 'admin',
  hiddenSubheader: false,
  padding: '4px 8px 4px 12px',
};

// ----------------------------------------------------------------------

export function Nav() {
  return (
    <Stack spacing={5} direction="row" flexWrap="wrap" justifyContent="center" sx={{ height: '100%' }}>
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          width: 1,
          maxWidth: 320,
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <NavSectionVertical
          data={NAV_ITEMS}
          sx={{ flex: '1 1 auto' }}
          cssVars={{
            '--nav-item-gap': `${config.gap}px`,
          }}
          slotProps={{
            currentRole: config.currentRole,
            rootItem: {
              sx: {
                padding: config.padding,
                borderRadius: `${config.radius}px`,
                minHeight: config.rootItemHeight,
              },
              icon: {
                width: config.icon,
                height: config.icon,
                ...(!config.icon && { display: 'none' }),
              },
              texts: {},
              title: {},
              caption: {},
              info: {},
              arrow: {},
            },
            subItem: {
              sx: {
                padding: config.padding,
                borderRadius: `${config.radius}px`,
                minHeight: config.subItemHeight,
              },
              icon: {
                width: config.icon,
                height: config.icon,
                ...(!config.icon && { display: 'none' }),
              },
              texts: {},
              title: {},
              caption: {},
              info: {},
              arrow: {},
            },
            subheader: { ...(config.hiddenSubheader && { display: 'none' }) },
          }}
        />
      </Paper>
    </Stack>
  );
}
