# Super Smart 2026 — Changelog

---

## Session 2 — 2026-04-18

### Bug fixes
- **Answer shuffling** — correct answer was always position A (first option) because 1001.xml stores answers as option1. Added `shuffleOptions()` to `questions.ts` that randomizes option order within each question and recalculates the correct index. Applied to all modes via `shuffleQuestions()`. Daily mode uses seeded RNG for shuffling so all players see the same option order on a given day.
- **Daily mode crash** — app crashed after answering the 10th question with `Cannot read properties of undefined (reading 'question')`. Added a null guard (`if (!question) return null`) before the main render to handle the brief async window between state update and navigation.

### Removed
- **Kicker lines** — concept killed for now. Removed `kickerEnabled` / `toggleKicker` from store, all kicker logic from `classic.tsx`, and the Kicker Lines toggle from settings. Mothership updated to reflect decision. Deferred to Phase 5 at earliest.
- **Explore tab** — leftover artifact from default Expo template. `app/(tabs)/explore.tsx` deleted.

### New feature: Free play system
- 7 free rounds per day across all game modes (Arcade, Classic, Daily, Echo)
- Counter is invisible until ≤3 plays remain — no irritating "X games left" on first open
- **At 3 left:** "3 games left today" appears quietly below mode buttons
- **At 2 left:** "2 games left" + tappable "want more?" that cycles through replies: "maybe" → "said maybe" → "patience" → "i said maybe" → "still maybe" → "we're not not saying yes" → "..."
- **At 1 left:** "one more turn!" strip appears, tappable for fun copy cycling, buttons still work
- **At 0 left:** mode buttons disabled, red "one more turn!" gate — each tap grants 3 more rounds and cycles escalating copy ("no ads. No Ads. NO ADS." etc.)
- **After 3 resets (9 bonus rounds used):** 4th gate tap shows Pro wall instead — "ok. you've broken us. / Super Smart Pro — $4.99 / one time. no subscription. no ads. the whole game. forever. / we think you've earned it honestly." (purchase flow placeholder, not yet implemented)
- Play count is now tracked at game screen mount, not home screen — fixes "Play Again" bypass where replaying directly from end screen didn't count toward the daily limit. All game screens (game, classic, daily, echo) now gate-check and call `recordPlay()` on mount.

### Files changed
- `app/store.tsx` — added `freePlay` state, `recordPlay()`, `tapOneMore()` actions; removed kicker
- `app/(tabs)/index.tsx` — full free play strip UI, gate logic, Pro wall
- `app/(tabs)/settings.tsx` — removed Kicker Lines toggle
- `app/(tabs)/explore.tsx` — deleted
- `app/game.tsx` — gate check + recordPlay on mount
- `app/classic.tsx` — gate check + recordPlay on mount; kicker logic removed
- `app/daily.tsx` — gate check + recordPlay on mount (skipped if already played today); option shuffling with seeded RNG
- `app/echo.tsx` — gate check + recordPlay on mount
- `app/questions.ts` — added `shuffleOptions()`, applied in `shuffleQuestions()`
- `super_smart_2026_mothership.md` — kicker marked deferred, decision log updated
