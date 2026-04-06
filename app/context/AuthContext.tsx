import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  getCurrentUserEmail,
  setCurrentUserEmail,
  clearCurrentUserEmail,
  hashPassword,
  storeUserCredentials,
  getStoredPasswordHash,
  hasAccount,
} from '../lib/storage';
import { AuthState } from '../lib/types';

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      const email = await getCurrentUserEmail();
      if (mounted) {
        setUserEmail(email);
        setIsLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    const passwordHash = await hashPassword(password);
    const storedHash = await getStoredPasswordHash(normalized);

    if (!storedHash || storedHash !== passwordHash) {
      throw new Error('Email or password is incorrect.');
    }

    await setCurrentUserEmail(normalized);
    setUserEmail(normalized);
  };

  const signUp = async (email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized.includes('@')) {
      throw new Error('Please provide a valid email address.');
    }

    const accountExists = await hasAccount(normalized);
    if (accountExists) {
      throw new Error('An account with this email already exists.');
    }

    const passwordHash = await hashPassword(password);
    await storeUserCredentials(normalized, passwordHash);
    await setCurrentUserEmail(normalized);
    setUserEmail(normalized);
  };

  const signOut = async () => {
    await clearCurrentUserEmail();
    setUserEmail(null);
  };

  const contextValue: AuthState = {
    userEmail,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
}
