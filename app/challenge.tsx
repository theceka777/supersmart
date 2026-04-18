import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

export default function ChallengeScreen() {
  const router = useRouter();
  const [code] = useState(generateCode);
  const [inputCode, setInputCode] = useState('');
  const [copied, setCopied] = useState(false);

  function copyCode() {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Code copied!', `Share ${code} with a friend — they'll play the same questions you did.`);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>CHALLENGE</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Your Challenge Code</Text>
        <Text style={styles.cardSub}>
          Share this with a friend. They play the exact same 20 questions in the same order. Scores compared.
        </Text>
        <View style={styles.codeBox}>
          <Text style={styles.code}>{code}</Text>
        </View>
        <TouchableOpacity style={[styles.copyButton, copied && styles.copiedButton]} onPress={copyCode}>
          <Text style={styles.copyButtonText}>{copied ? 'Copied ✓' : 'Copy Code'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.playOwnButton} onPress={() => router.replace('/game')}>
          <Text style={styles.playOwnText}>Play this challenge yourself →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Join a Challenge</Text>
        <Text style={styles.cardSub}>Got a code from a friend? Enter it here.</Text>
        <TextInput
          style={styles.input}
          value={inputCode}
          onChangeText={v => setInputCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
          placeholder="A1B2C3"
          maxLength={6}
          autoCapitalize="characters"
          placeholderTextColor="#d1d5db"
        />
        <TouchableOpacity
          style={[styles.joinButton, inputCode.length < 6 && styles.disabled]}
          disabled={inputCode.length < 6}
          onPress={() => router.push('/game')}
        >
          <Text style={styles.joinButtonText}>Play Challenge</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        🔒 Live challenge tracking coming with backend in Phase 4.{'\n'}For now, compare scores manually.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 56, gap: 20 },
  back: { marginBottom: -8 },
  backText: { fontSize: 16, color: '#6b7280' },
  title: { fontSize: 28, fontWeight: '900', letterSpacing: 2, color: '#dc2626' },
  card: { backgroundColor: '#f9fafb', borderRadius: 16, padding: 20, gap: 12 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  cardSub: { fontSize: 14, color: '#6b7280' },
  codeBox: { backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
  code: { fontSize: 40, fontWeight: '900', letterSpacing: 10, color: '#dc2626' },
  copyButton: { backgroundColor: '#dc2626', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  copiedButton: { backgroundColor: '#16a34a' },
  copyButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  playOwnButton: { alignItems: 'center', paddingVertical: 4 },
  playOwnText: { fontSize: 14, color: '#6b7280' },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 8,
    textAlign: 'center',
    color: '#111827',
  },
  joinButton: { backgroundColor: '#111827', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  disabled: { opacity: 0.35 },
  joinButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  note: { fontSize: 13, color: '#9ca3af', textAlign: 'center', lineHeight: 20 },
});
