import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from '@/app/store';

export default function HomeScreen() {
  const router = useRouter();
  const { highScores, avatar } = useAppStore();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push('/avatar')} style={styles.avatarArea}>
        <Avatar color={avatar.color} eyes={avatar.eyes} mouth={avatar.mouth} size={88} />
        <Text style={styles.editHint}>tap to edit</Text>
      </TouchableOpacity>

      <Text style={styles.title}>SUPER SMART</Text>
      <Text style={styles.tagline}>short-form trivia with a sense of humor</Text>

      {highScores.arcade > 0 && (
        <Text style={styles.highScore}>personal best: {highScores.arcade}</Text>
      )}

      <View style={styles.modes}>
        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/game')}>
          <Text style={styles.primaryButtonText}>ARCADE</Text>
          <Text style={styles.buttonSub}>60 seconds · beat your best</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/classic')}>
            <Text style={styles.secondaryButtonText}>CLASSIC</Text>
            <Text style={styles.buttonSubDark}>3 strikes · 10s</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/daily')}>
            <Text style={styles.secondaryButtonText}>DAILY</Text>
            <Text style={styles.buttonSubDark}>10 questions · everyone plays</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.cta}>Get super smart today by getting Super Smart today!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    gap: 14,
  },
  avatarArea: {
    alignItems: 'center',
    gap: 4,
  },
  editHint: {
    fontSize: 12,
    color: '#d1d5db',
  },
  title: {
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 3,
    color: '#dc2626',
  },
  tagline: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: -6,
  },
  highScore: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '600',
  },
  modes: {
    width: '100%',
    gap: 10,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderRadius: 18,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: 3,
  },
  buttonSub: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 3,
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#111827',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  buttonSubDark: {
    color: '#9ca3af',
    fontSize: 11,
    marginTop: 3,
    textAlign: 'center',
  },
  cta: {
    fontSize: 12,
    color: '#d1d5db',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});
