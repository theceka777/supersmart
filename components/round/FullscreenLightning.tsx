// components/round/FullscreenLightning.tsx
// Center-of-screen lightning burst that fires on a sub-2-second correct
// answer. Five forks radiating from a 120×120 SVG, yellow stroke with a
// white-hot core, soft radial halo behind. ~720ms envelope (matches the
// `rFsLightning` and `rFsLightningVeil` keyframes in Claude Design).
//
// The original CSS used `filter: drop-shadow(0 0 4px ${yellow}) drop-shadow
// (0 0 10px ${yellow})` for the glow. RN doesn't support CSS filters
// natively, so the halo BehindBolt approximates that glow visually.
//
// Caller re-keys with `fireKey` per fire so back-to-back fast answers cleanly
// remount and re-animate.

import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Defs, RadialGradient, Stop, Rect, G, Path } from 'react-native-svg';

import { Colors } from '@/constants/theme';

interface Props {
  /** Increment to fire. Component renders nothing when `fireKey` is undefined. */
  fireKey?: number;
}

const FORKS = [
  'M 50 10 L 42 38 L 52 40 L 38 78',
  'M 50 14 L 60 40 L 50 42 L 64 80',
  'M 50 8  L 35 44 L 50 46 L 40 86',
  'M 50 12 L 66 36 L 56 40 L 70 72',
  'M 50 16 L 30 36 L 44 38 L 32 70',
];

export function FullscreenLightning({ fireKey }: Props) {
  const opacity = useSharedValue(0);
  const veil = useSharedValue(0);

  useEffect(() => {
    if (fireKey === undefined) return;
    opacity.value = 0;
    veil.value = 0;

    // rFsLightning — 720ms envelope:
    //   0%   → opacity 0
    //   8%   → opacity 1     (58ms)
    //   35%  → opacity 0.95  (194ms)
    //   65%  → opacity 0.4   (216ms)
    //   100% → opacity 0     (252ms)
    opacity.value = withSequence(
      withTiming(1.00, { duration: 58,  easing: Easing.out(Easing.ease) }),
      withTiming(0.95, { duration: 194, easing: Easing.inOut(Easing.ease) }),
      withTiming(0.40, { duration: 216, easing: Easing.in(Easing.ease) }),
      withTiming(0.00, { duration: 252, easing: Easing.in(Easing.ease) }),
    );

    // rFsLightningVeil — 320ms envelope:
    //   0%   → opacity 0
    //   15%  → opacity 1    (48ms)
    //   100% → opacity 0    (272ms)
    veil.value = withSequence(
      withTiming(1.00, { duration: 48,  easing: Easing.out(Easing.ease) }),
      withTiming(0.00, { duration: 272, easing: Easing.in(Easing.ease) }),
    );
  }, [fireKey, opacity, veil]);

  // Hooks must be called unconditionally on every render — the early-return
  // for `fireKey === undefined` lives AFTER all hook calls.
  const opacityStyle  = useAnimatedStyle(() => ({ opacity: opacity.value }));
  const veilStyle     = useAnimatedStyle(() => ({ opacity: veil.value }));

  if (fireKey === undefined) return null;

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.wrap, opacityStyle]}
    >
      {/* halo behind bolts */}
      <Animated.View
        pointerEvents="none"
        style={[styles.veil, veilStyle]}
      >
        <Svg width={120} height={120} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient
              id="lightningHalo"
              cx={50} cy={50} rx={50} ry={50} fx={50} fy={50}
              gradientUnits="userSpaceOnUse"
            >
              <Stop offset="0%"  stopColor={Colors.yellow} stopOpacity={0.8} />
              <Stop offset="35%" stopColor={Colors.yellow} stopOpacity={0.2} />
              <Stop offset="70%" stopColor={Colors.yellow} stopOpacity={0} />
            </RadialGradient>
          </Defs>
          <Rect x={0} y={0} width={100} height={100} fill="url(#lightningHalo)" />
        </Svg>
      </Animated.View>

      {/* the 5 bolts — outer yellow stroke + white-hot inner core */}
      <Svg width={120} height={120} viewBox="0 0 100 100" style={styles.bolts}>
        {FORKS.map((d, i) => (
          <G key={i} rotation={i * 18 - 36} origin="50, 50">
            <Path
              d={d}
              stroke={Colors.yellow}
              strokeWidth={3}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.95}
            />
            <Path
              d={d}
              stroke="#FFFFFF"
              strokeWidth={1.1}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </G>
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    width: 120,
    height: 120,
    marginLeft: -60,
    marginTop: -60,
    zIndex: 55,
  },
  veil: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
  bolts: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
  },
});
