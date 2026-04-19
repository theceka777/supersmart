// GlobalLeaderboard.tsx — tabbed overall / daily leaderboard widget.
// Two tabs: Overall (cumulative all sessions) and Daily Race (today's set only).
// Ported from GlobalLeaderboard in home.jsx (web design).

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/constants/theme';

const DATA = {
  overall: {
    top: [
      { name: 'KENJI_84',  score: 984210, flag: '🗾' },
      { name: 'VELVET',    score: 821450, flag: '🦁' },
      { name: 'MR_BRAIN',  score: 798002, flag: '🌋' },
    ],
    you: { rank: 2847, score: 5820 },
    total: 412038,
  },
  daily: {
    top: [
      { name: 'VELVET',   score: 4820, flag: '🦁' },
      { name: 'NOODLE',   score: 4710, flag: '🥟' },
      { name: 'KENJI_84', score: 4590, flag: '🗾' },
    ],
    you: { rank: 412, score: 3240 },
    total: 48221,
  },
};

function formatTotal(n: number) {
  if (n >= 10000) return `${Math.round(n / 1000)}K`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString();
}

const MEDAL = ['#FFD23F', '#CFCFCF', '#D99A5B'];

function Row({ rank, name, flag, score, isYou }: {
  rank: number; name: string; flag?: string; score: number; isYou?: boolean;
}) {
  return (
    <View style={[r.row, isYou && r.youRow]}>
      <Text style={[r.rank, { color: rank <= 3 ? MEDAL[rank - 1] : (isYou ? Colors.cream : Colors.ink) }]}>
        #{rank > 999 ? rank.toLocaleString() : rank}
      </Text>
      {flag ? <Text style={r.flag}>{flag}</Text> : null}
      <Text style={[r.name, { color: isYou ? Colors.cream : Colors.ink }]} numberOfLines={1}>
        {name}
      </Text>
      <Text style={[r.score, { color: isYou ? Colors.cream : Colors.ink }]}>
        {score.toLocaleString()}
      </Text>
    </View>
  );
}

const r = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 7,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  youRow: {
    backgroundColor: Colors.red,
    borderWidth: 2,
    borderColor: Colors.ink,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  rank: {
    fontFamily: Fonts.black,
    fontSize: 12,
    width: 40,
    textAlign: 'right',
  },
  flag: { fontSize: 14 },
  name: {
    fontFamily: Fonts.black,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    flex: 1,
  },
  score: {
    fontFamily: Fonts.black,
    fontSize: 12,
  },
});

export function GlobalLeaderboard() {
  const [tab, setTab] = useState<'overall' | 'daily'>('overall');
  const pulseScale = useSharedValue(1);
  const pulseOp = useSharedValue(0.5);

  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(withTiming(1.8, { duration: 500 }), withTiming(1, { duration: 500 })),
      -1, false,
    );
    pulseOp.value = withRepeat(
      withSequence(withTiming(0, { duration: 500 }), withTiming(0.6, { duration: 500 })),
      -1, false,
    );
  }, []);

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOp.value,
  }));

  const cur = DATA[tab];

  return (
    <View style={s.container}>
      {/* header */}
      <View style={s.header}>
        <View style={s.dotWrap}>
          <Animated.View style={[s.dotGlow, dotStyle]} />
          <View style={s.dotCore} />
        </View>
        <Text style={s.headerTitle}>Leaderboard</Text>
        <View style={s.totalWrap}>
          <Text style={s.totalText}>{formatTotal(cur.total)}</Text>
        </View>
      </View>

      {/* tabs */}
      <View style={s.tabs}>
        {(['overall', 'daily'] as const).map((id) => (
          <Pressable
            key={id}
            onPress={() => setTab(id)}
            style={[s.tab, tab === id && s.tabActive, id === 'overall' && s.tabBorderRight]}
          >
            <Text style={[s.tabText, tab === id && s.tabTextActive]}>
              {id === 'overall' ? 'Overall' : 'Daily'}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* rows */}
      <View style={s.rows}>
        {cur.top.map((row, i) => (
          <Row key={i} rank={i + 1} name={row.name} flag={row.flag} score={row.score} />
        ))}
        <View style={s.divider} />
        <Row rank={cur.you.rank} name="YOU" score={cur.you.score} isYou />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: Colors.cream,
    borderWidth: 3,
    borderColor: Colors.ink,
    borderRadius: 12,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 3,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.ink,
  },
  dotWrap: { width: 8, height: 8, alignItems: 'center', justifyContent: 'center' },
  dotGlow: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.red,
  },
  dotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.red,
  },
  headerTitle: {
    fontFamily: Fonts.black,
    fontSize: 12,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.cream,
    flex: 1,
  },
  totalWrap: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  totalText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.cream,
    opacity: 0.85,
    letterSpacing: 0.5,
  },
  tabs: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: Colors.ink },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    backgroundColor: Colors.cream,
  },
  tabActive: { backgroundColor: Colors.yellow },
  tabBorderRight: { borderRightWidth: 2, borderRightColor: Colors.ink },
  tabText: {
    fontFamily: Fonts.black,
    fontSize: 10,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.ink,
    opacity: 0.5,
  },
  tabTextActive: { opacity: 1 },
  rows: { paddingHorizontal: 8, paddingTop: 6, paddingBottom: 4, gap: 2 },
  divider: { height: 2, backgroundColor: Colors.ink, opacity: 0.1, marginHorizontal: 10, marginVertical: 4 },
});
