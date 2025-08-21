import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineAuth } from '@/hooks/useOfflineAuth';
import { usePremium } from '@/context/premiumContext';
import { useAuth } from '@/context/authContext';
import OfflineIndicator from './OfflineIndicator';

interface OfflineContextType {
  // Network status
  isOnline: boolean;
  connectionType: string | null;
  shouldUseOfflineMode: boolean;
  
  // Offline storage
  isLoading: boolean;
  error: string | null;
  lastSyncDate: Date | null;
  getBreathingPatterns: () => Promise<any>;
  getFAQCategories: () => Promise<any>;
  saveJournalEntry: (entry: any) => Promise<boolean>;
  getJournalEntries: () => Promise<any[]>;
  clearOfflineData: () => Promise<void>;
  
  // Offline auth
  isAuthenticated: boolean;
  currentUser: any;
  currentProfile: any;
  isOfflineMode: boolean;
  authLastSyncDate: Date | null;
  syncUserDataToOffline: (user: any) => Promise<void>;
  clearOfflineAuth: () => Promise<void>;
  createMockOfflineUser: (email: string, displayName: string) => Promise<{ success: boolean; user?: any; error?: string }>;
  clearDebugUser: () => Promise<{ success: boolean; error?: string }>;
  
  // Premium features
  isPremium: boolean;
  premiumFeatures: any;
  
  // Offline capabilities
  canAccessOffline: boolean;
  offlineContentAvailable: boolean;
  
  // Offline premium
  syncPremiumStatusToOffline: (isPremium: boolean, features: any) => Promise<void>;
  getOfflinePremiumStatus: () => Promise<{ isPremium: boolean; features: any } | null>;
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function useOfflineContext() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
}

const OFFLINE_PREMIUM_KEYS = {
  PREMIUM_STATUS: 'offline_premium_status',
  PREMIUM_FEATURES: 'offline_premium_features',
  LAST_SYNC: 'offline_premium_last_sync',
};

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoading: isAuthLoading } = useAuth();
  const offlineStorage = useOfflineStorage();
  const { isOnline, connectionType, shouldUseOfflineMode } = useNetworkStatus();
  const offlineAuth = useOfflineAuth(user, isAuthLoading);
  const { isPremium, features: premiumFeatures } = usePremium();
  
  const [offlinePremiumState, setOfflinePremiumState] = useState<{
    isPremium: boolean;
    features: any;
  } | null>(null);
  
  const syncInProgressRef = useRef(false);
  const loadInProgressRef = useRef(false);

  const syncPremiumStatusToOffline = useCallback(async (isPremium: boolean, features: any) => {
    if (syncInProgressRef.current) return;
    syncInProgressRef.current = true;
    
    try {
      await AsyncStorage.setItem(OFFLINE_PREMIUM_KEYS.PREMIUM_STATUS, JSON.stringify(isPremium));
      await AsyncStorage.setItem(OFFLINE_PREMIUM_KEYS.PREMIUM_FEATURES, JSON.stringify(features));
      await AsyncStorage.setItem(OFFLINE_PREMIUM_KEYS.LAST_SYNC, new Date().toISOString());
      console.log('Premium status synced to offline storage:', isPremium);
    } catch (error) {
      console.error('Error syncing premium status to offline:', error);
    } finally {
      syncInProgressRef.current = false;
    }
  }, []);

  const getOfflinePremiumStatus = useCallback(async (): Promise<{ isPremium: boolean; features: any } | null> => {
    try {
      const [premiumStatus, premiumFeatures] = await Promise.all([
        AsyncStorage.getItem(OFFLINE_PREMIUM_KEYS.PREMIUM_STATUS),
        AsyncStorage.getItem(OFFLINE_PREMIUM_KEYS.PREMIUM_FEATURES),
      ]);

      if (premiumStatus && premiumFeatures) {
        return {
          isPremium: JSON.parse(premiumStatus),
          features: JSON.parse(premiumFeatures),
        };
      }
    } catch (error) {
      console.error('Error getting offline premium status:', error);
    }
    return null;
  }, []);

  const loadOfflinePremiumStatus = useCallback(async () => {
    if (loadInProgressRef.current) return;
    loadInProgressRef.current = true;
    
    try {
      const offlineStatus = await getOfflinePremiumStatus();
      setOfflinePremiumState(offlineStatus);
    } catch (error) {
      console.error('Error loading offline premium status:', error);
    } finally {
      loadInProgressRef.current = false;
    }
  }, [getOfflinePremiumStatus]);

  // Single effect to manage premium status sync/load with proper race condition prevention
  useEffect(() => {
    let cancelled = false;
    
    const managePremiumStatus = async () => {
      if (cancelled) return;
      
      if (isOnline && offlineAuth.isAuthenticated && !isAuthLoading) {
        // When online and authenticated, sync current premium status to offline storage
        await syncPremiumStatusToOffline(isPremium, premiumFeatures);
      } else if (!isOnline || shouldUseOfflineMode) {
        // When offline or in offline mode, load cached premium status
        await loadOfflinePremiumStatus();
      }
    };

    managePremiumStatus();

    return () => {
      cancelled = true;
    };
  }, [
    isOnline, 
    isPremium, 
    premiumFeatures, 
    offlineAuth.isAuthenticated, 
    isAuthLoading,
    shouldUseOfflineMode,
    syncPremiumStatusToOffline,
    loadOfflinePremiumStatus
  ]);

  // Determine effective premium status (online when available, offline as fallback)
  const effectivePremiumStatus = isOnline ? isPremium : (offlinePremiumState?.isPremium ?? false);
  const effectivePremiumFeatures = isOnline ? premiumFeatures : (offlinePremiumState?.features ?? {});

  // Determine offline capabilities
  const canAccessOffline = offlineAuth.isAuthenticated;
  const offlineContentAvailable = canAccessOffline && (
    effectivePremiumStatus || 
    offlineAuth.isOffline || // If we're in offline mode, allow access to cached content
    shouldUseOfflineMode // If network is unreliable, allow offline access
  );



  const contextValue: OfflineContextType = {
    // Network status
    isOnline,
    connectionType,
    shouldUseOfflineMode,
    
    // Offline storage
    ...offlineStorage,
    
    // Offline auth
    isAuthenticated: offlineAuth.isAuthenticated,
    currentUser: offlineAuth.currentUser,
    currentProfile: offlineAuth.currentProfile,
    isOfflineMode: offlineAuth.isOffline,
    authLastSyncDate: offlineAuth.lastSyncDate,
    syncUserDataToOffline: offlineAuth.syncUserDataToOffline,
    clearOfflineAuth: offlineAuth.clearOfflineAuth,
    createMockOfflineUser: offlineAuth.createMockOfflineUser,
    clearDebugUser: offlineAuth.clearDebugUser,
    
    // Override loading state to use the main auth loading state
    isLoading: isAuthLoading || offlineAuth.isLoading,
    
    // Premium features
    isPremium: effectivePremiumStatus,
    premiumFeatures: effectivePremiumFeatures,
    
    // Offline capabilities
    canAccessOffline,
    offlineContentAvailable,
    
    // Offline premium functions
    syncPremiumStatusToOffline,
    getOfflinePremiumStatus,
  };

  return (
    <OfflineContext.Provider value={contextValue}>
      {children}
      <OfflineIndicator 
        isOnline={isOnline} 
        lastSyncDate={offlineStorage.lastSyncDate}
        isOfflineMode={offlineAuth.isOffline}
        isAuthenticated={offlineAuth.isAuthenticated}
      />
    </OfflineContext.Provider>
  );
}