// profile.tsx — Profile tab (replaces settings.tsx)
// Shows: avatar, personal bests (quickmatch + daily), Pro info, settings.
// Classic mode removed. "Daily Quiz" → "Daily Race". Cream Stadium design.

import { View, Text, ScrollView, Switch, StyleSheet, Pressable, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/app/store';
import { Avatar } from '@/components/Avatar';
import { Colors, Fonts, Radius, CARD_DEPTH } from '@/constants/theme';

// TODO: confirm support email per Appendix D #40 (support email domain).
// Primary candidate is the heritage-aligned address; fallback locked in v1.25.
const SUPPORT_EMAIL = 'support@iamsupersmart.com';

// ── Section label ─────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: string }) {
  return <Text style={s.sectionLabel}>{children}</Text>;
}

// ── Stat row (inside card) ────────────────────────────────────────────────────

function StatRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={s.statRow}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statValue}>{value}</Text>
    </View>
  );
}

// ── Screen ────────────────────────────────────────────────────────────────────

export default function ProfileScreen() {
  const router = useRouter();
  const { highScores, avatar } = useAppStore();

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >

        {/* Page title */}
        <Text style={s.title}>PROFILE</Text>

        {/* Avatar ─────────────────────────────────────────────────────── */}
        <SectionLabel>YOUR BRAIN</SectionLabel>

        <View style={s.avatarCard}>
          <Avatar
            color={avatar.color}
            eyes={avatar.eyes}
            mouth={avatar.mouth}
            size={88}
          />
          <View style={s.avatarInfo}>
            <Text style={s.avatarName}>canmert</Text>
            <Text style={s.avatarSub}>member since 2012</Text>
          </View>
          <Pressable style={s.editBtn} onPress={() => router.push('/avatar' as any)}>
            <View style={s.editBtnShadow} />
            <View style={s.editBtnFace}>
              <Text style={s.editBtnText}>EDIT</Text>
            </View>
          </Pressable>
        </View>

        {/* Personal Bests ──────────────────────────────────────────────── */}
        <SectionLabel>PERSONAL BESTS</SectionLabel>

        <View style={s.card}>
          <StatRow
            label="Quickmatch"
            value={highScores.quickmatch > 0 ? highScores.quickmatch.toLocaleString() : '—'}
          />
          <View style={s.divider} />
          <StatRow
            label="Daily Race"
            value={highScores.daily > 0 ? highScores.daily.toLocaleString() : '—'}
          />
        </View>

        {/* Settings ────────────────────────────────────────────────────── */}
        <SectionLabel>SETTINGS</SectionLabel>

        <View style={s.card}>
          <View style={s.settingRow}>
            <View style={s.settingInfo}>
              <Text style={s.settingTitle}>Sound Effects</Text>
              <Text style={s.settingSub}>coming in Phase 3</Text>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: Colors.ink + '22', true: Colors.red }}
              thumbColor={Colors.cream}
            />
          </View>
          <View style={s.divider} />
          <View style={s.settingRow}>
            <View style={s.settingInfo}>
              <Text style={s.settingTitle}>Push Notifications</Text>
              <Text style={s.settingSub}>new race, ghost activity</Text>
            </View>
            <Switch
              value={false}
              disabled
              trackColor={{ false: Colors.ink + '22', true: Colors.red }}
              thumbColor={Colors.cream}
            />
          </View>
        </View>

        {/* Pro ─────────────────────────────────────────────────────────── */}
        <SectionLabel>SUPER SMART PRO</SectionLabel>

        <View style={[s.card, s.proCard]}>
          <Text style={s.proTitle}>Super Smart Pro — $4.99</Text>
          <Text style={s.proSub}>
            one-time purchase. no subscription.{'\n'}no ads, ever.
          </Text>

          <View style={s.proFeatures}>
            {[
              'Unlimited rounds daily',
              'All seasonal question packs',
              'Premium avatar items',
              'Advanced stats + match history',
              'Pro badge on leaderboards',
            ].map(f => (
              <Text key={f} style={s.proFeature}>✓  {f}</Text>
            ))}
          </View>

          <View style={s.comingSoon}>
            <Text style={s.comingSoonText}>available at launch</Text>
          </View>
        </View>

        {/* Contact ─────────────────────────────────────────────────────── */}
        {/* Mothership v1.25 (2026-04-24): in place of an in-app
            "report this question" button, all player feedback flows through
            a single email link. One channel, framed as conversation. */}
        <SectionLabel>SUPPORT</SectionLabel>

        <Pressable
          onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`)}
          style={s.contactCard}
        >
          <View style={s.contactRow}>
            <View style={s.contactInfo}>
              <Text style={s.contactTitle}>Contact the developer</Text>
              <Text style={s.contactSub}>questions, bugs, broken trivia — write us</Text>
            </View>
            <Text style={s.contactArrow}>→</Text>
          </View>
        </Pressable>

        {/* Footer ──────────────────────────────────────────────────────── */}
        <Text style={s.version}>Super Smart 2026 · shell build · v0.2</Text>

      </ScrollView>
    </SafeAreaView>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  // Transparent — global Sunburst + Halftone from root _layout.tsx show through.
  safe: { flex: 1, backgroundColor: 'transparent' },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 48,
    gap: 10,
  },

  title: {
    fontFamily: Fonts.black,
    fontSize: 28,
    color: Colors.red,
    letterSpacing: 1,
    marginBottom: 4,
  },

  sectionLabel: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    color: Colors.ink,
    opacity: 0.45,
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginTop: 8,
  },

  // Avatar card
  avatarCard: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarInfo: { flex: 1 },
  avatarName: {
    fontFamily: Fonts.black,
    fontSize: 20,
    color: Colors.ink,
  },
  avatarSub: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.4,
    marginTop: 2,
  },

  // Edit button (3D, compact)
  editBtn: { position: 'relative', height: 40 + CARD_DEPTH, width: 72 },
  editBtnShadow: {
    position: 'absolute',
    left: 0, right: 0, top: CARD_DEPTH, height: 40,
    backgroundColor: Colors.ink,
    borderRadius: Radius.sm,
  },
  editBtnFace: {
    position: 'absolute',
    left: 0, right: 0, top: 0, height: 40,
    backgroundColor: Colors.yellow,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editBtnText: {
    fontFamily: Fonts.black,
    fontSize: 12,
    color: Colors.ink,
    letterSpacing: 0.5,
  },

  // Generic card
  card: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 16,
  },

  divider: {
    height: 1,
    backgroundColor: Colors.ink,
    opacity: 0.1,
    marginVertical: 8,
  },

  // Stat row
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  statLabel: {
    fontFamily: Fonts.mono,
    fontSize: 15,
    color: Colors.ink,
    opacity: 0.7,
  },
  statValue: {
    fontFamily: Fonts.black,
    fontSize: 18,
    color: Colors.red,
  },

  // Setting row
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  settingInfo: { flex: 1, marginRight: 12 },
  settingTitle: {
    fontFamily: Fonts.mono,
    fontSize: 15,
    color: Colors.ink,
  },
  settingSub: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.4,
    marginTop: 2,
  },

  // Pro card
  proCard: { gap: 10 },
  proTitle: {
    fontFamily: Fonts.black,
    fontSize: 18,
    color: Colors.ink,
  },
  proSub: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.6,
    lineHeight: 20,
  },
  proFeatures: { gap: 6, marginTop: 4 },
  proFeature: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    opacity: 0.75,
  },
  comingSoon: {
    backgroundColor: Colors.yellow,
    borderRadius: Radius.sm,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  comingSoonText: {
    fontFamily: Fonts.mono,
    fontSize: 13,
    color: Colors.ink,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  // Contact card
  contactCard: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 16,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactInfo: { flex: 1, marginRight: 12 },
  contactTitle: {
    fontFamily: Fonts.black,
    fontSize: 16,
    color: Colors.ink,
  },
  contactSub: {
    fontFamily: Fonts.mono,
    fontSize: 12,
    color: Colors.ink,
    opacity: 0.55,
    marginTop: 3,
  },
  contactArrow: {
    fontFamily: Fonts.black,
    fontSize: 22,
    color: Colors.red,
  },

  version: {
    fontFamily: Fonts.mono,
    fontSize: 11,
    color: Colors.ink,
    opacity: 0.2,
    textAlign: 'center',
    marginTop: 8,
  },
});
