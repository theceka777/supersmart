// components/round/EdgeGlow.tsx
// One-shot 600ms radial flash that fires on every correct or wrong answer.
// The "edge" effect comes from a radial gradient (transparent center,
// colored at the edges) — same shape as `OutsideInPulse` but single-shot
// and scaled by the streak tier:
//
//   tier 0..4 → inner-stop %  → outer alpha
//        0   → 80%            → 0.20      (deliberately subtle baseline)
//        1   → 65%            → 0.38
//        2   → 50%            → 0.56
//        3   → 35%            → 0.75
//        4   → 22%            → 0.93      (Unstoppable — anchor of the curve)
//
// Curve tuned 2026-05-16 device pass: keep the tier-4 ceiling, drop the
// tier-0 baseline meaningfully, scale evenly between. The "powerup makes
// the green more intense" feel becomes obvious instead of subtle.
//
// Layering: the glow sits BEHIND the question card + answer buttons (no
// explicit zIndex, renders as ambient background atmosphere). Without the
// CSS blur RN can't reproduce, putting the glow above the content read as
// "green tint on top of the buttons" rather than "edges of the screen
// glow green" — moving it behind fixes that.
//
// The original CSS used `filter: blur(8px)`. RN doesn't have a generic CSS
// filter, so we drop the blur — the radial gradient already softens the
// edge sufficiently for the design intent. Visible delta is small at the
// design's alpha values.
//
// Faithful port of the edge-glow render block from `RoundLayoutA`.

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

import { Colors } from '@/constants/theme';
import type { StreakTierLevel } from './constants';

export type EdgeGlowKind = 'correct' | 'wrong';

interface Props {
  /** Pass `null` to render nothing. Set to `correct` / `wrong` + bump `fireKey` to flash. */
  kind: EdgeGlowKind | null;
  tier: StreakTierLevel;
  fireKey: number;
  width: number;
  height: number;
}

// Inner-stop percentage (where the transparent core ends) per tier
const INNER_STOPS = [0.80, 0.65, 0.50, 0.35, 0.22] as const;
// Outer alpha 0..1 at the gradient's outer edge — linear ramp from 0.20 to 0.93
const OUTER_ALPHAS = [0.20, 0.38, 0.56, 0.75, 0.93] as const;

export function EdgeGlow({ kind, tier, fireKey, width, height }: Props) {
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!kind) return;
    opacity.value = 0;
    // 600ms envelope: 0 → 0.95 (150ms) → 0 (450ms)
    opacity.value = withSequence(
      withTiming(1.00, { duration: 150, easing: Easing.out(Easing.ease) }),
      withTiming(0.00, { duration: 450, easing: Easing.in(Easing.ease) }),
    );
  }, [fireKey, kind, opacity]);

  // Hooks must be called unconditionally — early-return AFTER hooks below.
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  if (!kind) return null;

  const color = kind === 'correct' ? Colors.green : Colors.red;
  const innerStop = `${INNER_STOPS[tier] * 100}%`;
  const outerAlpha = OUTER_ALPHAS[tier];

  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, animStyle]}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <RadialGradient
            id={`edgeGlow-${kind}`}
            cx={width / 2}
            cy={height / 2}
            rx={width / 2}
            ry={height / 2}
            fx={width / 2}
            fy={height / 2}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset={innerStop} stopColor={color} stopOpacity={0} />
            <Stop offset="100%" stopColor={color} stopOpacity={outerAlpha} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={width} height={height} fill={`url(#edgeGlow-${kind})`} />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    // No zIndex — renders behind any positioned content above (VS strip at 30,
    // question card + buttons at 20, etc.). The glow reads as ambient stage
    // light, not as a tinted overlay on top of the UI.
  },
});
