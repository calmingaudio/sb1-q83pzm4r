import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/components/ThemeProvider';

interface BackButtonProps {
  color?: string;
  onPress?: () => void;
}

export default function BackButton({ color, onPress }: BackButtonProps) {
  const { colors } = useTheme();
  
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity 
      style={styles.backButton}
      onPress={handlePress}
    >
      <ArrowLeft size={24} color={color || colors.text} strokeWidth={2.5} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    padding: 8,
    borderRadius: 12,
  },
}); 