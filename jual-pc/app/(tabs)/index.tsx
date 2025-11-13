import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks/themecontext.js';
// import { getUserData } from '../../hooks/user-store.js'; // TIDAK DIPAKAI di sini
import { useRouter } from 'expo-router';
import { supabase } from "../../lib/supabase.js";

export default function LoginScreen() {
  const { colors, theme } = useTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

const handleLogin = async () => {
  if (!username || !password) {
    alert("Isi username & password");
    return;
  }

  // --- MENGHILANGKAN LOGIKA SUPABASE AUTH ---
  // 1) Cek langsung ke tabel 'user' untuk mencari kecocokan username dan password
  const { data: userRow, error: selectError } = await supabase
    .from("user")
    .select("*")
    // Memastikan username DAN password cocok
    .eq("username", username)
    .eq("password", password) // Perhatian: Ini mencari plaintext password
    .single();

  if (selectError && selectError.code === "PGRST116") {
    // PGRST116 berarti tidak ada baris yang ditemukan (username/password salah)
    alert("❌ Username atau Password salah.");
    return;
  }
  
  if (selectError) {
    // Error lain (misalnya masalah koneksi atau RLS)
    console.log(selectError);
    alert("Gagal ambil data dari DB: " + selectError.message);
    return;
  }

  // Jika berhasil menemukan baris (userRow tidak null)
  alert("✅ Login berhasil\nSelamat datang " + userRow.username);
  router.replace('../utama/home');
  
  // Jika Anda ingin navigasi setelah login
  // router.replace('(tabs)/utama'); // Contoh navigasi
};


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Silahkan Login</Text>

        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={[styles.input, {
            backgroundColor: colors.inputBg,
            color: colors.text,
            borderColor: colors.border,
          }]}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
        />

        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            style={[styles.input, {
              flex: 1,
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.border,
            }]}
            placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
          />
          <Pressable
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeButton}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={{ fontSize: 20 }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </Pressable>
        </View>

        <Pressable style={[styles.button, { backgroundColor: colors.button }]} onPress={handleLogin}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Login</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '85%',
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  eyeButton: {
    marginLeft: 8,
    padding: 4,
  },
});