// components/round/PlayerBlock.tsx
// One side of the VS strip — name (small mono), score (big black, shadow-tinted
// by streak tier), and the avatar. The YOU side shows the Brain mascot;
// the opponent side shows a placeholder disc with a single-letter monogram.
// Faithful port of `PlayerBlock` from Claude Design `round-layouts.jsx`.

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { Colors, Fonts, StreakTier } from '@/constants/theme';
import { Brain, BrainExpression } from '@/components/Brain';
import type { StreakTierLevel } from './constants';

interface Props {
  side: 'you' | 'opp';
  name: string;
  score: number;
  /** Used only for the `you` side — tier drives the score text-shadow color. */
  tier?: StreakTierLevel;
  /** Brain mascot expression — `you` side only. */
  brainExpr?: BrainExpression;
  /** Monogram letter for the opponent disc (e.g. 'E' for ECHO·47). */
  oppInitial?: string;
}

export function PlayerBlock({
  side,
  name,
  score,
  tier = 0,
  brainExpr = 'smirk',
  oppInitial = 'E',
}: Props) {
  const isYou = side === 'you';
  const tierColor = (tier >= 1 ? StreakTier.colors[tier] : Colors.yellow) ?? Colors.yellow;

  return (
    <View style={[styles.block, isYou ? styles.blockYou : styles.blockOpp]}>
      <View style={[styles.row, isYou ? styles.rowYou : styles.rowOpp]}>
        <View style={styles.avatarSlot}>
          {isYou ? (
            // Inline brain at 48pt with wiggle. The mascot sits slightly proud
            // of its avatar slot — design padding bleed.
            <View style={styles.brainBleed}>
              <Brain size={48} expression={brainExpr} wiggle />
            </View>
          ) : (
            <View style={styles.oppDisc}>
              <Text style={styles.oppInitial}>{oppInitial}</Text>
            </View>
          )}
        </View>

        <View style={[styles.col, isYou ? styles.colYou : styles.colOpp]}>
          <Text style={styles.name} numberOfLines={1}>{name}</Text>
          <Text
            style={[
              styles.score,
              {
                textShadowColor: isYou && tier >= 1 ? tierColor : Colors.yellow,
              },
            ]}
            numberOfLines={1}
          >
            {score.toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    maxWidth: 140,
    flexDirection: 'column',
    gap: 4,
  },
  blockYou: { alignItems: 'flex-start' },
  blockOpp: { alignItems: 'flex-end' },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rowYou: { flexDirection: 'row' },
  rowOpp: { flexDirection: 'row-reverse' },

  avatarSlot: {
    width: 44,
    height: 44,
    flexShrink: 0,
  },
  brainBleed: {
    position: 'absolute',
    top: -2, left: -2, right: -2, bottom: -2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  oppDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#9ca3af',
    borderWidth: 3,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.85,
    boxShadow: `0 2px 0 ${Colors.ink}`,
  },
  oppInitial: {
    fontFamily: Fonts.black,
    color: Colors.cream,
    fontSize: 18,
  },

  col: {
    flexDirection: 'column',
  },
  colYou: { alignItems: 'flex-start' },
  colOpp: { alignItems: 'flex-end' },

  name: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.ink,
    opacity: 0.6,
    marginBottom: 3,
    fontWeight: '700',
  },
  score: {
    fontFamily: Fonts.black,
    fontSize: 24,
    color: Colors.ink,
    letterSpacing: -0.5,
    fontVariant: ['tabular-nums'],
    // Hard 2px/2px offset matches Claude Design's `textShadow: 2px 2px 0`.
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 0,
  },
});
