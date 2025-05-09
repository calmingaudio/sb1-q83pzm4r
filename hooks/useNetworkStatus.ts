import { useState, useEffect } from 'react';
import { Platform } from 'react-native';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);

      setIsOnline(navigator.onLine);

      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }
    
    // For native platforms, we could implement network detection using NetInfo
    // But since we're focusing on web, we'll just return true
    return () => {};
  }, []);

  return isOnline;
}