import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Level } from '@/constants/Achievements';

interface Props {
  currentPoints: number;
  currentLevel: Level;
  nextLevel: Level;
}

export default function LevelProgress({ currentPoints, currentLevel, nextLevel }: Props) {
  const progress = ((currentPoints - currentLevel.pointsNeeded) / 
    (nextLevel.pointsNeeded - currentLevel.pointsNeeded)) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.levelInfo}>
        <View style={styles.currentLevel}>
          <Text style={styles.levelIcon}>{currentLevel.icon}</Text>
          <Text style={styles.levelTitle}>{currentLevel.title}</Text>
        </View>
        <Text style={styles.pointsText}>
          {currentPoints} / {nextLevel.pointsNeeded} points
        </Text>
      </View>
      
      <View style={styles.progressContainer}>
        <View style={[styles.progressBar, { width: `${progress}%` }]} />
      </View>
      
      <View style={styles.nextLevel}>
        <Text style={styles.nextLevelText}>Next: </Text>
        <Text style={styles.nextLevelIcon}>{nextLevel.icon}</Text>
        <Text style={styles.nextLevelTitle}>{nextLevel.title}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  levelInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  currentLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelIcon: {
    fontSize: 24,
    marginRight: 8,
  },
  levelTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
  },
  pointsText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  progressContainer: {
    height: 8,
    backgroundColor: Colors.light.backgroundSecondary,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.light.primary,
    borderRadius: 4,
  },
  nextLevel: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  nextLevelText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginRight: 4,
  },
  nextLevelIcon: {
    fontSize: 20,
    marginRight: 4,
  },
  nextLevelTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.text,
  },
});