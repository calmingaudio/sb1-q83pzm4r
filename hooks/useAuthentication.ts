// hooks/useAuthentication.ts
import { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { getFirebaseAuth, db } from "@/services/firebase";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  marketingOptIn: boolean;
  createdAt: any;
}

export function useAuthentication() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const firebaseAuth = getFirebaseAuth();
    const unsubscribeAuth = onAuthStateChanged(firebaseAuth, (authUser) => {
      setUser(authUser);
      setIsLoading(false); // Set loading to false immediately after auth state is known
    });

    return () => unsubscribeAuth();
  }, []);

  // Separate effect for profile data, only runs when there's a user
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    if (user) {
      const userDocRef = doc(db, "users", user.uid);
      unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
        if (doc.exists()) {
          setProfile(doc.data() as UserProfile);
        } else {
          setProfile(null);
        }
      });
    } else {
      setProfile(null);
    }

    return () => {
      if (unsubscribeProfile) {
        unsubscribeProfile();
      }
    };
  }, [user]);

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) {
      console.error("Cannot update profile, no user is logged in.");
      return;
    }
    const userDocRef = doc(db, "users", user.uid);
    try {
      await updateDoc(userDocRef, updates);
    } catch (error) {
      console.error("Error updating user profile in Firestore:", error);
    }
  };

  return { user, profile, isLoading, updateProfile };
}