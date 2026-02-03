import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold, Inter_900Black } from '@expo-google-fonts/inter';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/lib/cache';

import { useColorScheme } from '@/hooks/use-color-scheme';
import * as SystemUI from 'expo-system-ui';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY || 'pk_test_cmljaC1wb2xlY2F0LTc2LmNsZXJrLmFjY291bnRzLmRldiQ';

if (!publishableKey) {
  throw new Error('Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env');
}

// Set system UI background to black for maximum integration
SystemUI.setBackgroundColorAsync('#000000');

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });
  const [splashReady, setSplashReady] = useState(false);

  useEffect(() => {
    // Hide splash screen after 3 seconds regardless of font loading
    const timeout = setTimeout(() => {
      setSplashReady(true);
      SplashScreen.hideAsync();
    }, 3000);

    if (loaded) {
      clearTimeout(timeout);
      setSplashReady(true);
      SplashScreen.hideAsync();
    }

    return () => clearTimeout(timeout);
  }, [loaded]);

  if (!loaded && !splashReady) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <ThemeProvider value={DarkTheme}>
          <Stack>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="car/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="checkout/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="settings/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="active-trip/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="inspection/[id]" options={{ headerShown: false }} />
            <Stack.Screen name="admin-sign-in" options={{ headerShown: false }} />
            <Stack.Screen name="admin/dashboard" options={{ headerShown: false }} />
            <Stack.Screen name="admin/cars" options={{ headerShown: false }} />
            <Stack.Screen name="admin/bookings" options={{ headerShown: false }} />
            <Stack.Screen name="admin/analytics" options={{ headerShown: false }} />
          </Stack>
          <StatusBar style="light" />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
