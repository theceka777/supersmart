# Super Smart 2026 — Changelog

---

## Session 21b — 2026-04-25 — Cultural-relevance sweep + methodology ruling #16 (mothership v1.33 → v1.34)

Mid-session pivot after batch 5 commit: CD requested a sweep over Q1–Q700 with a fresh filter — catch phrases whose **cultural meaning has shifted since 2012**, even when the puzzle still works mechanically. Distinct from the durability test (Q543 Bieber→Swift) and the already-effected-fact test (Q595 Will Smith→Tom Cruise).

### What landed

- **Q533** distractor `Nicolas Sarkozy` → `Audrey Tautou`. Reason: Sarkozy was France's 2007–2012 president, fading relevance and slightly politically-coded. Tautou is brand-permanent French cinema icon (Amélie 2001), unambiguously not a singer, no awkward overlap with the Piaf answer (Marion Cotillard would have had this issue — she played Piaf in *La Vie en Rose* and sang in *Nine*).

### Methodology ruling #16 added

**Cultural-meaning drift — Light edit when a phrase's meaning has shifted since the corpus was written, even if it's still technically valid.** Distinct from #14 (already-effected fact change) and #15 (char budget). Reference resolutions: Q444 "red pill" (Matrix neutral 2012, manosphere-coded post-2016 — already swapped earlier in session 21), Q533 Sarkozy → Tautou. Watch-list of phrases not currently in corpus but flagged for future awareness: based, alpha/beta male, snowflake, woke, Karen, ghost (verb).

### Things I considered and rejected on the sweep

- **Q556** "famous rapper" → Jay-Z — CD kept on voice grounds (likes the "Jay-Z / May-C / Kay-T" rhyming-name wordplay even with the older anchor; the joke depends on the structure, not contemporary relevance).
- **Q417** "hammertime" distractor — MC Hammer 1990 reference, joke still readable. Keep.
- **Q406, Q550, Q600** Bieber as distractor — voice-driven wordplay distractors, the joke doesn't depend on his enduring fame. Keep.
- **Q526, Q527, Q558** brand-permanent figures (MJ, Elvis, Beckham). Keep.
- **Q597** Pattinson — re-anchored as Batman 2022, brand-permanent. Keep.

### Tally adjustment

- Batch 5: 279/21/0/0 → **278/22/0/0**
- Cumulative Q1–Q700: 630/70/0/0 → **629/71/0/0** = 89.86% Keep
- Total methodology rulings: 15 → **16**

### Why this matters as a methodology pattern

This is the first time a CD-led re-pass over already-committed audit work surfaced new flags. It validates the value of fresh-eyes review even after a batch is "closed" — speed mode makes the second sweep *more* useful, not less. The cost was small (one Light edit, one ruling, one mid-session amendment) and the gain is durable: the corpus now has explicit cultural-drift discipline, and #16 will catch drift candidates as we continue into batch 6+.

### Files touched

- `audit_1001/audit_1001_tags.csv` — Q533 row updated in place (Keep → Light edit)
- `audit_1001/audit_1001_methodology.md` — title-line updated, batch 5 row tally updated (21 → 22 Light), cumulative row updated, ruling #16 added under #15
- `super_smart_2026_mothership.md` — status line bumped v1.33 → v1.34 with cultural-sweep segment, end-of-doc stamp, Part 12 row added for session 21b
- `super_smart_2026_primer.md` — current-state line updated to v1.34, audit progress recount, ruling-count 15 → 16
- `supersmart/docs/` — all four files mirrored
- `CHANGELOG.md` — this entry

---

## Session 21 — 2026-04-25 — Phase 1 audit batch 5 closed (mothership v1.32 → v1.33)

**300-question mega-batch** (Q401–Q700) — speed mode. Spans four categories.

### Final tally

`279 Keep / 21 Light / 0 Heavy / 0 Retire` = 93.0% Keep. Cumulative Q1–Q700: **630 / 70 / 0 / 0** = 90.0% Keep. Five batches in (70% of corpus), still zero Heavy or Retire flags.

Per-category Keep rates: word 91% / music 86% / movies 90% / math 100%.

### What landed

- **Concept-replaces (durability):** Q543 swapped Bieber → Taylor Swift answer "Shake It Off"; Q595 swapped Will Smith → Tom Cruise (Will Smith's 2022 Oscar invalidated the "never won" answer — first already-effected fact change in the audit).
- **Bug fix:** Q478 distractor RIPPING also satisfied "contains g, r, n" — swapped to CARBON.
- **Source-XML typos (5):** Q439 aggresive, Q540 Satistfaction, Q573 Suziki, Q576 Gywneth, Q590 Brosnon.
- **Capitalization Lights (6):** Q407 Brussels (sprout), Q408 three names, Q451 Esperanto, Q464 Ella, Q565 Led Zeppelin/The Beatles, Q571 Van Halen.
- **Voice-driven distractor swaps (4):** Q444 red pill→me (red-pill has political meaning post-2012), Q463 kanye→brake, Q467 snoop→kendrick (lowercase per CD), Q466 line→lemon (cleaner non-rhyme).
- **Stage-name punctuation:** Q556 Jay Z → Jay-Z with distractors hyphenated for visual consistency (May-C, Kay-T).
- **Title punctuation:** Q574 No Woman, No Cry.
- **Q501 first-pass Retire reframed to Light edit** by CD: prompt rewritten to "a group of goats is called a ___" (herd/bulls/block, herd correct), preserving zero-Retire streak.

### Methodology update

**Ruling #14 extended** from "pre-announced changes" to "pre-announced OR already-effected changes." Q595 was the first already-effected case (corpus written 2012 with Will Smith Oscarless; he won 2022, before our 2026 launch). Reference resolution captured inline.

### Calibration insight

Original Part 8 projection of 700/150/100/50 is now decisively pessimistic at 90% Keep through 700. Running rate suggests final around 900/100/0/0. Music/movies dated-cluster forecast (40–60% Keep) was **wrong** — both ran 86%/90%, well above. Remaining attrition reservoir concentrated in people (Q942–Q991, 50 questions). Math is the cleanest category yet: 100% Keep across 95.

### Two-pass discipline pattern

Second pass added 4 net new Lights (Q407, Q540, Q556, Q574) over first pass. Speed mode + bigger batches benefit more from second-pass review than slower batches did. Keep the discipline tight even at 300-question pace.

### Files touched

- `audit_1001/audit_1001_tags.csv` — appended 300 rows for Q401–Q700
- `audit_1001/audit_1001_methodology.md` — title line updated, batch 5 row + cumulative row added, calibration table per-category Actual columns updated, ruling #14 extended
- `super_smart_2026_mothership.md` — status line bumped v1.32 → v1.33 with batch 5 segment, end-of-doc stamp, Part 12 decision log row added for session 21
- `super_smart_2026_primer.md` — current-state line bumped to v1.33, audit progress updated
- `supersmart/docs/` — all four files mirrored
- `CHANGELOG.md` — this entry

### What's left

301 questions to audit: 80 math + 161 geography + 50 people + 10 literature. One more big batch likely closes Phase 1.

---

## Session 20 — 2026-04-25 — League rank border palette locked (mothership v1.31 → v1.32)

Quick mid-session palette lock. Appendix D #11 resolved. No code changes.

### What was decided

All 8 league tier border colors + gradient structures + Legend shimmer execution. Three iterations on visual review (v1 → v2 → v3); v3 locked.

| # | Tier | Border |
|---|---|---|
| 1 | Rookie | `#8E8E8E` solid |
| 2 | Newcomer | `#A8C4D8` solid |
| 3 | Regular | `#7BAA86` solid |
| 4 | Veteran | `#3F8C7A` solid |
| 5 | Qualifier | `#6962C0` solid |
| 6 | Finalist | `#B0356A → #E85F90` 2-stop diagonal gradient (static) |
| 7 | Champion | `#6B0F2D → #F03B5C → #6B0F2D` 3-stop horizontal gradient (static) |
| 8 | Legend | `#C99020 → #FFE082 → #C99020` 3-stop animated gradient (Reanimated 3) |

**Legend shimmer execution:** Reanimated 3 + linear gradient mask, two states. (1) Continuous low-intensity shimmer wherever the Legend border renders — avatar in lists, Profile, League tab cards. (2) Theatrical brighter sweep on the promote-to-Legend interstitial entry (~0.6s), then settles into the continuous loop. ~30 lines in a future `<LegendBorder>` component when Phase 3 builds the avatar visual layer.

### Iterations

- **v1** had: Rookie warm grey, Newcomer bone-cream, Veteran teal, Qualifier indigo, Finalist magenta solid, Champion bronze, Legend gold shimmer.
- **CD review:** wanted Rookie pulled to true neutral gray (less warm), Newcomer with actual color identity instead of bone, gradients starting at Finalist (not just Legend), and Champion not bronze.
- **v2** applied: Rookie `#8E8E8E`, Newcomer `#A8C4D8` pale blue, Finalist 2-stop magenta gradient, Champion 2-stop crimson gradient.
- **CD review:** wanted more visible gradient on Champion.
- **v3** locked: Champion pushed to 3-stop with bright `#F03B5C` center stop, mirroring Legend's recipe in red. Champion + Legend now feel like siblings.

### Evolutions from the v1.25 directional spec

- Newcomer "white" → pale dusty blue `#A8C4D8`. Reason: white reads as invisible on cream `#FFF4DF`; pale dusty blue gives the entry tier its own identity without volume. CD voice call.
- Finalist "orange" → magenta gradient `#B0356A → #E85F90`. Reason: orange between Veteran teal and Champion crimson would have broken the cool→warm climb arc; magenta preserves the heat ramp.

### Files touched

- `super_smart_2026_mothership.md` — v1.31 → v1.32. Status line bumped with the palette-lock segment. Part 3 Avatar / League rank border section rewritten as a full table with hex values + gradient structures + Legend shimmer execution + notes. Appendix D #11 marked ✅ RESOLVED. Part 12 decision log row added for session 20. End-of-doc stamp bumped.
- `super_smart_2026_primer.md` — current-state line bumped to v1.32 with palette-lock note.
- `supersmart/docs/` — both mirrored.
- `CHANGELOG.md` — this entry.

### Implementation status

- No code yet. Phase 3 visual pass will build the `<LegendBorder>` component and wire tier colors into the avatar component.
- Hex values can be added to `constants/theme.ts` opportunistically (low-risk single edit) or held until Phase 3 begins.

---

## Session 19 — 2026-04-25 — Phase 1 audit batch 4 closed (mothership v1.30 → v1.31)

Q301–Q400 tagged across the misc→word category boundary, reviewed in one CD pass + second-pass sanity check. **Final: 90 Keep / 10 Light / 0 Heavy / 0 Retire.** Cumulative through Q1–Q400: **351 / 49 / 0 / 0** = 87.75% Keep. Four batches in, 40% of corpus audited, still zero Heavy or Retire flags.

### What landed

- **Misc Q301–Q350 (50 questions, 6 Light edits):** Q308 distractor swap (March → September because March also has 31 days, breaking the original question), Q311 typo "an Japanese" → "a Japanese", Q313 typo banruki → bunraku (correct Japanese word for puppet theater), Q317 phrasing "the the number choices" → "the number of choices", Q331 retired-mode concept-replace Arcade → Quickmatch (matches questions.ts:338 fix from session 11), Q332 retired-mode concept-replace Classic → Daily Race (matches questions.ts:339).
- **Word Q351–Q400 (50 questions, 4 Light edits):** Q351 capitalization Speaking → speaking, Q357 triple-space whitespace outlier within the Q352–Q386 cluster, Q363 distractor swap nordic → brawl (BRAWL not buildable from g,r,o,w,n — clean fail-state), Q371 trailing-space-inside-quotes typo. The "make a word using [letters]" anagram cluster (Q352–Q386) ran 94% Keep — well above the 60–75% word-category forecast.

### CD reversals on review

Six of my initial 16 marginal-or-flagged items pulled back to Keep: Q324 grammar "more"→"most" stayed "more"; Q329 and Q343 char-budget overruns (41 chars) stayed Keep — fixes proposed would have rebuilt the prompt structure for a 1-char trim, worse than the overrun; Q381 char-budget overrun (43 chars) stayed Keep — clean fix would have broken parallelism with sibling "make a word" puzzles; Q370 and Q372 distractor capitalizations (pisces/davis) stayed lowercase per CD voice call.

### Corpus-wide style sweep deferred

The "Make a word using  X" double-space prefix typo + Make/make capitalization split across Q352–Q386 (35 questions, identical normalization) is documented in the methodology + tally and held for the global sweep at end of Phase 1. Per the existing "On corpus-wide stylistic decisions" methodology section, tagging each individually would inflate the Light count (16 → 36) without adding signal. Only deviations from the pattern (Q357 triple-space, Q371 trailing-space) get individual Light tags.

### New methodology ruling

**#15 — Char-budget ceiling is a default, not absolute; CD discretion on small overruns.** ≤40 prompt / ≤15 answer ceilings remain the working budget; "over budget = automatic Light edit" stays the default. But on 1–3 char overruns where the obvious trim would degrade voice or break parallelism with siblings, CD can override to Keep. Reference resolutions: Q329 (41ch), Q343 (41ch), Q381 (43ch). Pattern: if proposing a fix worse than the overrun, surface as marginal and let CD decide.

### Calibration update

Four batches in, the original Part 8 projection of 700/150/100/50 is materially pessimistic at running 87.75% Keep. If the rate held, the corpus would land closer to 875/125/0/0 — it probably won't, since people/music/movies depths still likely carry the dated cluster. Word category opened cleanly; remaining 125 word questions (Q401–Q525) likely continue durable. Will revisit projection after batch 6.

### Files touched

- `audit_1001/audit_1001_tags.csv` — appended 100 rows for Q301–Q400
- `audit_1001/audit_1001_methodology.md` — title-line tally update, batch 4 row in running tally, cumulative Q1–Q400 row, word category Actual column updated, ruling #15 added
- `super_smart_2026_mothership.md` — status line v1.30 → v1.31 with batch 4 segment prepended, end-of-doc stamp bumped, Part 12 decision log row added for session 19 above the session 17 row
- `super_smart_2026_primer.md` — current-state line bumped to v1.31, audit progress updated to 400/87.75%, edge-case ruling count 14 → 15
- `supersmart/docs/` — all four files mirrored
- `CHANGELOG.md` — this entry

### What's not in this commit

No code changes. No spec changes outside the audit tally + decision log row + new methodology ruling. Push remains a Mac-terminal handoff.

---

## Session 18 — 2026-04-25 — Code drift cleanup (no spec changes)

Five drift items closed after a code↔mothership read-through. No version bump on the mothership — this is a code-catches-up-to-spec pass, same shape as session 11. Appendix D #49 marked ✅ resolved. End-of-doc stamp on the mothership corrected from a stale v1.25 to v1.30 (housekeeping).

### Code changes

- **`app/(tabs)/profile.tsx`** — added a SUPPORT section with a "Contact the developer" card. Tapping fires `Linking.openURL('mailto:...')` against a `SUPPORT_EMAIL` constant. Placeholder set to `support@iamsupersmart.com` (the heritage-aligned primary candidate from v1.25) with a `// TODO: confirm support email per Appendix D #40` comment so the swap is one-line when the domain locks. Resolves Appendix D #49 — the code-side tracker for this dependency.

- **`app/end.tsx`** — user-visible mode label `ARCADE` → `QUICKMATCH` (line 85). The Daily Race branch already used the live mode name; this matches it. Header comment rewritten to clarify that `mode=arcade` is an internal-only route param tied to the still-open `game.tsx` orphan question, not user-facing copy.

- **`app/questions.ts:272`** — stale-mode question rewritten. Was: `{ question: 'a game mode in Super Smart', options: ['arcade', 'blitz', 'time limit'], correct: 0 }`. Now: `{ question: 'a game mode in Super Smart', options: ['Quickmatch', 'Slowmatch', 'Stalemate'], correct: 0 }`. Same retired-vocab class as the two questions session 11 fixed at lines 338–339; this one slipped through that pass. Distractors kept the wordplay shape (real mode + two near-misses).

- **`app/challenge.tsx`** — Cream Stadium refresh of the pre-2026-04-19 stub. Old hardcoded hexes (`#dc2626`, `#fff`, `#f9fafb`, `#111827`, `#9ca3af`) replaced with `Colors`/`Fonts`/`Radius`/`CARD_DEPTH` from `theme.ts`. SafeAreaView with transparent background so the global Sunburst + Halftone show through. 3D press-down buttons matching the Profile/Avatar pattern. Copy fixed: "20 questions" → "60-second set" (matches the live 60-question Quickmatch). Footer note rewritten to point at Phase 4 ("sender's ghost, weekly league credit") instead of the old "compare scores manually" framing. Routing left at `/game` deliberately — that's gated on the still-open `game.tsx` orphan question.

- **`constants/theme.ts`** — `pink` comment updated from "Arcade card" to "Quickmatch card" (component is still called ArcadeCard, but the *mode* is Quickmatch). Dead `cyan: '#3DF2FF'` token removed (was the retired Classic card face, no live references in the tree); replaced with a one-line comment pointing readers at `dailyrace.bg` for the live light-cyan token. `yellow` comment lost its dead "Multiplayer card" half — that card never existed in this rebuild.

### Doc changes

- **`super_smart_2026_mothership.md`** — Appendix D #49 marked ✅ RESOLVED with a one-line note that the placeholder is in place and the TODO comment will catch the swap when #40 lands. End-of-doc stamp bumped v1.25 → v1.30 (housekeeping fix — top-of-doc was already at v1.30 from session 17).
- **`super_smart_2026_primer.md`** — current state paragraph picks up the cleanup pass.
- **`supersmart/docs/`** — both mothership and primer mirrored.

### Items deliberately not touched (architectural / Phase 4)

- `app/game.tsx` orphan question (no-ghost arcade round still reachable via `/end` PLAY AGAIN and `/challenge`) — needs an explicit call: repurpose as the Challenge runner, or fold PLAY AGAIN into `/echo` and delete. Flagged for a future session.
- `app/daily.tsx` 6am-ET seed anchor — Phase 4 backend territory; current local-calendar seed will be replaced server-side.
- `app/store.tsx` `AsyncStorage` wiring (Appendix D #2) — Phase 4 blocker; in-memory state is intentional pre-launch.

### What stayed in sync (re-confirmed)

Cream Stadium palette (now consistent across challenge.tsx too), Archivo Black + JetBrains Mono fonts, scoring mechanics, `FREE_LIMIT=7`, 22 ranks, 75 emotes, 3-tab nav, bot-ghost system, light-only rendering, transparent global background. The session 15 codebase audit pattern still holds.

---

## Session 17 — 2026-04-25 — Post-league UX spec locked (mothership v1.29 → v1.30)

Phase 3 design work. Appendix D #26 resolved. No code changes — doc-only pass.

### What was decided

**Appendix D #26 — "What happens after league" — fully specced.** The delivery mechanism was already locked (2026-04-24): push notification at league close → first-open interstitial (once only) → League tab result card until dismissed. This session filled in the copy, visual treatment, rewards, and push copy for all three result states.

**Promoted (top 5)**
- Full-screen interstitial. Avatar tier border animates from old color to new color as the reveal moment. Tier name drops in with weight (~0.4s delay). Legend: animated gold shimmer activates on entry.
- Copy: headline `[Tier]. Yours now.` + position-aware subline (`Top 5 of 30.` / `Top 3 of 30.` / `You finished first.`)
- Share button on interstitial and League tab result card. Share card: avatar with new border + tier name in Archivo Black + display name + wordmark, cream/sunburst background, no score.
- Push: `You're a [New Tier] now. Open Super Smart to see.`
- Reward: none beyond the tier border change — the promotion is the reward.

**Held (positions 6–25)**
- Same interstitial skeleton. No border animation (tier unchanged). Position-aware copy in three micro-brackets:
  - 6–10: `[Tier] holds. #[X] of [N].` / `Promotion was top 5. You know what to do.`
  - 11–20: `[Tier] holds. #[X] of [N].` / `Safe. Comfortable. Maybe too comfortable.`
  - 21–25: `[Tier] holds. #[X] of [N].` / `Quiet week. Next one's louder.`
- No share button. Push: `[Tier] holds. Week [N] results are in.` No reward.

**Demoted (bottom 5)**
- Same skeleton. New (lower) tier border renders at entry — no fanfare, no danger-color treatment, just the lower tier's color.
- Copy: `Not this week.` / `The door back up opens Monday.` Rookie floor variant: `Rookie.` / `Floor found. Only way is up.`
- No share button. Push: `Week [N] results are in.` (no outcome framing in the notification).
- Reward: none. Streak Shield consolation considered and closed — Streak Shield is a Daily Race mechanic; cross-wiring it into league outcomes conflates two independent systems and creates a perverse incentive.

**League tab result card (all three states)**
Compact card at top of League tab, above current-week standings. Header: `WEEK [N] · PROMOTED` / `WEEK [N] · [TIER] HOLDS` / `WEEK [N] · DEMOTED`. Avatar with tier border, tier name, `#[X] of [N] · [score] pts`. Share button for Promoted only. Permanent dismiss via × or swipe.

### Files touched
- `super_smart_2026_mothership.md` — v1.29 → v1.30. Status line updated. Part 4 Layer 4: end-of-league UX section expanded from placeholder to full spec. Part 12 decision log: session 17 row added. Appendix D #26 marked ✅ RESOLVED.
- `super_smart_2026_primer.md` — current state updated to v1.30, Phase 1 audit progress updated to 300 questions / 87.0% Keep.
- `CHANGELOG.md` — this entry.

---

## Session 15 — 2026-04-25 — Codebase + documentation audit pass (mothership v1.27 → v1.28)

Two parallel audit sweeps (one Explore agent on the React Native code, one on the docs) surfaced drift items + dead code + small contradictions accumulated over 14 sessions. CD reviewed findings and approved the fixes below. Sessions 13–14 in between were Phase 1 audit work (1001.xml tagging) — no code changes; not in this changelog.

### Code changes

- **Deleted 8 dead boilerplate files** from the original `npx create-expo-app` template:
  - `app/modal.tsx`
  - `components/themed-text.tsx`
  - `components/themed-view.tsx`
  - `components/ui/collapsible.tsx`
  - `components/parallax-scroll-view.tsx`
  - `hooks/use-color-scheme.ts`
  - `hooks/use-color-scheme.web.ts`
  - `hooks/use-theme-color.ts`

  Closed import island — none of these were referenced by the actual app. They referenced a `Colors.light.icon` / `Colors.dark.icon` shape that `constants/theme.ts` doesn't have (the actual theme is the flat Cream Stadium palette). If any of these had been imported they would have thrown `undefined.icon` at runtime. Decision: light-only is a locked mothership commitment; future dark mode is a redesign exercise not a re-import exercise. Deleted now.

- **`app/_layout.tsx`** — removed the `<Stack.Screen name="modal" ...>` registration that pointed at the now-deleted `modal.tsx`.

- **`app.json`**:
  - `userInterfaceStyle: "automatic"` → `"light"` (locks the app to light mode at the OS level; matches the runtime nav theme that was already light-only).
  - `expo-splash-screen` plugin: removed the `dark: { backgroundColor: "#000000" }` block.
  - `expo-splash-screen` plugin: `backgroundColor: "#ffffff"` → `"#FFF4DF"` (Cream Stadium cream — matches the splash spec in mothership Part 3 onboarding).

### What stayed in sync (confirmed by audit)

Cream Stadium palette in `theme.ts`, Archivo Black + JetBrains Mono fonts, scoring mechanics, `FREE_LIMIT=7` / `ONE_MORE_LIMIT=3`, 22 ranks, 75 emotes (15×5), 3-tab nav (Home / League / Profile), League tab section order, Daily Race share format, global Sunburst + Halftone in root layout, 100% custom animations (no Lottie or default-library motion), bot-ghost system rules, classic mode + kicker properly retired in code. No Phase 4 work has begun yet — schema draft is in `supabase/phase4_schema.sql` per session 13 work, not wired.

### Files touched

- 8 files deleted (above)
- `supersmart/app/_layout.tsx` — modal route registration removed
- `supersmart/app.json` — 3 edits
- `super_smart_2026_mothership.md` — v1.27 → v1.28 (status line, Part 5 free-tier rounds, Phase 7 launch-window line, Appendix D items #47–49 added, decision log session 15 row)
- `super_smart_2026_primer.md` — refreshed to current state (Phase 1 audit progress, no longer "overdue")
- `audit_1001/audit_1001_methodology.md` — lifecycle note added at top
- `CHANGELOG.md` — this entry

---

## Session 12 — 2026-04-24 — Mini-decisions bundle (mothership v1.24 → v1.25)

Five small Appendix D items locked in a serial "coffee decisions"-style session. No code changes — doc-only pass.

### Decisions locked
1. **League tiers 1–3 renamed, entry point moves to tier 2.** New ladder: **Rookie → Newcomer → Regular → Veteran → Qualifier → Finalist → Champion → Legend.** Players enter at tier 2 (Newcomer); Rookie is a demotion destination only. Avatar border colour mapping shifts by one slot at the bottom; tiers 4–8 unchanged.
2. **Wordmark splash: 2 seconds, every cold-start launch.** Water-balloon bloat fires at t=0, settles through fade-out. Previously ambiguous "2–3 seconds, onboarding-only" now locked at 2s and scoped to every launch.
3. **Emoji policy.** No emoji in questions/options/distractors (text-only corpus). Allow emoji in scraped display names from Apple/Google sign-in, with moderation pipeline catching abuse. Same rule for player-edited display names. Emotes and voice copy unchanged.
4. **Support email domain — DEFERRED with fallback picked.** Primary `support@iamsupersmart.com` (heritage-aligned). Fallback `support@supersmart.game` if original is unrecoverable. Action item for future session: confirm registrar status.
5. **Question retirement / correction path.** Three-tier severity system: Edit in place (typo/minor fix); Soft retire (`active=false`, in-flight sets preserved); Emergency recall (invalidate containing sets, cancel + re-seed Daily Race, goodwill compensation). Historical session data never retroactively edited. No in-app "report this question" button — all player feedback flows through a single "Contact the developer" email link in Profile.

### Files touched (canonical)
- `super_smart_2026_mothership.md` — v1.24 → v1.25. Status line updated. Part 3: navigation/Profile line gets the "Contact the developer" email link clause; avatar border tier colors renamed; onboarding step 1 (splash) rewritten for 2s/every-launch. Part 4 Layer 4: league tiers list renamed with entry-rule text updated. Part 12 decision log: 5 new rows with full rationales. Appendix C glossary: League tier entry updated with the new ladder. Appendix D items #13, #25, #28 marked ✅ RESOLVED; #40 marked partial/deferred with fallback recorded. End-of-doc version stamp bumped.
- `CHANGELOG.md` — this entry.

### No code changes this pass
League tier names and the splash flow are both Phase 3/4 work items (not currently wired in code — audit earlier today confirmed no existing league-tier references in app/). When Phase 3 builds the onboarding flow and Phase 4 builds the league system, they'll pull from v1.25 spec directly.

---

## Session 11 — 2026-04-24 — Code caught up to mothership v1.24

No spec changes. Full code↔mothership audit surfaced five code mismatches from today's decisions. All fixed in one pass.

### Fixed
- **`app/echo.tsx` — ghost names** expanded from 5 same-pattern (`Word_NN`) to 30 mixed-pattern across three styles (adjective+noun, firstname+number, curated handles), per the v1.23 bot-ghost rule that names must be deliberately non-pattern to prevent detection.
- **`app/echo.tsx` — ghost score** rewritten from the old "player's final score ± 35% swing" formula to random 300–3,000 independent of player score. Generated once at match start on the ghost object (`ghost.score`), revealed at round end. Per v1.23 bot-ghost spec — low floor ensures new players typically win their first few games.
- **`app/echo.tsx` — ghost avatar** now randomizes across all 8 colors / 8 eye styles / 8 mouth styles from the full avatar library (including Pro-locked items — soft exposure to purchasable cosmetics per v1.23). Replaces three hardcoded `eyes="square" mouth="smirk"` calls at lines 335/375/433.
- **`app/questions.ts:338–339` — two stale question-bank entries** referenced retired modes. Rewritten: *"you start with ___ in Arcade mode"* → *"you start with ___ in Quickmatch"*; *"you start with ___ in Classic mode"* → *"you start with ___ in Daily Race"*. Same structures, current mode vocabulary. (Modes Classic and standalone Arcade were retired 2026-04-18 session 3.)
- **`components/LivePlayersStrip.tsx:17` — avatar colors** swapped from three non-library shades (`#FFD23F / #9EFF3D / #3DAEFF`) to three library shades (`#FF6B9D / #FFB86B / #B86BFF`: pink-free, orange-free, purple-Pro). Brand consistency + soft exposure to Pro cosmetics matches the bot-ghost avatar rule.

### Not built, flagged as expected future phase work
Full audit confirmed the following are not-yet-implemented per phase spec (not mismatches): onboarding flow (Phase 3), skill tier + league tier systems (Phase 4), Supabase wiring (Phase 4), "Unstoppable" 10-streak moment UI (Phase 3), Streak Shield IAP (Phase 4+), narrator callouts (Phase 3 audio), Layer 2 mascot reactions (Phase 3), end-of-league interstitials (Phase 3/4 copy), Pro purchase flow + RevenueCat (Phase 6), PostHog flag-based tunables (Phase 6).

### Files touched
- `app/echo.tsx` — ghost name pool, ghost score formula, ghost avatar fields + three Avatar renders
- `app/questions.ts` — lines 338–339 rewritten
- `components/LivePlayersStrip.tsx` — avatar color pool
- `CHANGELOG.md` — this entry

### What stayed in sync (confirmed consistent)
Cream Stadium palette, fonts, scoring mechanics (100/+50/3-5-7/−50/1s-lock), `FREE_LIMIT=7`/`ONE_MORE_LIMIT=3`, 22 ranks, 75 emotes (15×5), 3-tab nav, League tab section order, Daily Race share format (3-line scoreboard + on-screen grid), global Sunburst + Halftone at locked colors/opacity, transparent nav theme, Classic mode + kicker properly retired in code.

---

## Session 10b — 2026-04-24 — Consistency audit after v1.23 reversal (mothership v1.23 → v1.24)

No spec changes. Doc top-to-bottom read surfaced five places the v1.23 bot-ghost reversal left stale references. All cleaned up in one pass.

### Fixed
- **Part 3 Onboarding step 4** — "ghost-free first round, ghost opponent skipped" rewritten to "standard Quickmatch with bot-ghost opponent, typically winnable via 300–3,000 bot score range." The confidence-build intent is preserved; the mechanic is now consistent with the bot-ghost system rather than a special-case empty opponent.
- **Part 10 Phase 3 exit criteria** — mirror of the onboarding one-liner updated accordingly.
- **Part 12 Decision Log (2026-04-24 onboarding entry)** — kept as historical record but annotated with a trailing `[Superseded later 2026-04-24 by the bot-ghost system...]` cross-reference, so readers of that entry immediately see the reversal.
- **Appendix D item #22 — Launch-day Quickmatch UX** — marked ✅ RESOLVED. The concern (empty pool on launch day) is fully handled by the bot-ghost fill; launch day won't have an empty ghost pool.
- **Appendix D resolved section — "League matchmaking within cluster"** — wording updated from "weighted random ±1 tier" to "strict same-tier (a league of 30 is a leaderboard cohort, not a matchmaking pool)" to match the v1.22 clarification.

### Files touched (canonical)
- `super_smart_2026_mothership.md` — v1.23 → v1.24. Status line updated. Five targeted edits described above. End-of-doc version stamp bumped.
- `CHANGELOG.md` — this entry.

---

## Session 10 — 2026-04-24 — Phase 4 schema draft + bot-ghost system locked (mothership v1.22 → v1.23)

Big session. Three threads landed together in one push.

### Phase 4 Supabase schema — first draft
Created `supersmart/supabase/phase4_schema.sql` — 11 new tables, 2 triggers, 7 inline `[OPEN]` items. Covers identity (`players`, `push_tokens`, `pro_entitlements`), gameplay fact table (`sessions`), multiplayer (`question_sets`, `ghost_pool`, `challenges`, `daily_races`), and league + streak systems (`leagues`, `league_memberships`, `streak_shields`). Plus `locale` column extensions on the existing 3 Phase 3 tables. Original `supabase/schema.sql` left untouched — merge when Phase 4 build starts.

Indexes match the leaderboard queries we specced: tie-breaker cascade composite on `sessions` for the Daily Race board; partial index on `sessions(player_id, question_set_id) where source='quickmatch'` for the no-replay filter; covering index for Global all-time aggregates. Triggers auto-maintain `players.pro` from `pro_entitlements` and `league_memberships.weekly_score` from session inserts — no batch jobs needed for either.

### Bot-ghost system — major reversal
Reverses two locked decisions (2026-04-18 session 3 and 2026-04-19 session 5) that had ruled out bots in favour of honest "you're first, seed the pool" messaging. The Honesty Layer section of Part 4 is retired.

New rule: when a Quickmatch player is matched to a set with no human ghost at their skill tier, the matchmaking Edge Function generates an ephemeral bot ghost — single-use, never persisted in `ghost_pool`, indistinguishable from a human opponent in the UI. Score range 300–3,000 (most first games will be wins — intentional confidence build). Names follow no single pattern to prevent detection. Avatar randomly drawn from the full library including Pro-locked items (soft exposure to purchasable cosmetics). Bots graduate out automatically as soon as a human plays a set at a tier — subsequent matches at that tier land on the human ghost.

**Leagues are excluded, always.** Bots never enter a League of 30, never appear on a league leaderboard. The 2026-04-19 session 7 "no ghost-fill in leagues" rule still holds absolutely — leagues are the public-competitive surface, bots stay in Quickmatch ghost matching only.

### No-replay rule made explicit
"No player ever sees the same question set twice in Quickmatch" (with the Challenge link exception) was already the core guarantee in Part 4 Layer 1, but the fallback case was underspecced. Candidates considered: silent replay of least-recently-played; on-demand generation of brand-new sets with a three-strike circuit breaker. Both rejected in favour of the bot-ghost fill — it preserves the no-replay guarantee absolutely and folds the edge case into the general-case solution.

### Files touched (canonical)
- `super_smart_2026_mothership.md` — v1.22 → v1.23. Status line updated. Part 4 Layer 1 "Fresh sets" section replaced with the new "Bot-filled ghosts" spec. Part 4 Honesty Layer retired (kept in doc, marked retired, for reader legibility). Part 4 Layer 4 reinforces "no bots in leagues, ever." Appendix C glossary updated: "Fresh set" redefined, new "Bot ghost" entry added. Part 12 decision log: three new rows (bot-ghost system, Phase 4 schema draft, no-replay rule lock). Appendix D #5 annotated with DRAFT LANDED status. End-of-doc version stamp bumped.
- `supabase/phase4_schema.sql` — new file, 11 tables + 2 triggers + 7 open items. (Second pass added: no-replay partial index on sessions, comment block on question_sets, fixed ghost_pool FK bug, Edge Function notes updated for bot-ghost flow.)
- `CHANGELOG.md` — this entry.

### What this does NOT include
- No code changes to the app. Schema file exists but nothing is wired.
- Edge Functions still to build (separate workstream, probably one session per function): matchmaking+validator, league close/open, daily race seed, ghost pool retirement, pro shield grant, skill tier recalc, RevenueCat webhook, push dispatch.
- Auth library (Appendix D #1), anti-cheat validator (Appendix D #6), RLS policy depth, answer-sequence storage cost stress test — all still open and flagged inline in the schema file.

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
