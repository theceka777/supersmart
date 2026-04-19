// DailyDecor.tsx — animated target/calendar icon for the Daily Race card.
// Lock-on ring contracts every 5s then bullseye flashes red.
// Ported from DailyDecor in home.jsx (web design).

import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedProps,
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

export function DailyDecor({ fg = Colors.cream, ink = Colors.ink, accent = Colors.red }) {
  const ringScale = useSharedValue(1);
  const hitOpacity = useSharedValue(0);
  const hitFill = useSharedValue(0); // 0 = bg, 1 = accent

  useEffect(() => {
    // Every 5s: ring contracts from 1.4→1.0, then bullseye flashes
    const runCycle = () => {
      // ring contracts
      ringScale.value = withRepeat(
        withSequence(
          withTiming(1.4, { duration: 100 }),
          withTiming(1.0, { duration: 600, easing: Easing.out(Easing.cubic) }),
          withTiming(1.0, { duration: 4300 }),
        ),
        -1,
        false,
      );
      // bullseye flash 700ms into the cycle
      hitOpacity.value = withRepeat(
        withSequence(
          withTiming(0, { duration: 700 }),
          withTiming(1, { duration: 80 }),
          withTiming(0, { duration: 400 }),
          withTiming(0, { duration: 3820 }),
        ),
        -1,
        false,
      );
    };
    runCycle();
  }, []);

  const ringProps = useAnimatedProps(() => ({
    r: 11 * ringScale.value,
    opacity: 0.9,
  }));

  const flashProps = useAnimatedProps(() => ({
    opacity: hitOpacity.value,
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
        {/* lock-on ring — animated */}
        <AnimatedCircle cx={29} cy={38} fill="none" stroke={ink} strokeWidth={3} animatedProps={ringProps} />
        {/* bullseye base */}
        <Circle cx={29} cy={38} r={5} fill={fg} stroke={ink} strokeWidth={2.5} />
        {/* bullseye flash */}
        <AnimatedCircle cx={29} cy={38} r={5} fill={accent} animatedProps={flashProps} />
        {/* crosshair ticks */}
        <Path d="M 29 22 L 29 25" stroke={ink} strokeWidth={2.5} />
        <Path d="M 29 51 L 29 54" stroke={ink} strokeWidth={2.5} />
        <Path d="M 12 38 L 15 38" stroke={ink} strokeWidth={2.5} />
        <Path d="M 43 38 L 46 38" stroke={ink} strokeWidth={2.5} />
      </Svg>
    </View>
  );
}
