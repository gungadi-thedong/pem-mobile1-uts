import { View, Text, FlatList, StyleSheet, Pressable, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useProductStore } from '../../hooks/product-store';

export default function HomeScreen() {
    const router = useRouter();
    const { products, removeProduct, togglePurchased } = useProductStore();

    const handleDelete = (id, name) => {
        if (Platform.OS === 'web') {
            const confirmDelete = confirm(`Are you sure you want to delete "${name}"?`);
            if (confirmDelete) {
                removeProduct(id);
            }
        } else {
            const alert = require('react-native').Alert;
            alert.alert(
                'Delete Product',
                'Apakah anda yakin ingin menghapus "' + name + '"?',
                [
                    { text: 'Cancel', style: 'cancel'},
                    {
                        text: 'Delete',
                        style: 'destructive',
                        onPress: () => removeProduct(id)
                    }
                ]
            );
        }
    };

    const renderItem = ({ item }) => (
        // Entire card navigates to detail page when pressed (except the action buttons)
        <Pressable
            style={styles.itemContainer}
            onPress={() => router.push({ pathname: '/utama/detail', params: { id: String(item.id) } })}

        >
            <View style={styles.itemContent}>
                <View style={styles.itemInfo}>
                    <Text style={[styles.itemName, item.purchased && styles.purchased]}>
                        {item.name}
                    </Text>
                    <Text style={styles.itemDetails}>
                        Qty: {item.quantity} | ${item.price} | {item.category}
                    </Text>
                </View>

                {/* Action buttons: only these should be interactive for purchase/delete */}
                <View style={styles.itemActions}>
                    <Pressable
                        style={[styles.button, item.purchased && styles.purchasedButton]}
                        onPress={() => togglePurchased(item.id)}
                    >
                        <Text style={styles.buttonText}>{item.purchased ? '✓' : 'o'}</Text>
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
            <Text style={styles.emptyText}>No products available. Add some!</Text>
        </View>
    );

    return (
        <View style={styles.container}>
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
}; //akhirnya

// simple, generic styles for Home screen
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
});
