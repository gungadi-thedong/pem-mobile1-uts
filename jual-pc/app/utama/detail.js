import { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView, StyleSheet, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useProductStore } from '../../hooks/product-store';
import { supabase } from '../../lib/supabase';

export default function DetailScreen() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const { products, updateProduct, removeProduct } = useProductStore();

    const product = products.find((prod) => String(prod.id) === String(id));
    
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [rawPrice, setRawPrice] = useState('');
    const [category, setCategory] = useState('');
    const [quantity, setQuantity] = useState('');

const handlesave = async () => {
    try {
        if (validation()) {
            // ✅ Update local Zustand store (using your app's field names)
            updateProduct(product.id, {
                name,
                price: parseInt(rawPrice),
                category,
                quantity: parseInt(quantity),
            });

            // ✅ Update Supabase (using database column names)
            const { error } = await supabase
                .from('produk')
                .update({
                    nama_produk: name,
                    harga: parseInt(rawPrice),
                    jumlah_produk: parseInt(quantity),
                })
                .eq('id_produk', product.id);

            if (error) {
                throw new Error('Failed to update: ' + error.message);
            }

            if (Platform.OS === 'web') {
                alert('Product updated successfully!');
                router.back();
            } else {
                const alert = require('react-native').Alert;
                alert.alert('Success', 'Product updated successfully!', [
                    { text: 'OK', onPress: () => router.back() }
                ]);
            }
        }
    } catch (error) {
        alert(error.message);
    }
};

    // initialize form from product data; format price for display
    useEffect(() => {
        if (product) {
            setName(product.name);
            // product.price is stored as number; set raw and formatted
            const digits = product.price ? String(product.price) : '';
            setRawPrice(digits);
            setPrice(formatRupiah(digits));
            setCategory(product.category);
            setQuantity(String(product.quantity));
        }
    }, [product]);

    // helper to format digits as Indonesian Rupiah (no decimals)
    const formatRupiah = (digits) => {
        if (!digits) return '';
        const num = parseInt(digits, 10) || 0;
        return 'Rp ' + num.toLocaleString('id-ID');
    }

    if (!product) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Product not found!</Text>
            </View>
        );
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
    // const handlesave = () => {
    //     try {
    //         if (validation()) {
    //             updateProduct(product.id, {
    //                 name,
    //                 price: parseInt(rawPrice),
    //                 category,
    //                 quantity: parseInt(quantity),
    //             });

    //             if (Platform.OS === 'web') {
    //                 alert('Product updated successfully!');
    //                 router.back();
    //             } else {
    //                 const alert = require('react-native').Alert;
    //                 alert.alert('Success', 'Product updated successfully!', [
    //                     { text: 'OK', onPress: () => router.back() }
    //                 ]);
    //             }
    //         }
    //     } catch (error) {
    //         alert(error.message);
    //     }
    // };

    const handleDelete = () => {
        if (Platform.OS === 'web') {
            const confirmDelete = confirm(`Are you sure you want to delete "${product.name}"?`);
            removeProduct(product.id);
            router.back();
        } else {
            const alert = require('react-native').Alert;
            alert.alert(
                'Delete Product',
                `Are you sure you want to delete "${product.name}"?`,
                [
                    { text: 'Cancel', style: 'cancel' },
                    {
                        text: 'OK',
                        onPress: () => {
                            removeProduct(product.id);
                            router.back();
                        }
                    }
                ]
            );
        }
    };

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
                    onPress={handlesave}
                    >
                    <Text style={styles.buttonText}>Simpan</Text>
                </Pressable>

                <Pressable
                    style={[styles.button, styles.cancelbutton]}
                    onPress={() => router.back()}
                    >
                    <Text style={styles.buttonText}>Kembali</Text>
                </Pressable>
                
                <Pressable
                    style={[styles.button, styles.cancelbutton]}
                    onPress={handleDelete}
                    >
                    <Text style={styles.buttonText}>Hapus</Text>
                </Pressable>
            </View>
        </View>
    </ScrollView>
  );
}

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
    errorText: {
        color: 'red',
    }
})
