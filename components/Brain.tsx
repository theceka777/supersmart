// Brain.tsx — Super Smart 2026 mascot.
//
// Rebuilt session 27: SVG body replaced by an illustrated PNG (brain-base.png,
// 1402×1122, transparent bg) with the eyes + mouth drawn as an SVG overlay
// on top. The PNG carries the volume, gyri detail, glossy highlights, and
// maroon outline. The overlay carries only the face — eyes and mouth —
// because that's what changes by expression and by blink.
//
// Coordinate system for the overlay: viewBox is exactly the PNG dimensions
// (0 0 1402 1122) so face landmarks line up cleanly. Face landmarks ported
// from explore/shared.jsx (the design's source of truth):
//   • left eye  cx=335 cy=540  rx=82 ry=100
//   • right eye cx=645 cy=540  rx=82 ry=100  (flip = -1 → pupils mirror)
//   • smirk mouth: asymmetric, rises on the right, with lower-lip shadow + tooth
//   • hype  mouth: open laughing cavity with upper teeth row + tongue
//
// Wiggle animation: 2.4s ease-in-out, -1.5° → 2°, transform-origin center bottom.
// Disabled when wiggle={false} (used inside the YOU-row leaderboard avatar disc).
//
// Antenna removed across the board (session 27) — small avatars need to fit
// cleanly in tight discs without antenna overflow.

import React, { useEffect, useState } from 'react';
import { Image, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import Svg, { Path, Ellipse, Circle, G, Line } from 'react-native-svg';

export type BrainExpression = 'neutral' | 'hype' | 'smirk';

interface BrainProps {
  size?: number;
  expression?: BrainExpression;
  wiggle?: boolean;
}

// Face palette — pulled from shared.jsx so the overlay matches the PNG ink.
const OUTLINE = '#5A0E2A';   // darker than pinkDark, matches brain ink
const SCLERA  = '#FFF6FB';   // warm off-white, tinted toward pink
const IRIS    = '#1F1430';   // not pure black — reads as cartoon ink
const BLUSH   = 'rgba(255,90,150,0.32)';

// PNG aspect ratio — drives the rendered height for any given width.
const PNG_W = 1402;
const PNG_H = 1122;
const ASPECT = PNG_H / PNG_W; // ~0.80

export function Brain({
  size = 100,
  expression = 'smirk',
  wiggle = true,
}: BrainProps) {
  const rotation = useSharedValue(0);
  const [blinking, setBlinking] = useState(false);

  // Gate the SVG face overlay until the PNG body has loaded. Without this,
  // the synchronous SVG render paints eyes + mouth on transparent space
  // for the few frames before the bitmap decode completes — reads as
  // "face floating in air, then pink body pops in." We preload the PNG
  // at boot in app/_layout.tsx (so this is normally true on first render),
  // but the gate is defense-in-depth: if a screen re-mount or memory
  // pressure forces a re-decode, the face still won't beat the body.
  const [imgLoaded, setImgLoaded] = useState(false);

  // Wiggle: ssBrainWiggle equivalent — -1.5° → 2° → -1.5° over 2.4s.
  useEffect(() => {
    if (wiggle) {
      rotation.value = withRepeat(
        withSequence(
          withTiming(-1.5, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(2,    { duration: 1200, easing: Easing.inOut(Easing.sin) }),
        ),
        -1,
        true,
      );
    } else {
      rotation.value = 0;
    }
  }, [wiggle]);

  // Blink every 2.8–5.3s, lasts 130ms.
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

  const W = size;
  const H = Math.round(size * ASPECT);

  return (
    <Animated.View style={[{ width: W, height: H, position: 'relative' }, animStyle]}>
      {/* soft drop shadow beneath the brain */}
      <View
        style={{
          position: 'absolute',
          left: '15%',
          right: '15%',
          bottom: -H * 0.04,
          height: H * 0.08,
          backgroundColor: 'rgba(0,0,0,0.22)',
          borderRadius: H,
          opacity: 0.9,
          zIndex: 0,
        }}
      />

      {/* illustrated brain PNG */}
      <Image
        source={require('@/assets/images/brain-base.png')}
        style={{
          width: W,
          height: H,
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
        resizeMode="contain"
        onLoad={() => setImgLoaded(true)}
      />

      {/* face overlay — eyes + mouth, drawn at PNG-native viewBox so coords match.
          Hidden until the PNG body has loaded — see imgLoaded comment above. */}
      {imgLoaded && <Svg
        viewBox={`0 0 ${PNG_W} ${PNG_H}`}
        width={W}
        height={H}
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
      >
        {blinking ? (
          // Blink: closed-arc lids over both eyes, no iris/pupil.
          <G>
            <Path
              d="M 253 540 Q 335 555 417 540"
              stroke={OUTLINE}
              strokeWidth={11}
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M 563 540 Q 645 555 727 540"
              stroke={OUTLINE}
              strokeWidth={11}
              strokeLinecap="round"
              fill="none"
            />
          </G>
        ) : (
          <G>
            <FaceEye cx={335} cy={540} flip={1} />
            <FaceEye cx={645} cy={540} flip={-1} />
          </G>
        )}

        {/* mouth */}
        {expression === 'hype' ? <MouthHype /> : <MouthSmirk />}
      </Svg>}
    </Animated.View>
  );
}

// ─── Eye ─────────────────────────────────────────────────────────────────────
//
// Faithful port of shared.jsx's Eye component:
//   • blush behind eye (warm pink wash)
//   • sclera ellipse with thick maroon outline
//   • upper-lid shadow inside the sclera (gives depth)
//   • iris circle, ink-stroked, with pupil and bounce-light highlights
//   • upper lash arc + 3 small lash flicks above the lid

function FaceEye({ cx, cy, flip }: { cx: number; cy: number; flip: 1 | -1 }) {
  return (
    <G>
      {/* soft pink blush below */}
      <Ellipse cx={cx} cy={cy + 70} rx={78} ry={22} fill={BLUSH} />
      {/* sclera (eyeball) */}
      <Ellipse
        cx={cx}
        cy={cy}
        rx={82}
        ry={100}
        fill={SCLERA}
        stroke={OUTLINE}
        strokeWidth={11}
      />
      {/* upper-lid shadow inside the sclera */}
      <Path
        d={`M ${cx - 78} ${cy - 30} Q ${cx} ${cy - 110} ${cx + 78} ${cy - 30} L ${cx + 78} ${cy - 60} Q ${cx} ${cy - 30} ${cx - 78} ${cy - 60} Z`}
        fill="rgba(90,14,42,0.18)"
      />
      {/* iris */}
      <Circle cx={cx + 8 * flip} cy={cy + 8} r={58} fill={IRIS} />
      <Circle
        cx={cx + 8 * flip}
        cy={cy + 8}
        r={58}
        fill="none"
        stroke="#000"
        strokeOpacity={0.35}
        strokeWidth={3}
      />
      {/* pupil + highlights */}
      <Circle cx={cx + 8 * flip} cy={cy + 8} r={22} fill="#000" />
      <Ellipse cx={cx + 28 * flip} cy={cy - 18} rx={22} ry={28} fill="#fff" />
      <Circle cx={cx - 18 * flip} cy={cy + 32} r={9} fill="#fff" opacity={0.85} />
      {/* upper lash/lid arc */}
      <Path
        d={`M ${cx - 84} ${cy - 50} Q ${cx} ${cy - 118} ${cx + 84} ${cy - 50}`}
        stroke={OUTLINE}
        strokeWidth={11}
        strokeLinecap="round"
        fill="none"
      />
      {/* three lash flicks above the lid */}
      {[-50, -10, 30].map((lx, i) => {
        const x1 = cx + lx;
        const y1 = cy - 95 - Math.abs(lx) * 0.15;
        const x2 = cx + lx + (i === 0 ? -8 : i === 2 ? 8 : 0);
        const y2 = cy - 118 - Math.abs(lx) * 0.18;
        return (
          <Line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke={OUTLINE}
            strokeWidth={6}
            strokeLinecap="round"
          />
        );
      })}
    </G>
  );
}

// ─── Smirk mouth ─────────────────────────────────────────────────────────────
//
// Asymmetric curve rising on the right, thick maroon stroke. Soft lower-lip
// shadow underneath, single rect tooth peeking, dimple dot on the right.

function MouthSmirk() {
  return (
    <G>
      {/* dimple */}
      <Ellipse cx={595} cy={700} rx={14} ry={6} fill="rgba(90,14,42,0.35)" />
      {/* main smirk path */}
      <Path
        d="M 395 712 Q 470 770 540 745 Q 590 728 605 700"
        stroke={OUTLINE}
        strokeWidth={22}
        strokeLinecap="round"
        fill="none"
      />
      {/* lower-lip shadow */}
      <Path
        d="M 410 712 Q 470 758 540 738 Q 585 724 600 705 Q 590 740 540 758 Q 470 782 410 730 Z"
        fill="rgba(90,14,42,0.12)"
      />
      {/* tiny tooth peeking */}
      <Path
        d="M 460 722 L 474 722 L 474 736 L 460 736 Z"
        fill="#FFF6FB"
        stroke={OUTLINE}
        strokeWidth={3}
      />
    </G>
  );
}

// ─── Hype mouth (used for the YOU-row brain avatar) ──────────────────────────
//
// Open laughing cavity in dark maroon, upper teeth row with division lines,
// pink tongue with center crease.

function MouthHype() {
  return (
    <G>
      {/* mouth cavity */}
      <Path
        d="M 410 700 Q 490 660 570 700 Q 595 760 490 800 Q 385 760 410 700 Z"
        fill="#3A0A1E"
        stroke={OUTLINE}
        strokeWidth={11}
        strokeLinejoin="round"
      />
      {/* upper teeth row */}
      <Path
        d="M 425 705 Q 490 690 555 705 L 555 720 Q 490 712 425 720 Z"
        fill="#FFF6FB"
        stroke={OUTLINE}
        strokeWidth={4}
      />
      {/* tooth divisions */}
      <Line x1={465} y1={695} x2={465} y2={720} stroke={OUTLINE} strokeWidth={3} />
      <Line x1={490} y1={692} x2={490} y2={720} stroke={OUTLINE} strokeWidth={3} />
      <Line x1={515} y1={695} x2={515} y2={720} stroke={OUTLINE} strokeWidth={3} />
      {/* tongue */}
      <Ellipse cx={490} cy={772} rx={50} ry={22} fill="#FF5A8A" stroke={OUTLINE} strokeWidth={6} />
      <Path d="M 490 762 Q 488 778 490 790" stroke="#B01A4F" strokeWidth={3} fill="none" />
    </G>
  );
}
