// app/(tabs)/_layout.tsx
import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, Wind, Shield, PenTool, Music } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <Tabs
        initialRouteName="home"
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textSecondary,
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopWidth: 0,
            elevation: 0,
            height: Platform.OS === 'ios' ? 88 : 70,
            paddingBottom: Platform.OS === 'ios' ? 28 : 12,
            paddingTop: Platform.OS === 'ios' ? 8 : 12,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            shadowColor: colors.text,
            shadowOffset: { width: 0, height: -4 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
          },
          tabBarLabelStyle: {
            display: 'none', // Hide all tab labels
          },
          headerShown: false,
          tabBarItemStyle: {
            paddingVertical: 4,
          },
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        {/* Hidden index screen for navigation */}
        <Tabs.Screen
          name="index"
          options={{
            href: null, // This hides it from the tab bar
          }}
        />
        <Tabs.Screen
          name="home"
          options={{
            title: '', // Remove title
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? `${colors.primary}15` : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginTop: 4,
              }}>
                <Home size={size - 2} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="breathe"
          options={{
            title: '', // Remove title
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? `${colors.primary}15` : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginTop: 4,
              }}>
                <Wind size={size - 2} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="sos"
          options={{
            title: '', // Remove title
            tabBarIcon: ({ color, focused }) => (
              <View style={{
                backgroundColor: '#ef4444',
                width: Platform.OS === 'ios' ? 56 : 64,
                height: Platform.OS === 'ios' ? 56 : 64,
                borderRadius: 28,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Platform.OS === 'ios' ? 20 : 25,
                borderWidth: 4,
                borderColor: colors.card,
                shadowColor: '#ef4444',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}>
                <Shield size={28} color="#ffffff" strokeWidth={2.5} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="music"
          options={{
            title: '', // Remove title
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? `${colors.primary}15` : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginTop: 4,
              }}>
                <Music size={size - 2} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="journal"
          options={{
            title: '', // Remove title
            tabBarIcon: ({ color, size, focused }) => (
              <View style={{
                backgroundColor: focused ? `${colors.primary}15` : 'transparent',
                borderRadius: 12,
                padding: 8,
                marginTop: 4,
              }}>
                <PenTool size={size - 2} color={color} strokeWidth={focused ? 2.5 : 2} />
              </View>
            ),
          }}
        />
      </Tabs>
    </View>
  );
}