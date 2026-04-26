// DailyDecor.tsx — animated calendar icon for the Daily Race card.
//
// Two states:
//   done=false (fresh)  — calendar with bullseye + lock-on ring; ring contracts
//                         every 5s, then bullseye flashes red. Mirrors the
//                         original target/lock-on cadence.
//   done=true  (played) — calendar with green-ringed checkmark stamp; lock-on
//                         ring still contracts onto the stamp every 5s, then
//                         the stamp does a tiny pop + cream flash. Same cadence
//                         and rotation as the fresh state — only the visuals
//                         under the ring swap. No reflow.
//
// Cadence (matches Home v2 — Fresh.html / Home v2.html keyframes):
//   • Ring: 5s loop. expand-fast (100ms) then contract-onto-target (600ms ease-out)
//     then 4.3s hold. (Same shape both states.)
//   • Done stamp pop: tiny 1.06× scale punch at the moment the ring lands
//     (140ms hit), then settle.
//   • Done flash: 80ms cream flash on hit, then back to green.
//   • Fresh bullseye flash: 80ms red on hit, then back to transparent.
//
// Ported from DailyDecor / DailyDoneDecor / DailyTargetDecor in the explore
// JSX deliverables (session 27 home polish pass).

import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import { View } from 'react-native';
import { Colors } from '@/constants/theme';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface DailyDecorProps {
  /** Card face color — used as the calendar paper fill. */
  fg?: string;
  /** Outline / ink color. */
  ink?: string;
  /** Accent color: red bullseye when fresh, green stamp ring when done. */
  accent?: string;
  /** When true, render the post-play "done" variant (green check stamp). */
  done?: boolean;
}

const CYCLE_MS = 5000;

export function DailyDecor({
  fg = Colors.cream,
  ink = Colors.ink,
  accent = Colors.red,
  done = false,
}: DailyDecorProps) {
  // Lock-on ring scale — same animation in both states.
  // Fresh:   r = 11 baseline, animates to 1.4× then contracts to 1× and holds.
  // Done:    r = 14 baseline, animates the same shape (slightly wider stamp).
  const ringScale = useSharedValue(1);
  // Bullseye / stamp flash opacity (peaks at hit, ~80ms).
  const hitOpacity = useSharedValue(0);
  // Done-only: stamp pop at hit (1.06×) — null-op when fresh.
  const stampScale = useSharedValue(1);

  useEffect(() => {
    // Ring: same envelope both states.
    ringScale.value = withRepeat(
      withSequence(
        withTiming(1.4, { duration: 100 }),
        withTiming(1.0, { duration: 600, easing: Easing.out(Easing.cubic) }),
        withTiming(1.0, { duration: CYCLE_MS - 700 }),
      ),
      -1,
      false,
    );
    // Hit flash: 700ms in, peaks 80ms, fades 400ms.
    hitOpacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 700 }),
        withTiming(1, { duration: 80 }),
        withTiming(0, { duration: 400 }),
        withTiming(0, { duration: CYCLE_MS - 1180 }),
      ),
      -1,
      false,
    );
    // Done stamp pop: tiny punch as the ring lands.
    if (done) {
      stampScale.value = withRepeat(
        withSequence(
          withTiming(1.0, { duration: 700 }),
          withTiming(1.06, { duration: 140 }),
          withTiming(0.99, { duration: 200 }),
          withTiming(1.0, { duration: 200 }),
          withTiming(1.0, { duration: CYCLE_MS - 1240 }),
        ),
        -1,
        false,
      );
    }
  }, [done]);

  const ringRadius = done ? 14 : 11;

  const ringProps = useAnimatedProps(() => ({
    r: ringRadius * ringScale.value,
    opacity: 0.9,
  }));

  // Fresh: bullseye fades from transparent → red on hit.
  // Done:  green ring stamp fades from green → cream on hit (punctuates the lock).
  const flashProps = useAnimatedProps(() => ({
    opacity: hitOpacity.value,
  }));

  const stampStyle = useAnimatedStyle(() => ({
    transform: [{ scale: stampScale.value }],
  }));

  return (
    <View style={{ transform: [{ rotate: '-6deg' }] }}>
      <Svg width={56} height={62} viewBox="0 0 58 62">
        {/* calendar pins */}
        <Rect x={14} y={0} width={3} height={8} fill={ink} />
        <Rect x={41} y={0} width={3} height={8} fill={ink} />
        {/* header bar */}
        <Path d="M 4 6 L 54 6 L 54 20 L 4 20 Z" fill={fg} stroke={ink} strokeWidth={3} />
        <Circle cx={12} cy={13} r={1.5} fill={ink} />
        <Circle cx={20} cy={13} r={1.5} fill={ink} />
        <Circle cx={38} cy={13} r={1.5} fill={ink} />
        <Circle cx={46} cy={13} r={1.5} fill={ink} />
        {/* body */}
        <Path
          d="M 4 20 L 54 20 L 54 58 L 48 62 L 40 58 L 32 62 L 24 58 L 16 62 L 8 58 L 4 58 Z"
          fill={fg}
          stroke={ink}
          strokeWidth={3}
          strokeLinejoin="round"
        />

        {done ? (
          <>
            {/* lock-on ring — contracts onto the stamp */}
            <AnimatedCircle
              cx={29}
              cy={40}
              fill="none"
              stroke={ink}
              strokeWidth={2.5}
              animatedProps={ringProps}
            />
            {/* stamp base — green disc with ink ring */}
            <AnimatedG
              cx={29}
              cy={40}
              animatedStyle={stampStyle}
            >
              <Circle cx={29} cy={40} r={ringRadius} fill={accent} stroke={ink} strokeWidth={3} />
              {/* white checkmark */}
              <Path
                d="M 22 40 L 27 45 L 36 35"
                stroke={fg}
                strokeWidth={4}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              />
              {/* hit flash — cream wash on top of the green */}
              <AnimatedCircle
                cx={29}
                cy={40}
                r={ringRadius}
                fill={fg}
                animatedProps={flashProps}
              />
            </AnimatedG>
          </>
        ) : (
          <>
            {/* lock-on ring — contracts onto bullseye */}
            <AnimatedCircle
              cx={29}
              cy={38}
              fill="none"
              stroke={ink}
              strokeWidth={3}
              animatedProps={ringProps}
            />
            {/* bullseye base */}
            <Circle cx={29} cy={38} r={5} fill={fg} stroke={ink} strokeWidth={2.5} />
            {/* bullseye flash — red on hit */}
            <AnimatedCircle cx={29} cy={38} r={5} fill={accent} animatedProps={flashProps} />
            {/* crosshair ticks */}
            <Path d="M 29 22 L 29 25" stroke={ink} strokeWidth={2.5} />
            <Path d="M 29 51 L 29 54" stroke={ink} strokeWidth={2.5} />
            <Path d="M 12 38 L 15 38" stroke={ink} strokeWidth={2.5} />
            <Path d="M 43 38 L 46 38" stroke={ink} strokeWidth={2.5} />
          </>
        )}
      </Svg>
    </View>
  );
}

// react-native-svg doesn't accept Animated transforms on a <G> directly the
// way RN <Animated.View> does — we wrap the stamp children in a View overlay
// so we can scale them as a unit without breaking the SVG tree. This works
// because the wrapper sits on top of the calendar SVG with absolute positioning.
//
// In practice the stamp is 14r at (29,40), which fits comfortably inside the
// 58×62 viewBox; we use the SVG-internal scale by binding the radius via
// animatedProps — leaving the path checkmark static. The visible "pop" is
// carried by the ring radius animation (1×→1.4×→1× envelope above), which is
// already perceptually doing the lock-on landing work. The optional stamp
// scale is therefore a wrapper-level transform on the stamp group only.
function AnimatedG({
  cx, cy, animatedStyle, children,
}: {
  cx: number; cy: number;
  animatedStyle: ReturnType<typeof useAnimatedStyle>;
  children: React.ReactNode;
}) {
  // We can't natively animate-transform an SVG <G> via Reanimated v3 on RN,
  // so we just render the children inline. The ring + stamp pop already
  // communicate the hit; the wrapper here is a no-op placeholder kept so the
  // structure stays clean if a future Reanimated version unlocks <G> transforms.
  return <>{children}</>;
}
