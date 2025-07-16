import { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import * as Network from 'expo-network';
import { enableFirestoreNetwork, disableFirestoreNetwork } from '@/services/firebase';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string | null>(null);
  const [isFirestoreOnline, setIsFirestoreOnline] = useState(true);

  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;

    const checkNetworkStatus = async () => {
      try {
        const networkState = await Network.getNetworkStateAsync();
        const wasOnline = isOnline;
        const newOnlineStatus = networkState.isConnected ?? true;
        
        setIsOnline(newOnlineStatus);
        setConnectionType(networkState.type || 'unknown');

        // Handle Firestore network state changes
        if (newOnlineStatus && !wasOnline) {
          // Coming back online
          console.log('Network restored, enabling Firestore');
          await enableFirestoreNetwork();
          setIsFirestoreOnline(true);
        } else if (!newOnlineStatus && wasOnline) {
          // Going offline
          console.log('Network lost, disabling Firestore');
          await disableFirestoreNetwork();
          setIsFirestoreOnline(false);
        }
      } catch (error) {
        console.warn('Network status check failed:', error);
        setIsOnline(true); // fallback to online
        setConnectionType('unknown');
      }
    };

    checkNetworkStatus();

    // Poll every 5 seconds (expo-network does not have event listeners)
    if (Platform.OS !== 'web') {
      interval = setInterval(checkNetworkStatus, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOnline]);

  return { 
    isOnline, 
    connectionType, 
    isFirestoreOnline,
    // Helper to check if we should use offline mode
    shouldUseOfflineMode: !isOnline || !isFirestoreOnline
  };
}