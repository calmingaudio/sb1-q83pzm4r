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
      if (authUser) {
        setUser(authUser);
        // User is logged in, now listen for their profile data.
        const userDocRef = doc(db, "users", authUser.uid);
        const unsubscribeProfile = onSnapshot(userDocRef, (doc) => {
          if (doc.exists()) {
            setProfile(doc.data() as UserProfile);
          } else {
            // Profile doesn't exist in Firestore yet.
            setProfile(null);
          }
          setIsLoading(false); // Loading is finished only after we get a profile response.
        });
        return () => unsubscribeProfile(); // Cleanup profile listener
      } else {
        // User is logged out.
        setUser(null);
        setProfile(null);
        setIsLoading(false); // Loading is finished.
      }
    });

    return () => unsubscribeAuth(); // Cleanup auth listener
  }, []);

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