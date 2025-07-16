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
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (isMounted.current) {
        setAuthState({
          user,
          isLoading: false,
        });

        // Sync user data to offline storage when auth state changes
        if (user) {
          await syncUserDataToOffline(user);
        }
      }
    });

    // Check if this is a magic link sign-in
    checkMagicLinkSignIn();

    return unsubscribe;
  }, []);

  const syncUserDataToOffline = async (user: User) => {
    try {
      const offlineUserData = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
        lastSignInTime: user.metadata.lastSignInTime || new Date().toISOString(),
        createdAt: user.metadata.creationTime || new Date().toISOString(),
      };

      await AsyncStorage.setItem('offline_user_data', JSON.stringify(offlineUserData));
      await AsyncStorage.setItem('offline_auth_last_sync', new Date().toISOString());

      // Try to fetch and cache user profile
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const profileData = userDoc.data();
          await AsyncStorage.setItem('offline_user_profile', JSON.stringify(profileData));
        }
      } catch (profileError) {
        console.warn('Could not sync user profile:', profileError);
      }
    } catch (error) {
      console.error('Error syncing user data to offline:', error);
    }
  };

  const checkMagicLinkSignIn = async () => {
    try {
      const auth = getFirebaseAuth();
      // For React Native, we need to handle magic links differently
      // This would typically be handled through deep linking
      // For now, we'll keep the web logic but adapt it for React Native
      if (isSignInWithEmailLink(auth, 'dummy-url')) {
        let email = await AsyncStorage.getItem(PENDING_EMAIL_KEY);
        const name = await AsyncStorage.getItem(PENDING_NAME_KEY);
        
        if (!email) {
          // In React Native, we'd typically get this from the deep link
          // For now, we'll skip this flow
          return;
        }
        
        if (email) {
          const result = await signInWithEmailLink(auth, email, 'dummy-url');
          
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
          
          // Clean up stored data
          await AsyncStorage.multiRemove([PENDING_EMAIL_KEY, PENDING_NAME_KEY]);
        }
      }
    } catch (error) {
      console.error('Error with magic link sign-in:', error);
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
        url: 'skycalm://auth', // Deep link URL for React Native
        handleCodeInApp: true,
      };

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      
      // Store email and name for later use
      await AsyncStorage.setItem(PENDING_EMAIL_KEY, email);
      if (name) {
        await AsyncStorage.setItem(PENDING_NAME_KEY, name);
      }
      
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
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
      const auth = getFirebaseAuth();
      await signOut(auth);
      await AsyncStorage.multiRemove([PENDING_EMAIL_KEY, PENDING_NAME_KEY]);
      return { success: true };
    } catch (error: any) {
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
  };
} 