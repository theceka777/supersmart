// DailyRaceRankings.tsx — home-screen Daily Race preview panel.
//
// What it is: a slim "today's race" panel that lives below the mode cards on
// the home screen. Replaces the older GlobalLeaderboard widget (with its
// OVERALL/DAILY tab strip + 412K total counter) — that browsing surface lives
// on the League tab now. Home only previews TODAY.
//
// Two states, driven by `played`:
//
//   played=false (fresh)
//     ─ DAILY RACE RANKINGS · DAY 247 (header)
//     ─ #1 KENJI_84    1,247
//     ─ #2 VELVET      1,180
//     ─ #3 MR_BRAIN    1,142
//     ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
//     ─ #— [brain avatar] PLAY TO ENTER  [START →]   (yellow row)
//     ─ SEE FULL RANKING IN LEAGUE ↦
//
//   played=true (done)
//     ─ DAILY RACE RANKINGS · DAY 247 (header)
//     ─ #1 KENJI_84    1,247
//     ─ #2 VELVET      1,180
//     ─ #3 MR_BRAIN    1,142
//     ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─
//     ─ #34 [brain avatar] YOU  650            (yellow highlighted row)
//     ─ SEE FULL RANKING IN LEAGUE ↦
//
// Rationale (changelog session 27):
//   • Brain on YOU row uses expression="hype" — this is "you in the race".
//   • Brain on home top-left uses expression="smirk" — this is "your home".
//     Two distinct jobs, brain reads as the player in both.
//   • Top-3 rows use placeholder colored monogram discs (AvatarDisc) until
//     real player avatars arrive (Phase 4).
//
// Data: top-3 + DAY number are mocked locally. Real data wires in Phase 4
// (Daily Race board endpoint). Tap rows route to /daily for now.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Brain } from '@/components/Brain';
import { Colors, Fonts, Tier, TierName } from '@/constants/theme';

interface TopRow {
  rank: number;
  name: string;
  score: number;
  avatarBg: string;       // disc fill for the monogram placeholder
  initial: string;
  tier: TierName;
}

interface DailyRaceRankingsProps {
  /** Has the local player completed today's Daily Race? */
  played: boolean;
  /** Day count (since launch). Mocked at 247 today; Phase 4 reads from server. */
  dayNumber?: number;
  /** Local player's standings — only used when played=true. */
  you?: { rank: number; score: number };
  /** Phase 4 follow-up: pass real top-3 from server. Falls back to placeholders. */
  top3?: TopRow[];
  /** Routing callbacks. */
  onSeeFullRanking?: () => void;
  onPlayDaily?: () => void;
  onTapRow?: (rank: number) => void;
}

const PLACEHOLDER_TOP3: TopRow[] = [
  { rank: 1, name: 'KENJI_84', score: 1247, initial: 'K', avatarBg: Colors.yellow,         tier: 'legend'    },
  { rank: 2, name: 'VELVET',   score: 1180, initial: 'V', avatarBg: Colors.dailyrace.bg,   tier: 'qualifier' },
  { rank: 3, name: 'MR_BRAIN', score: 1142, initial: 'M', avatarBg: Colors.red,            tier: 'finalist'  },
];

export function DailyRaceRankings({
  played,
  dayNumber = 247,
  you,
  top3 = PLACEHOLDER_TOP3,
  onSeeFullRanking,
  onPlayDaily,
  onTapRow,
}: DailyRaceRankingsProps) {
  // Header pulse — same cadence as the LivePlayersStrip dot, ~1.6s.
  const pulseOp = useSharedValue(1);
  React.useEffect(() => {
    pulseOp.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 800 }),
        withTiming(1.0, { duration: 800 }),
      ),
      -1,
      false,
    );
  }, []);
  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulseOp.value }));

  return (
    <View style={s.container}>
      {/* Header — pulsing dot + DAILY RACE RANKINGS · DAY 247 */}
      <View style={s.header}>
        <Animated.View style={[s.dot, pulseStyle]} />
        <Text style={s.headerTitle}>Daily Race Rankings</Text>
        <Text style={s.headerEyebrow}>· Day {dayNumber}</Text>
      </View>

      {/* Top 3 */}
      {top3.map((row, i) => (
        <RankRow
          key={row.rank}
          rank={row.rank}
          name={row.name}
          score={row.score}
          avatar={
            <AvatarDisc
              initial={row.initial}
              bg={row.avatarBg}
              tier={row.tier}
              size={28}
            />
          }
          alt={i % 2 === 1}
          onPress={onTapRow ? () => onTapRow(row.rank) : undefined}
        />
      ))}

      {/* Dashed divider between top-3 and the YOU/PlayToEnter row */}
      <View style={s.divider} />

      {/* You row — highlighted when played; CTA stub when fresh */}
      {played && you ? (
        <RankRow
          rank={you.rank}
          name="You"
          score={you.score}
          avatar={<BrainAvatar size={32} tier="newcomer" />}
          highlight
          onPress={onTapRow ? () => onTapRow(you.rank) : undefined}
        />
      ) : (
        <PlayToEnterRow onPress={onPlayDaily} />
      )}

      {/* Footer link — see full ranking in League */}
      <Pressable onPress={onSeeFullRanking} style={s.footer}>
        <Text style={s.footerText}>See full ranking in League</Text>
        <Text style={s.footerArrow}>↦</Text>
      </Pressable>
    </View>
  );
}

// ─── Row primitives ───────────────────────────────────────────────────────────

interface RankRowProps {
  rank: number;
  name: string;
  score: number;
  avatar: React.ReactNode;
  alt?: boolean;
  highlight?: boolean;
  onPress?: () => void;
}

function RankRow({ rank, name, score, avatar, alt, highlight, onPress }: RankRowProps) {
  const Wrap: any = onPress ? Pressable : View;
  return (
    <Wrap
      onPress={onPress}
      style={[
        s.row,
        alt ? s.rowAlt : null,
        highlight ? s.rowHighlight : null,
      ]}
    >
      <Text style={s.rowRank}>#{rank}</Text>
      {avatar}
      <Text style={s.rowName} numberOfLines={1}>{name.toUpperCase()}</Text>
      <Text style={s.rowScore}>{score.toLocaleString()}</Text>
    </Wrap>
  );
}

function PlayToEnterRow({ onPress }: { onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.row, s.rowHighlight]}>
      <Text style={s.rowRank}>#—</Text>
      <BrainAvatar size={32} tier="newcomer" />
      <Text style={s.rowName} numberOfLines={1}>PLAY TO ENTER</Text>
      <View style={s.startPill}>
        <Text style={s.startPillText}>START →</Text>
      </View>
    </Pressable>
  );
}

// ─── Avatars ──────────────────────────────────────────────────────────────────

interface AvatarDiscProps {
  initial: string;
  bg: string;
  tier?: TierName;
  size?: number;
}

// Placeholder leaderboard avatar — single-letter monogram on a colored disc
// with a tier-colored border. Used for the top-3 rows until real player
// avatars arrive in Phase 4.
function AvatarDisc({ initial, bg, tier = 'newcomer', size = 28 }: AvatarDiscProps) {
  return (
    <View
      style={[
        s.avatarDisc,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          borderColor: Tier[tier],
        },
      ]}
    >
      <Text style={[s.avatarInitial, { fontSize: size * 0.45 }]}>{initial}</Text>
    </View>
  );
}

// YOU-row avatar — the player's brain inside a tier-colored ring.
// Wiggle disabled (the disc constrains it visually) and expression="hype"
// (this is "you in the race", not the more reflective top-left mascot).
function BrainAvatar({ size = 32, tier = 'newcomer' as TierName }: { size?: number; tier?: TierName }) {
  return (
    <View
      style={[
        s.brainAvatarWrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: Tier[tier],
        },
      ]}
    >
      <Brain size={size * 1.05} expression="hype" wiggle={false} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    backgroundColor: Colors.cream,
    borderWidth: 2.5,
    borderColor: Colors.ink,
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: Colors.ink,
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 4,
  },

  // Header — ink bg, cream type, pulsing yellow dot.
  header: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.yellow,
  },
  headerTitle: {
    fontFamily: Fonts.black,
    fontSize: 13,
    letterSpacing: -0.2,
    color: Colors.cream,
    textTransform: 'uppercase',
  },
  headerEyebrow: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: Colors.cream,
    opacity: 0.6,
    textTransform: 'uppercase',
  },

  // Rows — same density across top-3, YOU, and PlayToEnter so the panel
  // has zero reflow when the state flips.
  row: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  rowAlt: {
    backgroundColor: 'rgba(26,21,34,0.04)',
  },
  rowHighlight: {
    backgroundColor: Colors.yellow,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: Colors.ink,
  },
  rowRank: {
    width: 28,
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    color: Colors.ink,
    opacity: 0.6,
  },
  rowName: {
    flex: 1,
    fontFamily: Fonts.black,
    fontSize: 14,
    letterSpacing: -0.2,
    color: Colors.ink,
    textTransform: 'uppercase',
  },
  rowScore: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    fontWeight: '700',
    color: Colors.ink,
    fontVariant: ['tabular-nums'],
  },

  // Dashed divider between top-3 and the YOU row.
  divider: {
    height: 0,
    borderTopWidth: 1,
    borderTopColor: Colors.ink,
    borderStyle: 'dashed',
    opacity: 0.6,
  },

  // PlayToEnter CTA pill at the right of the row.
  startPill: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  startPillText: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 1.2,
    color: Colors.cream,
    textTransform: 'uppercase',
  },

  // Footer — link to League.
  footer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(26,21,34,0.15)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1.2,
    color: Colors.ink,
    opacity: 0.55,
    textTransform: 'uppercase',
  },
  footerArrow: {
    fontFamily: Fonts.black,
    fontSize: 12,
    color: Colors.ink,
  },

  // Avatars.
  avatarDisc: {
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
  avatarInitial: {
    fontFamily: Fonts.black,
    color: Colors.cream,
  },
  brainAvatarWrap: {
    borderWidth: 3,
    backgroundColor: Colors.cream,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    flexShrink: 0,
    shadowColor: Colors.ink,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 2,
  },
});
