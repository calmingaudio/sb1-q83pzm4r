import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const PREMIUM_STATUS_KEY = 'premium_status';
const PREMIUM_EXPIRY_KEY = 'premium_expiry';

export interface PremiumStatus {
  isPremium: boolean;
  expiryDate: Date | null;
  isLoading: boolean;
}

export function usePremium() {
  const isMounted = useRef(true);
  const [premiumStatus, setPremiumStatus] = useState<PremiumStatus>({
    isPremium: false,
    expiryDate: null,
    isLoading: true,
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    checkPremiumStatus();
  }, []);

  const checkPremiumStatus = async () => {
    try {
      const [isPremiumStored, expiryStored] = await Promise.all([
        AsyncStorage.getItem(PREMIUM_STATUS_KEY),
        AsyncStorage.getItem(PREMIUM_EXPIRY_KEY),
      ]);

      const isPremium = isPremiumStored === 'true';
      const expiryDate = expiryStored ? new Date(expiryStored) : null;

      // Check if premium has expired
      const isExpired = expiryDate && expiryDate < new Date();
      
      if (isMounted.current) {
        setPremiumStatus({
          isPremium: isPremium && !isExpired,
          expiryDate: isExpired ? null : expiryDate,
          isLoading: false,
        });
      }

      // Clear expired premium status
      if (isExpired) {
        await Promise.all([
          AsyncStorage.removeItem(PREMIUM_STATUS_KEY),
          AsyncStorage.removeItem(PREMIUM_EXPIRY_KEY),
        ]);
      }
    } catch (error) {
      console.error('Error checking premium status:', error);
      if (isMounted.current) {
        setPremiumStatus({
          isPremium: false,
          expiryDate: null,
          isLoading: false,
        });
      }
    }
  };

  const setPremium = async (isPremium: boolean, expiryDate?: Date) => {
    try {
      if (isPremium && expiryDate) {
        await Promise.all([
          AsyncStorage.setItem(PREMIUM_STATUS_KEY, 'true'),
          AsyncStorage.setItem(PREMIUM_EXPIRY_KEY, expiryDate.toISOString()),
        ]);
        if (isMounted.current) {
          setPremiumStatus({
            isPremium: true,
            expiryDate,
            isLoading: false,
          });
        }
      } else {
        await Promise.all([
          AsyncStorage.removeItem(PREMIUM_STATUS_KEY),
          AsyncStorage.removeItem(PREMIUM_EXPIRY_KEY),
        ]);
        if (isMounted.current) {
          setPremiumStatus({
            isPremium: false,
            expiryDate: null,
            isLoading: false,
          });
        }
      }
    } catch (error) {
      console.error('Error setting premium status:', error);
    }
  };

  // For development/testing - simulate premium purchase
  const simulatePremiumPurchase = async () => {
    const expiryDate = new Date();
    expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from now
    await setPremium(true, expiryDate);
  };

  const restorePurchases = async () => {
    // In a real app, this would call RevenueCat's restore purchases
    // For now, we'll just check our local storage
    await checkPremiumStatus();
  };

  return {
    ...premiumStatus,
    setPremium,
    simulatePremiumPurchase,
    restorePurchases,
    checkPremiumStatus,
  };
}