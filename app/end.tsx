import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { getRank } from './questions';

export default function EndScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ score: string; mode: string; strikes: string; results: string }>();
  const score = Number(params.score ?? 0);
  const mode = params.mode ?? 'arcade';
  const rank = getRank(score);

  // Daily mode
  if (mode === 'daily') {
    const resultsStr = params.results ?? '';
    const results = resultsStr.split('').map(c => c === '1');
    const correct = results.filter(Boolean).length;
    const grid = results.map(r => (r ? '🟩' : '🟥')).join('');
    const shareText = `Super Smart Daily — ${correct}/10\n${grid}`;

    return (
      <View style={styles.container}>
        <Text style={styles.modeTag}>DAILY QUIZ</Text>
        <Text style={styles.dailyScore}>{correct}/10</Text>
        <Text style={styles.grid}>{grid}</Text>
        <Text style={styles.rank}>{rank}</Text>
        <Text style={styles.shareLabel}>Share your result:</Text>
        <View style={styles.shareBox}>
          <Text style={styles.shareText}>{shareText}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/')}>
          <Text style={styles.buttonText}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.sub}>New quiz tomorrow.</Text>
      </View>
    );
  }

  // Classic mode
  if (mode === 'classic') {
    const strikesUsed = Number(params.strikes ?? 0);
    const heartsLeft = Math.max(0, 3 - strikesUsed);

    return (
      <View style={styles.container}>
        <Text style={styles.modeTag}>CLASSIC</Text>
        <Text style={styles.rankLabel}>{rank}</Text>
        <Text style={styles.scoreValue}>{score}</Text>
        <Text style={styles.scoreLabel}>points</Text>
        <Text style={styles.hearts}>{'❤️'.repeat(heartsLeft)}{'🖤'.repeat(strikesUsed)}</Text>
        <TouchableOpacity style={styles.button} onPress={() => router.replace('/classic')}>
          <Text style={styles.buttonText}>Play Again</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.ghostButton} onPress={() => router.replace('/')}>
          <Text style={styles.ghostButtonText}>Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Arcade (default)
  return (
    <View style={styles.container}>
      <Text style={styles.modeTag}>ARCADE</Text>
      <Text style={styles.rankLabel}>{rank}</Text>
      <Text style={styles.scoreValue}>{score}</Text>
      <Text style={styles.scoreLabel}>points</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/game')}>
        <Text style={styles.buttonText}>Play Again</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ghostButton} onPress={() => router.replace('/')}>
        <Text style={styles.ghostButtonText}>Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 24,
    gap: 8,
  },
  modeTag: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#9ca3af',
    marginBottom: 4,
  },
  rankLabel: {
    fontSize: 42,
    fontWeight: '900',
    color: '#dc2626',
    marginTop: 4,
  },
  scoreValue: {
    fontSize: 80,
    fontWeight: '900',
    color: '#111827',
    lineHeight: 88,
  },
  scoreLabel: {
    fontSize: 18,
    color: '#9ca3af',
    marginBottom: 8,
  },
  hearts: {
    fontSize: 24,
    letterSpacing: 4,
    marginBottom: 8,
  },
  dailyScore: {
    fontSize: 80,
    fontWeight: '900',
    color: '#dc2626',
    lineHeight: 88,
  },
  grid: {
    fontSize: 28,
    letterSpacing: 4,
    marginVertical: 8,
  },
  rank: {
    fontSize: 22,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 8,
  },
  shareLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 8,
  },
  shareBox: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 8,
  },
  shareText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    lineHeight: 28,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#dc2626',
    paddingVertical: 18,
    paddingHorizontal: 56,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
  },
  ghostButton: { paddingVertical: 12 },
  ghostButtonText: { fontSize: 17, color: '#9ca3af' },
  sub: { fontSize: 14, color: '#9ca3af', marginTop: 8 },
});
