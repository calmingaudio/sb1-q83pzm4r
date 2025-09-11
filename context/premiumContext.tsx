import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';

// Safely import InAppPurchases to prevent crashes
let InAppPurchases: any = null;
try {
  // Try different import patterns to handle module structure issues
  const module = require('expo-in-app-purchases');
  InAppPurchases = module.default || module;
} catch (error) {
  console.warn('expo-in-app-purchases not available:', error);
}

// Type definitions for InAppPurchases
interface PurchaseResult {
  productId: string;
  purchaseTime: number;
  acknowledged: boolean;
}

interface PurchaseResponse {
  responseCode: number;
  results?: PurchaseResult[];
  errorCode?: string;
}

// Constants
const PREMIUM_STATUS_KEY = 'premium_status';
const PREMIUM_EXPIRY_KEY = 'premium_expiry';
const PREMIUM_TRIAL_KEY = 'premium_trial';
const PREMIUM_PURCHASE_DATE_KEY = 'premium_purchase_date';

// Product IDs - these match your App Store Connect configuration exactly
const PRODUCT_IDS = {
  monthly: 'premium_monthly',
  annual: 'premium_annual'
};

// Types
export interface PremiumFeatures {
  advancedBreathing: boolean;
  premiumMeditations: boolean;
  offlineDownloads: boolean;
  adFree: boolean;
  prioritySupport: boolean;
}

export interface PremiumPlan {
  id: 'monthly' | 'annual';
  productId: string;
  price: number;
  localizedPrice?: string;
  savings?: number;
  trialDays: number;
}

export interface PremiumStatus {
  isPremium: boolean;
  isLifetime: boolean;
  expiryDate: Date | null;
  isTrialEligible: boolean;
  trialUsed: boolean;
  purchaseDate: Date | null;
  currentPlan: PremiumPlan | null;
  isLoading: boolean;
}

interface PremiumContextType extends PremiumStatus {
  features: PremiumFeatures;
  plans: PremiumPlan[];
  purchasePlan: (planId: 'monthly' | 'annual') => Promise<boolean>;
  startTrial: (planId?: 'monthly' | 'annual') => Promise<boolean>;
  endTrial: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
  checkPremiumStatus: () => Promise<void>;
  isPremiumModalVisible: boolean;
  showPremiumModal: () => void;
  hidePremiumModal: () => void;

}

// Premium plans configuration - Only annual for Apple submission compliance
export const PREMIUM_PLANS: PremiumPlan[] = [
  {
    id: 'annual',
    productId: PRODUCT_IDS.annual,
    price: 20,
    savings: 72,
    trialDays: 7
  },
  {
    id: 'monthly',
    productId: PRODUCT_IDS.monthly,
    price: 6,
    trialDays: 7
  }
];

// Default premium features
const DEFAULT_FEATURES: PremiumFeatures = {
  advancedBreathing: false,
  premiumMeditations: false,
  offlineDownloads: false,
  adFree: false,
  prioritySupport: false,
};

// Create context
const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: React.ReactNode }) {
  const isMounted = useRef(true);
  const [status, setStatus] = useState<PremiumStatus>({
    isPremium: false,
    isLifetime: false,
    expiryDate: null,
    isTrialEligible: true,
    trialUsed: false,
    purchaseDate: null,
    currentPlan: null,
    isLoading: true,
  });
  const statusRef = useRef<PremiumStatus>(status);
  const listenerSetRef = useRef(false);
  const purchaseInFlightRef = useRef(false);
  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  const [features, setFeatures] = useState<PremiumFeatures>(DEFAULT_FEATURES);
  const [plans, setPlans] = useState<PremiumPlan[]>(PREMIUM_PLANS);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  // Single initialization effect with proper cleanup
  useEffect(() => {
    let cancelled = false;
    
    const initialize = async () => {
      if (cancelled || !isMounted.current) return;
      try {
        await initializeInAppPurchases();
      } catch (error) {
        if (!cancelled) {
          console.error('IAP initialization failed:', error);
        }
      }
    };

    initialize();

    return () => {
      cancelled = true;
      isMounted.current = false;
      try {
        if (InAppPurchases && typeof InAppPurchases.disconnectAsync === 'function') {
          InAppPurchases.disconnectAsync();
        }
      } catch (e) {
        console.warn('IAP disconnect failed (ignored):', e);
      }
    };
  }, []); // Only run once on mount

  // Update features based on premium status
  useEffect(() => {
    if (status.isPremium) {
      setFeatures({
        advancedBreathing: true,
        premiumMeditations: true,
        offlineDownloads: true,
        adFree: true,
        prioritySupport: true,
      });
    } else {
      setFeatures(DEFAULT_FEATURES);
    }
  }, [status.isPremium]);

  const initializeInAppPurchases = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      // Check if the module is available before proceeding
      if (!InAppPurchases || typeof InAppPurchases.connectAsync !== 'function') {
        console.warn('InAppPurchases module not available, skipping initialization');
        if (isMounted.current) {
          setStatus(prev => ({ ...prev, isLoading: false }));
        }
        await checkPremiumStatus(); // Fallback to local check
        return;
      }

      // Connect to the app store; ignore if already connected
      try {
        await InAppPurchases.connectAsync();
      } catch (e: any) {
        const msg = typeof e?.message === 'string' ? e.message : String(e);
        console.warn('connectAsync failed or already connected (continuing):', msg);
      }

      // Set up a single purchase listener to handle purchase updates globally
      if (!listenerSetRef.current && typeof InAppPurchases.setPurchaseListener === 'function') {
        InAppPurchases.setPurchaseListener(async ({ responseCode, results, errorCode }: PurchaseResponse) => {
          try {
            if (responseCode === InAppPurchases.IAPResponseCode.OK && results && results.length > 0) {
              // Look for our subscription products
              const subscriptionPurchase = results.find((p: PurchaseResult) =>
                p.productId === PRODUCT_IDS.annual || p.productId === PRODUCT_IDS.monthly
              );

              if (subscriptionPurchase) {
                // Acknowledge/finish if needed
                try {
                  if (typeof InAppPurchases.finishTransactionAsync === 'function' && !subscriptionPurchase.acknowledged) {
                    await InAppPurchases.finishTransactionAsync(subscriptionPurchase, true);
                  }
                } catch (finishErr) {
                  console.warn('finishTransactionAsync failed (continuing)', finishErr);
                }

                const plan = PREMIUM_PLANS.find(p => p.productId === subscriptionPurchase.productId) || null;
                const purchaseDate = new Date(subscriptionPurchase.purchaseTime);
                // For auto-renewable subscriptions, treat as active (server validation recommended in production)
                await setPremium(true, plan, null, purchaseDate);
                console.log('Premium activated from purchase listener for product:', subscriptionPurchase.productId);
              }
            } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
              console.log('User canceled purchase');
            } else {
              console.log('Purchase update failed:', errorCode);
            }
          } catch (listenerErr) {
            console.error('Error in purchase listener:', listenerErr);
          }
        });
        listenerSetRef.current = true;
      }
      
      // Get product information - fetch both monthly and annual
       if (typeof InAppPurchases.getProductsAsync === 'function') {
        const { results, responseCode } = await InAppPurchases.getProductsAsync([
          PRODUCT_IDS.annual,
          PRODUCT_IDS.monthly
        ]);

              if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
          // Update plans with localized pricing
          const updatedPlans = PREMIUM_PLANS.map(plan => {
            const product = results.find((p: any) => p.productId === plan.productId);
            return {
              ...plan,
              localizedPrice: product?.price || `$${plan.price}`,
              price: product ? parseFloat(product.price.replace(/[^\d.-]/g, '')) : plan.price
            };
          });
          setPlans(updatedPlans);
          console.log('Products loaded successfully:', updatedPlans.map(p => p.productId));
        } else {
          console.error('Failed to load products from App Store, responseCode:', responseCode);
        }
      }

      // Check existing purchases
       await checkPremiumStatus();
    } catch (error) {
      console.error('Error initializing in-app purchases:', error);
      await checkPremiumStatus(); // Fallback to local check
    } finally {
      if (isMounted.current) {
        setStatus(prev => ({ ...prev, isLoading: false }));
      }
    }
  }, [plans, setPlans]); // Dependencies: plans for product info, setPlans for updating state

  const checkPremiumStatus = useCallback(async () => {
    if (!isMounted.current) return;
    
    try {
      // Read local storage first
      const [
        isPremiumStored,
        expiryStored,
        trialUsedStored,
        purchaseDateStored,
        planIdStored
      ] = await Promise.all([
        AsyncStorage.getItem(PREMIUM_STATUS_KEY),
        AsyncStorage.getItem(PREMIUM_EXPIRY_KEY),
        AsyncStorage.getItem(PREMIUM_TRIAL_KEY),
        AsyncStorage.getItem(PREMIUM_PURCHASE_DATE_KEY),
        AsyncStorage.getItem('premium_plan_id')
      ]);

      const isPremium = isPremiumStored === 'true';
      const expiryDate = expiryStored ? new Date(expiryStored) : null;
      const trialUsed = trialUsedStored === 'true';
      const purchaseDate = purchaseDateStored ? new Date(purchaseDateStored) : null;
      const currentPlan = planIdStored ? plans.find(p => p.id === planIdStored) || null : null;

      // On iOS, optionally auto-restore from App Store history ONLY if we previously had a local premium state
      // This avoids auto-unlocking on devices with prior purchases when testing non-premium accounts
      const shouldAutoRestoreFromStore = isPremium || !!planIdStored;
      if (
        shouldAutoRestoreFromStore &&
        Platform.OS === 'ios' &&
        InAppPurchases && typeof InAppPurchases.getPurchaseHistoryAsync === 'function'
      ) {
        try {
          const purchaseResponse = await InAppPurchases.getPurchaseHistoryAsync();
          if (purchaseResponse && 'results' in purchaseResponse && purchaseResponse.results) {
            const validPurchase = purchaseResponse.results.find((purchase: PurchaseResult) => 
              purchase.productId === PRODUCT_IDS.annual || purchase.productId === PRODUCT_IDS.monthly
            );

            if (validPurchase && validPurchase.acknowledged) {
              const plan = PREMIUM_PLANS.find(p => p.productId === validPurchase.productId);
              const iosPurchaseDate = new Date(validPurchase.purchaseTime);
              await setPremium(true, plan || null, null, iosPurchaseDate);
              return;
            }
          }
        } catch (error) {
          console.error('Error checking App Store purchases:', error);
        }
      }

        // Check if premium has expired
        const isExpired = expiryDate && expiryDate < new Date();
        
        if (isMounted.current) {
          setStatus(prev => ({
            ...prev,
            isPremium: isPremium && !isExpired,
            isLifetime: isPremium && !expiryDate,
            expiryDate: isExpired ? null : expiryDate,
            isTrialEligible: !trialUsed,
            trialUsed,
            purchaseDate,
            currentPlan,
            isLoading: false,
          }));
        }

      // Clear expired premium status
      if (isExpired) {
        await clearPremiumData();
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      if (isMounted.current) {
        setStatus(prev => ({
          ...prev,
          isPremium: false,
          isLifetime: false,
          expiryDate: null,
          isLoading: false,
        }));
      }
    }
  }, [plans]); // Dependency: plans for finding currentPlan

  const showPremiumModal = () => {
    setIsPremiumModalVisible(true);
  };
  
  const hidePremiumModal = () => {
    setIsPremiumModalVisible(false);
  };

  const clearPremiumData = async () => {
    try {
      await AsyncStorage.multiRemove([
        PREMIUM_STATUS_KEY,
        PREMIUM_EXPIRY_KEY,
        PREMIUM_TRIAL_KEY,
        PREMIUM_PURCHASE_DATE_KEY,
        'premium_plan_id'
      ]);
    } catch (error) {
      console.error('Error clearing premium data:', error);
    }
  };

  const setPremium = async (
    isPremium: boolean, 
    plan?: PremiumPlan | null, 
    expiryDate?: Date | null, 
    purchaseDate?: Date
  ) => {
    try {
      const purchaseTime = purchaseDate || new Date();
      await AsyncStorage.setItem(PREMIUM_STATUS_KEY, String(isPremium));
      if (expiryDate) {
        await AsyncStorage.setItem(PREMIUM_EXPIRY_KEY, expiryDate.toISOString());
      } else {
        await AsyncStorage.removeItem(PREMIUM_EXPIRY_KEY);
      }
      await AsyncStorage.setItem(PREMIUM_PURCHASE_DATE_KEY, purchaseTime.toISOString());
      if (plan) {
        await AsyncStorage.setItem('premium_plan_id', plan.id);
      }

      if (isMounted.current) {
        setStatus(prev => ({
          ...prev,
          isPremium,
          // Only set lifetime if there is no plan (e.g. legacy, special offer)
          // For subscriptions, it's premium but not "lifetime" without an expiry date
          isLifetime: isPremium && !expiryDate && !plan,
          expiryDate: expiryDate || null,
          purchaseDate: purchaseTime,
          currentPlan: plan || null,
        }));
      }

      console.log(`Premium status set to: ${isPremium}`);
    } catch (error) {
      console.error('Error setting premium status:', error);
    }
  };

  const purchasePlan = async (planId: 'monthly' | 'annual'): Promise<boolean> => {
    if (status.isLoading) return false;
    if (purchaseInFlightRef.current) {
      console.warn('Purchase already in progress; ignoring duplicate request');
      return false;
    }

    // Note: Network connectivity checks are now handled by the OfflineProvider
    // The modal will disable purchase buttons when offline

    const planToPurchase = plans.find(p => p.id === planId);
    if (!planToPurchase) {
      console.error('Selected plan not found:', planId);
      return false;
    }

    // Pre-flight check: Ensure product details were loaded from the store.
    if (!planToPurchase.localizedPrice) {
      console.error('Product not loaded from App Store:', planToPurchase.productId);
      // Attempt to re-fetch products in the background
      initializeInAppPurchases(); 
      return false;
    }

    // Check if InAppPurchases is available
    if (!InAppPurchases || typeof InAppPurchases.purchaseItemAsync !== 'function') {
      console.error('InAppPurchases not available');
      return false;
    }

    try {
      purchaseInFlightRef.current = true;
      console.log('Attempting to purchase:', planToPurchase.productId);
      const startedAt = Date.now();
      await InAppPurchases.purchaseItemAsync(planToPurchase.productId);

      // Kick an immediate entitlement check to speed up state propagation
      try {
        await checkPremiumStatus();
      } catch {}

      // Wait for confirmation: poll local flag, context state via ref, and fall back to purchase history
      const timeoutMs = 12000;
      const pollIntervalMs = 300;
      while (Date.now() - startedAt < timeoutMs) {
        // Check AsyncStorage
        const stored = await AsyncStorage.getItem(PREMIUM_STATUS_KEY);
        if (stored === 'true') {
          console.log('Premium flag observed in storage after purchase');
          purchaseInFlightRef.current = false;
          return true;
        }

        // Check current context state via ref (listener may have updated it)
        if (isMounted.current && statusRef.current.isPremium) {
          console.log('Premium flag observed in context after purchase');
          purchaseInFlightRef.current = false;
          return true;
        }

        try {
          if (InAppPurchases && typeof InAppPurchases.getPurchaseHistoryAsync === 'function') {
            const history = await InAppPurchases.getPurchaseHistoryAsync();
            if (history && history.results && history.results.length > 0) {
              const subscriptionPurchase = history.results.find((purchase: PurchaseResult) =>
                (purchase.productId === PRODUCT_IDS.annual || purchase.productId === PRODUCT_IDS.monthly) &&
                purchase.acknowledged &&
                // Ensure it's recent (within the wait window)
                purchase.purchaseTime >= startedAt - 60_000
              );
              if (subscriptionPurchase) {
                const plan = PREMIUM_PLANS.find(p => p.productId === subscriptionPurchase.productId) || null;
                await setPremium(true, plan, null, new Date(subscriptionPurchase.purchaseTime));
                console.log('Premium activated from purchase history');
                purchaseInFlightRef.current = false;
                return true;
              }
            }
          }
        } catch (histErr) {
          console.warn('Purchase history check failed (continuing):', histErr);
        }

        // Periodically refresh local status while waiting
        try {
          await checkPremiumStatus();
        } catch {}

        await new Promise(res => setTimeout(res, pollIntervalMs));
      }
      console.warn('Timed out waiting for purchase confirmation');
      purchaseInFlightRef.current = false;
      return false;
    } catch (error: any) {
      console.error('Error during purchase:', error);
      // Provide more specific feedback to the user
      let displayMessage = 'An unexpected error occurred. Please try again.';
      if (error?.code === 'E_USER_CANCELLED') {
        // User cancelled, no need to show an error message
        purchaseInFlightRef.current = false;
        return false;
      }
      if (error?.message) {
        if (error.message.includes('not available')) {
          displayMessage = 'In-app purchases may be disabled on your device.';
        } else if (error.message.includes('SKErrorDomain')) {
          displayMessage = 'Could not connect to the App Store. Please check your connection and try again.';
        }
      }
      console.error('Purchase Failed:', displayMessage);
      purchaseInFlightRef.current = false;
      return false;
    }
  };

  const startTrial = async (planId: 'monthly' | 'annual' = 'annual'): Promise<boolean> => {
    if (!status.isTrialEligible) {
      Alert.alert('Trial Not Available', 'You have already used your free trial.');
      return false;
    }

    // For Apple subscriptions with trials, we start the trial by purchasing the subscription
    // The trial is configured in App Store Connect, not handled client-side
    try {
      // Start the subscription - the trial period is handled by Apple
      const success = await purchasePlan(planId);
      if (success) {
        // Mark trial as used in local storage to prevent multiple trials
        await AsyncStorage.setItem(PREMIUM_TRIAL_KEY, 'true');
        
        if (isMounted.current) {
          setStatus(prev => ({ 
            ...prev, 
            isTrialEligible: false, 
            trialUsed: true 
          }));
        }
        
        Alert.alert(
          'Free Trial Started', 
          'You now have 7 days of free access to premium features. Your subscription will begin after the trial period unless you cancel.'
        );
        return true;
      }
    } catch (error) {
      console.error('Error starting trial:', error);
      Alert.alert('Error', 'Could not start the free trial. Please try again.');
      return false;
    }
    return false;
  };

  const endTrial = async () => {
    try {
      await clearPremiumData();
      if (isMounted.current) {
        setStatus(prev => ({
          ...prev,
          isPremium: false,
          isLifetime: false,
          expiryDate: null,
          currentPlan: null
        }));
      }
    } catch (error) {
      console.error('Error ending trial:', error);
    }
  };

  const restorePurchases = async (): Promise<boolean> => {
    try {
      if (purchaseInFlightRef.current) {
        console.warn('Purchase in progress, restore temporarily disabled.');
        return false;
      }

      // Note: Network connectivity checks are now handled by the OfflineProvider
      // The modal will disable restore buttons when offline

      // Check if InAppPurchases is available
      if (!InAppPurchases || typeof InAppPurchases.getPurchaseHistoryAsync !== 'function') {
        console.error('InAppPurchases not available for restore');
        return false;
      }

      console.log('Restoring purchases...');
      
      // For subscriptions, we should trust Apple's validation
      // Use getPurchaseHistoryAsync to get validated purchases
          const history = await InAppPurchases.getPurchaseHistoryAsync();

      if (history.responseCode === InAppPurchases.IAPResponseCode.OK && history.results && history.results.length > 0) {
        // Filter for our subscription products only
          const subscriptionPurchases = history.results.filter((purchase: PurchaseResult) => 
            (purchase.productId === PRODUCT_IDS.annual || purchase.productId === PRODUCT_IDS.monthly) &&
            purchase.acknowledged // Only consider acknowledged/validated purchases
          );

        if (subscriptionPurchases.length > 0) {
          // Get the most recent subscription purchase
          const latestPurchase = subscriptionPurchases.sort((a: PurchaseResult, b: PurchaseResult) => b.purchaseTime - a.purchaseTime)[0];
          
          const plan = PREMIUM_PLANS.find(p => p.productId === latestPurchase.productId);
          if (plan) {
            const purchaseDate = new Date(latestPurchase.purchaseTime);
            
            // For auto-renewable subscriptions, don't calculate expiry client-side
            // Trust Apple's validation - if the purchase is acknowledged, it's valid
            // Set as lifetime premium (no expiry) since we're trusting Apple's validation
            await setPremium(true, plan, null, purchaseDate);
            Alert.alert(
              'Purchases Restored', 
              'Your premium subscription has been restored successfully.'
            );
            return true;
          } else {
            Alert.alert('Error', 'Subscription plan not found in current configuration.');
            return false;
          }
        } else {
          console.log('No active subscription found to restore.');
          return false;
        }
      } else {
        console.log('No purchase history found to restore.');
        return false;
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert(
        'Restore Failed', 
        'An error occurred while trying to restore your purchases. Please check your internet connection and try again.'
      );
      return false;
    }
    
    // This should never be reached, but adding for TypeScript completeness
    return false;
  };



  const value = {
    ...status,
    features,
    plans,
    purchasePlan,
    startTrial,
    endTrial,
    restorePurchases,
    checkPremiumStatus,
    isPremiumModalVisible,
    showPremiumModal,
    hidePremiumModal,
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
} 