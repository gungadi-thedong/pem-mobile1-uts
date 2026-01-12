import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { getUserData } from '../hooks/user-store'; // ✅ Import auth check
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Hook for handling deep links in Expo Router
 * For jual-pc app - routes to utama/home and product details
 */
export function useDeepLink() {
  const router = useRouter();

  useEffect(() => {
    // Handle app opened from closed state via deep link
    const getInitialURL = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        console.log('Initial URL:', initialUrl);
        handleDeepLink(initialUrl);
      }
    };

    getInitialURL();

    // Handle deep links while app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('Deep link received:', url);
      handleDeepLink(url);
    });

    return () => subscription.remove();
  }, []);

  const handleDeepLink = async (url) => {
    try {
      // Parse the URL
      const { hostname, path, queryParams } = Linking.parse(url);
      
      console.log('Parsed:', { hostname, path, queryParams });

      // ✅ Check if user is logged in using your user-store
      const userData = await getUserData();
      const isLoggedIn = !!userData; // true if user data exists

      // If not logged in, save the intended destination and go to login
      if (!isLoggedIn) {
        console.log('User not logged in, redirecting to login');
        // Save the deep link so we can navigate after login
        await AsyncStorage.setItem('pendingDeepLink', url);
        router.push('/(tabs)'); // Go to login (tabs index)
        return;
      }

      // User is logged in, proceed with navigation
      // jualpc://home or jualpc://utama -> navigate to utama
      if (path === 'home' || path === 'utama' || path === '/' || !path) {
        router.push('/utama/home');
        return;
      }

      // jualpc://produk/123 -> navigate to product detail with id 123
      if (path?.startsWith('produk/')) {
        const productId = path.split('/')[1];
        router.push(`/utama/detail/${productId}`);
        return;
      }

      // jualpc://product?id=123 -> navigate to product detail with id 123
      if (path === 'produk' && queryParams?.id) {
        router.push(`/utama/detail/${queryParams.id}`);
        return;
      }

      // Default: if no matching route, go to home
      console.log('No specific route matched, going to home');
      router.push('/utama/home');
      
    } catch (error) {
      console.error('Deep link error:', error);
      // On error, go to login as safe fallback
      router.push('/(tabs)');
    }
  };
}

// Helper to create deep links for sharing
export const createDeepLink = (path = '', params = {}) => {
  return Linking.createURL(path, { queryParams: params });
};

// Example usage:
// const homeLink = createDeepLink('home');
// const productLink = createDeepLink('product', { id: 123 });
// Share.share({ message: productLink });
