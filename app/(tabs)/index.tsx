// Home screen — Super Smart 2026 v2 (home-screen polish pass, session 27)
// Two modes: Quickmatch (hero) + Daily Race (fresh / done states).
// Brain + wordmark hero (no speech bubble). Animated card decorators.
// LivePlayersStrip footer on Quickmatch. Social layer + DailyRaceRankings below.
//
// State-driven surfaces (driven by `dailyPlayedToday`):
//   • Daily Race CARD     — fresh: target decor + "FRESH EVERY 6AM"
//                          done : done decor + "650 PTS · #34 OF 1,247"
//                                 + small "BACK IN HH:MM:SS" countdown line
//   • Daily Race RANKINGS — fresh: PlayToEnter row in place of YOU row
//                          done : highlighted YOU row with brain avatar
//
// Per session 27 design pass:
//   • Speech bubble removed from hero
//   • GlobalLeaderboard removed from home (lives on League tab)
//   • Brain promoted to 92pt, hero vertically center-aligned
//   • Daily card "done" state earns its space via live ticking, not press affordance

import { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/app/store';
import { getRaceDate, isUSDST } from '@/app/clock';
import { Brain, BrainExpression } from '@/components/Brain';
import { Wordmark } from '@/components/Wordmark';
import { ArcadeCard } from '@/components/ArcadeCard';
import { VsDecor } from '@/components/VsDecor';
import { DailyDecor } from '@/components/DailyDecor';
import { LivePlayersStrip } from '@/components/LivePlayersStrip';
import { InviteFriendsChip } from '@/components/InviteFriendsChip';
import { DailyRaceRankings } from '@/components/DailyRaceRankings';
// GlobalLeaderboard intentionally not imported — lives on the League tab now.
// Sunburst + Halftone render globally in app/_layout.tsx (session 7).
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

// ─── Countdown to next 6am Eastern ───────────────────────────────────────────
//
// Until Phase 4 lands a server clock (Appendix D follow-up), the countdown is
// computed from the device's wall clock against America/New_York 06:00.
// `isUSDST` lives in app/clock.ts alongside getRaceDate (the shared 6am-ET
// day-boundary helper); this hook just consumes it.
//
// Strategy: figure out today's "ET 6am" as a Date instant, then if it's
// already past, jump to tomorrow's ET 6am.
//
// Returns "HH:MM:SS" — re-renders every second.
function useCountdownToNext6amET(): string {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  // Approximate ET offset: -4 (EDT) Mar–Nov, -5 (EST) Nov–Mar.
  const etOffsetHours = isUSDST(now) ? -4 : -5;
  // ET 6am today, expressed as a UTC instant.
  const etSixAmUTC = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate(),
    6 - etOffsetHours, 0, 0, 0,
  );
  let target = etSixAmUTC;
  if (now.getTime() >= etSixAmUTC) target += 24 * 60 * 60 * 1000;

  const diff = Math.max(0, target - now.getTime());
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// ─── Home Screen ─────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { freePlay, recordPlay, tapOneMore, dailyStatus } = useAppStore();

  const [copyIdx, setCopyIdx] = useState(0);
  const [brainExpr, setBrainExpr] = useState<BrainExpression>('smirk');

  // 6am-ET-anchored race date — must match the lockout key written by store.tsx.
  // See app/clock.ts.
  const today = getRaceDate();
  const playsToday   = freePlay.date === today ? freePlay.playsToday  : 0;
  const oneMoreTaps  = freePlay.date === today ? freePlay.oneMoreTaps : 0;
  const totalAllowed = FREE_LIMIT + oneMoreTaps * 3;
  const playsLeft    = Math.max(0, totalAllowed - playsToday);
  const isGated      = playsLeft === 0;
  const isProWall    = isGated && oneMoreTaps >= ONE_MORE_LIMIT;

  // Today's Daily Race state — drives the home surfaces' done/fresh treatment.
  // Persistence is via AsyncStorage (mothership Appendix D #2 resolved 2026-04-26).
  // Day boundary is 6am-ET-anchored (Appendix D #7 resolved 2026-04-24) via
  // app/clock.ts getRaceDate(). Anti-tamper deferred to Phase 4 server-side
  // submission validation (Tier 1 #4).
  //
  // When done, the card becomes a live status card (live ticking countdown,
  // score, and rank) rather than a press-to-play affordance. The DailyRaceRankings
  // panel below also branches on this — YOU row when done, PlayToEnter row when
  // fresh.
  //
  // Mocked until Phase 4: the user's daily rank + total players count. The
  // values feel "alive" via the live countdown alone for now; real
  // rank-moves-through-the-day requires the Daily Race board endpoint.
  // Appendix D follow-up tracks the swap to a server source.
  const dailyPlayedToday = dailyStatus.date === today && dailyStatus.played;
  const countdown = useCountdownToNext6amET();
  const mockDailyRank = 34;
  const mockDailyTotal = 1247;

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

        {/* ── Hero: brain (left) + wordmark (right), no speech bubble ── */}
        <View style={styles.hero}>
          {/* Brain — also serves as the user's customizable avatar */}
          <View style={styles.brainCol}>
            <TouchableOpacity onPress={pokeBrain} activeOpacity={1}>
              <Brain size={92} expression={brainExpr} wiggle />
            </TouchableOpacity>
          </View>

          {/* Wordmark */}
          <View style={styles.wordmarkCol}>
            <Wordmark
              color={Colors.red}
              outlineColor={Colors.ink}
              accentColor={Colors.yellow}
              shadowColor={Colors.ink}
              fontSize={42}
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

          {/* Daily Race — fresh state (target decor + FRESH EVERY 6AM)
              vs done state (done decor + 650 PTS · #34 OF 1,247 + small
              live BACK IN HH:MM:SS countdown). Card stays fully vivid in
              both states. Tap routes to /daily, which renders the alreadyPlayed
              view + result grid when done, or the round when fresh. */}
          <ArcadeCard
            label="Daily Race"
            sublabel={
              dailyPlayedToday
                ? `${dailyStatus.score.toLocaleString()} PTS · #${mockDailyRank} OF ${mockDailyTotal.toLocaleString()}`
                : 'fresh every 6am'
            }
            tertiary={dailyPlayedToday ? `BACK IN ${countdown}` : undefined}
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
                done={dailyPlayedToday}
                fg={Colors.dailyrace.bg}
                ink={Colors.ink}
                accent={dailyPlayedToday ? '#22C55E' : Colors.red}
              />
            }
          />
        </View>

        {/* ── Social layer ── */}
        <InviteFriendsChip onPress={() => {}} />
        <DailyRaceRankings
          played={dailyPlayedToday}
          dayNumber={247}
          you={
            dailyPlayedToday
              ? { rank: mockDailyRank, score: dailyStatus.score }
              : undefined
          }
          onSeeFullRanking={() => router.push('/(tabs)/league' as any)}
          onPlayDaily={() => go('/daily')}
        />

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
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
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
