// app/_layout.tsx
import React, { useEffect, useState } from 'react';
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
import { ThemeProvider } from '@/components/ThemeProvider';
import ConsentBanner from '@/components/ConsentBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { AuthProvider } from '@/context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOfflineContext } from '@/components/OfflineProvider';
import { PremiumProvider, usePremium } from '@/context/premiumContext';
import PremiumModal from '@/components/premium/PremiumModal';

SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { isAuthenticated, isLoading, isOfflineMode } = useOfflineContext();
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

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
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading || (!fontsLoaded && !fontError) || !isMounted) {
      return;
    }

    // Use a timeout to ensure the navigator is mounted before navigating
    const timeout = setTimeout(() => {
      const inAuthGroup = pathname.startsWith("/auth");

      if (isAuthenticated) {
        if (inAuthGroup) {
          router.replace('/(tabs)');
        }
      } else {
        if (!inAuthGroup && pathname !== "/onboarding") {
          router.replace("/auth/welcome");
        }
      }
    }, 100);

    return () => clearTimeout(timeout);
  }, [isAuthenticated, isLoading, pathname, fontsLoaded, fontError, isMounted]);

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
        }}
      />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

function RootLayoutNav() {
  const { 
    isPremiumModalVisible, 
    hidePremiumModal, 
    purchasePlan, 
    restorePurchases,
    isLoading 
  } = usePremium();

  const handlePurchase = async (planId: 'monthly' | 'annual') => {
    const success = await purchasePlan(planId);
    if (success) {
      hidePremiumModal();
    }
  };

  const handleRestore = async () => {
    await restorePurchases();
    // Assuming restorePurchases will show an alert on its own.
    // You might want to hide the modal if restore is successful.
    // This part depends on the logic inside restorePurchases.
  };

  return (
    <>
      <AppNavigation />
      <StatusBar style="auto" />
      <ConsentBanner />
      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={hidePremiumModal}
        onPurchase={handlePurchase}
        onRestore={handleRestore}
        isLoading={isLoading}
      />
    </>
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
          <ThemeProvider>
            <AuthProvider>
              <AnalyticsProvider>
                <PremiumProvider>
                  <OfflineProvider>
                    <GamificationProvider>
                      <RootLayoutNav />
                    </GamificationProvider>
                  </OfflineProvider>
                </PremiumProvider>
              </AnalyticsProvider>
            </AuthProvider>
          </ThemeProvider>
        </KeyboardAvoidingView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}