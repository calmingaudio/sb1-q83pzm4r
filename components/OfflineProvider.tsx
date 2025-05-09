import React, { createContext, useContext } from 'react';
import { useOfflineStorage } from '@/hooks/useOfflineStorage';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import OfflineIndicator from './OfflineIndicator';

const OfflineContext = createContext<ReturnType<typeof useOfflineStorage> & { isOnline: boolean } | null>(null);

export function useOfflineContext() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOfflineContext must be used within an OfflineProvider');
  }
  return context;
}

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const offlineStorage = useOfflineStorage();
  const isOnline = useNetworkStatus();

  return (
    <OfflineContext.Provider value={{ ...offlineStorage, isOnline }}>
      {children}
      <OfflineIndicator isOnline={isOnline} lastSyncDate={offlineStorage.lastSyncDate} />
    </OfflineContext.Provider>
  );
}