// app/auth/signin.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Mail, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/context/authContext';
import { useOfflineContext } from '@/components/OfflineProvider';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faGoogle, faApple } from '@fortawesome/free-brands-svg-icons';

export default function SignInScreen() {
  const { colors } = useTheme();
  const { signInWithGoogle, sendMagicLink, signInWithApple, signInWithEmail, signUpWithEmail } = useAuth();
  const { isOnline, shouldUseOfflineMode, createMockOfflineUser } = useOfflineContext();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const result = await sendMagicLink(email);
      if (result.success) {
        router.push({
          pathname: '/auth/verify',
          params: { email, type: 'signin' }
        });
      } else {
        setErrors({ general: result.error || 'Failed to send magic link' });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Note: This would require Google Sign-In SDK integration
    Alert.alert(
      'Google Sign In',
      'Google Sign In requires additional setup with the Google Sign-In SDK. Please export this project and follow the Firebase documentation to complete the integration.',
      [{ text: 'OK' }]
    );
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithApple();
      if (!result.success) {
        // More specific error messages based on common issues
        let errorMessage = result.error || 'Could not sign in with Apple. Please try again.';
        
        if (result.error?.includes('authorization attempt failed')) {
          errorMessage = 'Apple Sign-In failed. Please ensure:\n\n• You\'re testing on a real iOS device (not simulator)\n• Your Apple ID is signed in\n• Sign In with Apple is enabled in Settings';
        }
        
        Alert.alert('Apple Sign-In Error', errorMessage);
      }
    } catch (error: any) {
      console.error('Apple Sign-In caught error:', error);
      Alert.alert(
        'Apple Sign-In Error', 
        'Could not sign in with Apple. Please ensure you\'re using a real iOS device and try again.'
      );
    }
  };

  // Debug sign-in for simulator testing
  const handleDebugSignIn = async () => {
    const testEmail = 'test@simulator.dev';
    const testPassword = 'TestPass123!';
    const testName = 'Test User';
    
    console.log('Debug sign-in initiated. Network status:', { isOnline, shouldUseOfflineMode });
    
    setIsLoading(true);
    setErrors({});
    
    try {
      if (isOnline && !shouldUseOfflineMode) {
        // Online mode - try Firebase authentication
        let result = await signInWithEmail(testEmail, testPassword);
        
        // If sign-in fails, try to create the account
        if (!result.success) {
          result = await signUpWithEmail(testEmail, testPassword, testName);
        }
        
        if (!result.success) {
          setErrors({ general: result.error || 'Debug sign-in failed' });
        }
        // If successful, user will be automatically redirected via auth state change
      } else {
        // Offline mode - create mock offline user
        const result = await createMockOfflineUser(testEmail, testName);
        
        if (result.success) {
          console.log('Debug sign-in successful (offline mode)');
          // User will be automatically redirected via auth state change
        } else {
          setErrors({ general: result.error || 'Debug sign-in failed' });
        }
      }
    } catch (error) {
      console.error('Debug sign-in error:', error);
      setErrors({ general: 'Debug sign-in failed' });
    } finally {
      setIsLoading(false);
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
        <Text style={styles.headerTitle}>Welcome Back</Text>
        <View style={styles.headerSpacer} />
      </Animated.View>

      <View style={styles.content}>
        {/* Title Section */}
        <Animated.View 
          style={styles.titleSection}
          entering={FadeInDown.delay(200).springify()}
        >
          <Text style={styles.title}>Sign In</Text>
          <Text style={styles.subtitle}>
            Continue your journey to peaceful flying
          </Text>
        </Animated.View>

        {/* Magic Link Info */}
        <Animated.View 
          style={styles.magicLinkInfo}
          entering={FadeInDown.delay(250).springify()}
        >
          <Sparkles size={20} color={colors.primary} strokeWidth={2} />
          <View style={styles.magicLinkTextContainer}>
            <Text style={styles.magicLinkTitle}>Passwordless Sign In</Text>
            <Text style={styles.magicLinkText}>
              We'll send you a secure link to sign in - no password needed!
            </Text>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View 
          style={styles.form}
          entering={FadeInDown.delay(300).springify()}
        >
          {/* General Error */}
          {errors.general && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          )}

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <View style={[
              styles.inputWrapper,
              errors.email ? styles.inputError : undefined
            ]}>
              <Mail size={20} color={colors.textSecondary} strokeWidth={2} />
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
            {errors.email && <Text style={styles.fieldError}>{errors.email}</Text>}
          </View>

          {/* Sign In Button */}
          <TouchableOpacity
            style={[styles.signInButton, isLoading && styles.buttonDisabled]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <LinearGradient
              colors={colors.gradient.primary}
              style={styles.signInButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Sparkles size={20} color="#ffffff" strokeWidth={2} />
              <Text style={styles.signInButtonText}>
                {isLoading ? 'Sending Magic Link...' : 'Send Magic Link'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign In */}
          <View style={styles.socialButtons}>
            <TouchableOpacity 
              style={styles.socialButton} 
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FontAwesomeIcon icon={faGoogle} size={20} color={colors.text} />
              <Text style={styles.socialButtonLabel}>Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity 
                style={[styles.socialButton, styles.appleButton]} 
                onPress={handleAppleSignIn}
                disabled={isLoading}
              >
                <FontAwesomeIcon icon={faApple} size={20} color={colors.text} />
                <Text style={styles.socialButtonLabel}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Debug Sign In - Only show in development/simulator */}
          {__DEV__ && (
            <TouchableOpacity 
              style={[styles.debugButton]}
              onPress={handleDebugSignIn}
              disabled={isLoading}
            >
              <Text style={styles.debugButtonText}>
                🧪 Debug Sign-In ({shouldUseOfflineMode ? 'Offline' : 'Online'} Mode)
              </Text>
            </TouchableOpacity>
          )}

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
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
  titleSection: {
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
  },
  magicLinkInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary + '20',
  },
  magicLinkTextContainer: {
    flex: 1,
  },
  magicLinkTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.primary,
    marginBottom: 4,
  },
  magicLinkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.primary,
    lineHeight: 20,
  },
  form: {
    flex: 1,
  },
  errorContainer: {
    backgroundColor: colors.error + '20',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.error + '40',
  },
  errorText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.error,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    flex: 1,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.text,
  },
  fieldError: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.error,
    marginTop: 4,
  },
  signInButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 32,
    backgroundColor: colors.primary, // Add solid background color for shadow calculation
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
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    gap: 8,
  },
  signInButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 8,
  },
  socialButtonText: {
    fontSize: 20,
  },
  socialButtonLabel: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.text,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: 24,
  },
  signUpText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  signUpLink: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  appleButton: {
    backgroundColor: colors.appleButton,
    borderColor: colors.appleButtonBorder,
  },
  debugButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: 16,
    borderStyle: 'dashed',
  },
  debugButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.primary,
    textAlign: 'center',
  },
});