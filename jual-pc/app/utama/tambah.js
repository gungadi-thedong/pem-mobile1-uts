import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform, ScrollView, ViewBase } from 'react-native';
import { useRouter } from 'expo-router';
import { useProductStore } from '../../hooks/product-store';

export default function TambahScreen() {

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
    const [rawPrice, setRawPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
            const addProduct = useProductStore((state) => state.addProduct);
  const router = useRouter();

    // helper to format digits as Indonesian Rupiah (no decimals)
    const formatRupiah = (digits) => {
        if (!digits) return '';
        // remove leading zeros
        const num = parseInt(digits, 10) || 0;
        return 'Rp ' + num.toLocaleString('id-ID');
    }

  const validation = () => {
    if (!name.trim()) {
        throw new Error('Name are required!');
    }
    if (!category.trim()) {
        throw new Error('Category are required!');
    }
    if (!rawPrice.trim()) {
        throw new Error('Price are required!');
    }
    if (isNaN(rawPrice) || parseInt(rawPrice, 10) <= 0) {
        throw new Error('Price must be a positive number!');
    }
    if (!quantity.trim()) {
        throw new Error('Quantity are required!');
    }
    if (isNaN(quantity) || parseInt(quantity, 10) <= 0) {
        throw new Error('Quantity must be a positive number!');
    }

    return true;
  }

    const handleSubmit = () => {
      try {
          if (validation()) {
              addProduct({
                  name,
                  price: parseInt(rawPrice),
                  category,
                  quantity: parseInt(quantity),
              });
              router.back();
          }
      } catch (error) {
          alert(error.message);
      }
    if (Platform.OS === 'web') {
        alert('Product added successfully!');
        router.back();
    }
    else{
        const alert = require('react-native').Alert;
        alert.alert('Success', 'Product added successfully!', [
            { text: 'OK', onPress: () => router.back() }
        ]);
    }
}

  return (
    <ScrollView style={styles.container}>
        <View style={styles.form}>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder='Masukkan nama produk'
                    placeholderTextColor={'#999'}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Price</Text>
                <TextInput
                    style={styles.input}
                    value={price}
                    onChangeText={(text) => {
                        // keep only digits for storage, format for display
                        const digits = text.replace(/[^0-9]/g, '');
                        setRawPrice(digits);
                        setPrice(formatRupiah(digits));
                    }}
                    placeholder='Masukkan harga produk misal 12500000'
                    placeholderTextColor={'#999'}
                    keyboardType='numeric'
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Category</Text>
                <TextInput
                    style={styles.input}
                    value={category}
                    onChangeText={setCategory}
                    placeholder='Masukkan kategori produk'
                    placeholderTextColor={'#999'}
                />
            </View>
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantity</Text>
                <TextInput
                    style={styles.input}
                    value={quantity}
                    onChangeText={setQuantity}
                    placeholder='Masukkan jumlah produk'
                    placeholderTextColor={'#999'}
                    keyboardType='numeric'
                />
            </View>
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.submitbutton]}
                    onPress={handleSubmit}
                    >
                    <Text style={styles.buttonText}>Tambah</Text>
                </Pressable>
                
                <Pressable
                    style={[styles.button, styles.cancelbutton]}
                    onPress={() => router.back()}
                    >
                    <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
            </View>
        </View>
    </ScrollView>
  )

}; // ni kurung tutup tambah

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff',
    },
    form: {
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 12,
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    button: {
        padding: 12,
        borderRadius: 6,
        minWidth: 120,
        alignItems: 'center',
    },
    submitbutton: {
        backgroundColor: '#007AFF',
    },
    cancelbutton: {
        backgroundColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
})