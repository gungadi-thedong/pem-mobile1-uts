// app/(tabs)/_layout.tsx
import React from 'react';
import { Tabs } from 'expo-router';
import { ThemeProvider, useTheme } from '../../hooks/themecontext.js';
import { StatusBar, View, Pressable, Text, StyleSheet } from 'react-native';

// This component renders the toggle button for light/dark mode
function ThemeToggleButton() {
  // Get theme and toggleTheme from context
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  // Emoji icons for sun (light) and moon (dark)
  const icon = isDark ? '🌙' : '☀️';

  return (
    <Pressable
      style={styles.toggleButton}
      onPress={toggleTheme}
      accessibilityLabel="Toggle light/dark mode"
    >
      <Text style={styles.toggleIcon}>{icon}</Text>
      <Text style={styles.toggleText}>{isDark ? 'Dark' : 'Light'} Mode</Text>
    </Pressable>
  );
}

function TabsLayoutContent() {
  const { theme, colors } = useTheme(); // Get theme colors from context
  const isDark = theme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* StatusBar color changes with theme */}
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />

      {/* Theme toggle button at the top */}
      <ThemeToggleButton />

      {/* Tabs for navigation */}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.text,
          tabBarStyle: {
            backgroundColor: colors.card,
          },
        }}
      >
        {/* ...tab screens... */}
      </Tabs>
    </View>
  );
}

// The ThemeProvider wraps everything so theme context is available
export default function TabsLayout() {
  return (
    <ThemeProvider>
      <TabsLayoutContent />
    </ThemeProvider>
  );
}

// Styles for the toggle button and layout
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // fallback, can be themed
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    margin: 12,
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#eee',
  },
  toggleIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  toggleText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});
