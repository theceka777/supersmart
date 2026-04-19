// InviteFriendsChip.tsx — dashed-border invite nudge with "+1 play each" incentive.
// Ported from InviteFriendsChip (no-friends state) in home.jsx.

import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Fonts } from '@/constants/theme';

interface Props {
  onPress?: () => void;
}

export function InviteFriendsChip({ onPress }: Props) {
  return (
    <Pressable onPress={onPress} style={s.container}>
      <View style={s.left}>
        <View style={s.plusCircle}>
          <Text style={s.plusText}>+</Text>
        </View>
        <Text style={s.label}>Invite friends</Text>
      </View>
      <View style={s.badge}>
        <Text style={s.badgeText}>+1 play each</Text>
      </View>
    </Pressable>
  );
}

const s = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.ink,
    borderStyle: 'dashed',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    opacity: 0.85,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  plusCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  plusText: {
    fontFamily: Fonts.black,
    fontSize: 10,
    color: Colors.ink,
    lineHeight: 12,
  },
  label: {
    fontFamily: Fonts.mono,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.ink,
    fontWeight: '700',
  },
  badge: {
    backgroundColor: Colors.ink,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 4,
    flexShrink: 0,
  },
  badgeText: {
    fontFamily: Fonts.mono,
    fontSize: 8,
    letterSpacing: 0.8,
    color: Colors.cream,
    textTransform: 'uppercase',
  },
});
