-- Super Smart 2026 — Supabase Schema
-- Phase 4 migration: run this in Supabase SQL editor to scaffold all content tables.
-- After running, seed emotes and ranks from app/content.ts using the INSERT blocks below.
-- Questions can be migrated from app/questions.ts in a separate seed script.
--
-- Row-level security is intentionally open for reads (public trivia data).
-- Writes require service role key (admin only).

-- ─── Extensions ───────────────────────────────────────────────────────────────

create extension if not exists "uuid-ossp";

-- ─── Emotes ───────────────────────────────────────────────────────────────────

create table if not exists emotes (
  id          uuid primary key default uuid_generate_v4(),
  category    text not null check (category in ('bad', 'ok', 'good', 'mocking', 'supportive')),
  text        text not null,
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table emotes enable row level security;

create policy "emotes_read_public"
  on emotes for select
  using (true);

-- ─── Ranks ────────────────────────────────────────────────────────────────────

create table if not exists ranks (
  id          uuid primary key default uuid_generate_v4(),
  max_score   integer,           -- null = catch-all top rank
  label       text not null,
  sort_order  integer not null,  -- ascending; lower sort_order = lower rank
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table ranks enable row level security;

create policy "ranks_read_public"
  on ranks for select
  using (true);

-- ─── Questions ────────────────────────────────────────────────────────────────

create table if not exists questions (
  id          uuid primary key default uuid_generate_v4(),
  question    text not null,
  option_a    text not null,
  option_b    text not null,
  option_c    text not null,
  correct     integer not null check (correct in (0, 1, 2)),  -- 0=A, 1=B, 2=C
  category    text,              -- optional: 'geography', 'science', 'pop', etc.
  difficulty  integer default 1 check (difficulty between 1 and 5),
  active      boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table questions enable row level security;

create policy "questions_read_public"
  on questions for select
  using (true);

-- ─── Seed: Emotes ─────────────────────────────────────────────────────────────
-- Copy of app/content.ts EMOTES — update both in sync until Phase 4 wires Supabase.

insert into emotes (category, text) values
  -- BAD (15)
  ('bad', 'not my finest hour 💀'),
  ('bad', 'humbling. genuinely humbling. 😶'),
  ('bad', 'i peaked in primary school 📉'),
  ('bad', 'the questions were biased 🤨'),
  ('bad', 'brain not loading, please wait ⏳'),
  ('bad', 'we don''t talk about this round 🤐'),
  ('bad', 'a new personal low 🏆'),
  ('bad', 'technically i still played 👏'),
  ('bad', 'i want to be alone right now 🚪'),
  ('bad', 'i won''t be back. 🤖'),
  ('bad', 'et tu, my brain? 🗡️'),
  ('bad', 'i came, i saw, i embarrassed myself 🏛️'),
  ('bad', 'to play or not to play... 🎭'),
  ('bad', 'it was the worst of times. 📖'),
  ('bad', 'back to 3rd grade for me 🎒'),
  -- OK (15)
  ('ok', 'a solid, strong 5/10 performance 📊'),
  ('ok', 'consistent mediocrity, my brand 💅'),
  ('ok', 'room to grow. lots of it. 🌱'),
  ('ok', 'to mediocrity, and beyond 🚀'),
  ('ok', 'middest mid to mid them all 😐'),
  ('ok', 'done worse. been better. ↕️'),
  ('ok', 'fine. finally. 🏁'),
  ('ok', 'average at being average 📐'),
  ('ok', 'i won the mid-off. 🥇'),
  ('ok', 'just above below-average. ↗️'),
  ('ok', 'i put the ''me'' in mediocre 🙋'),
  ('ok', 'filed under: OK 🗂️'),
  ('ok', 'boringly average 😴'),
  ('ok', 'very mean, mathematically speaking. 📐'),
  ('ok', 'very par of me. 🏌️'),
  -- GOOD (15)
  ('good', 'i''m built different 🧠'),
  ('good', 'i screenshot my score 📸'),
  ('good', 'they''ll know my name 🫵'),
  ('good', 'peak performance; performed by me 👑'),
  ('good', 'i just won 🏆'),
  ('good', 'i score high scores 🎯'),
  ('good', 'outsmarting the smart 😏'),
  ('good', 'confidently correct 💅'),
  ('good', 'i came, i saw, i won 🏛️'),
  ('good', 'survival of the smartest 🧬'),
  ('good', 'my score is inevitable 🔮'),
  ('good', 'unbothered. undefeated. 💅'),
  ('good', 'i set bars then raise them 📏'),
  ('good', 'first place feels familiar 🥇'),
  ('good', 'the best at being best 🌟'),
  -- MOCKING (15) — ghost speaking to the next opponent
  ('mocking', 'you''re not ready 😏'),
  ('mocking', 'bold of you to try 🤷'),
  ('mocking', 'this should be quick 👀'),
  ('mocking', 'i don''t lose. check the record. 📋'),
  ('mocking', 'i''ve beaten better 💅'),
  ('mocking', 'best of luck. you''ll need it. 🫶'),
  ('mocking', 'spoiler: i win 🔮'),
  ('mocking', 'skill diff. 💅'),
  ('mocking', 'not even close. sorry. 💅'),
  ('mocking', 'outplayed before you started 😏'),
  ('mocking', 'boo. also your score. 👻'),
  ('mocking', 'i don''t take Ls. i leave them. 📝'),
  ('mocking', 'the house always wins. i''m the house. 🏠'),
  ('mocking', 'my pb is your ceiling 📏'),
  ('mocking', 'rent free. that''s where i''ll live. 🧠'),
  -- SUPPORTIVE (15) — ghost cheering on the next opponent
  ('supportive', 'i believe in you. no, really. 🫶'),
  ('supportive', 'your streak starts here 🔥'),
  ('supportive', 'make your mother proud! 🫶'),
  ('supportive', 'your best game coming up ⭐'),
  ('supportive', 'you were built for this 🧠'),
  ('supportive', 'you put the win in winning 🏆'),
  ('supportive', 'bet on yourself. every time. 🎰'),
  ('supportive', 'believe. ✨'),
  ('supportive', 'fortune favours you 🍀'),
  ('supportive', 'rooting for you from the cloud ☁️'),
  ('supportive', 'carry the torch. and the streak. 🔥'),
  ('supportive', 'you were born for this 🌟'),
  ('supportive', 'smart money''s on you 💰'),
  ('supportive', 'win like nobody''s watching 👀'),
  ('supportive', 'let''s go you! 🙌');

-- ─── Seed: Ranks ──────────────────────────────────────────────────────────────

insert into ranks (sort_order, max_score, label) values
  (1,  0,    'Really?'),
  (2,  200,  'Heartbreaking'),
  (3,  300,  'F for Effort'),
  (4,  400,  'Sad'),
  (5,  500,  'Unfortunate'),
  (6,  700,  'Poor'),
  (7,  900,  'Amateur'),
  (8,  1200, 'Tolerable'),
  (9,  1500, 'Average'),
  (10, 1800, 'Acceptable'),
  (11, 2100, 'Decent'),
  (12, 2400, 'Respectable'),
  (13, 2800, 'Good'),
  (14, 3200, 'Smart'),
  (15, 3600, 'Great'),
  (16, 4000, 'Terrific'),
  (17, 4500, 'Fantastic'),
  (18, 5000, 'Excellent'),
  (19, 5500, 'Elite'),
  (20, 6200, 'Genius'),
  (21, 7000, 'Mastermind'),
  (22, null, 'Super Smart!');
