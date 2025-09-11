import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { Plane, Wind, Volume2, Shield, Armchair, Luggage, ClipboardList } from 'lucide-react-native';
import { FAQCategory } from '@/constants/LearnContent';
import Animated, { FadeInRight } from 'react-native-reanimated';

interface CategoryCardProps {
  category: FAQCategory;
  onPress: () => void;
  index: number;
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function CategoryCard({ category, onPress, index }: CategoryCardProps) {
  const getIcon = () => {
    switch (category.icon) {
      case 'plane':
        return <Plane size={28} color="#ffffff" />;
      case 'wind':
        return <Wind size={28} color="#ffffff" />;
      case 'volume-2':
        return <Volume2 size={28} color="#ffffff" />;
      case 'shield':
        return <Shield size={28} color="#ffffff" />;
      case 'armchair':
        return <Armchair size={28} color="#ffffff" />;
      case 'luggage':
        return <Luggage size={28} color="#ffffff" />;
      case 'clipboard-list':
        return <ClipboardList size={28} color="#ffffff" />;
      default:
        return <Plane size={28} color="#ffffff" />;
    }
  };
  
  return (
    <AnimatedTouchableOpacity 
      onPress={onPress}
      entering={FadeInRight.delay(index * 100).springify()}
    >
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.iconContainer}>
          {getIcon()}
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{category.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {category.description}
          </Text>
        </View>
      </LinearGradient>
    </AnimatedTouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginBottom: 16,
    backgroundColor: Colors.light.primary, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
    }),
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
});