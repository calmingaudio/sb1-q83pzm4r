import React, { createContext, useContext, useEffect } from 'react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import { useOfflineAuth } from '@/hooks/useOfflineAuth';
import { usePremium } from '@/context/premiumContext';
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
}

const OfflineContext = createContext<OfflineContextType | null>(null);

export function useOfflineContext() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const offlineStorage = useOfflineStorage();
  const { isOnline, connectionType, isFirestoreOnline, shouldUseOfflineMode } = useNetworkStatus();
  const offlineAuth = useOfflineAuth();
  const { isPremium, features: premiumFeatures } = usePremium();

  // Determine offline capabilities
  const canAccessOffline = offlineAuth.isAuthenticated;
  const offlineContentAvailable = canAccessOffline && (
    isPremium || 
    offlineAuth.isOffline || // If we're in offline mode, allow access to cached content
    shouldUseOfflineMode // If network is unreliable, allow offline access
  );

  // Sync user data when coming back online
  useEffect(() => {
    if (isOnline && isFirestoreOnline && offlineAuth.isOffline && offlineAuth.user) {
      // User came back online, sync their data
      offlineAuth.syncUserDataToOffline(offlineAuth.user);
    }
  }, [isOnline, isFirestoreOnline, offlineAuth.isOffline, offlineAuth.user]);

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
    
    // Premium features
    isPremium,
    premiumFeatures,
    
    // Offline capabilities
    canAccessOffline,
    offlineContentAvailable,
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