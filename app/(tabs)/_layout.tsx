import { Tabs } from 'expo-router';
import React from 'react';

import { TokenTabBar } from '@/components/TokenTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TokenTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home' }} />
      <Tabs.Screen name="inbox"   options={{ title: 'League' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
