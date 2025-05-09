import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/Colors';
import { Achievement } from '@/constants/Achievements';

interface Props {
  achievements: Achievement[];
  unlockedAchievements: string[];
}

export default function AchievementsList({ achievements, unlockedAchievements }: Props) {
  const sortedAchievements = [...achievements].sort((a, b) => {
    const aUnlocked = unlockedAchievements.includes(a.id);
    const bUnlocked = unlockedAchievements.includes(b.id);
    if (aUnlocked && !bUnlocked) return -1;
    if (!aUnlocked && bUnlocked) return 1;
    return 0;
  });

  return (
    <ScrollView style={styles.container}>
      {sortedAchievements.map((achievement) => {
        const isUnlocked = unlockedAchievements.includes(achievement.id);
        const isSecret = achievement.secret && !isUnlocked;

        return (
          <View key={achievement.id} style={styles.achievementCard}>
            <Text style={styles.achievementIcon}>
              {isSecret ? '❓' : achievement.icon}
            </Text>
            <View style={styles.achievementInfo}>
              <Text style={styles.achievementTitle}>
                {isSecret ? 'Secret Achievement' : achievement.title}
              </Text>
              <Text style={styles.achievementDescription}>
                {isSecret ? 'Keep exploring to unlock this achievement!' : achievement.description}
              </Text>
              <Text style={styles.achievementCondition}>
                {isUnlocked ? '✅ Completed!' : `🎯 ${achievement.condition}`}
              </Text>
            </View>
            <View style={[styles.points, !isUnlocked && styles.pointsLocked]}>
              <Text style={[styles.pointsText, !isUnlocked && styles.pointsTextLocked]}>
                +{achievement.points}
              </Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  achievementIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 4,
  },
  achievementDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  achievementCondition: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: Colors.light.primary,
  },
  points: {
    backgroundColor: Colors.light.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  pointsLocked: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  pointsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  pointsTextLocked: {
    color: Colors.light.textSecondary,
  },
});