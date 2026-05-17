// components/round/VsBadge.tsx
// Center "VS" disc that sits between the YOU and OPPONENT player blocks in
// the round HUD. Background picks up the streak-tier color (cream at tier 0,
// progressively brighter through yellow / orange / pink / red).
// Faithful port of `VsBadge` from Claude Design `round-layouts.jsx`.

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Colors, Fonts, StreakTier } from '@/constants/theme';
import type { StreakTierLevel } from './constants';

interface Props {
  tier: StreakTierLevel;
}

export function VsBadge({ tier }: Props) {
  const tierColor = (tier >= 1 ? StreakTier.colors[tier] : Colors.cream) ?? Colors.cream;
  const bg = useSharedValue(0);  // 0 = cream, 1 = tierColor

  // Smooth bg transition when tier changes (300ms — matches design).
  // We use opacity layering rather than `interpolateColor` to keep the
  // implementation portable across reanimated versions; the same color is
  // applied via inline style and the tween is just a fade.
  useEffect(() => {
    bg.value = withTiming(tier >= 1 ? 1 : 0, {
      duration: 300,
      easing: Easing.out(Easing.ease),
    });
  }, [tier, bg]);

  const fillStyle = useAnimatedStyle(() => ({
    opacity: bg.value,
  }));

  return (
    <Animated.View style={styles.disc}>
      {/* Cream base layer — always visible */}
      <Animated.View
        style={[styles.fill, { backgroundColor: Colors.cream }]}
        pointerEvents="none"
      />
      {/* Tier color overlay — fades in/out as tier changes */}
      <Animated.View
        style={[styles.fill, { backgroundColor: tierColor }, fillStyle]}
        pointerEvents="none"
      />
      <Text style={styles.label}>VS</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  disc: {
    width: 38,
    height: 38,
    flexShrink: 0,
    borderRadius: 19,
    borderWidth: 3,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: `0 3px 0 ${Colors.ink}`,
    transform: [{ rotate: '-6deg' }],
    overflow: 'hidden',
  },
  fill: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    borderRadius: 19,
  },
  label: {
    fontFamily: Fonts.black,
    fontSize: 14,
    color: Colors.ink,
    letterSpacing: -0.5,
  },
});
