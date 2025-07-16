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

export function useOfflineAuth() {
  const isMounted = useRef(true);
  const [authState, setAuthState] = useState<OfflineAuthState>({
    user: null,
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
    initializeOfflineAuth();
  }, []);

  const initializeOfflineAuth = async () => {
    try {
      // First, try to get online auth state
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      
      if (currentUser) {
        // User is authenticated online
        await syncUserDataToOffline(currentUser);
        setAuthState(prev => ({
          ...prev,
          user: currentUser,
          isOffline: false,
          isLoading: false,
        }));
      } else {
        // Check for offline cached user
        const offlineUser = await getOfflineUser();
        if (offlineUser) {
          setAuthState(prev => ({
            ...prev,
            offlineUser,
            isOffline: true,
            isLoading: false,
          }));
          
          // Try to get cached profile
          const profile = await getOfflineProfile(offlineUser.uid);
          if (profile) {
            setAuthState(prev => ({ ...prev, profile }));
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      }
    } catch (error) {
      console.error('Error initializing offline auth:', error);
      // Fallback to offline mode
      const offlineUser = await getOfflineUser();
      setAuthState(prev => ({
        ...prev,
        offlineUser,
        isOffline: true,
        isLoading: false,
      }));
    }
  };

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
      await AsyncStorage.multiRemove([
        OFFLINE_AUTH_KEYS.USER_DATA,
        OFFLINE_AUTH_KEYS.AUTH_TOKEN,
        OFFLINE_AUTH_KEYS.LAST_SYNC,
        OFFLINE_AUTH_KEYS.USER_PROFILE,
      ]);
      
      if (isMounted.current) {
        setAuthState(prev => ({
          ...prev,
          user: null,
          offlineUser: null,
          profile: null,
          isOffline: false,
          lastSyncDate: null,
        }));
      }
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