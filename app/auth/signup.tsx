import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Apple } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailSignup = async () => {
    if (!email || !email.includes('@')) {
      // Show error state
      return;
    }

    setIsLoading(true);
    // In a real app, send email to backend
    setTimeout(() => {
      router.push('/auth/verify');
    }, 1000);
  };

  const handleAppleSignup = async () => {
    // Implement Apple Sign in
    router.push('/questionnaire/name');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg' }}
          style={styles.headerImage}
        />
        <View style={styles.overlay} />
        <Text style={styles.title}>Welcome to SkyCalm</Text>
        <Text style={styles.subtitle}>Your companion for peaceful flights</Text>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            placeholderTextColor={Colors.light.textSecondary}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.emailButton]}
          onPress={handleEmailSignup}
          disabled={isLoading}
        >
          <Mail size={20} color="#ffffff" />
          <Text style={styles.buttonText}>
            {isLoading ? 'Sending Link...' : 'Continue with Email'}
          </Text>
        </TouchableOpacity>

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={handleAppleSignup}
        >
          <Apple size={20} color="#000000" />
          <Text style={styles.appleButtonText}>Continue with Apple</Text>
        </TouchableOpacity>

        <Text style={styles.terms}>
          By continuing, you agree to our{' '}
          <Text style={styles.link}>Terms of Service</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    height: 300,
    justifyContent: 'flex-end',
    padding: 24,
  },
  headerImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.text,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
    }),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  emailButton: {
    backgroundColor: Colors.light.primary,
  },
  appleButton: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  appleButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: Colors.light.text,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginHorizontal: 16,
  },
  terms: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: 24,
  },
  link: {
    color: Colors.light.primary,
  },
});