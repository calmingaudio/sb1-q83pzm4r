import React, { createContext, useContext } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

const AnalyticsContext = createContext<ReturnType<typeof useAnalytics> | null>(null);

export function useAnalyticsContext() {
  const context = useContext(AnalyticsContext);
  if (!context) {
    throw new Error('useAnalyticsContext must be used within an AnalyticsProvider');
  }
  return context;
}

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const analytics = useAnalytics();

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}