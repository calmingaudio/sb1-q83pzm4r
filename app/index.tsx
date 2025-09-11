// app/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

/**
 * This is the initial screen of the app.
 * It now serves as a splash/loading screen while the root layout
 * determines the correct route based on authentication state.
 * The navigation logic has been centralized in `app/_layout.tsx`.
 */
export default function IndexScreen() {
  const { colors } = useTheme();

  // Show a loading screen while checking auth state in the root layout.
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
