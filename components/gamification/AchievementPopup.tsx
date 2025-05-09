import React from 'react';
import { View, Text, StyleSheet, Animated, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { Achievement } from '@/constants/Achievements';

interface Props {
  achievement: Achievement;
  onHide: () => void;
}

export default function AchievementPopup({ achievement, onHide }: Props) {
  const translateY = new Animated.Value(-100);
  const opacity = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(3000),
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    ]).start(() => onHide());
  }, []);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateY }],
          opacity,
        },
      ]}>
      <View style={styles.content}>
        <Text style={styles.icon}>{achievement.icon}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{achievement.title}</Text>
          <Text style={styles.description}>{achievement.description}</Text>
        </View>
        <View style={styles.pointsContainer}>
          <Text style={styles.points}>+{achievement.points}</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    right: 20,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  pointsContainer: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  points: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
});