'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  name: string;
  email: string;
  role: 'Voter' | 'Candidate' | 'Officer';
  avatar: string;
  joinedAt: number;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, name: string) => void;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('electra_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, name: string) => {
    const newUser: User = {
      name,
      email,
      role: 'Voter',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      joinedAt: Date.now()
    };
    setUser(newUser);
    localStorage.setItem('electra_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('electra_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
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
