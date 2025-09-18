import { useState, useEffect, useCallback } from 'react';

export const useRouter = () => {
  // Initialize state with the current hash, defaulting to '/'
  const [path, setPath] = useState(window.location.hash.slice(1) || '/');

  const handleHashChange = useCallback(() => {
    setPath(window.location.hash.slice(1) || '/');
  }, []);

  useEffect(() => {
    // Set up the event listener
    window.addEventListener('hashchange', handleHashChange);

    // Clean up the event listener
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [handleHashChange]);

  const navigate = (newPath: string) => {
    if ((window.location.hash.slice(1) || '/') !== newPath) {
        window.location.hash = newPath;
    }
  };

  return { path, navigate };
};
