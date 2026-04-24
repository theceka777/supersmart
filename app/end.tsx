// end.tsx — Post-game end screen for Daily Race (and standalone arcade via game.tsx)
// Cream Stadium design. Classic mode removed (retired). Uses getRankLabel from content.ts.

import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRankLabel } from './content';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

// Longest run of consecutive correct answers — drives the "best streak" share line.
function peakStreak(results: boolean[]): number {
  let peak = 0, run = 0;
  for (const r of results) {
    if (r) { run += 1; if (run > peak) peak = run; }
    else   { run = 0; }
  }
  return peak;
}

// "Apr 24" short-format date.
function shortDate(d = new Date()): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function EndScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score: string; mode: string; results: string }>();
  const score  = Number(params.score ?? 0);
  const mode   = params.mode ?? 'arcade';
  const rank   = getRankLabel(score);

  // ── Daily Race ───────────────────────────────────────────────────────────────
  if (mode === 'daily') {
    const resultsStr = params.results ?? '';
    const results    = resultsStr.split('').map(c => c === '1');
    const correct    = results.filter(Boolean).length;
    const total      = results.length;
    const grid       = results.map(r => (r ? '🟩' : '🟥')).join('');
    const peak       = peakStreak(results);
    // 3-line scoreboard — fixed shape, pastes cleanly into any chat.
    // Grid stays on-screen below as a reflective moment, but isn't part of the share.
    const shareText =
      `Super Smart Daily · ${shortDate()}\n` +
      `⚡ ${score.toLocaleString()} pts · rank: ${rank}\n` +
      `🔥 best streak · ${peak}`;

    return (
      <View style={s.container}>
        {/* Cyan mode tag pill — matches the playing screen's mode accent */}
        <View style={s.modeTagPill}>
          <Text style={s.modeTagPillText}>DAILY RACE</Text>
        </View>

        <View style={s.scoreCard}>
          <Text style={s.rankLabel}>{rank}</Text>
          {/* Points = hero */}
          <Text style={s.bigScore}>{score.toLocaleString()}</Text>
          <Text style={s.ptsLabel}>points</Text>
          {/* Accuracy = small context line */}
          <Text style={s.accuracyLine}>{correct} of {total} correct</Text>
        </View>

        {/* On-screen reflective moment: how your round went, question-by-question */}
        <Text style={s.gridText}>{grid}</Text>

        <View style={s.shareCard}>
          <Text style={s.shareHeader}>share your result</Text>
          <Text style={s.shareText}>{shareText}</Text>
        </View>

        <Pressable style={s.homeBtn} onPress={() => router.replace('/')}>
          <View style={s.homeBtnShadow} />
          <View style={s.homeBtnFace}>
            <Text style={s.homeBtnText}>HOME</Text>
          </View>
        </Pressable>

        <Text style={s.sub}>new race tomorrow at 6am.</Text>
      </View>
    );
  }

  // ── Arcade / Quickmatch fallback (game.tsx) ──────────────────────────────────
  return (
    <View style={s.container}>
      <Text style={s.modeTag}>ARCADE</Text>

      <View style={s.scoreCard}>
        <Text style={s.rankLabel}>{rank}</Text>
        <Text style={s.bigScore}>{score.toLocaleString()}</Text>
        <Text style={s.ptsLabel}>points</Text>
      </View>

      <Pressable style={s.primaryBtn} onPress={() => router.replace('/game')}>
        <View style={s.primaryBtnShadow} />
        <View style={s.primaryBtnFace}>
          <Text style={s.primaryBtnText}>PLAY AGAIN</Text>
        </View>
      </Pressable>

      <Pressable style={s.homeBtn} onPress={() => router.replace('/')}>
        <View style={s.homeBtnShadow} />
        <View style={s.homeBtnFace}>
          <Text style={s.homeBtnText}>HOME</Text>
        </View>
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 28,
    gap: 16,
  },

  modeTag: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // Cyan mode tag pill (Daily only) — matches the playing-screen accent
  modeTagPill: {
    backgroundColor: Colors.dailyrace.bg,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: Radius.pill,
    borderWidth: 2,
    borderColor: Colors.ink,
  },
  modeTagPillText: {
    fontFamily: Fonts.black,
    fontSize: 12,
    color: Colors.ink,
    letterSpacing: 2,
  },

  scoreCard: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 24,
    alignItems: 'center',
    gap: 4,
  },

  bigScore: {
    fontFamily: Fonts.black,
    fontSize: 72,
    color: Colors.ink,
    lineHeight: 80,
  },
  rankLabel: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: Colors.red,
    letterSpacing: -0.3,
    marginBottom: 2,
  },
  ptsLabel: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.ink,
    opacity: 0.45,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  // Accuracy = small context line under the points
  accuracyLine: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.55,
    letterSpacing: 0.5,
    marginTop: 6,
  },

  gridText: {
    fontSize: 24,
    letterSpacing: 3,
    flexWrap: 'wrap',
    textAlign: 'center',
    lineHeight: 32,
  },

  shareCard: {
    width: '100%',
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 20,
    gap: 8,
    alignItems: 'center',
  },
  shareHeader: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.ink,
    opacity: 0.4,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  shareText: {
    fontFamily: Fonts.mono,
    fontSize: 14,
    color: Colors.ink,
    textAlign: 'center',
    lineHeight: 26,
  },

  // Primary button (play again)
  primaryBtn:       { width: '100%', position: 'relative', height: 56 + CARD_DEPTH },
  primaryBtnShadow: { position: 'absolute', left: 0, right: 0, top: CARD_DEPTH, height: 56, backgroundColor: Colors.ink, borderRadius: Radius.sm },
  primaryBtnFace:   { position: 'absolute', left: 0, right: 0, top: 0, height: 56, backgroundColor: Colors.red, borderRadius: Radius.sm, borderWidth: 3, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  primaryBtnText:   { fontFamily: Fonts.black, fontSize: 18, color: Colors.cream, letterSpacing: 1 },

  // Home button (secondary)
  homeBtn:       { width: '100%', position: 'relative', height: 52 + CARD_DEPTH },
  homeBtnShadow: { position: 'absolute', left: 0, right: 0, top: CARD_DEPTH, height: 52, backgroundColor: Colors.ink, borderRadius: Radius.sm },
  homeBtnFace:   { position: 'absolute', left: 0, right: 0, top: 0, height: 52, backgroundColor: Colors.yellow, borderRadius: Radius.sm, borderWidth: 3, borderColor: Colors.ink, alignItems: 'center', justifyContent: 'center' },
  homeBtnText:   { fontFamily: Fonts.black, fontSize: 16, color: Colors.ink, letterSpacing: 0.5 },

  sub: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.35,
    marginTop: 4,
  },
});
