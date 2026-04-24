# SUPER SMART 2026 — Mothership Doc

**Status:** v1.15 — Avatar system fully specced (3 components, 3 tiers, league rank border); Unstoppable named; onboarding locked
**Last updated:** April 24, 2026
**Purpose:** This is the single source of truth for the Super Smart 2026 rebuild. Everything else (project plan, assets, code, marketing) descends from this document. When in doubt, read this. When something changes, update this. When a collaborator joins, this is what they read first.

**Doc update policy:** Whenever this document is updated, the person making the update provides a brief plain-English summary of what changed and why — no more than 4–5 bullet points. This summary is given verbally/in chat, not written into the doc itself. The goal is that the creative director always knows what shifted without having to re-read sections.

---

## How to use this doc

- Sections marked **[DECIDED]** are settled. Don't reopen without good reason.
- Sections marked **[OPEN]** need your input. Each one includes specific questions and, where useful, my recommendations as recommendations — not as decisions.
- Sections marked **[DEFERRED]** are intentionally postponed until a later phase. We'll know when to address them.
- The doc is meant to be read top-to-bottom on first pass, then used as reference after that.

---

## Part 1 — The Origin Story *[DECIDED]*

This section exists so that anyone reading this doc — you in six months, a future collaborator, a press contact — understands *why* this game is being rebuilt and what it's inheriting. Facts, not narrative fluff.

### What Super Smart was (2012)

Super Smart was an iOS trivia game published on September 28, 2012, by Formondo (a Turkish limited company registered in Istanbul). Built on a zero marketing budget; grew through guerrilla efforts to "Top 10 in Trivia and Educational Game categories in the US, Top 30 in 10+ countries" (self-reported in marketing copy, tracking is lost).

The game was universally compatible (iPhone + iPad from launch, which was unusual in 2012). Freemium model: free download with 100 questions; $0.99 IAP unlocked the full 1001-question bank and leaderboards. Reviewed positively by 148Apps (3.5/5) with the core critique being the absence of multiplayer. The game has been off the App Store for years and does not run on modern iOS.

### The original insight

Super Smart's design descended from a single thesis: in 2012, attention spans were being reshaped by Twitter and short-form media, and trivia as a genre hadn't caught up. Existing trivia games were long-form, test-feeling, and bloated. Super Smart proposed a new format: **maximum wit per second of play**, enforced by strict character limits (≤40 chars per question, ≤12 chars per answer), three answer choices instead of four, 10-second per-question timers, and 60-second arcade rounds.

The 1001-question database — recovered intact in April 2026 — confirms the discipline was real: 99.1% of questions fit within 40 characters; average question length is 23.6 characters. The short-form constraint was the forcing function that produced the game's actual differentiator — humor and wordplay in the distractors, conversational question phrasing, and a voice that treated the player as in on the joke.

### What made it good (the recovered DNA)

From launch-video analysis, the recovered question bank, and the archived marketing copy, the original's specific qualities break down like this:

- **Short-form trivia as a deliberate format.** Not just shorter, but engineered to be *fast* — every question designed to be read, decided, and answered in 2-3 seconds. Speed wasn't a constraint; it was the point. The 10-second per-question timer in Classic mode was a ceiling, never a target.
- **Humor baked throughout.** The joke can live in the question itself, in the answer options, in the pairing of the two, or in the distractor set (e.g., "American gangster" → Al Jazeera / Al Pacino / Al Capone). Wordplay, wrong-but-funny options, conversational setups, fourth-wall breaks ("resistance against the machines is ___" → [futile]) — humor is a designed layer of the game, not a side effect.
- **Conversational phrasing.** "A neighbor of France" instead of "Which country shares a border with France?"
- **Mixed categories within rounds.** Math, geography, wordplay, pop culture, and science all interleave — dopamine stays high because the player never settles into a groove.
- **Character mascot and visual language.** A pink brain with a lightning-bolt antenna, chunky comic-book typography, cream-and-red sunburst backgrounds. Bold, textured, playful — deliberately not minimalist.
- **Immediate feedback loop.** Bright red X for wrong, mascot appearing with exclamation ("AWESOME", etc.) for right. Score bumps. Timer resets. Next question.
- **Customizable avatar.** Modular brain builder (brain color + eyes + mouth).
- **Progression via named ranks** at the end of each round ("Genius" is confirmed; others likely).
- **Two modes.** Arcade (60 seconds, beat your high score, power-ups) and Classic (three-strikes, 10 seconds per question, no power-ups).

### What was weak (the recovered gaps)

- **No multiplayer of any kind.** This was the #1 critical complaint at launch and remains a gap we must close.
- **Question recycling noticed at the free tier.** 100 free questions wasn't enough buffer to prevent repetition, which hurt the free-to-paid conversion perception.
- **Dated pop-culture references.** Roughly 10-15% of the 1001-question bank is anchored in 2008-2012 specificity (Bieber-era pop, Sears Tower, certain athletes, certain politicians).
- **No social/shareable hooks.** Scores were siloed; there was no "I got 5850 on Super Smart, can you beat me?" moment.
- **Freemium paywall was aggressive for the era.** The $0.99 IAP gating leaderboards *and* 90% of the content now reads as clumsy.

### What's been recovered

As of April 18, 2026, the following assets have been recovered and are in hand or in inbox:

- **1001.xml** — the complete original question bank (1001 questions across 9 categories, ready for analysis, curation, and use as style reference)
- **Launch video** — 31-second MP4, frame-extracted, visual identity fully reconstructed
- **Marketing copy** — from the archived iamsupersmart.com site
- **148Apps review text** — complete, including the critic quote usable for relaunch press
- **Font list used in original branding** — "When Star Shine...", "Markus Ink", "Acknowledge" (logo)
- **Credentials:** Dreamhost hosting info from 2012 email (may or may not still be active)

### What's likely unrecoverable, and why it doesn't matter

- Source code (Bitbucket `shaa/supersmart`, access revoked 2016) — the code is Objective-C against iOS 6 SDK; rebuilding is cheaper than porting.
- Original .ipa binary on dev server (109.236.81.193) — wouldn't run on modern iOS anyway.
- Historic iTunes Connect sales data — nice-to-have for marketing narrative, not blocking.
- Original iamsupersmart.com site files — Wayback snapshots give us what we need.

### Bottom line

**We have enough to rebuild. More than enough.** The only genuinely critical recovered asset is the 1001-question XML. Everything else is additive.

---

## Part 2 — The 2026 Thesis *[DECIDED]*

### One-sentence positioning

**Super Smart is short-form trivia with a sense of humor — built for a world where everything else is short but empty.**

### The updated thesis, long form

In 2012, short-form was the novelty and Super Smart won by being first to the format. In 2026, short-form is the default — TikTok, Reels, Shorts, Stories are the air we breathe. But short-form has become synonymous with *hollow*: 15 seconds of nothing, a headline with no substance, infinite scroll fatigue.

Super Smart's 2026 bet is the opposite. Same skeleton as 2012 — tight character limits (≤40 chars per question, ≤15 per answer), 3-option multiple choice, 60-second arcade rounds, 10-second ceiling per question in Classic — but with **density of wit per second** made explicit and the brand promise. The target rhythm is read-decide-answer in 2-3 seconds per question. Speed isn't a constraint; it's the point. Every question earns its place. Every wrong answer is a joke, a near-miss, or a setup. Every correct answer delivers a tiny dopamine payload via character animation and a satisfying sound.

The game still takes 60 seconds to play an Arcade round. It's still the thing you do while you're waiting for coffee. But it's the short-form thing that *doesn't feel like junk food*.

### What stays from 2012

- 3 answer options (not 4)
- ≤40 char question limit
- ≤12 char answer limit (we'll tighten this to match the recovered corpus: ≤15 is the actual ceiling, ≤10 is the typical)
- 60-second round format (the Arcade duration survives; the standalone Arcade and Classic modes do not — both are absorbed into Quickmatch and Daily Race)
- Streak-based score multipliers (3/5/7 correct in a row → 2x/3x/4x)
- Mixed categories within rounds
- Humor-in-distractors question design
- Brain mascot as central character
- Named rank titles at end of round
- Universal iPhone + iPad (add iPad in v1 or immediately after)
- Self-aware, playful, slightly goofy brand voice
- "Get super smart today by getting Super Smart today!" as the closing CTA

### What changes for 2026

- **Multiplayer / social layer added.** Shape decided — see Part 4.
- **Post-answer kicker in Classic mode — deferred.** Kicker lines (one-line reveals after questions resolve) are not in the current build. The concept is preserved for future consideration but killed for now to keep Classic mode clean and the scope tight. See decision log 2026-04-18 (session 2).
- **Question bank scaled.** Target 2500+ at launch, from 1001 baseline, rebalanced toward classical/durable categories.
- **Monetization modernized.** Decided — see Part 5.
- **Visual identity refreshed but recognizable.** Brain mascot evolves rather than gets replaced. Sunburst aesthetic reinterpreted in 2026 design vocabulary.
- **Onboarding.** Original had none; 2026 needs a 30-second guided first round.
- **Cross-platform from day one.** iOS primary, but build choice preserves Android path.

### What's TBD

Minor items deferred to their build phase. See Appendix D for the active open list.

---

## Part 3 — The Game *[MIX]*

### Core loop *[DECIDED]*

1. Player opens app. Sees home screen with two mode cards (Quickmatch / Daily Race) and a bottom nav.
2. Player taps Quickmatch or Daily Race.
3. 60-second timer begins. Questions appear one at a time. Player taps an answer.
4. Correct: score up, mascot animation + sound, next question — immediately, no friction. The entire experience is designed for flow.
5. Wrong: red X, brief "correct answer was X" moment, streak resets to zero, next question.
6. Correct answers in a row trigger streak multipliers. Fast answers (under 2 seconds) trigger a flat speed bonus before multipliers apply. Both stack.
7. Timer expires. End screen: final score, rank title, share prompt, play again.

Quickmatch and Daily Race share identical mechanics. They differ in context: Quickmatch pits you against a ghost on the same question set for that match; Daily Race puts you and the whole world on the same question set for that day.

### Game mechanics — shared by both modes *[DECIDED]*

Both Quickmatch and Daily Race use identical mechanics. There is no separate "Arcade mode" or "Classic mode" — those have been retired. The 60-second format and streak system that defined Arcade are now the universal game engine.

- **60-second total round.** Unlimited questions within the window; speed and accuracy both rewarded.
- **Base score:** 100 points per correct answer.
- **Speed bonus:** Answer within 2 seconds → flat +50 points added before any multiplier. Makes the question worth 150 base. Requires clear visual signalling in the UI so players know the 2-second window exists and can chase it.
- **Streak multiplier ladder:**
  - 3 correct in a row → 2× on next answer
  - 5 correct in a row → 3×
  - 7 correct in a row → 4×
- **Stacking example:** Fast answer (sub-2s) on a 7-streak = (100 + 50) × 4 = 600 points for that question.
- **Wrong answer:** Streak resets to zero immediately.
- **Miss penalty:** 3 consecutive wrong answers in a row → −50 points. The miss streak counter resets after the penalty fires. Does not stack with the streak multiplier (which is already at zero). Keeps the floor meaningful without being punishing on isolated mistakes.
- **End of round:** Final score, rank title, share prompt, play again.
- **No power-ups beyond multipliers.** No skip, no extra time, no shields. The multiplier ladder is the only meta-layer on top of answering correctly.

**Equal ground principle:** In both modes, all players face the same question set in the same order within their competitive context. In Quickmatch, you and the ghost you're racing answered the same questions. In Daily Race, everyone in the world that day answers the same questions. You win or lose on speed and accuracy, never on question difficulty luck.

### Navigation architecture *[DECIDED 2026-04-19 session 5]*

Three tabs. Clean, focused, no decision overhead for the player.

- **Home** — mode cards (Quickmatch + Daily Race), One More button, compact leaderboard widget, brain + wordmark hero. Pure action screen. Getting the player into a round is the only job.
- **League** *(formerly Inbox)* — four sections in order: (1) Recent Activity feed (match results since last login or last 24h, whichever longer) + League of 30 standings for this week; (2) Daily Race board for today; (3) Global Ranking — Pro only, blurred teaser for free users; (4) Past Matches — personal match history. Badge dot when new activity arrives. Push notification fires on new activity if permitted.
- **Profile** — avatar, game log, personal stats, settings.

**Leaderboard placement:** a compact "you are here" widget lives on the home screen — your rank number plus 2–3 names immediately above and below you in the standings. Motivational glance before you play. The full leaderboard (all players, sortable, both boards) lives in the Inbox tab. Two different jobs, two different surfaces.

**Game log** lives in Profile, not top-level nav. Personal session history: date, mode, score, rank achieved, streak peak. Free tier gets a limited view (last 10 games); Pro gets full history. This is the "Advanced stats and personal records" Pro feature referenced in Part 5. Designed to be dug into occasionally, not checked every session.

Three tabs is a deliberate constraint. Super Smart is a focused game, not a social platform. Every additional tab is a decision the player has to make each time they open the app. Three tabs means navigation disappears into the play loop rather than interrupting it.

### Playing screen — feedback system *[DECIDED 2026-04-19 session 5]*

The playing screen is designed to be "alive" — it mirrors the player's performance state back at them through three independent layers of audio and visual feedback.

**Layer 1 — Always fires (every triggered event)**

- Correct answer SFX, amped if the answer was fast or part of a streak
- Wrong answer SFX, deliberately muted so it doesn't grate across a 60-second round
- 3-miss penalty fires a distinctly heavier wrong sound to signal the −50 point loss
- Speed visual: lightning effect fires from the tapped answer button on sub-2s answers
- Streak visual: a continuous "in the zone" cue appears at 3-streak and intensifies at each tier (3→5→7). Background sunburst rotation accelerates with streak level; halftone grid pulses. Cuts and deflates cleanly when streak breaks.
- Narrator callout (one per triggered event — see Layer 3)

**Layer 2 — Occasional (roughly 1 in 5 events, random)**

- Brain mascot reacts visually to powerup triggers and the −50 miss penalty
- Powerup reactions: celebratory/excited expressions
- Miss penalty reaction: sympathetic/wincing — not disappointed or judgy. The brain is on the player's side.
- Rarity-as-charm principle applies: reactions feel like a gift, never background noise

**Layer 3 — Narrator callout system**

- A narrator voice — the game's own personality, distinct from the brain avatar — delivers short callouts on powerup triggers. The brain does not speak; it reacts visually only.
- Callouts are NOT literal ("double!" / "triple!") — they are confidence boosts in the Super Smart brand voice
- Two tiers of callout copy:
  - **Common positives:** fire for any powerup trigger, randomly selected ("let's go!", "yes!", etc.)
  - **Event-specific:** reserved for notable moments — speed ("so fast!"), 4× streak ("quadruple!"), etc.
- One callout plays per trigger — if fast + streak fire simultaneously, only one is randomly selected
- Voice direction: warm, short (under 1 second), slightly amused — the game enjoying the player's performance, not a stadium announcer
- Text callout on screen: **TBD** — to be evaluated when visible in the playing layout. Risk: competes with question text for attention.
- Audio production: TTS (ElevenLabs or equivalent) for build/test phase; real voice actor as a potential pre-launch upgrade. TTS allows copy iteration without re-recording.

**Adaptive music:** explicitly cut from v1. Music (when added) is a static track at peak energy; the SFX and narrator layers carry all emotional variation. Adaptive/dynamic music is a v2 candidate after the game's feel is locked.

**Question transition:** snap-in with micro-bounce on the question text. Near-instant but not frameless. Happens 20–40 times per round — this transition is as important to the game's rhythm as any of the above effects.

**Build sequence for Phase 3:** visual pass first, audio pass second. Both are Phase 3 work items but they are separate efforts.

### Classic mode *[RETIRED — 2026-04-18 session 3]*

Classic mode (3-strikes, 10-second ceiling, no power-ups) has been retired as a standalone mode. The deliberate, knowledge-focused pacing it offered has been superseded by the equal-ground principle in both remaining modes: you lose because you were slower or less accurate, never because your questions were harder. The 3-strikes mechanic has no home in the current 2-mode structure and is not being preserved elsewhere.

### The kicker line *[RETIRED — 2026-04-18 session 3]*

Originally planned as a one-line post-answer reveal for Classic mode. Killed in session 2 pending Classic mode's existence. Classic mode has now been retired entirely, and the kicker line has no remaining home in the 2-mode structure. **Officially retired.** Not a candidate for revival without a major structural reason.

### Question structure — 2026 schema *[PROPOSED]*

Based on the 1001.xml structure plus the new requirements, here's my recommended v2 schema:

```xml
<question id="0001">
  <text>a neighbor of France</text>
  <option1>Switzerland</option1>
  <option2>Austria</option2>
  <option3>Portugal</option3>
  <answer>Switzerland</answer>
  <category>geography</category>
  <kicker>France has 8 land neighbors. Portugal is not one of them.</kicker>
  <tags>europe,borders</tags>
  <difficulty>easy</difficulty>
  <added>2012</added>  <!-- or 2026 for new -->
  <status>active</status>  <!-- or retired, flagged, etc -->
</question>
```

New fields explained:
- `kicker` — the post-answer line
- `tags` — finer-grained than category, for future smart queueing ("don't show three Star Wars questions in a row")
- `difficulty` — for future adaptive difficulty, not used in v1
- `added` — tracks which questions are recovered vs. new
- `status` — lets us retire problem questions without deleting them

**[DECIDED 2026-04-18] — Category rebalance for v2.**

Moving away from the 2012 split toward finer buckets and a classical/durable-knowledge bias. Rationale: (1) Misc is too undignified a catch-all for 230 questions and hides real categories inside it, (2) math was over-represented relative to its appeal in the original — kept fun but capped, (3) the game should still *teach* something, so history/people/geography get real investment, (4) contemporary pop culture is hardest to write and ages fastest, so it's explicitly reduced in favor of durable references.

Target split for v2 (approximate, total ~2500):

- History: ~250 (new category, partially absorbed from old People and Misc)
- Geography: ~250
- People: ~200 (classical/historical figures — Houdini, Tolstoy, Marie Curie types, not current celebrities)
- Science: ~200
- Word/Wordplay: ~250
- Math: ~200 (reduced from 175 in a much larger bank, so proportionally down)
- Music: ~150 (mix of classical and durable pop)
- Movies: ~150 (classics + franchises with genuine staying power)
- Literature: ~100 (expanded from 10)
- Pop culture / contemporary: ~100 (smaller, refreshed seasonally via Pro packs)
- Misc / curiosities: ~150 (the truly uncategorizable — jokes, one-offs, oddities)

"Misc" is preserved as a genuine category for the weird ones, but reduced from 230 to ~150, and only the questions that actually don't fit elsewhere stay in it.

Numbers are targets, not rigid quotas. If a category wants to grow during writing, that's fine — this is the starting shape.

### Ranks *[DECIDED 2026-04-18]*

The rank ladder is preserved from the original game, recovered from personal files. Twenty-two ranks, each with a score threshold. Rank names carry the Super Smart voice — the bottom ranks are self-deprecating, the middle is flat on purpose (the game is bored by you), the top seven climb toward the brand's own name.

1. Really? (0)
2. Heartbreaking (1-100)
3. F for Effort (201-300)
4. Sad (301-400)
5. Unfortunate (401-500)
6. Poor (501-700)
7. Amateur (701-900)
8. Tolerable (901-1200)
9. Average (1201-1500)
10. Acceptable (1501-1800)
11. Decent (1801-2100)
12. Respectable (2101-2400)
13. Good (2401-2800)
14. Smart (2801-3200)
15. Great (3201-3600)
16. Terrific (3601-4000)
17. Fantastic (4001-4500)
18. Excellent (4501-5000)
19. Elite (5001-5500)
20. Genius (5501-6200)
21. Mastermind (6201-7000)
22. Super Smart! (7001-9000)

**Rank names are frozen.** They carry the brand's voice and are not candidates for refactoring without strong cause. Score thresholds may be tuned in playtest if the curve feels off.

### Avatar system *[DECIDED 2026-04-24]*

Modular brain builder. Three components: **brain color, eyes, mouth.** Antenna (lightning bolt) is fixed brand identity — not customizable. All items are cosmetic, not gameplay-affecting.

**Where the avatar appears:** ghost preview screen, result screen, playing screen, leaderboards. It is a multiplayer identity signal first — the face of every competitive interaction — not a Profile vanity toy.

**Option tiers:**
- **Free base kit:** 4 brain colors, 4 eye styles, 4 mouth styles (64 combinations). Enough to feel like yourself from day one.
- **Earned through play:** additional items unlocked via gameplay milestones (hit Unstoppable, reach a league tier, complete N Daily Races, etc.). Specific conditions designed in Phase 3.
- **Pro exclusive:** 4 additional brain colors, 4 additional eye styles, 4 additional mouth styles. Pro players have access to 8 options per component (512 combinations total).

**League rank border:** the avatar displays a colored stroke/border indicating the player's current league tier. Eight tiers, eight colors — rough progression from dull to premium:
1. Newcomer — grey
2. Regular — white
3. Contender — green
4. Veteran — blue
5. Qualifier — purple
6. Finalist — orange
7. Champion — red (Cream Stadium red)
8. Legend — gold (animated shimmer)

Border reflects last week's confirmed rank, not live current-week standing. Exact border weight, color values, and shimmer execution finalized during Phase 3 visual pass.

### Onboarding *[DECIDED 2026-04-24]*

The 2012 version had no onboarding. The 2026 version has one — but it's designed to feel like the game, not a tutorial.

**Core principle:** the best onboarding for Super Smart is playing Super Smart. No tutorial screens, no rules explained upfront. Get the player into a round within 30 seconds of opening the app for the first time.

**First-open flow:**

1. **Animated wordmark splash.** App opens to the Super Smart wordmark doing its water-balloon bloat animation on the cream/sunburst background. 2–3 seconds. No copy, no buttons. Pure brand moment. Fades into the home screen.

2. **First-time home screen.** Identical to the normal home screen except the leaderboard widget is replaced with a single line: *"Tap Quickmatch to play your first round."* League and Profile tabs are greyed out until the player completes one round. Between Quickmatch and Daily Race on the home screen, the player chooses freely — Daily Race is a valid first experience too.

3. **Sign in with Apple / Google — fires on first game tap, regardless of mode.** Display name is pulled automatically from their platform account. No manual name entry. They can change their display name anytime in Profile (30-day cooldown to protect leaderboard integrity). If they are not signed in or decline, they play as an anonymous Supabase session — data is saved, prompt returns at natural moments (e.g. before accessing leaderboards). Email magic link available as fallback for players who won't use platform auth.

4. **First round — ghost-free, two contextual nudges.** Full-length round (60 seconds), normal mechanics, nothing dumbed down. Ghost opponent is skipped — the "you're first — set the pace" fresh-set state handles this naturally and honestly. Two UI nudges appear once and never again:
   - When they answer correctly in under 2 seconds for the first time: *"Under 2s — speed bonus!"*
   - When they hit their first 3-streak: *"3 in a row — 2×!"*
   Miss penalty, One More button, leagues — discovered naturally when relevant. No pre-explanation.

5. **After round one.** Normal rank reveal, normal result screen. No welcome banner. League and Profile tabs unlock. From round 2 onwards: full experience, ghost opponents, everything live.

**Name change:** display name is editable in Profile. 30-day cooldown between changes. One Supabase `name_last_changed` timestamp field enforces this — straightforward to build.

**If they play Daily Race first:** same flow applies. Sign in prompt fires on first game tap. Same two contextual nudges fire on first round regardless of mode — tied to the player, not the mode. Once seen, never shown again. Daily Race is once-per-day so their natural next session is Quickmatch anyway.

### Daily Race *[DECIDED 2026-04-18 session 3; format corrected 2026-04-19]*

One of the two home-screen modes. Shares all game mechanics with Quickmatch (60-second round, streak multiplier ladder, speed bonus, miss penalty) and runs on the same engine — the differentiator is competitive context, not rules.

- **Same question set for everyone globally, that day.** The defining feature — every player that day faces the same questions in the same order. Seeded by date so the set is identical for all players worldwide. Fast players get deeper into the set; slower players answer fewer. The early questions are shared by everyone, which creates the water-cooler comparison moment.
- **60 questions, 60-second round.** Identical format to Quickmatch. The differentiator is what you're competing *on*, not how long you play. *(Note: an earlier spec proposed 10 questions / Classic pacing. That was superseded — the shared-mechanics principle and the "no Classic mode" decision make 60s/60q the correct format. See decision log 2026-04-19.)*
- **Once per day.** Locked after the player completes it. Cannot replay to improve your score.
- **Resets daily.** New question set, new leaderboard. Reset time: decide in Phase 4 (UTC midnight vs local midnight).
- **Shareable result.** 🟩🟥 grid showing correct/wrong per question, plus final score. "Super Smart Daily — 41/60 · 4,850 pts." This is the viral hook and the water-cooler trigger.
- **Daily Race leaderboard:** Today's high score list for today's specific question set only. Who scored highest on the same questions everyone played. Resets with each new day. No all-time component — this board is purely about today's shared test.

Daily Race is the "come back tomorrow" retention loop and the "talk about it at work" mode. The once-per-day constraint combined with shared questions is what gives it identity separate from Quickmatch.

---

## Part 4 — Multiplayer & Social *[DECIDED 2026-04-18]*

The 2012 version had no multiplayer; it was the #1 critique at launch. For v1 we're building three complementary layers, none of them true live multiplayer, all of them designed to make the game feel alive and social from day one — even at zero players.

### The core principle

We are not competing with Trivia Crack (async turn-based) or HQ Trivia (live real-time). We are building **asynchronous multiplayer that feels emotionally live** — inspired by the design lineage of Dark Souls, Death Stranding, and Mario Kart ghost races. The player's round should feel populated by other humans without requiring those humans to be online at the same moment. This shape has structural advantages over true-live for a relaunching game: no dependence on matchmaking pools, no toxicity, no timezone problems, no tipping-point player-count requirement. It gets richer as the game gets more popular, without new engineering.

### Layer 1: Quickmatch (Echo, ghost-based) — the primary mode

**The round:**
- Player taps Quickmatch on home screen.
- Matching logic runs instantly (see Ghost pool architecture below). A 1–2 second anticipation beat plays in the UI regardless — deliberate, and varied between 1 and 2 seconds so it never feels automated.
- Before the round begins, player sees: opponent's avatar, name, timestamp ("played 2 hours ago"), and the opponent's post-game interview emote from *their* previous round.
- 60-second round begins. Both players answered the same questions in the same order — equal ground. You win or lose on speed and accuracy, never on question difficulty luck.
- Opponent's score is hidden during play. Dramatic reveal at the end.
- At round end: reveal both scores, declare winner, offer the player their own post-game interview emote to leave for the next person who races their ghost.
- Options after round: new ghost, challenge a specific friend (Layer 2), or return home.

**Ghost pool architecture** *[DECIDED 2026-04-18 session 3]*

*Question sets:*
- A question set is 60 unique questions drawn randomly from the question bank. The number of possible combinations from a 2500+ question bank is astronomically large — question sets are effectively infinite and never need to be curated manually.
- The backend maintains a buffer of 1000 pre-generated question sets at all times. A background job refills the buffer before it runs low.
- A question set has a lifecycle: it is **retired from Quickmatch matching** if it has not been activated within 30 days, or once it accumulates 10,000 plays. Retired sets remain accessible via Challenge-a-Friend links indefinitely — shared links never break.
- The core guarantee: **no player ever sees the same question set twice** in Quickmatch (challenge links are the only exception). The 10,000-play retirement threshold exists to serve this guarantee — the exact number is less important than the constraint it enforces.
- The 1-second UI lock (see Game mechanics) means a player cannot physically answer more than 60 questions in 60 seconds. 60 questions is both the set size and the theoretical maximum questions answered per round. In practice, players answer 20–45 questions depending on speed.

*Ghost selection — the baton pass:*
- When a player is matched to a question set, they race the **most recently completed ghost at their skill tier** on that set. Player A creates the set → Player B (same tier) races Player A → Player C races Player B → and so on. Each player inherits the current ghost and becomes the ghost for the next player at their tier.
- This creates a living chain of competition rather than a static benchmark.

*Skill-based matching:*
- All matching logic runs instantly as a database query. The 1–2 second UI beat is a designed pause, not actual wait time.
- **Matching rule:** skill tier filters first; recency within tier is the tiebreaker. The system finds the most recently completed ghost within the player's tier on an active question set. If no match exists at that tier, the search silently expands to the nearest adjacent tier (up or down) until a match is found. This always resolves before the UI beat completes — the player never waits beyond the anticipation pause.
- See Skill tier system below for how tiers are defined.

*Fresh sets — "fresh game" moment:*
- When a player is assigned a question set that has no ghost runs yet, no fake opponent is shown. Instead the player is told — in Super Smart voice — that this is a fresh game and their run will be matched with an opponent. This is honest, gives the player a meaningful role in seeding the pool, and frames the moment as an invitation rather than a fallback.
- A race condition guard ensures only one player at a time receives the fresh-set assignment. Atomic lock on set assignment prevents two simultaneous players being told they're first on the same set.

**Skill tier system** *[DECIDED 2026-04-18 session 3]*

- **5 internal tiers.** Not shown to players anywhere in the UI — purely a backend matching signal.
- **Player skill = rolling average score over their last 10 games**, combining both Quickmatch and Daily Race sessions. The mechanic is identical in both modes so scores are directly comparable.
- **New players** (fewer than 5 completed games) are automatically placed in Tier 1 (lowest) regardless of their actual scores. This ensures their first matches feel winnable, which is more important for retention than accurate matching early on.
- **Bracket thresholds are percentile-based, not fixed.** Tiers are defined by the actual score distribution of the active player population, recalculated weekly:
  - Tier 1: bottom 20th percentile
  - Tier 2: 20th–40th
  - Tier 3: 40th–60th (median)
  - Tier 4: 60th–80th
  - Tier 5: top 20th percentile
- **Inertia formula** prevents wild swings from a single week's data: `new_threshold = (old_threshold × 0.70) + (calculated_threshold × 0.30)`. Brackets drift toward reality slowly — a significant population shift takes several weeks to fully propagate.
- **Initial thresholds** are set manually by the creative director before launch, based on playtest data. This is a required pre-launch action. **[OPEN — Phase 4/5: creative director to provide initial bracket score values based on beta playtest results.]**

### Layer 2: Challenge a Friend

Player generates a shareable link or code after any round. Friend plays the exact same questions in the exact same order. Results compared. Works for the use case Echo can't serve: "I want to play *this specific person* right now." Viral via iMessage / WhatsApp / IG DMs. No accounts required on either side.

**Challenge ghost rule:** everyone who plays a challenge link always races the original sender's ghost — permanently. The challenge link is unique to the sender. Unlike Quickmatch's baton pass, challenge ghosts are static and never update. This means: no matter how many people play your challenge link, they all race you specifically.

**Challenge results:** the sender can view a results page at any time showing everyone who played their challenge link — ranked by score, with their emote. Accessible from the Inbox tab (see Navigation architecture, Part 3). No dedicated challenge-results screen required at launch — the Inbox surfaces this naturally.

### Layer 3: Three leaderboards *[UPDATED 2026-04-19 session 6]*

Three distinct leaderboards at different competitive radii. Free and Pro tiers have access to different boards by design.

**League of 30 (everyone)** — your weekly cluster. See Part 4, Layer 4. The intimate competition: your 30-person group, weekly, skill-adjacent. Most players will check this most often.

**Daily Race leaderboard (everyone)** — today's high score list for today's specific Daily Race question set only. Resets with each new day. No all-time component. Equal ground, single-day comparison, water-cooler ranking. This board answers: who scored highest on the same quiz everyone played today?

**Global all-time ranking (Pro only)** — cumulative score across every Quickmatch session (including Challenge-a-Friend plays) and every Daily Race ever completed. The hardcore power-user board. Updated twice daily — once at the daily reset, once 12 hours later. The "check it in the morning, check it at night" rhythm.

**Important: free users are ranked, they just can't see it.** Every score a free user posts is recorded toward the global ranking from day one. When they upgrade to Pro, their historical rank is immediately visible — they're already on the board. "Pay to see" not "pay to participate." This makes the Pro upgrade feel like unlocking something you've already earned, not like starting from scratch.

The three boards serve three different player motivations: your peers this week (League) → everyone today (Daily) → everyone ever (Global). Each radius is a different reason to play.

### Post-game interview emotes

A curated emote library (~15 in v1, expandable in themed packs post-launch). Emotes are reactions *to the round the player just played*, framed as if the player is answering "how did that game make you feel?" — not greetings, not trash talk. Voice of emotes matches the Super Smart brand: cheeky, self-aware, in-the-joke. The emote is the static trace the player leaves behind, attached to their ghost, visible to whoever races them next.

### Opponent presence during play — the principle

Opponent's side of the screen is deliberately minimal: static display of their avatar, name, timestamp, and their emote from the previous round. Their score is hidden. Their mascot is mostly motionless.

**Rare easter-egg reactions** are the only dynamic element. The principle is *rarity as charm* — reactions should happen on <10% of rounds and feel earned when they do (e.g., a tiny "wince" when the player gets right what the ghost got wrong under specific narratively-satisfying conditions). The system is built to support future reaction types without reshipping. Specific triggers tuned in playtest.

This principle holds even if the avatar/customization system is scrapped later — a default mascot works just as well.

### The Inbox — activity feed

The Inbox is a permanent tab in the bottom nav (see Navigation architecture, Part 3). Not a popup — accessible any time the player wants it. Badge dot appears when new activity arrives.

**What it shows:** everyone who raced your ghost or completed your challenge since your last login, or the last 24 hours — whichever window is longer. Each entry shows: opponent name, avatar, emote they left, their score vs. yours, win/loss. Challenge completions and Quickmatch ghost races feed into the same unified feed.

**Push notifications:** fires when new activity arrives, if the player has permitted notifications. No dark-pattern pressure to enable — offered once at a natural moment, never nagged.

**"Best moment" surface:** one featured highlight surfaced at the top when available (e.g. "3 people tried and nobody beat you", "someone matched your high score exactly"). Designed to feel like a small gift on return, not a Slack notification log.

**Leaderboards** live in the Inbox tab: League of 30 (everyone), Daily Race board (everyone), and Global all-time (Pro only — visible but locked with an upgrade prompt for free users). The home screen carries only a compact "you are here" widget for the daily board (see Navigation architecture). The Inbox is where you go to dig in.

### Honesty layer

Transparency about ghost vs. live opponents is preserved via the timestamp on every opponent display. Players who care can see; players who don't can just play. The design doesn't pretend — "played 2 hours ago" is plain-English honest and protects us from the trust-breakdown moment if the architecture ever gets scrutinized publicly.

### Layer 4: Weekly League of 30 *[DECIDED 2026-04-19 sessions 6–7]*

A Duolingo-inspired weekly competitive league. Players are sorted into clusters of up to 30. League standings are calculated from cumulative scores across all Quickmatch and Daily Race rounds played that week. Promotion/demotion between league tiers is based on final weekly standings.

**League tiers:** 8 tiers, named in competition-circuit language — deliberately separate from the 22-name rank ladder. Bottom to top:

1. Newcomer
2. Regular
3. Contender
4. Veteran
5. Qualifier
6. Finalist
7. Champion
8. Legend

Tier assignment at season start based on prior season final position. First-time players start in Newcomer. Top 5 promote, bottom 5 demote each week. *[DECIDED 2026-04-24]*

**Weekly reset and transition window:**
Leagues don't flip instantly at reset. There is a 2-hour transition window between league close and league open (e.g., old league closes Monday 8am → new league opens Monday 10am). During the transition window, players who play are accumulating real points toward the new league. When the new league opens, it is seeded with those players and their transition-window scores — so it opens populated with real, demonstrably active players, not an empty board. Players in the transition window see: **"New league starts in X hours · Your points are counting toward your new league."**

The 2-hour window is a tunable variable — adjust in playtest based on how populated leagues feel at open.

**League formation rules:**
Formation happens at the moment the new league opens, using everyone who scored during the transition window.

- **Under 5 players** → no league opens yet. These players enter the forming queue (see below).
- **5–29 players** → one league opens with those players. Fills to 30 as newcomers join during the week.
- **30–44 players** → split into two equal leagues (15–22 each). Both fill to 30 as newcomers join during the week.
- **45+ players** → divide into as many leagues as needed, keeping each between 15–30. Always prefer fewer, fuller leagues over more, thinner ones.

**Forming queue — "finding your league":**
When all existing leagues are full, new players who play for the first time that week don't open a single-person league — they enter a forming queue. Their points count from the moment they play. The queue opens a new league the moment it reaches 5 players, with their earned scores already in it. Players in the queue see: **"Finding your league · X players so far · Your points are counting."**

If the queue hasn't hit 5 by end of Tuesday, open the league with however many people are in it — prevents anyone sitting in limbo for most of the week.

**No ghost-fill in leagues.** Every name on a league board is a real player who played that week. This is the design's honesty advantage over alternatives — no fake activity, no archived runs posing as competitors.

**Matchmaking within a league cluster — weighted random *[DECIDED 2026-04-19 session 7]:***
Cluster composition is weighted random, biased toward same league tier ±1. Not pure random (too lopsided at small counts) and not strict skill-sorting (too predictable, too complex). "More likely" — probabilistic, not a hard filter — means variance and upsets still happen, but the worst mismatches (Genius tier dominating 29 Amateurs) are rare rather than routine.

At small player counts the weighting is effectively moot — if only 6 players are at a given tier that week, they cluster together regardless of weights. The system becomes more meaningful as the player base grows, which is the right direction.

**Tier visibility:** league tiers are never shown to other members of your cluster. The league board shows names and scores only. This keeps the social dynamic clean — no scrutiny of "why am I matched with this person," no tier-shaming, no gaming the system by picking leagues you'll dominate. Your tier is your own business.

**Why this works at low player counts:** the transition window seeding and forming queue mean leagues always open with real, recently active players. A league of 8 real scorers is a real league. Growth is organic — leagues get fuller as the game grows, without any fake scaffolding to remove later.

**End-of-league UX *[DECIDED 2026-04-24]:***
Hybrid approach. Push notification fires when the league ends. First app open after a league closes triggers a brief interstitial — once only. After that first open, the result lives as a card at the top of the League tab until dismissed.

Three tiers of interstitial based on outcome:

- **Promoted (top 5):** Celebratory. New tier name revealed with weight. This is the screenshot moment — unmistakably Super Smart, shareable.
- **Held (positions 6–25):** Honest, slightly dry, motivating. Super Smart voice — self-aware without being punishing. Acknowledges the result, points toward next week.
- **Demoted (bottom 5):** Quiet. Not a shame spiral. Honest in the Super Smart voice — the game doesn't pretend you didn't finish last, but it doesn't rub it in either.

All three show: final league position, score, and the tier entering next week. Specific copy written in Phase 3/4 alongside the broader copy pass.

**What's not in v1 League:**
- No league-specific rewards or cosmetics at launch (Phase 3/4 consideration)
- No opt-out mechanism initially — all active players are placed automatically

### Explicitly out of scope for v1

- **Pass-and-play** (shared device): may revisit post-launch, cut to keep v1 scope tight
- **True live 1v1 head-to-head:** strong candidate for v2-of-v2 once we have a real player base; live matchmaking with no players is a broken feature
- **Async turn-based (Trivia Crack model):** not worth competing on their ground

---

## Part 5 — Monetization *[DECIDED 2026-04-18]*

### The model

**Free tier:** All 2500+ questions, both game modes, all multiplayer (Echo, Challenge, Leaderboards), all avatar customization. 5–7 free rounds per day included. No ads, anywhere, ever.

**Super Smart Pro — one-time purchase, tentatively $4.99:**
- Unlimited rounds (no "One More" button)
- Access to seasonal question packs as they release (4–6 per year, all included once Pro)
- Premium avatar items
- Advanced stats and personal records (full game log)
- **Global all-time leaderboard** — your rank across every player who's ever scored points (Quickmatch + Challenge plays + Daily Race, cumulative). Updates twice daily. Free users are ranked but can't see it — Pro unlocks the view.
- **1 Streak Shield auto-granted every Monday**, up to the 3-shield cap
- Pro badge on leaderboards and ghost opponents
- Possibly: private leaderboards for friend groups (deferred decision)

**Ads are explicitly off the table.** Not in v1, not planned for v2. Ads would undercut the "short-form that isn't junk" brand thesis.

### The "One More" mechanic — brand-native replacement for the ads paywall

After daily free rounds are used, players see a single button labeled "One More" (copy subject to refinement). Tapping the button grants an additional round — no ad, no video, no friction. Small teasing copy underneath the button refreshes each tap, written in the Super Smart voice.

Copy examples (direction, not final):
- "Real Pavlovian, huh?"
- "Could've just bought the Pro pack."
- "We respect you too much to show you an ad."
- "If this were an ad, you'd be 15 seconds older."

Copy escalates with tap count — early taps are light, later taps get more knowing, eventually breaking the fourth wall. Full copy library target: 100+ lines, written in the same writing pass as kickers and questions.

Optional escalation cap: after ~100 taps in a day, button may go dark with a final line like "honestly, just get the Pro pack already, it's $5." This is the joke's punchline — a release valve, not a hard gate.

### Why this model

- **Brand-aligned.** The monetization moment becomes content in the Super Smart voice, not a transactional interruption. Every friction point in the app speaks with the same humor as the questions and kickers.
- **Conversion funnel through affection, not annoyance.** Normal ad-gated models convert players who buy to *escape* the experience. The One More button converts players who buy to *support* the experience. Different emotional transaction, healthier customer base.
- **Word-of-mouth asset.** The escalating copy turns the paywall into something players screenshot and share.
- **Clean money.** Players who pay, pay because they love the game. No regrets, no refund requests, no "dark pattern" accusations.
- **Scales.** 5% Pro conversion at $4.99 hits meaningful revenue at 100k+ installs; doesn't cap the way ads-free models usually do, because the pack-release rhythm gives Pro ongoing value.

### Honest trade-offs

- Revenue ceiling is lower than ad-heavy casual mobile. This is an accepted trade: we're optimizing for brand integrity and sustainable support, not maximum revenue per user.
- Paid user acquisition math is tighter without ads. Organic/guerrilla launch is the plan anyway, consistent with the 2012 approach. If paid UA ever becomes necessary, we'd revisit.
- A dedicated player could theoretically tap the button indefinitely without paying. Accepted: those players weren't converting anyway, and they're promoting the game with every laugh.

### Streak Shield — consumable IAP *[DECIDED 2026-04-19 session 6]*

Streak is defined as playing the Daily Race every single day without missing. A Streak Shield prevents a streak from breaking when the player misses a day — modelled after Duolingo's streak freeze mechanic, which is the clearest consumer-facing implementation of this pattern.

**One item type, two use behaviors:**

- **Proactive (have it before you miss):** Shield activates automatically on the day you miss. No action needed.
- **Retroactive (buy it after you've already missed):** Shield repairs a broken streak for up to 48 hours after the break. You can buy a shield the next day and restore yesterday's streak — but not a break from 3 days ago.

**Inventory rules:**
- Maximum 3 Streak Shields held at any time
- Cannot purchase if already at the 3-shield cap (prompt: "you already have 3 — use one first")
- Purchase options: 1 shield, 2 shields, or 3 shields (convenience bundles at appropriate prices — TBD Phase 5)

**Allocation by tier:**
- **Free users:** Start with 1 Streak Shield at first launch. If used, it's gone — no replenishment except purchase.
- **Pro users:** Receive 1 free Streak Shield automatically every week (Monday, same as league reset), up to the 3-shield cap. Net effect: a Pro player who plays consistently never needs to buy shields; a Pro player who misses occasionally has a buffer automatically. Pro does not give infinite shields — it gives a reliable weekly top-up.

**Why this model:**
- One item type (not separate "freeze" vs "repair") keeps the inventory simple and the UI non-confusing
- The 48-hour retroactive window is borrowed from Duolingo — it's generous enough to feel humane, strict enough to prevent casual abuse
- Pro's weekly auto-grant makes the shield a passive, low-stress benefit rather than a thing Pro users have to actively manage
- Free users get a taste at launch, then face a real decision when it's gone — good conversion mechanic without being hostile

**Seasonal pass:** Door open for future consideration. Not a current priority, not being designed. If it comes, it comes post-launch as a v1.1+ addition. Nothing in v1 should depend on or assume a seasonal pass exists.

### What's deferred

- Exact price point ($4.99 vs $7.99 vs other) — revisit closer to launch based on category benchmarks
- Streak Shield bundle pricing — Phase 5
- Pro badge visual design — Phase 2 visual work
- Private leaderboards as Pro feature — decide during Phase 4 multiplayer build
- The full 100+ One More copy library — written alongside kickers in content phase

---

## Part 6 — Brand & Visual Identity *[MIX]*

### Voice *[DECIDED]*

- Playful, self-aware, treats player as in on the joke
- Confident without being smug
- Never mocks the player for wrong answers
- Occasionally breaks the fourth wall ("don't pick this" as a wrong answer)
- Tongue-in-cheek marketing copy ("Almost recommended by 1 out of 4 doctors")
- The closing CTA stays: "Get super smart today by getting Super Smart today!"

### "Build for the Flex" — design principle *[DECIDED 2026-04-19 session 6]*

Every design decision should be made in service of the screenshot moment. If a player is going to stop mid-session and show someone their phone, what are they showing? Make that moment spectacular.

This is a framing principle, not a visual checklist. It means:
- The score at the end of a round should look like something you want to photograph
- The rank reveal moment should feel earned and slightly theatrical
- The league standings screen should feel like a real table, not a generic list
- Shareable moments (Daily Race grid, challenge results) are first-class design surfaces — not afterthoughts
- Micro-interactions should have a "did you see that?" quality

The Flex is not about adding chrome — it's about making the core moments unmistakably *Super Smart*. If someone screenshots the end screen and posts it without explanation, the game's visual identity should be immediately legible.

### Visual direction *[DECIDED 2026-04-19 — locked in code]*

**Palette — Cream Stadium (locked):**
- Cream: `#FFF4DF` — background
- Ink: `#1A1522` — text, borders, shadows
- Red: `#E8253C` — primary action, brand color
- Yellow: `#FFD23F` — accent, multiplier badge
- Quickmatch mode: `#FF3D7F` (hot pink) — card and UI accents
- Daily Race mode: `#7BEFFC` (cyan) — card and UI accents

**Typography (locked):**
- **Archivo Black** — all display text, headings, the wordmark, button labels
- **JetBrains Mono** — body copy, labels, scores, secondary UI text
- Both fonts loaded via Expo Google Fonts at app startup

**Background layers (global — all screens):**
- Rotating sunburst: 24 rays (every other drawn → 12 visible wedges), slow continuous rotation (~0.04°/frame). **Colour: `#FFD6A8` (warm peach-yellow). Opacity: 0.45.**
- Halftone dot grid: 9pt spacing, dots at radius = spacing/4.5, ink color at 7% opacity.
- Both layers live in the **root `_layout.tsx`** — rendered once, behind every screen in the app (tabs, game screens, end screen, daily, all of them). Individual screen backgrounds are transparent so the global background shows through. Card and surface backgrounds remain cream — they are intentional UI surfaces, not page backgrounds. *(Previously only on the home screen. Promoted to global in session 7.)*

**Mascot (implemented v1):**
- Animated brain component with multiple expression states: smirk, hype, sad, skeptical, sleepy
- Wiggle animation on idle; expression swaps on tap
- Speech bubble above on home screen

**Wordmark (implemented):**
- "SUPER" / "SMART" stacked, each letter bobs on independent sine-wave phase
- Water-balloon bloat fires every 6 seconds: cubic ease-in inflate → exponential spring-back with per-letter ripple
- Spinning starburst "!" badge on the right of SMART
- Row-level sway on slow independent cycles

**Mode cards — ArcadeCard component (implemented, corrected 2026-04-19 session 6):**
- Chunky 3D press-down buttons with continuous idle bob float animation
- Bob float: sine-wave ±1.5px Y + ±0.5° tilt, 4-second cycle. Sibling cards run out of phase (`floatPhase` prop) so they never bob in sync.
- Press-down: card face sinks to meet its ink shadow on tap (CARD_DEPTH), float scales out as press bottoms in. Shadow tracks the bob at all times so the 3D depth illusion holds during float.
- **Card static tilt: `tilt={0}` on both Quickmatch and Daily Race cards.** *(Earlier build had tilt={1.2} and tilt={0.8} — looked like a mistake on real device, not stylish. Removed.)*
- Android fix: `overflow: 'hidden'` must live on a non-animated inner `View`, never on the `Animated.View` wrapper — Android clips at original bounds during translation.

**Tab bar — TokenTabBar component (implemented):**
- Custom tab bar replacing expo-router's default, using the `tabBar` prop on `<Tabs>`
- Chunky arcade-door button style: `52×56pt` face, `14pt` border radius, `4pt` depth shadow
- Active state: yellow border (`Colors.yellow`)
- Press spring animation: 3pt sink, spring config `{mass: 0.2, damping: 12, stiffness: 500}`
- Haptic feedback on iOS press
- SF Symbols on iOS, MaterialIcons fallback on Android (full mapping in `components/ui/icon-symbol.tsx`)

**What stays from the original 2026 direction:**
- Brain mascot as central character — evolved, not replaced ✅
- Chunky display typography ✅
- Bold, saturated palette ✅
- Textured, anti-minimalist aesthetic ✅
- Sunburst is back — but animated, not static ✅
- Custom motion language as first principle — no default library animations ✅

**Still to come:**
- Sound design system (Phase 3)
- Full motion pass across all screens (Phase 3)

**[DECIDED 2026-04-18] — Who does the visuals.** Primarily creative director + AI-assisted, with a new designer brought in where expertise genuinely matters (brand mascot evolution, core UI direction, motion language definition). The original 2012 designer is not being reconnected with for v2. Rationale: most asset-level work is within reach of a focused creative director + AI workflow in 2026; a designer is brought in for the pieces where taste and professional craft outweigh speed.

### Logo & mascot *[DECIDED as direction, OPEN in execution]*

The pink brain with lightning-bolt antenna stays. The wordmark ("SUPER SMART" stacked in chunky red) stays in spirit but gets a modern re-draw. Centuple studio logo is not coming back as studio branding (you've decided) but *may* appear as a top-tier power-up easter egg (see Part 3).

### Name *[DECIDED]*

The name stays: **Super Smart.** We'll deal with the App Store name collision (the existing "SUPERSMART Party Trivia" app) via a subtitle. Candidate subtitle: "Super Smart — Quick Trivia." Or "Super Smart — Since 2012." (Legacy nod might actually be a feature, not a bug.)

---

## Part 7 — Build & Technology *[DECIDED]*

### Approach *[DECIDED]*

**Claude Code + cross-platform framework** as the primary build path. You're the creative director; I'm the technical implementation. You describe behavior and visuals; I write and run the code. We iterate in short loops.

This was decided in the very first conversation. The alternative — hiring a developer — remains a fallback if we hit a wall, but we're not leading with it.

### Framework choice *[DECIDED 2026-04-18]*

**Decision: React Native + Expo.**

Rationale:
- Fastest path from zero to a playable build on phone (Expo Go preview eliminates most iOS build friction)
- Strongest match for AI-assisted development (largest ecosystem, most training data, Claude Code's most reliable framework)
- Free Android path preserved without additional build work
- Strongest primitive animation libraries (Reanimated, Moti, Skia for React Native) — critical for the custom motion language principle below
- Apple Developer account + full Xcode pipeline deferred until shipping prep; Expo Go handles development preview

Flutter was the defensible alternative but loses on ecosystem size, Dart language overhead, and beginner-friendliness. Swift/SwiftUI was skipped because iOS-only lock-in isn't worth it for a game that doesn't need AAA-native performance.

### Custom motion language *[PROJECT PRINCIPLE, DECIDED 2026-04-18]*

**The game does not use default library animations.** Every transition, reaction, micro-interaction, and easter-egg moment is custom-designed and custom-timed. No template spring curves, no stock bounce-ins, no off-the-shelf Lottie packs.

This is a first-class work item in Phase 2 (visual direction), handled alongside the visual identity brief. The designer and the AI collaborator work together to define the motion vocabulary first, then implement it custom.

**Why this is a principle and not just a preference:** The framework doesn't dictate aesthetic sameness — default libraries do. Most apps that feel template-y got that way by reaching for common libraries unchanged. Our counter is a commitment, recorded here, to design motion as deliberately as we design visuals and questions. If a reviewer in 2027 can tell what framework we used from how the UI feels, we failed this principle.

### Android compatibility *[STATUS: confirmed 2026-04-19 session 6]*

React Native + Expo builds for Android from the same codebase. Key platform-specific issues discovered and resolved during the Phase 2 prototype build:

- **SF Symbols → MaterialIcons fallback** is working via `components/ui/icon-symbol.tsx`. All icons used in the app have confirmed Material Icon mappings. Adding new SF Symbol icons requires a corresponding entry in the MAPPING object or they crash on Android.
- **`overflow: 'hidden'` on Animated.View** causes Android to clip at the component's original bounds during translation. Fix: always apply `overflow: 'hidden'` on a non-animated inner View inside the Animated wrapper (see ArcadeCard architecture). This is a required pattern for any future animated component that needs overflow clipping.
- **Expo Go** is the development preview path on real devices — no Xcode or Gradle needed during development. Run `npx expo start` from the terminal (not inside any IDE), scan QR with the Expo Go app.
- **Git push** from the sandbox terminal is blocked (proxy restriction). Push must be done from the user's local Mac terminal.

No Android-specific blocking issues remain in the current codebase. Android path is preserved and unblocked.

### Hosting, backend, accounts *[DECIDED 2026-04-18]*

**Backend: Supabase.** Single backend-as-a-service providing Postgres database, serverless functions, storage, and auth-when-needed behind one dashboard. Generous free tier; scales cleanly if the game hits.

**What Supabase handles for this project:**
- Ghost pool storage for Echo multiplayer (question IDs, timings, answers per recorded run)
- Challenge-a-Friend shared question snapshots
- Global leaderboards
- Daily Quiz daily sets and scores
- "While you were away" inbox data

**Why Supabase over alternatives:**
- Real Postgres (not a weird NoSQL thing) — simpler for a one-person project
- One dashboard means one thing to learn
- Beginner-friendly docs and good community
- Not locked to a megacorp that might kill it on a whim
- Claude Code-friendly

Set up in the first multiplayer build session. Total backend cost for v1 scale: ~$0-20/month. Revisit pricing tier at 10k+ DAU.

### Development environment *[DECIDED 2026-04-18]*

**Environment state as of 2026-04-18:**
- Primary machine: Mac, Apple Silicon (M-series)
- Terminal / command-line experience: none
- Installed dev tools: none
- Accounts: no Apple Developer account, no GitHub account, no Node.js, no Xcode

**Implications:**
- Apple Silicon Mac is the best possible hardware for this project. No issues, no workarounds.
- Clean-slate install means we set things up in the right order the first time.
- Apple Developer account ($99/year) is deferred until ~Phase 5-6; no reason to pay for idle months.
- GitHub account will be set up during the first build session.

**Working-together mode: Option B (learn-as-we-go).**
The creative director gets a ~15-minute terminal fundamentals walkthrough at the start of the first real setup session (covering the ~5 commands that handle 90% of what we do), then from there we work in chunks rather than one-command-at-a-time. This front-loads a small amount of learning to make later sessions move faster. Not a commitment to working unsupervised — we still move through commands together.

**First real setup session will be dedicated (~60 min) and scheduled when:**
1. All four critical-path open questions are resolved (Monetization, Framework, Launch date/bandwidth + this one, now done)
2. Uninterrupted block of time is available
3. Ready to move into Phase 2 (visual direction + crude prototype)

**What that setup session will cover** (for future reference):
- 15-minute terminal fundamentals walkthrough
- Install Homebrew (Mac package manager — makes everything else easy)
- Install Node.js via Homebrew
- Install Git, set up GitHub account, connect it to the machine
- Install Xcode from the App Store (large download; plan for this to take time in the background)
- Install the React Native / Expo tooling (assuming we lock that framework choice)
- Create the project folder structure and the GitHub repo
- Run "hello world" to confirm everything works

After that session, we're set up for all future build work and never repeat this process.

---

## Part 8 — Content Strategy *[MIX]*

This is the other big area along with Multiplayer that defines v1's character.

### Goals *[DECIDED]*

- Launch with at least 2500 questions (2.5x the original)
- Maintain 100% adherence to voice and character-count discipline
- Full category rebalance
- Zero dated references

### Process *[PROPOSED]*

**Phase A — Audit the 1001.**
Go through every question. Categorize each as:
- **Keep** — still works as-is
- **Light edit** — needs a year update, an updated distractor, a tighter phrasing
- **Heavy edit** — the concept works but the execution is dated
- **Retire** — can't be saved, let it go

My rough estimate from my sampling: 700 Keep, 150 Light, 100 Heavy, 50 Retire. You might disagree with my read — this audit is where that gets resolved.

**Phase B — Fill to 2500.**
Write ~1500 new questions across the rebalanced categories. Use the 1001 as style reference for every new question. Every new question is you or me drafting, you editing, AI assisting — in that order, never reversed.

**Phase C — Curation & queuing.**
Not every question is "Arcade appropriate" or "Classic appropriate." Some are wordier, some are easier, some are niche. We tag and queue accordingly.

**[DECIDED 2026-04-18] — How question writing is split.**

AI is the main driver. Creative director reviews every question before it's final. Workflow:

1. AI drafts questions in batches, using the 1001.xml as explicit style reference and the Part 1 "humor technique catalog" as voice reference
2. Creative director reviews each draft, gives directional feedback ("tighten this one," "this distractor isn't funny enough," "swap for something more durable")
3. AI revises based on feedback
4. Creative director approves

Nothing enters the active question bank without explicit approval. The creative director is editorial director, not drafter. This model is expected to process questions at roughly 30-60 seconds of approval time per question — across 1500 new questions, that's 12-25 hours of focused editing spread across Phase 5.

**If AI drafts come out flat or voice-drifted**, workflow inverts: creative director drafts, AI polishes. To be monitored in the first few batches of Phase 5.

**[DECIDED via Part 3 rebalance] — Pop culture cutoff strategy:**
Pop culture is explicitly reduced in the v2 bank (from whatever it was in the 1001 down to ~100 questions in the 2500 target — a much smaller slice). The questions that stay are anchored to icons with 20+ year staying power (Beatles yes, current stars no).

**[DEFERRED] — Seasonal pack cadence.** For v1 launch, Pro-specific seasonal packs aren't a launch feature. Base question bank continues to grow over time with free updates. Seasonal packs become a v1.1+ discussion once the content factory and player base exist.

---

## Part 9 — Go-to-Market *[DEFERRED, with hooks]*

Detailed marketing plan waits for Part 6 (visuals) and Part 7 (build) to firm up. But to record the hooks now so we don't forget:

- The launch narrative is **"the cult 2012 trivia game, back."** Lean into nostalgia as a real asset.
- Warm-list: the Malaysian gaming outlet (GameviewTonton / gameview.me) and 148Apps both covered us last time — warm reach-out during press phase.
- The YouTube reupload of the launch video (at 2Fqr5BaHlEY) is real nostalgia marketing material — maybe we reach out to whoever uploaded it and license a "then and now" moment.
- "Made by a one-person team (plus AI)" is a 2026 story people want to tell. Consider being open about the build process as its own content stream.
- The original Top 10 US / Top 30 in 10+ countries fact is defensible brand heritage. Use it.

**[DEFERRED]** — Full launch plan, press kit, ASO strategy, screenshots, trailer. Build these in Phase 6.

---

## Part 10 — Phasing & Milestones *[DECIDED 2026-04-18]*

### Operating assumptions

- **Weekly bandwidth:** 6-8 hours target, averaged over the project
- **Availability pattern:** bursty (big pushes, quiet weeks) — estimate includes ~15-20% efficiency tax from context-switching
- **Start date:** April 2026
- **Target launch window:** first half of August 2026
- **Total calendar time:** ~14-20 weeks (roughly 3.5-5 months)

### Phase 0 — Foundation *(where we are at doc v1.0)*
- ✅ Recovered original DNA (video, marketing copy, 1001.xml, review text)
- ✅ Mothership doc brought to v1.0 with all critical-path questions resolved
- ⏳ Set up project folder structure: GitHub repo, Cowork project folder, folders for design/questions/code
- ⏳ Dev environment setup session (60-min dedicated block, covers terminal fundamentals + full install)
**Exit criteria:** Working dev environment, first "hello world" build running on phone. GitHub repo live.

### Phase 1 — Question audit & style guide *(roughly weeks 2-4)*
- Audit all 1001 questions from the XML: Keep / Light edit / Heavy edit / Retire
- Write a formal style guide for new questions based on the audit (voice rules, character limits, humor technique catalog, pop-culture policy)
- Decide on pop-culture cutoff strategy
- Resolve remaining "Important but flexible" open questions (Appendix D items 6-14) as they become relevant
**Exit criteria:** All 1001 questions tagged. Style guide v1 done. 100 kickers written. Voice feels locked.

### Phase 2 — Visual direction & crude prototype *(roughly weeks 3-7, overlaps with Phase 1)*
- ✅ Produce visual direction: palette locked (Cream Stadium), typography locked (Archivo Black + JetBrains Mono), motion language established
- ✅ Crude playable prototype — both modes, full question bank, running in browser (localhost:8081)
- ✅ Custom motion language established: animated wordmark (water-balloon bloat), brain mascot with expressions, rotating sunburst, halftone grid
- ✅ No default library animations — all motion is custom-designed
- ⏳ Reach out to designer for brand mascot evolution / UI direction polish (not yet started)
**Exit criteria:** ✅ Visual direction approved. ✅ Crude prototype runs and is playable. (Designer outreach pending — not blocking Phase 3 start.)

### Phase 3 — Core game build *(roughly weeks 5-10)*
- Arcade mode: full implementation with power-ups and streak mechanics
- Classic mode: full implementation with 3-strikes logic
- Avatar system (basic — expandable later)
- Onboarding: spec decided (see Part 3) — wordmark splash → first-time home screen → Sign in with Apple/Google → ghost-free first round with two contextual nudges
- Local storage for progress, rank, avatar
- Sound design pass (SFX library, music, stings)
- Motion pass across all existing screens
- Full UI art pass
**Exit criteria:** Single-player game is complete. You play it for an hour without wanting to stop.

### Phase 4 — Multiplayer *(roughly weeks 9-13)*
- Echo mode: ghost pool infrastructure, matchmaking beat, round playback
- Challenge-a-Friend: link generation, same-question replay flow
- Global leaderboards + daily question
- Post-game interview emote system (emote library design + integration)
- "While you were away" inbox screen
- Rare easter-egg reactions (starting with the wince)
- **Supabase content migration:** Wire `app/content.ts` → Supabase. Run `supabase/schema.sql`, seed emotes + ranks, replace `pickInterviewEmotes()` and `getRankLabel()` with Supabase API calls. Delete hardcoded `getRank()` from `questions.ts`. This decouples all editable content from deploys — emotes and ranks become live-editable from the Supabase dashboard.
**Exit criteria:** You can press Multiplayer and play a ghost round end-to-end. You can send a challenge link to a friend and it works. Global leaderboards populate.

### Phase 5 — Content fill *(roughly weeks 6-15, runs parallel with Phases 3-4)*
- Write remaining ~1500 new questions to hit 2500+ total
- Kickers written for every active question
- Full QA pass on content (accuracy, voice, length limits, distractor quality)
- Start the "One More" button copy library — target 100+ lines
**Exit criteria:** 2500+ approved questions in the game. Kickers complete. One More copy library v1 done.

### Phase 6 — Beta & launch prep *(roughly weeks 14-18)*
- Private beta with 10-20 friends (TestFlight)
- Iterate on feedback — bug fixes, balance adjustments, copy tweaks
- Apple Developer account set up (if not already — cue $99/year cost)
- App Store assets: screenshots, preview video, store copy, keywords, icon at all required sizes
- Press kit rebuild (updated version of the 2012 kit, factoring in the "cult 2012 game returns" narrative)
- Submit to Apple review
**Exit criteria:** Submitted to Apple. Press kit done. Launch campaign drafted.

### Phase 7 — Launch *(roughly weeks 18-20)*
- Public release
- Warm-list press outreach (148Apps, Gameview/Malaysia, plus new contacts)
- Social / content push leveraging "12 years later" nostalgia angle
- Monitor crashes, reviews, store ranking
- Critical bug triage only — no new features
**Exit criteria:** Game is live. You've drunk something celebratory.

### Timeline risk factors

1. **Bursty pattern stretches.** If quiet weeks run longer than 2-3 consecutive, every extra quiet week adds ~1.5 weeks to the launch date (tax of re-orienting).
2. **Scope creep via "what if we also..."** See risk register. Every new feature is weeks, not days.
3. **Content fill (Phase 5).** Writing 1500 new questions in voice is the most human-bottlenecked piece. If it stalls, it stalls everything.
4. **Apple review.** Usually 1-3 days for a simple game, sometimes 2 weeks if rejected. Unpredictable.
5. **"One More" copy library eating time.** This is the highest-leverage brand work but it's also the most easy to over-polish. Keep a hard budget.

---

## Part 11 — Risk Register *[LIVING DOCUMENT]*

Known risks to shipping, in rough order of severity. Review and update every phase.

1. **Scope creep** — every creative project dies of this. Mitigation: this doc. When something feels like a new feature, it comes through here first.
2. **Voice drift in new questions** — AI-assisted writing can flatten out. Mitigation: strong style guide, you as final editor, periodic "diff" reviews against the 1001.xml.
3. **Technical block on Claude Code** — we hit a wall that I can't code around. Mitigation: budget set aside to hire a human dev for specific blocks, not the whole project.
4. **Apple rejection at submission** — usually minor, sometimes catastrophic. Mitigation: follow Apple's guidelines from the start, not at the end.
5. **Launch-into-silence** — we ship, nobody notices. Mitigation: warm-list press outreach, "the cult 2012 game is back" narrative hook.
6. **The "better to rebuild than refresh" reframe fails** — we look at what we've built and it doesn't feel like Super Smart anymore. Mitigation: playtests against the 1001.xml content and the launch video's energy at every phase.
7. **Founder burnout** — this is a long project. Mitigation: sustainable pacing, don't skip rest, don't commit to dates you can't hit.

---

## Part 12 — Decision Log

Every big decision gets recorded here with date and rationale. This is how future-you remembers why we chose what we chose.

| Date | Decision | Why |
|------|----------|-----|
| 2026-04-18 | Use Cowork as project HQ, regular Claude as thinking partner, Claude Code as builder | Original conversation — Claude recommended against Cowork-as-everything |
| 2026-04-18 | Keep the name "Super Smart" | Brand heritage worth more than SEO noise |
| 2026-04-18 | Short-form trivia stays as core — reframed for 2026 | Discussion re: 2012 thesis vs 2026 context |
| 2026-04-18 | Keep the 1001-question bank as style corpus | Recovered intact; too valuable to not use |
| 2026-04-18 | Multiplayer is in for v1; specific shape TBD | Recovered critique + modern expectation |
| 2026-04-18 | Multiplayer shape: Echo (ghost quickmatch) + Challenge-a-Friend + Global leaderboards; skip pass-and-play, skip live 1v1, skip async turn-based | Design inspired by Dark Souls / Death Stranding lineage — async-that-feels-live solves the "multiplayer without a player base" problem structurally. Post-game interview emotes provide social texture without toxicity. Rare easter-egg reactions handle opponent presence with "rarity as charm" principle. |
| 2026-04-18 | Dev environment: clean-slate Apple Silicon Mac; terminal walkthrough Option B (learn-as-we-go); first setup session to be dedicated 60-min block before Phase 2 | Clean install is faster than untangling existing state; Option B matches the stated working style (experienced, fast-thinking, wants enough context to not feel lost) |
| 2026-04-18 | Framework: React Native + Expo | Fastest zero-to-playable, best match for AI-assisted dev, preserves Android path, best primitive animation libraries for the custom motion principle |
| 2026-04-18 | Custom motion language as a project principle: no default library animations | Stated concern about template-feely app aesthetics; recorded as principle rather than preference so it survives into Phase 2 planning |
| 2026-04-18 | Monetization: free-with-Pro at ~$4.99 one-time, no ads ever, daily free round budget with "One More" button as brand-native paywall replacement | Positioning is business-leaning-passion-project: wants the possibility to make money, wants to prove the business model, but won't use obnoxious mechanics. "One More" button turns paywall moment into content in the Super Smart voice — monetization as brand asset rather than interruption. |
| 2026-04-18 | Launch target: first half of August 2026, assuming 6-8 hours/week bursty bandwidth | Calibrated against 14-20 week realistic calendar time. Bursty pattern tax (~15-20%) baked into timeline. |
| 2026-04-18 (session 2) | Kicker lines killed for now | Concept isn't wrong but requires full content pass before it's real. Classic mode is clean without it. Deferred to Phase 5 at earliest when question infrastructure exists. |
| 2026-04-18 (v1.1 revision) | Speed framing sharpened: "read-decide-answer in 2-3 seconds" is the target; 10-second timer is a ceiling, not a target | Original thesis was never "under 10 seconds" — it was "as fast as possible." Speed is a value, not a constraint. |
| 2026-04-18 (v1.1 revision) | Humor can live anywhere in a question — in the prompt, in the answer set, in the pairing, in the distractors | Distractors-only framing was too narrow. 1001.xml shows jokes live in the question body too ("resistance against the machines is ___" → futile). |
| 2026-04-18 (v1.1 revision) | Category rebalance for v2: finer buckets, math capped at ~200, History added as own category, Pop culture reduced, classical/durable knowledge emphasized | Creative director can't keep up with current pop culture and prefers the game to teach something durable. Misc reduced to ~150 and only holds genuinely uncategorizable questions. |
| 2026-04-18 (v1.1 revision) | Rank ladder: 22 tiers from "Really? (0)" to "Super Smart! (7001-9000)" preserved from 2012 original files | Rank names carry the brand voice. Not a candidate for refactoring. |
| 2026-04-18 (v1.1 revision) | All personal names removed from the doc; doc is role-based | Portability; collaborators shouldn't be named until commitments exist. |
| 2026-04-18 (v1.2 revision) | No "skip question" power-up in Arcade; no "Centuple" name — top-tier 10-streak reward stays as mechanic, name TBD | Skip softens the game; Centuple name wasn't loved, can be reworked later |
| 2026-04-24 | Top-tier 10-streak reward named: **Unstoppable** | Visceral, universal, no explanation needed. Biggest word for the biggest moment in the game. |
| 2026-04-18 (v1.2 revision) | Kicker character limit: 80 characters | Readable in ~1 second |
| 2026-04-18 (v1.2 revision) | Avatar progression: generous base kit at start + some items unlocked through play | Balances day-one feel with long-tail replayability |
| 2026-04-24 | Avatar system fully specced: 3 components (brain color, eyes, mouth); antenna fixed. Free = 4 options each; earned through play = milestone unlocks (Phase 3); Pro = 4 additional each. League rank shown as colored border stroke on avatar (8 colors, grey→gold, Legend gets animated shimmer). Border = last week's confirmed rank. | Avatar is a multiplayer identity signal — appears on ghost preview, result screen, playing screen, leaderboards. Border integrates league rank without a separate badge element. Visual details finalized in Phase 3. |
| 2026-04-18 (v1.2 revision) | Daily Quiz mode added: third mode, 10 questions, Classic pacing, Wordle-style shareable result | Major viral hook + retention layer. Dedicated mode beats a single-daily-question-inside-another-mode. |
| 2026-04-18 (v1.2 revision) | Designer approach: creative director + AI primary, new designer for brand/UI direction; original 2012 designer not reconnected | Most asset work is reachable with AI in 2026; designer reserved for pieces where professional taste matters most |
| 2026-04-18 (v1.2 revision) | Backend: Supabase | Postgres + one-dashboard simplicity; indie-friendly; Claude Code-friendly |
| 2026-04-18 (v1.2 revision) | Question writing workflow: AI drafts, creative director approves every question; reversed if AI drafts drift | Scales creative director's time while preserving voice control |
| 2026-04-18 | Skip recovery of source code / .ipa / original dev account | Cost/benefit — we have enough to rebuild |
| 2026-04-18 (session 3) | Home screen reduced to 2 modes: Quickmatch + Daily Race. Arcade and Classic retired as standalone modes. | Two modes = one clear primary CTA per intent (competitive any-time vs shared daily ritual). Reduces decision friction on launch. Arcade's 60s format and streak mechanics absorbed into both surviving modes. Classic's 3-strikes mechanic retired with no replacement. |
| 2026-04-18 (session 3) | Quickmatch = Echo/ghost mode. "Multiplayer" label retired; "Quickmatch" is the home screen name. | Echo was always the shape; Quickmatch is the brand name that communicates the feel (instant, competitive, head-to-head) without requiring the player to understand the ghost architecture. |
| 2026-04-18 (session 3) | Daily Quiz renamed Daily Race. | Race framing matches the streak + speed mechanics. "Quiz" implied a slower, knowledge-test feel inconsistent with the 60-second timer. |
| 2026-04-18 (session 3) | Shared game mechanics for both modes: 60s round, 100pts base, +50 speed bonus (sub-2s, flat, before multiplier), streak ladder (3/5/7 → 2x/3x/4x), wrong answer resets streak. | Unified mechanic vocabulary means players transfer skill directly between modes. Speed bonus requires clear 2-second window signalling in the UI. |
| 2026-04-18 (session 3) | Equal ground principle: both modes use the same question set for all players within their competitive context. | In Quickmatch, ghost and live player answer identical questions in identical order. In Daily Race, everyone globally that day answers the same questions. You lose because you were slower or less accurate — never because your questions were harder. This principle is core to competitive fairness and player psychology. |
| 2026-04-18 (session 3) | Daily Race: 60 seconds, fixed daily question set, once per day, shareable score-based result, own daily leaderboard. | 60s matches Quickmatch — the differentiator is context (shared daily set vs ghost race), not duration. Once-per-day constraint plus shared questions is what gives the mode identity. Variance in scores comes from throughput × speed × streaks, not a fixed 10-question ceiling (which would create score ceilings for skilled players). |
| 2026-04-18 (session 3) | Two leaderboards: Overall (cumulative Quickmatch + Daily Race, all-time + today) and Daily Race only (today's scores for today's set, resets daily). | Different competitive motivations. Overall rewards power users who play frequently across both modes. Daily rewards anyone who played today's shared quiz. No cross-contamination between the two. |
| 2026-04-18 (session 3) | Kicker line officially retired. | Classic mode (its only home) is retired. No remaining slot for kicker content in the 2-mode structure. Not a candidate for revival. |
| 2026-04-18 (session 3) | Ghost pool architecture decided: infinite question sets (60 questions each), 1000-set pre-generated buffer, 30-day / 1000-play lifecycle, baton-pass ghost selection (most recent, not original creator), "you're first" fresh-set messaging instead of bots, atomic lock on fresh set assignment. | Infinite sets solve the "finite rotating pool" complexity. Baton pass creates living chain narrative. Honest fresh-set messaging is better UX than a disclosed bot and sets up the ghost economy naturally. |
| 2026-04-18 (session 3) | 1-second UI lock on answers. | Ensures 60 questions / 60 seconds math holds (can't physically answer more than 60 questions). Also makes the 2-second speed bonus window meaningful — rewarding instant knowledge, not just fast reflexes. |
| 2026-04-18 (session 3) | Home screen Scoreboard bar removed. GlobalLeaderboard widget replaces it. | The "Best · Rank" strip was redundant once the leaderboard widget shows the player's rank in global context. One widget serves both functions (personal best + global position) with richer information. |
| 2026-04-18 (session 3) | Skill tier system: 5 internal tiers, rolling 10-game average (both modes combined), percentile-based brackets recalculated weekly with 30/70 inertia formula, new players forced to Tier 1 for first 5 games, matching expands silently across tiers until a ghost is found, initial thresholds set by creative director pre-launch. | Percentile brackets adapt to the real player population over time without manual adjustment. 30% weighting balances responsiveness with stability. New players in Tier 1 feel good early — retention priority over accuracy. Silent tier expansion means players never wait beyond the 1–2s anticipation beat. |
| 2026-04-19 | Miss penalty mechanic locked: −50 pts for every 3 consecutive wrong answers; miss streak counter resets after penalty fires. | Keeps the floor meaningful without punishing isolated mistakes. Adds a cost to careless guessing without making the game feel like punishment for honest wrong answers. |
| 2026-04-19 | Daily Race format corrected: 60 questions / 60 seconds, identical mechanics to Quickmatch. Previous spec (10 questions, Classic pacing) is superseded. 🟩🟥 shareable grid preserved. | "No Classic mode" + "shared mechanics" decisions made a 10-question Classic-paced Daily Race inconsistent. 60s/60q is the natural outcome of both principles. Variance in scores still emerges from throughput × speed × streaks. |
| 2026-04-19 | Visual identity locked in code: Cream Stadium palette (`#FFF4DF`/`#1A1522`/`#E8253C`/`#FFD23F`), Archivo Black + JetBrains Mono, mode colors (Quickmatch `#FF3D7F` / Daily Race `#7BEFFC`), rotating sunburst + halftone dot grid as background layers. | Phase 2 visual direction milestone. Palette and type are first-class design decisions that now have a working reference implementation. |
| 2026-04-19 | Route architecture: Quickmatch routes to `/echo` (echo.tsx handles full game inline — matching → preview → playing → result). `/game.tsx` exists as standalone arcade mode but is not linked from the home screen. Both files implement the same scoring mechanics. | Important for any collaborator touching scoring or routing — there are two parallel implementations. If the scoring spec changes, both files need updating. |
| 2026-04-19 | "One More" cap implemented at 3 taps: each tap grants +3 bonus plays (free tier is 7/day; 3 taps = up to 16 plays before Pro Wall). After 3 taps, Pro Wall appears instead of the One More button. | Matches the spirit of the escalating-copy concept. 3 taps is a generous but finite grace period before the hard ask. Pro Wall copy is in the One More voice. |
| 2026-04-19 | Doc update policy added: a brief plain-English summary (≤5 bullets) must be provided whenever this document is updated. | Creative director shouldn't need to re-read sections to know what changed. Summaries are verbal/in chat, not written into the doc. |
| 2026-04-19 (session 4) | Post-game interview emote system implemented: 75 emotes across 5 categories (15 each). Shown on result screen — one randomly drawn per category per game. | Replaces earlier 50-emote (10×5) spec. 15 per category gives enough variance to avoid repetition across a typical play session. Each category has a distinct voice and target: BAD = player venting after a loss; OK = mediocrity wordplay; GOOD = player's ghost flexing after a win; MOCKING = player's ghost trash-talking the next opponent; SUPPORTIVE = player's ghost cheering the next opponent. MOCKING and SUPPORTIVE are directed at the *next person* who races that ghost — the emotes live as ghost messages, not post-game summaries. |
| 2026-04-19 (session 4) | Content architecture: all editable game content extracted to `app/content.ts`. | Separates content from logic so emotes and ranks can be edited without touching game code. Matches the shape of the Supabase schema for a clean Phase 4 migration. |
| 2026-04-19 (session 4) | `supabase/schema.sql` created: ready-to-run Phase 4 migration for emotes, ranks, and questions tables. Full seed data included. | When Supabase is wired up, run the schema, replace `pickInterviewEmotes()` and `getRankLabel()` with API calls, and delete the hardcoded `getRank()` from `questions.ts`. Content becomes live-editable from the Supabase dashboard without a redeploy. |
| 2026-04-19 (session 4) | Emote style guide locked: all emotes carry terminal punctuation (period before emoji); cross-category emoji conflicts resolved (same emoji may repeat within a category since only one shows per game, but no emoji appears in two different categories simultaneously). | Punctuation = consistent register. Emoji deduplication = result screen never shows the same glyph twice. |
| 2026-04-19 (session 5) | Ghost preview screen now uses real emote library. Hardcoded `GHOST_EMOTES` placeholder array removed from echo.tsx; replaced with `pickGhostEmote()` drawing from the mocking/supportive pool in content.ts. | Closes the gap between the emote system we built and the preview screen that was still showing dev placeholders. |
| 2026-04-19 (session 5) | Result screen emote selection UX implemented: tap to select/highlight, tap again to deselect. Selected emote stored locally; Phase 4 wires it to Supabase. If player exits without selecting, a random emote from the full pool is assigned silently — ghost always has an emote. | No confirm step. One tap = chosen. Cleaner than a confirm flow; random fallback means no empty-emote edge case to design around. |
| 2026-04-19 (session 5) | Playing screen feedback system designed: 3-layer architecture. Layer 1 (always): SFX + visual cues. Layer 2 (1-in-5 random): brain mascot visual reactions. Layer 3 (every powerup): narrator callout. Full spec in Part 3. | The playing screen should feel alive — it mirrors performance state back at the player. Three layers at different frequencies prevents any single element from becoming noise. |
| 2026-04-19 (session 5) | Adaptive music cut from v1. | Too complex to execute well at this stage. Static track at peak energy + SFX layer carries all emotional variation. Revisit for v2 once the game's feel is locked. |
| 2026-04-19 (session 5) | Narrator callout voice: separate character from the brain avatar. Brain = player's avatar, reacts visually only. Narrator = voice of the game itself, short callouts on powerup triggers. | Brain speaking would confuse the avatar/player relationship. Narrator is a distinct personality — warm, brief, slightly amused. |
| 2026-04-19 (session 5) | Callout copy direction: not literal ("let's go!" not "double points"). Common positives for any trigger + event-specific for notable moments (speed, 4×). One callout per trigger event — no stacking. | Literal power-up callouts feel mechanical. Confidence boosts match the brand voice and feel more human. One-callout-per-trigger prevents audio pile-up when multiple events fire simultaneously. |
| 2026-04-19 (session 5) | Audio production approach: TTS (ElevenLabs or equivalent) for build/test phase; real voice actor as potential pre-launch upgrade. | TTS allows copy iteration without re-recording sessions. Treat as placeholder with character — swappable when the game is closer to done. |
| 2026-04-19 (session 5) | Ghost matching rule clarified: skill tier filters first, recency within tier is the tiebreaker. If no match at the player's tier, silently expand to the nearest adjacent tier until a match is found. | Resolves the ambiguity between "most recent ghost" and "skill-matched ghost." Tier always takes precedence; recency is the secondary sort within tier. |
| 2026-04-19 (session 5) | "Fresh game" messaging replaces "you're first": player is told this is a fresh game and their run will be matched with an opponent. | Still honest, still on the right side of the honesty line, but frames the player as seeding the pool rather than being a guinea pig. |
| 2026-04-19 (session 5) | Question set retirement threshold raised from 1,000 to 10,000 plays. Core constraint is no player sees the same question set twice in Quickmatch (challenge links excepted). Retirement threshold exists to enforce that guarantee — the exact number is less important than the principle. | 1,000 was too aggressive; popular sets with lots of ghost diversity are valuable. 10,000 gives sets a full life while still enforcing the no-repeat guarantee. |
| 2026-04-19 (session 5) | Challenge-a-Friend ghost is always the original sender's ghost, permanently. Static — not baton-passed. Everyone who plays a challenge link races the sender specifically, no matter how many people play it. | Challenge links are about "race me specifically" — the baton pass would break that intent. Static ghost preserves the personal challenge framing. |
| 2026-04-19 (session 5) | Inbox tab added as permanent home for activity feed. Not a popup — accessible any time. Shows ghost races + challenge completions since last login or last 24 hours (whichever longer). Push notifications on new activity if permitted. Challenge results (GeoGuessr model) feed into the same inbox. | Popup on app open was too interruptive. Permanent tab gives the player agency — check it when they want it. Unified feed keeps architecture simple. |
| 2026-04-19 (session 5) | Game log added to Profile tab. Every session: date, mode, score, rank, streak peak. Free tier = last 10 games; Pro = full history. This is the "Advanced stats and personal records" Pro feature. | Meaningful Pro differentiator without gating anything essential. Occasional destination (personal reflection) vs. the Inbox which is a frequent destination (social pull). |
| 2026-04-19 (session 5) | Navigation architecture locked: 3 tabs — Home / Inbox / Profile. Leaderboard: compact "you are here" widget on home + full leaderboard in Inbox. | Three tabs keeps the nav invisible inside the play loop. Four tabs implies a complexity that works against the brand. Leaderboard on home motivates play; full board in Inbox serves the power-user use case. |
| 2026-04-19 (session 6) | League of 30 added to social layer: weekly clusters up to 30 real players, promotes/demotes weekly. Skill-sorted vs random matchmaking within cluster open for Phase 4. | Retention mechanic that rewards consistent play across both modes. Works at any player count via transition window seeding and forming queue. |
| 2026-04-19 (session 7) | League formation fully specced: 2-hour transition window seeds each new league with real recently-active players; split rules (under 5 → queue, 5–29 → one league, 30–44 → split two, 45+ → divide further); forming queue opens at 5 players with earned scores already in it; Tuesday end-of-day fallback prevents indefinite limbo; no ghost-fill — every league entry is a real player who played that week. "Your points are counting" message shown in both transition window and forming queue states. | Ghost-fill rejected in favour of retroactive real-player seeding — cleaner, honest, no fake scaffolding to remove later. Minimum of 5 (not 10) keeps wait time short while still feeling like real competition. |
| 2026-04-19 (session 7) | League cluster matchmaking locked: weighted random biased toward same tier ±1. Not pure random (too lopsided at small counts), not strict skill-sorting (too predictable). Probabilistic — variance and upsets still happen. Tier visibility: hidden from other league members; board shows names and scores only. | Pure random was agreed first but the hybrid is meaningfully better for competitive quality without adding hard matchmaking complexity. Tier privacy removes all scrutiny of cluster composition and keeps the social dynamic clean. At small player counts the weighting is effectively moot anyway — becomes more impactful as the player base grows. |
| 2026-04-24 | League tier names locked: 8 tiers (Newcomer → Regular → Contender → Veteran → Qualifier → Finalist → Champion → Legend). Competition-circuit register, deliberately separate from the 22-name rank ladder. Top 5 promote, bottom 5 demote weekly. | Rank ladder names are frozen brand assets — league tiers needed a separate vocabulary. Competition-circuit language is globally understood. Promotion/demotion proportion (~17% each way) mirrors Duolingo's 20% and feels fair. |
| 2026-04-24 | Onboarding spec locked: wordmark splash → first-time home screen (League/Profile tabs greyed) → Sign in with Apple/Google on first game tap (name pulled from platform, no manual entry) → ghost-free first round with two contextual nudges (speed bonus, streak). Anonymous session fallback for players who decline sign-in. Display name changeable in Profile with 30-day cooldown. | No tutorial screens — onboarding is playing the game. Two nudges teach the two non-obvious mechanics (speed bonus, streak multiplier) in context. Platform sign-in removes all friction from identity setup. |
| 2026-04-24 | End-of-league UX: hybrid approach. Push notification + first-open interstitial (once only), then result card in League tab. Three-tier interstitial: Promoted (celebratory, new tier reveal), Held (dry, honest, motivating), Demoted (quiet, not punishing). All three show final position, score, next tier. | One-time interstitial earns the dramatic moment without ambushing repeat opens. Three tiers of response match the emotional stakes of each outcome. Specific copy deferred to Phase 3/4. |
| 2026-04-19 (session 7) | Second tab renamed from "Inbox" to "League". | Inbox is email-app language. League is what the tab actually is — competition, standings, activity. Fits the brand and tells the player exactly what they're walking into. |
| 2026-04-19 (session 7) | "Ghost" removed from all customer-facing copy. Activity feed section renamed from "Your Ghost Activity" to "Recent Activity". | Ghost is internal/backend vocabulary. Players don't need to know the architecture — they just see opponents and results. Cleaner, less confusing for new players. |
| 2026-04-19 (session 7) | League tab section order locked: (1) Recent Activity + League standings, (2) Daily Race board, (3) Global Ranking (Pro/blurred), (4) Past Matches. | Most time-sensitive and personal content first. League and recent activity are what players check most. Global ranking is aspirational/occasional. Past matches is archival. |
| 2026-04-19 (session 7) | Sunburst + Halftone background promoted to global — moved from home screen only to root `_layout.tsx`. Present on every screen in the app. Individual screen backgrounds set to transparent. | Consistent visual identity across the whole app. The background is a brand element, not a home-screen feature. Architecturally cleaner — one instance renders once rather than being duplicated per screen. |
| 2026-04-19 (session 6) | Streak Shield consumable IAP fully specced: one item type, proactive auto-activate + retroactive 48hr repair, max 3 held, buy in 1/2/3 packs, blocked at cap. Free users: 1 at launch. Pro users: 1 auto-granted weekly (Monday), up to cap. | Modelled on Duolingo streak freeze (the established consumer pattern). One item type avoids inventory confusion. 48hr retroactive window is humane but not abusable. Pro weekly top-up makes shields a passive Pro perk rather than a managed resource. |
| 2026-04-19 (session 6) | Seasonal pass: door open for future, not a current design priority, nothing in v1 depends on it. | Creative director wants the option without committing to the work. Correct call — seasonal pass requires a content factory that doesn't exist yet. |
| 2026-04-19 (session 6) | "Build for the Flex" design principle added: every design decision should serve the screenshot moment. Make the shareable surfaces (end screen, rank reveal, Daily Race grid) unmistakably Super Smart and visually spectacular. | Not a visual checklist — a decision-making lens. Any design choice that makes the game less shareable or less legible in a screenshot needs a strong reason to exist. |
| 2026-04-19 (session 6) | Sunburst colour corrected: `#FFD6A8` at opacity 0.45. Previous spec (`Colors.yellow` / `#FFD23F` at 0.18) was near-invisible on the cream background in real-device Expo Go testing. | Caught in real-device test. The two yellows (`#FFD23F` saturated for UI, `#FFD6A8` warm peach for background sunburst) serve different purposes and must stay distinct. |
| 2026-04-19 (session 6) | ArcadeCard tilt removed: both Quickmatch and Daily Race cards now `tilt={0}`. Previous `tilt={1.2}` and `tilt={0.8}` both tilted the same direction, which read as a mistake on real device rather than intentional style. | Real-device test was the signal. Static tilt is still available as a prop if needed elsewhere; just not the right move for the home screen mode cards. |
| 2026-04-19 (session 6) | ArcadeCard bob float animation implemented and shadow animation fixed. Shadow is now an Animated.View tracking the same float position as the face, so the 3D depth illusion holds during animation. Float and press animations blend via `press.value` scaling. | Float + press coexistence was the key challenge — blending them by scaling float contribution as press bottoms out prevents fighting. Shadow tracking was a visual quality discovery from real-device testing. |
| 2026-04-19 (session 6) | TokenTabBar component implemented: custom chunky arcade-door tab bar replacing expo-router's default. Yellow border = active, spring press animation, 4pt depth shadow, haptic feedback on iOS. SF Symbols/MaterialIcons dual-platform. | Custom tab bar is a Phase 2 visual direction deliverable. The `tabBar` prop on `<Tabs>` preserves all expo-router navigation logic while giving complete visual control. |
| 2026-04-19 (session 6) | Leaderboard structure locked: three boards at three radii. League of 30 (everyone, weekly) + Daily Race board (everyone, resets daily) + Global all-time (Pro only, updates twice daily). Free users are ranked on the global board from day one — Pro unlocks the view, not the participation. | Three tiers match three player motivations: peers this week / everyone today / everyone ever. "Pay to see not pay to participate" makes the Pro upgrade feel like a reward for play already done. Twice-daily update cadence gives the global board a morning/evening check-in rhythm without real-time noise. |

---

## Appendix A — Active Asset Inventory

Files in hand (as of April 18, 2026):

- `1001.xml` — complete original question bank (199KB, 1001 questions, 9 categories)
- `supersmart.mp4` — launch video (31s, 640×360)
- Frame extractions from launch video (~27 PNG frames)
- Archived marketing copy text (captured in chat)
- 148Apps review text (captured in chat)
- Recovered email threads (indexed and readable as needed)

---

## Appendix B — Roles

| Role | 2026 |
|------|------|
| Creative director | Same person as 2012 original |
| Developer | AI collaborator (Claude Code) as primary; human developer as possible advisor |
| Designer | TBD — see Part 6 open question |

---

## Appendix C — Glossary

- **Quickmatch** — the primary home-screen mode; ghost-based async competitive race (formerly "Echo" / "Multiplayer"). 60 seconds, same question set for you and your ghost opponent.
- **Daily Race** — the daily home-screen mode; 60 seconds, same question set for everyone globally that day, once per day, shareable result.
- **Echo** — the internal/technical name for the ghost-race architecture behind Quickmatch. Used in backend/engineering context; "Quickmatch" is the player-facing name.
- **Equal ground principle** — both modes use the same question set for all players in that competitive context. You win or lose on speed and accuracy, never on question difficulty.
- **Speed bonus** — +50 flat points for answering within 2 seconds, applied before the streak multiplier.
- **Streak multiplier** — 3/5/7 correct in a row → 2×/3×/4× on the next answer.
- **Overall leaderboard** — cumulative score across all Quickmatch + Daily Race sessions, all-time and today views. The power-user global rank number.
- **Daily leaderboard** — today's high score list for today's Daily Race question set only. Resets daily.
- **The 1001** — the recovered original question database; canonical style reference for all new content
- **Centuple** — the original studio name; historically significant but not revived as branding; may return as top-tier easter egg
- **Formondo** — the legal company behind the 2012 game; not being revived
- **Cowork** — Anthropic's desktop productivity tool; where this doc lives
- **Claude Code** — Anthropic's CLI coding tool; where the game gets built
- **Question set** — 60 unique questions drawn randomly from the question bank; the unit of play for Quickmatch. Infinite possible combinations. Lifecycle: active until 30 days without a play or 1000 plays reached.
- **Ghost run** — a recorded Quickmatch session (answer sequence + timings + score) stored against a question set. What future players race against.
- **Baton pass** — the ghost selection rule: each player races the most recently completed ghost on their set, then becomes the ghost for the next player.
- **Fresh set** — a question set with no ghost runs yet. The first player assigned it gets the "you're first" moment and their run seeds the ghost pool for that set.
- **Skill tier** — one of 5 internal (not player-visible) brackets used for ghost matching. Based on rolling 10-game average. Percentile-defined, recalculated weekly with inertia.
- ~~**Arcade mode**~~ — *retired.* 60-second format and streak mechanics absorbed into both current modes.
- ~~**Classic mode**~~ — *retired.* 3-strikes, 10-second ceiling. No replacement.
- ~~**The kicker**~~ — *retired.* Post-answer one-liner; had no home once Classic mode was retired.
- **echo.tsx** — the code file that implements Quickmatch (the `/echo` route). Contains the full game loop inline: matching animation → ghost preview → playing → result. This is what runs when the player taps Quickmatch on the home screen.
- **game.tsx** — a separate standalone arcade implementation. Currently not linked from the home screen. Same mechanics as echo.tsx. If the scoring spec changes, both files need updating.
- **Cream Stadium** — the name for the v2 colour palette: cream `#FFF4DF`, ink `#1A1522`, red `#E8253C`, yellow `#FFD23F`.
- **Streak Shield** — a consumable IAP item. Auto-activates if you have one and miss a day; retroactively repairs a broken streak within 48 hours if you buy one after missing. Max 3 held. Free users get 1 at launch; Pro users get 1 auto-granted every Monday up to the cap.
- **League of 30** — weekly competitive clusters of 30 players (real + ghost-filled). Promotes/demotes weekly based on cumulative score. Works at any player count because empty slots are ghost-filled with archived high-scoring runs.
- **Build for the Flex** — design principle: every decision should serve the screenshot moment. Make the shareable surfaces (end screen, rank reveal, Daily Race grid) visually spectacular and unmistakably Super Smart.
- **ArcadeCard** — the mode card component (`components/ArcadeCard.tsx`). Implements the chunky 3D press-down mechanic + idle bob float animation. Used for Quickmatch and Daily Race cards on the home screen.
- **TokenTabBar** — the custom tab bar component (`components/TokenTabBar.tsx`). Chunky arcade-door style, replaces expo-router's default. Active tab: yellow border. Press: spring sink animation.

---

## Appendix D — Open Questions Index

### Critical to resolve before Phase 1 starts

**All resolved.**

### Remaining open items (deferred to their phase)

1. ~~**Wrong-answer streak behavior:** Full reset vs. freeze~~ — **resolved in session 3: wrong answer resets streak to zero immediately.**
2. ~~**Daily Quiz strikes vs play-all-10**~~ — **moot: Classic-mode 3-strikes mechanic retired. Daily Race plays through the full 60 seconds regardless of wrong answers.**
3. **Daily Race reset clock + league reset clock:** Local time vs UTC — Phase 4 (both clocks should be decided together since the league transition window is tied to the reset)
4. **Skill tier initial thresholds:** Creative director to provide the 5 bracket score values before launch, based on beta playtest data. These become the seed for the inertia formula going forward. Remind at Phase 4/5. *[flagged in Part 4]*
5. ✅ **League matchmaking within cluster:** weighted random ±1 tier, tiers hidden from other members — decided 2026-04-19 session 7.
6. **"What happens after league" — post-league UX, promotion/demotion rewards and consequences:** deferred by creative director, to be discussed. *[flagged for next session]*
7. **Streak Shield bundle pricing:** Phase 5
4. **Specific avatar unlock conditions (Part 3):** Design in Phase 3
5. ✅ **Onboarding spec (Part 3):** Decided 2026-04-24. Full spec in Part 3.
6. **Sound design direction (Part 3):** Phase 3
7. **App Store subtitle (Part 9):** Phase 6
8. **Launch date PR strategy (Part 9):** Phase 6
9. **Seasonal Pro packs cadence (Part 5):** Deferred to v1.1+

### Fully resolved

- ✅ **Multiplayer shape (Part 4)** — Echo + Challenge + Leaderboards, 2026-04-18
- ✅ **Dev environment (Part 7)** — clean-slate Apple Silicon Mac, Option B learn-as-we-go, 2026-04-18
- ✅ **Framework (Part 7)** — React Native + Expo with custom motion language principle, 2026-04-18
- ✅ **Monetization (Part 5)** — Free-with-Pro, no ads, "One More" button as brand-native paywall, 2026-04-18
- ✅ **Launch target + bandwidth (Part 10)** — 6-8 hours/week bursty, first half of August 2026, 2026-04-18
- ~~**Kicker placement (Part 3)**~~ — Killed for now (session 2). Deferred to Phase 5.
- ✅ **Category rebalance (Part 3)** — classical-durable lean, finer buckets, math capped, 2026-04-18
- ✅ **Rank ladder (Part 3)** — 22 tiers preserved from 2012 originals, 2026-04-18
- ✅ **Arcade power-ups (Part 3)** — streak ladder locked, no skip, top-tier 10-streak reward named "Unstoppable", 2026-04-18 / 2026-04-24
- ✅ **Avatar system (Part 3)** — 3 components (color/eyes/mouth), 3 option tiers (free/earned/Pro), league rank shown as border stroke, 2026-04-24
- ✅ **Daily Race mode (Part 3)** — 60 seconds, shared daily question set, once per day, score-based share-out, own daily leaderboard, 2026-04-18 session 3
- ✅ **Designer approach (Part 6)** — creative director + AI + new designer for brand/UI, 2026-04-18
- ✅ **Backend (Part 7)** — Supabase, 2026-04-18
- ✅ **Question writing workflow (Part 8)** — AI drafts, creative director approves, 2026-04-18

---

*End of doc v1.10 — last updated 2026-04-19.*
