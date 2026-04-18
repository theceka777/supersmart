import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface AppState {
  highScores: { arcade: number; classic: number; daily: number };
  avatar: { color: string; eyes: string; mouth: string };
  dailyStatus: { date: string; played: boolean; score: number; results: boolean[] };
  freePlay: { date: string; playsToday: number; oneMoreTaps: number };
}

interface AppActions {
  updateHighScore: (mode: 'arcade' | 'classic' | 'daily', score: number) => void;
  updateAvatar: (updates: Partial<AppState['avatar']>) => void;
  setDailyPlayed: (score: number, results: boolean[]) => void;
  recordPlay: () => void;
  tapOneMore: () => void;
}

type AppContextType = AppState & AppActions;

const defaultState: AppState = {
  highScores: { arcade: 0, classic: 0, daily: 0 },
  avatar: { color: '#FF6B9D', eyes: 'round', mouth: 'smile' },
  dailyStatus: { date: '', played: false, score: 0, results: [] },
  freePlay: { date: '', playsToday: 0, oneMoreTaps: 0 },
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

  const recordPlay = () => {
    setState(s => ({
      ...s,
      freePlay: {
        date: today,
        playsToday: s.freePlay.date === today ? s.freePlay.playsToday + 1 : 1,
        oneMoreTaps: s.freePlay.date === today ? s.freePlay.oneMoreTaps : 0,
      },
    }));
  };

  const tapOneMore = () => {
    setState(s => ({
      ...s,
      freePlay: {
        ...s.freePlay,
        date: today,
        oneMoreTaps: s.freePlay.date === today ? s.freePlay.oneMoreTaps + 1 : 1,
      },
    }));
  };

  const setDailyPlayed = (score: number, results: boolean[]) => {
    setState(s => ({
      ...s,
      dailyStatus: { date: today, played: true, score, results },
      highScores: { ...s.highScores, daily: Math.max(s.highScores.daily, score) },
    }));
  };

  return (
    <AppContext.Provider value={{ ...state, updateHighScore, updateAvatar, setDailyPlayed, recordPlay, tapOneMore }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppStore must be used within AppProvider');
  return ctx;
}
