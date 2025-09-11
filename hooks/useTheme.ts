import { useState, useEffect, createContext, useContext, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Colors from '@/constants/Colors';

const THEME_KEY = 'app_theme';

export type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  colors: typeof Colors.light;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export function useThemeState() {
  const isMounted = useRef(true);
  const [theme, setThemeState] = useState<Theme>('light');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        if (isMounted.current) {
          setThemeState(savedTheme);
        }
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      if (isMounted.current) {
        setThemeState(newTheme);
      }
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  const colors = theme === 'dark' ? Colors.dark : Colors.light;
  const isDark = theme === 'dark';

  return {
    theme,
    colors,
    toggleTheme,
    setTheme,
    isDark,
    isLoading,
  };
}