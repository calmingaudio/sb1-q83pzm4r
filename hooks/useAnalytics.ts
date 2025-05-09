import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ANALYTICS_CONSENT_KEY = 'analytics_consent';
const ANALYTICS_EVENTS_KEY = 'analytics_events';

type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
  timestamp: number;
};

export function useAnalytics() {
  const [hasConsent, setHasConsent] = useState<boolean | null>(null);

  useEffect(() => {
    checkConsent();
  }, []);

  const checkConsent = async () => {
    try {
      const consent = await AsyncStorage.getItem(ANALYTICS_CONSENT_KEY);
      setHasConsent(consent === 'true');
    } catch (error) {
      console.error('Error checking analytics consent:', error);
      setHasConsent(false);
    }
  };

  const setConsent = async (consent: boolean) => {
    try {
      await AsyncStorage.setItem(ANALYTICS_CONSENT_KEY, String(consent));
      setHasConsent(consent);
    } catch (error) {
      console.error('Error setting analytics consent:', error);
    }
  };

  const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
    if (!hasConsent) return;

    try {
      const event: AnalyticsEvent = {
        name: eventName,
        properties,
        timestamp: Date.now(),
      };

      const existingEvents = await AsyncStorage.getItem(ANALYTICS_EVENTS_KEY);
      const events: AnalyticsEvent[] = existingEvents ? JSON.parse(existingEvents) : [];
      events.push(event);

      await AsyncStorage.setItem(ANALYTICS_EVENTS_KEY, JSON.stringify(events));

      // In a production app, you would batch send these events to your analytics service
      console.log('Analytics event tracked:', event);
    } catch (error) {
      console.error('Error tracking analytics event:', error);
    }
  };

  return {
    hasConsent,
    setConsent,
    trackEvent,
  };
}