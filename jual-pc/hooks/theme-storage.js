import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_KEY = 'app_theme';

export const saveTheme = async (theme) => {
  try {
    await AsyncStorage.setItem(THEME_KEY, theme);
    console.log('Tema disimpan:', theme);
  } catch (error) {
    console.error('Gagal menyimpan tema:', error);
  }
};

export const getTheme = async () => {
  try {
    const theme = await AsyncStorage.getItem(THEME_KEY);
    return theme || 'light'; // default light
  } catch (error) {
    console.error('Gagal mengambil tema:', error);
    return 'light';
  }
};
