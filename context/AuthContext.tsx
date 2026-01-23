
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: UserAccount | null;
  login: (id: string, pass: string) => Promise<void>;
  signup: (name: string, id: string, pass: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const session = authService.getCurrentSession();
    setCurrentUser(session);
    setIsLoading(false);
  }, []);

  const login = async (id: string, pass: string) => {
    const user = await authService.login(id, pass);
    setCurrentUser(user);
  };

  const signup = async (name: string, id: string, pass: string) => {
    const user = await authService.register(name, id, pass);
    // Auto login after signup
    await login(id, pass);
  };

  const logout = () => {
    authService.logout();
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
