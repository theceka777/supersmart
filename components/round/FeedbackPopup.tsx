// components/round/FeedbackPopup.tsx
// The center-of-screen floating popup that fires on every answer:
//   • correct → ink-bordered card, yellow text, big "+250 (×2)" style label
//   • wrong   → smaller ink card showing the right answer's text
//   • penalty → red-bordered card, cream text "−50"
//
// Animation matches the `rPopup` keyframe in Claude Design — a bouncy entry
// with rotation tilt, brief hold, then float-up + fade-out (900ms total).
// Caller re-keys the popup per answer so each fire cleanly re-animates.

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Colors, Fonts } from '@/constants/theme';

export type FeedbackKind = 'correct' | 'wrong' | 'penalty';

export interface Feedback {
  kind: FeedbackKind;
  text: string;
  /** Re-mount key — increment each fire. */
  fireKey: number;
}

interface Props {
  feedback: Feedback | null;
}

export function FeedbackPopup({ feedback }: Props) {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.6);
  const ty = useSharedValue(-30);  // start lower than rest position (in %)

  useEffect(() => {
    if (!feedback) return;
    // Reset (the `fireKey` change triggers this effect)
    opacity.value = 0;
    scale.value = 0.6;
    ty.value = -30;

    // 900ms envelope:
    //   0   - 162ms (0-18%)  : opacity 0→1, scale 0.6→1.15, ty -30→-55
    //   162 - 315ms (18-35%) : scale 1.15→0.95, ty -55→-50
    //   315 - 450ms (35-50%) : scale 0.95→1.00, ty hold
    //   450 - 720ms (50-80%) : hold
    //   720 - 900ms (80-100%): opacity 1→0, scale 1→0.95, ty -50→-75
    opacity.value = withSequence(
      withTiming(1, { duration: 162, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 558 }),  // hold
      withTiming(0, { duration: 180, easing: Easing.in(Easing.ease) }),
    );
    scale.value = withSequence(
      withTiming(1.15, { duration: 162, easing: Easing.out(Easing.cubic) }),
      withTiming(0.95, { duration: 153, easing: Easing.inOut(Easing.ease) }),
      withTiming(1.00, { duration: 135, easing: Easing.inOut(Easing.ease) }),
      withTiming(1.00, { duration: 270 }),
      withTiming(0.95, { duration: 180, easing: Easing.in(Easing.ease) }),
    );
    ty.value = withSequence(
      withTiming(-55, { duration: 162, easing: Easing.out(Easing.cubic) }),
      withTiming(-50, { duration: 153, easing: Easing.inOut(Easing.ease) }),
      withTiming(-50, { duration: 405 }),  // hold position 35-80%
      withTiming(-75, { duration: 180, easing: Easing.in(Easing.ease) }),
    );
  }, [feedback?.fireKey, feedback, opacity, scale, ty]);

  // Hooks must be called unconditionally — early-return below lives AFTER hooks.
  const animStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateX: -110 },               // half-width offset for `left: 50%`
      { translateY: ty.value },           // % equivalent — RN doesn't support % on translateY in a worklet; we use px-scale ~1% = 0.5px below
      { scale: scale.value },
      { rotate: '-3deg' },
    ],
  }));

  if (!feedback) return null;

  const isCorrect = feedback.kind === 'correct';
  const isPenalty = feedback.kind === 'penalty';
  const isWrong   = feedback.kind === 'wrong';

  // Visual variants
  const bg = isPenalty ? Colors.red : Colors.ink;
  const fg = isCorrect ? Colors.yellow : Colors.cream;

  return (
    <Animated.View style={[styles.wrap, animStyle]} pointerEvents="none">
      <View style={[styles.card, { backgroundColor: bg }]}>
        {isWrong ? (
          <>
            <Text style={styles.wrongLabel}>ANSWER</Text>
            <Text style={[styles.wrongText, { color: fg }]}>{feedback.text}</Text>
          </>
        ) : (
          <Text
            style={[
              styles.mainText,
              { color: fg, fontSize: isCorrect ? 32 : 20 },
            ]}
          >
            {feedback.text}
          </Text>
        )}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    zIndex: 60,
  },
  card: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    borderWidth: 3,
    borderColor: Colors.ink,
    boxShadow: `4px 4px 0 ${Colors.ink}`,
    alignItems: 'center',
    minWidth: 100,
  },
  mainText: {
    fontFamily: Fonts.black,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  wrongLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: '#9ca3af',
    letterSpacing: 1.5,
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  wrongText: {
    fontFamily: Fonts.black,
    fontSize: 22,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});
