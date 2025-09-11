import { useState, useEffect, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from 'firebase/auth';
import { getFirebaseAuth } from '@/services/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase';

const OFFLINE_AUTH_KEYS = {
  USER_DATA: 'offline_user_data',
  AUTH_TOKEN: 'offline_auth_token',
  LAST_SYNC: 'offline_auth_last_sync',
  USER_PROFILE: 'offline_user_profile',
};

interface OfflineUserData {
  uid: string;
  email: string;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  lastSignInTime: string;
  createdAt: string;
  isOfflineUser?: boolean;
  pendingMagicLink?: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  marketingOptIn: boolean;
  createdAt: any;
}

interface OfflineAuthState {
  user: User | null;
  offlineUser: OfflineUserData | null;
  profile: UserProfile | null;
  isOffline: boolean;
  isLoading: boolean;
  lastSyncDate: Date | null;
}

export function useOfflineAuth(onlineUser: User | null, isOnlineAuthLoading: boolean) {
  const isMounted = useRef(true);
  const [authState, setAuthState] = useState<OfflineAuthState>({
    user: onlineUser,
    offlineUser: null,
    profile: null,
    isOffline: false,
    isLoading: true,
    lastSyncDate: null,
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    const handleAuthChange = async () => {
      if (!isMounted.current) return;

      if (isOnlineAuthLoading) {
        setAuthState(prev => ({ ...prev, isLoading: true }));
        return;
      }

      if (onlineUser) {
        // User is online and authenticated
        await syncUserDataToOffline(onlineUser);
        const profile = await getOfflineProfile(onlineUser.uid);
        setAuthState({
          user: onlineUser,
          offlineUser: null,
          profile,
          isOffline: false,
          isLoading: false,
          lastSyncDate: new Date(),
        });
      } else {
        // User is not authenticated online, check for offline user
        const offlineUser = await getOfflineUser();
        
        // If we have an offline user but no pending magic link, it means we should stay authenticated offline
        // If there's no offline user, or it's a temporary offline user, clear everything
        if (offlineUser && !offlineUser.uid?.startsWith('offline-') && !offlineUser.uid?.startsWith('debug-')) {
          const profile = await getOfflineProfile(offlineUser.uid);
          setAuthState({
            user: null,
            offlineUser,
            profile,
            isOffline: true,
            isLoading: false,
            lastSyncDate: null,
          });
        } else {
          // No valid offline user, clear everything
          console.log('No valid offline user found, clearing auth state');
          setAuthState({
            user: null,
            offlineUser: null,
            profile: null,
            isOffline: false,
            isLoading: false,
            lastSyncDate: null,
          });
        }
      }
    };

    handleAuthChange();
  }, [onlineUser, isOnlineAuthLoading]);



  const syncUserDataToOffline = async (user: User) => {
    try {
      const offlineUserData: OfflineUserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        lastSignInTime: user.metadata.lastSignInTime || new Date().toISOString(),
        createdAt: user.metadata.creationTime || new Date().toISOString(),
      };

      await AsyncStorage.setItem(OFFLINE_AUTH_KEYS.USER_DATA, JSON.stringify(offlineUserData));
      await AsyncStorage.setItem(OFFLINE_AUTH_KEYS.LAST_SYNC, new Date().toISOString());

      // Try to fetch and cache user profile
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data() as UserProfile;
          await AsyncStorage.setItem(
            OFFLINE_AUTH_KEYS.USER_PROFILE, 
            JSON.stringify(profileData)
          );
          
          if (isMounted.current) {
            setAuthState(prev => ({ ...prev, profile: profileData }));
          }
        }
      } catch (profileError) {
        console.warn('Could not sync user profile:', profileError);
      }

      if (isMounted.current) {
        setAuthState(prev => ({ 
          ...prev, 
          offlineUser: offlineUserData,
          lastSyncDate: new Date(),
        }));
      }
    } catch (error) {
      console.error('Error syncing user data to offline:', error);
    }
  };

  const getOfflineUser = async (): Promise<OfflineUserData | null> => {
    try {
      const userData = await AsyncStorage.getItem(OFFLINE_AUTH_KEYS.USER_DATA);
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error getting offline user:', error);
    }
    return null;
  };

  const getOfflineProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
      const profileData = await AsyncStorage.getItem(OFFLINE_AUTH_KEYS.USER_PROFILE);
      if (profileData) {
        return JSON.parse(profileData);
      }
    } catch (error) {
      console.error('Error getting offline profile:', error);
    }
    return null;
  };

  const clearOfflineAuth = async () => {
    try {
      console.log('Clearing offline auth data...');
      await AsyncStorage.multiRemove([
        OFFLINE_AUTH_KEYS.USER_DATA,
        OFFLINE_AUTH_KEYS.AUTH_TOKEN,
        OFFLINE_AUTH_KEYS.LAST_SYNC,
        OFFLINE_AUTH_KEYS.USER_PROFILE,
        'pending_magic_link',
        'pending_email',
        'pending_name'
      ]);
      
      // Force immediate state update
      if (isMounted.current) {
        setAuthState({
          user: null,
          offlineUser: null,
          profile: null,
          isOffline: false,
          isLoading: false,
          lastSyncDate: null,
        });
      }
      
      console.log('Offline auth data cleared successfully');
    } catch (error) {
      console.error('Error clearing offline auth:', error);
    }
  };

  const createMockOfflineUser = async (email: string, displayName: string) => {
    try {
      const mockUser: OfflineUserData = {
        uid: 'debug-user-' + Date.now(),
        email,
        displayName,
        photoURL: null,
        emailVerified: true,
        lastSignInTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      };

      const mockProfile: UserProfile = {
        firstName: displayName.split(' ')[0] || 'Test',
        lastName: displayName.split(' ').slice(1).join(' ') || 'User',
        email,
        marketingOptIn: false,
        createdAt: new Date().toISOString(),
      };

      // Store offline user data
      await AsyncStorage.setItem(OFFLINE_AUTH_KEYS.USER_DATA, JSON.stringify(mockUser));
      await AsyncStorage.setItem(OFFLINE_AUTH_KEYS.USER_PROFILE, JSON.stringify(mockProfile));
      await AsyncStorage.setItem(OFFLINE_AUTH_KEYS.LAST_SYNC, new Date().toISOString());

      // Update state immediately
      if (isMounted.current) {
        setAuthState(prev => ({
          ...prev,
          offlineUser: mockUser,
          profile: mockProfile,
          isOffline: true,
          lastSyncDate: new Date(),
        }));
      }

      return { success: true, user: mockUser };
    } catch (error) {
      console.error('Error creating mock offline user:', error);
      return { success: false, error: 'Failed to create mock user' };
    }
  };

  const clearDebugUser = async () => {
    try {
      await AsyncStorage.multiRemove([
        OFFLINE_AUTH_KEYS.USER_DATA,
        OFFLINE_AUTH_KEYS.USER_PROFILE,
        OFFLINE_AUTH_KEYS.LAST_SYNC,
      ]);
      
      if (isMounted.current) {
        setAuthState(prev => ({
          ...prev,
          offlineUser: null,
          profile: null,
          isOffline: false,
          lastSyncDate: null,
        }));
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error clearing debug user:', error);
      return { success: false, error: 'Failed to clear debug user' };
    }
  };

  const isAuthenticated = authState.user !== null || authState.offlineUser !== null;
  const currentUser = authState.user || authState.offlineUser;
  const currentProfile = authState.profile;

  return {
    ...authState,
    isAuthenticated,
    currentUser,
    currentProfile,
    syncUserDataToOffline,
    clearOfflineAuth,
    getOfflineUser,
    getOfflineProfile,
    createMockOfflineUser,
    clearDebugUser,
  };
} 