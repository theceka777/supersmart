import { Tabs } from 'expo-router';
import React from 'react';

import { TokenTabBar } from '@/components/TokenTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <TokenTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        // Transparent scene so global Sunburst + Halftone (rendered in
        // root app/_layout.tsx) show through every tab.
        sceneStyle: { backgroundColor: 'transparent' },
      }}
    >
      <Tabs.Screen name="index"   options={{ title: 'Home' }} />
      <Tabs.Screen name="league"  options={{ title: 'League' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}
