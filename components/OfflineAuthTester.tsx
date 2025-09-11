import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { getFirebaseAuth } from '@/services/firebase';

interface EnvironmentCheck {
  firebaseConfig: boolean;
  authInitialization: boolean;
  error?: string;
}

export default function OfflineAuthTester() {
  const [environmentCheck, setEnvironmentCheck] = useState<EnvironmentCheck>({
    firebaseConfig: false,
    authInitialization: false,
  });

  useEffect(() => {
    checkEnvironment();
  }, []);

  const checkEnvironment = async () => {
    try {
      // Check Firebase configuration
      const firebaseConfig = {
        apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
      };

      const hasConfig = Object.values(firebaseConfig).every(value => !!value);
      
      setEnvironmentCheck(prev => ({
        ...prev,
        firebaseConfig: hasConfig,
      }));

      if (!hasConfig) {
        console.error('Missing Firebase configuration:', firebaseConfig);
        setEnvironmentCheck(prev => ({
          ...prev,
          error: 'Missing Firebase configuration variables',
        }));
        return;
      }

      // Test Firebase Auth initialization
      try {
        const auth = getFirebaseAuth();
        console.log('Firebase Auth initialized successfully');
        setEnvironmentCheck(prev => ({
          ...prev,
          authInitialization: true,
        }));
      } catch (authError) {
        console.error('Firebase Auth initialization failed:', authError);
        setEnvironmentCheck(prev => ({
          ...prev,
          error: `Auth initialization failed: ${authError}`,
        }));
      }
    } catch (error) {
      console.error('Environment check failed:', error);
      setEnvironmentCheck(prev => ({
        ...prev,
        error: `Environment check failed: ${error}`,
      }));
    }
  };

  const showEnvironmentInfo = () => {
    const config = {
      apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
      authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
      projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
      storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
      messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
      appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing',
    };

    Alert.alert(
      'Environment Check',
      `Firebase Config: ${environmentCheck.firebaseConfig ? '✅' : '❌'}\n` +
      `Auth Init: ${environmentCheck.authInitialization ? '✅' : '❌'}\n\n` +
      `Config Status:\n` +
      `API Key: ${config.apiKey}\n` +
      `Auth Domain: ${config.authDomain}\n` +
      `Project ID: ${config.projectId}\n` +
      `Storage Bucket: ${config.storageBucket}\n` +
      `Messaging Sender ID: ${config.messagingSenderId}\n` +
      `App ID: ${config.appId}\n\n` +
      `Error: ${environmentCheck.error || 'None'}`,
      [{ text: 'OK' }]
    );
  };

  if (!__DEV__) {
    return null; // Only show in development
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Environment Tester</Text>
      <Text style={styles.status}>
        Firebase Config: {environmentCheck.firebaseConfig ? '✅' : '❌'}
      </Text>
      <Text style={styles.status}>
        Auth Init: {environmentCheck.authInitialization ? '✅' : '❌'}
      </Text>
      {environmentCheck.error && (
        <Text style={styles.error}>Error: {environmentCheck.error}</Text>
      )}
      <Text style={styles.tapHint} onPress={showEnvironmentInfo}>
        Tap for details
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 100,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
    zIndex: 1000,
  },
  title: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  status: {
    color: 'white',
    fontSize: 10,
    marginBottom: 2,
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginBottom: 5,
  },
  tapHint: {
    color: 'yellow',
    fontSize: 10,
    textDecorationLine: 'underline',
  },
}); 