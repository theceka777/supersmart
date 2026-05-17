// components/round/UnstoppableBanner.tsx
// "★ UNSTOPPABLE ★" banner that flashes when the player hits the 10-streak.
// Red ink-bordered pill, yellow text, rotated -4° for swagger, ~1500ms total
// envelope with a spring-y overshoot on entry. Fires once per Unstoppable
// trigger; caller manages the active flag + a re-mount key so back-to-back
// Unstoppables (rare) cleanly re-animate.

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
  active: boolean;
  /** Increment this each fire so the same `active=true` re-triggers the animation. */
  fireKey: number;
}

export function UnstoppableBanner({ active, fireKey }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.3);

  useEffect(() => {
    if (!active) return;
    // Envelope based on `rUnstoppable` keyframe (1500ms total):
    //   0%   → opacity 0, scale 0.3
    //   14%  → opacity 1, scale 1.25  (210ms)
    //   24%  → scale 0.92             (150ms)
    //   34%  → scale 1.05             (150ms)
    //   44%  → scale 1.00             (150ms)
    //   78%  → hold                   (510ms)
    //   100% → opacity 0, scale 0.9   (330ms)
    opacity.value = withSequence(
      withTiming(1, { duration: 210, easing: Easing.out(Easing.ease) }),
      withDelay(960, withTiming(0, { duration: 330, easing: Easing.in(Easing.ease) })),
    );
    scale.value = withSequence(
      withTiming(1.25, { duration: 210, easing: Easing.out(Easing.cubic) }),
      withTiming(0.92, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withTiming(1.05, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withTiming(1.00, { duration: 150, easing: Easing.inOut(Easing.ease) }),
      withDelay(510, withTiming(0.90, { duration: 330, easing: Easing.in(Easing.ease) })),
    );
  }, [active, fireKey, opacity, scale]);

  // Hooks must be called unconditionally — early-return for `!active` lives
  // AFTER all hooks below.
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: -110 },  // half nominal width for `left: 50%` offset
      { rotate: '-4deg' },
      { scale: scale.value },
    ],
  }));

  if (!active) return null;

  return (
    <Animated.View style={[styles.wrap, animStyle]} pointerEvents="none">
      <View style={styles.banner}>
        <Text style={styles.text}>★ UNSTOPPABLE ★</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 195,
    left: '50%',
    zIndex: 80,
  },
  banner: {
    backgroundColor: Colors.red,
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 2.5,
    borderColor: Colors.ink,
    boxShadow: `3px 3px 0 ${Colors.ink}`,
    alignItems: 'center',
  },
  text: {
    fontFamily: Fonts.black,
    fontSize: 18,
    color: Colors.yellow,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
