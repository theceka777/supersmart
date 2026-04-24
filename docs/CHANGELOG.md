# Super Smart 2026 — Changelog

---

## Session 9b — 2026-04-24 — League vs skill tier clarification (mothership v1.21 → v1.22)

No code changes. Readback of the league model surfaced that the 2026-04-19 session 7 matchmaking text conflated the two tier systems. Corrected in a single clarification pass.

### Corrections
- **League of 30 is a leaderboard cohort, not a matchmaking pool.** 30 players, strict same-tier only, grouped arbitrarily within their tier. Members don't play head-to-head — each plays their own Quickmatch + Challenge + Daily Race rounds, and weekly cumulative scores rank the cohort at week-end.
- **±1 matching lives with skill tier, not league tier.** The expansion rule (if no ghost exists at your exact skill tier, search adjacent skill tiers ±1) is a Quickmatch ghost-matching rule only. League tier is never involved in matchmaking anywhere.
- **Skill tier and league tier are fully independent.** Skill tier = "who you play" (per-round matching). League tier = "whose scores your weekly total ranks against" (cumulative weekly progression). Different sources, different purposes, no cross-feed.
- **Challenge-a-Friend scores count toward League weekly totals.** Previously ambiguous — now explicit.

### Files touched (canonical)
- `super_smart_2026_mothership.md` — v1.21 → v1.22. Status line updated. Part 4 Layer 4 rewritten: new intro paragraph distinguishing cohort from matchmaking; old "Matchmaking within a league cluster — weighted random ±1" section replaced with "League cohort composition — strict same-tier" + explicit block on why the two tier systems don't interact. Appendix C glossary: added distinct **League of 30**, **League tier**, **Skill tier** entries; removed a duplicate short Skill tier definition. Part 12 decision log: new row explaining the session-7 conflation and the correction. End-of-doc version stamp bumped.
- `CHANGELOG.md` — this entry.

### No code changes required
- All current implementation references either skill tier (correctly, via Part 4 Layer 1 ghost matching) or league tier (as a label only).
- No ±1 cross-league-tier logic was ever built in code — the spec was wrong in the doc but not in the codebase.
- Phase 4 leaderboard SQL will now be specced against the corrected model from the start.

---

## Session 9 — 2026-04-24 — Five coffee decisions locked (mothership v1.20 → v1.21)

No code changes — documentation-only session. Walked through the five "coffee decisions" queued in Appendix D and locked each with full rationale recorded in Part 12 decision log.

### Decisions locked
1. **Daily Race + League reset clock** — 6am ET, ET-anchored. UTC auto-shifts 10:00 ↔ 11:00 with DST. Supabase cron in `America/New_York` tz. Behind `daily_race_reset_time` PostHog flag. Once-per-day lock built on reset window (not a rigid 24h timer) to handle DST 23/25-hour weeks. *Resolves Appendix D #7; anchors #19.*
2. **Leaderboard tie-breakers** — 4-layer cascade: `score DESC → peak_streak DESC → questions_answered ASC → submitted_at ASC`. Applies uniformly across Daily Race, League of 30, Quickmatch, and Global all-time (aggregates for cumulative). Zero new schema. *Resolves Appendix D #20.*
3. **Seasonal pack clarification** — Free = static 2,500 launch questions. Pro = 2,500 + ongoing seasonal packs (post-launch). Part 5 Free tier copy updated. *Resolves Appendix D #29.*
4. **Localization at launch** — English-only, explicit. `locale` column added to Supabase content schema from day one (default `'en'`) as a cheap architectural hedge. *Resolves Appendix D #46.*
5. **App Store name + subtitle** — App name: `Super Smart — Quick Trivia`. Subtitle: heritage line (candidate `Since 2012. Smarter now.`, final copy Phase 6). Reversal of a mid-session rec — discoverability > distinctiveness for a solo-founder launch with no paid UA. *Resolves Appendix D #37.*

### Files touched (canonical)
- `super_smart_2026_mothership.md` — v1.20 → v1.21. Status line updated. Part 3 Daily Race reset line rewritten. Part 5 Free tier copy rewritten. Part 6 name/subtitle section rewritten. Appendix D items #7, #19, #20, #29, #37, #46 annotated with resolution. Part 12 gained 5 new decision log rows with full rationales. End-of-doc version stamp bumped.
- `CHANGELOG.md` — this entry.

### Implementation work this unlocks (not done this session)
- Supabase schema draft (Appendix D #5) can now include the `locale` column and a reset-time constant source.
- Leaderboard SQL in Phase 4 has its exact `ORDER BY` cascade specced.
- Streak Shield 48hr window anchor (#19) has its reset anchor confirmed — remaining work is detection logic.
- App Store listing (Phase 6) has the name locked; subtitle final copy + keyword field still to draft.

---

## Session 8 — 2026-04-24 — Mothership alignment pass

Read the primer and mothership (now v1.15, last updated 2026-04-24) and closed four concrete code/spec gaps.

### Renamed
- **`app/(tabs)/inbox.tsx` → `app/(tabs)/league.tsx`**. Default export `InboxScreen` → `LeagueScreen`. Per mothership decision 2026-04-19 session 7: the second tab is "League", not "Inbox". The tab title label was already correct; this closes the file/route-name gap.
- Updated `app/(tabs)/_layout.tsx` to register `name="league"`.
- Updated `components/TokenTabBar.tsx` route map keys `inbox` → `league`. Icon swapped from `tray.fill` → `trophy.fill` to match the League framing.
- Added `trophy.fill` → `emoji-events` to `components/ui/icon-symbol.tsx` MAPPING so Android doesn't crash on the new icon.

### Architecture
- **Sunburst + Halftone promoted to global.** Both layers now render once in `app/_layout.tsx` behind every screen, not just Home. Per mothership decision 2026-04-19 session 7. `Stack` now uses `contentStyle: { backgroundColor: 'transparent' }`.
- Removed the local Sunburst/Halftone pair from `app/(tabs)/index.tsx`.
- Made `SafeAreaView` backgrounds transparent on `index.tsx`, `league.tsx`, `profile.tsx`, `avatar.tsx` so the global background shows through. Cream card surfaces preserved where they are intentional UI (e.g. the avatar card, stat cards).
- **Follow-up (not done in this session):** game-layer screens (`echo.tsx`, `daily.tsx`, `end.tsx`, `challenge.tsx`, `game.tsx`) still have local cream/white backgrounds. Making them transparent too is a visual-review pass in a later session — risk of affecting game-loop rendering is non-zero.

### Removed
- **`app/classic.tsx` deleted.** Classic mode retired 2026-04-18 session 3. File was orphaned (not in the root Stack, not referenced anywhere) and its own comment said "Route unreachable in production."

### Avatar system — 2026-04-24 spec
- `app/avatar.tsx` rewritten against the mothership spec: 3 components, 3 option tiers, Cream Stadium styling. Free base kit: 4 brain colours × 4 eye styles × 4 mouth styles (64 combos). Pro tier: 4 additional options per component, visible but locked for free users (🔒 glyph).
- `components/Avatar.tsx` eye + mouth glyph dictionaries expanded to 8 each (4 free + 4 Pro).
- Pro access hardcoded to `false` for now — wire it to `useAppStore()` once the Pro purchase flow lands.
- **Deferred to Phase 3:** milestone-unlock conditions for earned items, league rank border stroke on avatar (8 tier colours, grey → gold, Legend shimmer).

### Files touched
- `app/_layout.tsx` — global Sunburst + Halftone + transparent Stack content
- `app/(tabs)/_layout.tsx` — `inbox` → `league` route name
- `app/(tabs)/index.tsx` — dropped local background layers, transparent safe area
- `app/(tabs)/league.tsx` — renamed from `inbox.tsx`, default export renamed, transparent safe area
- `app/(tabs)/profile.tsx` — transparent safe area
- `app/avatar.tsx` — full rewrite for 4/4/4 free + 4/4/4 Pro tiers, Cream Stadium
- `app/classic.tsx` — deleted
- `components/Avatar.tsx` — expanded glyph dictionaries, antenna fixed in comment
- `components/TokenTabBar.tsx` — route keys `inbox` → `league`, icon `tray.fill` → `trophy.fill`
- `components/ui/icon-symbol.tsx` — added `trophy.fill` mapping

### Still on the mothership punch-list (not touched this session)
- "Unstoppable" 10-streak reward — mothership names it but I haven't verified `echo.tsx`/`game.tsx` scoring logic implements a 10-streak tier above 4× (the 3/5/7 → 2×/3×/4× ladder is all I've confirmed).
- Onboarding flow (wordmark splash → first-time home → Sign in with Apple/Google → ghost-free first round with 2 nudges) — spec locked 2026-04-24, explicitly Phase 3 work.
- League rank border on Avatar (Phase 3 visual pass).
- End-of-league UX interstitials (Phase 3/4 copy).
- Game-screen transparent safe areas (see Architecture follow-up above).

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
