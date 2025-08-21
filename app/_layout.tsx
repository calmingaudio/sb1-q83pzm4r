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
import OfflineAuthBanner from '@/components/OfflineAuthBanner';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { AuthProvider } from '@/context/authContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useOfflineContext } from '@/components/OfflineProvider';
import { PremiumProvider, usePremium } from '@/context/premiumContext';
import PremiumModal from '@/components/premium/PremiumModal';
import OfflineAuthTester from '@/components/OfflineAuthTester';
import { ErrorBoundary } from '@/components/ErrorBoundary';

SplashScreen.preventAutoHideAsync();

function AppNavigation() {
  const { isAuthenticated, isLoading } = useOfflineContext();
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
    // Don't navigate if still loading or fonts aren't ready
    if (isLoading || (!fontsLoaded && !fontError) || !isMounted) {
      return;
    }

    // Use a timeout to ensure the navigator is mounted before navigating
    const timeout = setTimeout(() => {
      const inAuthGroup = pathname.startsWith("/auth");

      if (isAuthenticated) {
        // Define valid authenticated screens (including tab screens without the (tabs) prefix)
        const validTabScreens = ['/home', '/breathe', '/sos', '/music', '/journal'];
        const validScreens = ['/profile', '/learn', ...validTabScreens];
        const isInValidScreen = pathname.startsWith("/(tabs)") || validScreens.includes(pathname);
        
        // If user is authenticated but not in the main app, navigate to main app
        if (!isInValidScreen) {
          router.replace('/(tabs)');
        }
      } else {
        if (!inAuthGroup && pathname !== "/onboarding") {
          router.replace("/auth/welcome");
        }
      }
    }, 150); // Slightly longer delay for stability

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
      <Stack.Screen name="learn" options={{ headerShown: false }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
    </Stack>
  );
}

function RootLayoutNav() {
  const { 
    isPremiumModalVisible, 
    hidePremiumModal, 
    purchasePlan, 
    startTrial,
    restorePurchases,
    isLoading,
    isTrialEligible
  } = usePremium();

  const handlePurchase = async (planId: 'monthly' | 'annual') => {
    const success = await purchasePlan(planId);
    // Let the modal close itself; still return success for UI feedback
    if (success) {
      // optional: leave banner/modal closing to child for consistency
    }
    return success;
  };

  const handleStartTrial = async (planId: 'monthly' | 'annual' = 'annual') => {
    try {
      const ok = await startTrial(planId);
      return ok;
    } catch (error) {
      console.error('Error in handleStartTrial:', error);
      return false;
    }
  };

  const handleRestore = async () => {
    try {
      const success = await restorePurchases();
      return success;
    } catch (error) {
      console.error('Error in handleRestore:', error);
      return false;
    }
  };

  return (
    <>
      <AppNavigation />
      <StatusBar style="dark" />
      <ConsentBanner />
      <OfflineAuthBanner />
      <OfflineAuthTester />
      <PremiumModal
        visible={isPremiumModalVisible}
        onClose={hidePremiumModal}
        onPurchase={handlePurchase}
        onStartTrial={handleStartTrial}
        onRestore={handleRestore}
        isLoading={isLoading}
        isTrialEligible={isTrialEligible}
      />
    </>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}