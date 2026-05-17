// components/round/constants.ts
// Round-screen mechanics constants + streak helpers. Mirrors the values used
// in `app/echo.tsx` / `app/daily.tsx` so anyone reading the layout can see the
// math in one place. The state machine still lives in echo/daily — these are
// shared lookups consumed by the visual layer.
//
// Source: Claude Design `lib/round.jsx` constants block + mothership Part 3.

export const ROUND_DURATION_SEC = 60;     // total round length
export const BASE_POINTS = 100;
export const SPEED_BONUS = 50;
export const SPEED_WINDOW_SEC = 2;        // sub-this = lightning + nudge
export const ANSWER_LOCK_MS = 1000;       // post-answer freeze (v1.42)
export const ANSWER_GUARDRAIL_MS = 150;   // invisible double-tap guard (v1.42)
export const STREAK_TIERS = [3, 5, 7] as const; // 2×, 3×, 4×
export const UNSTOPPABLE_AT = 10;
export const MISS_PENALTY_AT = 3;
export const MISS_PENALTY = -50;
export const LOW_TIME_SEC = 5;            // timer pulses red below this

// Streak ladder — current multiplier given current streak count
export function streakMultiplier(streak: number): number {
  if (streak >= 7) return 4;
  if (streak >= 5) return 3;
  if (streak >= 3) return 2;
  return 1;
}

// Streak tier — visual-effect intensity bucket
//   0 = no tier (streak 0–2)
//   1 = yellow  (streak 3–4)
//   2 = orange  (streak 5–6)
//   3 = pink    (streak 7–9)
//   4 = red, Unstoppable (streak 10+)
export function streakTier(streak: number): 0 | 1 | 2 | 3 | 4 {
  if (streak >= UNSTOPPABLE_AT) return 4;
  if (streak >= 7) return 3;
  if (streak >= 5) return 2;
  if (streak >= 3) return 1;
  return 0;
}

export type StreakTierLevel = 0 | 1 | 2 | 3 | 4;
