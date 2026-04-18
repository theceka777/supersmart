import { View, Text } from 'react-native';

const EYES: Record<string, string> = {
  round: '◉  ◉',
  square: '▪  ▪',
  sleepy: '—  —',
};

const MOUTHS: Record<string, string> = {
  smile: '∪',
  neutral: '—',
  smirk: '⌢',
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
        {EYES[eyes] || '◉  ◉'}
      </Text>
      <Text style={{ fontSize: size * 0.22, color: '#fff', marginTop: 2 }}>
        {MOUTHS[mouth] || '∪'}
      </Text>
    </View>
  );
}
