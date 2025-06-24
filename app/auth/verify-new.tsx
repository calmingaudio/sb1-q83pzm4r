import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft, RefreshCw, CircleCheck as CheckCircle } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/authContext';
import { router, useLocalSearchParams } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function VerifyScreen() {
  const { colors } = useTheme();
  const { sendMagicLink } = useAuth();
  const params = useLocalSearchParams();
  
  const email = params.email as string;
  const name = params.name as string;
  const type = params.type as string; // 'signup' or 'signin'
  
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [linkSent, setLinkSent] = useState(true);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendLink = async () => {
    if (resendCooldown > 0 || isResending) return;
    
    setIsResending(true);
    try {
      const result = await sendMagicLink(email, name);
      if (result.success) {
        setLinkSent(true);
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (error) {
      console.error('Error resending magic link:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleOpenEmail = () => {
    // On web, this would open the default email client
    // On mobile, this would open the mail app
    if (Platform.OS === 'web') {
      window.open('mailto:', '_blank');
    }
  };

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).springify()}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color={colors.text} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Check Your Email</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <View style={styles.content}>
        {/* Icon and Title */}
        <Animated.View 
          style={styles.iconSection}
          entering={FadeInDown.delay(200).springify()}
        >
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={colors.gradient.primary as [string, string, string]}
              style={styles.iconGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Mail size={48} color="#ffffff" strokeWidth={2} />
            </LinearGradient>
          </View>
          
          <Text style={styles.title}>Magic Link Sent!</Text>
          <Text style={styles.subtitle}>
            We've sent a secure sign-in link to
          </Text>
          <Text style={styles.email}>{email}</Text>
        </Animated.View>

        {/* Instructions */}
        <Animated.View 
          style={styles.instructionsSection}
          entering={FadeInDown.delay(300).springify()}
        >
          <View style={styles.instructionCard}>
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>1</Text>
              </View>
              <Text style={styles.instructionText}>
                Check your email inbox (and spam folder)
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>2</Text>
              </View>
              <Text style={styles.instructionText}>
                Click the "Sign In to SkyCalm" button in the email
              </Text>
            </View>
            
            <View style={styles.instructionStep}>
              <View style={styles.stepNumber}>
                <CheckCircle size={20} color={colors.success} strokeWidth={2} />
              </View>
              <Text style={styles.instructionText}>
                You'll be automatically signed in!
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View 
          style={styles.actionsSection}
          entering={FadeInDown.delay(400).springify()}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleOpenEmail}
          >
            <LinearGradient
              colors={colors.gradient.primary as [string, string, string]}
              style={styles.primaryButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Mail size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.primaryButtonText}>Open Email App</Text>
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.resendSection}>
            <Text style={styles.resendText}>Didn't receive the email?</Text>
            <TouchableOpacity
              style={[styles.resendButton, (resendCooldown > 0 || isResending) && styles.resendButtonDisabled]}
              onPress={handleResendLink}
              disabled={resendCooldown > 0 || isResending}
            >
              <RefreshCw 
                size={16} 
                color={resendCooldown > 0 || isResending ? colors.textSecondary : colors.primary} 
                strokeWidth={2} 
              />
              <Text style={[
                styles.resendButtonText,
                (resendCooldown > 0 || isResending) && styles.resendButtonTextDisabled
              ]}>
                {isResending ? 'Sending...' : 
                 resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 
                 'Resend Link'}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* Help Text */}
        <Animated.View 
          style={styles.helpSection}
          entering={FadeInDown.delay(500).springify()}
        >
          <Text style={styles.helpText}>
            The link will expire in 15 minutes for security. If you're having trouble, 
            make sure to check your spam folder or try a different email address.
          </Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  iconSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 40,
  },
  iconContainer: {
    marginBottom: 24,
  },
  iconGradient: {
    width: 96,
    height: 96,
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  email: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
  instructionsSection: {
    marginBottom: 40,
  },
  instructionCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  instructionStep: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  stepNumberText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#ffffff',
  },
  instructionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text,
    flex: 1,
    lineHeight: 24,
  },
  actionsSection: {
    marginBottom: 32,
  },
  primaryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 24,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 24,
    gap: 8,
  },
  primaryButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  resendSection: {
    alignItems: 'center',
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  resendButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    gap: 6,
  },
  resendButtonDisabled: {
    opacity: 0.5,
  },
  resendButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  resendButtonTextDisabled: {
    color: colors.textSecondary,
  },
  helpSection: {
    marginTop: 'auto',
    paddingBottom: 24,
  },
  helpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
}); 