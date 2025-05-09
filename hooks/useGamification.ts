import { useState, useEffect } from 'react';
import { achievements, levels, UserProgress, Achievement } from '@/constants/Achievements';

export function useGamification() {
  const [userProgress, setUserProgress] = useState<UserProgress>({
    points: 0,
    level: 1,
    achievements: [],
    streak: {
      current: 0,
      longest: 0,
      lastCheckIn: new Date().toISOString()
    }
  });

  const [showAchievement, setShowAchievement] = useState<Achievement | null>(null);

  const getCurrentLevel = () => {
    return levels.find(level => level.level === userProgress.level);
  };

  const getNextLevel = () => {
    return levels.find(level => level.level === userProgress.level + 1);
  };

  const checkLevelUp = (points: number) => {
    const nextLevel = levels.find(level => level.pointsNeeded > points);
    if (nextLevel && nextLevel.level > userProgress.level) {
      setUserProgress(prev => ({
        ...prev,
        level: nextLevel.level - 1
      }));
      // Could trigger level up celebration here
    }
  };

  const awardPoints = (points: number) => {
    setUserProgress(prev => {
      const newPoints = prev.points + points;
      checkLevelUp(newPoints);
      return {
        ...prev,
        points: newPoints
      };
    });
  };

  const unlockAchievement = (achievementId: string) => {
    const achievement = achievements.find(a => a.id === achievementId);
    if (achievement && !userProgress.achievements.includes(achievementId)) {
      setUserProgress(prev => ({
        ...prev,
        achievements: [...prev.achievements, achievementId]
      }));
      awardPoints(achievement.points);
      setShowAchievement(achievement);
    }
  };

  const updateStreak = () => {
    const today = new Date();
    const lastCheckIn = new Date(userProgress.streak.lastCheckIn);
    const daysSinceLastCheckIn = Math.floor((today.getTime() - lastCheckIn.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceLastCheckIn === 1) {
      // Consecutive day
      setUserProgress(prev => ({
        ...prev,
        streak: {
          current: prev.streak.current + 1,
          longest: Math.max(prev.streak.longest, prev.streak.current + 1),
          lastCheckIn: today.toISOString()
        }
      }));
    } else if (daysSinceLastCheckIn > 1) {
      // Streak broken
      setUserProgress(prev => ({
        ...prev,
        streak: {
          current: 1,
          longest: prev.streak.longest,
          lastCheckIn: today.toISOString()
        }
      }));
    }
  };

  // Check for time-based achievements
  useEffect(() => {
    const checkTimeAchievements = () => {
      const hour = new Date().getHours();
      if (hour < 7) {
        unlockAchievement('early_bird');
      } else if (hour >= 23) {
        unlockAchievement('night_owl');
      }
    };

    checkTimeAchievements();
  }, []);

  return {
    userProgress,
    showAchievement,
    setShowAchievement,
    unlockAchievement,
    getCurrentLevel,
    getNextLevel,
    updateStreak
  };
}