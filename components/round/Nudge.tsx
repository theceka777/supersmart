// components/round/Nudge.tsx
// Onboarding nudge that pops at the center of the screen for ~2.2s when:
//   • The player gets their FIRST speed-bonus answer ("Speed bonus!" etc.)
//   • The player hits their FIRST 3-streak ("3 in a row — 2×!")
// Both fire once per round; the parent gates with `seenSpeed` / `seenStreak` refs.
//
// Animation matches the `rNudge` keyframe in Claude Design — fade + slide-up
// + slight overshoot on entry, fade + slide-down on exit. 2200ms total.

import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

import { Colors, Fonts } from '@/constants/theme';

interface Props {
  /** Text to display. Pass a non-null string to show the nudge; null = hidden. */
  text: string | null;
  /** Background color of the nudge pill. Defaults to yellow (speed bonus). */
  color?: string;
  /** Bumps animation key — pass a counter that increments each fire so identical
   *  text on a repeat trigger still re-animates. */
  fireKey?: number;
}

export function Nudge({ text, color = Colors.yellow, fireKey = 0 }: Props) {
  const opacity = useSharedValue(0);
  const ty = useSharedValue(-8);
  const scale = useSharedValue(0.85);

  useEffect(() => {
    if (!text) return;
    // Reset
    opacity.value = 0;
    ty.value = -8;
    scale.value = 0.85;
    // 2200ms envelope: 0-12% enter, 12-80% hold, 80-100% exit
    // Times in ms: enter 264ms, hold 1496ms, exit 440ms
    opacity.value = withSequence(
      withTiming(1, { duration: 264, easing: Easing.out(Easing.ease) }),
      withDelay(1496, withTiming(0, { duration: 440, easing: Easing.in(Easing.ease) })),
    );
    ty.value = withSequence(
      withTiming(0, { duration: 264, easing: Easing.out(Easing.ease) }),
      withDelay(1496, withTiming(-6, { duration: 440, easing: Easing.in(Easing.ease) })),
    );
    scale.value = withSequence(
      withTiming(1.05, { duration: 176, easing: Easing.out(Easing.ease) }),  // 264 * 0.667
      withTiming(1.00, { duration: 88,  easing: Easing.out(Easing.ease) }),
      withDelay(1408, withTiming(0.95, { duration: 440, easing: Easing.in(Easing.ease) })),
    );
  }, [text, fireKey, opacity, ty, scale]);

  // Hooks must be called unconditionally — early-return for `!text` lives
  // AFTER all hooks below.
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: -120 },          // half of nominal width (offsets `left: 50%`)
      { translateY: ty.value },
      { scale: scale.value },
    ],
  }));

  if (!text) return null;

  return (
    <Animated.View
      style={[styles.wrap, { backgroundColor: color }, animStyle]}
      pointerEvents="none"
    >
      <Text style={styles.text}>{text}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    // Width is implicit via the text; min-width gives a consistent feel.
    minWidth: 240,
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.ink,
    boxShadow: `4px 4px 0 ${Colors.ink}`,
    zIndex: 65,
  },
  text: {
    fontFamily: Fonts.black,
    fontSize: 18,
    color: Colors.ink,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
});
