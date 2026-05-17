// components/round/AnswerButton.tsx
// 3D chunky answer button with state-driven faces:
//   • null    → idle cream face, ink text, pressable; press translates face
//                down to its shadow position (built-in tap feedback)
//   • correct → green face, cream text, locked down at depth
//   • wrong   → red face, cream text, big X SVG behind text (text hidden),
//                locked down at depth
//   • dim     → washed cream face, gray text + border + shadow (the unpicked
//                options after a wrong answer)
//
// Hype level (the streak tier 0..4) thickens the border by up to +2px. Optional
// `lightning` prop overlays the small per-button lightning bolt SVG on a fast
// correct answer.
//
// Faithful port of `AnswerButton` from Claude Design `round-layouts.jsx`.

import React, { useEffect } from 'react';
import { Pressable, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Line, Path } from 'react-native-svg';

import { Colors, Fonts, CARD_DEPTH } from '@/constants/theme';
import type { StreakTierLevel } from './constants';

export type AnswerButtonState = null | 'correct' | 'wrong' | 'dim';

interface Props {
  label: string;
  state: AnswerButtonState;
  hypeLevel?: StreakTierLevel;
  /** Adds extra depth px when hype tier is high — caller passes 0..2 typically. */
  depthBoost?: number;
  /** If true, renders the per-button lightning bolt overlay (sub-2s correct). */
  lightning?: boolean;
  /** Fired only when state === null (idle pressable). */
  onPress?: () => void;
}

const BUTTON_HEIGHT = 64;

export function AnswerButton({
  label,
  state,
  hypeLevel = 0,
  depthBoost = 0,
  lightning = false,
  onPress,
}: Props) {
  const isIdle = state === null;
  const isCorrect = state === 'correct';
  const isWrong = state === 'wrong';
  const isDim = state === 'dim';
  const depth = CARD_DEPTH + depthBoost;
  const borderW = 3 + Math.min(2, hypeLevel);

  // Face color
  const face = isCorrect ? Colors.green
             : isWrong   ? Colors.red
             : isDim     ? '#E5E0D8'                    // washed cream
             : Colors.cream;
  const fg = (isCorrect || isWrong) ? Colors.cream
           : isDim                  ? '#7A7268'         // muted ink
           : Colors.ink;
  const stroke = isDim ? '#9C9388' : Colors.ink;
  const shadowColor = isDim ? '#9C9388' : Colors.ink;

  // Face translation — held at `depth` after locked correct/wrong, animates
  // back to 0 otherwise. Press-in/out via Pressable's onPressIn/Out toggles
  // this when the button is still idle, giving a small chunky press feel.
  const ty = useSharedValue(0);
  useEffect(() => {
    const target = (isCorrect || isWrong) ? depth : 0;
    ty.value = withTiming(target, { duration: 80, easing: Easing.bezier(0.2, 0.85, 0.25, 1) });
  }, [isCorrect, isWrong, depth, ty]);

  const animFaceStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: ty.value }],
  }));

  return (
    <Pressable
      onPress={isIdle ? onPress : undefined}
      onPressIn={isIdle ? () => { ty.value = withTiming(depth, { duration: 60 }); } : undefined}
      onPressOut={isIdle ? () => { ty.value = withTiming(0,     { duration: 80 }); } : undefined}
      style={styles.container}
    >
      {/* depth shadow */}
      <View
        style={[
          styles.shadow,
          { backgroundColor: shadowColor, top: depth, bottom: -depth },
        ]}
      />
      {/* face */}
      <Animated.View
        style={[
          styles.face,
          {
            backgroundColor: face,
            borderColor: stroke,
            borderWidth: borderW,
          },
          animFaceStyle,
        ]}
      >
        {isWrong && (
          <Svg width={80} height={80} viewBox="0 0 80 80" style={styles.xMark}>
            <Line x1={20} y1={20} x2={60} y2={60} stroke={Colors.cream} strokeWidth={9} strokeLinecap="round" />
            <Line x1={60} y1={20} x2={20} y2={60} stroke={Colors.cream} strokeWidth={9} strokeLinecap="round" />
          </Svg>
        )}
        <Text
          style={[
            styles.label,
            { color: fg, opacity: isWrong ? 0 : 1 },
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.75}
        >
          {label}
        </Text>
        {lightning && <ButtonLightning />}
      </Animated.View>
    </Pressable>
  );
}

// ─── Per-button lightning ────────────────────────────────────────────────────
// Small SVG with three jagged bolts in yellow. Fades + scales out over 480ms.
function ButtonLightning() {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(0.6);

  useEffect(() => {
    scale.value = withTiming(1.4, { duration: 480, easing: Easing.out(Easing.ease) });
    opacity.value = withTiming(0, { duration: 480, easing: Easing.in(Easing.ease) });
  }, [opacity, scale]);

  const anim = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const BOLT_PATHS = [
    'M 50 10 L 42 28 L 50 28 L 38 50',
    'M 50 8  L 60 26 L 52 26 L 64 48',
    'M 50 12 L 50 30 L 46 30 L 50 50',
  ];
  return (
    <Animated.View pointerEvents="none" style={[styles.boltWrap, anim]}>
      <Svg width="100%" height="100%" viewBox="0 0 100 60" preserveAspectRatio="none">
        {BOLT_PATHS.map((d, i) => (
          <Path
            key={i}
            d={d}
            stroke={Colors.yellow}
            strokeWidth={3}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    height: BUTTON_HEIGHT,
  },
  shadow: {
    position: 'absolute',
    left: 0, right: 0,
    height: BUTTON_HEIGHT,
    borderRadius: 14,
  },
  face: {
    position: 'absolute',
    left: 0, right: 0, top: 0,
    height: BUTTON_HEIGHT,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  label: {
    fontFamily: Fonts.black,
    fontSize: 22,
    letterSpacing: -0.3,
    textTransform: 'uppercase',
  },
  xMark: {
    position: 'absolute',
  },
  boltWrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});
