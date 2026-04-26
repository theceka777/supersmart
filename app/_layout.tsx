import { DefaultTheme, ThemeProvider, Theme } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import 'react-native-reanimated';

// @expo-google-fonts — install with:
// npx expo install react-native-svg @expo-google-fonts/archivo-black @expo-google-fonts/jetbrains-mono
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import { JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';

import { AppProvider, AppState, hydrateAppState } from './store';
import { Colors } from '@/constants/theme';
import { Sunburst } from '@/components/Sunburst';
import { Halftone } from '@/components/Halftone';

export const unstable_settings = {
  anchor: '(tabs)',
};

// Custom React Navigation theme with a transparent scene background.
// Super Smart 2026 is intentionally a light-only app (Cream Stadium palette —
// mothership Part 6). We do NOT follow the system colour scheme; if we did,
// DarkTheme would paint every screen near-black and cover the global
// Sunburst + Halftone we render behind the Stack.
const SuperSmartNavTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent', // lets the cream + sunburst + halftone show through
  },
};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    ArchivoBlack:  ArchivoBlack_400Regular,
    JetBrainsMono: JetBrainsMono_500Medium,
  });

  // Hydrate persisted state from AsyncStorage. Both fonts and hydration run
  // in parallel; render unblocks when both are done. AsyncStorage typically
  // resolves in 50–150ms, comfortably inside the splash window.
  const [hydratedState, setHydratedState] = useState<AppState | null>(null);
  useEffect(() => {
    hydrateAppState().then(setHydratedState);
  }, []);

  // Hold splash until fonts AND state are ready
  if (!fontsLoaded || !hydratedState) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  return (
    <AppProvider initialState={hydratedState}>
      <ThemeProvider value={SuperSmartNavTheme}>
        {/* Global background — Sunburst + Halftone render once, behind every screen.
            Mothership decision 2026-04-19 session 7: promoted from home-only to global.
            The cream base lives on this outer View; the nav theme + screens above are
            transparent so Sunburst + Halftone show through on every route. */}
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <Sunburst rays={24} color="#FFD6A8" opacity={0.45} size={700} />
          <Halftone color="rgba(26,21,34,0.07)" dotSpacing={9} />
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: 'transparent' },
            }}
          >
            <Stack.Screen name="(tabs)"    />
            <Stack.Screen name="game"      />
            <Stack.Screen name="daily"     />
            <Stack.Screen name="echo"      />
            <Stack.Screen name="challenge" />
            <Stack.Screen name="avatar"    />
            <Stack.Screen name="end"       />
          </Stack>
        </View>
        <StatusBar style="dark" backgroundColor={Colors.background} />
      </ThemeProvider>
    </AppProvider>
  );
}
