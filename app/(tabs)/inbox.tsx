// inbox.tsx — Inbox tab (replaces multiplayer.tsx)
// Shows activity feed: who raced your ghost since last login / last 24h (whichever longer).
// Also houses the Global Leaderboard (accessed from home via tab or leaderboard button).
// Cream Stadium design. Live data: Phase 4 (Supabase). All rows are mock for now.

import { View, Text, ScrollView, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

// ── Types ────────────────────────────────────────────────────────────────────

type ActivityResult = 'win' | 'loss' | 'tie';

interface ActivityEntry {
  id: string;
  name: string;
  timeAgo: string;
  result: ActivityResult;
  scoreDiff: number; // positive = they beat you, negative = you beat them
  emote: string;
}

interface LeaderEntry {
  rank: number;
  name: string;
  score: number;
  badge: string;
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const ACTIVITY: ActivityEntry[] = [
  { id: '1', name: 'SmartBomb_11',   timeAgo: '2h ago',  result: 'win',  scoreDiff:  200, emote: '😏' },
  { id: '2', name: 'QuizWizard_88',  timeAgo: '5h ago',  result: 'loss', scoreDiff: -350, emote: '🔥' },
  { id: '3', name: 'BrainFuel_77',   timeAgo: '8h ago',  result: 'tie',  scoreDiff:    0, emote: '🤝' },
  { id: '4', name: 'TriviaKing_03',  timeAgo: '11h ago', result: 'loss', scoreDiff: -120, emote: '😤' },
  { id: '5', name: 'NeuronNinja_55', timeAgo: '22h ago', result: 'win',  scoreDiff:  580, emote: '🤯' },
];

const LEADERBOARD: LeaderEntry[] = [
  { rank: 1, name: 'QuizWizard_88',  score: 6800, badge: '🏆' },
  { rank: 2, name: 'BrainFuel_77',   score: 6200, badge: '🥈' },
  { rank: 3, name: 'TriviaKing_03',  score: 5950, badge: '🥉' },
  { rank: 4, name: 'SmartBomb_11',   score: 5700, badge: '' },
  { rank: 5, name: 'NeuronNinja_55', score: 5400, badge: '' },
];

// ── Result label helpers ──────────────────────────────────────────────────────

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

// ── Components ────────────────────────────────────────────────────────────────

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

function LeaderRow({ entry }: { entry: LeaderEntry }) {
  const isTop3 = entry.rank <= 3;
  return (
    <View style={[s.leaderRow, isTop3 && s.leaderRowTop]}>
      <Text style={s.leaderRank}>{entry.badge || `#${entry.rank}`}</Text>
      <Text style={[s.leaderName, isTop3 && s.leaderNameTop]}>{entry.name}</Text>
      <Text style={s.leaderScore}>{entry.score.toLocaleString()}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function InboxScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Page title */}
        <View style={s.titleRow}>
          <Text style={s.title}>INBOX</Text>
          <Text style={s.titleSub}>since you were last here</Text>
        </View>

        {/* Activity feed ──────────────────────────────────────────────── */}
        <SectionLabel>YOUR GHOST ACTIVITY</SectionLabel>

        <View style={s.card}>
          {ACTIVITY.length === 0 ? (
            <Text style={s.empty}>no races yet — play a round to start appearing!</Text>
          ) : (
            ACTIVITY.map((entry, i) => (
              <View key={entry.id}>
                <ActivityRow entry={entry} />
                {i < ACTIVITY.length - 1 && <View style={s.divider} />}
              </View>
            ))
          )}
          <Text style={s.liveNote}>🔒 live data · Phase 4</Text>
        </View>

        {/* Play vs a ghost CTA */}
        <Pressable style={s.playBtn} onPress={() => router.push('/echo' as any)}>
          <View style={s.playBtnShadow} />
          <View style={s.playBtnFace}>
            <Text style={s.playBtnText}>PLAY VS GHOST</Text>
          </View>
        </Pressable>

        {/* Global Leaderboard ──────────────────────────────────────────── */}
        <SectionLabel>GLOBAL LEADERBOARD</SectionLabel>

        <View style={s.card}>
          {LEADERBOARD.map((entry, i) => (
            <View key={entry.rank}>
              <LeaderRow entry={entry} />
              {i < LEADERBOARD.length - 1 && <View style={s.divider} />}
            </View>
          ))}
          <Text style={s.liveNote}>🔒 live data · Phase 4</Text>
        </View>

        {/* Game log teaser ─────────────────────────────────────────────── */}
        <SectionLabel>SCORE LOG</SectionLabel>

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
  safe: { flex: 1, backgroundColor: Colors.cream },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 10,
  },

  titleRow: { marginBottom: 4 },
  title: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.red,
    letterSpacing: 1,
  },
  titleSub: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.4,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: 2,
  },

  sectionLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.ink,
    opacity: 0.45,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },

  card: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 16,
    gap: 2,
  },
  logCard: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 8,
  },

  // Activity rows
  activityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  activityLeft: { flex: 1 },
  activityName: {
    fontFamily: Fonts.mono,
    fontSize: 15,
    color: Colors.ink,
    fontWeight: '700',
  },
  activityTime: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.4,
    marginTop: 2,
  },
  activityRight: { alignItems: 'flex-end', gap: 2 },
  activityResult: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    fontWeight: '700',
  },
  activityEmote: {
    fontSize: 18,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.ink,
    opacity: 0.1,
  },

  // Leaderboard rows
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
  },
  leaderRowTop: {},
  leaderRank: {
    fontFamily: Fonts.black,
    fontSize: 18,
    width: 32,
    textAlign: 'center',
    color: Colors.ink,
  },
  leaderName: {
    flex: 1,
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.ink,
    opacity: 0.7,
  },
  leaderNameTop: {
    opacity: 1,
    fontWeight: '700',
  },
  leaderScore: {
    fontFamily: Fonts.black,
    fontSize: 16,
    color: Colors.red,
  },

  // CTA button
  playBtn: {
    width: '100%',
    position: 'relative',
    height: 56 + CARD_DEPTH,
    marginVertical: 4,
  },
  playBtnShadow: {
    position: 'absolute',
    left: 0, right: 0, top: CARD_DEPTH, height: 56,
    backgroundColor: Colors.ink,
    borderRadius: Radius.sm,
  },
  playBtnFace: {
    position: 'absolute',
    left: 0, right: 0, top: 0, height: 56,
    backgroundColor: Colors.pink,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playBtnText: {
    fontFamily: Fonts.black,
    fontSize: 18,
    color: Colors.cream,
    letterSpacing: 1,
  },

  // Misc
  empty: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.5,
    textAlign: 'center',
    paddingVertical: 12,
  },
  logEmpty: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.5,
    textAlign: 'center',
  },
  liveNote: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.3,
    textAlign: 'center',
    marginTop: 8,
  },
});
