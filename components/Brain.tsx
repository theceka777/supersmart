// Brain.tsx — Super Smart 2026 mascot
// Ported from brain.jsx (web design) to React Native + react-native-svg + Reanimated
//
// Requires: npx expo install react-native-svg

import React, { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  useAnimatedStyle,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Ellipse, Circle, G } from 'react-native-svg';

export type BrainExpression = 'neutral' | 'hype' | 'smirk';

interface BrainProps {
  size?: number;
  color?: string;
  shadowColor?: string;
  expression?: BrainExpression;
  wiggle?: boolean;
}

export function Brain({
  size = 100,
  color = '#FF3D7F',
  shadowColor = '#B01A4F',
  expression = 'neutral',
  wiggle = true,
}: BrainProps) {
  const [blinking, setBlinking] = useState(false);
  const rotation = useSharedValue(0);

  // Gentle side-to-side wiggle
  useEffect(() => {
    if (wiggle) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-1.5, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(2,    { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true
      );
    }
  }, [wiggle]);

  // Blink every 3–5 seconds
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const blink = () => {
      setBlinking(true);
      setTimeout(() => setBlinking(false), 130);
      timeout = setTimeout(blink, 2800 + Math.random() * 2500);
    };
    timeout = setTimeout(blink, 1500 + Math.random() * 1000);
    return () => clearTimeout(timeout);
  }, []);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
    transformOrigin: 'center bottom',
  }));

  const w = size;
  const h = size * 1.05;

  return (
    <Animated.View style={[{ width: w, height: h }, animStyle]}>
      <Svg viewBox="0 0 200 210" width={w} height={h} overflow="visible">

        {/* soft drop shadow */}
        <Ellipse cx="100" cy="200" rx="58" ry="6" fill="rgba(0,0,0,0.18)" />

        {/* lightning bolt antenna */}
        <G transform="translate(104 8)">
          <Path d="M 0 22 L 3 10" stroke="#1A1522" strokeWidth="4" strokeLinecap="round" fill="none" />
          <Path
            d="M -12 -2 L 8 -28 L 2 -8 L 18 -12 L -4 18 L 0 0 Z"
            fill="#FFD23F" stroke="#1A1522" strokeWidth="3.5" strokeLinejoin="round"
          />
          <Path d="M 4 -20 L -3 -4" stroke="#FFF4DF" strokeWidth="1.8" strokeLinecap="round" opacity="0.85" />
        </G>

        {/* brain back / shadow shape */}
        <Path
          d="M 46 80 C 30 78 20 96 28 110 C 14 120 22 144 42 144 C 42 168 68 184 96 178 C 106 192 132 192 144 178 C 168 182 188 162 180 140 C 196 128 188 102 172 102 C 176 84 158 68 142 74 C 134 58 106 58 96 70 C 82 56 52 60 46 80 Z"
          fill={shadowColor}
        />

        {/* main puffy body */}
        <Path
          d="M 48 82 C 34 80 26 94 32 106 C 22 112 26 136 44 138 C 46 160 70 178 96 174 C 106 188 130 188 140 174 C 164 178 184 162 178 142 C 190 130 184 106 170 104 C 174 86 156 74 142 78 C 134 62 106 62 96 74 C 84 62 54 64 48 82 Z"
          fill={color}
          stroke="#1A1522"
          strokeWidth="5.5"
          strokeLinejoin="round"
        />

        {/* brain wrinkles */}
        <G stroke="#1A1522" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.9">
          <Path d="M 58 108 Q 70 102 76 110" />
          <Path d="M 124 102 Q 136 98 142 106" />
          <Path d="M 64 140 Q 76 136 82 144" />
          <Path d="M 128 144 Q 140 140 146 148" />
        </G>

        {/* glossy highlight */}
        <Ellipse cx="72" cy="98" rx="16" ry="7" fill="rgba(255,255,255,0.7)" transform="rotate(-22 72 98)" />
        <Ellipse cx="62" cy="108" rx="5" ry="2.5" fill="rgba(255,255,255,0.55)" transform="rotate(-22 62 108)" />

        {/* rosy cheeks */}
        <Ellipse cx="60"  cy="152" rx="12" ry="7" fill="#E8253C" opacity="0.32" />
        <Ellipse cx="140" cy="152" rx="12" ry="7" fill="#E8253C" opacity="0.32" />

        {/* eyes */}
        {blinking ? (
          <G>
            <Path d="M 70 130 Q 82 134 94 130"  stroke="#1A1522" strokeWidth="5" strokeLinecap="round" fill="none" />
            <Path d="M 110 130 Q 122 134 134 130" stroke="#1A1522" strokeWidth="5" strokeLinecap="round" fill="none" />
          </G>
        ) : (
          <G>
            {/* left eye */}
            <Ellipse cx="82"  cy="130" rx="12" ry="14" fill="#1A1522" />
            <Circle  cx="86"  cy="125" r="5"            fill="#fff" />
            <Circle  cx="78"  cy="134" r="2.2"          fill="#fff" opacity="0.8" />
            <Circle  cx="80"  cy="128" r="1"            fill="#fff" opacity="0.6" />
            {/* right eye */}
            <Ellipse cx="122" cy="130" rx="12" ry="14" fill="#1A1522" />
            <Circle  cx="126" cy="125" r="5"            fill="#fff" />
            <Circle  cx="118" cy="134" r="2.2"          fill="#fff" opacity="0.8" />
            <Circle  cx="120" cy="128" r="1"            fill="#fff" opacity="0.6" />
          </G>
        )}

        {/* mouth — three expressions */}
        {expression === 'hype' ? (
          <G>
            <Ellipse cx="100" cy="168" rx="11" ry="8"  fill="#1A1522" />
            <Ellipse cx="100" cy="172" rx="6"  ry="3"  fill="#E8253C" />
            <Path d="M 92 158 Q 100 162 108 158" stroke="#1A1522" strokeWidth="4" strokeLinecap="round" fill="none" />
          </G>
        ) : expression === 'smirk' ? (
          <Path d="M 88 165 Q 100 174 114 165" stroke="#1A1522" strokeWidth="5" strokeLinecap="round" fill="none" />
        ) : (
          // neutral — closed smile + dimples
          <G>
            <Path d="M 90 165 Q 100 172 110 165" stroke="#1A1522" strokeWidth="5" strokeLinecap="round" fill="none" />
            <Circle cx="88"  cy="167" r="1.5" fill="#1A1522" />
            <Circle cx="112" cy="167" r="1.5" fill="#1A1522" />
          </G>
        )}

      </Svg>
    </Animated.View>
  );
}
