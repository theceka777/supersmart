// components/round/TimerPill.tsx
// Colored timer pill — pink for Quickmatch, cyan for Daily Race.
// Pulses red + scales 1.06 when timeLeft <= 5s (low-time tension).
// Faithful port of the Layout A timer pill in Claude Design `round-layouts.jsx`.

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle, Line } from 'react-native-svg';

import { Colors, Fonts } from '@/constants/theme';
import { LOW_TIME_SEC } from './constants';

interface Props {
  /** Seconds remaining in the round; pill displays `Math.ceil(timeLeft)`. */
  timeLeft: number;
  /** Base pill color when not in low-time state. Pink for Quickmatch, cyan for Daily Race. */
  color: string;
}

export function TimerPill({ timeLeft, color }: Props) {
  const lowTime = timeLeft <= LOW_TIME_SEC;
  const scale = useSharedValue(1);

  // Pulse loop only kicks in once we cross the low-time threshold.
  useEffect(() => {
    if (lowTime) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.00, { duration: 300, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    } else {
      cancelAnimation(scale);
      scale.value = withTiming(1, { duration: 200 });
    }
    return () => cancelAnimation(scale);
  }, [lowTime, scale]);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bg = lowTime ? Colors.red : color;

  return (
    <Animated.View style={[styles.pill, { backgroundColor: bg }, animStyle]}>
      <Svg width={14} height={14} viewBox="0 0 14 14">
        <Circle cx={7} cy={7} r={5.5} fill="none" stroke={Colors.cream} strokeWidth={1.5} />
        <Line x1={7} y1={7} x2={7} y2={3} stroke={Colors.cream} strokeWidth={1.5} strokeLinecap="round" />
        <Line x1={7} y1={7} x2={10} y2={7} stroke={Colors.cream} strokeWidth={1.5} strokeLinecap="round" />
      </Svg>
      <Text style={styles.text}>{Math.ceil(timeLeft)}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 999,
    borderWidth: 2.5,
    borderColor: Colors.ink,
    // RN 0.81 supports boxShadow on Views — pure offset, no blur.
    boxShadow: `0 3px 0 ${Colors.ink}`,
  },
  text: {
    fontFamily: Fonts.black,
    fontSize: 20,
    color: Colors.cream,
    // Tabular numerals so the pill doesn't jitter as digits change width.
    fontVariant: ['tabular-nums'],
  },
});
