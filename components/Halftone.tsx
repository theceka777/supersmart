// Halftone.tsx — repeating dot-grid background pattern.
// Dots at grid center, radius = size/4.5.
// Positioned absolute, covers parent — put behind all content.
// Ported from Halftone in bits.jsx (web design).

import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface HalftoneProps {
  color?: string;
  dotSpacing?: number; // grid cell size in points (dot r = spacing/4.5)
}

export function Halftone({
  color = 'rgba(26,21,34,0.10)',
  dotSpacing = 9,
}: HalftoneProps) {
  const { width, height } = useWindowDimensions();

  // Pre-compute all dot positions — only recalculates when screen size changes
  const dots = useMemo(() => {
    const r = dotSpacing / 4.5;
    const cols = Math.ceil(width  / dotSpacing) + 1;
    const rows = Math.ceil(height / dotSpacing) + 1;
    const out: { cx: number; cy: number }[] = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        out.push({
          cx: col * dotSpacing + dotSpacing / 2,
          cy: row * dotSpacing + dotSpacing / 2,
        });
      }
    }
    return { items: out, r };
  }, [width, height, dotSpacing]);

  return (
    <Svg
      width={width}
      height={height}
      style={styles.container}
      pointerEvents="none"
    >
      {dots.items.map((d, i) => (
        <Circle key={i} cx={d.cx} cy={d.cy} r={dots.r} fill={color} />
      ))}
    </Svg>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 0,
    pointerEvents: 'none',
  },
});
