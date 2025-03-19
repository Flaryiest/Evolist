import { createContext, useContext } from 'react';
import type { AuthContextType } from '@/types/general/types';

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  login: async () => false,
  logout: async () => {},
  refreshAuth: async () => false
});

export const useAuth = () => useContext(AuthContext);
