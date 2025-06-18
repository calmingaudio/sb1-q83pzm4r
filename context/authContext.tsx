// context/authContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Alert } from "react-native";
import {
  Auth,
  User,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  signInWithCredential,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithEmailAndPassword,
  OAuthProvider,
  deleteUser,
  reauthenticateWithCredential,
} from "firebase/auth";
import { db, getFirebaseAuth } from "@/services/firebase";
import { doc, setDoc, getDoc, serverTimestamp, deleteDoc } from "firebase/firestore";
import * as AppleAuthentication from "expo-apple-authentication";
import * as Crypto from "expo-crypto";

interface AuthContextType {
  isMutating: boolean;
  error: Error | null;
  signInWithApple: () => Promise<void>;
  signUpWithEmail: (firstName: string, lastName: string, email: string, password: string, marketingOptIn: boolean) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

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

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const signUpWithEmail = async (
    firstName: string,
    lastName: string,
    email: string, 
    password: string,
    marketingOptIn: boolean
  ) => {
    setIsMutating(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
      const userCredential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        password
      );
      await createProfileIfNotExists(
        userCredential.user,
        firstName,
        lastName,
        marketingOptIn
      );
      await sendEmailVerification(userCredential.user);
      Alert.alert(
        "Verification Email Sent",
        "Please check your email to verify your account."
      );
      await firebaseSignOut(firebaseAuth);
    } catch (e: any) {
      setError(e);
      throw e;
    } finally {
      setIsMutating(false);
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    setIsMutating(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
      await signInWithEmailAndPassword(firebaseAuth, email, password);
    } catch (e: any) {
      setError(e);
      throw e;
    } finally {
      setIsMutating(false);
    }
  };

  const signInWithApple = async () => {
    setIsMutating(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
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
          firebaseAuth,
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
      } else {
        throw new Error("No identityToken received from Apple.");
      }
    } catch (e: any) {
      if (e.code === "ERR_REQUEST_CANCELED") {
        console.log("Apple Sign-In canceled by user.");
      } else {
        console.error("Apple Sign-In Error:", e);
        setError(e);
      }
    } finally {
      setIsMutating(false);
    }
  };

  const signOut = async () => {
    setIsMutating(true);
    setError(null);
    try {
      const firebaseAuth = getFirebaseAuth();
      await firebaseSignOut(firebaseAuth);
      // onAuthStateChanged will set user to null
    } catch (e: any) {
      console.error("Sign Out Error:", e);
      setError(e);
    } finally {
      setIsMutating(false);
    }
  };

  const deleteAccount = async () => {
    const firebaseAuth = getFirebaseAuth();
    const user = firebaseAuth.currentUser;

    if (!user) {
      throw new Error("No user is currently signed in to delete.");
    }

    setIsMutating(true);
    setError(null);
    try {
      const userDocRef = doc(db, "users", user.uid);
      await deleteDoc(userDocRef);
      await deleteUser(user);
      Alert.alert("Account Deleted", "Your account has been successfully deleted.");
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
      throw e;
    } finally {
      setIsMutating(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ 
        isMutating,
        error, 
        signInWithApple, 
        signUpWithEmail, 
        signInWithEmail,
        signOut,
        deleteAccount
       }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};