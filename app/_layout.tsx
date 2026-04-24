import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFonts } from 'expo-font';
import { View } from 'react-native';
import 'react-native-reanimated';

// @expo-google-fonts — install with:
// npx expo install react-native-svg @expo-google-fonts/archivo-black @expo-google-fonts/jetbrains-mono
import { ArchivoBlack_400Regular } from '@expo-google-fonts/archivo-black';
import {
  JetBrainsMono_500Medium,
  JetBrainsMono_700Bold,
} from '@expo-google-fonts/jetbrains-mono';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { AppProvider } from './store';
import { Colors } from '@/constants/theme';
import { Sunburst } from '@/components/Sunburst';
import { Halftone } from '@/components/Halftone';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    ArchivoBlack:        ArchivoBlack_400Regular,
    JetBrainsMono:       JetBrainsMono_500Medium,
    'JetBrainsMono-Bold': JetBrainsMono_700Bold,
  });

  // Hold splash until fonts are ready
  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: Colors.background }} />;
  }

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {/* Global background — Sunburst + Halftone render once, behind every screen.
            Mothership decision 2026-04-19 session 7: promoted from home-only to global.
            Individual screens should keep their SafeAreaView transparent so this shows through. */}
        <View style={{ flex: 1, backgroundColor: Colors.background }}>
          <Sunburst rays={24} color="#FFD6A8" opacity={0.45} size={700} />
          <Halftone color="rgba(26,21,34,0.07)" dotSpacing={9} />
          <Stack screenOptions={{ contentStyle: { backgroundColor: 'transparent' } }}>
            <Stack.Screen name="(tabs)"    options={{ headerShown: false }} />
            <Stack.Screen name="game"      options={{ headerShown: false }} />
            <Stack.Screen name="daily"     options={{ headerShown: false }} />
            <Stack.Screen name="echo"      options={{ headerShown: false }} />
            <Stack.Screen name="challenge" options={{ headerShown: false }} />
            <Stack.Screen name="avatar"    options={{ headerShown: false }} />
            <Stack.Screen name="end"       options={{ headerShown: false }} />
            <Stack.Screen name="modal"     options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
        </View>
        <StatusBar style="dark" backgroundColor={Colors.background} />
      </ThemeProvider>
    </AppProvider>
  );
}
