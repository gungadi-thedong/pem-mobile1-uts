// app/_layout.tsx
import { Stack } from 'expo-router';
import { ThemeProvider } from '../hooks/themecontext.js';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ThemeProvider>
  );
}
