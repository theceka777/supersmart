import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AppState {
  highScores: { arcade: number; classic: number; daily: number };
  avatar: { color: string; eyes: string; mouth: string };
  dailyStatus: { date: string; played: boolean; score: number; results: boolean[] };
}

interface AppActions {
  updateHighScore: (mode: 'arcade' | 'classic' | 'daily', score: number) => void;
  updateAvatar: (updates: Partial<AppState['avatar']>) => void;
  setDailyPlayed: (score: number, results: boolean[]) => void;
}

type AppContextType = AppState & AppActions;

const defaultState: AppState = {
  highScores: { arcade: 0, classic: 0, daily: 0 },
  avatar: { color: '#FF6B9D', eyes: 'round', mouth: 'smile' },
  dailyStatus: { date: '', played: false, score: 0, results: [] },
};

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(defaultState);

  const updateHighScore = (mode: 'arcade' | 'classic' | 'daily', score: number) => {
    setState(s => ({
      ...s,
      highScores: { ...s.highScores, [mode]: Math.max(s.highScores[mode], score) },
    }));
  };

  const updateAvatar = (updates: Partial<AppState['avatar']>) => {
    setState(s => ({ ...s, avatar: { ...s.avatar, ...updates } }));
  };

  const today = new Date().toISOString().split('T')[0];

  const setDailyPlayed = (score: number, results: boolean[]) => {
    setState(s => ({
      ...s,
      dailyStatus: { date: today, played: true, score, results },
      highScores: { ...s.highScores, daily: Math.max(s.highScores.daily, score) },
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, updateHighScore, updateAvatar, setDailyPlayed }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
