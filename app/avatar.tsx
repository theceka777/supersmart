import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from './store';

const COLORS = [
  { id: '#FF6B9D', label: 'Pink' },
  { id: '#6B9DFF', label: 'Blue' },
  { id: '#6BDB6B', label: 'Green' },
  { id: '#FFB86B', label: 'Orange' },
  { id: '#B86BFF', label: 'Purple' },
  { id: '#FFD700', label: 'Gold' },
];

const EYES = [
  { id: 'round', label: '◉  ◉' },
  { id: 'square', label: '▪  ▪' },
  { id: 'sleepy', label: '—  —' },
];

const MOUTHS = [
  { id: 'smile', label: '∪' },
  { id: 'neutral', label: '—' },
  { id: 'smirk', label: '⌢' },
];

export default function AvatarScreen() {
  const router = useRouter();
  const { avatar, updateAvatar } = useAppStore();
  const [local, setLocal] = useState({ ...avatar });

  function save() {
    updateAvatar(local);
    router.back();
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>YOUR BRAIN</Text>

      <View style={styles.preview}>
        <Avatar color={local.color} eyes={local.eyes} mouth={local.mouth} size={120} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color</Text>
        <View style={styles.colorRow}>
          {COLORS.map(c => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.colorChip,
                { backgroundColor: c.id },
                local.color === c.id && styles.colorSelected,
              ]}
              onPress={() => setLocal(l => ({ ...l, color: c.id }))}
            />
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Eyes</Text>
        <View style={styles.optionRow}>
          {EYES.map(e => (
            <TouchableOpacity
              key={e.id}
              style={[styles.optionChip, local.eyes === e.id && styles.optionSelected]}
              onPress={() => setLocal(l => ({ ...l, eyes: e.id }))}
            >
              <Text style={[styles.optionText, local.eyes === e.id && styles.optionTextSelected]}>
                {e.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mouth</Text>
        <View style={styles.optionRow}>
          {MOUTHS.map(m => (
            <TouchableOpacity
              key={m.id}
              style={[styles.optionChip, local.mouth === m.id && styles.optionSelected]}
              onPress={() => setLocal(l => ({ ...l, mouth: m.id }))}
            >
              <Text style={[styles.optionText, local.mouth === m.id && styles.optionTextSelected]}>
                {m.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={save}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    paddingTop: 56,
    gap: 24,
  },
  back: { marginBottom: -8 },
  backText: { fontSize: 16, color: '#6b7280' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 2, color: '#dc2626' },
  preview: { alignItems: 'center', paddingVertical: 8 },
  section: { gap: 10 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  colorRow: { flexDirection: 'row', gap: 14 },
  colorChip: { width: 44, height: 44, borderRadius: 22 },
  colorSelected: { borderWidth: 3, borderColor: '#111827' },
  optionRow: { flexDirection: 'row', gap: 10 },
  optionChip: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  optionSelected: { backgroundColor: '#111827' },
  optionText: { fontSize: 18, color: '#111827' },
  optionTextSelected: { color: '#fff' },
  saveButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 'auto',
  },
  saveButtonText: { color: '#fff', fontSize: 18, fontWeight: '800' },
});
