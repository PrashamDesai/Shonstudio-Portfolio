import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "shonstudio-theme";

const ThemeContext = createContext(null);

const resolveSystemTheme = () => {
  if (typeof window === "undefined" || !window.matchMedia) {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getStoredTheme = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  return storedTheme === "dark" || storedTheme === "light" ? storedTheme : null;
};

export const ThemeProvider = ({ children }) => {
  const [storedTheme, setStoredTheme] = useState(() => getStoredTheme());
  const [theme, setTheme] = useState(() => getStoredTheme() || resolveSystemTheme());

  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute("data-theme", theme);
    root.style.colorScheme = theme;
  }, [theme]);

  useEffect(() => {
    if (storedTheme) {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (event) => {
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [storedTheme]);

  const applyTheme = useCallback((value, source = "user") => {
    setTheme(value);

    if (source === "user") {
      window.localStorage.setItem(THEME_STORAGE_KEY, value);
      setStoredTheme(value);
      return;
    }

    setStoredTheme(null);
  }, []);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark", "user");
  }, [applyTheme, theme]);

  const clearThemePreference = useCallback(() => {
    window.localStorage.removeItem(THEME_STORAGE_KEY);
    const nextTheme = resolveSystemTheme();
    setStoredTheme(null);
    setTheme(nextTheme);
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      isSystemTheme: storedTheme === null,
      toggleTheme,
      setTheme: (nextTheme) => applyTheme(nextTheme, "user"),
      clearThemePreference,
    }),
    [applyTheme, clearThemePreference, storedTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
};
