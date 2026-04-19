// content.ts — All editable game content in one flat file.
//
// Phase 4 migration plan:
//   This file is the authoritative source for emotes, ranks, and (eventually) questions.
//   When Supabase is wired up, replace these arrays with API calls.
//   supabase/schema.sql is the ready-to-run migration that matches this shape.
//
// Editing guide:
//   • Add/remove emotes freely — keep categories balanced.
//   • Rank thresholds are inclusive upper bounds. Last entry has maxScore: null (catch-all).
//   • All emotes must have an emoji. Voice: cheeky, self-aware, never mean.

// ─── Post-game interview emotes ───────────────────────────────────────────────
// 5 categories × N lines. One from each category shown per game.

export type EmoteCategory = 'bad' | 'ok' | 'good' | 'mocking' | 'supportive';

export interface Emote {
  category: EmoteCategory;
  text: string;
  active: boolean;
}

export const EMOTES: Emote[] = [
  // ── BAD (15) ────────────────────────────────────────────────────────────────
  { category: 'bad', text: "not my finest hour. 💀",                        active: true },
  { category: 'bad', text: "humbling. genuinely humbling. 😶",              active: true },
  { category: 'bad', text: "i peaked in primary school. 📉",                active: true },
  { category: 'bad', text: "the questions were biased. 🤨",                 active: true },
  { category: 'bad', text: "brain not loading, please wait. ⏳",            active: true },
  { category: 'bad', text: "we don't talk about this round. 🤐",            active: true },
  { category: 'bad', text: "a new personal low. 🎖️",                        active: true },
  { category: 'bad', text: "technically i still played. 👏",                active: true },
  { category: 'bad', text: "i want to be alone right now. 🚪",              active: true },
  { category: 'bad', text: "i won't be back. 🤖",                           active: true },
  { category: 'bad', text: "et tu, my brain? 🗡️",                          active: true },
  { category: 'bad', text: "i came, i saw, i embarrassed myself. 🏛️",      active: true },
  { category: 'bad', text: "to play or not to play... 🎭",                  active: true },
  { category: 'bad', text: "it was the worst of times. 📖",                 active: true },
  { category: 'bad', text: "back to 3rd grade for me. 🎒",                  active: true },

  // ── OK (15) ─────────────────────────────────────────────────────────────────
  { category: 'ok', text: "a solid, strong 5/10 performance. 📊",           active: true },
  { category: 'ok', text: "consistent mediocrity, my brand. 🏷️",            active: true },
  { category: 'ok', text: "room to grow. lots of it. 🌱",                   active: true },
  { category: 'ok', text: "to mediocrity, and beyond. 🚀",                  active: true },
  { category: 'ok', text: "middest mid to mid them all. 😐",                active: true },
  { category: 'ok', text: "done worse. been better. ↕️",                    active: true },
  { category: 'ok', text: "fine. finally. 🏁",                              active: true },
  { category: 'ok', text: "average at being average. 📐",                   active: true },
  { category: 'ok', text: "i won the mid-off. 🏅",                          active: true },
  { category: 'ok', text: "just above below-average. ↗️",                   active: true },
  { category: 'ok', text: "i put the 'me' in mediocre. 🙋",                 active: true },
  { category: 'ok', text: "filed under: OK. 🗂️",                            active: true },
  { category: 'ok', text: "boringly average. 😴",                           active: true },
  { category: 'ok', text: "very mean, mathematically speaking. 📐",         active: true },
  { category: 'ok', text: "very par of me. 🏌️",                             active: true },

  // ── GOOD (15) ───────────────────────────────────────────────────────────────
  { category: 'good', text: "i'm built different. 🧠",                      active: true },
  { category: 'good', text: "i screenshot my score. 📸",                    active: true },
  { category: 'good', text: "they'll know my name. 🫵",                     active: true },
  { category: 'good', text: "peak performance; performed by me. 👑",        active: true },
  { category: 'good', text: "i just won. 🏆",                               active: true },
  { category: 'good', text: "i score high scores. 🎯",                      active: true },
  { category: 'good', text: "outsmarting the smart. 🎯",                    active: true },
  { category: 'good', text: "confidently correct. ✅",                      active: true },
  { category: 'good', text: "i came, i saw, i won. 🏛️",                    active: true },
  { category: 'good', text: "survival of the smartest. 🧬",                 active: true },
  { category: 'good', text: "my score is inevitable. ⚡",                   active: true },
  { category: 'good', text: "unbothered. undefeated. 🕶️",                   active: true },
  { category: 'good', text: "i set bars then raise them. 📏",               active: true },
  { category: 'good', text: "first place feels familiar. 🥇",               active: true },
  { category: 'good', text: "the best at being best. 💫",                   active: true },

  // ── MOCKING (15) — ghost speaking to the next opponent ────────────────────
  { category: 'mocking', text: "you're not ready. 😏",                      active: true },
  { category: 'mocking', text: "bold of you to try. 🤷",                    active: true },
  { category: 'mocking', text: "this should be quick. ⏱️",                  active: true },
  { category: 'mocking', text: "i don't lose. check the record. 📋",        active: true },
  { category: 'mocking', text: "i've beaten better. 💅",                    active: true },
  { category: 'mocking', text: "best of luck. you'll need it. 🙏",          active: true },
  { category: 'mocking', text: "spoiler: i win. 🔮",                        active: true },
  { category: 'mocking', text: "skill diff. 💅",                            active: true },
  { category: 'mocking', text: "not even close. sorry. 💅",                 active: true },
  { category: 'mocking', text: "outplayed before you started. 😏",          active: true },
  { category: 'mocking', text: "boo. also your score. 👻",                  active: true },
  { category: 'mocking', text: "i don't take Ls. i leave them. 📝",         active: true },
  { category: 'mocking', text: "the house always wins. i'm the house. 🏠",  active: true },
  { category: 'mocking', text: "my pb is your ceiling. 🏗️",                 active: true },
  { category: 'mocking', text: "rent free. that's where i'll live. 💭",     active: true },

  // ── SUPPORTIVE (15) — ghost cheering on the next opponent ──────────────────
  { category: 'supportive', text: "i believe in you. no, really. 🫶",       active: true },
  { category: 'supportive', text: "your streak starts here. 🔥",            active: true },
  { category: 'supportive', text: "make your mother proud! 🫶",             active: true },
  { category: 'supportive', text: "your best game coming up. ⭐",            active: true },
  { category: 'supportive', text: "you were built for this. 💪",            active: true },
  { category: 'supportive', text: "you put the win in winning. ✊",          active: true },
  { category: 'supportive', text: "bet on yourself. every time. 🎰",        active: true },
  { category: 'supportive', text: "believe. ✨",                             active: true },
  { category: 'supportive', text: "fortune favours you. 🍀",                active: true },
  { category: 'supportive', text: "rooting for you from the cloud. ☁️",     active: true },
  { category: 'supportive', text: "carry the torch. and the streak. 🔥",    active: true },
  { category: 'supportive', text: "you were born for this. 🌟",             active: true },
  { category: 'supportive', text: "smart money's on you. 💰",               active: true },
  { category: 'supportive', text: "win like nobody's watching. 👀",         active: true },
  { category: 'supportive', text: "let's go you! 🙌",                       active: true },
];

// Helper: pick one active emote per category, return as ordered array [bad, ok, good, mocking, supportive]
export function pickInterviewEmotes(): string[] {
  const categories: EmoteCategory[] = ['bad', 'ok', 'good', 'mocking', 'supportive'];
  return categories.map(cat => {
    const pool = EMOTES.filter(e => e.category === cat && e.active);
    return pool[Math.floor(Math.random() * pool.length)].text;
  });
}

// ─── Ranks ────────────────────────────────────────────────────────────────────
// Ordered from lowest to highest. maxScore: null = catch-all top rank.

export interface Rank {
  maxScore: number | null;
  label: string;
}

export const RANKS: Rank[] = [
  { maxScore: 0,    label: 'Really?' },
  { maxScore: 200,  label: 'Heartbreaking' },
  { maxScore: 300,  label: 'F for Effort' },
  { maxScore: 400,  label: 'Sad' },
  { maxScore: 500,  label: 'Unfortunate' },
  { maxScore: 700,  label: 'Poor' },
  { maxScore: 900,  label: 'Amateur' },
  { maxScore: 1200, label: 'Tolerable' },
  { maxScore: 1500, label: 'Average' },
  { maxScore: 1800, label: 'Acceptable' },
  { maxScore: 2100, label: 'Decent' },
  { maxScore: 2400, label: 'Respectable' },
  { maxScore: 2800, label: 'Good' },
  { maxScore: 3200, label: 'Smart' },
  { maxScore: 3600, label: 'Great' },
  { maxScore: 4000, label: 'Terrific' },
  { maxScore: 4500, label: 'Fantastic' },
  { maxScore: 5000, label: 'Excellent' },
  { maxScore: 5500, label: 'Elite' },
  { maxScore: 6200, label: 'Genius' },
  { maxScore: 7000, label: 'Mastermind' },
  { maxScore: null, label: 'Super Smart!' },
];

// Helper: derive rank label from score (mirrors questions.ts#getRank — Phase 4: delete that one)
export function getRankLabel(score: number): string {
  for (const rank of RANKS) {
    if (rank.maxScore === null || score <= rank.maxScore) return rank.label;
  }
  return RANKS[RANKS.length - 1].label;
}
