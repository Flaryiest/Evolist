interface UserData {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthContextType {
  user: UserData | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
}
export type { UserData, AuthContextType };
