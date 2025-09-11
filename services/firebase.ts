// services/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore, connectFirestoreEmulator, enableNetwork, disableNetwork } from "firebase/firestore";

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

// Validate Firebase configuration
const validateFirebaseConfig = () => {
  const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  const missingKeys = requiredKeys.filter(key => !firebaseConfig[key as keyof typeof firebaseConfig]);
  
  if (missingKeys.length > 0) {
    console.error('Missing Firebase configuration keys:', missingKeys);
    console.error('Firebase config:', {
      apiKey: firebaseConfig.apiKey ? 'Set' : 'Missing',
      authDomain: firebaseConfig.authDomain ? 'Set' : 'Missing',
      projectId: firebaseConfig.projectId ? 'Set' : 'Missing',
      storageBucket: firebaseConfig.storageBucket ? 'Set' : 'Missing',
      messagingSenderId: firebaseConfig.messagingSenderId ? 'Set' : 'Missing',
      appId: firebaseConfig.appId ? 'Set' : 'Missing',
    });
    throw new Error(`Missing Firebase configuration: ${missingKeys.join(', ')}`);
  }
  
  return true;
};

// Initialize Firebase app with error handling
let app;
try {
  validateFirebaseConfig();
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  console.log('Firebase app initialized successfully');
} catch (error) {
  console.error('Failed to initialize Firebase app:', error);
  // Create a minimal app for development/testing
  app = !getApps().length ? initializeApp({
    apiKey: 'dummy-key',
    authDomain: 'dummy.firebaseapp.com',
    projectId: 'dummy-project',
    storageBucket: 'dummy.appspot.com',
    messagingSenderId: '123456789',
    appId: 'dummy-app-id',
  }) : getApp();
}

// Declare a variable to hold the auth instance, but don't create it yet.
let auth: Auth;

// Export a function that will create the instance on its first call.
export const getFirebaseAuth = (): Auth => {
  if (!auth) {
    try {
      // Use initializeAuth with AsyncStorage persistence instead of getAuth()
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });
      console.log('Firebase Auth initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Firebase Auth:', error);
      // If initialization fails, try to get existing auth instance
      try {
        const { getAuth } = require('firebase/auth');
        auth = getAuth(app);
        console.log('Using existing Firebase Auth instance');
      } catch (fallbackError) {
        console.error('Failed to get existing Firebase Auth instance:', fallbackError);
        throw new Error('Firebase Auth initialization failed');
      }
    }
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