# 1001 Audit — Methodology (v1, Session 13, 2026-04-24)

Phase 1 of the Super Smart 2026 rebuild. This doc defines how we tag every question in `1001.xml` with one of four labels: **Keep / Light edit / Heavy edit / Retire**. First 100 questions tagged under this methodology — rules refined as edge cases hit.

Creative director is final editor. Where Claude's call and creative director's call disagree, creative director wins — no argument.

---

## The four labels

**Keep** — works as-is in 2026. Ships untouched into v2.

**Light edit** — needs a single small fix. Qualifying fixes:
- Typo or spelling correction (`Celcius` → `Celsius`, `jumangy` → `Jumanji`)
- Year / current-fact update (`periodic table has 118 elements` — already current, no edit)
- Single distractor swap (dated joke, weak pun, factually off distractor)
- Factual nit (wrong initials, wrong abbreviation, technically imprecise phrasing)
- Answer-length trim to hit the ≤15-char ceiling
- Category reassignment under the v2 rebalance (e.g. history-of-science questions moving from `science` to `history`)
- Phrasing tightness (e.g. adding a word for disambiguation, not a full rewrite)

The test: if the concept works, the voice is fine, and the fix is under ~10 seconds of editor time, it's Light.

**Heavy edit** — concept works, execution is dated or off-voice, needs a rewrite beyond a one-line swap. Qualifying signals:
- Two or more distractors need replacement
- Prompt phrasing is flat and the joke has to be rebuilt
- Reference is salvageable but needs reframing (e.g. 2010-era context, still durable figure but the question's angle ages badly)

**Retire** — can't be saved. Qualifying signals:
- Anchor is a public figure with <15-year durability (2008–2012 pop stars, reality-TV personalities, short-shelf political figures)
- Joke hinges on a meme or phrase that's no longer legible
- Factual premise is now wrong and fixing it kills the question
- Duplicates another question that already did it better

---

## Voice / brand standard (applied per question)

From mothership Part 6 + Part 1 recovered DNA:
- **Playful, self-aware, confident but not smug.** Never mocks the player.
- **Humor can live anywhere** — prompt, answer options, distractor set, or the pairing. Not every question needs to be funny. Dry/clean informational questions are legitimate pacing material. Humor density is a corpus-level target, not a per-question tax.
- **Fourth-wall breaks** allowed in distractors ("don't pick this", wink references).
- **Conversational phrasing** preferred over test-speak.

## Character discipline

Recovered corpus ceiling: **≤40 chars prompt / ≤15 chars answer.** Typical ≤23 prompt / ≤10 answer.
- Over 15 chars in answer → Light edit (shorten).
- Over 40 chars in prompt → Light edit (tighten). None hit this in the first 100.

## Durability test

A question is durable if it would read cleanly to a 14-year-old in 2036 — 10 years past launch.
- Classical/historical figures (Darwin, Curie, Newton, Tesla, Pasteur): durable → Keep.
- Cultural figures with permanent name recognition via brand/archive (M. Jackson, Oppenheimer, G. Foreman as grill brand, Professor X as a Marvel constant): durable → Keep.
- Political figures whose relevance was event-bound and fading (Yeltsin is now fully historical, fine; 2012-era domestic politicians would not be).
- Memes/catchphrases: keep only if they've already proven 10+ years of staying power ("over 9000" is borderline but survives; a 2011-specific meme would not).

## Edge-case rulings (recorded as we hit them)

1. **Category mismatches in the source XML.** Many `science` items are really history-of-science (Industrial Revolution, ship classes, inventor trivia). Rule: if the question is clearly not science under the v2 rebalance (Part 8), flag Light edit with note `recat → history/misc`. If it's history-of-science and reasonable readers would accept it under `science`, leave it.

2. **Hemisphere-specific questions.** Q11/Q12 (summer/winter solstice by month) are only true in the Northern Hemisphere. Launching globally, this is off. Light edit — specify "in the Northern Hemisphere" or reframe to "June solstice" / "December solstice".

3. **Politically sensitive nonsense-distractors.** The corpus has jokey element names like `ukrainium` (Q27, "U stands for"). Reads differently post-2022. Light edit — swap distractor. Not a Retire; the question works.

4. **Dated celebrity joke-distractors.** 50 Cent as `F. Cent` (Q61) — the joke still reads but 50 Cent's cultural centrality is fading. Light edit — swap for a more durable distractor. Contrast with M. Jackson / R. Downey Jr. / Oppenheimer gag (Q38) — those figures are brand-permanent, Keep.

5. **Factual nits on names/initials.** Q54 "R.D. Roentgen" — should be W.C. Röntgen (Wilhelm Conrad). Light edit, initials only.

6. **Unclear puns.** Q55 "T. Duwde" — possibly meant The Dude (Big Lebowski) but reads as nonsense. Light edit — replace with a legible joke distractor.

7. **Too-easy questions.** Q8/Q14 (Sun vs Earth vs Moon bigger/smaller) are trivially easy. They survive as Keep because pacing in a 60-second round benefits from easy-win beats. If creative director disagrees, these move to Retire — my call is Keep.

8. **Technical imprecisions that aren't quite wrong.** Q17 "closest galaxy to ours" → Andromeda is the closest large galaxy, not the closest galaxy (Canis Major Dwarf is closer). Light edit — add "large" or reframe.

9. **Answers over 15 chars.** Q38 "J. R. Oppenheimer" = 17 chars. Light edit — shorten to "Oppenheimer".

10. **Typos in the source XML.** Q31 `Celcius`, Q41 `miliseconds`, Q80 `tegulates`, Q93 `D. Mendelev`. All Light edit — typo fixes.

11. **Trademark-evocative misspellings are features, not bugs.** When a distractor misspells a protected name in a way that preserves the joke while stepping clear of the trademark (e.g. Q19 `jumangy` evoking *Jumanji* without using it), keep the misspelling as-is. The IP-safety benefit outweighs the spelling discipline. This ruling came from the creative director on session 13 — `jumangy` was flagged as a typo in the first Claude pass and correctly reversed on review. Apply the same logic to any future questions where a cheeky distractor uses a near-spelling of a protected name, character, brand, or franchise. Generic terms with no trademark (e.g. "unobtainium", which predates Avatar and has no trademark holder) can be used at correct spelling without concern.

12. **Hemisphere disambiguation — two acceptable patterns.** For questions that reference solstices, equinoxes, or other hemisphere-specific astronomical events, both of these patterns are acceptable:
    - **Pattern A — explicit "Northern Hemisphere" qualifier.** Example: *"Northern Hemisphere winter solstice in"* → December (Q12). Non-tautological; the player has to know that N. Hem. winter = December. More conversational; voice lives in the phrasing.
    - **Pattern B — hemisphere-neutral astronomical term with the month in the name.** Example: *"the June solstice occurs in ___"* → June (Q11). Technically tautological (the month is in the prompt) but accepted as a voice/pacing choice — the tautology rewards players who recognize the astronomical term without punishing those who don't.
    
    Pick one per question. Don't mix within a paired set of solstice/equinox questions if they're sibling-shaped — parallel structure matters more than which pattern.

13. **Tautology is OK when the creative director says it's OK.** Some tautological or very-easy questions are legitimate pacing material in a 60-second round. The original 1001 includes plenty of these (Q8 "larger than the others" Sun/Earth/Moon; Q14 smaller version; Q11 now in pattern B). Don't auto-retire a question for being easy or tautological — flag it if you think the round feels slack because of it, but default toward Keep.

---

## What NOT to tag as a reason to retire

- Dry-but-accurate questions. The 1001 has pacing-filler; that's fine.
- Questions that feel "old school" in format. That's the whole brand.
- Category imbalance. We fix that in Phase A by tagging, not by retiring.

---

## Deliverable format

- `audit_1001_tags.csv` — per-question row: `q_num, category, text, option1, option2, option3, answer, q_chars, a_chars, tag, note`. Append-only as future batches roll in. Column order fixed so pasting new batches works.
- This methodology doc — updated in-place as new edge cases hit. Version-tagged at the top.

## How future batches stay consistent with this one

1. Claude drafts tag + note. Creative director reviews in batches.
2. If a new edge case appears, log it in the "Edge-case rulings" section above before committing the tag. That's the forcing function keeping consistency.
3. Per-question review budget is the forcing function keeping quality — creative director spends 10–30 seconds per question reviewing, not per question researching.
4. When tagging feels uncertain, default toward **Light edit over Keep** and **Heavy edit over Retire** — the cost of over-flagging is a second review pass; the cost of under-flagging is a dated question slipping into launch.

## Review-before-commit protocol *(added session 13, 2026-04-24 — after creative director flagged that Claude committed the first batch without approval)*

Audit work is creative-editorial work, not mechanical. Every batch must pass through creative director review **before anything gets written to the mothership decision log, mirrored into `supersmart/docs/`, or committed to git.**

Per-batch flow:

1. Claude drafts the CSV rows for the batch (typically ~100 questions) and the methodology-doc delta if any new edge cases surfaced.
2. Claude presents the batch for review: full list of non-Keep tags with reasons, plus a flagged-questions sample (any 5–10 Claude was least certain about). Not the whole CSV — only what needs eyes.
3. **Creative director approves, rejects, or overrides specific tags.** Claude does not interpret silence as approval.
4. Only after explicit approval: Claude updates the mothership, mirrors to `supersmart/docs/`, and commits. Push remains a Mac-terminal handoff per the existing git workflow.

If a future batch is approved in pieces (e.g. creative director signs off on 80 of 100 and wants to revisit 20), Claude holds the commit until the final 20 are settled rather than committing two partial batches.

**The rule extends beyond the audit.** Anything creative-editorial in this project — question drafts (Phase 5), style-guide copy, rank/callout copy tuning, marketing copy — goes through the same review-before-commit gate. Technical edits (mothership status updates, documentation cleanup, code changes) do not require the same gate — those can be committed and shown after the fact.

**Why this rule exists:** silent approval of creative work drifts the voice away from the creative director, which is the one thing this audit is designed to prevent. The whole point of Phase 1 is to lock voice and durability standards through explicit calls, not inferred ones.

---

## How to run the next batch *(playbook — written session 13, use for Q101+ and all future batches)*

A fresh Claude (or the same one in a new session) should be able to open this doc, read only this section, and tag the next 100 questions consistently with what we locked in the first batch. The rest of the doc is the "why"; this section is the "what to do."

### 0 — Orient

1. Read the mothership status line + Appendix D first (that's the project's live-state check).
2. Read the rest of this methodology doc top-to-bottom once. Don't skip the edge-case rulings — most of the judgment lives there.
3. Open `audit_1001/audit_1001_tags.csv` and look at the existing tags — that's the calibration reference. If your first 10 tags on the new batch feel wildly different in distribution, slow down and re-read the edge cases.

### 1 — Tag the batch

For each question, assign one of **Keep / Light edit / Heavy edit / Retire** using the definitions in "The four labels" section above. In the CSV note column, write a single-line action-oriented note for any non-Keep tag (what would actually change, not why).

Pattern to follow (lifted from the first 100):
- **Keep** → empty note
- **Light edit** → note starts with the action verb: *"typo: X → Y"*, *"swap distractor Z → W"*, *"trim prompt to '...'"*, *"recategorize: science → misc"*, *"phrasing: X → Y"*.
- **Heavy edit** → note identifies the two-plus things needing rework.
- **Retire** → note says why no fix works.

Check char budgets as you go: **prompt ≤ 40, answer ≤ 15**. These are hard ceilings — over-budget = automatic Light edit.

Flag category mismatches under the v2 rebalance (mothership Part 8): history-of-science is fine under `science`, but clear history / military / misc misplacements should be Light-edit notes `recat → history` / `recat → misc`.

### 2 — Present for review

Surface the batch to the creative director in this exact shape:
- **Final numbers:** *"X Keep / Y Light / Z Heavy / W Retire"*
- **All non-Keep tags**, as a table with columns: `Q#`, `Original (prompt + options + answer)`, `What changes`, `Reason`. Original column must be included — creative director reviews with fresh eyes, not your framing.
- **Marginal calls**, separated from the main table — any question where you were close to a different tag. Be explicit about uncertainty.
- **Any new edge cases hit**, proposed as additions to the methodology doc edge-case list.

Do NOT commit, mirror, or write to the mothership yet. Wait for verdicts.

### 3 — Apply verdicts

Creative director will go question-by-question. Apply each verdict to the CSV. When a verdict reverses a flag, set the tag back to Keep and clear the note.

If the creative director asks for a specific phrasing, distractor set, or answer, apply it exactly. If they ask for options ("suggest me answers so I can pick"), present 3–4 clean choices with one recommendation, then wait for the pick.

### 4 — Second-pass sanity check

After verdicts are applied, run the 100 questions again with fresh eyes. Look specifically for things you missed the first time — typos, grammar nits (comparative vs superlative with three options), awkward phrasing, obvious category mismatches. Present any new finds in the same table shape as step 2 and collect verdicts before committing.

*(On session 13, this step caught 4 additional items: Q73 typo "nucleid", Q9 "farther"→"farthest", Q95 grammar parallel, Q68 phrasing. Assume there will always be something on the second pass.)*

### 5 — Lock + document

Once all verdicts are in:
1. Update the CSV with final tags + notes.
2. Add any new edge-case rulings to this methodology doc.
3. Append a one-row entry to the mothership decision log (table in Part 12) capturing: date + session #, batch range (e.g. "Q101–Q200"), final split (e.g. "82/15/2/1"), a 2–3 sentence narrative of what drove the Heavy/Retire flags in this batch, any new methodology rulings, and the corpus-wide running tally.
4. Mirror all changed files into `supersmart/docs/`.
5. Commit (or amend) in `supersmart/`. Tell the creative director the exact Mac-terminal push command per the existing git workflow.

### 6 — Running tally

Maintain a "corpus running tally" block at the top of this methodology doc (in a table) after each batch, so future sessions can see at a glance: how many questions audited, how many remaining, split so far, projected split. See the tally table below (updated after each batch).

### Per-category calibration notes

Distribution of the 1001 by category: `misc: 230, word: 175, math: 175, geography: 161, science: 120, music: 50, people: 50, movies: 30, literature: 10`.

Expected difficulty of each category's audit (my forward guess, update after each batch closes):

| Category | Expected % Keep | Why |
|---|---|---|
| Science | 80%+ | Classical science durable; first 100 ran 81/19/0/0 |
| Math | 80%+ | Pure math is timeless; expect mostly char/typo edits |
| Geography | 70–80% | Country borders and capitals change rarely but do change |
| Word / Wordplay | 60–75% | Language evolves; some puns age |
| Literature | 70%+ | Small category, classic anchors (likely Keep-heavy) |
| People | 40–60% | Historical figures durable; 2008–2012 celebrities not |
| Music | 40–60% | Classical survives; 2008–2012 pop won't |
| Movies | 40–60% | Classics + franchise anchors survive; 2010-era rom-coms don't |
| Misc | 30–50% | Grab-bag of jokes, oddities, dated references; expect most Heavy/Retire to live here |

**Do not project the science split onto the whole corpus.** The mothership's Part 8 projection of 700/150/100/50 is the working estimate; the science-heavy early batches will drag up the Keep rate and the later categories will drag it down.

### Running tally

*(update this table after each batch closes)*

| Batch | Questions | Keep | Light | Heavy | Retire | Notes |
|---|---|---|---|---|---|---|
| 1 | Q1–Q100 (all science) | 81 | 19 | 0 | 0 | Session 13, 2026-04-24. Two full CD review passes. |
| 2 | Q101–Q200 | — | — | — | — | pending |
| 3 | Q201–Q300 | — | — | — | — | pending |
| ... | ... | | | | | |
| **Total** | **1001** | | | | | |
