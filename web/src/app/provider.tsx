import { ReactNode, useState, useEffect } from 'react';
import type { UserData } from '@/types/general/types';
import type { AuthContextType } from '@/types/general/types';
import { AuthContext } from '@/hooks/authContext';

interface AppProviderProps {
  children: ReactNode;
}

export default function AppProvider({ children }: AppProviderProps) {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const verifyToken = async () => {
    try {
      setIsLoading(true);
      console.log('pog');
      const response = await fetch('http://localhost:8080/auth/verify', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
        setError(null);
        return true;
      } else {
        setUser(null);
        if (response.status === 401) {
          console.log('Session expired or invalid');
        } else {
          setError('Authentication error');
        }
        return false;
      }
    } catch (err) {
      setError('Network error when verifying authentication');
      setUser(null);
      console.log(err);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyToken();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setError(null);
        return true;
      } else {
        const errorText = await response.text();
        setError(errorText || 'Login failed');
        setUser(null);
        return false;
      }
    } catch (err) {
      setError('Network error during login');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setUser(null);
      } else {
        console.error('Logout failed on server, clearing locally');
      }
      setUser(null);
      setError(null);
    } catch (err) {
      console.error('Error during logout:', err);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    refreshAuth: verifyToken
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
