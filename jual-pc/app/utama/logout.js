import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function LogoutScreen() {
    const router = useRouter();

    useEffect(() => {
        // 1. Tunda sedikit agar user sempat melihat loading/status
        const timer = setTimeout(() => {
            // 2. Lakukan logika "logout" (redirect ke rute utama, yaitu '/')
            router.replace('/');
            alert("Anda telah berhasil logout.")
        }, 100); // Penundaan singkat

        return () => clearTimeout(timer); // Membersihkan timer saat komponen di-unmount
    }, []);

    // Tampilan sederhana saat proses logout/redirect
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Logging out...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f0f0f0',
    },
    text: {
        fontSize: 18,
        color: '#333',
    },
});