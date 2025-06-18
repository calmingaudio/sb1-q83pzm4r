// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, SplashScreen, router, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
} from '@expo-google-fonts/inter';
import { GamificationProvider } from '@/components/gamification/GamificationProvider';
import { OfflineProvider } from '@/components/OfflineProvider';
import { AnalyticsProvider } from '@/components/AnalyticsProvider';
import ConsentBanner from '@/components/ConsentBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { AuthProvider, useAuth } from '@/context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthentication } from '@/hooks/useAuthentication';

SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { user, isLoading } = useAuthentication();
  const pathname = usePathname();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
  });

  useFrameworkReady();

  useEffect(() => {
    // Hide splash screen only when auth and fonts are ready
    if (!isLoading && (fontsLoaded || fontError)) {
      SplashScreen.hideAsync();
    }
  }, [isLoading, fontsLoaded, fontError]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    const inAuthGroup = pathname.startsWith("/auth");

    if (user) {
      if (inAuthGroup) {
        router.replace("/(tabs)");
      }
    } else {
      if (!inAuthGroup && pathname !== "/onboarding") {
        router.replace("/auth/login");
      }
    }
  }, [user, isLoading, pathname]);

  // Show nothing until auth and fonts are ready.
  if (isLoading || (!fontsLoaded && !fontError)) {
    return null;
  }


  // Always render the Stack navigator
  return (
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
          gestureResponseDistance: { top: 100 },
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <AuthProvider>
            <AnalyticsProvider>
              <OfflineProvider>
                <GamificationProvider>
                  <AppNavigation />
                  <StatusBar style="auto" />
                  <ConsentBanner />
                </GamificationProvider>
              </OfflineProvider>
            </AnalyticsProvider>
          </AuthProvider>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}