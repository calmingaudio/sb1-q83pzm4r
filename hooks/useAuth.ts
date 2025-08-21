import { useState, useEffect, useRef } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  updateProfile,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  OAuthProvider,
  deleteUser,
  reauthenticateWithCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import { getFirebaseAuth, db } from '@/services/firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";
import { Alert } from "react-native";
import * as Linking from 'expo-linking';
import { router } from 'expo-router';

const PENDING_EMAIL_KEY = 'pending_email';
const PENDING_NAME_KEY = 'pending_name';

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  marketingOptIn: boolean;
  createdAt: any;
}

// Helper to generate a random nonce
const generateNonce = (length: number): string => {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

const createProfileIfNotExists = async (
  user: User,
  firstName: string,
  lastName: string,
  marketingOptIn: boolean
) => {
  const userDocRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userDocRef);

  if (!userDoc.exists()) {
    const newProfile = {
      firstName: firstName,
      lastName: lastName,
      email: user.email,
      marketingOptIn: marketingOptIn,
      createdAt: serverTimestamp(),
    };
    await setDoc(userDocRef, newProfile);
  }
};

export function useAuth() {
  const isMounted = useRef(true);
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        console.log('Auth state changed:', user ? 'User logged in' : 'User logged out');
        if (isMounted.current) {
          setAuthState({
            user,
            isLoading: false,
          });

          // Note: Offline syncing is now handled by useOfflineAuth to avoid duplication
        }
      });

      // Set up deep link listener for magic links
      const subscription = Linking.addEventListener('url', handleDeepLink);

      // Check for initial URL (app opened via deep link)
      Linking.getInitialURL().then((url) => {
        if (url) {
          handleDeepLink({ url });
        }
      });

      return () => {
        subscription?.remove();
        unsubscribe();
      };
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      // Set loading to false even if Firebase fails
      if (isMounted.current) {
        setAuthState({
          user: null,
          isLoading: false,
        });
      }
    }
  }, []);

  const handleDeepLink = async ({ url }: { url: string }) => {
    try {
      console.log('Handling deep link:', url);
      const auth = getFirebaseAuth();
      
      // Check if this is a magic link
      if (isSignInWithEmailLink(auth, url)) {
        console.log('Magic link detected, processing...');
        
        // Get the email from AsyncStorage
        const email = await AsyncStorage.getItem(PENDING_EMAIL_KEY);
        const name = await AsyncStorage.getItem(PENDING_NAME_KEY);
        
        console.log('Stored email:', email);
        console.log('Stored name:', name);
        
        if (!email) {
          console.error('No pending email found for magic link');
          Alert.alert(
            'Magic Link Error',
            'No pending email found. Please try signing in again.'
          );
          return;
        }
        
        // Complete the sign-in
        const result = await signInWithEmailLink(auth, email, url);
        console.log('Sign-in result:', result);
        
        // Check if this was an offline user completing verification
        const hasPending = await hasPendingMagicLink();
        if (hasPending) {
          await completeOfflineUserVerification(email, result.user);
        }
        
        // If this was a sign-up flow and we have a name, update the profile
        if (result.user && name) {
          await updateProfile(result.user, { displayName: name });
          
          // Extract first and last name from displayName
          const nameParts = name.split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.slice(1).join(' ') || '';
          
          // Create profile in Firestore
          await createProfileIfNotExists(result.user, firstName, lastName, false);
        }
        
        // Clean up stored data (only if not handling offline user verification)
        if (!hasPending) {
          await AsyncStorage.multiRemove([PENDING_EMAIL_KEY, PENDING_NAME_KEY]);
        }
        
        console.log('Magic link sign-in successful');
        
        // Note: User data syncing is handled by useOfflineAuth when auth state changes
        
        // Wait for the OfflineProvider to update its state
        console.log('Waiting for auth state to update...');
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Navigate to the main app after successful sign-in
        console.log('Navigating to main app after magic link sign-in');
        router.replace('/(tabs)');
      } else {
        console.log('Not a magic link or already processed');
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
      Alert.alert(
        'Magic Link Error',
        'There was an error processing the magic link. Please try signing in again.'
      );
    }
  };



  const signInWithEmail = async (email: string, password: string) => {
    try {
      const auth = getFirebaseAuth();
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signUpWithEmail = async (email: string, password: string, displayName: string) => {
    try {
      const auth = getFirebaseAuth();
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      if (result.user) {
        await updateProfile(result.user, { displayName });
        
        // Extract first and last name from displayName
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        // Create profile in Firestore
        await createProfileIfNotExists(result.user, firstName, lastName, false);
      }
      
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const sendMagicLink = async (email: string, name?: string) => {
    try {
      const auth = getFirebaseAuth();
      const actionCodeSettings = {
        url: 'https://skycalm-a8562.web.app/auth', // Firebase hosting URL as fallback
        handleCodeInApp: true,
        iOS: {
          bundleId: 'com.skycalm.app',
        },
        android: {
          packageName: 'com.calmingaudio.skycalm',
          installApp: true,
        },
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Store email and name for later use
      await AsyncStorage.setItem(PENDING_EMAIL_KEY, email);
      if (name) {
        await AsyncStorage.setItem(PENDING_NAME_KEY, name);
      }
      
      return { success: true };
    } catch (error: any) {
      console.error('Magic link error:', error);
      return { success: false, error: error.message || 'Failed to send magic link' };
    }
  };

  // New method: Create offline user for immediate access
  const createOfflineUser = async (email: string, name: string) => {
    try {
      const offlineUserData = {
        uid: 'offline-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9),
        email,
        displayName: name,
        photoURL: null,
        emailVerified: false, // Will be verified when they complete magic link
        lastSignInTime: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        isOfflineUser: true, // Flag to identify offline users
        pendingMagicLink: true, // Flag to indicate magic link is pending
      };

      // Store offline user data
      await AsyncStorage.setItem('offline_user_data', JSON.stringify(offlineUserData));
      await AsyncStorage.setItem('offline_auth_last_sync', new Date().toISOString());
      
      // Store pending magic link info
      await AsyncStorage.setItem(PENDING_EMAIL_KEY, email);
      await AsyncStorage.setItem(PENDING_NAME_KEY, name);
      await AsyncStorage.setItem('pending_magic_link', 'true');

      return { success: true, user: offlineUserData };
    } catch (error: any) {
      console.error('Error creating offline user:', error);
      return { success: false, error: error.message || 'Failed to create offline user' };
    }
  };

  // New method: Complete offline user verification when magic link is processed
  const completeOfflineUserVerification = async (email: string, firebaseUser: User) => {
    try {
      // Get the offline user data
      const offlineUserDataStr = await AsyncStorage.getItem('offline_user_data');
      if (!offlineUserDataStr) {
        console.log('No offline user data found, proceeding with normal flow');
        return { success: true };
      }

      const offlineUserData = JSON.parse(offlineUserDataStr);
      
      // Update offline user data with Firebase user info
      const updatedOfflineUserData = {
        ...offlineUserData,
        uid: firebaseUser.uid, // Use real Firebase UID
        emailVerified: firebaseUser.emailVerified,
        lastSignInTime: firebaseUser.metadata.lastSignInTime || new Date().toISOString(),
        isOfflineUser: false, // No longer an offline user
        pendingMagicLink: false, // Magic link completed
      };

      // Update stored data
      await AsyncStorage.setItem('offline_user_data', JSON.stringify(updatedOfflineUserData));
      await AsyncStorage.setItem('offline_auth_last_sync', new Date().toISOString());
      
      // Clear pending magic link flags
      await AsyncStorage.multiRemove([
        'pending_magic_link',
        PENDING_EMAIL_KEY,
        PENDING_NAME_KEY
      ]);

      return { success: true };
    } catch (error: any) {
      console.error('Error completing offline user verification:', error);
      return { success: false, error: error.message };
    }
  };

  // New method: Check if user has pending magic link
  const hasPendingMagicLink = async () => {
    try {
      const pendingMagicLink = await AsyncStorage.getItem('pending_magic_link');
      const pendingEmail = await AsyncStorage.getItem(PENDING_EMAIL_KEY);
      return pendingMagicLink === 'true' && !!pendingEmail;
    } catch (error) {
      return false;
    }
  };

  // New method: Get offline user data
  const getOfflineUser = async () => {
    try {
      const offlineUserData = await AsyncStorage.getItem('offline_user_data');
      if (offlineUserData) {
        return JSON.parse(offlineUserData);
      }
    } catch (error) {
      console.error('Error getting offline user:', error);
    }
    return null;
  };

  const signInWithGoogle = async (idToken: string) => {
    try {
      const auth = getFirebaseAuth();
      const credential = GoogleAuthProvider.credential(idToken);
      const result = await signInWithCredential(auth, credential);
      
      // Create profile if it doesn't exist
      if (result.user) {
        const displayName = result.user.displayName || 'User';
        const nameParts = displayName.split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        await createProfileIfNotExists(result.user, firstName, lastName, false);
      }
      
      return { success: true, user: result.user };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const signInWithApple = async () => {
    try {
      const auth = getFirebaseAuth();
      const rawNonce = generateNonce(32);
      const hashedNonce = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        rawNonce
      );

      // This is the only time we get the user's name from Apple
      const appleCredentialResponse = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
        nonce: hashedNonce,
      });

      // Capture the fullName object immediately
      const { identityToken, fullName } = appleCredentialResponse;

      if (identityToken) {
        const provider = new OAuthProvider("apple.com");
        const credential = provider.credential({
          idToken: identityToken,
          rawNonce: rawNonce,
        });
        const userCredential = await signInWithCredential(
          auth,
          credential
        );

        const firstName = fullName?.givenName || "Traveler";
        const lastName = fullName?.familyName || "";

        await createProfileIfNotExists(
          userCredential.user,
          firstName,
          lastName,
          false
        );
        
        return { success: true, user: userCredential.user };
      } else {
        throw new Error("No identityToken received from Apple.");
      }
    } catch (e: any) {
      console.error("Apple Sign-In Error Details:", {
        code: e.code,
        message: e.message,
        error: e
      });
      
      if (e.code === "ERR_REQUEST_CANCELED") {
        return { success: false, error: "Sign-in was canceled" };
      } else if (e.code === "ERR_REQUEST_UNKNOWN") {
        return { 
          success: false, 
          error: "Apple Sign-In failed. Please ensure you're testing on a real device and your Apple ID is properly configured." 
        };
      } else {
        return { success: false, error: e.message || "Apple Sign-In failed" };
      }
    }
  };

  const deleteAccount = async () => {
    const auth = getFirebaseAuth();
    const user = auth.currentUser;

    if (!user) {
      throw new Error("No user is currently signed in to delete.");
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);
      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
      return { success: true };
    } catch (e: any) {
      if (e.code === "auth/requires-recent-login") {
        Alert.alert(
          "Action Required",
          "This is a sensitive action. Please sign out and sign back in before deleting your account."
        );
      } else {
        console.error("Error deleting account:", e);
        Alert.alert("Error", "Could not delete your account. Please try again.");
      }
      return { success: false, error: e.message };
    }
  };

  const logout = async () => {
    try {
      console.log('Starting logout process...');
      const auth = getFirebaseAuth();
      await signOut(auth);
      console.log('Firebase signOut completed');
      
      // Clear ALL auth-related data
      await AsyncStorage.multiRemove([
        PENDING_EMAIL_KEY,
        PENDING_NAME_KEY,
        'offline_user_data',
        'offline_user_profile',
        'offline_auth_last_sync',
        'pending_magic_link',
        'offline_auth_token'
      ]);
      console.log('All auth data cleared');
      
      // Also clear any remaining offline auth state
      await clearOfflineAuth();
      
      // Force a longer delay to ensure all state updates are processed
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Don't navigate here - let the main navigation logic handle it
      console.log('Logout completed, waiting for navigation logic');
      
      return { success: true };
    } catch (error: any) {
      console.error('Logout error:', error);
      return { success: false, error: error.message };
    }
  };

  const clearOfflineAuth = async () => {
    try {
      // Clear all offline authentication data
      await AsyncStorage.multiRemove([
        'offline_user_data',
        'offline_user_profile',
        'offline_auth_last_sync',
        'pending_magic_link',
        PENDING_EMAIL_KEY,
        PENDING_NAME_KEY
      ]);
      
      return { success: true };
    } catch (error: any) {
      console.error('Error clearing offline auth:', error);
      return { success: false, error: error.message };
    }
  };

  const isAuthenticated = authState.user !== null;

  return {
    ...authState,
    isAuthenticated,
    signInWithEmail,
    signUpWithEmail,
    sendMagicLink,
    signInWithGoogle,
    signInWithApple,
    deleteAccount,
    logout,
    createOfflineUser,
    completeOfflineUserVerification,
    hasPendingMagicLink,
    getOfflineUser,
    clearOfflineAuth,
  };
} 