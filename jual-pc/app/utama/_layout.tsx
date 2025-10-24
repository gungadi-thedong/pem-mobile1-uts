// app/utama/_layout.tsx
// This layout wraps every page in the 'utama' folder (home.js, detail.js, tambah.js, etc).
// You can add a header, footer, or any global UI for all 'utama' pages here.

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router'; // 👈 penting biar semua page dalam folder ini bisa tampil
import { useTheme } from '../../hooks/themecontext.js'; // Import ThemeContext untuk akses theme dan toggle
import { useRouter } from 'expo-router';

// The 'children' prop is the current page being rendered (e.g., home, detail, tambah).
export default function UtamaLayout() {
  // Ambil nilai theme dan fungsi toggle dari context
  const { theme, toggleTheme } = useTheme();

  // Tentukan warna berdasarkan theme aktif
  const isDark = theme === 'dark';
  const backgroundColor = isDark ? '#000' : '#fff';
  const headerColor = isDark ? '#1E1E1E' : '#007AFF';
  const footerColor = isDark ? '#111' : '#eee';
  const textColor = isDark ? '#fff' : '#333';

  return (
    // This View wraps every utama page.
    <View style={[styles.container, { backgroundColor }]}>
      {/* Example: Header for all utama pages */}
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <Text style={[styles.headerText, { color: '#fff' }]}>PC People</Text>

        {/* Tambahan: tombol toggle theme */}
        <TouchableOpacity onPress={toggleTheme} style={styles.toggleButton}>
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>
            {isDark ? '☀️ Light' : '🌙 Dark'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 👇 Stack ini bakal render file home.js, tambah.js, detail.js otomatis */}
      <Stack
  screenOptions={{
    headerShown: false, // hide header default
    animation: 'none', // hindari animasi reload saat pindah halaman
    freezeOnBlur: true, // biar state halaman lama tetap tersimpan
    contentStyle: { backgroundColor },
  }}
>
  {/* Optional: bisa tambahin definisi screen manual kalau mau kontrol spesifik */}
  <Stack.Screen name="home" options={{ title: 'Home', freezeOnBlur: true }} />
  <Stack.Screen name="detail" options={{ title: 'Detail', freezeOnBlur: true }} />
  <Stack.Screen name="tambah" options={{ title: 'Tambah Produk', freezeOnBlur: true }} />
</Stack>


      {/* Example: Footer for all utama pages */}
      <View style={[styles.footer, { backgroundColor: footerColor }]}>
        <Text style={[styles.footerText, { color: textColor }]}>
          copyright © 2025 PC People by lordt adi
         </Text>
      </View>
    </View>
  );
}

// Styles for the layout wrapper, header, and footer
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Global background for utama pages
  },
  header: {
    padding: 16,
    backgroundColor: '#007AFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  footer: {
    padding: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
  },
  footerText: {
    color: '#333',
    fontSize: 14,
  },
  toggleButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
