// Wordmark.tsx — Animated SUPER / SMART logo
// Each letter bobs on an independent sine-wave phase.
// Water-balloon bloat every 6s: letters swell, jiggle, and spring back.
// Spinning starburst "!" badge on the right of SMART.
// Ported from AnimatedWordmark in home.jsx (web design).

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useFrameCallback,
} from 'react-native-reanimated';
import Svg, { Path, Circle } from 'react-native-svg';
import { Colors, Fonts } from '@/constants/theme';

// ─── Water-balloon constants ────────────────────────────────────────────────
// These live in worklet-land so they're inlined as literals below.
// BLOAT_PERIOD = 6s  ·  BLOAT_DUR = 1.4s

// ─── Individual bobbing letter ─────────────────────────────────────────────

interface LetterProps {
  char: string;
  time: Animated.SharedValue<number>;
  /** Per-letter phase offset: encodes row + column position */
  phase: number;
  fontSize: number;
  color: string;
  shadowColor: string;
}

function Letter({ char, time, phase, fontSize, color, shadowColor }: LetterProps) {
  const style = useAnimatedStyle(() => {
    'worklet';
    const t = time.value;

    // ── Gentle bob ──
    const tp = t * 2 + phase;
    const dy = Math.sin(tp) * 2.5;
    const rot = Math.sin(tp * 0.8) * 1.8;

    // ── Water-balloon bloat — fires every 6 seconds ──
    const BLOAT_PERIOD = 6;
    const BLOAT_DUR = 1.4;
    const bT = t % BLOAT_PERIOD;
    const bP = bT < BLOAT_DUR ? bT / BLOAT_DUR : 0;

    // Envelope: cubic ease-in to 1, then exponential decay
    let env = 0;
    if (bP > 0) {
      if (bP < 0.22) {
        const x = bP / 0.22;
        env = 1 - Math.pow(1 - x, 3);
      } else {
        env = Math.exp(-(bP - 0.22) * 4);
      }
    }

    // Per-letter wave ripple (each letter lags the previous slightly)
    const wX  = env * Math.sin(bP * 24 - phase) * 0.18;
    const wY  = env * Math.sin(bP * 24 - phase + Math.PI) * 0.14;
    const puffX = env * 0.28;
    const puffY = env * 0.18;
    const bloatX = 1 + puffX + wX;
    const bloatY = 1 + puffY + wY;
    const skew  = env * Math.sin(bP * 18 - phase) * 2.5;

    return {
      transform: [
        { translateY: dy },
        { rotate: `${rot}deg` },
        { scaleX: bloatX },
        { scaleY: bloatY },
        { skewX: `${skew}deg` },
      ],
    };
  });

  return (
    <Animated.Text
      style={[
        styles.letter,
        {
          fontSize,
          color,
          textShadowColor: shadowColor,
          textShadowOffset: { width: 5, height: 5 },
          textShadowRadius: 0,
        },
        style,
      ]}
    >
      {char}
    </Animated.Text>
  );
}

// ─── Starburst "!" badge ────────────────────────────────────────────────────

function StarburstBadge({
  time,
  fill,
  stroke,
  accent,
}: {
  time: Animated.SharedValue<number>;
  fill: string;
  stroke: string;
  accent: string;
}) {
  const rotStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${time.value * 40}deg` }],
  }));

  const counterRotStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-time.value * 40}deg` }],
  }));

  const SIZE = 40;
  const rays = 12;
  const paths: string[] = [];
  for (let i = 0; i < rays; i++) {
    if (i % 2 !== 0) continue;
    const a1 = ((i * 360) / rays - 7) * (Math.PI / 180);
    const a2 = ((i * 360) / rays + 7) * (Math.PI / 180);
    const r = SIZE / 2 - 2;
    paths.push(
      `M 0 0 L ${Math.cos(a1) * r} ${Math.sin(a1) * r} L ${Math.cos(a2) * r} ${Math.sin(a2) * r} Z`
    );
  }

  return (
    <View style={{ width: SIZE, height: SIZE }}>
      <Animated.View style={[{ width: SIZE, height: SIZE }, rotStyle]}>
        <Svg width={SIZE} height={SIZE} viewBox={`-${SIZE / 2} -${SIZE / 2} ${SIZE} ${SIZE}`}>
          {paths.map((d, i) => (
            <Path key={i} d={d} fill={accent} stroke={stroke} strokeWidth="2" strokeLinejoin="round" />
          ))}
          <Circle r="11" fill={fill} stroke={stroke} strokeWidth="2.5" />
        </Svg>
      </Animated.View>

      {/* "!" counter-rotates so it stays upright */}
      <Animated.View
        style={[
          StyleSheet.absoluteFillObject,
          { justifyContent: 'center', alignItems: 'center' },
          counterRotStyle,
        ]}
      >
        <Text style={{ fontFamily: Fonts.black, fontSize: 16, color: stroke, lineHeight: 18 }}>!</Text>
      </Animated.View>
    </View>
  );
}

// ─── Wordmark ───────────────────────────────────────────────────────────────

interface WordmarkProps {
  color?: string;
  outlineColor?: string;
  accentColor?: string;
  shadowColor?: string;
  fontSize?: number;
}

export function Wordmark({
  color = Colors.cream,
  outlineColor = Colors.ink,
  accentColor = Colors.red,
  shadowColor = Colors.ink,
  fontSize = 44,
}: WordmarkProps) {
  const time = useSharedValue(0);

  useFrameCallback((info) => {
    time.value += (info.timeSincePreviousFrame ?? 16) / 1000;
  });

  // Row sway — each row tilts on a slow independent cycle
  const superSway = useAnimatedStyle(() => ({
    transform: [{ rotate: `${-3 + Math.sin(time.value * 1.5) * 0.8}deg` }],
  }));

  const smartSway = useAnimatedStyle(() => ({
    transform: [{ rotate: `${2 + Math.sin(time.value * 1.5 + 1) * 0.8}deg` }],
  }));

  return (
    <View style={{ alignItems: 'flex-start' }}>
      {/* SUPER */}
      <Animated.View style={[{ flexDirection: 'row' }, superSway]}>
        {['S','U','P','E','R'].map((char, i) => (
          <Letter
            key={i}
            char={char}
            time={time}
            phase={i * 0.35}
            fontSize={fontSize}
            color={color}
            shadowColor={shadowColor}
          />
        ))}
      </Animated.View>

      {/* SMART + starburst badge */}
      <Animated.View style={[{ flexDirection: 'row', alignItems: 'flex-end', marginTop: -6, marginLeft: 10 }, smartSway]}>
        {['S','M','A','R','T'].map((char, i) => (
          <Letter
            key={i}
            char={char}
            time={time}
            phase={1.5 + i * 0.35}
            fontSize={fontSize}
            color={color}
            shadowColor={shadowColor}
          />
        ))}
        <View style={{ marginLeft: 4, marginBottom: 4 }}>
          <StarburstBadge
            time={time}
            fill={color}
            stroke={outlineColor}
            accent={accentColor}
          />
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  letter: {
    fontFamily: Fonts.black,
    letterSpacing: -1,
    lineHeight: 48,
    textTransform: 'uppercase',
  },
});
