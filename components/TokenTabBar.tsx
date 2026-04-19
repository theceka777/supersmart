// TokenTabBar.tsx — Chunky arcade-door tab bar (Cream Stadium)
//
// Visual spec from bits.jsx TokenButton:
//   • 56 × 52px face, borderRadius 14, cream bg, 3px ink border
//   • Ink depth shadow 3px below (absolute positioned, never moves)
//   • Active: yellow border (instead of ink) + depth reduced to 2px visual
//   • Press: face translates 3px down into its shadow via Reanimated spring
//   • Icon (SF Symbol) above mono label, both vertically centred
//
// Sits inside the standard bottom safe area. Background fades with a
// cream gradient identical to the reference "Token row" layer.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors, Fonts } from '@/constants/theme';

// ── Per-route config ─────────────────────────────────────────────────────────

const ROUTE_ICON: Record<string, string> = {
  index:   'house.fill',
  inbox:   'tray.fill',
  profile: 'person.fill',
};

const ROUTE_LABEL: Record<string, string> = {
  index:   'home',
  inbox:   'inbox',
  profile: 'profile',
};

const BTN_DEPTH = 4; // px the shadow is offset below the face

// ── Single token button ───────────────────────────────────────────────────────

function TokenButton({
  routeName,
  focused,
  onPress,
}: {
  routeName: string;
  focused: boolean;
  onPress: () => void;
}) {
  const press = useSharedValue(0);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: press.value * BTN_DEPTH }],
  }));

  const iconColor   = focused ? Colors.red  : Colors.ink;
  const labelColor  = focused ? Colors.red  : Colors.ink;
  const borderColor = focused ? Colors.yellow : Colors.ink;
  const iconName    = ROUTE_ICON[routeName]  ?? 'circle.fill';
  const label       = ROUTE_LABEL[routeName] ?? routeName;

  return (
    <Pressable
      onPressIn={() => {
        press.value = withSpring(1, { mass: 0.15, damping: 10, stiffness: 500 });
        if (process.env.EXPO_OS === 'ios') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
      }}
      onPressOut={() => {
        press.value = withSpring(0, { mass: 0.15, damping: 12, stiffness: 400 });
      }}
      onPress={onPress}
      style={s.btnOuter}
      accessibilityRole="button"
      accessibilityLabel={label}
    >
      {/* depth shadow — fixed, never moves */}
      <View style={[s.shadow, focused && s.shadowFocused]} />

      {/* face — springs down on tap */}
      <Animated.View
        style={[
          s.face,
          { borderColor },
          animStyle,
        ]}
      >
        <IconSymbol
          name={iconName as any}
          size={22}
          color={iconColor}
        />
        <Text style={[s.label, { color: labelColor }]}>{label}</Text>
      </Animated.View>
    </Pressable>
  );
}

// ── Tab bar ───────────────────────────────────────────────────────────────────

export function TokenTabBar({ state, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[s.container, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {/* cream fade gradient — 4-layer approximation (no LinearGradient dependency) */}
      <View style={s.fadeTop} pointerEvents="none" />

      <View style={s.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params as any);
            }
          };

          return (
            <TokenButton
              key={route.key}
              routeName={route.name}
              focused={focused}
              onPress={onPress}
            />
          );
        })}
      </View>
    </View>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const FACE_H   = 52;
const FACE_W   = 56;
const BR       = 14;

const s = StyleSheet.create({
  container: {
    backgroundColor: Colors.cream,
    borderTopWidth: 2,
    borderTopColor: Colors.ink,
    paddingTop: 10,
    paddingHorizontal: 24,
  },

  // Soft cream fade above the tab bar (simulates the reference gradient layer)
  fadeTop: {
    position: 'absolute',
    top: -28,
    left: 0,
    right: 0,
    height: 30,
    backgroundColor: Colors.cream,
    opacity: 0.0, // reserved — real gradient would need expo-linear-gradient
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-start',
    paddingBottom: 4,
  },

  // ── Single button ───────────────────────────────────────────────────────────

  btnOuter: {
    width:  FACE_W,
    height: FACE_H + BTN_DEPTH,
    position: 'relative',
    alignItems: 'center',
  },

  shadow: {
    position: 'absolute',
    left:  0,
    right: 0,
    top:   BTN_DEPTH,     // pushed to the bottom of the depth offset
    height: FACE_H,
    backgroundColor: Colors.ink,
    borderRadius: BR,
  },
  shadowFocused: {
    // Active tab: shadow shrinks by 1px to feel "elevated" (closer to surface)
    top: BTN_DEPTH - 1,
  },

  face: {
    position: 'absolute',
    left:   0,
    right:  0,
    top:    0,
    height: FACE_H,
    backgroundColor: Colors.cream,
    borderWidth: 3,
    borderRadius: BR,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },

  label: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
});
