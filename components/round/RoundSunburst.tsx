// components/round/RoundSunburst.tsx
// Background sunburst that lives behind the playing screen. Rotates
// continuously at a tier-driven speed (60s per rotation at tier 0, down to
// ~8.5s at tier 4 / Unstoppable). Peachy wedges over the cream backdrop —
// the same visual language as the global Sunburst on home, just speed-aware.
//
// Rotation is rAF-driven (`useFrameCallback`) so a parent re-render that
// changes `speedSec` doesn't snap the angle back to zero — it just changes
// the rate from the current angle. Opacity tweens smoothly between values
// so streak threshold crossings don't pop.
//
// Faithful port of `ContinuousSunburst` from Claude Design `round-layouts.jsx`.

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

import { Colors } from '@/constants/theme';

interface Props {
  /** Seconds for a full 360° rotation. Lower = faster. */
  speedSec: number;
  /** Target opacity. Smoothly tweened on change. */
  opacity: number;
  /** Half the canvas size in px; default 700 (= 1400×1400 stage). */
  size?: number;
}

const RAYS = 24;
const HALF_SECTOR_RAD = (180 / RAYS) * (Math.PI / 180);

export function RoundSunburst({ speedSec, opacity, size = 700 }: Props) {
  const angle = useSharedValue(0);
  const speed = useSharedValue(speedSec);
  const fade = useSharedValue(opacity);

  // Smooth speed change — tween the rotation rate, not the angle.
  useEffect(() => {
    speed.value = withTiming(speedSec, { duration: 600, easing: Easing.out(Easing.ease) });
  }, [speedSec, speed]);

  // Smooth opacity change — 600ms tween matches the design's `transition`.
  useEffect(() => {
    fade.value = withTiming(opacity, { duration: 600, easing: Easing.out(Easing.ease) });
  }, [opacity, fade]);

  // Per-frame integrator. `useFrameCallback` runs on the UI thread; the
  // worklet body cannot read shared values via React renders, only via
  // their `.value` accessor — which is fine here.
  useFrameCallback((info) => {
    'worklet';
    // info.timeSincePreviousFrame is in milliseconds; null on first frame.
    const dtMs = info.timeSincePreviousFrame ?? 16.67;
    const degPerMs = 360 / (speed.value * 1000);
    angle.value = (angle.value + degPerMs * dtMs) % 360;
  });

  const animStyle = useAnimatedStyle(() => ({
    opacity: fade.value,
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  // Precompute the 12 wedge paths (every other of 24 rays, like the global
  // Sunburst). React doesn't need to recompute these on each render.
  const wedgePaths: string[] = [];
  for (let i = 0; i < RAYS; i++) {
    if (i % 2 !== 0) continue;
    const a1 = ((i * 360) / RAYS) * (Math.PI / 180) - HALF_SECTOR_RAD;
    const a2 = ((i * 360) / RAYS) * (Math.PI / 180) + HALF_SECTOR_RAD;
    const x1 = Math.cos(a1) * size;
    const y1 = Math.sin(a1) * size;
    const x2 = Math.cos(a2) * size;
    const y2 = Math.sin(a2) * size;
    wedgePaths.push(`M 0 0 L ${x1} ${y1} L ${x2} ${y2} Z`);
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.wrap,
        { width: size * 2, height: size * 2, marginTop: -size, marginLeft: -size },
        animStyle,
      ]}
    >
      <Svg
        width={size * 2}
        height={size * 2}
        viewBox={`-${size} -${size} ${size * 2} ${size * 2}`}
      >
        {wedgePaths.map((d, i) => (
          <Path key={i} d={d} fill={Colors.peach} />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    top: '50%',
    left: '50%',
  },
});
