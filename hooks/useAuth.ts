import { useState, useCallback } from 'react';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback(() => {
    // In a real application, this would involve verifying credentials,
    // setting tokens, and fetching user data.
    setIsAuthenticated(true);
  }, []);

  const logout = useCallback(() => {
    // This would clear tokens and user data.
    setIsAuthenticated(false);
  }, []);

  return { isAuthenticated, login, logout };
};
