// app/(tabs)/_layout.tsx
import React from 'react';
import { View, Text, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { 
  Chrome as Home, 
  Wind, 
  BookOpen, 
  BookType, 
  OctagonAlert as AlertOctagon 
} from 'lucide-react-native';
import Colors from '@/constants/Colors';

// Type definitions for tab icon props
interface TabIconProps {
  color: string;
  size: number;
}

interface FocusedTabIconProps {
  focused: boolean;
}

export default function TabLayout() {
  const renderSOSIcon = ({ focused }: FocusedTabIconProps) => {
    const isIOS = Platform.OS === 'ios';
    const isWeb = Platform.OS === 'web';

    const iconSize = isIOS || isWeb ? 50 : 60;
    const iconBorderRadius = iconSize / 2;
    const containerMarginBottom = isIOS || isWeb ? 25 : 30;

    return (
      <View
        style={{
          alignItems: 'center',
          marginBottom: containerMarginBottom,
        }}
      >
        {/* The Circular Icon */}
        <View
          style={{
            width: iconSize,
            height: iconSize,
            borderRadius: iconBorderRadius,
            backgroundColor: '#ef4444',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 3,
            borderColor: '#ffffff',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <AlertOctagon size={26} color="#ffffff" />
        </View>
        <Text
          style={{
            fontFamily: 'Inter-Regular',
            fontSize: 12,
            color: focused
              ? Colors.light.primary
              : Colors.light.textSecondary,
            marginTop: 5,
          }}
        >
          SOS
        </Text>
      </View>
    );
  };

  const renderHomeIcon = ({ color, size }: TabIconProps) => (
    <Home size={size} color={color} />
  );

  const renderBreatheIcon = ({ color, size }: TabIconProps) => (
    <Wind size={size} color={color} />
  );

  const renderLearnIcon = ({ color, size }: TabIconProps) => (
    <BookOpen size={size} color={color} />
  );

  const renderJournalIcon = ({ color, size }: TabIconProps) => (
    <BookType size={size} color={color} />
  );

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
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: renderHomeIcon,
        }}
      />
      <Tabs.Screen
        name="breathe"
        options={{
          title: 'Breathe',
          tabBarIcon: renderBreatheIcon,
        }}
      />
      <Tabs.Screen
        name="sos"
        options={{
          tabBarLabel: () => null,
          tabBarIcon: renderSOSIcon,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: 'Learn',
          tabBarIcon: renderLearnIcon,
        }}
      />
      <Tabs.Screen
        name="journal"
        options={{
          title: 'Journal',
          tabBarIcon: renderJournalIcon,
        }}
      />
    </Tabs>
  );
}