// Sunburst.tsx — rotating background rays
// 24 alternating wedge rays, very slow rotation (~0.04deg/frame).
// Position: absolute, centered behind all content.
// Ported from Sunburst in bits.jsx (web design).

import React from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import Svg, { Path } from 'react-native-svg';

interface SunburstProps {
  rays?: number;
  color?: string;
  opacity?: number;
  size?: number;
}

export function Sunburst({
  rays = 24,
  color = '#FFD6A8',
  opacity = 0.55,
  size = 700,
}: SunburstProps) {
  const rotation = useSharedValue(0);

  useFrameCallback(() => {
    rotation.value = (rotation.value + 0.04) % 360;
  });

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // Build alternating wedge rays (every other segment filled)
  // Each ray spans one full sector; only even ones are drawn (12 wedges out of 24)
  const paths: string[] = [];
  for (let i = 0; i < rays; i++) {
    if (i % 2 !== 0) continue;
    const a1 = ((i * 360) / rays - 180 / rays) * (Math.PI / 180);
    const a2 = ((i * 360) / rays + 180 / rays) * (Math.PI / 180);
    const p1x = Math.cos(a1) * size;
    const p1y = Math.sin(a1) * size;
    const p2x = Math.cos(a2) * size;
    const p2y = Math.sin(a2) * size;
    paths.push(`M 0 0 L ${p1x} ${p1y} L ${p2x} ${p2y} Z`);
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, animStyle]}
    >
      <Svg
        width={size * 2}
        height={size * 2}
        viewBox={`-${size} -${size} ${size * 2} ${size * 2}`}
        style={{ opacity }}
      >
        {paths.map((d, i) => (
          <Path key={i} d={d} fill={color} />
        ))}
      </Svg>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    // Center the square canvas on screen
    top: '50%',
    left: '50%',
    marginTop: -700,   // half of size*2
    marginLeft: -700,
    zIndex: 0,
    pointerEvents: 'none',
  },
});
