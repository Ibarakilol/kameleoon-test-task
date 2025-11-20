import { createContext, useContext } from 'react';

import { ThemeScheme } from '@/constants';

interface ThemeContextProps {
  theme: ThemeScheme;
  toggleTheme: () => void;
}

const initialThemeContextProps = {
  theme: ThemeScheme.LIGHT,
  toggleTheme: () => {},
};

export const ThemeContext = createContext<ThemeContextProps>(initialThemeContextProps);

export const useTheme = () => useContext(ThemeContext);
