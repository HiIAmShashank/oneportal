import { createContext, useContext } from 'react';
import type { AuthState, UseAuthReturn } from '../types/auth';

export const defaultAuthState: AuthState = {
  isInitialized: false,
  isAuthenticated: false,
  isLoading: true,
  account: null,
  userProfile: null,
  error: null,
};

export type AuthContextValue = UseAuthReturn;

export const AuthContext = createContext<AuthContextValue | null>(null);

AuthContext.displayName = 'AuthContext';

/**
 * Must be used within AuthProvider
 */
export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider. ' +
      'Make sure your component is wrapped with <AuthProvider>.'
    );
  }

  return context;
}

export function useAuthState(): AuthState {
  const { state } = useAuth();
  return state;
}

export function useIsAuthenticated(): boolean {
  const { state } = useAuth();
  return state.isAuthenticated;
}
