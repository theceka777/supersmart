// challenge.tsx — Challenge a Friend (placeholder UX)
//
// Cream Stadium refresh of the pre-2026-04-19 stub. Live challenge tracking
// (sender's ghost locked, link races sender, scores count toward weekly League
// totals — Mothership Part 4) lands with the Phase 4 backend. Until then this
// screen issues a copyable code as a stand-in.

import { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

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
    Alert.alert('Code copied!', `Share ${code} with a friend — they'll race the same 60-second round you played.`);
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.container}>
        <Pressable onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← back</Text>
        </Pressable>

        <Text style={s.title}>CHALLENGE</Text>

        {/* Send a challenge ─────────────────────────────────────────────── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Your challenge code</Text>
          <Text style={s.cardSub}>
            Share with a friend. They race the same 60-second set you played.
            Compare scores when they finish.
          </Text>

          <View style={s.codeBox}>
            <Text style={s.code}>{code}</Text>
          </View>

          {/* Copy — primary 3D button */}
          <Pressable style={s.btn} onPress={copyCode}>
            <View style={[s.btnShadow, copied && s.btnShadowOk]} />
            <View style={[s.btnFace, copied && s.btnFaceOk]}>
              <Text style={[s.btnText, copied && s.btnTextOk]}>
                {copied ? 'COPIED ✓' : 'COPY CODE'}
              </Text>
            </View>
          </Pressable>

          <Pressable style={s.linkBtn} onPress={() => router.replace('/game')}>
            <Text style={s.linkBtnText}>play this challenge yourself →</Text>
          </Pressable>
        </View>

        {/* Join a challenge ─────────────────────────────────────────────── */}
        <View style={s.card}>
          <Text style={s.cardTitle}>Join a challenge</Text>
          <Text style={s.cardSub}>Got a code from a friend? Enter it here.</Text>

          <TextInput
            style={s.input}
            value={inputCode}
            onChangeText={v => setInputCode(v.toUpperCase().replace(/[^A-Z0-9]/g, ''))}
            placeholder="A1B2C3"
            maxLength={6}
            autoCapitalize="characters"
            placeholderTextColor={Colors.ink + '33'}
          />

          <Pressable
            style={[s.btn, inputCode.length < 6 && s.btnDisabled]}
            disabled={inputCode.length < 6}
            onPress={() => router.push('/game')}
          >
            <View style={s.btnShadow} />
            <View style={s.btnFace}>
              <Text style={s.btnText}>PLAY CHALLENGE</Text>
            </View>
          </Pressable>
        </View>

        <Text style={s.note}>
          Live challenge tracking (sender's ghost, weekly league credit){'\n'}
          arrives with Phase 4. For now, compare scores manually.
        </Text>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const BTN_H = 52;

const s = StyleSheet.create({
  // Transparent — global Sunburst + Halftone in root _layout.tsx show through.
  safe: { flex: 1, backgroundColor: 'transparent' },
  container: { flex: 1, padding: 20, paddingTop: 28, gap: 18 },

  back: { marginBottom: -4 },
  backText: { fontFamily: Fonts.mono, fontSize: 13, color: Colors.ink, opacity: 0.6 },

  title: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.red,
    letterSpacing: 1,
  },

  // Cream card with ink border — same shape as Profile cards.
  card: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 18,
    gap: 12,
  },
  cardTitle: {
    fontFamily: Fonts.black,
    fontSize: 17,
    color: Colors.ink,
  },
  cardSub: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.6,
    lineHeight: 19,
  },

  // Code display
  codeBox: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
    paddingVertical: 18,
    alignItems: 'center',
  },
  code: {
    fontFamily: Fonts.black,
    fontSize: 36,
    letterSpacing: 8,
    color: Colors.red,
  },

  // 3D primary button (matches Profile / Avatar pattern)
  btn: { position: 'relative', height: BTN_H + CARD_DEPTH },
  btnShadow: {
    position: 'absolute',
    left: 0, right: 0, top: CARD_DEPTH, height: BTN_H,
    backgroundColor: Colors.ink,
    borderRadius: Radius.sm,
  },
  btnShadowOk: { backgroundColor: '#1a4a2a' },
  btnFace: {
    position: 'absolute',
    left: 0, right: 0, top: 0, height: BTN_H,
    backgroundColor: Colors.red,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnFaceOk: { backgroundColor: '#22c55e' },
  btnText: {
    fontFamily: Fonts.black,
    fontSize: 15,
    color: Colors.cream,
    letterSpacing: 1,
  },
  btnTextOk: { color: Colors.cream },
  btnDisabled: { opacity: 0.35 },

  linkBtn: { alignItems: 'center', paddingVertical: 4 },
  linkBtnText: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.6,
  },

  // Code input
  input: {
    backgroundColor: Colors.white,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 14,
    fontFamily: Fonts.black,
    fontSize: 26,
    letterSpacing: 8,
    textAlign: 'center',
    color: Colors.ink,
  },

  note: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.45,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
  },
});
