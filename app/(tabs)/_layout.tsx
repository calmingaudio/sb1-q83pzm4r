import React from 'react';
import { View, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Chrome as Home, Wind, BookOpen, BookType, OctagonAlert as AlertOctagon } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textSecondary,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: Colors.light.border,
          elevation: 0,
          shadowOpacity: 0,
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: Platform.OS === 'ios' ? 8 : 0,
        },
        tabBarLabelStyle: {
          fontFamily: 'Inter-Regular',
          fontSize: 12,
          marginTop: Platform.OS === 'ios' ? 0 : -4,
        },
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="breathe"
        options={{
          title: 'Breathe',
          tabBarIcon: ({ color, size }) => (
            <Wind size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          title: 'SOS',
          tabBarIcon: ({ color }) => (
            <View style={{
              backgroundColor: '#ef4444',
              width: Platform.OS === 'ios' ? 50 : 60,
              height: Platform.OS === 'ios' ? 50 : 60,
              borderRadius: 30,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: Platform.OS === 'ios' ? 25 : 30,
              borderWidth: 3,
              borderColor: '#ffffff',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
              <AlertOctagon size={26} color="#ffffff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: ({ color, size }) => (
            <BookOpen size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: ({ color, size }) => (
            <BookType size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}