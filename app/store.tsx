import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getRaceDate } from './clock';

// ─── Persisted state shape ────────────────────────────────────────────────────
// Fields below survive force-quit via AsyncStorage. Add new persisted fields
// here. Ephemeral state (modal-open, current tab, etc.) belongs in component-
// local useState, NOT here. If a persisted field's shape changes, bump
// STORAGE_VERSION below and add a migration in hydrateAppState().

export interface AppState {
  highScores: { quickmatch: number; daily: number };
  avatar: { color: string; eyes: string; mouth: string };
  dailyStatus: { date: string; played: boolean; score: number; results: boolean[] };
  freePlay: { date: string; playsToday: number; oneMoreTaps: number };
}

interface AppActions {
  updateHighScore: (mode: 'quickmatch' | 'daily', score: number) => void;
  updateAvatar: (updates: Partial<AppState['avatar']>) => void;
  setDailyPlayed: (score: number, results: boolean[]) => void;
  recordPlay: () => void;
  tapOneMore: () => void;
}

type AppContextType = AppState & AppActions;

export const defaultState: AppState = {
  highScores: { quickmatch: 0, daily: 0 },
  avatar: { color: '#FF6B9D', eyes: 'round', mouth: 'smile' },
  dailyStatus: { date: '', played: false, score: 0, results: [] },
  freePlay: { date: '', playsToday: 0, oneMoreTaps: 0 },
};

// ─── AsyncStorage wiring ──────────────────────────────────────────────────────
// One blob, one key. Atomic read/write. Debounced 200ms to coalesce rapid
// state changes into single writes.

const STORAGE_KEY = '@supersmart/state';
const STORAGE_VERSION = 1;
const PERSIST_DEBOUNCE_MS = 200;

// Read persisted state on cold start. Falls back to defaults silently on:
//   • no stored data (first launch)
//   • parse error / corrupted JSON
//   • version mismatch (migration not yet implemented)
//   • any unreadable AsyncStorage error
// Always returns a valid AppState; never throws.
export async function hydrateAppState(): Promise<AppState> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    const parsed = JSON.parse(raw);
    if (parsed?._version !== STORAGE_VERSION) {
      // Future: run migration based on version diff. For now, v1 only;
      // any mismatch resets to defaults.
      return defaultState;
    }
    // Merge with defaults so newly-added persisted fields get their default
    // values when loading older blobs (forward-compatible reads).
    const { _version: _v, ...persisted } = parsed;
    return { ...defaultState, ...persisted };
  } catch (_err) {
    // Silent fallback. TODO: log to Sentry once Tier 1 instrumentation lands.
    return defaultState;
  }
}

// ─── Provider ─────────────────────────────────────────────────────────────────

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({
  children,
  initialState,
}: {
  children: ReactNode;
  initialState?: AppState;
}) {
  const [state, setState] = useState<AppState>(initialState ?? defaultState);

  // Debounced persistence — coalesces rapid state changes (e.g., rapid
  // tapOneMore() taps) into a single write so we don't race on Android.
  const writeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (writeTimer.current) clearTimeout(writeTimer.current);
    writeTimer.current = setTimeout(() => {
      const blob = JSON.stringify({ _version: STORAGE_VERSION, ...state });
      AsyncStorage.setItem(STORAGE_KEY, blob).catch(() => {
        // Silent. TODO: Sentry.
      });
    }, PERSIST_DEBOUNCE_MS);
    return () => {
      if (writeTimer.current) clearTimeout(writeTimer.current);
    };
  }, [state]);

  // ─── Actions ────────────────────────────────────────────────────────────────

  const updateHighScore = (mode: 'quickmatch' | 'daily', score: number) => {
    setState(s => ({
      ...s,
      highScores: { ...s.highScores, [mode]: Math.max(s.highScores[mode], score) },
    }));
  };

  const updateAvatar = (updates: Partial<AppState['avatar']>) => {
    setState(s => ({ ...s, avatar: { ...s.avatar, ...updates } }));
  };

  // 6am-ET-anchored race date — single source of truth for the day boundary.
  // Both freePlay and dailyStatus reset at 6am ET so a player at 1am ET
  // doesn't see freePlay reset before their Daily Race resets. See app/clock.ts.
  const today = getRaceDate();

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
    // Recompute today inside setDailyPlayed so a round that crosses 6am ET
    // gets stamped with the race date the round started under (captured
    // by reading getRaceDate() once here at call time, not at module init).
    const raceDate = getRaceDate();
    setState(s => ({
      ...s,
      dailyStatus: { date: raceDate, played: true, score, results },
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
