-- Super Smart 2026 — Phase 4 Schema Extension (draft)
--
-- Extends supabase/schema.sql (Phase 3 — emotes, ranks, questions) with the
-- 10 tables needed for multiplayer, leagues, monetisation, and persistence.
--
-- Status: DRAFT. Not production-final. Reviewed against mothership v1.22.
--
-- Bakes in decisions locked 2026-04-24:
--   • locale column on every player-visible content table (Decision 4, i18n hedge)
--   • tie-breaker cascade fields on sessions (Decision 2)
--   • 6am ET reset anchor via timestamptz, DST-safe (Decision 1)
--   • strict same-tier league cohorts — no ±1 wobble (2026-04-24 clarification)
--   • skill tier and league tier as independent columns on players (same clarification)
--   • challenge scores count toward league weekly totals (same clarification)
--
-- Open items flagged inline with [OPEN: ...].
-- The three most significant: (1) auth library — players.id should reference
-- auth.users(id) once Appendix D #1 resolves; (2) RLS policies are stubs,
-- real policies need a pass before production; (3) anti-cheat server-side
-- checks on sessions insert (Appendix D #6) not modelled here.

-- ─── 0. Extensions to existing Phase 3 tables ────────────────────────────────
-- Add locale to questions, emotes, ranks so the Supabase content migration in
-- Phase 4 stays language-agnostic. Default 'en' keeps all current rows valid.

alter table questions add column if not exists locale text not null default 'en';
alter table emotes    add column if not exists locale text not null default 'en';
alter table ranks     add column if not exists locale text not null default 'en';

create index if not exists idx_questions_locale_active on questions(locale, active);
create index if not exists idx_emotes_locale_category  on emotes(locale, category);
create index if not exists idx_ranks_locale_sort       on ranks(locale, sort_order);

-- ─── 1. Players ──────────────────────────────────────────────────────────────
-- Core identity table. One row per user account.
--
-- [OPEN: auth library] — once Supabase Auth vs Clerk resolves (Appendix D #1),
-- players.id should be:   id uuid primary key references auth.users(id) on delete cascade
-- For now it's a standalone UUID so the schema runs without auth wired.

create table if not exists players (
  id                        uuid primary key default uuid_generate_v4(),

  -- Display identity (pulled from Apple/Google; editable in Profile with 30d cooldown)
  display_name              text,
  display_name_changed_at   timestamptz,

  -- Locale preference (drives which localised content tables serve this player)
  locale                    text not null default 'en',

  -- Skill tier — backend-only, 1–5, drives Quickmatch ghost matching (Part 4 Layer 1)
  -- Null until the player has completed 5 games (new players force-matched to tier 1)
  skill_tier                integer check (skill_tier between 1 and 5),
  skill_tier_updated_at     timestamptz,
  rolling_10_avg_score      numeric,             -- cached for bracket recalc (70/30 inertia)

  -- League tier — visible, 1–8, promotes/demotes weekly (Part 4 Layer 4)
  -- [OPEN: season-start rule] — currently everyone starts at Newcomer (tier 1).
  -- Locked pending creative director confirmation (see "loose end" in conversation).
  current_league_tier       integer not null default 1 check (current_league_tier between 1 and 8),

  -- Games played lifetime (used for new-player skill tier override)
  games_completed           integer not null default 0,

  -- Avatar config — 3 components, each indexed into the free or Pro option lists
  -- Ranges 0–3 for free items; 4–7 for Pro-only items (enforced app-side for now)
  avatar_brain_color        integer not null default 0 check (avatar_brain_color between 0 and 7),
  avatar_eyes               integer not null default 0 check (avatar_eyes between 0 and 7),
  avatar_mouth              integer not null default 0 check (avatar_mouth between 0 and 7),

  -- Pro status — denormalised from pro_entitlements for fast reads.
  -- Kept in sync via trigger on pro_entitlements (see bottom of file).
  pro                       boolean not null default false,

  -- Timestamps
  created_at                timestamptz not null default now(),
  updated_at                timestamptz not null default now(),
  last_active_at            timestamptz not null default now()
);

create index if not exists idx_players_skill_tier        on players(skill_tier) where skill_tier is not null;
create index if not exists idx_players_league_tier       on players(current_league_tier);
create index if not exists idx_players_last_active       on players(last_active_at desc);

alter table players enable row level security;

-- Players can read their own full row; everyone else sees only public fields.
-- [OPEN: RLS stub] — production needs a view or column-level policy to hide
-- skill_tier and rolling_10_avg_score from other players.
create policy "players_read_self"   on players for select using (auth.uid() = id);
create policy "players_update_self" on players for update using (auth.uid() = id);

-- ─── 2. Push tokens ──────────────────────────────────────────────────────────
-- Expo Push Notifications. One player can have multiple devices.

create table if not exists push_tokens (
  id            uuid primary key default uuid_generate_v4(),
  player_id     uuid not null references players(id) on delete cascade,
  token         text not null,
  platform      text not null check (platform in ('ios', 'android')),
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  last_used_at  timestamptz not null default now(),
  unique (player_id, token)
);

create index if not exists idx_push_tokens_player_active on push_tokens(player_id, active);

alter table push_tokens enable row level security;
create policy "push_tokens_own" on push_tokens for all using (auth.uid() = player_id);

-- ─── 3. Pro entitlements ─────────────────────────────────────────────────────
-- Mirrors the RevenueCat entitlement state. Source of truth for Pro status.
-- RevenueCat webhooks hit an Edge Function which upserts here; players.pro flips via trigger.

create table if not exists pro_entitlements (
  id                  uuid primary key default uuid_generate_v4(),
  player_id           uuid not null references players(id) on delete cascade,
  revenue_cat_user_id text not null,              -- RevenueCat's app_user_id — set to players.id on purchase
  product_id          text not null,              -- e.g. 'super_smart_pro'
  purchased_at        timestamptz not null,
  expires_at          timestamptz,                -- null = lifetime (which $4.99 one-time Pro is)
  status              text not null check (status in ('active', 'expired', 'refunded', 'grace_period')),
  receipt_data        jsonb,                      -- raw RevenueCat webhook payload for debugging
  updated_at          timestamptz not null default now(),
  unique (player_id, product_id)                  -- one entitlement row per player per product
);

create index if not exists idx_pro_entitlements_status on pro_entitlements(status) where status = 'active';

alter table pro_entitlements enable row level security;
create policy "pro_entitlements_read_own" on pro_entitlements for select using (auth.uid() = player_id);
-- Writes: service role only (Edge Function receiving RevenueCat webhook).

-- ─── 4. Question sets ────────────────────────────────────────────────────────
-- 60-question ordered sets. Same structure serves Quickmatch (random draw) and
-- Daily Race (one set per date per locale, selected by deterministic seed).
-- Lifecycle: active → retired. Retired when 30d stale OR 10,000 plays.
--
-- No-replay rule (2026-04-18 session 3, reconfirmed 2026-04-24):
--   No player ever sees the same question set twice in Quickmatch. Challenge
--   links are the only exception. Enforced at matchmaking time by filtering
--   candidates against sessions where source='quickmatch' for this player.
--   See idx_sessions_player_quickmatch_sets on the sessions table below.
--
-- Shortage fallback (2026-04-24):
--   If no unseen set has a human ghost at the player's skill tier, the
--   matchmaking Edge Function serves a BOT GHOST — generated ephemerally,
--   not persisted in ghost_pool. Bot score range 300–3,000. Graduates out
--   automatically once a human ghost exists at the tier for that set. See
--   mothership Part 4 Layer 1 "Bot-filled ghosts" for the full spec.

create table if not exists question_sets (
  id                uuid primary key default uuid_generate_v4(),
  question_ids      uuid[] not null,              -- ordered array of exactly 60 question UUIDs
  locale            text not null default 'en',
  play_count        integer not null default 0,
  first_played_at   timestamptz,
  last_played_at    timestamptz,
  retired_at        timestamptz,                  -- null = active
  created_at        timestamptz not null default now(),
  check (array_length(question_ids, 1) = 60)
);

create index if not exists idx_question_sets_active on question_sets(locale, last_played_at desc)
  where retired_at is null;

alter table question_sets enable row level security;
create policy "question_sets_read_public" on question_sets for select using (true);

-- ─── 5. Ghost pool ───────────────────────────────────────────────────────────
-- One row per recorded HUMAN Quickmatch run. What future players race against.
-- Matched by question_set_id + skill_tier (recency breaks ties within tier).
-- Challenge-a-Friend ghosts live here too but are identified via challenges.sender_ghost_id.
--
-- Humans only: bot ghosts (2026-04-24 decision) are ephemeral — generated by
-- the matchmaking Edge Function, served to one player, discarded. Never persisted
-- here. This table is a record of real human plays only. The matchmaking Edge
-- Function prefers ghosts here over generating a bot; bots only fill when no
-- row at the matched (question_set_id, skill_tier) exists.

create table if not exists ghost_pool (
  id                uuid primary key default uuid_generate_v4(),
  question_set_id   uuid not null references question_sets(id) on delete cascade,
  player_id         uuid not null references players(id) on delete cascade,
  skill_tier        integer not null check (skill_tier between 1 and 5),  -- frozen at record time

  -- Aggregate scoring (mirrors the tie-breaker cascade fields)
  score             integer not null,
  peak_streak       integer not null default 0,
  questions_answered integer not null default 0,
  speed_bonuses     integer not null default 0,

  -- Full answer sequence for playback during the live round
  -- Shape: [{ question_id, selected_option, correct, time_ms }, ...]
  answer_sequence   jsonb not null,

  -- Post-game interview emote chosen by this player (shown to the next opponent)
  emote_id          uuid references emotes(id),

  played_at         timestamptz not null default now(),
  is_active         boolean not null default true  -- false when parent question_set retires
);

-- Ghost matching query hits this index hard: same skill tier, active, recent-first.
create index if not exists idx_ghost_pool_matching on ghost_pool(question_set_id, skill_tier, played_at desc)
  where is_active = true;
create index if not exists idx_ghost_pool_player   on ghost_pool(player_id, played_at desc);

alter table ghost_pool enable row level security;
create policy "ghost_pool_read_public" on ghost_pool for select using (true);
-- Writes: service role only (end-of-session Edge Function).

-- ─── 6. Challenges ───────────────────────────────────────────────────────────
-- Challenge-a-Friend share links. Unlike Quickmatch's baton pass, the sender's
-- ghost is LOCKED — every player who uses the link races the sender specifically.

create table if not exists challenges (
  id                uuid primary key default uuid_generate_v4(),
  code              text not null unique,         -- short shareable code (e.g. 6-8 chars)
  sender_player_id  uuid not null references players(id) on delete set null,
  question_set_id   uuid not null references question_sets(id),
  sender_ghost_id   uuid not null references ghost_pool(id),   -- static, no baton-pass
  created_at        timestamptz not null default now(),
  expires_at        timestamptz                   -- null = never expires (per mothership: "shared links never break")
);

create index if not exists idx_challenges_code   on challenges(code);
create index if not exists idx_challenges_sender on challenges(sender_player_id, created_at desc);

alter table challenges enable row level security;
create policy "challenges_read_by_code" on challenges for select using (true);
-- Writes: authenticated players creating their own challenge (policy added when auth lands).

-- ─── 7. Daily Races ──────────────────────────────────────────────────────────
-- One row per day per locale. Seeds that day's shared question set.
-- opens_at = 6am ET on race_date, auto-adjusts for DST because it's stored as timestamptz.
-- Part 3 Daily Race spec: "60s, 60q, once per day per player."

create table if not exists daily_races (
  id                uuid primary key default uuid_generate_v4(),
  race_date         date not null,
  locale            text not null default 'en',
  question_set_id   uuid not null references question_sets(id),
  opens_at          timestamptz not null,         -- 6am ET on race_date
  closes_at         timestamptz not null,         -- next day's opens_at (23h / 24h / 25h around DST)
  created_at        timestamptz not null default now(),
  unique (race_date, locale)
);

create index if not exists idx_daily_races_open_window on daily_races(opens_at, closes_at);
create index if not exists idx_daily_races_date_locale on daily_races(race_date, locale);

alter table daily_races enable row level security;
create policy "daily_races_read_public" on daily_races for select using (true);

-- ─── 8. Sessions — the fact table ────────────────────────────────────────────
-- Every round played. Feeds every leaderboard.
-- One unified table for Quickmatch, Daily Race, and Challenge rounds; `source`
-- discriminates. Enables the challenge-counts-toward-league rule cleanly.
--
-- Tie-breaker cascade (Decision 2) is a single ORDER BY over columns on this table:
--   order by score desc, peak_streak desc, questions_answered asc, submitted_at asc

create type session_source as enum ('quickmatch', 'daily_race', 'challenge');

create table if not exists sessions (
  id                uuid primary key default uuid_generate_v4(),
  player_id         uuid not null references players(id) on delete cascade,
  source            session_source not null,

  -- What was played (exactly one of these is non-null, enforced by check)
  question_set_id   uuid not null references question_sets(id),
  daily_race_id     uuid references daily_races(id),
  challenge_id      uuid references challenges(id),
  ghost_id          uuid references ghost_pool(id),  -- null for Daily Race & fresh-set first plays

  -- Scoring — the four tie-breaker cascade fields
  score             integer not null,
  peak_streak       integer not null default 0,
  questions_answered integer not null default 0,
  submitted_at      timestamptz not null default now(),

  -- Secondary stats (not used for ranking but useful for stats + anti-cheat)
  questions_correct integer not null default 0,
  speed_bonuses     integer not null default 0,
  miss_penalties    integer not null default 0,

  -- Full answer sequence (for ghost recording + anti-cheat review)
  -- [OPEN: storage cost] — if this grows too large, move to a separate answer_events
  -- table or cold storage. At 60 questions/row × 50k DAU × 1KB, this is ~3GB/mo.
  answer_sequence   jsonb,

  -- Context
  locale            text not null default 'en',
  started_at        timestamptz,
  client_version    text,                          -- for debugging + anti-cheat flagging

  -- Derived discriminator constraint
  check (
    (source = 'quickmatch' and daily_race_id is null and challenge_id is null)
    or (source = 'daily_race' and daily_race_id is not null and challenge_id is null)
    or (source = 'challenge'  and challenge_id is not null)
  )
);

-- Leaderboard queries — indexes match the locked tie-breaker cascade
create index if not exists idx_sessions_daily_race_board
  on sessions(daily_race_id, score desc, peak_streak desc, questions_answered asc, submitted_at asc)
  where daily_race_id is not null;

create index if not exists idx_sessions_player_timeline
  on sessions(player_id, submitted_at desc);

create index if not exists idx_sessions_player_weekly
  on sessions(player_id, submitted_at);        -- range queries for weekly league score aggregation

-- For Global all-time aggregate queries (Pro-only leaderboard)
create index if not exists idx_sessions_global_agg
  on sessions(player_id) include (score, peak_streak, questions_answered, submitted_at);

-- For the no-replay rule — matchmaking needs to quickly filter out question
-- sets this player has already played via Quickmatch. Partial index covering
-- only Quickmatch rows keeps it small and fast. (See comment block on
-- question_sets above; see mothership Part 4 Layer 1 ghost pool architecture.)
create index if not exists idx_sessions_player_quickmatch_sets
  on sessions(player_id, question_set_id)
  where source = 'quickmatch';

alter table sessions enable row level security;
create policy "sessions_read_own"   on sessions for select using (auth.uid() = player_id);
create policy "sessions_insert_own" on sessions for insert with check (auth.uid() = player_id);
-- [OPEN: anti-cheat] — Appendix D #6. Server-side Edge Function should validate:
--   • points-per-second ceiling (e.g., (100+50)*4 per sec max = 600)
--   • questions_answered ≤ 60
--   • submitted_at - started_at within [59s, 75s] (allow network skew)
--   • score matches reconstruction from answer_sequence
-- Rejections flag the player for review, don't silently drop.

-- ─── 9. Leagues ──────────────────────────────────────────────────────────────
-- Weekly cohort instance. ONE league = exactly 30 same-tier peers for ONE week.
-- [Corrected 2026-04-24]: strict same-tier — every member has the same
-- current_league_tier as league.tier at entry.

create type league_state as enum ('forming', 'active', 'closed');

create table if not exists leagues (
  id          uuid primary key default uuid_generate_v4(),
  tier        integer not null check (tier between 1 and 8),
  week_start  timestamptz not null,            -- Monday 6am ET (auto-DST via tz stored)
  week_end    timestamptz not null,            -- following Monday 6am ET
  locale      text not null default 'en',
  state       league_state not null default 'forming',
  created_at  timestamptz not null default now(),
  closed_at   timestamptz
);

create index if not exists idx_leagues_active_lookup on leagues(state, tier, week_start);

alter table leagues enable row level security;
create policy "leagues_read_public" on leagues for select using (true);

-- ─── 10. League memberships ──────────────────────────────────────────────────
-- Join table: which 30 players are in which league for which week.
-- Weekly score is a running sum, updated on sessions insert via trigger.
-- Final rank + outcome set when the league closes.

create type league_outcome as enum ('promoted', 'held', 'demoted');

create table if not exists league_memberships (
  id            uuid primary key default uuid_generate_v4(),
  league_id     uuid not null references leagues(id) on delete cascade,
  player_id     uuid not null references players(id) on delete cascade,
  entered_at    timestamptz not null default now(),
  weekly_score  integer not null default 0,     -- updated by trigger on sessions insert
  final_rank    integer,                        -- 1..30, set at league close
  outcome       league_outcome,                 -- set at league close (top 5 / bottom 5 / middle)
  unique (league_id, player_id)
);

create index if not exists idx_league_memberships_player    on league_memberships(player_id, entered_at desc);
create index if not exists idx_league_memberships_leaderboard
  on league_memberships(league_id, weekly_score desc);

alter table league_memberships enable row level security;
create policy "league_memberships_read_public" on league_memberships for select using (true);

-- ─── 11. Streak Shields ──────────────────────────────────────────────────────
-- Inventory + audit log. One row per shield ever granted or purchased.
-- Max 3 active per player enforced at grant/purchase time (not via constraint,
-- because expired/used rows stay in the table as audit history).

create type shield_source as enum ('free_launch', 'pro_weekly', 'purchase_1', 'purchase_2', 'purchase_3');
create type shield_status as enum ('active', 'used', 'expired');

create table if not exists streak_shields (
  id            uuid primary key default uuid_generate_v4(),
  player_id     uuid not null references players(id) on delete cascade,
  source        shield_source not null,
  granted_at    timestamptz not null default now(),
  used_at       timestamptz,
  used_for_date date,                            -- which Daily Race day it protected/repaired
  status        shield_status not null default 'active'
);

create index if not exists idx_streak_shields_active on streak_shields(player_id, status)
  where status = 'active';

alter table streak_shields enable row level security;
create policy "streak_shields_read_own" on streak_shields for select using (auth.uid() = player_id);

-- ─── 12. Triggers ────────────────────────────────────────────────────────────
-- Two triggers: keep players.pro synced with pro_entitlements; keep
-- league_memberships.weekly_score synced as sessions come in.

-- Trigger 1: pro status derived from entitlements
create or replace function sync_player_pro_status() returns trigger as $$
begin
  update players
  set pro = exists (
    select 1 from pro_entitlements
    where player_id = new.player_id
      and status = 'active'
      and (expires_at is null or expires_at > now())
  ),
  updated_at = now()
  where id = new.player_id;
  return new;
end;
$$ language plpgsql;

create trigger trg_sync_pro_status
  after insert or update on pro_entitlements
  for each row execute function sync_player_pro_status();

-- Trigger 2: increment league weekly_score when a session is submitted
-- Scope: all three sources (quickmatch, daily_race, challenge) contribute.
create or replace function increment_league_weekly_score() returns trigger as $$
begin
  update league_memberships lm
  set weekly_score = lm.weekly_score + new.score
  from leagues l
  where lm.league_id = l.id
    and lm.player_id = new.player_id
    and l.state = 'active'
    and new.submitted_at >= l.week_start
    and new.submitted_at <  l.week_end;
  return new;
end;
$$ language plpgsql;

create trigger trg_increment_league_score
  after insert on sessions
  for each row execute function increment_league_weekly_score();

-- ─── 13. Notes for the Phase 4 build ─────────────────────────────────────────
--
-- WHAT STILL NEEDS DESIGN (inline [OPEN] items summarised):
--   • Auth library decision (Appendix D #1) — then wire players.id to auth.users(id)
--   • RLS policies — current stubs use auth.uid(); several need real column-level work
--   • Anti-cheat (Appendix D #6) — server-side validation Edge Function on sessions insert
--   • Season-start league tier rule — "everyone starts Newcomer" not yet formally locked
--   • Ghost pool storage cost at scale (Appendix D #24) — answer_sequence jsonb growth
--
-- WHAT NEEDS EDGE FUNCTIONS (not part of this schema):
--   • Matchmaking + session validator — selects the right question set for a player
--     (no-replay filter via idx_sessions_player_quickmatch_sets), picks a skill-
--     tier-matched human ghost if one exists, else GENERATES A BOT GHOST ephemerally
--     (score 300-3000, plausible answer sequence, random avatar including Pro
--     cosmetics, mixed-pattern name). On session submit, validates the score is
--     physically possible (anti-cheat, Appendix D #6) before inserting into sessions.
--   • Weekly league close job — set final_rank, outcome, flip state to 'closed',
--     update players.current_league_tier (top 5 promote, bottom 5 demote)
--   • Weekly league open job — form new leagues per tier (strict same-tier),
--     apply formation rules (forming queue, 5-29 / 30-44 / 45+ split rules)
--   • Daily Race seeding job — populate daily_races for the upcoming day at 6am ET
--   • Ghost pool retirement job — set is_active=false on question_set retirement
--     (30-day stale OR 10k plays)
--   • Pro weekly Streak Shield grant — every Monday (Appendix D #17)
--   • Skill tier recalc job — weekly percentile bracketing with 70/30 inertia
--   • RevenueCat webhook receiver — upserts pro_entitlements
--
-- WHAT'S GOOD TO GO:
--   • Table shapes and relationships
--   • Tie-breaker cascade fields on sessions + matching index
--   • Locale column on every player-visible content table
--   • Strict-same-tier league model (tier is a first-class column on leagues)
--   • Triggers for derived state (pro status, weekly_score)
--
-- VERSION: draft 2026-04-24 — matches mothership v1.23.
--   v1 — initial 11-table draft
--   v2 — added no-replay partial index (idx_sessions_player_quickmatch_sets),
--        comment block on question_sets describing no-replay + bot-fill rule,
--        fixed ghost_pool.player_id FK (NOT NULL + ON DELETE CASCADE since
--        ghost_pool is human-only; bot ghosts are ephemeral, not stored here),
--        Edge Function notes updated to describe bot-ghost generation flow.
