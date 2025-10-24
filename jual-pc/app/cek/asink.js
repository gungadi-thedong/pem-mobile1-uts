import React from 'react';
import { View, Text, Button, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Fungsi untuk ngecek semua data di AsyncStorage
export const checkAllAsyncData = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    console.log('🔑 Semua keys ditemukan:', keys);

    if (keys.length === 0) {
      console.log('📭 Tidak ada data di AsyncStorage.');
      return [];
    }

    const result = await AsyncStorage.multiGet(keys);
    console.log('📦 Semua data di AsyncStorage:');
    result.forEach(([key, value]) => {
      console.log(`→ ${key}:`, value);
    });
    return result;
  } catch (error) {
    console.error('❌ Gagal membaca data AsyncStorage:', error);
    return [];
  }
};

// Default page component for /cek/asink
export default function AsinkScreen() {
  const [data, setData] = React.useState([]);

  const handleCheck = async () => {
    const result = await checkAllAsyncData();
    setData(result);
  };

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12 }}>
        Cek Semua Data di AsyncStorage
      </Text>
      <Button title="Cek Data" onPress={handleCheck} />
      {data.length > 0 && (
        <View style={{ marginTop: 16 }}>
          {data.map(([key, value]) => (
            <View key={key} style={{ marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>{key}:</Text>
              <Text selectable>{value}</Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}