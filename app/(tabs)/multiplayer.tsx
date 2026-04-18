import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/Avatar';

export default function MultiplayerScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>MULTIPLAYER</Text>

      {/* Echo */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Echo</Text>
        <Text style={styles.cardSub}>Race a real player's recorded run. Press play and instantly face a ghost.</Text>

        <View style={styles.opponent}>
          <Avatar color="#6B9DFF" eyes="square" mouth="smirk" size={56} />
          <View style={styles.opponentInfo}>
            <Text style={styles.opponentName}>GhostPlayer_42</Text>
            <Text style={styles.opponentTime}>played 2 hours ago</Text>
            <Text style={styles.opponentEmote}>"feeling spicy today 🔥"</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/echo')}>
          <Text style={styles.primaryButtonText}>PLAY VS GHOST</Text>
        </TouchableOpacity>
      </View>

      {/* Challenge */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Challenge a Friend</Text>
        <Text style={styles.cardSub}>Share a code. Your friend plays the exact same round. Scores compared.</Text>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push('/challenge')}>
          <Text style={styles.secondaryButtonText}>Create Challenge →</Text>
        </TouchableOpacity>
      </View>

      {/* Global Leaderboard */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Global Leaderboard</Text>
        <Text style={styles.cardSub}>Top Arcade scores from around the world.</Text>
        <View style={styles.leaderboardRows}>
          {[
            { rank: 1, name: 'QuizWizard_88', score: 6800, badge: '🏆' },
            { rank: 2, name: 'BrainFuel_77', score: 6200, badge: '🥈' },
            { rank: 3, name: 'TriviaTank_99', score: 5950, badge: '🥉' },
          ].map(row => (
            <View key={row.rank} style={styles.leaderRow}>
              <Text style={styles.leaderBadge}>{row.badge}</Text>
              <Text style={styles.leaderName}>{row.name}</Text>
              <Text style={styles.leaderScore}>{row.score}</Text>
            </View>
          ))}
          <Text style={styles.leaderNote}>🔒 Live leaderboards coming soon</Text>
        </View>
      </View>

      {/* While you were away */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>While You Were Away</Text>
        <Text style={styles.cardSub}>3 players raced your ghost while you were offline.</Text>
        <View style={styles.awayRows}>
          {[
            { name: 'SmartBomb_11', result: 'beat you by 200', emote: '"told you 😏"' },
            { name: 'QuizWizard_88', result: 'lost by 350', emote: '"rematch 🔥"' },
            { name: 'BrainFuel_77', result: 'tied', emote: '"we\'re the same person"' },
          ].map((r, i) => (
            <View key={i} style={styles.awayRow}>
              <Text style={styles.awayName}>{r.name}</Text>
              <View>
                <Text style={styles.awayResult}>{r.result}</Text>
                <Text style={styles.awayEmote}>{r.emote}</Text>
              </View>
            </View>
          ))}
          <Text style={styles.leaderNote}>🔒 Live data coming soon</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#dc2626',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#f9fafb',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  cardSub: {
    fontSize: 14,
    color: '#6b7280',
  },
  opponent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
  },
  opponentInfo: { flex: 1 },
  opponentName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  opponentTime: { fontSize: 13, color: '#9ca3af' },
  opponentEmote: { fontSize: 13, color: '#6b7280', fontStyle: 'italic', marginTop: 2 },
  primaryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  secondaryButtonText: { color: '#374151', fontSize: 16, fontWeight: '600' },
  leaderboardRows: { gap: 8 },
  leaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    gap: 10,
  },
  leaderBadge: { fontSize: 20 },
  leaderName: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111827' },
  leaderScore: { fontSize: 16, fontWeight: '800', color: '#dc2626' },
  leaderNote: { fontSize: 13, color: '#9ca3af', textAlign: 'center', marginTop: 4 },
  awayRows: { gap: 8 },
  awayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
  },
  awayName: { fontSize: 14, fontWeight: '600', color: '#111827' },
  awayResult: { fontSize: 13, color: '#6b7280', textAlign: 'right' },
  awayEmote: { fontSize: 12, color: '#9ca3af', fontStyle: 'italic', textAlign: 'right' },
});
