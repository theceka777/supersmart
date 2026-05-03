# Super Smart 2026 — Project Primer

**Read this first. Then read the Mothership doc.**

This primer exists to orient you (Claude, a fresh session) to the project in under a minute. The Mothership doc is the source of truth; this file is the airport map.

---

## What this project is

Super Smart 2026 is a rebuild of a 2012 iOS trivia game. The creative director shipped the original and is now rebuilding it modernized, from scratch, with AI as the primary development collaborator.

- **Original was good.** Positively reviewed (148Apps 3.5/5), Top 10 Trivia US / Top 30 in 10+ countries, 1001 hand-written questions, strong brand voice.
- **Original is gone.** Off the App Store, source code lost, developer account lapsed. Everything is being rebuilt.
- **Core DNA is recovered.** The 1001-question XML was recovered intact from a 2012 email. The launch video was recovered from a reupload. Brand voice, visual identity, mechanics, and tone all reconstructed.

## The 2026 thesis in one sentence

**Short-form trivia with a sense of humor — built for a world where everything else is short but empty.**

Same skeleton as 2012 (≤40-char questions, ≤15-char answers, 3 options, 60-second rounds), but with density of wit per second as an explicit brand promise. Every question earns its place. Every wrong answer is a joke, a near-miss, or a setup.

## How we work together

- **The creative director is the decision-maker.** AI (Claude) is a collaborator: pressure-tests ideas, implements, records decisions. Does not make strategic calls.
- **Weekly bandwidth is 6–8 hours, bursty** (big pushes, quiet weeks).
- **"Perfect is the enemy of good."** Ship-it bias. Scope creep is the primary risk.
- **One decision per conversation turn.** Don't dump multiple questions at once. Serialize.
- **Working-together mode is "learn-as-we-go"** — creative director has no prior terminal experience; moving in chunks rather than command-by-command.
- **Both sides pressure-test each other.** Push back when something is wrong, challenge reasoning, own mistakes.

## The current state *(as of 2026-05-03)*

- **Mothership doc is at v1.45.** Last updated May 3, 2026 (sessions 13–28). Most recent: **day-boundary drift fixed; clock anti-tamper deferred to Phase 4** (v1.45, session 28). New shared helper `app/clock.ts` (`getRaceDate()` / `getRaceSeed()`, both 6am-ET-anchored, DST-aware) replaces six device-clock-derived `today` reads across `store.tsx`, `daily.tsx`, `(tabs)/index.tsx`, `echo.tsx`, `game.tsx`. Two correctness fixes shipped: the once-per-day Daily Race lockout now flips at 6am ET (matching the spec) instead of UTC midnight (which double-played in the 8pm ET → 6am ET window); the daily question-set seed is now globally stable (Istanbul and NYC at the same UTC instant draw the same set, where the device-local seed previously broke the equal-ground principle). Anti-tamper logic (clock-jump heuristics, network anchors) explicitly **deferred to Phase 4 server-side submission validation** — Appendix D #6 extended to include the device-clock manipulation case. Beta + TestFlight testers will be told the cheat path exists pre-Phase-4. v1.44 — **home-screen polish pass shipped** (v1.44, session 27) — three home surfaces redesigned + ported to RN, all driven by the same `dailyPlayedToday` flag. (1) Hero: speech bubble removed, brain promoted to 92pt, brain + wordmark vertically center-aligned. (2) Mascot: antenna retired everywhere; `Brain.tsx` now renders an illustrated PNG body (`assets/images/brain-base.png`, 1402×1122) with eyes + mouth as an SVG overlay drawn at the PNG's native viewBox. New `expression="hype"` (open mouth + tongue) for the YOU-row leaderboard avatar. Role split: top-left brain = "this is your home" (smirk); YOU-row brain = "this is you in the race" (hype). (3) Daily Race card: branches on `dailyPlayedToday`. Fresh: target decor + `FRESH EVERY 6AM`. Done: same calendar shell with green-ringed checkmark stamp behind the same 5s lock-on cadence + `650 PTS · #34 OF 1,247` + small `BACK IN HH:MM:SS` countdown line. Card stays fully vivid in both states. ArcadeCard gained an optional `tertiary` text slot. (4) New `DailyRaceRankings` panel replaces `GlobalLeaderboard` on home — today only, top 3 + YOU/PlayToEnter row, footer link to League. `GlobalLeaderboard` file preserved for League tab use. New `useCountdownToNext6amET` hook (DST-aware US-ET math) is the pre-Phase-4 fallback. New `Tier` palette in `constants/theme.ts`. Mocked until Phase 4: rank/total/top-3/DAY count (Appendix D #52). Two new follow-ups (#52, #53) + three Decision Log rows. v1.43 — **round lifecycle locked + Tier 1 #2/#3 closed** (v1.43, session 26) — mid-round exits are terminal, navigation locks score, backgrounding keeps timer running (wall-clock-based, robust to iOS lifecycle pauses), force-quit captures latest score via progressive saves. Resolves Appendix D #21. v1.42 was the per-question rhythm revision; v1.41 the Live Players Strip spec; v1.40 closed Tier 1 #1 (AsyncStorage). Most recent: **per-question rhythm revised** (v1.42, session 25) — old 1s visible lock + variable post-answer animations replaced with 150ms invisible guardrail + unified 1s post-answer beat. Speed-bonus 2s window now starts at question render (no free read buffer). 60-question pool size kept; rationale updated to "spam-tap ceiling + power-up margin." Code shipped to echo/daily/game; mothership Part 3 + Part 4 updated. v1.41 was the Live Players Strip spec lock. Most recent: **Live Players Strip spec locked** (v1.41, session 24) — new Part 4 Layer 1.5 covers the Quickmatch card footer strip end-to-end (rolling-24h DAU metric, exact integers, server-cached aggregation, 10s-tempo magnitude-scaled jitter playback, soft floor 20). Phase 4 implementation pending. v1.40 closed Tier 1 #1 (AsyncStorage persistence). Most recent: **AsyncStorage persistence wired** (v1.40, session 23) — closes Appendix D #2. State (avatar, freePlay, dailyStatus, highScores) survives force-quit. Closes the gate-bypass abuse path + once-per-day Daily Race loophole. Home-screen Daily Race card now shows played-today celebration state (bright cyan + ✓ + score + green target accent). v1.39 was the corpus style sweep; v1.38 the incident runbook. Phase 1 fully closed; ready to keep working through Tier 1 UX punch-list before Phase 4 backend. Most recent: **PHASE 1 AUDIT COMPLETE + final-check sweep** (v1.36, session 22b). **Final corpus tally: 903 Keep / 98 Light / 0 Heavy / 0 Retire = 90.2% Keep, zero throwaways.** The final-check fresh-eyes whole-corpus pass after batch 6 caught 5 more Lights (Q71 dinosaur 65M→66M, Q321 Smart→BMW, Q594 Woody Allen→Christopher Nolan, Q875 Texas threshold 33M→40M, Q932 rewrite to larger country by population). Six batches + final-check across five working sessions, all 1001 questions tagged and reviewed. Next: corpus-wide style sweep before Phase 5 question writing. v1.34 was the cultural-relevance sweep. v1.32 locked league rank border palette. No code changes since session 18. Recent shape: bot-ghost system + Phase 4 Supabase schema landed (v1.23–1.24); 5-item mini-decisions bundle (v1.25); **Phase 1 audit kicked off and 400 questions tagged across batches 1–4** (v1.26, 1.27, 1.29, 1.31; sessions 13, 14, 16, 19); **codebase audit pass** with dark-mode boilerplate cleaned out and several small drift items closed (v1.28, session 15); **post-league UX (Appendix D #26) fully specced** — all three result states locked (v1.30, session 17); **session 18 code drift cleanup** — Contact-the-developer mailto wired in Profile (resolves Appendix D #49), challenge.tsx refreshed to Cream Stadium, ARCADE/arcade vocabulary scrubbed from end.tsx and questions.ts, dead cyan token removed from theme.ts. No spec changes that session.
- **All critical-path decisions resolved.** Phase 2 substantially complete. Phase 3 in progress.
- **Phase 1 audit COMPLETE.** All 1001 questions tagged + reviewed across 6 batches + final-check pass / 5 working sessions. **Final: 903 Keep / 98 Light / 0 Heavy / 0 Retire = 90.2% Keep, 0% throwaways.** Methodology + 16 edge-case rulings + per-category calibration + playbook live in `audit_1001/audit_1001_methodology.md` at parent folder. The original Part 8 projection (700/150/100/50) was off by an order of magnitude on Heavy/Retire — the corpus is dramatically more durable than Phase 0 sampling suggested. Per-category Keep rates: math 100%, science 82.5%, misc 88.7%, word 91.4%, music 84%, movies 86.7%, geography 91.3%, people 82%, literature 90%. Next: corpus-wide style sweep (single global pass) before Phase 5 question writing.
- **Phase 2 deliverables done:** Cream Stadium palette locked, Archivo Black + JetBrains Mono typography, animated wordmark, brain mascot, ArcadeCard bob float, TokenTabBar, global Sunburst + Halftone background. All running on real device via Expo Go.
- **Phase 4 schema draft:** 11 new tables at `supabase/phase4_schema.sql`. Not yet runnable — depends on auth library (Appendix D #1) + RLS pass + Edge Functions, which are future workstreams.
- **Code and spec in sync** as of session 15 codebase audit. Light-only rendering locked (no dark-mode boilerplate in tree). Bot-ghost scoring, avatar randomization, mode vocabulary all current.
- **Launch target: first half of August 2026.** *(~14 weeks out as of April 25; on track at 6–8 hrs/week.)*

## What's next (open threads)

- **Phase 1 audit batches 3+:** Q201–Q300 next. Misc category continues to ~Q350 then transitions to word.
- **Phase 4 blockers remain:** auth architecture (Appendix D #1), anti-cheat validator (#6), RLS policy depth, Edge Function buildouts (matchmaking, league close/open, daily race seeding, etc.).
- **Appendix D** has ~37 open items grouped by phase. Many small mini-decisions could still batch.
- **Between-sessions action item:** confirm `iamsupersmart.com` registrar status (drives Appendix D #40 support email domain).

## What to do first in any new session

1. **Read the Mothership doc fully** (`super_smart_2026_mothership.md`, now ~1,400 lines). Every major decision has a rationale you'll need.
2. **Check the Decision Log (Part 12) and Open Questions Index (Appendix D)** — decided vs open.
3. **Read the most recent CHANGELOG entries** — they tell you what changed in the last few sessions and what's still in flight.
4. **Ask the creative director what session type this is** (audit, build, planning, content work, creative pilot) and proceed from there.
5. **Never re-open a decision from the log without flagging it explicitly.** Things decided are decided.

## Key references

- **Mothership doc** — the complete design spec, source of truth for every decision. v1.25 as of 2026-04-24.
- **CHANGELOG.md** — per-session record of what changed in each working session.
- **1001.xml** — the original question bank, used as the style corpus for all new content.
- **`supersmart/supabase/phase4_schema.sql`** — Phase 4 schema draft; 11 tables + 2 triggers + 7 open items inline.
- **Rank ladder (Part 3)** — 22 preserved rank names; the brand voice lives here.
- **Decision Log (Part 12)** — chronological record of major calls with rationales.

## Voice cheat sheet for any written content

- Playful, self-aware, treats player as in on the joke
- Confident without being smug
- Never mocks the player for wrong answers
- Occasional fourth-wall breaks (e.g., "don't pick this" as a wrong answer)
- Signature closing line: *"Get super smart today by getting Super Smart today!"*

## Vocabulary

- **Quickmatch** — primary home-screen mode; ghost-based competitive race (Echo architecture). 60 seconds, same questions as your ghost opponent, unlimited plays.
- **Daily Race** — daily home-screen mode; 60 seconds, same question set for everyone globally that day, once per day, shareable score result. Resets at **6am ET** every day (auto-adjusts with DST).
- **Echo** — the internal/backend name for the ghost-race architecture. "Quickmatch" is the player-facing name.
- **Equal ground principle** — both modes use the same question set for all players in their competitive context. You win or lose on speed and accuracy only.
- **Question set** — 60 questions drawn randomly from the bank; the unit of play for Quickmatch. Infinite combinations. Lifecycle: retired after 30 days inactive or **10,000 plays**.
- **No-replay rule** — no player ever sees the same question set twice in Quickmatch (challenge links excepted). Enforced in matchmaking via `sessions` table filter.
- **Ghost run** — a recorded session stored against a question set. What future Quickmatch players race.
- **Baton pass** — ghost selection rule: you race the most recently completed ghost on your set at your skill tier, then become the ghost for the next player.
- **Bot ghost** — ephemeral single-use opponent generated by the matchmaking Edge Function when no human ghost exists at the player's skill tier on the assigned set. Score 300–3,000, mixed-pattern name, random avatar (including Pro cosmetics). Never persisted in `ghost_pool`, never enters Leagues. Graduates out automatically as human ghosts populate.
- **Skill tier** — 5 internal brackets, never shown to players, used only for Quickmatch ghost matching. Rolling 10-game average, percentile-based with 70/30 weekly inertia. The ±1 expansion rule lives here (not on league tier).
- **League tier** — 8 visible brackets shown as avatar border: **Rookie → Newcomer → Regular → Veteran → Qualifier → Finalist → Champion → Legend**. Players enter at **tier 2 (Newcomer)**; Rookie is demotion-only. Top 5 promote / bottom 5 demote weekly.
- **League of 30** — weekly leaderboard cohort of up to 30 real players, strict same-tier, **no ghost-fill, no bots**. Members don't play head-to-head — they each play their own Quickmatch + Challenge + Daily Race rounds, weekly cumulative scores rank the cohort at week-end.
- **Speed bonus** — +50 flat points for answering within 2 seconds, applied before streak multiplier.
- **Streak multiplier** — 3/5/7 correct in a row → 2×/3×/4×. Wrong answer resets to zero.
- **Miss penalty** — −50 every 3 consecutive wrong answers; counter resets after penalty fires.
- **Tie-breaker cascade** — applied uniformly to all leaderboards: `score DESC → peak_streak DESC → questions_answered ASC → submitted_at ASC`.
- **Unstoppable** — the 10-streak reward name. (UI moment still to design in Phase 3.)
- **Challenge** — shareable link for "play the same round a friend played." Sender's ghost is locked forever; everyone who uses the link races the sender specifically. Scores count toward weekly League totals.
- **One More** — brand-native paywall: tap a button for an extra round, copy escalates and teases. 3 taps max before the Pro Wall.
- **Super Smart Pro** — $4.99 one-time upgrade, unlocks unlimited rounds + seasonal packs + Pro avatar items + Global all-time leaderboard view + 1 Streak Shield auto-granted every Monday + Pro badge.
- **Streak Shield** — consumable IAP. Protects or repairs the Daily Race streak. Max 3 held. Free: 1 at launch. Pro: 1 auto-granted every Monday up to cap. Can be bought retroactively within 48 hours of missing a day.
- **Build for the Flex** — design principle: every decision should serve the screenshot moment. Make shareable surfaces visually spectacular and unmistakably Super Smart.
- **The 1001** — the original recovered question bank, canonical style reference.
- **Mothership doc** — this project's design spec, the source of truth.
- ~~**Arcade**~~ — *retired.* 60-second format and streak mechanics live on inside both current modes.
- ~~**Classic**~~ — *retired.* 3-strikes, 10-second ceiling. No replacement.
- ~~**Kicker**~~ — *retired.* Had no home once Classic mode was cut.
- ~~**Honesty Layer principle**~~ — *retired 2026-04-24.* The "never pretend opponent identity" principle was traded for the bot-ghost fresh-set fill. Other honesty positions (real timestamps, all-real leagues, cumulative scores only count real sessions) stand.

## App Store identity *(locked 2026-04-24)*

- **Name:** `Super Smart — Quick Trivia`
- **Subtitle:** heritage line, candidate `Since 2012. Smarter now.` (final tuned Phase 6)
