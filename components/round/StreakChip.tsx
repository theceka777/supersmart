// components/round/StreakChip.tsx
// Compact streak pill that sits beneath the timer when streak >= 3.
// Background tinted with the tier color; pulses at tier ≥ 2 for added hype.
// Faithful port of `StreakChip` (compact variant) from `round-layouts.jsx`.

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';

import { Colors, Fonts, StreakTier } from '@/constants/theme';
import type { StreakTierLevel } from './constants';

interface Props {
  streak: number;
  tier: StreakTierLevel;
}

export function StreakChip({ streak, tier }: Props) {
  // All hooks must be called unconditionally — early-return below lives
  // AFTER hooks.
  const safeTier = (tier >= 1 ? tier : 1) as 1 | 2 | 3 | 4;
  const tierColor = StreakTier.colors[safeTier] ?? Colors.yellow;
  const baseScale = 1 + tier * 0.04;

  const scale = useSharedValue(baseScale);

  // Pulse only at tier 2+ (orange / pink / red). Matches design's
  // `tier >= 2 ? 'rPulse 800ms ease-in-out infinite' : 'none'`.
  useEffect(() => {
    cancelAnimation(scale);
    if (tier >= 2) {
      scale.value = withRepeat(
        withSequence(
          withTiming(baseScale * 1.06, { duration: 400, easing: Easing.inOut(Easing.ease) }),
          withTiming(baseScale,        { duration: 400, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      scale.value = withTiming(baseScale, { duration: 200 });
    }
    return () => cancelAnimation(scale);
  }, [tier, baseScale, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  // Hook calls done — safe to early-return.
  if (streak < 3 || tier === 0) return null;

  return (
    <Animated.View style={[styles.chip, { backgroundColor: tierColor }, animStyle]}>
      <Text style={styles.streakNum}>{streak}</Text>
      <Text style={styles.streakLabel}>streak</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: Colors.ink,
    boxShadow: `0 3px 0 ${Colors.ink}`,
  },
  streakNum: {
    fontFamily: Fonts.black,
    fontSize: 16,
    color: Colors.ink,
  },
  streakLabel: {
    fontFamily: Fonts.black,
    fontSize: 10,
    color: Colors.ink,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    opacity: 0.85,
  },
});
