// app/clock.ts
//
// Shared time utilities for the Daily Race day boundary.
//
// Single source of truth for "what day is it for the race?" — used by both
// the once-per-day lockout (store.tsx + daily.tsx) and the question-set
// seed (daily.tsx). Routing both through one helper keeps the design's
// "equal-ground principle" intact: every player worldwide sees the same
// race set during the same global 24-hour window, regardless of their
// local timezone.
//
// Spec: Daily Race resets at 6am ET (Eastern Time, DST-aware). Locked
// 2026-04-24 (Appendix D #7). Until 6am ET, "today's race" is yesterday's
// ET calendar date; at 6am ET and after, it flips to today's ET date.
//
// Anti-tamper note: this module trusts the device clock. A player who rolls
// their clock forward can still defeat the local lockout pre-Phase-4. That
// vulnerability is logged as Tier 1 #4 → Phase 4 server-side submission
// validation. This file is correctness, not anti-cheat.

// US DST: starts second Sunday of March, ends first Sunday of November.
// Approximate ET offset relative to UTC: -4 (EDT) within the DST window,
// -5 (EST) outside it. Good enough for player-facing boundaries; Phase 4
// swaps to a server boundary that's authoritative across DST and timezones.
export function isUSDST(d: Date): boolean {
  const y = d.getUTCFullYear();
  // Second Sunday of March, 2am ET = 7am UTC under EST
  const marStart = new Date(Date.UTC(y, 2, 1));
  const marDow = marStart.getUTCDay();
  const dstStart = new Date(Date.UTC(y, 2, 1 + ((7 - marDow) % 7) + 7, 7, 0, 0));
  // First Sunday of November, 2am ET = 6am UTC under EDT
  const novStart = new Date(Date.UTC(y, 10, 1));
  const novDow = novStart.getUTCDay();
  const dstEnd = new Date(Date.UTC(y, 10, 1 + ((7 - novDow) % 7), 6, 0, 0));
  return d >= dstStart && d < dstEnd;
}

// Returns the calendar date "YYYY-MM-DD" of the current Daily Race day —
// the ET calendar date as of 6 hours ago. Until 6am ET, the race date is
// yesterday's ET date. At 6am ET and after, it flips to today's ET date.
//
// Math: shift the current instant back by (6 + |etOffset|) hours so that
// 6am ET maps to UTC midnight of the resulting Date. Then UTC date methods
// yield the race date directly.
//   Under EDT (etOffset = -4): shift by -10h. 6am ET = 10am UTC → 12am UTC.
//   Under EST (etOffset = -5): shift by -11h. 6am ET = 11am UTC → 12am UTC.
//
// The `now` parameter is for tests; production passes nothing.
export function getRaceDate(now: Date = new Date()): string {
  const etOffsetHours = isUSDST(now) ? -4 : -5;
  // shifted = now - (6 - etOffsetHours) hours
  //   EDT: now - 10h
  //   EST: now - 11h
  const shifted = new Date(now.getTime() - (6 - etOffsetHours) * 3_600_000);
  const y = shifted.getUTCFullYear();
  const m = String(shifted.getUTCMonth() + 1).padStart(2, '0');
  const d = String(shifted.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

// Returns the same Daily Race day as a stable integer seed for the
// question-set RNG. Format: YYYYMMDD as int (e.g., 20260503).
// Stable globally — every player sees the same seed during a given race day.
export function getRaceSeed(now: Date = new Date()): number {
  return parseInt(getRaceDate(now).replace(/-/g, ''), 10);
}
