import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Pressable, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
// Import Supabase dari path yang sudah dikonfirmasi
import { supabase } from '../../lib/supabase'; 
// RNPickerSelect dihapus untuk fix web.
import Dropdown from '../../components/Dropdown';

// --- TAMPILAN KHUSUS (Custom Alert untuk Web/Native) ---
const showCustomAlert = (title, message, onPressOk) => {
    if (Platform.OS === 'web') {
        alert(`${title}: ${message}`);
        if (onPressOk) onPressOk();
    } else {
        Alert.alert(title, message, [{ text: 'OK', onPress: onPressOk }]);
    }
};

// ==========================================================
// KOMPONEN DROPDOWN KUSTOM UNTUK SEMUA PLATFORM (WEB SAFE)
// ==========================================================
const CategoryDropdown = ({ items, selectedValue, onValueChange, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Cari Label (Nama Kategori) dari Value (ID Kategori) yang dipilih
    const selectedLabel = items.find(item => item.value === selectedValue)?.label || placeholder.label;

    const handleSelect = (value) => {
        onValueChange(value);
        setIsOpen(false);
    };

    return (
        <View style={styles.dropdownWrapper}>
            {/* Tombol Dropdown: Menampilkan Nama, Menyimpan ID */}
            <Pressable 
                onPress={() => setIsOpen(!isOpen)} 
                style={styles.dropdownButton}
            >
                <Text 
                    style={selectedValue === null ? styles.dropdownPlaceholderText : styles.dropdownSelectedText}
                    numberOfLines={1}
                >
                    {selectedLabel}
                </Text>
                {/* Ikon panah (menggunakan emoji agar kompatibel di mana saja) */}
                <Text style={styles.dropdownArrow}>{isOpen ? '▲' : '▼'}</Text>
            </Pressable>

            {/* Opsi Dropdown (Hanya muncul jika isOpen=true) */}
            {isOpen && (
                <View style={styles.dropdownOptionsContainer}>
                    <ScrollView style={{ maxHeight: 200 }}>
                        {/* Opsi Placeholder */}
                         <Pressable
                            key="placeholder"
                            onPress={() => handleSelect(null)}
                            style={styles.dropdownOption}
                        >
                            <Text style={styles.dropdownPlaceholderText}>
                                {placeholder.label}
                            </Text>
                        </Pressable>
                        
                        {/* Mapping Data Kategori dari Supabase */}
                        {items.map((item) => (
                            <Pressable
                                key={item.key}
                                onPress={() => handleSelect(item.value)}
                                style={[
                                    styles.dropdownOption, 
                                    item.value === selectedValue && styles.dropdownOptionSelected
                                ]}
                            >
                                <Text style={styles.dropdownSelectedText}>
                                    {item.label}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};
// ==========================================================


export default function TambahScreen() {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [rawPrice, setRawPrice] = useState('');
    // Menyimpan ID Kategori (bigint)
    const [selectedCategoryId, setSelectedCategoryId] = useState(null); 
    const [quantity, setQuantity] = useState('');
    // Data kategori yang akan diisi dari Supabase
    const [categories, setCategories] = useState([]); 
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // 1. HELPER: FORMAT RUPIAH
    const formatRupiah = (digits) => {
        if (!digits) return '';
        const num = parseInt(digits, 10) || 0; 
        return 'Rp ' + num.toLocaleString('id-ID');
    };

    // 2. FUNGSI PENGAMBILAN DATA KATEGORI DARI SUPABASE
    const fetchCategories = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('kategori_produk')
            .select('id_kategori, nama_kategori')
            .order('nama_kategori', { ascending: true });

        setLoading(false);

        if (error) {
            console.error('Error fetching categories:', error);
            showCustomAlert('Error', 'Gagal memuat kategori: ' + error.message);
        } else if (data) {
            // Transformasi data: Label=Nama (Ditampilkan), Value=ID (Disimpan)
            const pickerItems = data.map(item => ({
                label: item.nama_kategori, 
                value: item.id_kategori,    
                key: item.id_kategori.toString()
            }));
            setCategories(pickerItems);
        }
    };
    
    useEffect(() => {
        fetchCategories();
    }, []);

    // 3. VALIDASI
    const validation = () => {
        if (!name.trim()) {
            throw new Error('Nama produk wajib diisi!');
        }
        if (!selectedCategoryId || selectedCategoryId <= 0) {
            throw new Error('Kategori wajib dipilih!');
        }
        if (!rawPrice.trim() || isNaN(rawPrice) || parseInt(rawPrice, 10) <= 0) {
            throw new Error('Harga harus berupa angka positif!');
        }
        if (!quantity.trim() || isNaN(quantity) || parseInt(quantity, 10) <= 0) {
            throw new Error('Jumlah produk harus berupa angka positif!');
        }
        return true;
    };

    // 4. INSERT DATA KE TABEL PRODUK SUPABASE
    const insertProductToSupabase = async (productData) => {
        const { error } = await supabase
            .from('produk')
            .insert([
                {
                    nama_produk: productData.name,
                    id_kategori: productData.categoryId, // Menggunakan ID Kategori
                    jumlah_produk: productData.quantity, 
                    harga: productData.price, 
                },
            ]);

        if (error) {
            console.error('Error inserting product:', error);
            showCustomAlert('Error', 'Gagal menambah produk: ' + error.message);
            return false;
        }
        return true;
    };

    const handleSubmit = async () => {
        try {
            if (validation()) {
                const productData = {
                    name: name,
                    categoryId: selectedCategoryId,
                    quantity: parseInt(quantity, 10),
                    price: parseInt(rawPrice, 10), 
                };

                const success = await insertProductToSupabase(productData);

                if (success) {
                    showCustomAlert('Success', 'Produk berhasil ditambahkan!', () => {
                        router.back();
                    });
                }
            }
        } catch (error) {
            showCustomAlert('Error', error.message);
        }
    };

    if (loading) {
        return (
            <View style={[styles.container, styles.center]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text style={{ marginTop: 10 }}>Memuat Kategori...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.form}>
                
                {/* 1. INPUT NAME */}
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

                {/* 2. INPUT PRICE (Rupiah Formatted) */}
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
                
                {/* 3. KATEGORI (Menggunakan Custom Dropdown Web-Safe) */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Category</Text>
                      <Dropdown
                        items={categories}
                        placeholder="Pilih Kategori..."
                        value={selectedCategoryId}
                        onChange={(val) => setSelectedCategoryId(val)}
                    />
                </View>

                {/* 4. INPUT QUANTITY */}
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

                {/* BUTTONS */}
                <View style={styles.buttonContainer}>
                    <Pressable
                        style={[styles.button, styles.submitbutton]}
                        onPress={handleSubmit}
                        >
                        <Text style={styles.buttonText}>Tambah ke DB</Text>
                    </Pressable>
                    
                    <Pressable
                        style={[styles.button, styles.cancelbutton]}
                        onPress={() => router.back()}
                        >
                        <Text style={styles.buttonText}>Batal</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F7F7F8', 
        overflow : 'visible',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        marginTop: 8,
    },
    inputGroup: {
        marginBottom: 16, 
        position : 'relative',
        // Menggunakan zIndex agar dropdown muncul di atas elemen lain di Web
        ...(Platform.OS === 'web' && { zIndex: 10 }), 
    },
    label: {
        marginBottom: 6,
        fontWeight: '600',
        fontSize: 16,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        fontSize: 16,
    },
    
    // ==========================================================
    // STYLES DROPDOWN KUSTOM
    // ==========================================================
    dropdownWrapper: {
        position: 'relative',
        zIndex: 9999,
    },
    dropdownButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        backgroundColor: '#fff',
        minHeight: 44,
    },
    dropdownArrow: {
        fontSize: 16, 
        color: '#555',
        marginLeft: 10,
    },
    dropdownPlaceholderText: {
        fontSize: 16,
        color: '#999',
    },
    dropdownSelectedText: {
        fontSize: 16,
        color: 'black',
    },
    dropdownOptionsContainer: {
        position: 'absolute',
        top: 45, // Muncul tepat di bawah tombol
        width: '100%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        zIndex : 9999,
        elevation: 50, // Untuk Android shadow
    },
    dropdownOption: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    dropdownOptionSelected: {
        backgroundColor: '#f0f0ff',
    },
    // ==========================================================
    
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 24,
        paddingBottom: 40,
    },
    button: {
        padding: 14,
        borderRadius: 8,
        minWidth: 120,
        alignItems: 'center',
        flex: 1,
        marginHorizontal: 4,
    },
    submitbutton: {
        backgroundColor: '#2ECC71',
    },
    cancelbutton: {
        backgroundColor: '#FF6347',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
});