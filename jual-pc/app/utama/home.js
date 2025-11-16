import { 
  View, Text, FlatList, StyleSheet, Pressable, Platform, Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import { useFocusEffect } from '@react-navigation/native';
import { useProductStore } from '../../hooks/product-store'; // pastikan path benar


export default function HomeScreen() {
  const router = useRouter();

  // ambil products dari zustand
  const products = useProductStore((state) => state.products);
  const setProducts = useProductStore((state) => state.setProducts);

  // format rupiah
  const formatRupiah = (value) => {
    if (!value) return 'Rp 0';
    return 'Rp ' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // 🔹 fetch produk dari supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('produk')
      .select(
        'id_produk, nama_produk, jumlah_produk, harga, kategori_produk (nama_kategori)'
      )
      .order('id_produk', { ascending: true });

    if (!error && data) {
      const mapped = data.map((item) => ({
        id: item.id_produk,
        name: item.nama_produk,
        quantity: item.jumlah_produk,
        price: item.harga,
        category: item.kategori_produk?.nama_kategori ?? 'Unknown',
        purchased: false,
      }));

      setProducts(mapped); // update Zustand
    }
  };

  // 🔹 refresh setiap masuk ke halaman ini
  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  // 🔹 realtime supabase (insert / update / delete)
  useEffect(() => {
    const channel = supabase
      .channel('produk-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'produk' },
        (payload) => {
          console.log('Realtime update:', payload);
          fetchProducts(); // auto refresh
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // 🔹 hapus data
  const handleDelete = async (id, name) => {
    if (Platform.OS === 'web') {
      const confirmDelete = confirm(`Hapus "${name}"?`);
      if (!confirmDelete) return;
      await supabase.from('produk').delete().eq('id_produk', id);
      return;
    }

    Alert.alert(
      'Delete Product',
      `Apakah anda yakin ingin menghapus "${name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await supabase.from('produk').delete().eq('id_produk', id);
          },
        },
      ]
    );
  };

  // 🔹 render item list
  const renderItem = ({ item }) => (
    <Pressable
      style={styles.itemContainer}
      onPress={() =>
        router.push({
          pathname: '/utama/detail',
          params: { id: String(item.id) },
        })
      }
    >
      <View style={styles.itemContent}>
        <View style={styles.itemInfo}>
          <Text style={[styles.itemName, item.purchased && styles.purchased]}>
            {item.name}
          </Text>
          <Text style={styles.itemDetails}>
            Qty: {item.quantity} | {formatRupiah(item.price)} | {item.category}
          </Text>
        </View>

        <View style={styles.itemActions}>
          <Pressable
            style={[styles.button, item.purchased && styles.purchasedButton]}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>
              {item.purchased ? '✓' : 'o'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.deleteButton}
            onPress={() => handleDelete(item.id, item.name)}
          >
            <Text style={styles.buttonText}>Delete</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );

  const emptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>Belum ada produk.</Text>
    </View>
  );

  const handleLogout = () => {
    router.push('/utama/logout');
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout 🚪</Text>
      </Pressable>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={emptyList}
        contentContainerStyle={products.length === 0 && styles.flatListContainer}
      />

      <Pressable
        style={styles.fab}
        onPress={() => router.push('/utama/tambah')}
      >
        <Text style={styles.fabText}>Tambah</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F7F8',
    padding: 12,
  },
  flatListContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  separator: {
    height: 8,
  },
  itemContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    paddingRight: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  purchased: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  itemDetails: {
    marginTop: 4,
    color: '#666',
    fontSize: 13,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  purchasedButton: {
    backgroundColor: '#2ECC71',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    alignItems: 'center',
  },
  emptyText: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 28,
    elevation: 4,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#FF6347',
    borderRadius: 4,
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
