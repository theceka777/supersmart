// VsDecor.tsx — animated VS⚡ badge for the Quickmatch card
// Scale-punches every 5s with a spring-back. Idles with a subtle breathe.
// Ported from VsDecor in home.jsx (web design).

import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Text as SvgText } from 'react-native-svg';
import { Colors } from '@/constants/theme';

export function VsDecor({ fg = Colors.cream, ink = Colors.ink, accent = Colors.red }) {
  const scale = useSharedValue(1);

  React.useEffect(() => {
    // Every 5 seconds: quick inflate to 1.35 then spring back, then wait
    scale.value = withRepeat(
      withSequence(
        // wait ~4 seconds at rest
        withTiming(1, { duration: 4000, easing: Easing.linear }),
        // punch up
        withTiming(1.35, { duration: 140, easing: Easing.out(Easing.quad) }),
        // spring back
        withSpring(1, { mass: 0.4, damping: 10, stiffness: 300 }),
      ),
      -1,
      false,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: '-6deg' }],
  }));

  return (
    <Animated.View style={animStyle}>
      <Svg width={72} height={52} viewBox="0 0 76 56">
        {/* drop shadow plate */}
        <Path
          d="M 8 8 L 64 4 L 72 30 L 62 50 L 6 46 Z"
          fill={ink}
          transform="translate(4 5)"
        />
        {/* main plate */}
        <Path
          d="M 8 8 L 64 4 L 72 30 L 62 50 L 6 46 Z"
          fill={fg}
          stroke={ink}
          strokeWidth={3.5}
          strokeLinejoin="round"
        />
        {/* highlight */}
        <Path
          d="M 12 10 L 60 7"
          stroke={fg}
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.5}
        />
        {/* corner studs */}
        <Circle cx={12} cy={12} r={2} fill={ink} />
        <Circle cx={60} cy={9} r={2} fill={ink} />
        <Circle cx={64} cy={44} r={2} fill={ink} />
        <Circle cx={12} cy={42} r={2} fill={ink} />
        {/* VS text */}
        <SvgText
          x={28}
          y={36}
          fontFamily="ArchivoBlack"
          fontSize={22}
          fontWeight="900"
          fill={ink}
          textAnchor="middle"
        >
          VS
        </SvgText>
        {/* lightning bolt */}
        <Path
          d="M 56 12 L 48 26 L 54 26 L 46 44 L 60 24 L 54 24 L 60 8 Z"
          fill={accent}
          stroke={ink}
          strokeWidth={2}
          strokeLinejoin="round"
        />
      </Svg>
    </Animated.View>
  );
}
