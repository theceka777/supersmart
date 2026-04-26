// ArcadeCard.tsx — chunky press-down mode button with idle bob float
//
// Two animations:
//   1. bob float  — continuous sine-wave ±1.5px Y + ±0.5° tilt, 4s cycle.
//                   Each card accepts a `floatPhase` (radians) so Quickmatch and
//                   Daily Rise are offset and never in sync.
//   2. press-down — face sinks to meet its ink shadow on tap (CARD_DEPTH px).
//
// The two are blended: as press.value goes 0→1, float contribution is scaled out
// so the card never fights itself (float vanishes exactly as press bottoms out).
//
// Ported from bits.jsx ArcadeCard (web design).

import React, { useEffect } from 'react';
import { Pressable, Text, View, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  withRepeat,
  withTiming,
  useAnimatedStyle,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

interface ArcadeCardProps {
  label: string;
  sublabel?: string;
  /** Optional third text line, rendered below sublabel in mono small.
   *  Used by the Daily Race "done" state for the live `BACK IN HH:MM:SS`
   *  countdown. Kept compact so the card height doesn't change. */
  tertiary?: string;
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
  /** Float phase in radians — offsets the sine wave so sibling cards aren't in sync.
   *  Quickmatch: 0  (default).  Daily: Math.PI * 0.8  (~1.6 rad, like the reference). */
  floatPhase?: number;
  /** Pass false to disable the idle float (e.g. when card is inside a list). Default true. */
  bob?: boolean;
}

export function ArcadeCard({
  label,
  sublabel,
  tertiary,
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
  floatPhase = 0,
  bob = true,
}: ArcadeCardProps) {
  // ── Press value (0 = resting, 1 = fully pressed) ──────────────────────────
  const press = useSharedValue(0);

  // ── Float progress (0 → 1 linear loop, 4 000 ms) ─────────────────────────
  const floatProgress = useSharedValue(0);

  useEffect(() => {
    if (!bob) return;
    floatProgress.value = withRepeat(
      withTiming(1, { duration: 4000, easing: Easing.linear }),
      -1,   // infinite
      false, // don't reverse — just repeat forward (true sine via formula)
    );
    return () => cancelAnimation(floatProgress);
  }, [bob]);

  // ── Animated styles ────────────────────────────────────────────────────────
  //
  // During idle bob:  shadow and face move together (same fy) → card looks like
  //                   a single floating object with consistent depth.
  // During press:     face sinks by CARD_DEPTH; shadow stays at bob position →
  //                   face meets shadow, creating the press-down illusion.
  //
  const faceStyle = useAnimatedStyle(() => {
    'worklet';
    const phase = floatProgress.value * Math.PI * 2 + floatPhase;
    const fy = bob ? Math.sin(phase) * 1.5 : 0;
    const ft = bob ? Math.cos(phase) * 0.5 : 0;

    const p = press.value;
    // Face: bobs freely when idle; sinks to CARD_DEPTH on press
    const translateY = fy + p * CARD_DEPTH;
    const rotateDeg  = tilt + (1 - p) * ft;

    return {
      transform: [{ rotate: `${rotateDeg}deg` }, { translateY }],
      opacity: disabled ? 0.35 : 1,
    };
  });

  // Shadow follows the bob so it stays glued beneath the face at all times
  const shadowStyle = useAnimatedStyle(() => {
    'worklet';
    const phase = floatProgress.value * Math.PI * 2 + floatPhase;
    const fy = bob ? Math.sin(phase) * 1.5 : 0;
    return {
      transform: [{ translateY: fy }],
    };
  });

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
        {/* depth shadow — follows the bob, only face separates on press */}
        <Animated.View
          style={[
            styles.shadow,
            { height, top: CARD_DEPTH },
            shadowStyle,
          ]}
        />

        {/* card face — floats idly, sinks on press */}
        <Animated.View
          style={[
            styles.faceAnimated,
            { height },
            faceStyle,
          ]}
        >
          {/* inner clip wrapper — overflow:hidden lives here so Android doesn't
              clip the Animated.View at its original bounds during translation */}
          <View
            style={[
              styles.faceInner,
              { height, backgroundColor: disabled ? '#d1d5db' : color },
            ]}
          >
          {/* text stack */}
          <View style={[styles.textBlock, contentOffsetY ? { marginTop: contentOffsetY } : null]}>
            <Text style={[styles.label, { color: disabled ? '#9ca3af' : fg }]}>{label}</Text>
            {sublabel ? (
              <Text style={[styles.sublabel, { color: disabled ? '#9ca3af' : fg }]}>{sublabel}</Text>
            ) : null}
            {tertiary ? (
              <Text style={[styles.tertiary, { color: disabled ? '#9ca3af' : fg }]}>{tertiary}</Text>
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
          </View>{/* end faceInner */}
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
  // Animated wrapper — no overflow so Android doesn't clip at original bounds
  faceAnimated: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
  },
  // Non-animated inner — owns the border, bg, clip, and layout
  faceInner: {
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
  // Smaller, dimmer than sublabel — used for the live BACK IN HH:MM:SS line
  // on the Daily Race "done" card. Tabular nums so the seconds digit doesn't
  // wobble the layout.
  tertiary: {
    fontFamily: Fonts.mono,
    fontSize: 9,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 6,
    opacity: 0.55,
    fontVariant: ['tabular-nums'],
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
