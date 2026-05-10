import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const ThemeContext = createContext(null);

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'system';
  return localStorage.getItem('traveloop-theme') || 'system';
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(getInitialTheme);
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark');
    root.classList.add(resolvedTheme === 'light' ? 'theme-light' : 'theme-dark');
  }, [resolvedTheme]);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = () => {
      if ((localStorage.getItem('traveloop-theme') || 'system') === 'system') {
        setTheme('system');
      }
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const updateTheme = (nextTheme) => {
    setTheme(nextTheme);
    localStorage.setItem('traveloop-theme', nextTheme);
  };

  const value = useMemo(() => ({
    theme,
    resolvedTheme,
    setTheme: updateTheme,
  }), [theme, resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
