import { type ReactNode, useEffect, useState } from 'react';

import { ThemeContext } from './theme-context';

import { ThemeScheme } from '@/constants';

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<ThemeScheme>(ThemeScheme.LIGHT);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === ThemeScheme.LIGHT ? ThemeScheme.DARK : ThemeScheme.LIGHT
    );
  };

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
};
