import React, { createContext, useContext, useRef, useState } from 'react';
import type { AuthUser } from '../types/authTypes';

type AppRole = 'driver' | 'operator' | 'parcel_sender';

type AuthSessionContextValue = {
  currentUser: AuthUser | null;
  sessionToken: string | null;
  setCurrentUser: (user: AuthUser | null) => void;
  setSessionToken: (token: string | null) => void;
  clearCurrentUser: () => void;
};

const AuthSessionContext = createContext<AuthSessionContextValue | undefined>(undefined);

export function normalizeAppRole(role: string | undefined): AppRole {
  const normalizedRole = role?.trim().toLowerCase().replace(/[\s-]+/g, '_') ?? '';

  if (normalizedRole === 'operator' || normalizedRole.includes('operator')) {
    return 'operator';
  }

  if (normalizedRole === 'driver' || normalizedRole.includes('driver')) {
    return 'driver';
  }

  // 'customer' and 'parcel_sender' both go to the sender home
  return 'parcel_sender';
}

// Module-level ref so api.ts can access the token without React context
let _sessionToken: string | null = null;
export function getStoredSessionToken() { return _sessionToken; }
export function storeSessionToken(token: string | null) { _sessionToken = token; }

export function AuthSessionProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [sessionToken, setSessionTokenState] = useState<string | null>(null);

  const setSessionToken = (token: string | null) => {
    _sessionToken = token;
    setSessionTokenState(token);
  };

  return (
    <AuthSessionContext.Provider
      value={{
        currentUser,
        sessionToken,
        setCurrentUser,
        setSessionToken,
        clearCurrentUser: () => {
          setCurrentUser(null);
          setSessionToken(null);
        },
      }}
    >
      {children}
    </AuthSessionContext.Provider>
  );
}

export function useAuthSession() {
  const context = useContext(AuthSessionContext);

  if (!context) {
    throw new Error('useAuthSession must be used within an AuthSessionProvider.');
  }

  return context;
}
