import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { RemoteApp } from '@one-portal/types';

interface AppState {
  activeApp: RemoteApp | null;
  isLoading: boolean;
  error: Error | null;
  availableApps: RemoteApp[];
  setActiveApp: (app: RemoteApp | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: Error | null) => void;
  setAvailableApps: (apps: RemoteApp[]) => void;
  clearError: () => void;
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      // Initial state
      activeApp: null,
      isLoading: false,
      error: null,
      availableApps: [],

      // Actions
      setActiveApp: (app) =>
        set({ activeApp: app, error: null }, false, 'setActiveApp'),

      setLoading: (loading) => set({ isLoading: loading }, false, 'setLoading'),

      setError: (error) =>
        set({ error, isLoading: false }, false, 'setError'),

      setAvailableApps: (apps) =>
        set({ availableApps: apps }, false, 'setAvailableApps'),

      clearError: () => set({ error: null }, false, 'clearError'),
    }),
    { name: 'AppStore' }
  )
);
