import { useEffect } from 'react';
import { useScrollToTop } from './hooks/useScrollToTop';
import { AppRoutes } from './routes';
import { useColorScheme } from '@mui/material/styles';

export function App() {
  useScrollToTop();
  const { setMode, mode } = useColorScheme();

  useEffect(() => {
    setMode('light');
  }, [setMode]);

  return (
    <div>
      <AppRoutes />
    </div>
  );
}
