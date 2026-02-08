import { Ionicons } from '@expo/vector-icons';
import { Tabs, usePathname, useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  // Root Back Button Integration
  useEffect(() => {
    const backAction = () => {
      if (pathname === '/(tabs)/home' || pathname === '/home') {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [pathname]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#FFFFFF',
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 0.5,
          borderTopColor: '#333',
          height: Platform.OS === 'ios' ? 88 + insets.bottom : 70 + insets.bottom,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '600',
          marginTop: 2,
          fontFamily: 'Inter_600SemiBold', // Assuming you have this font, otherwise system font
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "home" : "home-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "compass" : "compass-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "car" : "car-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="active"
        options={{
          title: 'Active',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "flash" : "flash-outline"} color={color} />,
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: 'Account',
          tabBarIcon: ({ color, focused }) => <Ionicons size={24} name={focused ? "person" : "person-outline"} color={color} />,
        }}
      />
      {/* Hide explore/index if they exist or just rely on file based routing matching these names */}
    </Tabs>
  );
}
