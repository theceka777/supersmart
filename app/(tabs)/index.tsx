import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from '@/app/store';

const FREE_LIMIT = 7;

const WANT_MORE_REPLIES = [
  'want more?',
  'maybe',
  'said maybe',
  'patience',
  'i said maybe',
  'still maybe',
  'we\'re not not saying yes',
  '...',
];

const ONE_MORE_LINES = [
  'no ads. No Ads. NO ADS.',
  'one more can\'t hurt. One More Can\'t Hurt. ONE MORE CAN\'T HURT.',
  'real Pavlovian, huh?',
  'we could\'ve shown you an ad just now. we didn\'t.',
  'could\'ve just gotten the Pro pack.',
  'you\'re still here. so are we.',
  'ok this is getting impressive.',
  'honestly, at this point we\'re friends.',
  'the Pro pack is $4.99. just saying.',
  'we\'ve stopped judging. seriously.',
  'just one more. Just One More. JUST ONE MORE.',
  'this is fine. This Is Fine. THIS IS FINE.',
];

export default function HomeScreen() {
  const router = useRouter();
  const { highScores, avatar, freePlay, recordPlay, tapOneMore } = useAppStore();
  const [wantMoreIndex, setWantMoreIndex] = useState(0);
  const [copyIndex, setCopyIndex] = useState(0);

  const today = new Date().toISOString().split('T')[0];
  const playsToday = freePlay.date === today ? freePlay.playsToday : 0;
  const oneMoreTaps = freePlay.date === today ? freePlay.oneMoreTaps : 0;
  const ONE_MORE_LIMIT = 3;
  const totalAllowed = FREE_LIMIT + oneMoreTaps * 3;
  const playsLeft = Math.max(0, totalAllowed - playsToday);
  const isGated = playsLeft === 0;
  const isProWall = isGated && oneMoreTaps >= ONE_MORE_LIMIT;

  function startGame(route: string) {
    router.push(route as any);
  }

  function handleFunStrip() {
    setCopyIndex(i => (i + 1) % ONE_MORE_LINES.length);
  }

  function handleOneMore() {
    if (isProWall) return;
    tapOneMore();
    setCopyIndex(i => (i + 1) % ONE_MORE_LINES.length);
  }

  const currentCopyLine = ONE_MORE_LINES[copyIndex];

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
        <TouchableOpacity
          style={[styles.primaryButton, isGated && styles.buttonDisabled]}
          onPress={() => !isGated && startGame('/game')}
          disabled={isGated}
        >
          <Text style={styles.primaryButtonText}>ARCADE</Text>
          <Text style={styles.buttonSub}>60 seconds · beat your best</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={[styles.secondaryButton, isGated && styles.buttonDisabled]}
            onPress={() => !isGated && startGame('/classic')}
            disabled={isGated}
          >
            <Text style={styles.secondaryButtonText}>CLASSIC</Text>
            <Text style={styles.buttonSubDark}>3 strikes · 10s</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.secondaryButton, isGated && styles.buttonDisabled]}
            onPress={() => !isGated && startGame('/daily')}
            disabled={isGated}
          >
            <Text style={styles.secondaryButtonText}>DAILY</Text>
            <Text style={styles.buttonSubDark}>10 questions · everyone plays</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Free play strip — only visible at ≤3 plays left */}
      {playsLeft === 3 && (
        <Text style={styles.stripInfo}>3 games left today</Text>
      )}

      {playsLeft === 2 && (
        <View style={styles.stripRow}>
          <Text style={styles.stripInfo}>2 games left  </Text>
          <TouchableOpacity onPress={() => setWantMoreIndex(i => Math.min(i + 1, WANT_MORE_REPLIES.length - 1))}>
            <Text style={styles.stripSoft}>
              {WANT_MORE_REPLIES[wantMoreIndex]}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {playsLeft === 1 && (
        <TouchableOpacity onPress={handleFunStrip}>
          <Text style={styles.stripOneMore}>one more turn!</Text>
          {copyIndex > 0 && (
            <Text style={styles.stripCopy}>{currentCopyLine}</Text>
          )}
        </TouchableOpacity>
      )}

      {isGated && !isProWall && (
        <TouchableOpacity style={styles.gateButton} onPress={handleOneMore}>
          <Text style={styles.gateButtonText}>one more turn!</Text>
          <Text style={styles.gateCopy}>{currentCopyLine}</Text>
        </TouchableOpacity>
      )}

      {isProWall && (
        <View style={styles.proWall}>
          <Text style={styles.proWallHook}>ok. you've broken us.</Text>
          <Text style={styles.proWallTitle}>Super Smart Pro — $4.99</Text>
          <Text style={styles.proWallSub}>
            one time. no subscription.{'\n'}
            no ads (you know we don't do that).{'\n'}
            the whole game. forever.
          </Text>
          <TouchableOpacity style={styles.proWallButton}>
            <Text style={styles.proWallButtonText}>get Super Smart Pro</Text>
          </TouchableOpacity>
          <Text style={styles.proWallFooter}>we think you've earned it honestly.</Text>
        </View>
      )}

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
  buttonDisabled: {
    opacity: 0.35,
  },
  stripInfo: {
    fontSize: 13,
    color: '#9ca3af',
    fontWeight: '600',
  },
  stripRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stripSoft: {
    fontSize: 13,
    color: '#d1d5db',
    fontStyle: 'italic',
  },
  stripOneMore: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '700',
    textAlign: 'center',
  },
  stripCopy: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 3,
  },
  gateButton: {
    alignItems: 'center',
    paddingVertical: 4,
  },
  gateButtonText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#dc2626',
  },
  gateCopy: {
    fontSize: 12,
    color: '#9ca3af',
    fontStyle: 'italic',
    marginTop: 3,
    textAlign: 'center',
  },
  proWall: {
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
  },
  proWallHook: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  proWallTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#dc2626',
  },
  proWallSub: {
    fontSize: 13,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  proWallButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 14,
    marginTop: 4,
  },
  proWallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '800',
  },
  proWallFooter: {
    fontSize: 12,
    color: '#d1d5db',
    fontStyle: 'italic',
    marginTop: 2,
  },
});
