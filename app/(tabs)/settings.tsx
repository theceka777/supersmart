import { View, Text, Switch, StyleSheet, ScrollView } from 'react-native';
import { useAppStore } from '@/app/store';

const ONE_MORE_COPY = [
  "one more can't hurt",
  "real Pavlovian, huh?",
  "could've just bought the Pro pack",
  "we respect you too much to show you an ad",
  "if this were an ad, you'd be 15 seconds older",
  "you're still here. we respect that.",
  "ok this is getting impressive",
  "honestly, at this point we're friends",
  "the Pro pack is $4.99. just saying.",
  "we've stopped judging. seriously.",
];

export default function SettingsScreen() {
  const { highScores } = useAppStore();

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <Text style={styles.title}>SETTINGS</Text>

      {/* Gameplay */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Gameplay</Text>

        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={styles.rowTitle}>Sound Effects</Text>
            <Text style={styles.rowSub}>Coming in Phase 3</Text>
          </View>
          <Switch value={false} disabled trackColor={{ false: '#e5e7eb' }} thumbColor="#fff" />
        </View>
      </View>

      {/* Personal Bests */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Bests</Text>
        <View style={styles.statsCard}>
          {[
            { label: 'Arcade', value: highScores.arcade },
            { label: 'Classic', value: highScores.classic },
            { label: 'Daily Quiz', value: highScores.daily },
          ].map(s => (
            <View key={s.label} style={styles.statRow}>
              <Text style={styles.statLabel}>{s.label}</Text>
              <Text style={styles.statValue}>{s.value > 0 ? s.value : '—'}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* One More preview */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>One More — Preview</Text>
        <Text style={styles.previewNote}>What you'll see when free plays run out:</Text>
        <View style={styles.oneMorePreview}>
          <View style={styles.oneMoreButton}>
            <Text style={styles.oneMoreButtonText}>One More</Text>
          </View>
          {ONE_MORE_COPY.slice(0, 4).map((line, i) => (
            <Text key={i} style={styles.oneMoreCopy}>"{line}"</Text>
          ))}
          <Text style={styles.oneMoreFinal}>...honestly, just get the Pro pack already, it's $5.</Text>
        </View>
      </View>

      {/* Pro */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Super Smart Pro</Text>
        <View style={styles.proCard}>
          <Text style={styles.proTitle}>Super Smart Pro — $4.99</Text>
          <Text style={styles.proSub}>One-time purchase. No subscription. No ads, ever.</Text>
          <View style={styles.proFeatures}>
            {[
              'Unlimited rounds daily',
              'All seasonal question packs',
              'Premium avatar items',
              'Advanced stats + records',
              'Pro badge on leaderboards',
            ].map(f => (
              <Text key={f} style={styles.proFeature}>✓  {f}</Text>
            ))}
          </View>
          <View style={styles.proButtonPlaceholder}>
            <Text style={styles.proButtonText}>Available at launch</Text>
          </View>
        </View>
      </View>

      <Text style={styles.version}>Super Smart 2026 · shell build · v0.1</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1, backgroundColor: '#fff' },
  container: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 48,
    gap: 28,
  },
  title: {
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
    color: '#dc2626',
  },
  section: { gap: 10 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  rowInfo: { flex: 1, marginRight: 12 },
  rowTitle: { fontSize: 16, fontWeight: '600', color: '#111827' },
  rowSub: { fontSize: 13, color: '#9ca3af', marginTop: 2 },
  statsCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    gap: 10,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: { fontSize: 15, color: '#374151', fontWeight: '500' },
  statValue: { fontSize: 18, fontWeight: '800', color: '#dc2626' },
  previewNote: { fontSize: 14, color: '#6b7280' },
  oneMorePreview: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    gap: 8,
    alignItems: 'center',
  },
  oneMoreButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 12,
    marginBottom: 4,
  },
  oneMoreButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  oneMoreCopy: { fontSize: 13, color: '#9ca3af', fontStyle: 'italic' },
  oneMoreFinal: { fontSize: 13, color: '#dc2626', fontStyle: 'italic', marginTop: 4, textAlign: 'center' },
  proCard: {
    backgroundColor: '#fef9c3',
    borderRadius: 16,
    padding: 20,
    gap: 10,
  },
  proTitle: { fontSize: 17, fontWeight: '800', color: '#92400e' },
  proSub: { fontSize: 14, color: '#b45309' },
  proFeatures: { gap: 6, marginTop: 4 },
  proFeature: { fontSize: 14, color: '#78350f' },
  proButtonPlaceholder: {
    backgroundColor: '#fde68a',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  proButtonText: { fontSize: 15, fontWeight: '700', color: '#92400e' },
  version: { fontSize: 12, color: '#e5e7eb', textAlign: 'center' },
});
