import React, { createContext, useContext, useState, useEffect } from 'react';
import type {ReactNode} from 'react';
import type { AuthContextType } from '../Types/Index';
import type {UserRole} from '../Types/Index';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('auth_user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    password
    try {
      //Mock login i'll replace with actual API call
      const login = {}
      // const mockUser: User = {
      //   id: '1',
      //   email,
      //   firstName: 'Ednah',
      //   lastName: 'Moraa',
      //   role: email.includes('admin') ? 'admin' : email.includes('lecturer') ? 'lecturer' : 'student',
      // };
      
      const mockToken = 'mock-jwt-token-' + Date.now();
      
      //setUser(mockUser);
     // setToken(mockToken);
      
      // Store in localStorage
      //localStorage.setItem('auth_token', mockToken);
     // localStorage.setItem('auth_user', JSON.stringify(mockUser));
      
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  };

  const isAuthenticated = !!user && !!token;

  const value: AuthContextType = {
    user,
    token,
    login,
    logout,
    isAuthenticated,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};