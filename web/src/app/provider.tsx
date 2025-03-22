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
  const lastRefreshTime = useRef(0);

  const verifyToken = useCallback(async (forceRefresh = false) => {
    if (isRefreshing.current) {
      console.log('Auth refresh already in progress, skipping');
      return false;
    }

    const now = Date.now();
    if (!forceRefresh && now - lastRefreshTime.current < 2000) {
      console.log('Auth refresh rate limited, skipping');
      return true;
    }

    try {
      console.log('Starting auth verification...');
      setIsLoading(true);
      isRefreshing.current = true;
      lastRefreshTime.current = now;

      const cacheOptions = {
        cache: 'no-store',
        headers: {
          Pragma: 'no-cache',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      };

      const response = await fetch('http://localhost:8080/auth/verify', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          ...cacheOptions.headers
        }
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('Auth verification successful, new user data:', userData);

        const hasChanged =
          JSON.stringify(userData.user) !== JSON.stringify(user);
        if (hasChanged) {
          console.log('User data has changed, updating state');
          setUser(userData.user);
        } else {
          console.log('User data unchanged');
        }

        setError(null);
        return true;
      } else {
        console.error(
          `Auth verification failed: ${response.status} ${response.statusText}`
        );
        setUser(null);
        if (response.status === 401) {
          console.log('Session expired or invalid');
        } else {
          setError('Authentication error');
        }
        return false;
      }
    } catch (err) {
      console.error('Network error when verifying authentication:', err);
      setError('Network error when verifying authentication');
      setUser(null);
      return false;
    } finally {
      setIsLoading(false);
      isRefreshing.current = false;
    }
  }, []);

  useEffect(() => {
    console.log('Initial auth check...');
    verifyToken(true);
  }, [verifyToken]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      console.log('Attempting login...');

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
        console.log('Login successful, user data:', userData);
        setUser(userData);
        setError(null);
        return true;
      } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        setError(errorText || 'Login failed');
        setUser(null);
        return false;
      }
    } catch (err) {
      console.error('Network error during login:', err);
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
      console.log('Attempting logout...');

      const response = await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        console.log('Logout successful');
        setUser(null);
      } else {
        console.error('Logout failed on server, clearing locally');
        setUser(null);
      }
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

      console.log(`Updating task ${taskId} status to ${newStatus} in context`);

      setUser((prevUser) => {
        if (!prevUser || !prevUser.tasks) return prevUser;

        const updatedTasks = prevUser.tasks.map((task) =>
          task.id === taskId ? { ...task, status: newStatus } : task
        );

        console.log('Tasks after update:', updatedTasks);

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
      refreshAuth: () => verifyToken(true),
      updateTaskStatus
    }),
    [user, isLoading, error, login, logout, verifyToken, updateTaskStatus]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
