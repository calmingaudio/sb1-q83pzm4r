// services/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1aMfrmOi7g8aW5Ruu_kYHDD73-tDOIow",
  authDomain: "skycalm-a8562.firebaseapp.com",
  projectId: "skycalm-a8562",
  storageBucket: "skycalm-a8562.appspot.com",
  messagingSenderId: "624088439649",
  appId: "1:624088439649:ios:cc31b569fbbb56077dc320",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Declare a variable to hold the auth instance, but don't create it yet.
let auth: Auth;

// Export a function that will create the instance on its first call.
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    // Use initializeAuth with AsyncStorage persistence instead of getAuth()
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage)
    });
  }
  return auth;
};

export const db = getFirestore(app);

// Suppress Firebase warnings in development mode
if (__DEV__) {
  // Override console.warn to filter out Firebase connection warnings
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string') {
      // Filter out common Firebase connection warnings
      if (
        message.includes('WebChannelConnection RPC') ||
        message.includes('transport errored') ||
        message.includes('Firestore') ||
        message.includes('Listen stream')
      ) {
        // Suppress these warnings in development
        return;
      }
    }
    originalWarn.apply(console, args);
  };
}

// Helper functions for offline/online management
export const enableFirestoreNetwork = async () => {
  try {
    await enableNetwork(db);
    console.log('Firestore network enabled');
  } catch (error) {
    console.warn('Failed to enable Firestore network:', error);
  }
};

export const disableFirestoreNetwork = async () => {
  try {
    await disableNetwork(db);
    console.log('Firestore network disabled');
  } catch (error) {
    console.warn('Failed to disable Firestore network:', error);
  }
};