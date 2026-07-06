'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Theme } from '@/types/inspection';

interface SettingsStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  timerDuration: number; // in seconds
  setTimerDuration: (duration: number) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      theme: 'light',
      setTheme: (theme) => set({ theme }),
      timerDuration: 7200,
      setTimerDuration: (timerDuration) => set({ timerDuration }),
    }),
    { name: 'pdi-settings-store' }
  )
);
