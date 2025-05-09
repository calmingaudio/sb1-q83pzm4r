import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Colors from '@/constants/Colors';
import { useAnalyticsContext } from './AnalyticsProvider';

export default function ConsentBanner() {
  const { hasConsent, setConsent } = useAnalyticsContext();

  if (hasConsent !== null) return null;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Help Us Improve SkyCalm</Text>
        <Text style={styles.description}>
          We'd like to collect anonymous usage data to improve your experience. 
          This helps us understand which features are most helpful and how we can 
          make the app better for you.
        </Text>
        <View style={styles.buttons}>
          <TouchableOpacity 
            style={[styles.button, styles.declineButton]} 
            onPress={() => setConsent(false)}
          >
            <Text style={styles.declineButtonText}>No Thanks</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.button, styles.acceptButton]}
            onPress={() => setConsent(true)}
          >
            <Text style={styles.acceptButtonText}>Allow Analytics</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 20,
  },
  content: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  acceptButton: {
    backgroundColor: Colors.light.primary,
  },
  declineButton: {
    backgroundColor: Colors.light.backgroundSecondary,
  },
  acceptButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
  },
  declineButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});