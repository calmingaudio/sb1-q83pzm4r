import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';

export default function VerifyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#ffffff" />
        </TouchableOpacity>
      </LinearGradient>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Mail size={48} color={Colors.light.primary} />
        </View>
        
        <Text style={styles.title}>Check Your Email</Text>
        <Text style={styles.description}>
          We've sent you a magic link to sign in to SkyCalm. Click the link in your email to continue.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(tabs)')}
        >
          <Text style={styles.buttonText}>Open Email App</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.resendText}>Didn't receive an email? Try again</Text>
        </TouchableOpacity>
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
    padding: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: Colors.light.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  resendText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.primary,
  },
});