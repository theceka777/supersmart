// ArcadeCard.tsx — chunky press-down mode button
// The card face physically sinks to meet its shadow on tap.
// Ported from ArcadeCard in bits.jsx (web design).

import React from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

interface ArcadeCardProps {
  label: string;
  sublabel?: string;
  color: string;                   // card face background
  fg: string;                      // text + icon foreground
  tilt?: number;                   // static rotation in degrees
  height?: number;
  onPress?: () => void;
  disabled?: boolean;
  decor?: React.ReactNode;         // right-side decorative element
  badge?: React.ReactNode;         // top-right badge
  footer?: React.ReactNode;        // pinned footer strip (e.g. LivePlayersStrip)
  contentOffsetY?: number;         // nudge text block up when footer is present
  flex?: boolean;                  // if true, card stretches in a row (flex: 1)
  style?: ViewStyle;
}

export function ArcadeCard({
  label,
  sublabel,
  color,
  fg,
  tilt = 0,
  height = 82,
  onPress,
  disabled = false,
  decor,
  badge,
  footer,
  contentOffsetY = 0,
  flex = false,
  style,
}: ArcadeCardProps) {
  const press = useSharedValue(0);

  const faceStyle = useAnimatedStyle(() => ({
    transform: [
      { rotate: `${tilt}deg` },
      { translateY: press.value * CARD_DEPTH },
    ],
    opacity: disabled ? 0.35 : 1,
  }));

  return (
    <Pressable
      onPressIn={() => {
        if (!disabled) {
          press.value = withSpring(1, { mass: 0.2, damping: 12, stiffness: 500 });
        }
      }}
      onPressOut={() => {
        press.value = withSpring(0, { mass: 0.2, damping: 14, stiffness: 400 });
      }}
      onPress={disabled ? undefined : onPress}
      style={[{ flex: flex ? 1 : undefined }, style]}
    >
      <View style={{ position: 'relative', height: height + CARD_DEPTH }}>
        {/* depth shadow — sits below, never moves */}
        <View
          style={[
            styles.shadow,
            {
              height,
              top: CARD_DEPTH,
            },
          ]}
        />

        {/* card face — animates down on press */}
        <Animated.View
          style={[
            styles.face,
            {
              height,
              backgroundColor: disabled ? '#d1d5db' : color,
            },
            faceStyle,
          ]}
        >
          {/* text stack */}
          <View style={[styles.textBlock, contentOffsetY ? { marginTop: contentOffsetY } : null]}>
            <Text style={[styles.label, { color: disabled ? '#9ca3af' : fg }]}>{label}</Text>
            {sublabel ? (
              <Text style={[styles.sublabel, { color: disabled ? '#9ca3af' : fg }]}>{sublabel}</Text>
            ) : null}
          </View>

          {/* right-side decoration */}
          {decor ? <View style={styles.decorWrap}>{decor}</View> : null}

          {/* top-right badge */}
          {badge ? <View style={styles.badgeWrap}>{badge}</View> : null}

          {/* footer strip — pinned to bottom of card face */}
          {footer ? (
            <View style={[styles.footerStrip, { borderTopColor: Colors.border }]}>
              {footer}
            </View>
          ) : null}
        </Animated.View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  shadow: {
    position: 'absolute',
    left: 0,
    right: 0,
    backgroundColor: Colors.shadow,
    borderRadius: Radius.card,
  },
  face: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    overflow: 'hidden',
  },
  textBlock: {
    flex: 1,
    zIndex: 2,
  },
  label: {
    fontFamily: Fonts.black,
    fontSize: 26,
    letterSpacing: -0.5,
    lineHeight: 30,
    textTransform: 'uppercase',
  },
  sublabel: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginTop: 3,
    opacity: 0.75,
  },
  decorWrap: {
    zIndex: 2,
    position: 'absolute',
    right: 14,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  badgeWrap: {
    position: 'absolute',
    top: -2,
    right: -2,
    zIndex: 3,
  },
  footerStrip: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    borderTopWidth: 2,
    paddingHorizontal: 14,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(0,0,0,0.12)',
    zIndex: 2,
  },
});
