import React, { createContext, useContext } from 'react';
import { useGamification } from '@/hooks/useGamification';
import AchievementPopup from './AchievementPopup';

const GamificationContext = createContext<ReturnType<typeof useGamification> | null>(null);

export function useGamificationContext() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error('useGamificationContext must be used within a GamificationProvider');
  }
  return context;
}

export function GamificationProvider({ children }: { children: React.ReactNode }) {
  const gamification = useGamification();

  return (
    <GamificationContext.Provider value={gamification}>
      {children}
      {gamification.showAchievement && (
        <AchievementPopup
          achievement={gamification.showAchievement}
          onHide={() => gamification.setShowAchievement(null)}
        />
      )}
    </GamificationContext.Provider>
  );
}