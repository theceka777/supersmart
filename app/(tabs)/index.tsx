// Home screen — Super Smart 2026 v2
// Two modes: Quickmatch (hero) + Daily Race.
// Brain + wordmark side-by-side hero. Animated card decorators.
// LivePlayersStrip footer on Quickmatch. Social layer below cards.

import { useState, useRef } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/app/store';
import { Brain, BrainExpression } from '@/components/Brain';
import { Wordmark } from '@/components/Wordmark';
import { ArcadeCard } from '@/components/ArcadeCard';
import { VsDecor } from '@/components/VsDecor';
import { DailyDecor } from '@/components/DailyDecor';
import { LivePlayersStrip } from '@/components/LivePlayersStrip';
import { InviteFriendsChip } from '@/components/InviteFriendsChip';
import { GlobalLeaderboard } from '@/components/GlobalLeaderboard';
// Sunburst + Halftone now render globally in app/_layout.tsx —
// mothership decision 2026-04-19 session 7.
import { Colors, Fonts, CARD_DEPTH } from '@/constants/theme';

// ─── Constants ───────────────────────────────────────────────────────────────

const FREE_LIMIT = 7;
const ONE_MORE_LIMIT = 3;

const ONE_MORE_LINES = [
  'no ads. No Ads. NO ADS.',
  "one more can't hurt. One More Can't Hurt. ONE MORE CAN'T HURT.",
  'real Pavlovian, huh?',
  "we could've shown you an ad just now. we didn't.",
  "could've just gotten the Pro pack.",
  "you're still here. so are we.",
  "ok this is getting impressive.",
  "honestly, at this point we're friends.",
  "the Pro pack is $4.99. just saying.",
  "we've stopped judging. seriously.",
];


// ─── Pro wall ────────────────────────────────────────────────────────────────

function ProWall({ onGetPro }: { onGetPro: () => void }) {
  return (
    <View style={pw.container}>
      <Text style={pw.hook}>ok. you've broken us.</Text>
      <Text style={pw.title}>Super Smart Pro — $4.99</Text>
      <Text style={pw.sub}>one time. no subscription.{'\n'}no ads (you know we don't do that).{'\n'}the whole game. forever.</Text>
      <Pressable style={pw.button} onPress={onGetPro}>
        <Text style={pw.buttonText}>get Super Smart Pro</Text>
      </Pressable>
      <Text style={pw.footer}>we think you've earned it honestly.</Text>
    </View>
  );
}

const pw = StyleSheet.create({
  container: { alignItems: 'center', gap: 6, paddingHorizontal: 8 },
  hook:      { fontFamily: Fonts.black, fontSize: 15, color: Colors.ink },
  title:     { fontFamily: Fonts.black, fontSize: 18, color: Colors.red },
  sub: { fontFamily: Fonts.mono, fontSize: 13, color: '#6b7280', textAlign: 'center', lineHeight: 20 },
  button: {
    backgroundColor: Colors.red, paddingVertical: 14, paddingHorizontal: 36,
    borderRadius: 14, borderWidth: 3, borderColor: Colors.ink, marginTop: 6,
    shadowColor: Colors.ink, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 1, shadowRadius: 0, elevation: 4,
  },
  buttonText: { fontFamily: Fonts.black, color: Colors.cream, fontSize: 16 },
  footer: { fontFamily: Fonts.mono, fontSize: 12, color: '#d1d5db', fontStyle: 'italic', marginTop: 2 },
});

// ─── Speech bubble ───────────────────────────────────────────────────────────

function SpeechBubble({ text }: { text: string }) {
  return (
    <View style={bub.container}>
      <Text style={bub.text}>{text}</Text>
      <View style={bub.tail} />
    </View>
  );
}

const bub = StyleSheet.create({
  container: {
    backgroundColor: Colors.ink, paddingHorizontal: 9, paddingVertical: 5,
    borderRadius: 10, borderWidth: 2, borderColor: Colors.ink,
    transform: [{ rotate: '3deg' }],
  },
  text: { fontFamily: Fonts.mono, fontSize: 9, color: Colors.cream, textTransform: 'uppercase', letterSpacing: 1 },
  tail: {
    position: 'absolute', left: -8, top: 6,
    borderTopWidth: 6, borderBottomWidth: 6, borderRightWidth: 8,
    borderTopColor: 'transparent', borderBottomColor: 'transparent', borderRightColor: Colors.ink,
  },
});

// ─── Home Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { freePlay, recordPlay, tapOneMore, dailyStatus } = useAppStore();

  const [copyIdx, setCopyIdx] = useState(0);
  const [brainExpr, setBrainExpr] = useState<BrainExpression>('smirk');

  const today = new Date().toISOString().split('T')[0];
  const playsToday   = freePlay.date === today ? freePlay.playsToday  : 0;
  const oneMoreTaps  = freePlay.date === today ? freePlay.oneMoreTaps : 0;
  const totalAllowed = FREE_LIMIT + oneMoreTaps * 3;
  const playsLeft    = Math.max(0, totalAllowed - playsToday);
  const isGated      = playsLeft === 0;
  const isProWall    = isGated && oneMoreTaps >= ONE_MORE_LIMIT;

  // Today's Daily Race state — drives the home card's "completed" treatment.
  // Persistence is via AsyncStorage (mothership Appendix D #2 resolved 2026-04-26).
  // Phase 4 will swap this client-side date check for the 6am-ET-anchored reset
  // (Appendix D #7 resolved 2026-04-24); current local-date comparison is the
  // pre-Phase-4 fallback.
  //
  // Visual treatment when played: card stays fully vivid cyan. Label gets a
  // "✓" check. Sublabel shows the score and reset time. Target decor's red
  // accent flips to green to reinforce the completed state. Build-for-the-flex
  // — bright + score-visible, not dimmed.
  const dailyPlayedToday = dailyStatus.date === today && dailyStatus.played;
  const dailyLabel = dailyPlayedToday ? 'Daily Race ✓' : 'Daily Race';
  const dailySublabel = dailyPlayedToday
    ? `${dailyStatus.score.toLocaleString()} pts · back at 6am`
    : 'fresh every 6am';

  function go(route: string) { router.push(route as any); }

  function handleOneMore() {
    if (isProWall) return;
    tapOneMore();
    setCopyIdx(i => (i + 1) % ONE_MORE_LINES.length);
  }

  function pokeBrain() {
    setBrainExpr('hype');
    setTimeout(() => setBrainExpr('smirk'), 500);
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Background (Sunburst + Halftone) lives in root app/_layout.tsx — global. */}
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* ── Hero: brain (left) + wordmark (right) ── */}
        <View style={styles.hero}>
          {/* Brain + speech bubble */}
          <View style={styles.brainCol}>
            <View style={styles.bubbleAbove}>
              <SpeechBubble text="ready?" />
            </View>
            <TouchableOpacity onPress={pokeBrain} activeOpacity={1}>
              <Brain size={88} expression={brainExpr} wiggle />
            </TouchableOpacity>
          </View>

          {/* Wordmark */}
          <View style={styles.wordmarkCol}>
            <Wordmark
              color={Colors.red}
              outlineColor={Colors.ink}
              accentColor={Colors.yellow}
              shadowColor={Colors.ink}
              fontSize={44}
            />
          </View>
        </View>

        {/* ── Mode cards ── */}
        <View style={styles.cards}>

          {/* Quickmatch — tall hero card */}
          <ArcadeCard
            label="Quickmatch"
            sublabel="head-to-head · instant"
            color={Colors.quickmatch.bg}
            fg={Colors.quickmatch.fg}
            tilt={0}
            height={148}
            contentOffsetY={-18}
            disabled={isGated}
            onPress={() => go('/echo')}
            bob
            floatPhase={0}
            decor={
              <VsDecor
                fg={Colors.quickmatch.fg}
                ink={Colors.ink}
                accent={Colors.red}
              />
            }
            footer={
              <LivePlayersStrip
                fg={Colors.quickmatch.fg}
                accent={Colors.yellow}
              />
            }
          />

          {/* Daily Race — when today's race is done: ✓ next to label, score
              + reset time in sublabel, target accent flips red → green. Card
              stays fully vivid. */}
          <ArcadeCard
            label={dailyLabel}
            sublabel={dailySublabel}
            color={Colors.dailyrace.bg}
            fg={Colors.dailyrace.fg}
            tilt={0}
            height={96}
            disabled={isGated}
            onPress={() => go('/daily')}
            bob
            floatPhase={1.6}
            decor={
              <DailyDecor
                fg={Colors.dailyrace.bg}
                ink={Colors.ink}
                accent={dailyPlayedToday ? '#22C55E' : Colors.red}
              />
            }
          />
        </View>

        {/* ── Social layer ── */}
        <InviteFriendsChip onPress={() => {}} />
        <GlobalLeaderboard />

        {/* ── Gate / One More / Pro wall ── */}
        {isGated && !isProWall && (
          <TouchableOpacity style={styles.gateButton} onPress={handleOneMore}>
            <Text style={styles.gateButtonText}>one more turn!</Text>
            <Text style={styles.gateCopy}>{ONE_MORE_LINES[copyIdx]}</Text>
          </TouchableOpacity>
        )}

        {isProWall && (
          <ProWall onGetPro={() => { /* purchase flow TBD */ }} />
        )}

        {/* ── Footer ── */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>since 2012</Text>
          <Text style={styles.footerDot}>·</Text>
          <Text style={styles.footerText}>1001 og questions</Text>
        </View>

        <Text style={styles.cta}>
          Get super smart today by getting Super Smart today!
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  // Transparent — the global Sunburst + Halftone in root _layout.tsx show through.
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    gap: 14,
  },

  // Hero — side by side
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 4,
    minHeight: 110,
  },
  brainCol: {
    alignItems: 'flex-start',
    flexShrink: 0,
  },
  bubbleAbove: {
    marginBottom: 4,
    marginLeft: 8,
  },
  wordmarkCol: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },

  // Cards
  cards: { gap: 10 + CARD_DEPTH },

  // Gate / One More
  gateButton: { alignItems: 'center', paddingVertical: 4 },
  gateButtonText: { fontFamily: Fonts.black, fontSize: 16, color: Colors.red },
  gateCopy: {
    fontFamily: Fonts.mono, fontSize: 12, color: '#9ca3af',
    fontStyle: 'italic', marginTop: 3, textAlign: 'center',
  },

  // Footer
  footer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 4 },
  footerText: { fontFamily: Fonts.mono, fontSize: 8, textTransform: 'uppercase', letterSpacing: 2, color: Colors.ink, opacity: 0.6 },
  footerDot:  { fontFamily: Fonts.mono, fontSize: 8, color: Colors.ink, opacity: 0.4 },
  cta: { fontFamily: Fonts.mono, fontSize: 11, color: '#d1d5db', textAlign: 'center', fontStyle: 'italic' },
});
