// components/round/QuestionCard.tsx
// The question hero card. Big bordered card with a hard shadow, fills with
// the variant's card color (cream / pink / cyan). Each time the question
// index changes the card fades in + scales up subtly (280ms ease-out),
// matching the `rQuestion` keyframe in Claude Design.

import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Colors, Fonts } from '@/constants/theme';

export type QuestionCardVariant = 'cream' | 'pink' | 'cyan';

interface Props {
  /** Question prompt — keep ≤ 40 chars per the corpus discipline. */
  question: string;
  /** 1-based index displayed as `Q{qIdx + 1}` in the top-left of the card. */
  qIdx: number;
  /** Card fill variant. Pink for Quickmatch; cyan for Daily Race; cream default. */
  variant?: QuestionCardVariant;
}

export function QuestionCard({ question, qIdx, variant = 'cream' }: Props) {
  // Mount + per-question entry animation. `withTiming` from 0 -> 1 over 280ms.
  // Re-keyed by caller (parent passes a different `key` per question), so this
  // effect fires on every new question.
  const enter = useSharedValue(0);

  useEffect(() => {
    enter.value = 0;
    enter.value = withTiming(1, { duration: 280, easing: Easing.out(Easing.ease) });
  }, [qIdx, enter]);

  const animStyle = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [
      { translateY: (1 - enter.value) * 8 },
      { scale: 0.96 + enter.value * 0.04 },
    ],
  }));

  const isPink = variant === 'pink';
  const isCyan = variant === 'cyan';
  const bg = isPink ? Colors.pink : isCyan ? Colors.dailyrace.bg : Colors.cream;
  // On pink (high-contrast saturated fill) the body text + label flip to cream.
  // Cyan and cream both keep ink text for readability.
  const fg = isPink ? Colors.cream : Colors.ink;
  const labelOpacity = isPink ? 0.85 : 0.45;

  return (
    <Animated.View style={[styles.card, { backgroundColor: bg }, animStyle]}>
      <Text style={[styles.qLabel, { color: fg, opacity: labelOpacity }]}>
        Q{qIdx + 1}
      </Text>
      <Text style={[styles.qText, { color: fg }]}>{question}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 3,
    borderColor: Colors.ink,
    borderRadius: 16,
    paddingTop: 20,
    paddingHorizontal: 22,
    paddingBottom: 22,
    alignItems: 'center',
    boxShadow: `5px 5px 0 ${Colors.ink}`,
  },
  qLabel: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  qText: {
    fontFamily: Fonts.black,
    fontSize: 30,
    lineHeight: 33, // ~1.1 of 30
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
