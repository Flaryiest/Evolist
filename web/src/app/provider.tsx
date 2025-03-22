import {
  ReactNode,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef
} from 'react';
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
  const isRefreshing = useRef(false);

  const verifyToken = useCallback(async () => {
    if (isRefreshing.current) return false;

    try {
      setIsLoading(true);
      isRefreshing.current = true;

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
      isRefreshing.current = false;
    }
  }, []);
  useEffect(() => {
    verifyToken();
  }, []);
  const login = useCallback(async (email: string, password: string) => {
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
  }, []);

  const logout = useCallback(async () => {
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
  }, []);

  const updateTaskStatus = useCallback(
    (taskId: number, newStatus: boolean) => {
      if (!user) return;

      setUser((prevUser) => {
        if (!prevUser || !prevUser.tasks) return prevUser;

        const updatedTasks = prevUser.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );

        return {
          ...prevUser,
          tasks: updatedTasks
        };
      });
    },
    [user]
  );

  const contextValue = useMemo<AuthContextType>(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      refreshAuth: verifyToken,
      updateTaskStatus
    }),
    [user, isLoading, error, login, logout, verifyToken, updateTaskStatus]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
