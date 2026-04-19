// LivePlayersStrip.tsx — pulsing live dot + wandering player count + avatar stack
// Sits in the Quickmatch card footer slot.
// Ported from LivePlayersStrip in home.jsx (web design).

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Colors, Fonts } from '@/constants/theme';

const AVATAR_COLORS = ['#FFD23F', '#9EFF3D', '#3DAEFF'];

export function LivePlayersStrip({ fg = Colors.cream, accent = Colors.yellow }) {
  const [count, setCount] = useState(342);
  const pulseScale = useSharedValue(1);
  const pulseOpacity = useSharedValue(0.5);

  // Pulsing dot — 1.2s breathing cycle
  useEffect(() => {
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.8, { duration: 600, easing: Easing.out(Easing.quad) }),
        withTiming(1.0, { duration: 600, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
    pulseOpacity.value = withRepeat(
      withSequence(
        withTiming(0.0, { duration: 600 }),
        withTiming(0.5, { duration: 600 }),
      ),
      -1,
      false,
    );
  }, []);

  // Wander the count to feel live
  useEffect(() => {
    const id = setInterval(() => {
      setCount(c => {
        const delta = Math.round((Math.random() - 0.45) * 8);
        return Math.max(180, Math.min(520, c + delta));
      });
    }, 1800);
    return () => clearInterval(id);
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
    opacity: pulseOpacity.value,
  }));

  return (
    <>
      {/* Pulsing dot */}
      <View style={s.dotWrap}>
        <Animated.View style={[s.dotGlow, { backgroundColor: accent }, glowStyle]} />
        <View style={[s.dotCore, { backgroundColor: accent, borderColor: fg }]} />
      </View>

      {/* Count */}
      <Text style={[s.count, { color: fg }]}>{count.toLocaleString()} playing</Text>

      {/* Avatar stack */}
      <View style={s.avatars}>
        {AVATAR_COLORS.map((c, i) => (
          <View
            key={i}
            style={[
              s.avatar,
              {
                backgroundColor: c,
                marginLeft: i === 0 ? 0 : -7,
                zIndex: 3 - i,
              },
            ]}
          >
            {/* silhouette bust */}
            <View style={s.bust} />
            <View style={s.head} />
          </View>
        ))}
        <View style={[s.avatar, { backgroundColor: fg, marginLeft: -7, zIndex: 0 }]}>
          <Text style={s.plus}>+</Text>
        </View>
      </View>
    </>
  );
}

const s = StyleSheet.create({
  dotWrap: {
    width: 10,
    height: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  dotGlow: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  dotCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  count: {
    fontFamily: Fonts.black,
    fontSize: 12,
    letterSpacing: 0,
    textTransform: 'uppercase',
    flex: 1,
  },
  avatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.ink,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bust: {
    position: 'absolute',
    bottom: -4,
    width: 14,
    height: 10,
    borderRadius: 7,
    backgroundColor: Colors.ink,
    alignSelf: 'center',
  },
  head: {
    position: 'absolute',
    top: 3,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.ink,
    alignSelf: 'center',
  },
  plus: {
    fontFamily: Fonts.black,
    fontSize: 10,
    color: Colors.ink,
    lineHeight: 12,
  },
});
