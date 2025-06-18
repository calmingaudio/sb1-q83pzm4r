// services/firebase.ts
import { initializeApp, getApp, getApps } from "firebase/app";
import { initializeAuth, getReactNativePersistence, Auth } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from "firebase/firestore";

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