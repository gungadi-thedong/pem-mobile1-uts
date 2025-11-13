import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, Pressable, TouchableOpacity } from 'react-native';
// import { saveUserData } from '../../hooks/user-store.js'; // TIDAK DIPAKAI di sini
import { useTheme } from '../../hooks/themecontext.js';
import { supabase } from "../../lib/supabase.js";

export default function RegisterScreen() {
  const { colors, theme } = useTheme();
  
  // Tambahkan state untuk email
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // Pastikan semua field terisi
    if (!username || !password || !email) {
      alert("Isi semua field (Username, Email, dan Password) dulu");
      return;
    }

    // --- MENGHILANGKAN LOGIKA SUPABASE AUTH (signUp) ---
    // Kita langsung insert data ke tabel 'user'
    
    // Simpan ke tabel user (plaintext sesuai permintaan)
    const { error: insertError } = await supabase.from("user").insert([
      {
        // id_user akan digenerate otomatis oleh DB
        username: username,
        password: password,
        email: email,
      },
    ]);

    if (insertError) {
      console.log(insertError);
      alert("Gagal insert ke tabel user: " + insertError.message);
      return;
    }

    alert("Registrasi berhasil!");
    // Opsional: Clear form setelah berhasil
    setUsername('');
    setEmail('');
    setPassword('');
  };


  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.cardBg, borderColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.text }]}>Daftarkan Akun mu!</Text>

        {/* --- INPUT USERNAME --- */}
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

        {/* --- INPUT EMAIL BARU --- */}
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address" // Hint untuk keyboard
          autoCapitalize="none"
          style={[styles.input, {
            backgroundColor: colors.inputBg,
            color: colors.text,
            borderColor: colors.border,
          }]}
          placeholderTextColor={theme === 'dark' ? '#aaa' : '#666'}
        />

        {/* --- INPUT PASSWORD --- */}
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
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeButton}
            accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          >
            <Text style={{ fontSize: 20 }}>
              {showPassword ? '🙈' : '👁️'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* --- BUTTON REGISTER --- */}
        <Pressable style={[styles.button, { backgroundColor: colors.button }]} onPress={handleRegister}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Register</Text>
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
  // Pastikan style input ini mengakomodasi penggunaan flex: 1 di dalam passwordWrapper
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
    // Untuk menyelaraskan input dengan tombol mata, hilangkan marginVertical dari input di dalam wrapper
    marginVertical: 10, 
  },
  eyeButton: {
    padding: 10, // Tambahkan padding untuk area tekan yang lebih besar
  },
});