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

## The current state *(as of 2026-04-25)*

- **Mothership doc is at v1.32.** Last updated April 25, 2026 (sessions 13–20). Most recent: **league rank border palette locked** (v1.32, session 20) — all 8 tier hex values, gradient structures, and Legend shimmer execution specified in Part 3. Resolves Appendix D #11. No code changes that session. Recent shape: bot-ghost system + Phase 4 Supabase schema landed (v1.23–1.24); 5-item mini-decisions bundle (v1.25); **Phase 1 audit kicked off and 400 questions tagged across batches 1–4** (v1.26, 1.27, 1.29, 1.31; sessions 13, 14, 16, 19); **codebase audit pass** with dark-mode boilerplate cleaned out and several small drift items closed (v1.28, session 15); **post-league UX (Appendix D #26) fully specced** — all three result states locked (v1.30, session 17); **session 18 code drift cleanup** — Contact-the-developer mailto wired in Profile (resolves Appendix D #49), challenge.tsx refreshed to Cream Stadium, ARCADE/arcade vocabulary scrubbed from end.tsx and questions.ts, dead cyan token removed from theme.ts. No spec changes that session.
- **All critical-path decisions resolved.** Phase 2 substantially complete. Phase 3 in progress.
- **Phase 1 audit progress:** Q1–Q400 tagged through review passes (cumulative **351 Keep / 49 Light / 0 Heavy / 0 Retire**, 87.75% Keep). Methodology + future-session playbook live in `audit_1001/audit_1001_methodology.md` at parent folder. 15 edge-case rulings locked. 601 questions to go, batches of ~100 expected per focused sitting.
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
