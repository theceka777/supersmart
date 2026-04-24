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
- **Weekly bandwidth is 6-8 hours, bursty** (big pushes, quiet weeks).
- **"Perfect is the enemy of good."** Ship-it bias. Scope creep is the primary risk.
- **One decision per conversation turn.** Don't dump multiple questions at once. Serialize.
- **Working-together mode is "learn-as-we-go"** — creative director has no prior terminal experience; moving in chunks rather than command-by-command.

## The current state

- Mothership doc is at v1.10 as of April 19, 2026.
- All critical-path questions are resolved. Phase 2 is substantially complete.
- Phase 2 deliverables done: Cream Stadium palette locked, Archivo Black + JetBrains Mono typography, animated wordmark, brain mascot, ArcadeCard bob float, TokenTabBar, Sunburst + Halftone background. All running on real device via Expo Go.
- Phase 2 still pending: reach out to designer for brand mascot polish.
- Social/retention layer fully locked: League of 30 (transition window seeding, formation split rules, forming queue at 5 players, no ghost-fill), Streak Shield consumable IAP, "Build for the Flex" design principle.
- Leaderboard structure locked: League of 30 (everyone) + Daily Race board (everyone) + Global all-time (Pro only, twice-daily updates, free users ranked but can't see).
- Open for next session: "what happens after league" UX, League skill-sorted vs random matchmaking.
- Launch target: **first half of August 2026.**

## What to do first in any new session

1. Read the Mothership doc fully (`super_smart_2026_mothership.md`). It's 793 lines but genuinely worth it — every major decision has a rationale you'll need.
2. Note the Decision Log (Part 12) and Open Questions Index (Appendix D) — these tell you what's been decided and what's still open.
3. Start by asking the creative director what session type this is (audit, build, planning, content work) and proceed from there.
4. Never re-open a decision from the log without flagging it explicitly. Things already decided are decided.

## Key references

- **1001.xml** — the original question bank, used as the style corpus for all new content
- **Mothership doc** — the complete design spec, source of truth for every decision
- **Rank ladder (Part 3)** — 22 preserved rank names; the brand voice lives here
- **Decision Log (Part 12)** — chronological record of major calls with rationales

## Voice cheat sheet for any written content

- Playful, self-aware, treats player as in on the joke
- Confident without being smug
- Never mocks the player for wrong answers
- Occasional fourth-wall breaks (e.g., "don't pick this" as a wrong answer)
- Signature closing line: *"Get super smart today by getting Super Smart today!"*

## Vocabulary

- **Quickmatch** — primary home-screen mode; ghost-based competitive race (Echo architecture). 60 seconds, same questions as your ghost opponent, unlimited plays.
- **Daily Race** — daily home-screen mode; 60 seconds, same question set for everyone globally that day, once per day, shareable score result.
- **Echo** — the internal/backend name for the ghost-race architecture. "Quickmatch" is the player-facing name.
- **Equal ground principle** — both modes use the same question set for all players in their competitive context. You win or lose on speed and accuracy only.
- **Question set** — 60 questions drawn randomly from the bank; the unit of play for Quickmatch. Infinite combinations. Lifecycle: retired after 30 days inactive or 1000 plays.
- **Ghost run** — a recorded session stored against a question set. What future Quickmatch players race.
- **Baton pass** — ghost selection rule: you race the most recently completed ghost on your set, then become the ghost for the next player.
- **Fresh set** — a question set with no ghost runs yet. First player gets the "you're first" moment in Super Smart voice.
- **Skill tier** — one of 5 internal brackets (never shown to players) used for ghost matching. Percentile-based, recalculated weekly with inertia.
- **Speed bonus** — +50 flat points for answering within 2 seconds, applied before streak multiplier.
- **Streak multiplier** — 3/5/7 correct in a row → 2×/3×/4×. Wrong answer resets to zero.
- **Overall leaderboard** — cumulative score across all sessions (Quickmatch + Daily Race), all-time and today.
- **Daily leaderboard** — today's high scores for today's Daily Race set only. Resets daily.
- **Challenge** — shareable link for "play the same round a friend played"
- **One More** — brand-native paywall: tap a button for an extra round, copy escalates and teases
- **Super Smart Pro** — $4.99 one-time upgrade, unlocks seasonal packs + avatar items + stats + badge
- **Streak Shield** — consumable IAP. Protects or repairs the Daily Race streak. Max 3 held. Free: 1 at launch. Pro: 1 auto-granted every Monday up to cap. Can be bought retroactively within 48 hours of missing a day.
- **League of 30** — weekly competitive clusters of 30 players (real + ghost-filled). Promotes/demotes weekly. Works at any player count.
- **Build for the Flex** — design principle: every decision should serve the screenshot moment. Make shareable surfaces visually spectacular and unmistakably Super Smart.
- **The 1001** — the original recovered question bank, canonical style reference
- **Mothership doc** — this project's design spec, the source of truth
- ~~**Arcade**~~ — *retired.* 60-second format and streak mechanics live on inside both current modes.
- ~~**Classic**~~ — *retired.* 3-strikes, 10-second ceiling. No replacement.
- ~~**Kicker**~~ — *retired.* Had no home once Classic mode was cut.
