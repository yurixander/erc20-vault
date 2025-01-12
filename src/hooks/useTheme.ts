import { useCallback, useEffect, useState } from "react";

export const THEME_KEY = "theme_mode";

export enum ThemeMode {
  Dark = "dark",
  Light = "light",
}

const savedTheme = localStorage.getItem(THEME_KEY);

const useTheme = () => {
  const [theme, setTheme] = useState(savedTheme ?? ThemeMode.Light);

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === ThemeMode.Dark ? ThemeMode.Light : ThemeMode.Dark);
  }, [theme]);

  return { toggleTheme, theme };
};

export default useTheme;
