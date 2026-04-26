# SUPER SMART 2026 — Mothership Doc

**Status:** v1.44 — **Home-screen polish pass shipped** (session 27, 2026-04-27). Three home surfaces redesigned + ported to RN, all driven by the same `dailyPlayedToday` flag the rest of the app already reads. (1) **Hero**: speech bubble removed; brain promoted to 92pt; brain + wordmark vertically center-aligned. (2) **Mascot**: antenna retired everywhere — Brain.tsx now renders an illustrated PNG body (`assets/images/brain-base.png`, 1402×1122 transparent) with eyes + mouth as an SVG overlay drawn at the PNG's native viewBox (eye coords ported verbatim from `explore/shared.jsx`: cx 335/645, cy 540, rx 82, ry 100; pupils inward by 8×flip). New `expression="hype"` (open mouth + tongue) added for the YOU-row leaderboard avatar. Role split: top-left brain = "this is your home" (smirk, 92pt, wiggle); YOU-row brain = "this is you in the race" (hype, 32pt disc with tier ring, no wiggle). (3) **Daily Race card**: branches on `dailyPlayedToday`. Fresh state: `DailyDecor` target + `FRESH EVERY 6AM`. Done state: same `DailyDecor` shell but new green-ringed checkmark stamp behind the same 5s lock-on / cream-flash cadence (only the visuals under the ring swap — zero reflow), plus `650 PTS · #34 OF 1,247` and a small `BACK IN HH:MM:SS` countdown line. Card stays fully vivid in both states. ArcadeCard gained an optional `tertiary` text slot (small mono, tabular nums, dim) to host the countdown without growing the card. (4) **DailyRaceRankings panel** (new component) replaces the old `GlobalLeaderboard` widget on home — header `DAILY RACE RANKINGS · DAY 247` with pulsing yellow dot on ink, top 3 placeholder rows with monogram AvatarDisc, dashed divider, then either YOU row (highlighted yellow with brain avatar in newcomer-tier ring, hype expression, no wiggle) when played OR PlayToEnterRow (same height/density, brain avatar + `START →` pill) when fresh. Footer: `SEE FULL RANKING IN LEAGUE ↦` → routes to League tab. Same row chrome both states means zero reflow when daily flips. `GlobalLeaderboard` component file preserved untouched for League tab use; the OVERALL/DAILY tab strip + `412K` total counter retire from home (home preview is today-only; full leaderboard browsing lives on League). New `useCountdownToNext6amET` hook (DST-aware US-ET math, 1s tick) is the pre-Phase-4 fallback — Phase 4 swaps to a server boundary. New `Tier` palette added to `constants/theme.ts` (8 tier hex values from v1.32 — used as solid fills wherever a single tier color is needed; gradients still live on the avatar border component when Phase 3 ships it). Mocked until Phase 4 (Daily Race board endpoint): user's daily rank (`#34`), total players (`1,247`), top-3 row data, `DAY 247`. Fresh-state Daily Race card was spec'd + shipped but not personally tested on device (creative director's `dailyStatus.played` was already true at handoff); flips automatically at next 6am-ET reset. Two new Appendix D follow-ups (#52 server-driven daily rank/total + ranking refresh-on-focus; #53 brain avatar editor UI ship date). Three new Decision Log rows. Reference deliverables for the polish pass: `Home v2 — Fresh.html` + `Home v2.html` + `explore/home-v2.jsx` + `explore/shared.jsx` (Claude Design exploration). v1.43 — **Round lifecycle locked + Tier 1 #2/#3 closed** (session 26, 2026-04-26). Mid-round exits are terminal: navigation-away (back button, swipe-back) locks the score and ends the round; backgrounding (app switcher, notification, phone call) does NOT pause — round timer keeps running on wall-clock time, player loses time on return. Force-quit captures latest score via progressive saves on every answer (highScores for Quickmatch, dailyStatus for Daily Race). 200ms AsyncStorage debounce is the only vulnerability — physically impossible reaction window for a human, accepted as edge. Wall-clock-based timer (computed from `roundStart` timestamp, never decremented) makes the round timer robust to iOS lifecycle quirks (fixes the double-subtraction bug from app-switcher transitions). Daily Race component-local `currentlyPlaying` flag prevents the alreadyPlayed view from rendering mid-round even though dailyStatus.played flips to true on first progressive save. Resolves Appendix D #21. New Appendix D items: #50 back-button handler (✅ resolved this session), #51 post-answer setTimeout deferred during iOS pause (open — cosmetic, self-corrects). v1.42 — **Per-question rhythm revised** (session 25, 2026-04-26). Old pattern: 1-second visible UI lock per question + variable 800/1500ms post-answer animation. New pattern: 150ms **invisible** double-tap guardrail (below the ~200ms human reaction-time floor) + unified 1-second post-answer animation (right, wrong, and with-multiplier all use the same beat). Speed-bonus 2-second window starts at question render — no free read buffer. The 60-question set size stays unchanged: now sized for the spam-tap ceiling (~50 questions theoretical max in 60s) plus margin for future power-ups, rather than the earlier "60 questions / 60 seconds 1:1" framing. Code changes shipped to `app/echo.tsx`, `app/daily.tsx`, `app/game.tsx`. Verified on device. Game mechanics section in Part 3 + ghost-pool architecture in Part 4 updated. v1.41 — **Live Players Strip spec locked** (session 24, 2026-04-26). New Part 4 Layer 1.5 subsection covers the Quickmatch card footer strip end-to-end: "X PLAYING TODAY" with rolling-24h unique-player count, exact integers (no K/M rounding), server-cached cron-driven aggregation (decouples client traffic from DB load), 6 frames/min playback at 10s intervals with magnitude-scaled jitter (±1 at ≤50 up to ±5 at 1k+) for visible "trailing" motion, soft floor at <20 (random 20–30 display), stale-cache fallback for invisible server-failure handling, schema +1 column `players.last_seen_at`. Phase 4 implementation — ~3 hours of work when auth + Supabase wiring lands. v1.40 — **Tier 1 #1 closed: AsyncStorage persistence** (session 23, 2026-04-26). `app/store.tsx` wired to persist avatar, freePlay, dailyStatus, highScores via single-blob `@supersmart/state` key with `_version: 1` migration scaffolding + 200ms write debounce. Hydration runs in parallel with font load in `_layout.tsx`; render unblocks when both ready. **Closes the gate-bypass abuse path** + the once-per-day Daily Race loophole. Plus a home-screen UX win: when today's Daily Race is done, the card stays vivid cyan with `DAILY RACE ✓` label, score in sublabel, and the target accent flips red→green. Build-for-the-flex pattern (matches Wordle/Duolingo/Apple Fitness — bright + result-inline, never grayed). Resolves Appendix D #2. v1.39 — **Corpus-wide style sweep executed** (session 22f, 2026-04-26). Three clusters cleaned in one mechanical pass on 1001.xml + cascaded to app/questions.ts: **42 "Make a word using" prefix normalizations** (lowercase + single-space across the cluster); **4 math caps to lowercase** (Q738/Q739/Q744/Q777); **Q626 Roman numerals uppercased** (c/k/x → C/K/X). 49 total field changes. Phase 1 audit tally unchanged (903/98/0/0) — sweep is style normalization, not Light edits. Phase 1 fully closed; ready for Phase 5 question writing. v1.38 — **Incident runbook drafted + locked** (session 22e, 2026-04-26). New file `incident_runbook.md` at parent root (mirrored to `supersmart/docs/`) — 6 pre-launch scenarios, 5 canonical PostHog kill-switch flags, player-facing maintenance copy voice-locked. Cross-reference added to mothership Part 7 (Engineering & Stack) so the runbook is discoverable from here. Living document — postmortems update it after every actual incident. v1.37 — **1001.xml updated with all 98 Light edits applied** (session 22c, 2026-04-25). Original 2012 corpus preserved at `1001_original_2012.xml` (archive); new audited corpus is now the live `1001.xml`. Mechanical apply via structured edits dictionary; integrity verified (1001 questions, all answers match options, exactly 98 changes diffed against original = audit set). Phase 1 deliverables complete: tagged CSV ✓, methodology doc ✓, edited corpus XML ✓, original archive ✓. Ready for Phase 5 question writing against this voice corpus. v1.36 — **PHASE 1 AUDIT COMPLETE + FINAL-CHECK PASS** (session 22b, 2026-04-25). Final-check fresh-eyes sweep across all 1001 questions caught 5 more candidates: **Q71** (dinosaur extinction 65M → 66M for current K-Pg consensus), **Q321** (Smart German automaker → BMW; Smart is now Mercedes+Geely JV), **Q594** (Woody Allen → Christopher Nolan; Annie Hall → Inception; cultural drift ruling #16), **Q875** (Texas population threshold "<33M" → "<40M"; Texas growing toward 33M during game lifespan, ruling #14), **Q932** (rewrite to "larger country by population" Japan/Germany/France with Japan correct; resolves city/options mismatch + duplicate avoidance). **Final corpus-wide tally: 903 / 98 / 0 / 0 = 90.2% Keep / 9.8% Light / 0% Heavy / 0% Retire.** Per-category Keep rates: math 100%, science 82.5%, misc 88.7%, word 91.4%, music 84%, movies 86.7%, geography 91.3%, people 82%, literature 90%. Six batches across 5 working sessions (13, 14, 16, 19, 21, 22). **Zero Heavy or Retire flags across all 1001 questions.** The Part 8 projection of 700/150/100/50 was off by an order of magnitude on Heavy/Retire — the corpus is dramatically more durable than Phase 0 sampling suggested. Per-category final Keep rates: math 100%, science 81%, misc 89%, word 92%, music 86%, movies 90%, geography 92%, people 82%, literature 90%. Notable batch 6 fixes: Q868 equator-doesn't-pass-through-Argentina factual error → Brazil; Q924 Sears Tower → Willis Tower (already-effected rename, ruling #14); Q979 French goalkeeper Barthez → famous French footballer Mbappé (contemporary anchor); Q968 distractor Bradley Manning → Bradley Cooper (cultural drift, ruling #16); Q988 Pluto → Plato source-XML broken-puzzle fix; Q935 Everest China-vs-Nepal ambiguity → "in the Himalayas mountain range." **Phase 1 deliverable**: 1001-row tagged CSV (`audit_1001/audit_1001_tags.csv`), 16 edge-case rulings, methodology playbook, calibration table with per-category actuals. Next: corpus-wide style sweep before Phase 5 question writing. v1.34 — Phase 1 audit batch 5 closed + cultural-relevance sweep (session 21, 2026-04-25). 300-question mega-batch (Q401–Q700) — speed mode + a fresh-eyes cultural-drift pass over Q1–Q700 catching phrases whose meaning has shifted since 2012 (red pill manosphere baggage, Sarkozy fading political relevance). New methodology ruling #16 added for cultural-drift Lights. Final batch 5: **278 Keep / 22 Light / 0 Heavy / 0 Retire** = 92.7% Keep. Cumulative through Q1–Q700: **629 / 71 / 0 / 0** = **89.86% Keep**. **Five batches in (70% of corpus), still zero Heavy or Retire flags.** Dated-cluster forecast for music/movies materialized only mildly (86% / 90% Keep — well above 40–60% original forecast). Two durability-driven concept-replaces: Q543 Bieber→Swift answer ("Shake It Off"); Q595 Will Smith→Tom Cruise (Will Smith's 2022 Oscar win invalidated the "never won" answer — first **already-effected fact change** in the audit, methodology ruling #14 extended to cover both pre-announced AND already-effected changes). One Retire flag was raised on first pass (Q501 duplicate of Q326) but CD reframed to a Light-edit rewrite (group-of-goats puzzle), preserving the perfect zero-Retire streak. Math 100% Keep across 95 questions — the cleanest category yet. The 700/150/100/50 Part 8 projection is now decisively pessimistic; running rate suggests final around 900/100/0/0 if late categories cooperate. Remaining: 80 math + 161 geography + 50 people + 10 literature = 301 questions. People (Q942–Q991) is the last major attrition risk. v1.32 — League rank border palette locked (session 20, 2026-04-25). Appendix D #11 resolved. All 8 tier hex values + gradient structures + Legend shimmer execution specified in Part 3. Visual escalation: solid 1–5, 2-stop gradient at Finalist, 3-stop static gradient at Champion (mirrors Legend's recipe in crimson), 3-stop animated gold gradient at Legend (continuous low-intensity shimmer + theatrical-entry brighten on the promote-to-Legend interstitial). Two minor evolutions from the v1.25 directional spec: Newcomer "white" → pale dusty blue `#A8C4D8`; Finalist "orange" → magenta gradient. v1.31 — Phase 1 audit batch 4 closed (session 19, 2026-04-25). Q301–Q400 tagged at **90 Keep / 10 Light / 0 Heavy / 0 Retire** — same shape as batches 2–3. Cumulative through Q1–Q400: **351 Keep / 49 Light / 0 Heavy / 0 Retire** (87.75% Keep). First word category coverage: anagram cluster Q352–Q386 ran very clean (94% Keep across the 50-question word slice). Two retired-mode concept-replaces (Q331 Arcade→Quickmatch, Q332 Classic→Daily Race — same pattern as Q265 batch 3). One corpus-wide style sweep deferred to end-of-Phase-1: the "Make a word using  X" double-space prefix typo + Make/make capitalization split across Q352–Q386 (35 questions, identical fix). Three char-overflow Keeps approved by CD discretion against the ≤40 ceiling — methodology now has ruling #15 softening the rule to "default Light, CD-discretion override on small overruns where the fix degrades voice." **400 questions audited (40% of corpus); zero Heavy or Retire flags four batches in.** Part 8's 700/150/100/50 projection meaningfully pessimistic — would land closer to 875/125/0/0 if rate held, but people/music/movies depths still likely carry the dated cluster. Will revisit projection after batch 6. v1.30 — Post-league UX fully specced (session 17). Appendix D #26 resolved. Three result states locked: Promoted (theatrical border-color reveal, share button, `[Tier]. Yours now.`), Held (position-aware dry copy, three micro-brackets), Demoted (quiet, no reward, `Not this week.`). Full spec in Part 4 Layer 4. v1.29 — Phase 1 audit batch 3 closed. Cumulative through Q1–Q300: **261 Keep / 39 Light edit / 0 Heavy edit / 0 Retire** (87.0% Keep). Batch 3 (Q201–Q300, all misc) closed at 90/10/0/0 in session 16 — same shape as batch 2. Two questions hit "concept-replace" rather than tweak: Q265 reframed because its answer ("arcade") referenced a retired mode (same fix the code-side `app/questions.ts` got in CHANGELOG session 11), Q266 reframed because the iPod answer is dated post-2022 discontinuation. Six of ten Light edits this batch were proper-noun capitalization (months + names) — same pattern as batch 2. **Three batches in (300 questions, 30% of corpus), still zero Heavy or Retire flags.** Mothership Part 8's 700/150/100/50 projection now meaningfully pessimistic at the running 87% Keep rate. Will revisit projection after batch 4. v1.28 was the codebase + documentation audit pass (session 15, 2026-04-25). Five small drift items closed: (1) deleted 8 dead boilerplate files from the Expo template (themed-text/view, collapsible, parallax-scroll-view, 2 use-color-scheme hooks, use-theme-color hook, modal screen) — closed island of dead code that referenced a `Colors.light` / `Colors.dark` shape `theme.ts` doesn't have; if dark mode is reopened later it should be redesigned from scratch against a parallel palette, not by reactivating template scaffolding; (2) `app.json` `userInterfaceStyle` flipped from `automatic` to `light` (matches the locked light-only commitment); splash-screen `dark` background removed; splash backgroundColor changed to cream `#FFF4DF`; `app/_layout.tsx` modal route registration removed; (3) primer refreshed to current state, drops the "audit overdue" line, picks up batch 1+2 progress; (4) Part 5 free-tier rounds nailed from "5–7" range to **7** (matches the `FREE_LIMIT=7` PostHog flag default that was already in code); (5) Phase 7 launch window made explicit ("August 1–15, 2026"). Three new Appendix D code-side tracker items added (#47–49: IS_PRO hardcode, duplicate `getRankLabel`, Profile mailto domain dependency). v1.27 closed Phase 1 audit batch 2. Cumulative through Q1–Q200: **171 Keep / 29 Light edit / 0 Heavy / 0 Retire** (85.5% Keep). Batch 2 (Q101–Q200, last 20 science + first 80 misc) closed at 90/10/0/0 in session 14 — the misc slice ran much cleaner than forecast (89% Keep) because it's mostly self-referential wordplay, fourth-wall meta, family-tree/letter puzzles, and durable basics (colors, alphabet, days, rock-paper-scissors, historical Olympics). The dated-pop-culture cluster expected for misc must live deeper in the category (Q201+ inside misc, batches 3+). One new edge-case ruling locked into methodology: **#14 — time-bound facts with pre-announced changes are Light edits even if technically correct at launch** (squash → bowling for Q147 because squash was approved for LA 2028 Olympics in 2023). Calibration table updated: misc forecast revised, late-misc still expected to carry most of the Heavy+Retire load. Methodology doc also got a section on corpus-wide stylistic decisions (capitalization, underscore counts) — fix inline as you spot them, run one global sweep at the end of Phase 1 to catch residuals. v1.26 captured batch 1 close (Q1–Q100, all science, 81/19/0/0). v1.25 bundled 5 mini-decisions (league tiers 1–3 renamed with entry at tier 2, splash 2s every launch, emoji policy, question retirement three-tier system with "Contact the developer" email in Profile in place of in-app report button; #40 support domain deferred). League ladder now Rookie → Newcomer → Regular → Veteran → Qualifier → Finalist → Champion → Legend.
**Last updated:** April 27, 2026
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
- **Per-question rhythm** *[REVISED 2026-04-26 session 25]*: after every answer (right, wrong, or with multiplier), a unified **1-second post-answer animation** plays before the next question loads. Then a **150ms invisible button-disable guardrail** filters rhythmic-tap accidents (under the human ~200ms reaction-time floor — imperceptible to the player but blocks finger-mid-motion misclicks on the new question). The 2-second speed-bonus window starts at question render — there is **no free read buffer**. The window encompasses read + decide + tap. The corpus's ≤40-character prompts (avg 23) make this feasible. The "wit per second" brand promise lives here: the round feels relentless, not laggy. *(Earlier spec had a 1-second visual lock + variable 800/1500ms post-answer animation — that was sized for the pre-launch dev build; revised to the current pattern after device testing.)*
- **Round lifecycle — exits are terminal** *[DECIDED 2026-04-26 session 26]*: leaving a round mid-flight ends it. There is no "save and resume" — every exit is a complete match recorded with whatever score the player had at the moment of exit. Three categories:
  - **Navigation away** (hardware back button on Android, iOS swipe-back gesture, programmatic navigation): score locks, round ends, player exits to wherever they were navigating. Quickmatch updates high score (if PB); Daily Race uses today's daily attempt with the locked score. No confirmation dialog.
  - **App backgrounding** (notification, Control Center, Notification Center, app switcher swipe-up, phone call, app switch): round timer **keeps running on wall-clock time**. Player loses time-on-task while the app is backgrounded but the round resumes when they return. To their disadvantage, intentionally; this is an anti-cheat principle — backgrounding is not a "pause" mechanism. If the timer hits 0 while the app is backgrounded, the round ends immediately on foreground.
  - **Force-quit / OS-killed / crash**: the latest score persisted to AsyncStorage is recorded as the final score. To make this work, the score is **saved progressively on every answer** (Quickmatch updates `highScores`, Daily Race updates `dailyStatus`). This means even a force-quit at second 5 with a single answered question captures that question's points. The 200ms AsyncStorage debounce is the only vulnerability — a player who force-quits within 200ms of their first answer might escape recording. In practice: physically impossible reaction window for a human; acceptable risk.
  - **Implementation note:** the in-round timer is computed from a wall-clock anchor (`roundStart = Date.now()` at phase entry; remaining = `max(0, 60 - elapsedSecondsSinceStart)`), not by decrementing every interval tick. This is robust to JS pauses during iOS lifecycle transitions (app switcher, briefly-inactive states) — the timer always reflects real elapsed time, never desyncs. The interval just triggers re-renders; the math is intrinsic to wall-clock.
  - **Daily Race specifically:** a component-local `currentlyPlaying` flag overrides the alreadyPlayed view during an active round. Without it, the progressive-save flip of `dailyStatus.played = true` would render the alreadyPlayed view mid-round. The flag is component-local — lost on force-quit, which is correct behavior (next app open shows alreadyPlayed view since `dailyStatus.played` persisted).

**Equal ground principle:** In both modes, all players face the same question set in the same order within their competitive context. In Quickmatch, you and the ghost you're racing answered the same questions. In Daily Race, everyone in the world that day answers the same questions. You win or lose on speed and accuracy, never on question difficulty luck.

### Navigation architecture *[DECIDED 2026-04-19 session 5]*

Three tabs. Clean, focused, no decision overhead for the player.

- **Home** — mode cards (Quickmatch + Daily Race), One More button, compact leaderboard widget, brain + wordmark hero. Pure action screen. Getting the player into a round is the only job.
- **League** *(formerly Inbox)* — four sections in order: (1) Recent Activity feed (match results since last login or last 24h, whichever longer) + League of 30 standings for this week; (2) Daily Race board for today; (3) Global Ranking — Pro only, blurred teaser for free users; (4) Past Matches — personal match history. Badge dot when new activity arrives. Push notification fires on new activity if permitted.
- **Profile** — avatar, game log, personal stats, settings. **Contains a "Contact the developer" link that opens the user's mail app to the support email address** *[DECIDED 2026-04-24 — see Appendix D #25]*. Single outbound channel for bug reports, bad-question reports, feature feedback, general correspondence. Deliberately *not* a per-question "report" button — all player feedback flows through one channel at one remove from gameplay, keeping the play surface clean and framing feedback as a human conversation with the developer rather than a moderation action.

**Leaderboard placement** *[REVISED 2026-04-27 session 27]:* the home screen carries the **`DailyRaceRankings` panel** — today's race only, scoped tightly to "what's happening *today*." Header `DAILY RACE RANKINGS · DAY [N]` (pulsing yellow dot on ink), top 3 finishers, dashed divider, then either a highlighted **YOU row** (when the player has played today — shows their brain avatar in tier-colored ring, rank, and score) or a **PlayToEnter row** (when fresh — same density, brain avatar + `START →` pill CTA). Footer link `SEE FULL RANKING IN LEAGUE ↦` routes to the League tab. The same row chrome serves both states so the panel doesn't reflow when daily flips. The full leaderboard (all players, sortable, all boards including OVERALL/DAILY tabs and total-player counters) lives in the **League tab** — that's where browsing happens. Home is preview-only. *(Earlier home leaderboard widget — `GlobalLeaderboard` with OVERALL/DAILY tab strip + `412K` total counter — was retired from home this session because it doubled as a leaderboard browser, which is the League tab's job. The component file is preserved for League tab use.)*

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

**League rank border:** the avatar displays a colored stroke/border indicating the player's current league tier. Eight tiers, eight colors. The progression is **dull → cool earned → warm climbing → gold**, with visual treatment escalating across the top three tiers (solid 1–5 → 2-stop static gradient at 6 → 3-stop static gradient at 7 → 3-stop animated gradient at 8). *[Hex values + gradient + shimmer execution locked 2026-04-25 session 20.]*

| # | Tier | Border | Read |
|---|---|---|---|
| 1 | Rookie | `#8E8E8E` solid | dull neutral gray — demotion floor, no warmth. |
| 2 | Newcomer | `#A8C4D8` solid | pale dusty blue — entry tier, has identity without being loud. |
| 3 | Regular | `#7BAA86` solid | sage green — first "earned" color. |
| 4 | Veteran | `#3F8C7A` solid | deeper teal — established, mature step up from sage. |
| 5 | Qualifier | `#6962C0` solid | indigo — the cool→warm hinge, "now you're climbing." |
| 6 | Finalist | `#B0356A → #E85F90` (2-stop diagonal gradient) | magenta with sheen, near-top heat. Static. |
| 7 | Champion | `#6B0F2D → #F03B5C → #6B0F2D` (3-stop horizontal gradient) | crimson with bright center "shine band." Static. Mirrors Legend's recipe in red. |
| 8 | Legend | `#C99020 → #FFE082 → #C99020` (3-stop animated) | gold shimmer — the only animated tier border. |

**Legend shimmer execution:** Reanimated 3 + linear gradient mask on the border ring. Custom motion (no Lottie). Two states: (1) **continuous low-intensity shimmer** wherever the Legend border renders — avatar in lists, profile, League tab cards (the prestige is permanent, the shimmer never sleeps); (2) **theatrical entry** on the post-league promotion-to-Legend interstitial — same gradient stops, but the sweep animates faster on entry (~0.6s) and brightens, then settles into the continuous loop. One-shot reveal layered on top of the steady state.

**Notes:**
- All hex values verified against Cream Stadium background `#FFF4DF` for visibility.
- No tier shares hex with any avatar fill in the existing 8-color avatar library (free: pink/blue/green/orange; Pro: purple/gold/teal/red).
- Legend gold base `#D4A02E` is intentionally darker than the brand yellow `#FFD23F` and the Pro avatar gold `#FFD700` — trophy gold is its own color; the shimmer is the differentiator.
- The Champion 3-stop structure deliberately mirrors Legend's recipe so the top two tiers feel like siblings (same visual recipe, different metals).

Border reflects last week's confirmed rank, not live current-week standing.

### Onboarding *[DECIDED 2026-04-24]*

The 2012 version had no onboarding. The 2026 version has one — but it's designed to feel like the game, not a tutorial.

**Core principle:** the best onboarding for Super Smart is playing Super Smart. No tutorial screens, no rules explained upfront. Get the player into a round within 30 seconds of opening the app for the first time.

**First-open flow:**

1. **Animated wordmark splash — 2 seconds, every launch** *[DECIDED 2026-04-24]*. App opens to the Super Smart wordmark on the cream/sunburst background. **Water-balloon bloat fires at t=0 as the welcoming pop** (bloat animation takes ~1.2s), then settles through the remaining window before fading into the home screen. No copy, no buttons. Pure brand moment. **Shown on every cold-start, not just first-time open** — the splash is a universal brand ritual, not an onboarding-only screen. (The rest of the onboarding flow below still only fires on first open.)

2. **First-time home screen.** Identical to the normal home screen except the leaderboard widget is replaced with a single line: *"Tap Quickmatch to play your first round."* League and Profile tabs are greyed out until the player completes one round. Between Quickmatch and Daily Race on the home screen, the player chooses freely — Daily Race is a valid first experience too.

3. **Sign in with Apple / Google — fires on first game tap, regardless of mode.** Display name is pulled automatically from their platform account. No manual name entry. They can change their display name anytime in Profile (30-day cooldown to protect leaderboard integrity). If they are not signed in or decline, they play as an anonymous Supabase session — data is saved, prompt returns at natural moments (e.g. before accessing leaderboards). Email magic link available as fallback for players who won't use platform auth.

4. **First round — standard Quickmatch (bot-ghost opponent), two contextual nudges.** *[Updated 2026-04-24 to align with the bot-ghost system.]* Full-length round (60 seconds), normal mechanics, nothing dumbed down — same as any other Quickmatch round. The player is matched against a bot ghost (since the ghost pool is empty for them at this point); the bot's score lands in the 300–3,000 range, so the new player typically *wins* their first game. That win is the confidence-building moment the original "ghost-free" framing was designed to deliver, now achieved through the bot system instead of a special-case empty opponent. Two UI nudges appear once and never again:
   - When they answer correctly in under 2 seconds for the first time: *"Under 2s — speed bonus!"*
   - When they hit their first 3-streak: *"3 in a row — 2×!"*
   Miss penalty, One More button, leagues — discovered naturally when relevant. No pre-explanation.

5. **After round one.** Normal rank reveal, normal result screen. No welcome banner. League and Profile tabs unlock. From round 2 onwards: full experience, ghost opponents, everything live.

**Name change:** display name is editable in Profile. 30-day cooldown between changes. One Supabase `name_last_changed` timestamp field enforces this — straightforward to build.

**If they play Daily Race first:** same flow applies. Sign in prompt fires on first game tap. Same two contextual nudges fire on first round regardless of mode — tied to the player, not the mode. Once seen, never shown again. Daily Race is once-per-day so their natural next session is Quickmatch anyway.

### Daily Race *[DECIDED 2026-04-18 session 3; format corrected 2026-04-19; share spec revised 2026-04-24]*

One of the two home-screen modes. Shares all game mechanics with Quickmatch (60-second round, streak multiplier ladder, speed bonus, miss penalty) and runs on the same engine — the differentiator is competitive context, not rules.

- **Same question set for everyone globally, that day.** The defining feature — every player that day faces the same questions in the same order. Seeded by date so the set is identical for all players worldwide. Fast players get deeper into the set; slower players answer fewer. The early questions are shared by everyone, which creates the water-cooler comparison moment.
- **60 questions, 60-second round.** Identical format to Quickmatch. The differentiator is what you're competing *on*, not how long you play. *(Note: an earlier spec proposed 10 questions / Classic pacing. That was superseded — the shared-mechanics principle and the "no Classic mode" decision make 60s/60q the correct format. See decision log 2026-04-19.)*
- **Once per day.** Locked after the player completes it. Cannot replay to improve your score.
- **Resets daily at 6am Eastern Time.** *[DECIDED 2026-04-24]* Reset clock is anchored to `America/New_York, 06:00` — underlying UTC auto-shifts between 10:00 UTC (EDT) and 11:00 UTC (EST) twice a year. Supabase cron job configured in `America/New_York` tz. Stored behind the `daily_race_reset_time` PostHog flag (Part 7 Flexibility Architecture) so it can be retuned without a submission. **DST gotcha:** the reset-week is 23 or 25 hours long — the once-per-day lock must be built on the reset window, not a rigid 24-hour timer, otherwise players either double-play (25-hr week) or get locked out (23-hr week).
- **End-screen visual (in-app):** the 🟩🟥 grid — one square per answered question, green correct, red wrong — is rendered on the result screen as a reflective end-of-round moment. Players see how their round went. It is *not* the share asset.
- **Shareable result (off-app):** 3-line fixed-shape scoreboard, designed to paste cleanly into any chat:

   ```
   Super Smart Daily · Apr 24
   ⚡ 4,850 pts · rank: Elite
   🔥 best streak · 7
   ```

   Every player produces the exact same three lines — date, points + rank, peak streak — so direct eyeball comparison works regardless of how many questions each player answered. The score is the competitive metric; rank gives it emotional weight; peak streak is a natural-language brag line ("my best streak was 7"). *(Earlier spec included the full 60-square grid in the share; that was revised 2026-04-24 — see decision log.)*
- **Daily Race leaderboard:** Today's high score list for today's specific question set only. Who scored highest on the same questions everyone played. Resets with each new day. No all-time component — this board is purely about today's shared test.

Daily Race is the "come back tomorrow" retention loop and the "talk about it at work" mode. The once-per-day constraint combined with shared questions is what gives it identity separate from Quickmatch.

**Home-screen card states** *[DECIDED 2026-04-27 session 27]*

The Daily Race card on home is a **two-state surface** driven by `dailyPlayedToday`. Same card height (96pt), same color (cyan), same depth shadow, same idle bob — only the content + the right-side decor swap. The principle: when there's no action to take (race already done), the card has to earn its space by feeling alive instead of inert. Live ticking + score + rank turn the surface from "dead button" into "live status."

**Fresh state** (`dailyPlayedToday === false`)
- Title `DAILY RACE` (Archivo Black ~30pt)
- Subtitle `FRESH EVERY 6AM` (mono small)
- Right decor: `DailyDecor` target — calendar + red bullseye + crosshairs + lock-on ring that contracts every 5s, then bullseye flashes red on hit. (This is the production `DailyDecor.tsx` behavior unchanged.)
- Tap → `/daily` route, plays today's race.

**Done state** (`dailyPlayedToday === true`)
- Title `DAILY RACE` (unchanged from fresh — no `✓` annotation in the title; the green decor + score + countdown carry the "done" semantics)
- Subtitle `[score] PTS · #[rank] OF [total]` (mono small) — e.g. `650 PTS · #34 OF 1,247`. Score from `dailyStatus.score`. Rank + total are mocked locally until the Phase 4 Daily Race board endpoint lands (Appendix D #52).
- Tertiary `BACK IN HH:MM:SS` (mono smaller, dim, tabular-nums) — live countdown to next 6am ET. Re-renders every second via `useCountdownToNext6amET` (DST-aware US-ET math; pre-Phase-4 fallback).
- Right decor: same calendar shell as fresh — green-ringed checkmark stamp behind the same 5s lock-on / cream-flash cadence (only the visuals under the ring swap; ring rhythm and rotation are identical to the fresh state).
- Tap → `/daily` route, which renders the alreadyPlayed view (result grid).
- Why the countdown is *small* (not a hero clock): the card already reads as "alive" via the live ticking + the 5s decor pulse. Sizing the countdown bigger competes with `DAILY RACE` for the title slot. The current hierarchy — title → score+rank → countdown — keeps the score (the player's *result*) as the second-loudest element, which is the right emphasis for a brag-able number.

The DailyRaceRankings panel below the cards mirrors this state on the YOU/PlayToEnter row (see Navigation architecture above) — the home composition reads as a single coordinated surface, not two disconnected widgets.

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
- The per-question rhythm (see Game mechanics) means a spam-tapping player has a theoretical max of ~50 questions in 60 seconds (1.2s minimum cycle: 150ms guardrail + ~50ms tap latency + 1000ms unified animation). Realistic players answer 20–30 questions per round depending on speed; the 60-question set size is sized to comfortably hold the spam-tap ceiling with margin for future power-ups (a player should never exhaust the pool before the round timer expires). *[Sizing rationale revised 2026-04-26 session 25 after pacing change; earlier "60 questions / 60 seconds 1:1" framing assumed the older 1-second visual lock per question.]*

*Ghost selection — the baton pass:*
- When a player is matched to a question set, they race the **most recently completed ghost at their skill tier** on that set. Player A creates the set → Player B (same tier) races Player A → Player C races Player B → and so on. Each player inherits the current ghost and becomes the ghost for the next player at their tier.
- This creates a living chain of competition rather than a static benchmark.

*Skill-based matching:*
- All matching logic runs instantly as a database query. The 1–2 second UI beat is a designed pause, not actual wait time.
- **Matching rule:** skill tier filters first; recency within tier is the tiebreaker. The system finds the most recently completed ghost within the player's tier on an active question set. If no match exists at that tier, the search silently expands to the nearest adjacent tier (up or down) until a match is found. This always resolves before the UI beat completes — the player never waits beyond the anticipation pause.
- See Skill tier system below for how tiers are defined.

*Bot-filled ghosts — the fresh-set fill * [DECIDED 2026-04-24, reverses 2026-04-18 session 3 and 2026-04-19 session 5]:*

When a player is matched to a question set that has no human ghost at their skill tier, the match is filled with a **bot ghost**. Bots are single-use, indistinguishable from human ghosts in the UI, and exist to guarantee that every Quickmatch round has an opponent — especially for a player's first game.

- **Single-use and ephemeral.** A bot is generated fresh by the matchmaking Edge Function, served to exactly one player, and discarded after the round. Bots do not persist in the `ghost_pool` table — it remains a human-only record. The player's own run is recorded normally; the bot leaves no trace.
- **Graduation rule.** The moment a human plays a set, their ghost enters `ghost_pool`. Subsequent players at the same skill tier on that set match to the human ghost, not a bot. Bots only appear when no human ghost exists at the matched player's skill tier — automatic fade-out as the pool organically populates.
- **Score calibration.** Bot scores are randomly distributed within a **300–3,000 range**. The low floor means new players typically *win* their first few games against bots — the confidence-building first-impression moment the design needs. Bot answer sequences are plausible (no unrealistic speed-bonus rows, no 60-correct runs) and reverse-engineered to hit the target score.
- **Names — deliberately non-pattern.** Multiple generation strategies mixed (adjective+noun, firstname+number, curated handle library, etc.) so players cannot identify bots from name alone. Full opacity: bots should be indistinguishable from humans in every surfacing.
- **Avatar — randomly generated, can include Pro cosmetic items.** Bots draw from the *full* avatar option library, including the Pro-locked brain colours / eyes / mouths. Seeing a bot wear a Pro-exclusive item acts as soft exposure to purchasable items — passive marketing folded into the gameplay surface without being aggressive.
- **Emote — randomly pulled** from the full post-game interview emote library (all 5 categories, 75 lines).
- **Timestamp — seeded plausibly recent** ("played X minutes ago") so the opponent preview looks like any other organic ghost match.
- **Leagues excluded, always.** Bots exist *only* in Quickmatch ghost matchmaking. They never enter a League of 30 cohort, never appear on a league leaderboard, never contribute to weekly standings. The "no ghost-fill in leagues" rule (2026-04-19 session 7) stands absolutely — league boards remain all-real-player.

**Why we reversed the earlier "no bots, honest fresh-set messaging" decision:** first-game feel is more load-bearing for mobile retention than architectural transparency at the audience Super Smart is aiming at. The old design's "you're first, seed the pool" messaging is defensible as brand voice but still fundamentally an *absence-of-opponent* moment, which defeats the point of an async-multiplayer architecture designed to feel populated from day one. Every established async-multiplayer game at scale (Words With Friends, Clash Royale, Geoguessr) uses bot-fills for this same reason. The convention is well-understood by players even when undisclosed, and bot play staying within human score ranges keeps the mechanic within ethical bounds.

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

### Layer 1.5: Live Players Strip (Quickmatch card footer) *[DECIDED 2026-04-26 session 24]*

The strip in the Quickmatch card footer that shows a pulsing dot, an "X PLAYING TODAY" count, and 3 avatar circles. Today it's a placeholder (random-walk fake count, hardcoded avatars). This subsection locks what it becomes when Phase 4 lands.

**Display:**
- Copy: `X PLAYING TODAY` — exact integer, comma-separated, no K/M rounding. Exact reads more genuine than rounded; player base expects to see "1,247" not "1.2K".
- 3 avatar circles + a "+" — sampled from recent sessions in the player's skill tier, cached 5 minutes.

**Metric definition:**
- `X` = count of unique players whose `last_seen_at` falls within the rolling 24-hour window ending now.
- `last_seen_at` is a new column on the `players` table (indexed, `timestamptz`).
- `last_seen_at` is updated on every **app open** event — both cold start (initial mount in `_layout.tsx`) and every **background → foreground** transition (`AppState` listener). A player who opens the app and doesn't play still counts.
- Bot-ghosts are excluded.

**Server architecture:**
- A cron-driven Edge Function recomputes the count **once per minute, globally**.
- Result stored in a cache (Redis key or `live_stats` table row) with a `computed_at` timestamp.
- All client polls hit the cache, never the underlying `players` table aggregation. **Decouples client traffic from DB load — O(1) DB query per minute regardless of user count.** This caching is required, not optional, at any scale.

**Client cadence:**
- Client polls the cache **once per minute** (not the DB directly).
- Server returns 1 anchor count per poll.
- Client displays **6 frames per minute, 10s apart**, jittering the anchor to produce visible "trailing player number" motion.

**Jitter table** (applied per-frame around the anchor, scales with magnitude so jitter looks realistic at every scale):

| Real count (anchor) | Jitter range |
|---|---|
| ≤ 50 | ±1 |
| 51 – 250 | ±2 |
| 251 – 500 | ±3 |
| 501 – 1,000 | ±4 |
| 1,001+ | ±5 |

Per-frame display = `anchor + random_int(-jitter, +jitter)`. Bounded so the displayed number can never go negative.

**On anchor change** (every minute, when the new fetched count differs): jump to the new range immediately, no smoothing/easing. Brief visible step at minute boundaries is acceptable.

**Stale-cache fallback:** if client receives a cached value with `computed_at` older than 5 minutes, fall back to the last-known anchor and continue jittering locally. Server cron failure is invisible to the player. On next successful fetch, resume normal anchor updates.

**Floor (small-count protection):** if the real count is `< 20`, display a random integer `20–30`, re-randomized every 10 seconds (same tempo as normal mode for consistency). Below-floor display IS a soft fabrication — bounded (20–30, never higher) and contained to launch days / sparsely-populated quiet hours. **No hysteresis** — at exactly 20, exact mode resumes; brief flicker around the boundary is accepted as not-worth-fixing. Avatars in this state are still pulled from real recent sessions (not faked).

**Honesty footprint:** above the floor, every displayed number is anchored to a real database count (with bounded jitter ≤ ±5). Below the floor, the number is bounded fabrication. Same philosophy as the bot-ghost system (Part 4 Layer 1) — contained lies in service of warm UX, never in surfaces that affect competition (leagues stay all-real, Global all-time stays all-real).

**Implementation effort (Phase 4):** ~3 hours total — schema column + last_seen_at update on app open + cron worker + cache row + Edge Function endpoint + client polling/jitter logic.

### Layer 2: Challenge a Friend

Player generates a shareable link or code after any round. Friend plays the exact same questions in the exact same order. Results compared. Works for the use case Echo can't serve: "I want to play *this specific person* right now." Viral via iMessage / WhatsApp / IG DMs. No accounts required on either side.

**Challenge ghost rule:** everyone who plays a challenge link always races the original sender's ghost — permanently. The challenge link is unique to the sender. Unlike Quickmatch's baton pass, challenge ghosts are static and never update. This means: no matter how many people play your challenge link, they all race you specifically.

**Challenge results:** the sender can view a results page at any time showing everyone who played their challenge link — ranked by score, with their emote. Accessible from the League tab (see Navigation architecture, Part 3). No dedicated challenge-results screen required at launch — the League tab surfaces this naturally.

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

### The League tab — activity feed

The League tab is a permanent tab in the bottom nav (see Navigation architecture, Part 3). Not a popup — accessible any time the player wants it. Badge dot appears when new activity arrives.

**What it shows:** everyone who raced your ghost or completed your challenge since your last login, or the last 24 hours — whichever window is longer. Each entry shows: opponent name, avatar, emote they left, their score vs. yours, win/loss. Challenge completions and Quickmatch ghost races feed into the same unified feed.

**Push notifications:** fires when new activity arrives, if the player has permitted notifications. No dark-pattern pressure to enable — offered once at a natural moment, never nagged.

**"Best moment" surface:** one featured highlight surfaced at the top when available (e.g. "3 people tried and nobody beat you", "someone matched your high score exactly"). Designed to feel like a small gift on return, not a Slack notification log.

**Leaderboards** live in the League tab: League of 30 (everyone), Daily Race board (everyone), and Global all-time (Pro only — visible but locked with an upgrade prompt for free users). The home screen carries only a compact "you are here" widget for the daily board (see Navigation architecture). The League tab is where you go to dig in.

### ~~Honesty layer~~ *[RETIRED 2026-04-24]*

*Previously stated principle: "the design doesn't pretend — all opponent displays are transparent about ghost vs. live; 'played 2 hours ago' is plain-English honest."*

**Retired in favour of the bot-ghost fresh-set fill (Layer 1 above).** Rationale: first-game feel is more load-bearing for retention at the audience Super Smart is aiming at than architectural transparency as a stated principle. The deception is narrowly scoped — opponent *identity* in Quickmatch fresh-set fill only. The architecture otherwise does not pretend:

- Timestamps on opponent displays remain real-context ("played X minutes ago" — for bots, plausibly seeded; for humans, actual).
- League of 30 remains all-real-player, always.
- Post-game emote library is curated, same for bots and humans, no identity claim.
- Global all-time leaderboard is cumulative across real sessions only — bots never contribute.

This section is kept in the document (rather than deleted) so the reversal is legible to future readers.

### Layer 4: Weekly League of 30 *[DECIDED 2026-04-19 sessions 6–7]*

A Duolingo-inspired weekly competitive league. The league of 30 is a **weekly leaderboard cohort, not a matchmaking pool.** Each week, players are grouped into cohorts of up to 30, strictly by league tier — all 30 members of a given league finished the previous week in the same league tier. League standings are calculated from cumulative scores across all Quickmatch, Challenge-a-Friend, and Daily Race rounds played that week. Promotion/demotion between league tiers is based on final weekly standings.

**Important:** you do not play head-to-head against your league members. Throughout the week, everyone in the league plays their own independent Quickmatch rounds (against **skill-tier-matched ghosts** — see Layer 1) and their own Daily Race rounds (against the global shared set). Your league is the cohort your weekly score is *ranked* against at week-end — it is not the set of opponents you actually race during the week. Skill tier drives *who you play*; league tier determines *whose scores your weekly total is compared to*.

**League tiers:** 8 tiers, named in competition-circuit language — deliberately separate from the 22-name rank ladder. Bottom to top:

1. Rookie
2. Newcomer
3. Regular
4. Veteran
5. Qualifier
6. Finalist
7. Champion
8. Legend

*[Tier names revised 2026-04-24: first-three renamed so new players can enter at tier 2 (Newcomer) with a real demotion destination below them (Rookie). Previously tier 1 was "Newcomer," tier 2 "Regular," tier 3 "Contender."]*

**Entry rule:** all players — first-time and otherwise — start at **tier 2 (Newcomer)**. No seeding from skill tier, no shortcuts. Rookie (tier 1) exists only as a demotion destination — you land there by finishing bottom 5 in a Newcomer league. At launch Rookie starts empty; it populates organically as the first demotions happen. Top 5 promote, bottom 5 demote each week. First Legend is achievable in roughly 6–8 weeks of consistent top-5 finishes from Newcomer. *[DECIDED 2026-04-24]*

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

**No ghost-fill in leagues. No bots in leagues.** Every name on a league board is a real player who played that week. The bot-ghost system introduced for Quickmatch fresh-set fill (Layer 1) is scoped *strictly* to Quickmatch matchmaking — bots never enter a league cohort, never appear on a league leaderboard, never contribute to weekly standings, ever. Leagues are the public-competitive surface; any bot presence here would undermine the whole promotion/demotion narrative. Quickmatch can accept bot-fills because the opponent there is a gameplay device; leagues cannot because the opponents there are a social claim.

**League cohort composition — strict same-tier *[DECIDED 2026-04-19 session 7; clarified 2026-04-24]:***

A league of 30 is composed exclusively of players who finished the previous week in the same league tier. Strict. No ±1 wobble. No cross-tier mixing. If you ended last week as a Qualifier, every other member of your new league this week also ended last week as a Qualifier.

Why strict: the whole promotion/demotion narrative only makes sense if your tier is a persistent badge you're fighting to hold or climb. A Qualifier-last-week getting placed in a Veteran league would be narratively incoherent — they earned Qualifier, not Veteran. Keep tiers clean; let promotion and demotion be the only way they change.

Within a tier, grouping into 30-person cohorts is otherwise arbitrary — whichever eligible players are active at league-open time get grouped together under the formation rules above.

**The ±1 matching rule applies to skill tier, not league tier.** Skill tier (5 brackets, invisible — see Layer 1 Skill tier system) governs Quickmatch ghost matching: when no ghost exists at the player's exact skill tier, the search silently expands to adjacent skill tiers ±1 until a match is found. That is a Quickmatch gameplay rule, not a league rule. League tier plays no role in any matchmaking decision anywhere in the game.

**Tier visibility:** league tiers are never shown to other members of your league. The league board shows names and scores only. You see your own tier on your own avatar border; your league peers' tiers (which are the same as yours anyway, under the strict-same-tier rule) are not publicly labeled. This keeps the social dynamic clean — no tier-shaming, no gaming the system. Your tier is your own business.

**Why the two tier systems don't interact:**
- **Skill tier** (5 brackets, invisible) does one job — ensures each Quickmatch round pairs you with a ghost of comparable per-round skill. Driven by your rolling 10-game average score. Purpose: fair individual races.
- **League tier** (8 brackets, visible on avatar border) does a different job — gives you a persistent badge that reflects cumulative weekly-play achievement over time, earned via promotion/demotion in strict-same-tier leagues. Purpose: long-arc progression narrative.
- A player can have a high skill tier and a low league tier (strong per-round scores, new to weekly play) or the reverse (consistent weekly play, variable per-round scores). The two systems measure different things and both need to be independently legible for the game's competitive design to work.

**Why this works at low player counts:** the transition window seeding and forming queue (see League formation rules above) mean every league opens with real, recently active tier peers. A league of 8 Regulars is a real league — nobody gets force-mixed into a foreign tier just to hit a count threshold. Growth is organic — as the player base grows, each tier's population grows and clusters get fuller without any structural change.

**End-of-league UX *[DECIDED 2026-04-24; full spec locked 2026-04-25 session 17]:***
Hybrid approach. Push notification fires when the league ends. First app open after a league closes triggers a brief interstitial — once only. After that first open, the result lives as a card at the top of the League tab until dismissed.

**Delivery sequence:**
1. **Push notification** fires at league close (Monday). Three distinct payloads by outcome — see copy below.
2. **First-open interstitial** — full-screen takeover on the player's first app open after close. Fires once only; `league_result_seen` flag written on dismiss prevents re-triggering.
3. **League tab result card** — compact card at the top of the League tab, above current-week standings, until the player explicitly dismisses it (swipe or ×). Dismissal is permanent.

**Interstitial anatomy — shared skeleton, differentiated by content and animation weight:**
- Background: Sunburst + Halftone (global treatment, consistent with every screen).
- Layout top to bottom: small `WEEK [N] RESULT` label (secondary, muted) → player avatar at ~2× normal size with tier border visible → tier name in Archivo Black (large) → result line `#[X] of [N] · [score] pts` in JetBrains Mono → headline copy (one line) → subline copy (one line, absent if empty) → **"See Full Standings"** CTA (always present, navigates to League tab standings) → Share button (Promoted state only).
- Dismiss: tap anywhere outside the card or tap ×.

**State 1 — Promoted (top 5) *[DECIDED 2026-04-25 session 17]:***
The screenshot moment. Build for the Flex.

*Visual treatment:* The avatar tier border animates on entry — old border color fades, new tier's color rings in as the reveal. Tier name drops in at ~0.4s delay with weight. For Legend specifically: the animated gold shimmer activates on entry; the interstitial is a living graphic. Share button present on both the interstitial and the League tab result card.

*Share card:* exported image for the share sheet containing the player's avatar with new tier border at full render, new tier name in Archivo Black, player display name, and Super Smart — Quick Trivia wordmark. Cream background, sunburst accent. No score — the flex is the tier, not the number. Unmistakably Super Smart.

*Copy direction:*
- Headline: **`[Tier]. Yours now.`**
- Subline (position-aware): `Top 5 of 30.` / `Top 3 of 30.` / `You finished first.`
- Share card tagline: `[Tier] · Super Smart`

Voice note: "Yours now." does the theatrical work without being breathless. The tier name carries the gravitas — don't compete with it. No "Congratulations," no "You did it," no "Amazing" — all thinner than the tier name by itself.

*Reward:* None beyond the tier border change. The promotion is the reward. No Streak Shield (wrong mechanic — Streak Shield is Daily Race). No cosmetic (locked out at launch). The new border color on their avatar is what they're showing off.

*Push notification copy:* `You're a [New Tier] now. Open Super Smart to see.`

---

**State 2 — Held (positions 6–25) *[DECIDED 2026-04-25 session 17]:***
Honest, dry, not hollow.

*Visual treatment:* Same interstitial skeleton. No animation on the tier border — it doesn't change. Avatar bob-float settles in as normal. No confetti, no ring animation. Background passive. In and out cleanly.

*Copy direction — position-aware within the Held band:*

| Position | Headline | Subline |
|---|---|---|
| 6–10 (just missed) | `[Tier] holds. #[X] of [N].` | `Promotion was top 5. You know what to do.` |
| 11–20 (solid middle) | `[Tier] holds. #[X] of [N].` | `Safe. Comfortable. Maybe too comfortable.` |
| 21–25 (low-middle) | `[Tier] holds. #[X] of [N].` | `Quiet week. Next one's louder.` |

Voice note: sublines do the emotional differentiation without over-explaining. The player at #6 knows they were close — a dry nudge is more motivating than a pep talk. The player at #20 knows they coasted — calling it out with a half-smile is honest, not mean. No "Keep it up!" No "You're so close!" That register is thinner than Super Smart.

*Reward:* Nothing. Being held is the result.

*Share button:* No.

*Push notification copy:* `[Tier] holds. Week [N] results are in.`

---

**State 3 — Demoted (bottom 5) *[DECIDED 2026-04-25 session 17]:***
Quiet. Factual. Doesn't linger.

*Visual treatment:* Same interstitial skeleton. Avatar renders with the new (lower) tier border on entry — no animation reveal, no fanfare, no downward arrows. No red danger colors — the border is simply the lower tier's color (e.g. Regular-green → Newcomer-white), not a warning state. Screen remains recognizably Super Smart; it just doesn't perform sadness at the player.

*Copy direction — stated as fact, not a verdict:*
- Tier label: `[New Tier]` — rendered clearly, matter-of-factly.
- Headline: **`Not this week.`**
- Subline: `The door back up opens Monday.`
- Rookie floor variant (can't go lower): headline `Rookie.` subline `Floor found. Only way is up.`

Voice note: "Not this week." is the key line — short, honest, doesn't say "you lost" and doesn't say "you'll definitely get 'em next time." "The door back up opens Monday" closes it — points forward without being cheerful. The player knows exactly what they're doing next.

*Reward:* None. The result speaks for itself. No Streak Shield (Streak Shield is a Daily Race mechanic; cross-wiring it into league outcomes conflates two independent systems and creates a perverse incentive). No cosmetic (locked at launch). *[Streak Shield consolation considered and closed — CD approved no-reward call 2026-04-25 session 17.]*

*Share button:* No.

*Push notification copy:* `Week [N] results are in.` (No state-specific framing in the notification — the interstitial does that work. No player wants to read "you were demoted" on their lock screen.)

---

**League tab result card — all three states:**
Compact card at top of League tab, above current-week standings. Dismissable (swipe or ×, permanent).

| Element | Content |
|---|---|
| Card header | `WEEK [N] · PROMOTED` / `WEEK [N] · [TIER] HOLDS` / `WEEK [N] · DEMOTED` |
| Avatar | Small, with current (new) tier border |
| Tier | Current tier name |
| Result line | `#[X] of [N] · [score] pts` |
| Share button | Promoted state only |
| Dismiss | × in corner, or swipe. Permanent. |

All three show: final league position, weekly score, tier entering next week. *[Appendix D #26 ✅ RESOLVED 2026-04-25 session 17.]*

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

**Free tier:** All 2,500 launch questions, both game modes, all multiplayer (Echo, Challenge, Leaderboards), all avatar customization. **7 free rounds per day** (locked 2026-04-25 session 15 — was previously a "5–7" range; nailed to 7 to match the `FREE_LIMIT=7` PostHog flag default already in code). No ads, anywhere, ever. *Note: the free bank is static at launch — seasonal packs (post-launch) are Pro-only. See decision log 2026-04-24.*

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

**Mascot (implemented v2 — 2026-04-27 session 27):**
- Brain rendered as an **illustrated PNG body** (`assets/images/brain-base.png`, 1402×1122, transparent bg, maroon outline + glossy white highlights) with **eyes + mouth as an SVG overlay** drawn on top at the PNG's native viewBox (so face landmarks line up cleanly). PNG carries the volume + gyri + outline; the overlay carries only the face — eyes + mouth — because that's what changes by expression and by blink.
- Face overlay coordinates ported verbatim from `explore/shared.jsx`: left eye `cx 335 cy 540 rx 82 ry 100`, right eye `cx 645 cy 540 rx 82 ry 100`, pupils inward by `8 × flip`. Sclera off-white `#FFF6FB` with maroon `#5A0E2A` 11px outline; iris `#1F1430`; upper-lid shadow inside the sclera; large top-right white highlight + small bounce-light; three lash flicks above the lid; soft pink blush below.
- Expression states (overlay-driven): **`smirk`** (asymmetric curve rising on the right, lower-lip shadow, single tooth peeking, dimple dot — used as the home top-left mascot default) and **`hype`** (open laughing cavity in dark maroon, upper teeth row with division lines, pink tongue with center crease — used for the YOU-row leaderboard avatar).
- Wiggle animation: `ssBrainWiggle` 2.4s ease-in-out, `-1.5° → 2°`, transform-origin center bottom. Disabled when `wiggle={false}` (e.g. inside the YOU-row 32pt avatar disc).
- Blink: every 2.8–5.3s, lasts 130ms, swaps eye paths to closed-arc lids.
- Soft drop shadow beneath the brain (rgba(0,0,0,0.22), ~8% high, blurred 2px).
- **Antenna retired everywhere** (this session). The lightning bolt is gone — the brain is now a clean puffy shape with no top decoration. Reason: small avatars need to fit cleanly in tight discs without antenna overflow (the YOU-row avatar disc is 32pt, the brain inside is 1.05× that — there's no room for antenna headroom).
- Sizes used on home: top-left mascot **92pt** (`expression="smirk"`, wiggle on); YOU-row avatar **32pt disc** with brain at 1.05× inside (`expression="hype"`, wiggle off, tier-colored 3px ring).
- **Speech bubble removed from home hero** (this session). Voice/dialect can land elsewhere on more state-relevant surfaces; the brain itself is interesting enough to anchor the top-left without dialogue. SpeechBubble component file not deleted in case it's wanted elsewhere later, but the home usage is gone.
- The brain is also the user's customizable avatar (color/eyes/mouth via the avatar editor). On home, treat it as the user's "self" representation. Avatar editor UI ship date — Appendix D #53.

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

The pink brain stays as the central mascot — same character, second iteration. *(Direction was originally "pink brain with lightning-bolt antenna." Antenna retired 2026-04-27 session 27 across the board — small avatars need to fit cleanly in tight leaderboard discs without antenna overflow. The brain itself is now an illustrated PNG with an SVG face overlay — see Visual direction → Mascot above.)* The wordmark ("SUPER SMART" stacked in chunky red) stays in spirit but gets a modern re-draw. Centuple studio logo is not coming back as studio branding (you've decided) but *may* appear as a top-tier power-up easter egg (see Part 3).

### Name *[DECIDED]*

The name stays: **Super Smart.** App Store collision with "SUPERSMART Party Trivia" is handled in the App Store name + subtitle fields *[DECIDED 2026-04-24]*:

- **App Store name:** `Super Smart — Quick Trivia` (26 chars, fits Apple's 30-char limit). Puts "trivia" and "quick trivia" in the highest-weight ASO field; "Quick" vs "Party" is a meaningful functional distinction from the collision app; claim-free (no "Since 2012" date claim that could draw App Review scrutiny for an app that's been delisted for years).
- **App Store subtitle:** heritage line. Candidate: `Since 2012. Smarter now.` (24 chars). Carries the press narrative without competing for ASO field weight. Final copy tuned in Phase 6 alongside the full store listing pass.

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

No Android-specific blocking issues remain in the current codebase. Android path is preserved and unblocked.

*(Git / sandbox push behaviour moved to its own subsection — see "Git workflow & repo structure" below.)*

### Git workflow & repo structure *[DECIDED 2026-04-24]*

Read this before any session that will touch code. It governs how every commit reaches GitHub.

**Repo scope.** The git repo is `supersmart/` only — the parent folder `/Users/canmert/Desktop/supersmart2026/Super Smart 2026/` is *not* version-controlled. Remote: `https://github.com/theceka777/supersmart.git`, default branch `main`.

**Canonical docs vs. repo mirror.** These files live twice:

| File                                | Canonical (editable)                                                | Repo mirror (for git history)               |
|-------------------------------------|---------------------------------------------------------------------|---------------------------------------------|
| `super_smart_2026_mothership.md`    | `/Super Smart 2026/` (parent folder)                                | `supersmart/docs/`                          |
| `super_smart_2026_primer.md`        | `/Super Smart 2026/`                                                | `supersmart/docs/`                          |
| `CHANGELOG.md`                      | `/Super Smart 2026/`                                                | `supersmart/docs/`                          |
| `1001.xml`                          | `/Super Smart 2026/`                                                | `supersmart/docs/`                          |

The canonical copies at the parent level are for reading/editing in Cowork. The `supersmart/docs/` copies ride along in git history so a fresh checkout contains the design context. **Before every commit that touches any canonical doc, mirror the file into `supersmart/docs/` in the same commit.** Two `cp` commands and a `git add` — keep it routine.

**Sandbox commits, Mac push.** The Cowork sandbox can `git add`, `git commit`, and `git mv` fine. `git push` from the sandbox is blocked by a proxy (HTTP 403 on CONNECT). To publish, the creative director runs one command from the Mac's Terminal:

```
cd "/Users/canmert/Desktop/supersmart2026/Super Smart 2026/supersmart"
git push origin main
```

Claude's part ends at the commit; the push is always a Mac-terminal handoff. Every session that commits should end by telling the creative director the push command in that format, verbatim.

**Commit discipline.**
- One coherent change per commit, even if a session touches many files. Squash only if the work genuinely belongs together.
- Imperative-mood subject line (≤72 chars), then a body listing the concrete changes.
- Reference mothership sections/decisions when the change is driven by a specific recorded decision.
- If a commit turns out to be wrong, amend on the next sandbox turn rather than asking the creative director to re-commit.

**Untracked risk.** The parent-level canonical docs exist only on the Mac. If the Mac dies, the repo still has `supersmart/docs/` copies — but only as of the last mirror. This is fine for now; revisit if the doc-editing cadence outpaces commit cadence.

### Hosting, backend, accounts *[DECIDED 2026-04-18]*

**Backend: Supabase.** Single backend-as-a-service providing Postgres database, serverless functions, storage, and auth-when-needed behind one dashboard. Generous free tier; scales cleanly if the game hits.

**What Supabase handles for this project:**
- Ghost pool storage for Echo multiplayer (question IDs, timings, answers per recorded run)
- Challenge-a-Friend shared question snapshots
- Global leaderboards
- Daily Quiz daily sets and scores
- "While you were away" activity feed data (League tab)

**Why Supabase over alternatives:**
- Real Postgres (not a weird NoSQL thing) — simpler for a one-person project
- One dashboard means one thing to learn
- Beginner-friendly docs and good community
- Not locked to a megacorp that might kill it on a whim
- Claude Code-friendly

Set up in the first multiplayer build session. Total backend cost for v1 scale: ~$0-20/month. Revisit pricing tier at 10k+ DAU.

### Instrumentation & Observability *[DECIDED 2026-04-24]*

The "no ads ever" brand commitment (Part 5) is about what's *shown* inside the app. It does not remove the need for the plumbing that tells us whether the game is actually working: who plays, what converts, what crashes, what retains. This section locks that plumbing.

**Tier 1 — launch-blocking stack.** Three tools, roughly 2–3 days of focused work in Phase 6. Every credible investor or dev-diligence reviewer would expect at minimum D1/D7/D30 retention cohorts, install-to-paying-user conversion, LTV by segment, viral coefficient, and crash-free session rate. These three tools produce all of them with no custom analytics code.

- **PostHog** — product analytics + feature flags + A/B testing in one tool. Free tier covers 1M events/month. Event schema to instrument at minimum: `install`, `first_round_complete`, `round_complete`, `streak_achieved`, `unstoppable_triggered`, `miss_penalty`, `daily_race_complete`, `daily_race_shared`, `quickmatch_complete`, `ghost_won`, `league_standing_viewed`, `one_more_tap`, `pro_wall_viewed`, `pro_purchase_attempted`, `pro_purchase_completed`, `streak_shield_purchased`, `avatar_changed`, `push_opened`. Core funnels: install → first round → round 5 → D1 return → Pro purchase.
- **Sentry** — crash and error reporting. Free tier covers 5k errors/month. Expo has a first-party integration; setup is ~1 hour.
- **RevenueCat** — IAP abstraction + revenue analytics. Free up to $10K monthly tracked revenue. Wraps Apple StoreKit + Google Play Billing behind one SDK, handles receipt validation, refunds, entitlements, family sharing, sandbox vs. prod edge cases. Provides ARPDAU / LTV / churn dashboards automatically. **Non-negotiable** — writing receipt validation by hand is a class of bugs we should never own.

**Push notifications.** Expo Push Notifications (free, already in our stack) covers both the Daily Race retention prompt and the League end-of-week reveal (per Part 3 / Part 4). Graduate to OneSignal or Firebase Cloud Messaging only if Expo's throughput becomes a ceiling — not expected at v1 scale.

**Support channel.** At launch: a dedicated support email (candidate: `support@iamsupersmart.com`) + a Notion issue tracker. Graduate to Intercom / Crisp only if email volume becomes unmanageable.

**Tier 2 — deferred until paid user acquisition is live.**

- **MMP (attribution)** — AppsFlyer / Adjust / Singular. Expensive ($500–$2K/month minimum). Necessary the moment we spend a dollar on paid ads, useless before. **Skip at launch; revisit when the first paid UA experiment is being scoped.**
- **Cheap interim attribution** at organic launch: Apple Search Ads' own reporting + App Store Connect analytics + PostHog's campaign parameters. Good enough until paid UA is real.

**Tier 3 — deferred indefinitely unless we outgrow the simple stack.**

- **Data warehouse** (Snowflake / BigQuery) + pipeline (Fivetran / Hightouch). Only if PostHog's native analysis tools stop being enough.
- **Customer data platform** (Segment). PostHog ingests what we need.
- **Lifecycle marketing platform** (Customer.io / Braze). Push + native platform email cover most of what a trivia game needs.
- **ASO tooling** (AppTweak / Sensor Tower). Most of what they provide is free from App Store Connect.

**Critical clarification — we do not ship ads, display or otherwise.** This section is entirely about *measurement* and *revenue plumbing*. There is no ad-mediation SDK, no ad network integration, no ad-fill-rate optimisation in this codebase. The "no ads ever" decision in Part 5 remains the locked brand position. What a VC or diligence reviewer would call the "ad layer" in a serious consumer-mobile pitch is, for Super Smart, the three Tier 1 tools above — not display ads.

### Flexibility Architecture *[DECIDED 2026-04-24]*

The operating principle: **after launch we should be able to change almost anything without shipping a new App Store build.** Every non-structural decision lives server-side. Every constant that might reasonably need tuning has a remote override. The app binary becomes the shell; content and config become the product.

Two commitments in scope for v1, one explicitly deferred.

**Commitment 1 — All player-visible strings live in Supabase.** No copy that a player reads is hardcoded beyond the bootstrap splash. This extends the `app/content.ts` → Supabase migration (Phase 4) from just questions + emotes + ranks to *everything a player reads*:

- 2,500+ questions, options, tags, kickers *(already specced)*
- 75 emotes across 5 categories *(already specced)*
- 22 rank names and thresholds *(already specced)*
- All "One More" button copy (target: 100+ lines)
- All Pro wall copy (hook, title, features, CTA, escalation lines)
- All onboarding nudges ("Under 2s — speed bonus!" etc.)
- Narrator callouts (common + event-specific)
- Push notification copy
- Help text, empty states, error messages
- All button labels and chip labels beyond the splash
- Legal copy and links

Caching: fetch on launch, cache locally, refresh silently every N minutes. Fallback to last-known-good if offline. **Never block a 60-second round on a network call.** Gameplay continuity beats copy freshness.

**Commitment 2 — Every tunable number is a PostHog flag with a hardcoded fallback.** Every constant that might reasonably get tuned post-launch becomes a remote config value. If PostHog is down or unreachable, the app reads the hardcoded fallback and continues without interruption.

- Free daily round count (default 7)
- One More tap limit (default 3)
- Base points (100), speed bonus amount (+50), speed bonus window (2s)
- Streak ladder thresholds (3/5/7 → 2×/3×/4×)
- Miss penalty amount (−50) and threshold (3 misses)
- 1-second answer UI lock duration
- League cluster size (30)
- Transition-window duration (default 2 hours)
- Daily Race reset time
- Pro price, Streak Shield bundle pricing
- Kill switches: `quickmatch_enabled`, `daily_race_enabled`, `league_enabled`

Anything on this list can additionally be A/B tested by variant via PostHog's built-in feature-flag-as-experiment capability — three Pro wall headlines, two free-round caps, etc. — without writing a single line of experiment infrastructure.

**Commitment 3 (deferred) — EAS Update OTA JS bundle shipping.** Not wired in v1. Means every code or UI change requires an App Store submission. Acceptable trade-off at launch because submissions are infrequent and we'd rather move on the content/config layers first. Revisit post-launch if iteration speed on UI or bug fixes becomes a real blocker.

**Explicitly out of scope at any stage:**

- Server-driven UI (rendering screens from JSON). Overkill for a solo-founder scope; EAS Update — if/when enabled — covers 95% of what this would give us.
- Remote-loading of executable code beyond standard JS bundles (violates App Store rules and isn't needed).

**What stays hardcoded forever, on principle:**

- Navigation structure (Home / League / Profile three-tab layout)
- Core game loop mechanics (60-second round, 3 answer options)
- Mode definitions (Quickmatch + Daily Race as the two modes)
- Brand primitives — Archivo Black + JetBrains Mono typography, Cream Stadium palette. These are brand decisions, not config values. Changing a hex in the palette is a mothership update, not a dashboard tweak.

**Net effect at launch.** Without waiting on App Store review:

- Add questions, tune kicker copy, ship seasonal question packs → Supabase update
- Rename a rank, tweak a Pro wall headline, change push copy → Supabase update
- Tune streak thresholds based on real player data → PostHog flag
- A/B test Pro wall variants → PostHog flag
- Kill a broken mode in prod → kill switch flag
- Change Daily Race reset time → flag

Code bug fixes and UI redesigns still require App Store submission while EAS Update is deferred. That's the conscious trade-off.

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

### Incident response & operational runbook *[ADDED 2026-04-26 session 22e]*

When something breaks in production, the action steps live in **`incident_runbook.md`** at the parent root (mirrored into `supersmart/docs/`). That document is short by design — read it at 2am, no philosophy, action-only. Living document, updated after every incident with a postmortem.

**Six pre-launch scenarios scaffolded:**
1. Whole-app crash spike (Sentry → EAS Update or `app_emergency_disable` flag)
2. Daily Race seed broken / corrupted (Tier 3 recall path)
3. Quickmatch ghost matchmaking down (`quickmatch_disabled` flag)
4. Pro purchase / IAP failing (RevenueCat dashboard, manual `pro_entitlements` grant)
5. Offensive / wrong question goes live (Tier 3 question recall, mothership Part 8)
6. Supabase / database outage (`app_emergency_disable` + wait)

**Five canonical kill-switch flags (PostHog, with hardcoded fallbacks per Flexibility Architecture):**
- `app_emergency_disable` — whole-app maintenance screen (nuclear option).
- `daily_race_disabled` — hides Daily Race card; in-flight rounds finish.
- `quickmatch_disabled` — hides Quickmatch card.
- `pro_purchase_disabled` — Pro Wall hides "buy" button, shows "back soon" copy.
- `live_question_emergency_recall_<question_id>` — pulls a single question from active sets (Tier 3 recall, Part 8).

**Player-facing maintenance copy** lives in the Supabase `ui_strings` table (Flexibility Architecture, edited via row update — no deploy). Voice-locked 2026-04-26 session 22e: maintenance title `"we'll be right back"`, body `"we're patching things up. give us a sec."`, Daily Race disabled card `"today's race is taking a nap. fresh one tomorrow at 6am."`, Pro purchase disabled `"payments are temporarily down. nothing's wrong with your account."`, goodwill email subject `"we owe you one"`.

**Pre-launch action item:** run the chaos drill (flip a non-critical flag, verify, flip back) once before launch to build muscle memory. Half-day total to set up the full kit (PostHog flags wired, kill-switch screen built, EAS Update enabled, Sentry alerts to phone, runbook reviewed, drill executed). Post-launch the runbook grows organically through postmortems filed at `supersmart/docs/postmortems/<YYYY-MM-DD>-<slug>.md`.

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
- ⏳ Audit all 1001 questions from the XML: Keep / Light edit / Heavy edit / Retire. **Through Q300 (sessions 13–14, 16):** cumulative 261 Keep / 39 Light / 0 Heavy / 0 Retire across batches 1+2+3 (Q1–Q100 all science 81/19; Q101–Q200 last-20-science + first-80-misc 90/10; Q201–Q300 all misc 90/10) — 87% Keep running. **701 questions to go.** Methodology + per-batch tally tracked in `audit_1001/audit_1001_methodology.md` at parent folder.
- Write a formal style guide for new questions based on the audit (voice rules, character limits, humor technique catalog, pop-culture policy). *Kickers removed from scope — retired per 2026-04-18 session 2 decision.*
- Decide on pop-culture cutoff strategy
- Resolve remaining "Important but flexible" open questions (Appendix D items 6-14) as they become relevant
**Exit criteria:** All 1001 questions tagged. Style guide v1 done. Voice feels locked.

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
- Onboarding: spec decided (see Part 3) — wordmark splash → first-time home screen → Sign in with Apple/Google → first Quickmatch round (bot-ghost opponent, typically winnable via 300–3,000 bot score range) with two contextual nudges
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
- "While you were away" activity feed screen (League tab)
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
- **Instrumentation & Observability Tier 1 stack wired** (per Part 7, new subsection): PostHog events + funnels + feature flags, Sentry crash reporting, RevenueCat wrapping all IAP flows, Expo Push for League / Daily Race notifications. ~2–3 focused days.
- Submit to Apple review
**Exit criteria:** Submitted to Apple. Press kit done. Launch campaign drafted. Tier 1 instrumentation live and producing retention + conversion dashboards.

### Phase 7 — Launch *(roughly weeks 18-20 — target: first half of August 2026)*
- Public release (target window: **August 1–15, 2026**)
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
| 2026-04-24 | Onboarding spec locked: wordmark splash → first-time home screen (League/Profile tabs greyed) → Sign in with Apple/Google on first game tap (name pulled from platform, no manual entry) → ghost-free first round with two contextual nudges (speed bonus, streak). Anonymous session fallback for players who decline sign-in. Display name changeable in Profile with 30-day cooldown. | No tutorial screens — onboarding is playing the game. Two nudges teach the two non-obvious mechanics (speed bonus, streak multiplier) in context. Platform sign-in removes all friction from identity setup. **[Superseded later 2026-04-24 by the bot-ghost system: first round is now a standard Quickmatch round with a bot-ghost opponent, not ghost-free. The bot's 300–3,000 score range preserves the "first game is winnable" intent this entry was trying to deliver.]** |
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
| 2026-04-24 | Git workflow formalised. Repo = `supersmart/` only; parent-folder docs are canonical and mirrored into `supersmart/docs/` for git history. Claude commits from sandbox; push is always a Mac-terminal handoff (`git push origin main` from the supersmart folder) because the sandbox proxy blocks outbound push. Every session ending in a commit tells the creative director the exact push command. | Previously the push-restriction note lived as a single bullet inside Part 7's Android section, which is the wrong home for it and let the workflow drift across sessions. Formalising the mirror-before-commit rule and the Mac-push handoff prevents lost doc updates and makes future sessions self-sufficient. |
| 2026-04-24 | Daily Race share format split from end-screen visual. The 🟩🟥 grid stays on-screen as a reflective moment; the off-app share becomes a 3-line scoreboard (date / ⚡ pts + rank / 🔥 best streak). Previous spec (`"Super Smart Daily — 41/60 · 4,850 pts\n[grid]"`) is superseded. | Real-device review surfaced that the 60-square grid fails the three things that make Wordle's grid viral: (1) it's too long for a single chat bubble — 60 squares wrap to 4–5 lines of noise; (2) grid length varies across players because answered-question counts vary (fast 45, slow 28), so direct visual comparison breaks; (3) a pass/fail sequence has no narrative arc the way Wordle's problem-solving path does. The 3-line scoreboard is fixed-shape across all players, pastes cleanly, and uses the peak streak as a natural-language brag line. The grid is still valuable in-app as a reflective "here's how it went" beat. |
| 2026-04-24 | Instrumentation & Observability Tier 1 stack locked: PostHog (analytics + feature flags + A/B) + Sentry (crash) + RevenueCat (IAP). Expo Push for notifications. All three ship in Phase 6 — roughly 2–3 days of work. MMP (AppsFlyer / Adjust / Singular) explicitly deferred until paid UA is live; data warehouse, CDP, lifecycle marketing, ASO tooling deferred indefinitely. "No ads ever" brand commitment from Part 5 is untouched — this is measurement and revenue plumbing, not ad display. | Gap identified during session 8 pressure-test: mothership had framework (Part 7) and monetisation (Part 5) but no definition of how we'd measure whether the game is actually working. Any credible investor or dev-diligence review expects at minimum D1/D7/D30 retention, install→paying-user conversion, LTV by segment, viral coefficient, and crash-free session rate — none of which exist without instrumentation. RevenueCat specifically is non-negotiable because hand-rolled StoreKit receipt validation is a known trap. Tier 1 choices are all generous-free-tier + swappable later if any individual tool underperforms. |
| 2026-04-24 | Flexibility Architecture locked in Part 7. Two commitments in scope: (1) all player-visible strings live in Supabase — extending the `app/content.ts` migration from just questions + emotes + ranks to every piece of copy a player reads; (2) every tunable game constant lives behind a PostHog flag with a hardcoded fallback. EAS Update OTA JS bundle shipping is explicitly deferred until post-launch. Server-driven UI is out of scope at any stage. Navigation structure, core game loop, mode definitions, and brand primitives (type + palette) stay hardcoded on principle. | Without this principle we can only change questions + emotes + ranks server-side and everything else requires an App Store submission. Locking the full content + config pipeline now (one-time extension of the Supabase migration plus setting up PostHog flag reads) pays compounding dividends post-launch: ship seasonal packs, tune balance from real data, A/B test Pro wall copy, kill-switch a broken mode — all without waiting on App Store review. EAS Update deferred because it's the only layer that adds real implementation work to the app binary; the other two layers are already partially wired. |
| 2026-04-24 | Framework choice reconsidered (React Native vs Flutter) and held at React Native + Expo. External suggestion prompted the review — the generic "Flutter is more unified cross-platform" argument and "iOS/Android UI inconsistencies in RN" concerns. | Cost: 4–6 weeks of focused rewrite (6–10 weeks calendar at 6–8 hrs/week bandwidth) to reach current parity; no reason to take that on. Benefit: marginal. The unified-rendering advantage Flutter has is strongest for apps that lean on system widgets; Super Smart already renders every brand-defining surface (mascot, wordmark, sunburst, halftone, tab bar, cards, answer buttons) custom. Platform differences that remain on RN are narrow (typography hinting nuance, system gestures, haptics) and addressable via `Platform.OS` patches — the same pattern we already used successfully for SF Symbols → MaterialIcons and `overflow: hidden` on Animated.View. Framework choice will only be reopened if a specific technical wall appears that RN can't address. |
| 2026-04-24 | **Coffee decision 1 — Daily Race + League reset clock: 6am ET, ET-anchored.** `America/New_York, 06:00` as the canonical reset; underlying UTC auto-shifts 10:00 ↔ 11:00 with US DST. Supabase cron configured in the ET timezone. Stored behind `daily_race_reset_time` PostHog flag. Once-per-day lock must be built on the reset window (not a rigid 24-hour timer) to handle DST 23/25-hour weeks. Resolves Appendix D #7 and the anchor half of #19. | US-focused bet per creative director — game's short-form trivia DNA + press angle leaning on 2012 US top-10 ranking both point to NA as the likely early-audience cluster. 6am ET is the "everyone in continental US wakes to a fresh race" window: NYC gets it on morning commute, LA wakes at 7am PT to a board that's only been live 1 hour. Heritage-of-choice was Fortnite's 00:00 UTC for daily challenges and Destiny 2's 17:00 UTC weekly — the choice encodes geographic priority, and NA-first was the deliberate call. ET-anchored over fixed-UTC because the user-experience promise is "6am ET morning race" — that phrase needs to be true in July and in January, which requires auto-DST. |
| 2026-04-24 | **Coffee decision 2 — Leaderboard tie-breakers: 4-layer cascade.** `score DESC → peak_streak DESC → questions_answered ASC → submitted_at ASC`. Applies uniformly across all boards: Daily Race, League of 30, Quickmatch ghost races, Global all-time. Per-round boards use session-level fields; Global all-time uses aggregates (`SUM(score)`, `MAX(peak_streak)`, `SUM(questions_answered)`, `MAX(submitted_at)`). Resolves Appendix D #20. | The game is explicitly about speed and accuracy — the tiebreaker cascade should extend those values rather than fall back to clock timestamp first. Peak streak is already on the Daily Race share card (🔥 best streak · 7), so making it the primary tiebreaker ties ranking to the metric players already see and brag about. "Fewest questions answered" rewards efficiency (higher streak hits + more speed bonuses within the same score = a tighter round). No strategic-stop exploit exists because stopping can't raise your score — the only way a "fewer questions" edge is achievable is via genuinely better play. Timestamp fallback handles the stalemate case. Zero new schema — all four fields already in session record. One unified rule across all boards keeps documentation and implementation simple. |
| 2026-04-24 | **Coffee decision 3 — Seasonal packs clarification: Free = static 2,500 launch bank; Pro = 2,500 + ongoing seasonal packs.** Pro spec in Part 5 stays as written. Free bank locks at launch-day count. Seasonal packs (4–6/year, post-launch per item #44 deferral) are Pro-only content drip. Free tier copy updated from "All 2500+ questions" to "All 2,500 launch questions." Resolves Appendix D #29. | Resolves the quiet contradiction between Part 5's Free spec ("All 2500+ questions") and Pro spec ("Access to seasonal packs"). Alternatives considered: (B) everyone gets seasonal, Pro gets early access — rejected because it doubles the release-management burden on every pack; (C) drop seasonal from Pro — rejected because seasonal drip is one of the most tangible "what do I get for $4.99?" answers. Option A is the simplest structure and what the Pro spec already implied; the Free rewrite is one line. Nothing ships seasonal at v1 launch anyway, so this is really about what's promised on the Pro pitch page. |
| 2026-04-24 | **Coffee decision 4 — Localization: English-only at launch, i18n-ready schema.** Stated explicitly in Part 5 and Appendix D. No localization ships in v1. **Architectural hedge:** Supabase content schema includes a `locale` column on every player-visible content row (questions, options, emotes, ranks, One More copy, onboarding nudges, narrator callouts, push copy, legal, all UI strings) with `'en'` as the launch default. One column + one index, costs ~30 minutes of schema design now. Future localization becomes "add rows, flip a flag" rather than a schema migration. Resolves Appendix D #46. | English-only is forced by the voice work: 1001.xml humor lives in wordplay that requires rewriting per language by someone who owns the voice in that language (not a translation job). Character-limit discipline breaks in longer languages (German ~30% longer, French ~20%). Multi-language multiplayer matching would split the Quickmatch and League of 30 pools, degrading matchmaking everywhere. Creative director bandwidth (6–8 hrs/week) can't run parallel voice tracks. The `locale` hedge costs almost nothing and matches the Part 7 Flexibility Architecture principle — small structural investment now to avoid a migration later, even if never used. |
| 2026-04-24 | **Bot-ghost system locked for Quickmatch fresh-set fill.** When a player is matched to a question set with no human ghost at their skill tier, the match is filled with a bot ghost — single-use, generated by the matchmaking Edge Function, indistinguishable from a human ghost in the UI, discarded after the round (never persisted in `ghost_pool`). Graduation rule: once any human plays a set at a tier, subsequent plays at that tier match to the human, not a bot — bot presence fades automatically as the pool populates. Score range **300–3,000** (most new players will win their first games — intentional confidence build). Names follow **no single pattern** (mixed generation strategies — adjective+noun, firstname+number, curated handles — to prevent pattern detection). Avatar randomly generated from the **full library including Pro-locked items** (soft exposure to purchasable cosmetics). Post-game emote randomly drawn from the full 75-emote library. Timestamp seeded plausibly recent. **Bots never enter Leagues of 30** under any circumstance — Quickmatch-only, always. Reverses 2026-04-18 session 3 ("'you're first' messaging instead of bots") and 2026-04-19 session 5 ("'fresh game' messaging"). Retires the Honesty Layer section of Part 4. | First-game feel is more load-bearing for mobile retention than the architectural-transparency principle previously stated. "You're first, seed the pool" is defensible brand voice but still a fundamentally absence-of-opponent moment, which defeats the point of an async-multiplayer architecture designed to feel populated from day one. Every established async-multiplayer game at scale — Words With Friends, Clash Royale, Geoguessr — uses bot-fills for this exact reason, and the convention is well-understood by players. Bot play stays within normal human score ranges (300–3,000); the deception is narrowly scoped to opponent identity in Quickmatch fresh-set fill only; every other surface remains honest (league boards all-real-player, global all-time only counts real sessions, timestamps still real-context, post-game emote library curated for everyone). The trade-off was explicit and deliberate: architectural purity for warm first-play feel. The Pro-cosmetic-on-bots choice doubles as passive marketing without being aggressive — players see Pro items in gameplay, not just on a paywall. |
| 2026-04-24 | **Phase 4 Supabase schema draft landed at `supabase/phase4_schema.sql`.** 11 new tables (`players`, `push_tokens`, `pro_entitlements`, `question_sets`, `ghost_pool`, `challenges`, `daily_races`, `sessions`, `leagues`, `league_memberships`, `streak_shields`) plus `locale` column extension on the existing `questions`/`emotes`/`ranks` tables. Bakes in today's locked decisions: tie-breaker cascade fields on `sessions` with matching composite index; 6am ET reset via DST-safe `timestamptz`; strict same-tier `leagues.tier`; independent `players.skill_tier` and `players.current_league_tier`; `locale` column everywhere player-visible. Two triggers: pro status sync from `pro_entitlements` to `players.pro`; league `weekly_score` auto-increment on session insert. Seven `[OPEN]` items flagged inline for future passes (auth wiring, RLS policy depth, anti-cheat validator, season-start league rule, answer-sequence storage cost, challenge code format, streak shield 48h detection). Original `supabase/schema.sql` (emotes, ranks, questions from 2026-04-19) kept untouched — the new file is a safe draft for review, to be merged when Phase 4 build starts. | Resolves the non-gap-filler half of Appendix D #5 — table shapes are now concrete rather than conceptual. The 7 open items are genuinely unresolved (not lazy drafting): auth library (#1) must resolve before RLS gets its real pass; anti-cheat (#6) needs Edge Function work; the storage-cost concern on `answer_sequence` is the Phase 4 stress test item (#24). Ghost pool is designed as human-only — bot ghosts from the new bot-fill system (see row above) do not persist here. Edge Functions are a separate workstream, scoped inline in the schema file: session validator, weekly league close/open, daily race seeding, ghost pool retirement, Pro weekly Streak Shield grant, skill tier recalc, RevenueCat webhook receiver, push notification dispatch. Probably one session per function. |
| 2026-04-24 | **No-replay rule made explicit; shortage fallback is the bot-ghost system (not on-demand generation or silent replay).** Quickmatch guarantee from 2026-04-18 session 3 ("no player sees the same question set twice, challenge links excepted") is reaffirmed and made implementable: matchmaking Edge Function filters out any set this player has recorded in `sessions` with `source='quickmatch'`. Partial index `idx_sessions_player_quickmatch_sets` on `sessions(player_id, question_set_id) where source='quickmatch'` keeps the filter fast at any session count. Earlier candidates for the shortage case (silent replay of least-recently-played; on-demand generation of brand new sets with a three-strike circuit breaker) both considered and rejected in favour of the bot-ghost fill — it's cleaner, preserves the no-replay guarantee absolutely, and folds the edge case into the general-case solution instead of needing its own fallback tier. | The silent-replay option broke the "no-replay" guarantee and was therefore incompatible with an absolute rule. The on-demand-generation option risked a degenerate "fresh games for hours" UX where a power user never races any ghost at all. Bot-fill solves both: every Quickmatch always has an opponent, unseen sets only, no special-case UX. The no-replay rule is now a single clean sentence with one mechanical implementation, not a three-tier fallback tree. |
| 2026-04-24 | **League cohort composition clarified to strict same-tier; ±1 matching rule confirmed as skill-tier-only.** Revises the 2026-04-19 session 7 language ("weighted random biased toward same league tier ±1"), which conflated the two tier systems. New text in Part 4 Layer 4: (1) a league of 30 is a **leaderboard cohort, not a matchmaking pool** — 30 players who all finished last week in the same league tier, grouped arbitrarily within that tier, compared at week-end by weekly cumulative score; (2) league members don't play head-to-head — each plays their own Quickmatch (against skill-tier-matched ghosts), Challenge-a-Friend, and Daily Race rounds independently; (3) the ±1 expansion rule belongs to skill tier (Layer 1 Quickmatch ghost matching) only, never league tier; (4) skill tier and league tier don't interact — skill tier is "who you play," league tier is "whose scores your weekly total ranks against." Appendix C glossary updated with distinct **League of 30**, **League tier**, **Skill tier** entries (removed a duplicate short Skill tier definition). Also: Challenge-a-Friend scores now explicitly count toward League weekly totals (previously ambiguous). | Session 7's original framing read as if league clusters could draw from adjacent league tiers, which would break the whole progression narrative — a Qualifier-last-week getting placed in a Veteran league this week makes no sense; the tier is supposed to be the persistent badge you're fighting to hold or climb. Pressure-tested during a readback with the creative director and corrected: strict same-tier for league composition, independent skill-tier-only ±1 for Quickmatch ghost matching. The two systems measure different things (per-round skill vs cumulative weekly achievement) and serve different jobs (matchmaking vs progression narrative); both need to be independently legible. No code or schema changes required — all current implementation references either skill tier (correctly) or league tier (as a label), and no ±1 cross-league-tier logic was ever built. |
| 2026-04-24 | **Coffee decision 5 — App Store name + subtitle split: `Super Smart — Quick Trivia` as app name; heritage line as subtitle.** App Store name: `Super Smart — Quick Trivia` (26 chars). App Store subtitle: heritage line, candidate `Since 2012. Smarter now.` (24 chars) — final copy tuned in Phase 6 alongside the full store listing pass. Resolves Appendix D #37. | Reversal of mid-session recommendation. Initial rec was heritage in the name ("Super Smart — Since 2012") + keywords in the subtitle, on distinctiveness grounds. Pressure-tested and flipped: the app-name field is the highest-weight ASO field in Apple's algorithm, so putting "trivia"/"quick trivia" in the name has concrete discoverability value for a solo-founder launch with no paid UA budget. "Quick" vs "Party" is a genuine functional distinction from the collision app ("SUPERSMART Party Trivia"). "Since 2012" carries App Review scrutiny risk for an app that's been delisted for years — "Quick Trivia" is claim-free. Heritage narrative isn't lost; it moves to the subtitle, where curious readers find it, and still anchors the press-angle. Discoverability > distinctiveness when the game's survival depends on organic search visibility. |
| 2026-04-24 | **Mini-decision 1 — League tiers 1–3 renamed; entry point moves from tier 1 to tier 2.** Old ladder `Newcomer → Regular → Contender → Veteran → Qualifier → Finalist → Champion → Legend` becomes **`Rookie → Newcomer → Regular → Veteran → Qualifier → Finalist → Champion → Legend`**. All first-time players (and forward-looking, all league entrants) start at **tier 2 (Newcomer)**. Rookie (tier 1) exists only as a demotion destination. Avatar border colour progression shifts by one slot: Rookie → grey, Newcomer → white, Regular → green (tiers 4–8 unchanged). Top 5 promote / bottom 5 demote rule unchanged. First Legend achievable in ~6–8 weeks from cold start. | Original layout made tier 1 both "starting point" and "rock bottom" simultaneously, which is bad progression shape — a player demoting out of the entry tier had nowhere to fall, so the demotion was toothless. Giving Newcomer a real downward destination (Rookie) makes the promotion/demotion dynamic land properly at the bottom of the ladder. "Rookie" fits the competition-circuit register of tiers 4–8 (Veteran, Qualifier, Finalist, Champion, Legend) — sports-draft lineage, neutral-to-cool tone, not shame-coded. At launch Rookie tier is empty and populates organically as the first Newcomer demotions happen, which is fine — the forming-queue + transition-window machinery already handles low-population tiers. No code changes required (league tier system isn't wired yet — Phase 4). |
| 2026-04-24 | **Mini-decision 2 — Wordmark splash: 2 seconds, every cold-start launch (not onboarding-only).** App launch → 2-second splash screen showing the animated wordmark on cream/sunburst background. Water-balloon bloat fires at t=0 as the welcoming pop (animation takes ~1.2s); settles through the remaining window before fading to home. No copy, no buttons. Resolves Appendix D #13 and simultaneously expands the splash's scope from first-time-only to every-cold-start. | 2 seconds is the balance between "snappy launch" (Apple guidance ~1.5–2s) and "brand moment that does something" (Super Smart is anti-minimalist, Build-for-the-Flex). Firing the bloat at t=0 rather than idling through bob/sway means the player's first frames each session contain the signature brand animation — the inverse of a passive splash. Every-launch was chosen over first-time-only because the splash functions as a brand ritual, like Duolingo's owl appearing before the lesson list; repeated exposure reinforces identity without costing the user more than 2 seconds. Section labelling in Part 3 notes that only step 1 of onboarding is universal; steps 2–5 still fire on first open only. |
| 2026-04-24 | **Mini-decision 3 — Emoji policy: none in question corpus, allowed in display names.** Three sub-rules: (A) **Questions, options, distractors: no emoji ever** — text-only corpus discipline preserves voice and character budget; (B) **Scraped display names from Apple/Google sign-in: allow as-is** with moderation pipeline (#36) filtering inappropriate glyphs; (C) **Player-edited display names: same rule as scraped** — consistency. Emotes, One More copy, narrator callouts, and other voice copy are not affected (writer's judgment at content time, as before). Resolves Appendix D #28. | The 1001 is emoji-free and the original voice's premium comes from wordplay density per second — emoji in questions would move the voice toward generic social-media register and consume visual space inside the already-tight 40-char / 15-char limits. Display names are a different class: they're player self-expression, already come with emoji from other platforms, and the moderation pipeline is the right tool for abuse cases (not a blanket ban). The split preserves brand texture where it matters (content) and respects player identity where it doesn't threaten it (names). |
| 2026-04-24 | **Mini-decision 4 — Support email domain: DEFERRED; fallback candidate chosen.** Primary remains `support@iamsupersmart.com` (heritage-aligned with the "Since 2012" App Store subtitle). Fallback: **`support@supersmart.game`** (~$20/year .game TLD — short, memorable, category-aligned) if the original domain is unrecoverable. **Action item:** confirm `iamsupersmart.com` registration status on the Mac side, renew if needed, register fallback if lost. Final lock follows that outcome. Appendix D #40 status: partial / deferred. | Can't lock definitively without knowing whether the original domain is still registered — that's a registrar-login check that the creative director will do between sessions. Recording the fallback now (rather than re-debating it later) means the follow-up is purely mechanical: check status → use primary if available, fallback if not. No need for a full decision session on this once the check completes. |
| 2026-04-24 | **Mini-decision 5 — Question retirement / correction: three-tier severity system; "Contact the developer" email in Profile replaces any in-app report button.** Three severity tiers: **Edit in place** (typo/minor — update Supabase row, ID stable, historical scores unchanged); **Soft retire** (wrong/sensitive — `active=false`, future sets skip it, in-flight sets keep it to preserve equal-ground); **Emergency recall** (offensive/legally problematic — `active=false` + invalidate containing question sets + cancel today's Daily Race with re-seed + goodwill compensation). **Principle: historical session data is never retroactively edited** — past scores stand. Audit trail required (who/when/why). **No in-app "report this question" button** — all player feedback flows through a single "Contact the developer" email link in Profile pointing to the support address, keeping play surfaces clean and framing feedback as human correspondence rather than moderation. Resolves Appendix D #25. | Three tiers cover the realistic range: Tier 1 handles the ~weekly typo/fix pattern without UX cost; Tier 2 is the ~monthly quiet retirement; Tier 3 is the ~0–3/year nuclear option for real emergencies. Not editing historical scores is a trust principle — "did they retroactively adjust my score?" is the kind of question we don't want players asking. Rejecting the in-app report button is a deliberate voice call: reports on the play surface turn every wrong answer into "is the game or me at fault?" friction, which undermines the playful brand. Single email channel keeps feedback volume manageable for a solo founder and framed as conversation, and it pairs with the single-source-of-truth principle for all external player ↔ developer communication. |
| 2026-04-24 (session 13) | **Phase 1 audit kickoff — first 100 of `1001.xml` tagged, reviewed across two creative-director passes, methodology doc + future-session playbook written.** Deliverables in `audit_1001/` at parent folder (mirrored into `supersmart/docs/audit_1001/`): `audit_1001_tags.csv` (append-ready per-question table with `q_num, category, text, option1–3, answer, q_chars, a_chars, tag, note`) and `audit_1001_methodology.md` (tag definitions, voice/durability/char-discipline tests, 13 edge-case rulings, review-before-commit protocol, per-category calibration table, running corpus tally, "How to run the next batch" playbook). **Final locked split: 81 Keep / 19 Light edit / 0 Heavy edit / 0 Retire.** The path to that number: (pass 0) Claude initial draft 79/21/0/0 → (pass 1) CD reviewed per-question, reversed 7 flags (Q6 "closest to earth" — Moon isn't in options so ambiguity doesn't bite; Q19 "jumangy" — IP-protective misspelling of *Jumanji*, preserved; Q38 "J. R. Oppenheimer" at 17 chars — accepted, will render; Q47 Industrial Revolution — stays in science; Q55 "T. Duwde", Q61 "F. Cent" — both stay), moving split to 86/14/0/0 → (pass 2) Claude second-pass sanity check found 4 missed items (Q73 typo "nucleid"→"nucleic"; Q9 grammar "farther"→"farthest"; Q68 phrasing tightness; Q95 grammar parallel to Q9), taking split to 82/18/0/0 → (final revision) Q11 reframed from Keep to Light edit with CD-approved tautology: prompt changes to "the June solstice occurs in ___" (mirrors Q12 structure in a different pattern), landing at **81/19/0/0**. The 19 Light edits are all narrow fixes: 5 source-XML typos (Celcius, miliseconds, tegulates, Mendelev, nucleid), 4 factual nits (ISU→SI, R.D.→W.C. Röntgen, "degrees Kelvin"→"Kelvin", shuttle→craft for Apollo), 2 grammar fixes (Q9/Q95 comparative→superlative), 3 phrasing/prompt trims (Q10/Q13 char ceiling, Q68 tightness), 2 hemisphere reframes (Q11 "June solstice" tautology, Q12 "Northern Hemisphere"), 1 "large galaxy" qualifier, 1 distractor swap (ukrainium→unobtainium), 1 recategorization (Q63 ships → misc with rogue-capital cleanup). First 100 are 100% science — the most durable category. **Do not project 81/19/0/0 onto the full 1001**; corpus-wide 700/150/100/50 from Part 8 remains the working estimate with misc/music/movies/people carrying most of the Heavy+Retire load. | Three new methodology rulings captured: (11) trademark-evocative misspellings are features not bugs — keep near-spellings that evoke protected names without infringing; (12) hemisphere disambiguation has two acceptable patterns — explicit "Northern Hemisphere" qualifier or hemisphere-neutral astronomical term with month in the name (both ship, pick per question); (13) tautology is acceptable when CD says so — some easy/tautological pacers are legitimate 60-second-round rhythm. **Review-before-commit protocol** added to the methodology after Claude committed the first batch without explicit approval — now binds all creative-editorial work (audit tags, question drafts, voice copy); technical/infrastructure edits (status bumps, doc cleanup, code changes) don't require the gate. A **future-session playbook** embedded in the methodology doc so any fresh Claude session can pick up Q101+ and tag it consistently: orient → tag → present for review → apply verdicts → second-pass sanity check → lock + document. Per-category calibration table added: science/math/literature expected high-Keep (80%+); people/music/movies/misc expected to run 40–60% Keep with Heavy+Retire concentrated there. Running corpus tally table added to methodology doc; updated per-batch going forward. Two CD review passes produced 33% flag reversal rate on pass 1 and 4 net-new items on pass 2 — load-bearing for quality, argues for always running both passes before committing a batch. Creative director is final editor; tautology/easy-question tolerance is their call; methodology doc captures the why for future reference. |
| 2026-04-25 (session 22b) | **Final-check fresh-eyes sweep across the full 1001-question corpus — 5 more Lights landed.** While the previous batch 6 commit was being pushed, CD requested one last comprehensive sweep for outdated references and factually-shifted data. The five catches: **Q71** dinosaur extinction "65 million" → "66 million" (current K-Pg consensus is 66.0 ± 0.05 Mya — minor scientific currency update). **Q321** "German automobile manufacturer" answer Smart → BMW with distractors Buick/Pontiac → Ford/Toyota (Smart is now Mercedes+Geely JV as of 2019, less anchor-clean; BMW is the canonical brand-permanent German automaker). **Q594** "Woody Allen wrote and directed ___" → "Christopher Nolan wrote and directed ___" answer Annie Hall → Inception, distractors Antz/Animal House → Pulp Fiction/Goodfellas (Allen's reputation post-1992 Mia Farrow scandal and 2014 Dylan Farrow allegations carries baggage in 2026; Nolan is the cleaner contemporary auteur anchor; Inception is brand-permanent solo-Nolan; cultural drift per ruling #16). **Q875** "population is less than 33 million" → "less than 40 million" (Texas at ~30.5M growing ~500K/year would have crossed 33M ~2032 during the game's 10-year lifespan; 40M threshold safe through 2040+; ruling #14 time-bound). **Q932** rewrite "the smaller city by population" Norway/Spain/Italy → "the larger country by population" Japan/Germany/France with Japan correct (resolves the prior city/options mismatch and avoids duplicate with Q884 which already covers smaller country with that option set). **Final corpus tally adjusted from 907/94/0/0 → 903/98/0/0** = 90.2% Keep, 9.8% Light, still zero Heavy or Retire. Per-batch updated: batch 1 81/19 → 80/20 (Q71); batch 4 90/10 → 89/11 (Q321); batch 5 278/22 → 277/23 (Q594); batch 6 278/23 → 277/24 (Q875, Q932 note update). | The final-check pass exists because of how speed mode worked: each batch got two-pass review individually but the corpus had never been viewed as a single 1001-question whole. The fresh-eyes whole-corpus sweep caught 5 candidates that fell between batches: a scientific update from a 2012 textbook (dinosaurs), a cultural reputation drift on a director (Allen) that batch-by-batch review didn't surface explicitly, a brand-currency drift on a German automaker (Smart→BMW), a population-threshold drift on US state demographics (Texas), and a duplicate-avoidance opportunity (Q932 rewrite). **Pattern documented for future audit work**: even after batch-level two-pass discipline + cross-cultural sweep, do one final whole-corpus sweep with the question "if a fresh reader saw all 1001 questions in sequence, what would feel dated or off?" The final-check is a high-leverage half-hour on top of weeks of work. |
| 2026-04-25 (session 22) | **PHASE 1 AUDIT COMPLETE — final batch 6 closed (Q701–Q1001).** Final batch 6 split: **278 Keep / 23 Light / 0 Heavy / 0 Retire** = 92.4% Keep across 301 questions. **Cumulative across the full 1001-question corpus: 907 / 94 / 0 / 0 = 90.6% Keep, 9.4% Light, 0% Heavy, 0% Retire.** Six audit batches across five working sessions (13: Q1–100; 14: Q101–200; 16: Q201–300; 19: Q301–400; 21: Q401–700 mega-batch; 22: Q701–1001 final mega-batch). **Zero Heavy or Retire flags across all 1001 questions** — the original Part 8 projection of 700/150/100/50 was off by an order of magnitude on Heavy/Retire. Per-category final Keep rates: math 100% (the cleanest category — pure math has no cultural drift, no fact change, no typos), science 81%, misc 89%, word 92%, music 86%, movies 90%, geography 92%, people 82%, literature 90%. **Notable batch 6 fixes:** Q868 equator-passes-through-Argentina was a factual error (equator does not touch Argentina — concept-replaced to Brazil with cleaner distractor logic). Q924 Sears Tower → Willis Tower (ruling #14 already-effected change — building renamed 2009). Q935 Mount Everest "located in China" → "in the Himalayas mountain range" with answer Himalayas + distractors Rocky / Alps (sidesteps the disputed China-Nepal summit and broadens to the durable mountain-range answer). Q979 "French goalkeeper Fabien Barthez" → "famous French footballer K. Mbappé" with foreign-superstar distractors C. Ronaldo / L. Messi (contemporary anchor refreshing the corpus's footballer roster). Q968 distractor "Bradley Manning" → "Bradley Cooper" (Chelsea Manning came out as transgender in 2013; deadname fix, ruling #16). Q783 Ukrainian-flag-color-question → Peru flag (avoid third Ukraine-flag question; Q799 still covers Ukraine). Q988 source-XML broken puzzle: option1 "Pluto" → "Plato" (student of Socrates is the philosopher, not the Roman god; Q989 confirms — "student of Plato" → Aristotle). Q987 Latin spelling "Vini, vidi, vici" → "Veni, vidi, vici". Plus 11 routine source-XML typos (Ukranian, Russua, Valetta, Phillipines, Swizterland, Kirku, Gaugin, Fraizer, Germanl, Frank Ribery, Sliverstein) and 4 capitalization/punctuation Lights (South africa, amadeus, Jean-Paul Gaultier, Hagia Sophia). Q955 (Tony Blare / Gordon Cameron) kept on CD voice call as intentional wordplay distractors. Q909 (Indonesia population unit-trick), Q951 (Sloan as Bulls player) kept after marginal-call review. **Phase 1 deliverable:** 1001-row tagged CSV at `audit_1001/audit_1001_tags.csv`, 16 finalized edge-case rulings, methodology playbook for future creative-editorial work, calibration table with per-category actuals. **Next:** corpus-wide style sweep (single global pass to clean residual whitespace/capitalization/punctuation patterns: the Q352–Q386 "Make a word using  X" double-space cluster, Q738/Q739/Q744/Q777 capitalized-first-word math cluster, any other residuals) before Phase 5 question writing begins. That's its own session, not blocking. | This is the moment that locks the 1001 voice for the v2 launch. Six batches, every non-Keep tag explicitly reviewed by the creative director, two-pass sanity check on each batch, methodology growing organically as edge cases hit (16 rulings ended up locked, vs the 10 we started with). The most important number isn't the 90.6% — it's the **zero in Heavy/Retire**. Every question in the 1001 either ships as-is or with a small editorial fix. Nothing gets thrown away. The corpus author's voice was tighter than Phase 0 sampling estimated — wordplay-heavy, time-resistant, pacing-aware. The Light edits cluster around mechanical fixes (typos, capitalization) and around the small surface area of dated cultural anchors (Will Smith Oscar, iPod, Bieber's lesser songs, MC Hammer reference, red pill manosphere drift) — the rest is just *good*. The audit's real value: now we ship Phase 5 question writing knowing we have a 907-question voice corpus to mirror, plus 94 lightly-revised questions that follow the same patterns. **Sets the bar for the new questions: every Phase 5 draft has to be at least as durable as what's in this list.** |
| 2026-04-25 (session 21b) | **Cultural-relevance sweep over Q1–Q700 + new methodology ruling #16.** Mid-session pivot after batch 5 commit: CD requested a sweep with a different filter — not "is this fact still accurate" or "did the answer change," but "has the *cultural meaning* of a phrase shifted since 2012?" The classic case is **Q444 "red pill"** (already swapped to "me" earlier in session 21) — culturally neutral in 2012 (Matrix = see reality), but post-2016 has been adopted by manosphere/alt-right. The puzzle still works mechanically; the connotation reads differently now. Sweep covered 700 questions for similar drift candidates: rappers (Eminem/Snoop/Jay-Z/Kanye — already addressed via Q463 kanye→brake, Q467 snoop→kendrick; Q556 Jay-Z kept on voice grounds — CD likes the "Jay-Z / May-C / Kay-T" rhyming-name wordplay even with current Jay-Z), pop figures (Bieber kept where used as wordplay distractor not durability anchor), Matrix references, watch-list phrases (woke, based, alpha/beta, snowflake — none currently in corpus). **One Light edit landed: Q533 distractor "Nicolas Sarkozy" → "Audrey Tautou"** (Sarkozy was France's 2007–2012 president, fading relevance and slightly politically-coded; Tautou is brand-permanent French cinema icon — Amélie 2001 — unambiguously not a singer, no awkward Piaf overlap which Marion Cotillard would have had). Batch 5 tally adjusted: 278 Keep / 22 Light / 0 Heavy / 0 Retire. Cumulative Q1–Q700: 629 / 71 / 0 / 0 = 89.86% Keep. | One new methodology ruling: **#16 — Cultural-meaning drift is its own Light-edit category, distinct from durability (#14 already-effected) and distinct from char-budget (#15).** Pattern for future batches: scan for cultural-drift candidates as a separate review pass with the question "does this phrase carry baggage now that it didn't in 2012?" Watch-list documented inline (red pill, based, alpha/beta, snowflake, woke, Karen, ghost-the-verb, etc.). Also: this is the first time a CD-led re-pass over already-committed audit work surfaced new flags. Validates the value of fresh-eyes review even after a batch is "closed" — speed mode makes the second sweep more useful, not less. The cost was small (one Light edit, one ruling, one mid-session amendment) and the gain is durable (the corpus now has explicit cultural-drift discipline, and #16 will catch future drift candidates as we continue). |
| 2026-04-25 (session 21) | **Phase 1 audit batch 5 closed — Q401–Q700 tagged + reviewed in two CD review passes (first pass + second-pass sanity check) + verdicts applied.** **Final split: 279 Keep / 21 Light edit / 0 Heavy / 0 Retire.** Cumulative through Q1–Q700: **630 / 70 / 0 / 0** (90.0% Keep). **300-question mega-batch — speed mode.** Spans four categories: word (Q401–Q525, 125q), music (Q526–Q575, 50q), movies (Q576–Q605, 30q), math (Q606–Q700, 95q in batch 5). Per-category Keep rates: word 91% / music 86% / movies 90% / math 100%. Two concept-replace Lights for durability: **Q543** swapped artist Bieber→Taylor Swift with answer "Shake It Off" (Bieber's "Never Say Never" was a 2010 documentary tie-in that's already faded; Taylor Swift's "Shake It Off" is more durable cultural fabric); **Q595** swapped answer Will Smith→Tom Cruise (Will Smith won Best Actor 2022 for King Richard, invalidating the original "never won an Oscar" answer — first **already-effected fact change** in the audit). **One Retire flag was raised on first pass (Q501 duplicate of Q326) but CD reframed to a Light-edit rewrite** ("a young goat is called a ___" → "a group of goats is called a ___" with options herd/bulls/block, herd correct), preserving the perfect zero-Retire streak across 700 questions. Bug fix: Q478 distractor RIPPING also satisfied "contains g, r, n" (two valid answers) — swapped to CARBON. Five source-XML typos: Q439 aggresive, Q540 Satistfaction, Q573 Suziki, Q576 Gywneth, Q590 Brosnon. Capitalization Lights for proper nouns: Q407 Brussels (sprout), Q408 three-name set (Jimmy Page/John Rambo/James Bond), Q451 Esperanto, Q464 Ella, Q565 Led Zeppelin/The Beatles, Q571 Van Halen. Voice-driven distractor swaps: Q444 red pill→me (red-pill has gained political/manosphere meaning post-2012 — kept Matrix-flavor but swapped distractor), Q463 kanye→brake (avoid Kanye reference), Q467 snoop→kendrick (lowercase per CD voice call), Q466 line→lemon (cleaner non-rhyme distractor — line was a half-rhyme). Stage-name punctuation: Q556 Jay Z→Jay-Z with distractors hyphenated for visual consistency (May-C, Kay-T). Title punctuation: Q574 No Woman, No Cry. Second-pass sanity check after verdicts found 4 net new Lights (Q407, Q540, Q556, Q574) — speed mode benefits from the second-pass discipline more than slower batches did, validating the methodology playbook. | One methodology ruling extended: **#14 widened from "pre-announced changes" to "pre-announced OR already-effected changes."** Q595 was the first already-effected case (Will Smith's 2022 Oscar made the corpus's 2012 "never won" claim wrong by 2026 launch). Same fix logic — swap anchor to a more durable answer. Reference resolutions captured inline in the methodology doc. **Calibration update:** five batches in (70% of corpus), the original Part 8 projection of 700/150/100/50 is now decisively pessimistic. Running rate suggests final around 900/100/0/0 if late categories cooperate. The dated-cluster forecast for music/movies (40–60% Keep) was **wrong** — both ran 86%/90%, well above. The remaining attrition reservoir is concentrated in people (Q942–Q991), which is the smallest of the heavy-attrition categories at 50 questions. Math is the cleanest category yet: 100% Keep across 95 questions, no typos, no char overruns, no edge cases. Two-pass discipline continues to earn its keep — second pass added 4 finds in this batch (vs. 0 in batch 4, 1 in batch 3, 1 in batch 2, 4 in batch 1). Pattern: speed mode + bigger batches benefit more from the second pass, suggesting we should keep the discipline tight even as we accelerate. |
| 2026-04-25 (session 20) | **League rank border palette locked — Appendix D #11 resolved.** All 8 tier hex values + gradient structures + Legend shimmer execution specified in Part 3 (Avatar / League rank border). Visual escalation across the 8 tiers: solid color for tiers 1–5 (Rookie `#8E8E8E` dull gray, Newcomer `#A8C4D8` pale dusty blue, Regular `#7BAA86` sage, Veteran `#3F8C7A` teal, Qualifier `#6962C0` indigo); 2-stop diagonal magenta gradient at tier 6 (Finalist `#B0356A → #E85F90`, static); 3-stop horizontal crimson gradient at tier 7 (Champion `#6B0F2D → #F03B5C → #6B0F2D`, static — bright center stop creates a "shine band" mirroring Legend's gold-shimmer recipe in red); 3-stop animated gold gradient at tier 8 (Legend `#C99020 → #FFE082 → #C99020`, the only animated tier — continuous low-intensity shimmer wherever rendered + theatrical brighter sweep on the promote-to-Legend interstitial entry). Two minor evolutions from the v1.25 directional spec: Newcomer "white" → pale dusty blue (CD voice call — needed identity on cream background without screaming); Finalist "orange" → magenta gradient (preserves the cool→warm climb without cramming orange between Veteran teal and Champion crimson — the gradient family aligns with the broader heat ramp). Three palette iterations on review: v1 had Rookie warm grey (CD pulled to true neutral), Newcomer bone-cream (CD pulled to pale blue), Champion bronze (CD reversed — wanted gradient instead of bronze); v2 added 2-stop gradients at Finalist + Champion; v3 pushed Champion to a 3-stop with bright center stop for stronger gradient signal. | The progression has to read as climbing without requiring you to know the tier names — color alone should tell a player whether they're moving up or down. Cool → warm → gold accomplishes that. Locking the visual escalation across the top three tiers (solid → 2-stop → 3-stop static → 3-stop animated) gives Champion + Legend a sibling identity (same recipe, different metals) so the path from #6 → #8 *feels* like a final ascent. Implementation note: Legend shimmer is Reanimated 3 + linear gradient mask — no Lottie, fits the project's custom-motion principle. ~30 lines of code in a `<LegendBorder>` component when Phase 3 builds the avatar visual layer. All hex values verified against the Cream Stadium background `#FFF4DF` for visibility; no tier shares hex with any avatar fill in the existing 8-color avatar library. Legend gold base `#D4A02E` deliberately darker than the brand yellow `#FFD23F` and the Pro avatar gold `#FFD700` — trophy gold gets its own color; the shimmer is the differentiator. |
| 2026-04-25 (session 19) | **Phase 1 audit batch 4 closed — Q301–Q400 tagged + reviewed in one CD review pass + second-pass sanity check.** **Final split: 90 Keep / 10 Light edit / 0 Heavy / 0 Retire.** Cumulative through Q1–Q400: **351 / 49 / 0 / 0** (87.75% Keep). Batch range straddled the misc→word category boundary: Q301–Q350 last 50 misc (6 Light edits), Q351–Q400 first 50 word (4 Light edits). The 10 Light edits: 4 source-XML or factual fixes (Q308 distractor swap March→September because March also has 31 days breaking the question, Q311 typo "an Japanese"→"a Japanese", Q313 typo banruki→bunraku, Q317 phrasing "the the number choices"→"the number of choices"), 2 retired-mode concept-replaces (Q331 Arcade→Quickmatch, Q332 Classic→Daily Race — same pattern as Q265 batch 3, matches questions.ts:338-339 fixes from session 11), 4 word-section fixes (Q351 capitalization Speaking→speaking, Q357 triple-space whitespace outlier, Q363 distractor swap nordic→brawl, Q371 trailing-space-inside-quotes typo). **First word category coverage** — anagram cluster Q352–Q386 ran 94% Keep, well above the 60–75% forecast. The puzzle pattern ("make a word using listed letters") is highly durable: anagrams don't age. Calibration table in methodology doc updated. Several CD reversals on review (6 of my 16 marginal-or-flagged items pulled back to Keep): Q324 grammar "more"→"most" stayed "more" (CD discretion); Q329 and Q343 char-budget overruns (41 chars) stayed Keep — fixes proposed would have rebuilt the prompt structure for 1-char trim, worse than the overrun; Q381 char-budget overrun (43 chars) stayed Keep — clean fix would have broken parallelism with sibling "make a word" puzzles; Q370 and Q372 distractor capitalizations (pisces/davis) stayed lowercase — CD voice call. **One corpus-wide style sweep deferred to end-of-Phase-1:** the "Make a word using  X" double-space prefix typo + Make/make capitalization split across Q352–Q386 (35 questions, identical normalization). Tagged once in methodology + tally; only deviations from the pattern (Q357, Q371) get individual Light edits. Per the "On corpus-wide stylistic decisions" section, this avoids 35 noisy Light tags drowning out batch signal. | One new methodology edge-case ruling locked: **#15 — char-budget ceiling is a default, not absolute; CD discretion on small overruns.** The ≤40 prompt / ≤15 answer ceilings remain the working budget and "over budget = automatic Light edit" is still the right default, but on 1–3 char overruns where the fix would degrade voice or break parallelism with sibling questions, CD can override to Keep. Reference resolutions: Q329 (41 chars, "this sentence doesn't have the letter ___" — no clean trim), Q343 (41 chars, sibling-shape with Q329), Q381 (43 chars, longest "make a word" puzzle — clean fix would have broken the family). Pattern: if proposing a fix that's worse than the overrun, surface as marginal and let CD decide. **Calibration update:** four batches in (40% of corpus), still zero Heavy or Retire flags. The original Part 8 projection of 700/150/100/50 is materially pessimistic at the running 87.75% Keep rate. If the rate held, the corpus would land closer to 875/125/0/0. It probably won't hold — people, music, and movies categories deeper in the corpus carry the projected attrition reservoir. Word category opened cleanly; remaining 125 word questions (Q401–Q525) likely continue durable. Two-pass discipline continues to earn its keep: this batch the second pass found nothing new — first-pass quality is improving as the methodology firms up. |
| 2026-04-25 (session 17) | **Post-league UX fully specced — Appendix D #26 resolved.** Three result states locked for the Monday-morning close moment. **Delivery sequence (already locked 2026-04-24):** push notification at league close → first-open interstitial (fires once, `league_result_seen` flag written on dismiss) → League tab result card at top of standings until explicitly dismissed. **Promoted (top 5):** Full-screen interstitial, avatar tier border animates to new color as the reveal moment, tier name drops in with weight after ~0.4s. Legend gets animated gold shimmer activated on entry. Share button present on interstitial and League tab card. Share card exports: avatar with new border + tier name in Archivo Black + display name + wordmark, cream/sunburst background, no score. Copy: headline `[Tier]. Yours now.` + position-aware subline (`Top 5 of 30.` / `Top 3 of 30.` / `You finished first.`). Push: `You're a [New Tier] now. Open Super Smart to see.` No reward beyond the border change — promotion IS the reward. **Held (positions 6–25):** Same skeleton, no border animation (tier unchanged). Position-aware copy in three micro-brackets: positions 6–10 `[Tier] holds. #[X] of [N].` + `Promotion was top 5. You know what to do.`; positions 11–20 same headline + `Safe. Comfortable. Maybe too comfortable.`; positions 21–25 same headline + `Quiet week. Next one's louder.` No share button. Push: `[Tier] holds. Week [N] results are in.` No reward. **Demoted (bottom 5):** Same skeleton, new (lower) tier border renders at entry without animation fanfare. No danger-color treatment — just the lower tier's border color. Copy: headline `Not this week.` subline `The door back up opens Monday.` Rookie floor variant (can't go lower): `Rookie.` / `Floor found. Only way is up.` No share button. Push: `Week [N] results are in.` (no outcome framing in the notification). No reward — Streak Shield consolation considered and closed: Streak Shield is a Daily Race mechanic and cross-wiring it into league outcomes conflates two independent systems and creates a perverse incentive. **League tab result card (all three states):** compact card, header `WEEK [N] · PROMOTED` / `WEEK [N] · [TIER] HOLDS` / `WEEK [N] · DEMOTED`, avatar with tier border, tier name, `#[X] of [N] · [score] pts`, share button for Promoted only, permanent dismiss via × or swipe. | The three tones need to be genuinely distinct — not just identical structure with different emoji. Promoted is theatrical because a tier name earned over 7 days of cumulative play deserves a reveal, not a toast notification. The border-color animation IS the reveal — the moment the new color rings in is the screenshot moment, and the share card captures it in a form worth posting. Held is dry because hollow cheerleading ("You'll get 'em next time!") is worse than nothing — it signals the game can't tell the difference between a good week and a mediocre one. Position-aware micro-copy within Held earns its small implementation cost by making the #6 player and the #20 player feel addressed differently (they had different weeks). Demoted is quiet because shame spirals are both cruel and counterproductive — the player knows what happened, they don't need it dramatized. "Not this week." is the exact right length: short enough that it doesn't labor the point, honest enough that it doesn't pretend. The Streak Shield consolation rejection keeps the two systems (Daily Race retention mechanic vs. league weekly progression) cleanly separate and prevents a situation where finishing last becomes mildly rewarding. Delivery architecture unchanged from 2026-04-24 lock — this session only fills in the copy/visual/reward layer. Resolves Appendix D #26. |
| 2026-04-25 (session 16) | **Phase 1 audit batch 3 closed — Q201–Q300 (all misc) tagged + reviewed in one CD review pass + second-pass sanity check.** **Final split: 90 Keep / 10 Light edit / 0 Heavy / 0 Retire.** Cumulative through Q1–Q300: **261 / 39 / 0 / 0** (87.0% Keep). Same per-batch shape as batch 2. The 10 Light edits: 6 proper-noun capitalizations (Q221 May, Q239 Michael Jackson, Q244 May, Q248 October, Q249 June, Q215 Eminem — all surfaced inline per the corpus-wide capitalization rule from session 14), 2 source-XML typos (Q253 stilettos, Q287 sweetener), 2 wholesale concept-replacements: **Q265** (prompt was "a game mode in Super Smart" with answer "arcade" — Arcade mode was retired 2026-04-18 session 3; replaced with "the answer is 'here'" / here / there / where → here, a generic voice-meta riddle that won't drift); **Q266** (prompt was "an Apple product" with answer "iPod" — iPod discontinued 2022; replaced with "a Google product" / Gmail / Compass / Numero → Gmail, with web-verified confirmation that "Compass" and "Numero" are not real Google products). One CD reversal on review: my initial draft flagged Q281 ("the answer is 'straight forward'") for a 16-char answer overrunning the 15-char ceiling — CD overrode same as the Q38 Oppenheimer precedent (visual layout has slack). My initial draft also flagged Q225 (capitalize "iphone" → "iPhone") and proposed it; CD reversed back to Keep when we discovered Q225 + Q266 both had "Apple product" prompts — picked the cleaner path of leaving Q225 alone and replacing Q266 wholesale. Second-pass sanity check found one new item missed first time (Q215 "eminem" → "Eminem", same proper-noun pattern). | **Calibration insight: three batches in, the original Part 8 projection of 700/150/100/50 is materially off.** At 87% Keep through 300 questions vs the projected 70%, the corpus is either genuinely more durable than the Phase 0 sampling estimate suggested OR the dated/Heavy cluster is concentrated deeper. The remaining 700 questions are still 130 misc, then 175 word, 175 math, 161 geography, then the smaller categories (50 people, 50 music, 30 movies, 10 literature). Music/movies/people are where I forecast the Heavy + Retire reservoir; we'll know after batch 6. Methodology hasn't needed new edge-case rulings this batch — every Light edit fell under existing rulings. The "concept-replace" calls (Q265, Q266) used the existing #14 ruling (time-bound facts with pre-announced changes) implicitly, but the case is broader than just "pre-announced": Q266's iPod was retired in 2022, already past the change. Worth considering whether to extend #14 to cover both pre-announced AND already-effected discontinuations next batch. The two-pass discipline continues to earn its keep — Q215 was a missed-on-first-pass capitalization that the second pass caught, exact same value as batch 2's Q124 underscore find. |
| 2026-04-25 (session 15) | **Codebase + documentation audit pass — five small drift items closed.** Two parallel sweeps (one Explore agent on the React Native code, one on the docs) surfaced drift items + dead code + small contradictions accumulated over 14 sessions. CD reviewed findings and approved fixes. **Code changes:** deleted 8 dead boilerplate files (`app/modal.tsx`, `components/themed-text.tsx`, `components/themed-view.tsx`, `components/ui/collapsible.tsx`, `components/parallax-scroll-view.tsx`, `hooks/use-color-scheme.ts`, `hooks/use-color-scheme.web.ts`, `hooks/use-theme-color.ts`) — these were Expo template scaffolding that formed a closed import island, none referenced by the actual app, and they referenced a `Colors.light.icon` / `Colors.dark.icon` shape `constants/theme.ts` doesn't have (would have thrown `undefined.icon` at runtime if any were rendered). Modal route registration removed from `app/_layout.tsx`. `app.json` `userInterfaceStyle` flipped from `"automatic"` to `"light"`; splash-screen plugin's `dark` block removed; splash `backgroundColor` changed from `#ffffff` to Cream Stadium cream `#FFF4DF` for brand consistency. **Doc changes:** primer refreshed to drop the now-untrue "audit overdue" line and pick up batch 1+2 progress; mothership Part 5 free-tier rounds nailed from "5–7" placeholder range to "**7**" (matches the `FREE_LIMIT=7` PostHog flag default already in code per CHANGELOG session 11); Phase 7 launch window made explicit ("August 1–15, 2026" — same target as the operating-assumptions line, just surfaced in the phase exit criteria so it's not buried); Appendix D extended with three code-side tracker items (#47 `IS_PRO` hardcode in `app/avatar.tsx:68`, #48 duplicate `getRankLabel` between `content.ts` and `questions.ts` already self-flagged for Phase 4 cleanup, #49 Profile mailto link's dependency on Appendix D #40 support email domain). **Methodology doc** (audit_1001) gained a one-paragraph lifecycle note: the audit folder is editorial-phase working data; once Phase 5 ships questions to Supabase the CSV becomes archival reference. Stays where it is for now (parent folder + `supersmart/docs/` mirror). | The codebase audit was a precaution after 14 sessions of accumulating decisions; running the sweep now (rather than waiting for Phase 4) catches drift before it compounds. The dark-mode boilerplate deletion is the biggest single action — closes a real bug-in-waiting (anyone touching `collapsible.tsx` would have hit `undefined.icon`) and removes a chunk of code that contradicts the locked light-only decision. CD considered keeping the boilerplate as a "future dark-mode option" but agreed that future dark mode is fundamentally a redesign exercise (parallel palette, Sunburst/Halftone dark treatments, mascot contrast, wordmark legibility) — the template scaffolding is at most a 5% head-start and would look dated whenever it's reactivated. If dark mode is reopened, it gets redesigned against current Cream Stadium structure, not by un-deleting template files. The free-tier rounds nailing is doc-following-code: code already shipped at 7, the spec just hadn't been updated to match. The Phase 7 explicit-window addition prevents the launch date from drifting into vague "summer 2026" territory if a quiet week happens. The three new Appendix D items are tracker-only — no spec changes; they exist so that the IS_PRO stub and the duplicate-rank-logic don't get forgotten when Phase 4 starts. |
| 2026-04-27 (session 27) | **Home leaderboard panel rescoped to today only — `DailyRaceRankings` replaces `GlobalLeaderboard` on home.** Old panel had OVERALL/DAILY tab strip + `412K` total-players counter + cross-board browsing. New panel previews **today's race only**: header `DAILY RACE RANKINGS · DAY [N]` (pulsing yellow dot on ink), top 3 finishers with monogram AvatarDisc placeholders, dashed divider, then either a highlighted YOU row (when played — brain avatar in tier ring, hype expression, no wiggle) or a `PlayToEnterRow` (when fresh — same row chrome, brain avatar + `START →` pill CTA). Footer link `SEE FULL RANKING IN LEAGUE ↦` routes to League. Same row chrome both states means zero reflow when daily flips. `GlobalLeaderboard` component file preserved untouched in `components/` for League tab use. Top-3 row data + `DAY 247` mocked locally until Phase 4 Daily Race board endpoint (Appendix D #52). | Home shouldn't double as a leaderboard browser — that's the League tab's job. The old composition was teaching leaderboards on home and then re-teaching them in League. Today-only on home does one thing well (preview the once-a-day shared moment), keeps the cognitive load tight, and gives the League tab a clearer identity (browsing surface). The `412K` total counter was retired alongside — it was bragging without narrative and conflicted with the more useful `349 PLAYING` live counter on the Quickmatch card. Same-chrome-both-states is the implementation discipline that makes the surface feel coordinated (no reflow on play). |
| 2026-04-27 (session 27) | **Brain antenna retired across the board. Mascot rebuilt as PNG body + SVG face overlay.** Lightning-bolt antenna gone everywhere `Brain` renders. New asset: `assets/images/brain-base.png` (1402×1122, transparent, illustrated pink brain with maroon outline + glossy white highlights). Face (eyes + mouth) drawn as an SVG overlay on top of the PNG at the PNG's native viewBox — coordinates ported verbatim from `explore/shared.jsx` (eye centers 335/645 at y=540, rx=82 ry=100; pupils inward by 8×flip). New `expression="hype"` (open mouth + tongue) added for the YOU-row leaderboard avatar. Brain.tsx wiggle (2.4s, -1.5°→2°) and blink (130ms every 2.8–5.3s) preserved. Avatar.tsx (the avatar editor's text-glyph component) untouched — that's a separate surface used inside the avatar customization screen. | Small avatars need to fit cleanly in tight discs without antenna overflow — the YOU-row avatar disc is 32pt and the brain inside is 1.05× that, leaving zero room for antenna headroom. Removing the antenna everywhere keeps the mascot consistent across surfaces (top-left hero, YOU-row avatar, future avatar customization, ghost preview, end screen) — one shape, one outline, one identity. The PNG-with-overlay architecture (vs. all-SVG) trades a small APK weight increase for: (a) volume + gyri detail the SVG version couldn't carry without a hand-drawn outline that looked flat-blob, (b) cleaner separation between body (rarely changes) and face (changes per-expression and per-blink — ideal for SVG). Role split documented in Part 6: top-left brain = "this is your home" (smirk, 92pt, wiggle); YOU-row brain = "this is you in the race" (hype, 32pt disc with tier ring, no wiggle). |
| 2026-04-27 (session 27) | **Daily Race card adopts a live-status pattern when done.** `dailyPlayedToday` switches the card from press-to-play affordance to "live broadcast." Done state: title `DAILY RACE` (unchanged from fresh), subtitle `[score] PTS · #[rank] OF [total]`, tertiary `BACK IN HH:MM:SS` (live countdown to next 6am ET, 1s tick, DST-aware US-ET math via new `useCountdownToNext6amET` hook). Card stays fully vivid in both states (same height, color, depth, bob). New `DailyDecor` `done` variant: same calendar shell + same 5s lock-on / cream-flash cadence — only the visuals under the ring swap (bullseye → green-ringed checkmark stamp). ArcadeCard gained an optional `tertiary` text slot to host the countdown (small mono, `tabular-nums`, dim, no card-height growth). Tap routes to `/daily` (which renders the alreadyPlayed view + result grid when done). | The card was 96pt tall and chunky-pressable but had no action when daily was done — either it shrinks (loses presence and breaks the 2-mode visual hierarchy) or it earns its space by feeling alive. We picked alive. Live ticking + 5s decor pulse turns the surface from dead button into live broadcast without changing its silhouette. The countdown is intentionally the *smallest* line on the card (not a hero clock) — the title carries the slot identity, the score+rank carries the player's result, and the countdown is texture that proves the card is real-time. Same-shell-different-fill on the decor means the visual transition from fresh to done is mechanical, not architectural — exactly the discipline we want for state-driven surfaces. Reference deliverables: `Home v2 — Fresh.html` + `Home v2.html` + `explore/home-v2.jsx` (Claude Design exploration). |
| 2026-04-25 (session 14) | **Phase 1 audit batch 2 closed — Q101–Q200 tagged + reviewed in one CD review pass + second-pass sanity check.** **Final split: 90 Keep / 10 Light edit / 0 Heavy / 0 Retire.** Cumulative through Q1–Q200: **171 / 29 / 0 / 0** (85.5% Keep). Batch range straddled the science→misc category boundary: Q101–Q120 last 20 science questions (1 Light edit), Q121–Q200 first 80 misc questions (9 Light edits). The 10 Light edits: 1 distractor swap (Q116 "big blue blind" → "big blue bulk" — original distractor didn't read as a fish name), 1 source-XML typo (Q122 "you mother's" → "your mother's"), 1 underscore-count fix (Q124 "__" → "___" matching corpus convention), 6 capitalization fixes (Q126/127/128 "english" → "English"; Q152/153/154 weekday names), 1 time-bound fact swap (Q147 "squash" → "bowling" because squash was approved for LA 2028 Olympics in 2023 and the answer would go stale 2 years post-launch). Misc slice ran 89% Keep — way above the forecast 30–50% — because the first 80 misc questions are mostly self-referential wordplay, fourth-wall meta, family-tree/letter/word puzzles, and durable basics (colors, alphabet, days, rock-paper-scissors, historical Olympics, spelled-backwards). The dated-pop-culture cluster originally forecast for misc must live deeper (Q201+ inside misc — batches 3+). Calibration table in methodology doc updated to reflect this. Several CD reversals on review (8 of my initial 13 marginal-or-flagged items pulled back to Keep): Q163 char-budget over-flag accepted at the visual level; Q164–170 number-spelling drills stay in misc rather than recategorizing to math; Q131/Q132/Q184 stayed Keep despite my marginal flags. | One new methodology edge-case ruling locked: **#14 — time-bound facts with pre-announced changes are Light edits even if technically correct at launch.** The IOC's Oct-2023 vote to add squash to LA 2028 means Q147's "squash is not an Olympic sport" answer becomes stale exactly 2 years post-launch (LA 2028 happens summer 2028; game ships Aug 2026). Same logic applies to confirmed-but-not-yet-effective changes elsewhere — currency redesigns, country renamings, sports rule changes, league restructurings. Also added a methodology section on corpus-wide stylistic decisions (capitalization, underscore counts, hyphenation) — fix inline as spotted, run one global sweep at end of Phase 1 to catch residuals; don't burn review-pass time debating each per-question. Forecast vs reality: my pre-batch projection had misc as the Heavy+Retire reservoir; first 80 misc questions disproved that and forced a calibration update. The original audit's 700/150/100/50 corpus-wide projection (Part 8) is now tracking pessimistic — through 200 questions we're at 85.5% Keep vs the 70% projection. Plausible explanations: (a) the first 200 are skewed toward durable categories (science 100%, plus 80 misc that turned out to be mostly meta-wordplay); (b) the corpus is genuinely more durable than the original Phase 0 sampling estimate suggested; (c) the dated cluster is concentrated in batches 3–6. Will revisit the corpus-wide projection after batch 4. Two-pass discipline (initial draft → CD review → second-pass sanity check) caught one new find this batch (Q124 underscore count) — fewer than batch 1's four, suggesting first-pass quality is improving as the methodology firms up. |

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
- **Fresh set** — a question set with no human ghost yet at a given skill tier. Served with a **bot ghost** (see below) so the matched player gets a real-feeling opponent. The player's own run is recorded and becomes the first human ghost on that set at that tier; subsequent plays graduate off bots to human ghosts automatically.
- **Bot ghost** — single-use, ephemeral opponent generated by the matchmaking Edge Function when no human ghost exists at the matched player's skill tier on the assigned set. Indistinguishable from human ghosts in the UI. Score range 300–3,000; avatar drawn from the full library (including Pro-locked items, for soft exposure); name follows no single pattern. Not persisted in `ghost_pool`. Never enters a League of 30, never contributes to any leaderboard. Quickmatch-only. Locked 2026-04-24.
- ~~**Arcade mode**~~ — *retired.* 60-second format and streak mechanics absorbed into both current modes.
- ~~**Classic mode**~~ — *retired.* 3-strikes, 10-second ceiling. No replacement.
- ~~**The kicker**~~ — *retired.* Post-answer one-liner; had no home once Classic mode was retired.
- **echo.tsx** — the code file that implements Quickmatch (the `/echo` route). Contains the full game loop inline: matching animation → ghost preview → playing → result. This is what runs when the player taps Quickmatch on the home screen.
- **game.tsx** — a separate standalone arcade implementation. Currently not linked from the home screen. Same mechanics as echo.tsx. If the scoring spec changes, both files need updating.
- **Cream Stadium** — the name for the v2 colour palette: cream `#FFF4DF`, ink `#1A1522`, red `#E8253C`, yellow `#FFD23F`.
- **Streak Shield** — a consumable IAP item. Auto-activates if you have one and miss a day; retroactively repairs a broken streak within 48 hours if you buy one after missing. Max 3 held. Free users get 1 at launch; Pro users get 1 auto-granted every Monday up to the cap.
- **League of 30** — weekly leaderboard cohort of up to 30 real players, composed strictly by league tier (all members finished the previous week in the same tier). Not a matchmaking pool — league members don't play head-to-head; they each play their own Quickmatch + Challenge + Daily Race rounds, and weekly cumulative scores rank the cohort at week-end. Top 5 promote, bottom 5 demote. No ghost-fill. Works at any player count via the transition window + forming queue.
- **League tier** — one of 8 named brackets in the weekly league ladder (Rookie → Newcomer → Regular → Veteran → Qualifier → Finalist → Champion → Legend). Visible on the avatar as a coloured border stroke. New players enter at tier 2 (Newcomer); Rookie is a demotion destination only. Determines which league cohort you're placed in next week. Separate from, and independent of, **skill tier** below.
- **Skill tier** — one of 5 internal (not player-visible) brackets used for Quickmatch ghost matching. Based on rolling 10-game average. Percentile-defined, recalculated weekly with inertia. The ±1 expansion rule (if no ghost exists at your exact skill tier, search adjacent tiers) lives here — it is a Quickmatch gameplay rule, not a league rule.
- **Build for the Flex** — design principle: every decision should serve the screenshot moment. Make the shareable surfaces (end screen, rank reveal, Daily Race grid) visually spectacular and unmistakably Super Smart.
- **ArcadeCard** — the mode card component (`components/ArcadeCard.tsx`). Implements the chunky 3D press-down mechanic + idle bob float animation. Used for Quickmatch and Daily Race cards on the home screen.
- **TokenTabBar** — the custom tab bar component (`components/TokenTabBar.tsx`). Chunky arcade-door style, replaces expo-router's default. Active tab: yellow border. Press: spring sink animation.

---

## Appendix D — Open Questions Index

### Critical to resolve before Phase 1 starts

**All resolved.**

### Remaining open items — grouped by resolution phase

Reorganised 2026-04-24 (v1.20) after an audit pass surfaced implicit gaps the doc had been handwaving. Section structure: items grouped by the phase that must resolve them, so a future reader can see at a glance what's blocking each phase.

#### Phase 4 blockers — must resolve before multiplayer build starts

1. **Auth architecture.** Onboarding spec commits to Sign in with Apple / Google + email magic link + anonymous session fallback. Underspecced: which library (Supabase Auth vs Clerk vs something else); how does an anonymous-session player's data merge into their account when they eventually sign in; is the anonymous session durable across reinstalls.
2. ~~**Local persistence strategy.**~~ ✅ **RESOLVED 2026-04-26 session 23.** AsyncStorage wired into `app/store.tsx`. Persisted: avatar, freePlay counter, dailyStatus, highScores. Single-blob storage at key `@supersmart/state` with `_version: 1` for future schema migrations. 200ms write debounce coalesces rapid mutations (closes Android race-condition concern). Hydration runs in parallel with font load in `_layout.tsx`; render unblocks when both ready (no UI flicker). Silent fallback to defaults on parse error / corruption / version mismatch. Phase 4 will layer Supabase as cross-device source-of-truth, with AsyncStorage demoted to local cache for things that need cross-device sync (high scores, league, Pro entitlement); local-only state (freePlay counter, dailyStatus) stays AsyncStorage-only. **Closes the gate-bypass abuse path** — force-quit + reopen no longer resets the freePlay counter. **Closes the once-per-day Daily Race loophole** — already-played state survives force-quit. Streak Shield inventory + selected-but-not-submitted emote will be added to the persisted shape when those features land.
3. **Offline behaviour.** "Never block a 60-second round on a network call" is committed but operationally unspecced. Can you play Quickmatch offline (no ghost to race)? Daily Race offline (no shared set)? Does the app pre-cache a week of question sets on launch / on WiFi? Graceful UX when you're offline and tap a mode.
4. **Identity + cross-device sync.** What's the identity key — Apple ID, email, Supabase UUID? RevenueCat has an `app_user_id` concept that must tie to the same identity. New-device migration: does Pro purchase / rank / avatar follow automatically via Apple ID, or does the player need to sign in first?
5. **Supabase schema gap.** ~~`supabase/schema.sql` covers emotes, ranks, questions only. Missing: `players`, `sessions`, `scores`, `ghost_pool`, `question_sets`, `challenges`, `league_memberships`, `streak_shields`, `pro_entitlements`, `push_tokens`.~~ ✅ **DRAFT LANDED 2026-04-24** at `supabase/phase4_schema.sql`. 11 new tables (the original 10 minus `scores` merged into `sessions`, plus `leagues` and `daily_races` as first-class tables) + locale extensions on the existing 3. Two triggers, 7 inline `[OPEN]` items. Not yet runnable against a live Supabase — depends on #1 (auth library), #6 (anti-cheat validator), and RLS policy depth review. The 8 Edge Functions the schema implies (session validator, league close/open, daily race seed, ghost pool retirement, Pro shield grant, skill tier recalc, RevenueCat webhook, push dispatch) are a separate workstream — probably one session per function. See Part 12 decision log 2026-04-24.
6. **Anti-cheat / score integrity.** Global leaderboards matter. What prevents a modified client submitting fake scores? Typical tools: server-side reasonableness checks (points-per-second bound), rate limiting, suspicious-pattern flagging. Not specced.
7. ~~**Daily Race + League reset clocks.**~~ ✅ **RESOLVED 2026-04-24.** 6am Eastern Time, ET-anchored (Option A — UTC auto-adjusts 10:00↔11:00 with DST). Supabase cron in `America/New_York` tz, behind `daily_race_reset_time` PostHog flag. Once-per-day lock built on reset window, not a rigid 24h timer, to handle DST 23/25-hour weeks. See Part 3 Daily Race, Part 12 decision log.
8. **Skill tier initial bracket thresholds.** Creative director to provide 5 score values before launch based on beta playtest data. These seed the inertia formula going forward.

#### Phase 3 design items (visual + audio polish)

9. **Avatar milestone-unlock conditions.** Which gameplay achievements unlock which earned items.
10. **Sound design direction.** SFX library, narrator voice casting (TTS vs VO), mix levels.
11. ~~**League rank border hex values + shimmer execution.**~~ ✅ **RESOLVED 2026-04-25 session 20.** All 8 hex values + gradient structures + Legend shimmer execution locked. Visual escalation: solid 1–5 → 2-stop static gradient at 6 (Finalist magenta) → 3-stop static gradient at 7 (Champion crimson) → 3-stop animated gradient at 8 (Legend gold, continuous + theatrical-entry shimmer). Full table in Part 3 — Avatar / League rank border. Two minor evolutions from the v1.25 directional spec: Newcomer "white" → pale dusty blue `#A8C4D8` (CD voice call: needed identity without volume); Finalist "orange" → magenta `#B0356A → #E85F90` (preserves the cool→warm climb without cramming orange between Veteran and Champion).
12. **Text callout on playing screen.** Narrator copy appearing on-screen as text — decide when playing layout is visible and we can judge if it competes with question text.
13. ~~**Onboarding wordmark splash duration.**~~ ✅ **RESOLVED 2026-04-24.** **2 seconds**, shown on **every cold-start** (not just first-time open). Water-balloon bloat fires at t=0 (the welcoming pop), settles through fade-out. Scope expanded from onboarding-only to universal brand ritual — see Part 3 Onboarding step 1 + Part 12 decision log.
14. **Designer outreach for brand mascot evolution + UI direction polish.** Creative director + AI primary; new designer brought in for taste-heavy pieces. Outreach not yet started.

#### Phase 4 architecture items (beyond the blockers above)

15. **Challenge link architecture.** Deep link vs Universal Links vs App Links. Graceful fallback when the tapper doesn't have the app installed (App Store page with pre-populated campaign param).
16. **Push notification permission UX.** iOS declines are permanent — need a pre-prompt pattern ("Want a nudge when someone beats your score?" before the system dialog).
17. **Pro weekly Streak Shield auto-grant.** Specced as "1 free shield every Monday, up to 3-shield cap." Implementation is a scheduled server-side job on Supabase Edge Functions. Not designed.
18. **Pro receipt validation failure grace period.** What happens when RevenueCat can't validate a receipt temporarily — lock Pro immediately or grace for N hours?
19. **Streak Shield retroactive 48-hour clock anchor.** Anchor resolved by #7 — the 48-hour window runs from the 6am ET reset that the player's missed day was bounded by. Specific implementation details (how the "missed day" is detected, which reset the 48h is measured from) still to be specced during Phase 4 build.
20. ~~**Leaderboard tie-breakers.**~~ ✅ **RESOLVED 2026-04-24.** Four-layer cascade, applies uniformly across all boards (Daily Race, League of 30, Quickmatch, Global all-time): `score DESC → peak_streak DESC → questions_answered ASC → submitted_at ASC`. Per-round boards use session-level fields; Global all-time uses aggregates (`SUM(score)`, `MAX(peak_streak)`, `SUM(questions_answered)`, `MAX(submitted_at)`). All four fields already in session record — zero new schema. See Part 12 decision log.
21. ~~**App-backgrounding during a round.**~~ ✅ **RESOLVED 2026-04-26 session 26.** Round timer keeps running on wall-clock time during background — player loses time-on-task, round resumes when they return (or ends immediately if timer hit 0 while backgrounded). Backgrounding is NOT a pause mechanism. Anti-cheat principle: navigation-away locks the score and ends the round; backgrounding does not. Wall-clock-based timer (computed from `roundStart` timestamp, not decremented per tick) makes this robust to iOS lifecycle quirks (JS pause during app switcher, etc). Full spec in Part 3 → Round lifecycle.
22. ~~**Launch-day Quickmatch UX.**~~ ✅ **RESOLVED 2026-04-24** by the bot-ghost system. Launch day no longer has an "empty ghost pool" problem — bots fill whatever human ghosts haven't been recorded yet, and the bot-fill is indistinguishable from a human opponent to the player. Every Quickmatch on launch day has a real-feeling opponent. See Part 12 decision log 2026-04-24 (bot-ghost system lock).
23. **League week-one launch experience.** Weekly rotation assumes ongoing operation. What does Week One look like — leagues form at launch minute, or first-Monday after launch?
24. **Ghost pool storage cost at scale.** Mothership estimates "$0–20/month" for Supabase. Ghost pool at 100k+ DAU stores thousands of question sets × many ghosts each. Worth stress-testing the estimate.
25. ~~**Question retirement / correction path.**~~ ✅ **RESOLVED 2026-04-24.** Three-tier severity system:
    - **Tier 1 — Edit in place** (typo, minor factual fix): update the Supabase row; question ID stable, rendered content updates automatically; historical scores unchanged.
    - **Tier 2 — Soft retire** (wrong / sensitive / beyond fixing): set `questions.active = false`; new question set generation skips it; in-flight sets keep showing it until natural lifecycle end (preserves equal-ground mid-set).
    - **Tier 3 — Emergency recall** (offensive / legally problematic): `active = false` **plus** invalidate all active question sets containing the question; today's Daily Race is cancelled and re-seeded; affected players get a goodwill note (streak restored, Streak Shield credit); ghost pool entries referencing the question marked inactive. Reserved for rare emergencies (0–3/year expected).
    
    **Principles:** historical session data never retroactively edited — past scores stand as historical record. Audit trail logged for every retirement (who/when/why). **No in-app "report this question" button** — all player feedback flows through the "Contact the developer" email link in Profile instead (one channel, framed as conversation not moderation).
26. ~~**"What happens after league" — post-league UX.**~~ ✅ **RESOLVED 2026-04-25 session 17.** Full spec in Part 4 Layer 4 (End-of-league UX section). Three states fully locked: Promoted (theatrical, border-color reveal, share button, `[Tier]. Yours now.`), Held (position-aware dry copy, three micro-brackets), Demoted (quiet, `Not this week.`, no reward, push notification contains no outcome framing). Streak Shield consolation considered and closed — wrong mechanic. No league-specific rewards at launch confirmed. See Part 4 and Decision Log session 17 row.

#### Phase 5 content items

27. **Streak Shield bundle pricing.** 1 / 2 / 3 shield pack prices.
28. ~~**Emoji policy in questions, answers, and display names.**~~ ✅ **RESOLVED 2026-04-24.**
    - **Questions, options, distractors:** NO emoji. Text-only corpus discipline preserves the wordplay-based voice and the tight character budget (40 chars question / 15 chars answer).
    - **Scraped display names (Apple/Google sign-in):** allow as-is. Relies on the display-name moderation pipeline (#36) to filter genuinely inappropriate names.
    - **Player-edited display names:** same rule as scraped — allow with moderation.
    - **Not affected:** emotes (already heavy emoji use, unchanged), One More copy / narrator callouts / push copy (writer's judgment, sparingly).
29. ~~**Seasonal question pack clarification.**~~ ✅ **RESOLVED 2026-04-24.** Free = static 2,500 launch questions. Pro = 2,500 + ongoing seasonal packs (4–6/year). Nothing ships seasonal at v1 launch (item #44 deferral stands) — the Pro pitch page reads forward-looking ("seasonal packs coming"). Part 5 Free tier copy updated. See Part 12 decision log.

#### Phase 6 launch-prep items (legal / compliance / App Store)

30. **Privacy policy URL + Terms of Service.** Required for App Store submission. Not yet drafted.
31. **Age rating decision.** Some 1001 questions reference alcohol, weapons, mature topics. If rated 4+ and content pushes 12+, Apple rejects. Content pass needed + explicit rating call.
32. **GDPR + CCPA compliance.** Data export on request, deletion on request, consent flows. Necessary for EU + California users.
33. **COPPA strategy.** Age gate to block under-13, or comply with COPPA (data minimisation, parental consent). Trivia games often attract under-13 — pick one explicitly.
34. **Account deletion + data export.** Required by App Store for any data-collecting app. Build as a Profile settings flow.
35. **Legal entity + IP.** Formondo (2012) exists but is dormant. Who ships v2 — reactivated Formondo, new LLC, solo trader? Apple Developer account goes in whose name? 1001 questions + mascot IP: was it transferred from Formondo to the creative director personally, or still held by Formondo?
36. **Display name moderation.** Names pulled from Apple/Google accounts. League boards display them publicly. Profanity filter + moderation pipeline needed.
37. ~~**App Store subtitle.**~~ ✅ **RESOLVED 2026-04-24.** App Store name = `Super Smart — Quick Trivia` (ASO weight + functional distinction from "Party Trivia"). Subtitle = heritage line, candidate `Since 2012. Smarter now.` (final copy tuned Phase 6). See Part 6, Part 12 decision log.
38. **Launch date PR strategy.** Warm-list press (148Apps, GameviewTonton), nostalgia angle, timing.
39. **Beta tester list.** 10–20 friends for TestFlight. Names + coverage (iOS + Android, country mix).
40. **Support email domain.** ⏸ **PARTIAL / DEFERRED 2026-04-24.** Primary candidate `support@iamsupersmart.com` (heritage-aligned with the "Since 2012" App Store subtitle positioning). Fallback candidate `support@supersmart.game` if the original domain isn't recoverable. **Action item for future session:** confirm `iamsupersmart.com` is still registered and renew if needed; if unrecoverable, register fallback. Decision then locks in based on outcome. See Part 12 decision log 2026-04-24.
41. **App Store screenshots + preview video creative brief.** Deliverable listed, no brief.
42. **App Sandbox IAP testing strategy.** RevenueCat Sandbox mode + Apple Sandbox testers. Flow for beta testers to test purchase without real charges.

#### Operational

43. **Backup developer plan.** Risk Register item 3 says budget is set aside for a human dev on specific blocks if Claude Code hits a wall. Specifics TBD — who, where sourced, rate.

#### Code-side trackers (small, surfaced by the session 15 codebase audit)

47. **`IS_PRO` is hardcoded `false` in `app/avatar.tsx:68`.** Stub waiting for monetization wiring. Replace with the canonical Pro entitlement read (likely `useAppStore().isPro` once `pro_entitlements` is wired through Supabase + RevenueCat). Phase 4–6 work; flagged here so it doesn't get forgotten. Won't break anything until then — just always renders the free-tier 4-options view.
48. **Duplicate `getRankLabel` derivation logic between `app/content.ts` (lines ~153–159) and `app/questions.ts`.** Existing comment in `content.ts` already says "Phase 4: delete that one" — this is the official tracker. Consolidate as part of the `app/content.ts` → Supabase migration in Phase 4.
49. ~~**Profile screen "Contact the developer" mailto link depends on Appendix D #40 (support email domain).**~~ ✅ **RESOLVED 2026-04-25 session 18.** Placeholder mailto now wired in `app/(tabs)/profile.tsx` against a `SUPPORT_EMAIL` constant set to `support@iamsupersmart.com` (the v1.25 primary candidate). `// TODO: confirm support email per Appendix D #40` comment in place — one-line swap when #40 locks the domain.

50. ~~**Back-button mid-round handler.**~~ ✅ **RESOLVED 2026-04-26 session 26.** `useFocusEffect` cleanup added to `app/echo.tsx`, `app/daily.tsx`, `app/game.tsx`. Hardware back (Android) and iOS swipe-back both fire the cleanup, which clears all timers and locks the score. Score recording follows the rules in Part 3 → Round lifecycle (Quickmatch updates high score; Daily Race uses today's attempt with the locked score). Closes the orphaned-timer technical debt + the "lost progress on accidental swipe" UX gap.

51. **Post-answer setTimeout deferred during iOS lifecycle pause** — buttons may briefly appear stuck/grayed mid-round. *Identified 2026-04-26 session 26.* When the app transitions to `inactive` (app switcher, brief notification pulldown) right after the player answers a question, the unified 1-second post-answer `setTimeout` can be deferred by iOS until JS resumes. During the deferral, `selectedAnswer` is non-null → buttons render in `correct/wrong/dim` state (visually grayed) → buttons are disabled. Self-corrects when JS resumes (the deferred setTimeout fires, advances the question, re-enables buttons). Same root cause as the round timer issue (resolved via wall-clock refactor in #21). **Fix path:** wall-clock the post-answer advance too — track `answerLockedAt = Date.now()` on answer registration; on AppState `active`, check if ≥1000ms have passed and force-advance if so. Not blocking — single anecdotal occurrence, self-resolves, hard to reproduce. Track for now; fix if it becomes a pattern.

52. **Daily Race rank + total players + top-3 + DAY count — server source.** *Identified 2026-04-27 session 27.* Home-screen Daily Race surfaces (the card's `#34 OF 1,247` and the `DailyRaceRankings` panel's top 3 + `DAY 247`) are mocked at constants in `app/(tabs)/index.tsx` + `components/DailyRaceRankings.tsx` until the Phase 4 Daily Race board endpoint exists. Real "rank moves through the day" needs: (a) a server query against today's `daily_races` board ranked by the tie-breaker cascade returning the player's rank + cohort total + top-3 rows; (b) refresh-on-focus so the rank updates when the player returns to home after backgrounding (matches the live-broadcast framing of the done card); (c) polite re-fetch on a cadence (probably 1-minute, mirroring the `LivePlayersStrip` cron-cache pattern in Part 4 Layer 1.5) while the screen is foregrounded. Also: `DAY [N]` is currently mocked at 247 — wire to `Math.floor((today − launchDate) / 1 day)` at minimum, or a server-side `current_day_number` field for the Daily Race admin layer. **Implementation:** ~1 hour once the board endpoint exists. Fits into the broader Phase 4 wave alongside `LivePlayersStrip`, no new schema (the board is already specced under `daily_races` + `sessions`).

53. **Brain avatar editor UI — ship date.** *Identified 2026-04-27 session 27.* Brain is now the user's customizable self-representation (color/eyes/mouth via the avatar editor). Editor screen exists at `app/avatar.tsx` but doesn't yet drive the home-screen Brain or the YOU-row Brain — both currently render the brand-default pink brain (smirk on home top-left, hype on YOU row). Open: when does the avatar editor's output (`store.avatar.color`, `.eyes`, `.mouth`) get plumbed into the rendered `Brain` component? Today the `Brain` props don't accept color overrides — the PNG is fixed pink. **Path:** decide whether (a) ship multiple PNGs for color variants (cheap, quick, capped at avatar palette options) or (b) tint the PNG via a color filter (more flexible, slightly more work, may not match the maroon outline cleanly across all colors). Option (a) is easier for v1 since the avatar palette is bounded (4 free + 4 Pro colors per Part 3 Avatar system). Either way, the SVG face overlay can stay as-is — only the body asset changes. Nice-to-ship for launch but not blocking — the brand-default pink is a reasonable v1 default. Phase 3 visual pass is the natural home.

#### Deferred indefinitely unless reopened

44. **Seasonal Pro packs cadence.** v1.1+ conversation once the content factory and player base exist.
45. **Private leaderboards for friend groups** as a Pro feature. Possible post-launch.
46. ~~**Localization / i18n.**~~ ✅ **RESOLVED 2026-04-24.** English-only at launch, stated explicitly. No localization shipped until/unless explicitly reopened. **Architectural hedge:** Supabase content schema includes a `locale` column on every player-visible content row (questions, emotes, ranks, One More copy, all strings) with `'en'` as the default. Zero runtime cost; future localization becomes "add rows" instead of "migrate schema." See Part 12 decision log.

#### Historical resolved items (for reference)

- ~~**Wrong-answer streak behaviour:** full reset vs. freeze~~ — resolved session 3 (2026-04-18): wrong answer resets streak to zero immediately.
- ~~**Daily Quiz strikes vs play-all-10**~~ — moot after Classic mode retired; Daily Race plays full 60 seconds regardless of wrong answers.
- ✅ **League cohort composition** — strict same-tier (a league of 30 is a leaderboard cohort, not a matchmaking pool), tiers hidden — decided 2026-04-19 session 7, clarified 2026-04-24.
- ✅ **Onboarding spec** — decided 2026-04-24. Full spec in Part 3.

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

*End of doc v1.44 — last updated 2026-04-27.*
