import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Crown } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
  size?: 'small' | 'medium' | 'large';
}

export default function PremiumBadge({ size = 'medium' }: Props) {
  const getSize = () => {
    switch (size) {
      case 'small':
        return { iconSize: 12, fontSize: 10, padding: 6 };
      case 'large':
        return { iconSize: 20, fontSize: 14, padding: 12 };
      default:
        return { iconSize: 16, fontSize: 12, padding: 8 };
    }
  };

  const { iconSize, fontSize, padding } = getSize();

  return (
    <LinearGradient
      colors={['#FFD700', '#FFA500']}
      style={[styles.badge, { padding }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Crown size={iconSize} color="#ffffff" strokeWidth={2.5} />
      <Text style={[styles.text, { fontSize }]}>Premium</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    gap: 4,
  },
  text: {
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
  },
});