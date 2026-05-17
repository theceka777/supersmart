// components/round/HalftoneOverlay.tsx
// The repeating ink-dot grid that lives on top of the sunburst. Opacity
// scales with streak tier (0.10 base + 0.04 per tier), and at tier ≥ 1 the
// opacity pulses 0.10 ↔ 0.20 with a tier-driven period (1.4s → 0.6s).
//
// Implementation note: rather than tiling backgroundImage like the design
// does in CSS (`radial-gradient` repeating background), we draw the dots
// once into an SVG sized to the full stage. SVG is faster on RN than the
// alternative (a View of N×M small Views), and matches the existing
// `components/Halftone.tsx`'s approach.

import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  cancelAnimation,
} from 'react-native-reanimated';
import Svg, { Circle } from 'react-native-svg';

import type { StreakTierLevel } from './constants';
import { StreakTier } from '@/constants/theme';

interface Props {
  tier: StreakTierLevel;
  width: number;
  height: number;
}

const DOT_SPACING = 10;     // px between dot centers — matches design's `backgroundSize: 10px 10px`
const DOT_RADIUS = 1.2;     // px — matches the design's `1.2px` dot radius
const DOT_COLOR = '#1A1522';

export function HalftoneOverlay({ tier, width, height }: Props) {
  // Base opacity scales linearly with tier.
  const baseOpacity = StreakTier.halftoneBaseOpacity + tier * StreakTier.halftonePerTier;
  // Peak opacity for the pulse — design oscillates between 0.10 and 0.20.
  const peakOpacity = baseOpacity * 2;

  const opacity = useSharedValue(baseOpacity);

  useEffect(() => {
    cancelAnimation(opacity);
    if (tier === 0) {
      opacity.value = withTiming(baseOpacity, { duration: 600 });
    } else {
      const halfMs = ((1.4 - tier * 0.2) * 1000) / 2;
      opacity.value = withRepeat(
        withSequence(
          withTiming(peakOpacity, { duration: halfMs, easing: Easing.inOut(Easing.ease) }),
          withTiming(baseOpacity, { duration: halfMs, easing: Easing.inOut(Easing.ease) }),
        ),
        -1,
        false,
      );
    }
    return () => cancelAnimation(opacity);
  }, [tier, baseOpacity, peakOpacity, opacity]);

  // Pre-build the dot list once per dimension change.
  const dots = useMemo(() => {
    const cols = Math.ceil(width / DOT_SPACING) + 1;
    const rows = Math.ceil(height / DOT_SPACING) + 1;
    const out: { cx: number; cy: number; key: string }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        out.push({
          cx: c * DOT_SPACING + DOT_SPACING / 2,
          cy: r * DOT_SPACING + DOT_SPACING / 2,
          key: `${r}-${c}`,
        });
      }
    }
    return out;
  }, [width, height]);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, animStyle]}>
      <Svg width={width} height={height}>
        {dots.map((d) => (
          <Circle key={d.key} cx={d.cx} cy={d.cy} r={DOT_RADIUS} fill={DOT_COLOR} />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});
