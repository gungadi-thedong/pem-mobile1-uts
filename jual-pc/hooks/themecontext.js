import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';
import { saveTheme, getTheme } from './theme-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const systemScheme = useColorScheme(); // default dari sistem
  const [theme, setTheme] = useState(systemScheme || 'light');

  // Ambil dari async storage biar bisa simpan mode pilihan user
  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem('theme');
      if (saved) setTheme(saved);
    })();
  }, []);

  // Simpan ke storage setiap kali berubah
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    await AsyncStorage.setItem('theme', newTheme);
  };

  const colors = {
    light: {
      background: '#F7F7F8',
      text: '#111',
      inputBg: '#fff',
      border: '#ddd',
      button: '#007AFF',
      buttonText: '#fff',
    },
    dark: {
      background: '#000',
      text: '#fff',
      inputBg: '#222',
      border: '#444',
      button: '#1E90FF',
      buttonText: '#fff',
    },
  };

  return (
    <ThemeContext.Provider value={{ theme, colors: colors[theme], toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
