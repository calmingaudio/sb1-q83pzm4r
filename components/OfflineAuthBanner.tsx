import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { useOfflineContext } from '@/components/OfflineProvider';
import { Mail, Wifi, CheckCircle, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface OfflineAuthBannerProps {
  onDismiss?: () => void;
}

export default function OfflineAuthBanner({ onDismiss }: OfflineAuthBannerProps) {
  const { colors } = useTheme();
  const { hasPendingMagicLink, sendMagicLink, getOfflineUser } = useAuth();
  const { isOnline, shouldUseOfflineMode } = useOfflineContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [pendingMagicLink, setPendingMagicLink] = useState(false);
  const [offlineUser, setOfflineUser] = useState<any>(null);

  React.useEffect(() => {
    checkOfflineStatus();
  }, []);

  const checkOfflineStatus = async () => {
    const hasPending = await hasPendingMagicLink();
    const user = await getOfflineUser();
    setPendingMagicLink(hasPending);
    setOfflineUser(user);
  };

  const handleResendMagicLink = async () => {
    if (!offlineUser?.email) {
      Alert.alert('Error', 'No email found for offline user');
      return;
    }

    setIsLoading(true);
    try {
      const result = await sendMagicLink(offlineUser.email, offlineUser.displayName);
      if (result.success) {
        Alert.alert(
          'Magic Link Sent',
          'Check your email and click the link to complete your account verification.',
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert('Error', result.error || 'Failed to send magic link');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send magic link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    onDismiss?.();
  };

  // Only show if user is offline and has pending magic link
  if (!shouldUseOfflineMode || !pendingMagicLink || !offlineUser) {
    return null;
  }

  const styles = createStyles(colors);

  return (
    <Animated.View entering={FadeInDown.delay(500)} style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <AlertCircle size={20} color={colors.warning} />
        </View>
        
        <View style={styles.textContainer}>
          <Text style={styles.title}>Complete Your Account</Text>
          <Text style={styles.message}>
            You're using SkyCalm in offline mode. When you're back online, complete your account verification to sync your data.
          </Text>
        </View>

        <TouchableOpacity 
          style={styles.dismissButton}
          onPress={handleDismiss}
        >
          <Text style={styles.dismissText}>×</Text>
        </TouchableOpacity>
      </View>

      {isOnline && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={handleResendMagicLink}
          disabled={isLoading}
        >
          <Mail size={16} color={colors.primary} />
          <Text style={styles.actionText}>
            {isLoading ? 'Sending...' : 'Resend Magic Link'}
          </Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    backgroundColor: colors.card,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  iconContainer: {
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  dismissButton: {
    marginLeft: 8,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    gap: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
}); 