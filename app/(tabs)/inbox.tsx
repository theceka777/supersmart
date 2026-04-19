// inbox.tsx — League tab
// Four sections in order:
//   1. League activity — recent match results + league standings (this week)
//   2. Daily Race board — today's global scores
//   3. Global Ranking — all-time cumulative (Pro only, blurred teaser)
//   4. Past Matches — personal match history stub
//
// Live data: Phase 4 (Supabase). All rows are mock for now.
// No "ghost" in any customer-facing copy.

import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Fonts, Radius } from '@/constants/theme';

// ── Types ─────────────────────────────────────────────────────────────────────

type ActivityResult = 'win' | 'loss' | 'tie';

interface ActivityEntry {
  id: string;
  name: string;
  timeAgo: string;
  result: ActivityResult;
  scoreDiff: number;
  emote: string;
}

interface LeaderEntry {
  rank: number;
  name: string;
  score: number;
  isYou?: boolean;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const ACTIVITY: ActivityEntry[] = [
  { id: '1', name: 'SmartBomb_11',   timeAgo: '2h ago',  result: 'win',  scoreDiff:  200, emote: '😏' },
  { id: '2', name: 'QuizWizard_88',  timeAgo: '5h ago',  result: 'loss', scoreDiff: -350, emote: '🔥' },
  { id: '3', name: 'BrainFuel_77',   timeAgo: '8h ago',  result: 'tie',  scoreDiff:    0, emote: '🤝' },
  { id: '4', name: 'TriviaKing_03',  timeAgo: '11h ago', result: 'loss', scoreDiff: -120, emote: '😤' },
  { id: '5', name: 'NeuronNinja_55', timeAgo: '22h ago', result: 'win',  scoreDiff:  580, emote: '🤯' },
];

const LEAGUE_BOARD: LeaderEntry[] = [
  { rank: 1,  name: 'QuizWizard_88',  score: 24800 },
  { rank: 2,  name: 'BrainFuel_77',   score: 21200 },
  { rank: 3,  name: 'TriviaKing_03',  score: 19500 },
  { rank: 4,  name: 'you',            score: 17300, isYou: true },
  { rank: 5,  name: 'SmartBomb_11',   score: 15700 },
  { rank: 6,  name: 'NeuronNinja_55', score: 14100 },
];

const DAILY_BOARD: LeaderEntry[] = [
  { rank: 1, name: 'TriviaKing_03',  score: 6800 },
  { rank: 2, name: 'NeuronNinja_55', score: 6200 },
  { rank: 3, name: 'QuizWizard_88',  score: 5950 },
  { rank: 4, name: 'you',            score: 5300, isYou: true },
  { rank: 5, name: 'SmartBomb_11',   score: 4700 },
];

// Global board — shown blurred. Names are intentionally generic/forgettable.
const GLOBAL_BOARD: LeaderEntry[] = [
  { rank: 1,    name: 'AlphaWave_99',   score: 982400 },
  { rank: 2,    name: 'CortexKing',     score: 934100 },
  { rank: 3,    name: 'LobeDestroyer',  score: 891700 },
  { rank: 4,    name: 'BrainFuel_77',   score: 847300 },
  { rank: 5,    name: 'IQHunter_22',    score: 803500 },
  { rank: 3741, name: 'you',            score: 17300, isYou: true },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function resultLabel(r: ActivityResult): string {
  if (r === 'win')  return 'beat you';
  if (r === 'loss') return 'you won';
  return 'tied';
}
function resultColor(r: ActivityResult): string {
  if (r === 'win')  return Colors.red;
  if (r === 'loss') return '#16a34a';
  return Colors.ink;
}
function medalFor(rank: number): string {
  if (rank === 1) return '🏆';
  if (rank === 2) return '🥈';
  if (rank === 3) return '🥉';
  return `#${rank}`;
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const color = resultColor(entry.result);
  const diff  = entry.scoreDiff !== 0
    ? ` · ${entry.scoreDiff > 0 ? '+' : ''}${entry.scoreDiff} pts`
    : '';
  return (
    <View style={s.activityRow}>
      <View style={s.activityLeft}>
        <Text style={s.activityName}>{entry.name}</Text>
        <Text style={s.activityTime}>{entry.timeAgo}</Text>
      </View>
      <View style={s.activityRight}>
        <Text style={[s.activityResult, { color }]}>{resultLabel(entry.result)}{diff}</Text>
        <Text style={s.activityEmote}>{entry.emote}</Text>
      </View>
    </View>
  );
}

function LeaderRow({ entry, dimmed = false }: { entry: LeaderEntry; dimmed?: boolean }) {
  const medal = medalFor(entry.rank);
  return (
    <View style={[s.leaderRow, dimmed && s.leaderRowDimmed]}>
      <Text style={[s.leaderRank, entry.rank > 9 && s.leaderRankSmall]}>
        {medal}
      </Text>
      <Text style={[s.leaderName, entry.isYou && s.leaderNameYou]}>
        {entry.name}
      </Text>
      <Text style={[s.leaderScore, entry.isYou && s.leaderScoreYou]}>
        {entry.score.toLocaleString()}
      </Text>
    </View>
  );
}

// ── Global board with blur overlay ───────────────────────────────────────────

function GlobalBoardLocked() {
  return (
    <View style={s.card}>
      {/* Rows visible at low opacity behind the overlay */}
      <View style={s.blurContent} pointerEvents="none">
        {GLOBAL_BOARD.map((entry, i) => (
          <View key={entry.rank}>
            {/* Gap row between top 5 and "you" */}
            {i === 5 && (
              <View style={s.leaderGapRow}>
                <Text style={s.leaderGapText}>· · ·</Text>
              </View>
            )}
            <LeaderRow entry={entry} dimmed />
            {i < GLOBAL_BOARD.length - 1 && i !== 4 && <View style={s.divider} />}
          </View>
        ))}
      </View>

      {/* Frosted overlay */}
      <View style={s.blurOverlay} pointerEvents="none" />

      {/* Pro CTA on top */}
      <View style={s.blurCta} pointerEvents="box-none">
        <Text style={s.blurCtaTitle}>Global Ranking</Text>
        <Text style={s.blurCtaSub}>
          you're already ranked.{'\n'}get Pro to see where you stand.
        </Text>
        <View style={s.blurCtaBtn}>
          <Text style={s.blurCtaBtnText}>Super Smart Pro →</Text>
        </View>
      </View>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function InboxScreen() {
  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Title */}
        <View style={s.titleRow}>
          <Text style={s.title}>LEAGUE</Text>
          <Text style={s.titleSub}>since you were last here</Text>
        </View>

        {/* ── 1. League activity ─────────────────────────────────────────── */}
        <SectionLabel>RECENT ACTIVITY</SectionLabel>
        <View style={s.card}>
          {ACTIVITY.map((entry, i) => (
            <View key={entry.id}>
              <ActivityRow entry={entry} />
              {i < ACTIVITY.length - 1 && <View style={s.divider} />}
            </View>
          ))}
          <Text style={s.liveNote}>🔒 live data · Phase 4</Text>
        </View>

        <SectionLabel>YOUR LEAGUE · THIS WEEK</SectionLabel>
        <View style={s.card}>
          {LEAGUE_BOARD.map((entry, i) => (
            <View key={entry.rank}>
              <LeaderRow entry={entry} />
              {i < LEAGUE_BOARD.length - 1 && <View style={s.divider} />}
            </View>
          ))}
          <Text style={s.liveNote}>🔒 live data · Phase 4</Text>
        </View>

        {/* ── 2. Daily Race board ────────────────────────────────────────── */}
        <SectionLabel>DAILY RACE · TODAY</SectionLabel>
        <View style={s.card}>
          {DAILY_BOARD.map((entry, i) => (
            <View key={entry.rank}>
              <LeaderRow entry={entry} />
              {i < DAILY_BOARD.length - 1 && <View style={s.divider} />}
            </View>
          ))}
          <Text style={s.liveNote}>🔒 live data · Phase 4</Text>
        </View>

        {/* ── 3. Global Ranking (Pro locked) ────────────────────────────── */}
        <SectionLabel>GLOBAL RANKING · PRO</SectionLabel>
        <GlobalBoardLocked />

        {/* ── 4. Past matches ───────────────────────────────────────────── */}
        <SectionLabel>PAST MATCHES</SectionLabel>
        <View style={[s.card, s.logCard]}>
          <Text style={s.logEmpty}>your full match history lives here.</Text>
          <Text style={s.liveNote}>🔒 Phase 4</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: Colors.cream },
  scroll: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 48, gap: 10 },

  titleRow: { marginBottom: 4 },
  title: {
    fontFamily: Fonts.black, fontSize: 28,
    color: Colors.red, letterSpacing: 1,
  },
  titleSub: {
    fontFamily: Fonts.mono, fontSize: 11,
    color: Colors.ink, opacity: 0.4,
    letterSpacing: 1, textTransform: 'uppercase', marginTop: 2,
  },

  sectionLabel: {
    fontFamily: Fonts.mono, fontSize: 10,
    color: Colors.ink, opacity: 0.45,
    letterSpacing: 2, textTransform: 'uppercase', marginTop: 8,
  },

  card: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 16,
    gap: 2,
    overflow: 'hidden',   // required so overlay respects border radius
  },
  logCard: { alignItems: 'center', paddingVertical: 24, gap: 8 },

  // Activity
  activityRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 10,
  },
  activityLeft:  { flex: 1 },
  activityRight: { alignItems: 'flex-end', gap: 2 },
  activityName: {
    fontFamily: Fonts.mono, fontSize: 15,
    color: Colors.ink, fontWeight: '700',
  },
  activityTime: {
    fontFamily: Fonts.mono, fontSize: 11,
    color: Colors.ink, opacity: 0.4, marginTop: 2,
  },
  activityResult: { fontFamily: Fonts.mono, fontSize: 13, fontWeight: '700' },
  activityEmote:  { fontSize: 18 },

  divider: { height: 1, backgroundColor: Colors.ink, opacity: 0.1 },

  // Leaderboard rows
  leaderRow: {
    flexDirection: 'row', alignItems: 'center',
    gap: 10, paddingVertical: 10,
  },
  leaderRowDimmed: { opacity: 0.18 },
  leaderRank: {
    fontFamily: Fonts.black, fontSize: 18,
    width: 36, textAlign: 'center', color: Colors.ink,
  },
  leaderRankSmall: { fontSize: 12 },
  leaderName: {
    flex: 1, fontFamily: Fonts.mono,
    fontSize: 14, color: Colors.ink, opacity: 0.7,
  },
  leaderNameYou: {
    opacity: 1, fontWeight: '700', color: Colors.red,
  },
  leaderScore: {
    fontFamily: Fonts.black, fontSize: 16, color: Colors.ink, opacity: 0.6,
  },
  leaderScoreYou: {
    color: Colors.red, opacity: 1,
  },
  leaderGapRow: {
    paddingVertical: 6, alignItems: 'center',
  },
  leaderGapText: {
    fontFamily: Fonts.mono, fontSize: 11,
    color: Colors.ink, opacity: 0.25, letterSpacing: 4,
  },

  // Blur overlay system
  blurContent: {
    // Rows rendered at leaderRowDimmed opacity behind the overlay
  },
  blurOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 244, 223, 0.78)',
  },
  blurCta: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  blurCtaTitle: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: Colors.ink,
    letterSpacing: 0.5,
  },
  blurCtaSub: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.6,
    textAlign: 'center',
    lineHeight: 20,
  },
  blurCtaBtn: {
    marginTop: 4,
    backgroundColor: Colors.yellow,
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
  },
  blurCtaBtnText: {
    fontFamily: Fonts.black,
    fontSize: 14,
    color: Colors.ink,
  },

  // Misc
  empty: {
    fontFamily: Fonts.mono, fontSize: 13,
    color: Colors.ink, opacity: 0.5,
    textAlign: 'center', paddingVertical: 12,
  },
  logEmpty: {
    fontFamily: Fonts.mono, fontSize: 13,
    color: Colors.ink, opacity: 0.5, textAlign: 'center',
  },
  liveNote: {
    fontFamily: Fonts.mono, fontSize: 11,
    color: Colors.ink, opacity: 0.3,
    textAlign: 'center', marginTop: 8,
  },
});
