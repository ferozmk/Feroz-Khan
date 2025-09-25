import { useState, useEffect, useCallback } from 'react';
// Import both the auth instance and the firebase namespace from the centralized service.
import firebase, { auth } from '../services/firebase';

export const useAuth = () => {
  // The firebase.User type is now available via the imported firebase object.
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged is the primary mechanism for tracking user auth state.
    // It will fire when the app loads and any time the user signs in or out.
    // Use the v8 compat `onAuthStateChanged` method.
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const logout = useCallback(async () => {
    try {
      // Use the v8 compat `signOut` method.
      await auth.signOut();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  }, []);

  return { user, loading, logout };
};
