import { createContext, useContext, useState, type ReactNode } from 'react';
import { authApi } from '../services/api';
import type { User, AuthContextType } from '../types';
import { STORAGE_KEYS } from '../constants/app';
import { safeJsonParse } from '../utils/helpers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

// Cargar estado de autenticación desde localStorage
function getInitialAuthState(): { token: string | null; user: User | null } {
  const storedToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  const storedUser = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
  
  return {
    token: storedToken,
    user: storedUser ? safeJsonParse<User>(storedUser, {} as User) : null,
  };
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initialState = getInitialAuthState();
  const [user, setUser] = useState<User | null>(initialState.user);
  const [token, setToken] = useState<string | null>(initialState.token);
  const [loading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      const response = await authApi.login({ email, password });
      
      // Store token and user data
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, response.access_token);
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(response.user));
      
      setToken(response.access_token);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = (): void => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    setToken(null);
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
