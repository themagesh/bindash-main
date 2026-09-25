'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  darkMode: false,
  setDarkMode: () => {},
  toggleDarkMode: () => {},
});

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Load persisted preference on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('sweety-dark-mode');
      if (stored !== null) {
        setDarkMode(stored === 'true');
      }
    } catch {
      // ignore storage access errors
    }
  }, []);

  // Persist whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('sweety-dark-mode', String(darkMode));
    } catch {
      // ignore storage access errors
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
