import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const USER_PROFILE_KEY = 'user_profile';

interface UserProfile {
  name: string;
  goal?: string;
  preFlightFeeling?: string;
  duringFlightFeeling?: string;
  lastFlight?: string;
  primaryFear?: string;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile = await AsyncStorage.getItem(USER_PROFILE_KEY);
      if (savedProfile) {
        setProfile(JSON.parse(savedProfile));
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      const currentProfile = profile || {};
      const updatedProfile = { ...currentProfile, ...updates };
      await AsyncStorage.setItem(USER_PROFILE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Error updating user profile:', error);
    }
  };

  return {
    profile,
    isLoading,
    updateProfile,
  };
}