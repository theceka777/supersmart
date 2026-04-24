// Avatar.tsx — Modular brain builder.
// Mothership Part 3 (Avatar system, decided 2026-04-24):
//   3 customisable components — brain colour, eyes, mouth.
//   Antenna (lightning bolt) is fixed brand identity — not customisable.
//   Free base kit: 4 colours × 4 eyes × 4 mouths = 64 combos.
//   Pro tier adds 4 more of each (512 combos total).
//   League rank border added in Phase 3 visual pass.

import { View, Text } from 'react-native';

// Keep the dictionary keyed by id-string so the store stays simple.
// Avatar options IDs: tiers live in app/avatar.tsx; the renderer just draws glyphs.

const EYES: Record<string, string> = {
  // Free tier (4)
  round:  '◉  ◉',
  square: '▪  ▪',
  sleepy: '—  —',
  wink:   '◉  _',
  // Pro tier (4)
  stars:  '✦  ✦',
  dots:   '·  ·',
  wide:   '◎  ◎',
  closed: '‿  ‿',
};

const MOUTHS: Record<string, string> = {
  // Free tier (4)
  smile:   '∪',
  neutral: '—',
  smirk:   '⌢',
  ohh:     'o',
  // Pro tier (4)
  grin:    '‿',
  tongue:  'ᴗ',
  flat:    '▬',
  open:    'O',
};

interface AvatarProps {
  color: string;
  eyes: string;
  mouth: string;
  size?: number;
}

export function Avatar({ color, eyes, mouth, size = 80 }: AvatarProps) {
  return (
    <View
      style={{
        backgroundColor: color,
        width: size,
        height: size,
        borderRadius: size / 2,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text style={{ fontSize: size * 0.16, color: '#fff', letterSpacing: 2 }}>
        {EYES[eyes] || EYES.round}
      </Text>
      <Text style={{ fontSize: size * 0.22, color: '#fff', marginTop: 2 }}>
        {MOUTHS[mouth] || MOUTHS.smile}
      </Text>
    </View>
  );
}
