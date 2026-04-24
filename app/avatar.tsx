// avatar.tsx — "Your Brain" builder screen
//
// Mothership Part 3, Avatar system (decided 2026-04-24):
//   Three components: brain colour, eyes, mouth. Antenna is fixed brand identity.
//   Free base kit: 4 colours × 4 eyes × 4 mouths (64 combos).
//   Pro tier: 4 additional per component (8 per component, 512 combos total).
//   Locked Pro items are visible but not selectable for free users.
//   "Earned through play" unlocks deferred to Phase 3.

import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Avatar } from '@/components/Avatar';
import { useAppStore } from './store';
import { Colors, Fonts, Radius } from '@/constants/theme';

// ─── Option catalogue (tiered) ───────────────────────────────────────────────

interface ColorOption { id: string; label: string; }
interface GlyphOption { id: string; glyph: string; }

const FREE_COLORS: ColorOption[] = [
  { id: '#FF6B9D', label: 'Pink'   },
  { id: '#6B9DFF', label: 'Blue'   },
  { id: '#6BDB6B', label: 'Green'  },
  { id: '#FFB86B', label: 'Orange' },
];

const PRO_COLORS: ColorOption[] = [
  { id: '#B86BFF', label: 'Purple' },
  { id: '#FFD700', label: 'Gold'   },
  { id: '#40E0D0', label: 'Teal'   },
  { id: '#FF4D4D', label: 'Ember'  },
];

const FREE_EYES: GlyphOption[] = [
  { id: 'round',  glyph: '◉  ◉' },
  { id: 'square', glyph: '▪  ▪' },
  { id: 'sleepy', glyph: '—  —' },
  { id: 'wink',   glyph: '◉  _' },
];

const PRO_EYES: GlyphOption[] = [
  { id: 'stars',  glyph: '✦  ✦' },
  { id: 'dots',   glyph: '·  ·' },
  { id: 'wide',   glyph: '◎  ◎' },
  { id: 'closed', glyph: '‿  ‿' },
];

const FREE_MOUTHS: GlyphOption[] = [
  { id: 'smile',   glyph: '∪' },
  { id: 'neutral', glyph: '—' },
  { id: 'smirk',   glyph: '⌢' },
  { id: 'ohh',     glyph: 'o' },
];

const PRO_MOUTHS: GlyphOption[] = [
  { id: 'grin',   glyph: '‿' },
  { id: 'tongue', glyph: 'ᴗ' },
  { id: 'flat',   glyph: '▬' },
  { id: 'open',   glyph: 'O' },
];

// Pro access — hardcoded false until the Pro purchase flow lands.
// When Pro is wired up, pull from useAppStore(). Locked items remain visible
// but not selectable for free users — "pay to see not pay to participate".
const IS_PRO = false;

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function AvatarScreen() {
  const router = useRouter();
  const { avatar, updateAvatar } = useAppStore();
  const [local, setLocal] = useState({ ...avatar });

  function save() {
    updateAvatar(local);
    router.back();
  }

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView
        contentContainerStyle={s.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity onPress={() => router.back()} style={s.back}>
          <Text style={s.backText}>← back</Text>
        </TouchableOpacity>

        <Text style={s.title}>YOUR BRAIN</Text>

        {/* Preview */}
        <View style={s.preview}>
          <Avatar color={local.color} eyes={local.eyes} mouth={local.mouth} size={120} />
        </View>

        {/* Colour ─────────────────────────────────────────────────── */}
        <SectionHeader label="Colour" />
        <View style={s.card}>
          <TierLabel>free</TierLabel>
          <View style={s.colorRow}>
            {FREE_COLORS.map(c => (
              <ColorChip
                key={c.id}
                color={c.id}
                selected={local.color === c.id}
                locked={false}
                onPress={() => setLocal(l => ({ ...l, color: c.id }))}
              />
            ))}
          </View>

          <TierLabel pro>pro</TierLabel>
          <View style={s.colorRow}>
            {PRO_COLORS.map(c => (
              <ColorChip
                key={c.id}
                color={c.id}
                selected={local.color === c.id}
                locked={!IS_PRO}
                onPress={() => IS_PRO && setLocal(l => ({ ...l, color: c.id }))}
              />
            ))}
          </View>
        </View>

        {/* Eyes ───────────────────────────────────────────────────── */}
        <SectionHeader label="Eyes" />
        <View style={s.card}>
          <TierLabel>free</TierLabel>
          <View style={s.optionRow}>
            {FREE_EYES.map(e => (
              <GlyphChip
                key={e.id}
                glyph={e.glyph}
                selected={local.eyes === e.id}
                locked={false}
                onPress={() => setLocal(l => ({ ...l, eyes: e.id }))}
              />
            ))}
          </View>

          <TierLabel pro>pro</TierLabel>
          <View style={s.optionRow}>
            {PRO_EYES.map(e => (
              <GlyphChip
                key={e.id}
                glyph={e.glyph}
                selected={local.eyes === e.id}
                locked={!IS_PRO}
                onPress={() => IS_PRO && setLocal(l => ({ ...l, eyes: e.id }))}
              />
            ))}
          </View>
        </View>

        {/* Mouth ──────────────────────────────────────────────────── */}
        <SectionHeader label="Mouth" />
        <View style={s.card}>
          <TierLabel>free</TierLabel>
          <View style={s.optionRow}>
            {FREE_MOUTHS.map(m => (
              <GlyphChip
                key={m.id}
                glyph={m.glyph}
                selected={local.mouth === m.id}
                locked={false}
                onPress={() => setLocal(l => ({ ...l, mouth: m.id }))}
              />
            ))}
          </View>

          <TierLabel pro>pro</TierLabel>
          <View style={s.optionRow}>
            {PRO_MOUTHS.map(m => (
              <GlyphChip
                key={m.id}
                glyph={m.glyph}
                selected={local.mouth === m.id}
                locked={!IS_PRO}
                onPress={() => IS_PRO && setLocal(l => ({ ...l, mouth: m.id }))}
              />
            ))}
          </View>
        </View>

        {/* Note about earned items */}
        <Text style={s.footnote}>
          more items unlock as you play. Pro adds 4 more per component.
        </Text>

        {/* Save */}
        <TouchableOpacity style={s.saveButton} onPress={save}>
          <Text style={s.saveButtonText}>save</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Subcomponents ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return <Text style={s.sectionLabel}>{label.toUpperCase()}</Text>;
}

function TierLabel({ children, pro }: { children: string; pro?: boolean }) {
  return (
    <Text style={[s.tierLabel, pro && s.tierLabelPro]}>
      {children.toUpperCase()}
    </Text>
  );
}

function ColorChip({
  color, selected, locked, onPress,
}: {
  color: string; selected: boolean; locked: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={locked ? 1 : 0.7}
      onPress={onPress}
      style={[
        s.colorChip,
        { backgroundColor: color },
        selected && s.colorChipSelected,
        locked && s.chipLocked,
      ]}
    >
      {locked && <Text style={s.lockGlyph}>🔒</Text>}
    </TouchableOpacity>
  );
}

function GlyphChip({
  glyph, selected, locked, onPress,
}: {
  glyph: string; selected: boolean; locked: boolean; onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={locked ? 1 : 0.7}
      onPress={onPress}
      style={[
        s.optionChip,
        selected && s.optionSelected,
        locked && s.chipLocked,
      ]}
    >
      <Text style={[s.optionText, selected && s.optionTextSelected]}>
        {locked ? '🔒' : glyph}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Styles (Cream Stadium) ──────────────────────────────────────────────────

const s = StyleSheet.create({
  // Transparent — global Sunburst + Halftone from root _layout.tsx show through.
  safe:   { flex: 1, backgroundColor: 'transparent' },
  scroll: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 48, gap: 10 },

  back:     { alignSelf: 'flex-start', paddingVertical: 6 },
  backText: { fontFamily: Fonts.mono, fontSize: 13, color: Colors.ink, opacity: 0.6 },

  title: {
    fontFamily: Fonts.black, fontSize: 28,
    color: Colors.red, letterSpacing: 1,
  },

  preview: { alignItems: 'center', paddingVertical: 6 },

  sectionLabel: {
    fontFamily: Fonts.mono, fontSize: 10,
    color: Colors.ink, opacity: 0.45,
    letterSpacing: 2, textTransform: 'uppercase', marginTop: 8,
  },

  card: {
    backgroundColor: Colors.cream,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    padding: 14,
    gap: 10,
  },

  tierLabel: {
    fontFamily: Fonts.mono, fontSize: 9,
    letterSpacing: 2, color: Colors.ink, opacity: 0.5,
  },
  tierLabelPro: { color: Colors.red, opacity: 1 },

  // Colour chips
  colorRow: { flexDirection: 'row', gap: 12, flexWrap: 'wrap' },
  colorChip: {
    width: 44, height: 44, borderRadius: 22,
    borderWidth: 2, borderColor: Colors.ink,
    alignItems: 'center', justifyContent: 'center',
  },
  colorChipSelected: { borderWidth: 4, borderColor: Colors.ink },

  // Glyph (eyes/mouths) chips
  optionRow: { flexDirection: 'row', gap: 8 },
  optionChip: {
    flex: 1,
    backgroundColor: Colors.cream,
    borderWidth: 2, borderColor: Colors.ink,
    paddingVertical: 14,
    borderRadius: Radius.sm,
    alignItems: 'center',
  },
  optionSelected: { backgroundColor: Colors.yellow },
  optionText:         { fontFamily: Fonts.mono, fontSize: 18, color: Colors.ink },
  optionTextSelected: { fontWeight: '700' },

  // Locked overlay
  chipLocked: { opacity: 0.5 },
  lockGlyph:  { fontSize: 14 },

  footnote: {
    fontFamily: Fonts.mono, fontSize: 11,
    color: Colors.ink, opacity: 0.45,
    textAlign: 'center', fontStyle: 'italic', marginTop: 4,
  },

  saveButton: {
    backgroundColor: Colors.red,
    paddingVertical: 16,
    borderRadius: Radius.card,
    borderWidth: 3,
    borderColor: Colors.ink,
    alignItems: 'center',
    marginTop: 12,
  },
  saveButtonText: {
    fontFamily: Fonts.black, color: Colors.cream,
    fontSize: 16, letterSpacing: 1,
  },
});
