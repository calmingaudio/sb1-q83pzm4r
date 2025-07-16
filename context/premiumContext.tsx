import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, Platform } from 'react-native';
import * as InAppPurchases from 'expo-in-app-purchases';

// Constants
const PREMIUM_STATUS_KEY = 'premium_status';
const PREMIUM_EXPIRY_KEY = 'premium_expiry';
const PREMIUM_TRIAL_KEY = 'premium_trial';
const PREMIUM_PURCHASE_DATE_KEY = 'premium_purchase_date';

// Product IDs - these should match your App Store Connect configuration
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
  startTrial: () => Promise<void>;
  endTrial: () => Promise<void>;
  restorePurchases: () => Promise<void>;
  checkPremiumStatus: () => Promise<void>;
  isPremiumModalVisible: boolean;
  showPremiumModal: () => void;
  hidePremiumModal: () => void;
  // Development only - remove in production
  simulatePremiumPurchase: () => Promise<void>;
}

// Premium plans configuration
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

  const [features, setFeatures] = useState<PremiumFeatures>(DEFAULT_FEATURES);
  const [plans, setPlans] = useState<PremiumPlan[]>(PREMIUM_PLANS);
  const [isPremiumModalVisible, setIsPremiumModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    initializeInAppPurchases();
  }, []);

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

  const initializeInAppPurchases = async () => {
    try {
      // Connect to the app store
      await InAppPurchases.connectAsync();

      // Set up purchase listener to handle purchase updates
      InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
          console.log('Purchase update received successfully');
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
          console.log('User canceled purchase');
        } else {
          console.log('Purchase update failed:', errorCode);
        }
      });
      
      // Get product information
      const { results, responseCode } = await InAppPurchases.getProductsAsync([
        PRODUCT_IDS.monthly,
        PRODUCT_IDS.annual
      ]);

      if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
        // Update plans with localized pricing
        const updatedPlans = PREMIUM_PLANS.map(plan => {
          const product = results.find(p => p.productId === plan.productId);
          return {
            ...plan,
            localizedPrice: product?.price || `$${plan.price}`,
            price: product ? parseFloat(product.price.replace(/[^\d.-]/g, '')) : plan.price
          };
        });
        setPlans(updatedPlans);
      }

      // Check existing purchases
      await checkPremiumStatus();
    } catch (error) {
      console.error('Error initializing in-app purchases:', error);
      await checkPremiumStatus(); // Fallback to local check
    }
  };

  const checkPremiumStatus = async () => {
    try {
      // First check for active subscriptions from App Store
      if (Platform.OS === 'ios') {
        try {
          const purchaseResponse = await InAppPurchases.getPurchaseHistoryAsync();
          if (purchaseResponse && 'results' in purchaseResponse && purchaseResponse.results) {
            const validPurchase = purchaseResponse.results.find(purchase => 
              purchase.productId === PRODUCT_IDS.monthly || 
              purchase.productId === PRODUCT_IDS.annual
            );

            if (validPurchase && validPurchase.acknowledged) {
              // User has an active subscription
              const plan = PREMIUM_PLANS.find(p => p.productId === validPurchase.productId);
              const purchaseDate = new Date(validPurchase.purchaseTime);
              
              // For subscriptions, we trust Apple's validation
              await setPremium(true, plan || null, null, purchaseDate);
              return;
            }
          }
        } catch (error) {
          console.error('Error checking App Store purchases:', error);
        }
      }

      // Fallback to local storage check
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
  };

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
          isLifetime: isPremium && !expiryDate,
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

    const planToPurchase = plans.find(p => p.id === planId);
    if (!planToPurchase) {
      Alert.alert('Error', 'Selected plan not found.');
      return false;
    }

    try {
      console.log('Attempting to purchase:', planToPurchase.productId);
      
      // Request purchase
      await InAppPurchases.purchaseItemAsync(planToPurchase.productId);
      
      // Wait for purchase listener to be called
      return new Promise(resolve => {
        InAppPurchases.setPurchaseListener(async ({ responseCode, results, errorCode }) => {
          if (responseCode === InAppPurchases.IAPResponseCode.OK && results) {
            console.log('Purchase successful:', results);

            const purchase = results.find(p => p.productId === planToPurchase.productId);
            if (purchase && !purchase.acknowledged) {
              await InAppPurchases.finishTransactionAsync(purchase, true);
            }
            
            const expiryDate = new Date();
            if (planToPurchase.id === 'monthly') {
              expiryDate.setMonth(expiryDate.getMonth() + 1);
            } else {
              expiryDate.setFullYear(expiryDate.getFullYear() + 1);
            }
            
            await setPremium(true, planToPurchase, expiryDate);
            Alert.alert('Purchase Successful', 'You now have access to all premium features!');
            resolve(true);

          } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            console.log('User canceled the purchase.');
            Alert.alert('Purchase Canceled', 'The purchase was canceled.');
            resolve(false);
          } else {
            console.log('Purchase failed with error code:', errorCode);
            Alert.alert('Purchase Failed', `An error occurred during purchase. Code: ${errorCode}`);
            resolve(false);
          }
        });
      });
    } catch (error) {
      console.error('Error during purchase:', error);
      Alert.alert('Error', 'An unexpected error occurred during the purchase process.');
      return false;
    }
  };

  const startTrial = async () => {
    if (!status.isTrialEligible) {
      Alert.alert('Trial Not Available', 'You have already used your free trial.');
      return;
    }

    try {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      
      await AsyncStorage.setItem(PREMIUM_TRIAL_KEY, 'true');
      await setPremium(true, null, expiryDate, new Date());
      
      if (isMounted.current) {
        setStatus(prev => ({ ...prev, isTrialEligible: false, trialUsed: true }));
      }
      
      Alert.alert('Trial Started', 'You now have 7 days of free access to premium features.');
    } catch (error) {
      console.error('Error starting trial:', error);
      Alert.alert('Error', 'Could not start the free trial.');
    }
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

  const restorePurchases = async () => {
    try {
      console.log('Restoring purchases...');
      const history = await InAppPurchases.getPurchaseHistoryAsync();

      if (history.responseCode === InAppPurchases.IAPResponseCode.OK && history.results && history.results.length > 0) {
        const latestPurchase = history.results.sort((a, b) => b.purchaseTime - a.purchaseTime)[0];
        
        const plan = PREMIUM_PLANS.find(p => p.productId === latestPurchase.productId);
        if (plan) {
          const purchaseDate = new Date(latestPurchase.purchaseTime);
          const expiryDate = new Date(purchaseDate);
          
          if (plan.id === 'monthly') {
            expiryDate.setMonth(expiryDate.getMonth() + 1);
          } else {
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);
          }

          if (expiryDate > new Date()) {
            await setPremium(true, plan, expiryDate, purchaseDate);
            Alert.alert('Purchases Restored', 'Your premium access has been restored.');
          } else {
            Alert.alert('No Active Subscription', 'We found a past subscription, but it has expired.');
          }
        } else {
          Alert.alert('No Purchases Found', 'We could not find any active subscriptions to restore.');
        }
      } else {
        Alert.alert('No Purchases Found', 'We could not find any active subscriptions to restore.');
      }
    } catch (error) {
      console.error('Error restoring purchases:', error);
      Alert.alert('Error', 'An error occurred while trying to restore your purchases.');
    }
  };

  // Development only
  const simulatePremiumPurchase = async () => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1);
    await setPremium(true, PREMIUM_PLANS[0], expiryDate);
    Alert.alert('Dev: Premium Activated', 'You now have premium access for one year.');
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
    simulatePremiumPurchase,
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