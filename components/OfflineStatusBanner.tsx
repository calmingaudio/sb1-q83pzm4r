import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Wifi, WifiOff, Shield, User, Crown, AlertCircle } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useOfflineContent } from '@/hooks/useOfflineContent';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

export default function OfflineStatusBanner() {
  const { colors } = useTheme();
  const { 
    isOnline, 
    isAuthenticated, 
    isPremium, 
    isOfflineMode,
    getOfflineStatus,
    getAvailableContent 
  } = useOfflineContent();

  const status = getOfflineStatus();
  const availableContent = getAvailableContent();

  // Don't show banner if everything is normal
  if (status.mode === 'online' && isAuthenticated) {
    return null;
  }

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff size={16} color={colors.textSecondary} />;
    if (isOfflineMode) return <Shield size={16} color={colors.textSecondary} />;
    return <Wifi size={16} color={colors.textSecondary} />;
  };

  const getStatusColor = () => {
    if (!isOnline) return colors.warning;
    if (isOfflineMode) return colors.primary;
    return colors.success;
  };

  const getAvailableFeatures = () => {
    const features = [];
    if (availableContent.breathing) features.push('Breathing');
    if (availableContent.journal) features.push('Journal');
    if (availableContent.music) features.push('Music');
    if (availableContent.meditations) features.push('Meditations');
    if (availableContent.learn) features.push('Learn');
    if (availableContent.sos) features.push('SOS');
    return features;
  };

  const availableFeatures = getAvailableFeatures();

  return (
    <Animated.View 
      entering={SlideInDown.springify()}
      style={[styles.container, { backgroundColor: colors.card }]}
    >
      <View style={styles.header}>
        {getStatusIcon()}
        <Text style={[styles.statusText, { color: colors.text }]}>
          {status.message}
        </Text>
        {isAuthenticated && (
          <User size={14} color={colors.textSecondary} />
        )}
        {isPremium && (
          <Crown size={14} color={colors.primary} style={styles.premiumIcon} />
        )}
      </View>

      {!isOnline && (
        <View style={styles.warningContainer}>
          <AlertCircle size={14} color={colors.warning} />
          <Text style={[styles.warningText, { color: colors.warning }]}>
            Some features require internet connection
          </Text>
        </View>
      )}

      {availableFeatures.length > 0 && (
        <View style={styles.featuresContainer}>
          <Text style={[styles.featuresLabel, { color: colors.textSecondary }]}>
            Available offline:
          </Text>
          <View style={styles.featuresList}>
            {availableFeatures.map((feature, index) => (
              <View key={feature} style={styles.featureItem}>
                <View style={[styles.featureDot, { backgroundColor: getStatusColor() }]} />
                <Text style={[styles.featureText, { color: colors.text }]}>
                  {feature}
                </Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {!isAuthenticated && (
        <View style={styles.authPrompt}>
          <Text style={[styles.authText, { color: colors.textSecondary }]}>
            Sign in to access more offline features
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statusText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  premiumIcon: {
    marginLeft: 8,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    borderRadius: 8,
  },
  warningText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginLeft: 6,
  },
  featuresContainer: {
    marginTop: 8,
  },
  featuresLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 6,
  },
  featuresList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  featureText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  authPrompt: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
  authText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    textAlign: 'center',
  },
}); 