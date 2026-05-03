'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Toast } from '@/components/ui/Toast';

type User = {
  name: string;
  email: string;
  role: 'Voter' | 'Candidate' | 'Officer';
  avatar: string;
  joinedAt: number;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, name: string, avatar?: string) => void;
  logout: () => void;
  isLoading: boolean;
  showError: (msg: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' | 'warning' } | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('electra_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const showError = useCallback((msg: string) => {
    setToast({ message: msg, type: 'error' });
  }, []);

  const login = useCallback((email: string, name: string, avatar?: string) => {
    const newUser: User = {
      name,
      email,
      role: 'Voter',
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joinedAt: Date.now()
    };
    setUser(newUser);
    localStorage.setItem('electra_user', JSON.stringify(newUser));
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('electra_user');
  }, []);

  const contextValue = useMemo(() => ({
    user, 
    login, 
    logout, 
    isLoading, 
    showError
  }), [user, login, logout, isLoading, showError]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
      <Toast 
        isVisible={!!toast}
        message={toast?.message || ''}
        type={toast?.type || 'error'}
        onClose={() => setToast(null)}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
