import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { GamificationProvider } from '@/components/gamification/GamificationProvider';
import { OfflineProvider } from '@/components/OfflineProvider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import ConsentBanner from '@/components/ConsentBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  // Hide splash screen once fonts are loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while fonts load
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <AnalyticsProvider>
          <OfflineProvider>
            <GamificationProvider>
              <Stack 
                screenOptions={{ 
                  headerShown: false,
                  animation: Platform.OS === 'ios' ? 'default' : 'none',
                }}
              >
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen name="questionnaire" options={{ headerShown: false }} />
                <Stack.Screen 
                  name="onboarding" 
                  options={{ 
                    presentation: 'modal',
                    gestureEnabled: true,
                    gestureResponseDistance: 100,
                  }} 
                />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
              </Stack>
              <StatusBar style="auto" />
              <ConsentBanner />
            </GamificationProvider>
          </OfflineProvider>
        </AnalyticsProvider>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
}