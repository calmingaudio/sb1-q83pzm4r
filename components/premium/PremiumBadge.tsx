import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Crown } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';

interface Props {
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
  showCrown?: boolean;
  label?: string;
  style?: any;
}

export default function PremiumBadge({ 
  onPress, 
  size = 'medium', 
  showCrown = true,
  label = 'Premium',
  style 
}: Props) {
  const { colors } = useTheme();

  const getSize = () => {
    switch (size) {
      case 'small':
        return {
          height: 24,
          fontSize: 10,
          iconSize: 12,
          paddingHorizontal: 8,
        };
      case 'large':
        return {
          height: 40,
          fontSize: 16,
          iconSize: 20,
          paddingHorizontal: 16,
        };
      default: // medium
        return {
          height: 32,
          fontSize: 13,
          iconSize: 16,
          paddingHorizontal: 12,
        };
    }
  };

  const sizeConfig = getSize();
  const styles = createStyles(colors, sizeConfig);

  const Badge = () => (
    <LinearGradient
      colors={['#FFD700', '#FFA500', '#FF6B35']}
      style={[styles.badge, style]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {showCrown && (
        <Crown 
          size={sizeConfig.iconSize} 
          color="#ffffff" 
          strokeWidth={2.5} 
          style={styles.icon}
        />
      )}
      <Text style={styles.text}>{label}</Text>
    </LinearGradient>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.touchable}>
        <Badge />
      </TouchableOpacity>
    );
  }

  return <Badge />;
}

const createStyles = (colors: any, size: { 
  height: number; 
  paddingHorizontal: number;
  fontSize: number;
  iconSize: number;
}) => 
  StyleSheet.create({
    touchable: {
      borderRadius: size.height / 2,
      overflow: 'hidden',
      backgroundColor: '#FFD700', // Add solid background color for shadow calculation
      ...Platform.select({
        ios: {
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
        android: {
          elevation: 4,
        },
        web: {
          shadowColor: '#FFD700',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 4,
        },
      }),
    },
    badge: {
      height: size.height,
      paddingHorizontal: size.paddingHorizontal,
      borderRadius: size.height / 2,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    icon: {
      marginRight: 4,
    },
    text: {
      fontFamily: 'Inter-SemiBold',
      fontSize: size.fontSize,
      color: '#ffffff',
    },
  });