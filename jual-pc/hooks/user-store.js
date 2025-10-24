import AsyncStorage from '@react-native-async-storage/async-storage';

// key global biar konsisten
const USER_KEY = 'user_data';

// 🧩 Simpan data user setelah register
export const saveUserData = async (userData) => {
  try {
    const jsonValue = JSON.stringify(userData);
    await AsyncStorage.setItem(USER_KEY, jsonValue);
    console.log('✅ Data user berhasil disimpan');
  } catch (error) {
    console.error('❌ Gagal menyimpan data user:', error);
  }
};

// 🔍 Ambil data user (misalnya buat auto-login)
export const getUserData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem(USER_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error('❌ Gagal mengambil data user:', error);
    return null;
  }
};

// 🗑️ Hapus data user (buat logout)
export const removeUserData = async () => {
  try {
    await AsyncStorage.removeItem(USER_KEY);
    console.log('✅ Data user dihapus');
  } catch (error) {
    console.error('❌ Gagal menghapus data user:', error);
  }
};
