// components/round/OutsideInPulse.tsx
// Vignette-style radial pulse — transparent center, tier-colored ring at the
// edges, scales 0.85 ↔ 1.15 and opacity 0.35 ↔ 0.85 in a continuous loop.
// Speed varies by tier: slower + softer at tier 1, faster + harder at tier 4.
// Tier 0 = nothing rendered.
//
// The original CSS used `mix-blend-mode: multiply` so the pulse darkens
// the underlying sunburst rather than just overlaying. RN 0.76+ added the
// `mixBlendMode` style prop on Views (new architecture only), and we're on
// 0.81.5 with new arch enabled — so we use the same blend the design called
// for. If it ever doesn't render on a target device, the pulse will read
// as a saturated overlay (the prop is ignored on platforms that don't
// support it, so no crash — just visual fallback).
//
// Faithful port of `OutsideInPulse` from Claude Design `round-layouts.jsx`.

import React, { useEffect, useMemo } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';

import { StreakTier, Colors } from '@/constants/theme';
import type { StreakTierLevel } from './constants';

interface Props {
  tier: StreakTierLevel;
  /** Stage dimensions — pulse oversizes to inset:-15% so it overhangs edges. */
  width: number;
  height: number;
}

// Pulse period (seconds) per tier — device-tuned 2026-05-16 against the
// design's original `[0, 1.6, 1.1, 0.7, 0.45]`. The continuous sine-wave
// loop changes the perception of speed (no peak landings), so CD re-paced
// the ladder against the new motion. Final values: even ~0.2s decrement
// per tier — predictable escalation, no jarring jumps.
const TIER_SPEED_SEC: readonly [number, number, number, number, number] =
  [0, 1.4, 1.1, 0.9, 0.7];

export function OutsideInPulse({ tier, width, height }: Props) {
  // All hooks must be called on every render — the `tier === 0` early return
  // lives AFTER every hook below.
  const pulseColor = StreakTier.colors[Math.max(1, tier) as 1 | 2 | 3 | 4] ?? Colors.ink;
  const periodSec = TIER_SPEED_SEC[Math.max(1, tier) as 1 | 2 | 3 | 4];

  // Opacity range — 45% of the design baseline (2026-05-16 device tune).
  // Original was 0.35 ↔ 0.85; now 0.1575 ↔ 0.3825. With the multiply blend
  // doing its job, the pulse only needs ~45% of the original alpha to read
  // as a hot zone — anything more overwhelms the cream stage at higher
  // saturation tiers (pink, red).
  const OPACITY_MIN = 0.1575;
  const OPACITY_MAX = 0.3825;
  const SCALE_MIN = 0.85;
  const SCALE_MAX = 1.15;

  // Continuous sine-wave loop. Driven by `useFrameCallback` (rAF on UI
  // thread) rather than `withSequence + withRepeat`, because the sequence
  // pattern decelerates AT the peak — the motion lands each cycle, which
  // reads on device as "the pulse hits hard each beat" (especially at
  // higher tiers where the cycle is fast). A sine wave never lands; it
  // crosses through both extrema with constant angular velocity, so the
  // pulse phases continuously without a perceptible cycle boundary.
  const phase = useSharedValue(0);
  const speedHz = useSharedValue(0);  // cycles per second; 0 disables the wave

  // Speed change tweens smoothly so streak-tier transitions don't snap.
  useEffect(() => {
    speedHz.value = withTiming(tier === 0 ? 0 : 1 / periodSec, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
  }, [tier, periodSec, speedHz]);

  useFrameCallback((info) => {
    'worklet';
    if (speedHz.value === 0) return;
    const dtSec = (info.timeSincePreviousFrame ?? 16.67) / 1000;
    phase.value = (phase.value + speedHz.value * dtSec * 2 * Math.PI) % (2 * Math.PI);
  });

  // Oversize the gradient bed by 30% so the ring overhangs equally on every
  // side at scale 1.15 (matches `inset: '-15%'` in the design).
  const W = useMemo(() => Math.ceil(width * 1.30), [width]);
  const H = useMemo(() => Math.ceil(height * 1.30), [height]);
  const offX = -(W - width) / 2;
  const offY = -(H - height) / 2;

  const animStyle = useAnimatedStyle(() => {
    'worklet';
    // wave goes 0..1..0..1 smoothly via sine; 0.5 + 0.5 * sin(phase) is the
    // standard sine-to-unit-interval transform.
    const wave = 0.5 + 0.5 * Math.sin(phase.value);
    return {
      opacity: OPACITY_MIN + (OPACITY_MAX - OPACITY_MIN) * wave,
      transform: [{ scale: SCALE_MIN + (SCALE_MAX - SCALE_MIN) * wave }],
    };
  });

  // Hook calls done — safe to early-return now.
  if (tier === 0) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { width: W, height: H, top: offY, left: offX },
        animStyle,
      ]}
    >
      <Svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <Defs>
          {/* Stops re-tuned again 2026-05-16: the 35%→55% (20% wide) linear
              transition produced a visible elliptical "ring of fastest
              change" where the alpha derivative was steepest. Widening the
              transition to 30% (35%→65%) cuts the per-pixel alpha rate in
              half, softening the boundary so the ellipse stops reading as
              a defined shape. 65% as the outer anchor still keeps the
              colored band visible at the screen edges at peak wave scale
              (1.15×, where the edge sits at gradient offset ~67%). */}
          <RadialGradient
            id="pulse"
            cx={W / 2}
            cy={H / 2}
            rx={W / 2}
            ry={H / 2}
            fx={W / 2}
            fy={H / 2}
            gradientUnits="userSpaceOnUse"
          >
            <Stop offset="35%" stopColor={pulseColor} stopOpacity={0} />
            <Stop offset="65%" stopColor={pulseColor} stopOpacity={1} />
          </RadialGradient>
        </Defs>
        <Rect x={0} y={0} width={W} height={H} fill="url(#pulse)" />
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    // Darken the underlying stage instead of overlaying. This is what makes
    // the high-tier (pink / red) pulse read as "the screen is glowing hot"
    // rather than "a pink filter is on top of everything."
    mixBlendMode: 'multiply',
  },
});
