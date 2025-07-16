import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useAuthentication } from '@/hooks/useAuthentication';

export default function IndexScreen() {
  const { user, isLoading } = useAuthentication();
  const { colors } = useTheme();

  useEffect(() => {
    // Ensure router is ready before attempting navigation
    if (!router.canGoBack && !router.canDismiss) {
      return;
    }

    if (!isLoading) {
      // Use setTimeout to ensure component is fully mounted before navigation
      const timeoutId = setTimeout(() => {
        if (!user) {
          router.replace('/auth/welcome');
        } else {
          // Navigate to the tabs group instead of a specific tab
          router.replace('/(tabs)');
        }
      }, 0);

      return () => clearTimeout(timeoutId);
    }
  }, [user, isLoading]);
  
  // Show loading screen while checking auth state
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]} />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 