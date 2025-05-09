import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useUserProfile } from '@/hooks/useUserProfile';

export default function NameScreen() {
  const [name, setName] = useState('');
  const { updateProfile } = useUserProfile();

  const handleNext = async () => {
    if (name.trim()) {
      await updateProfile({ name: name.trim() });
      router.push('/questionnaire/goal');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <Animated.View 
          entering={FadeInDown.delay(200).springify()}
          style={styles.headerContent}
        >
          <Text style={styles.welcomeText}>Welcome to SkyCalm</Text>
          <Text style={styles.subtitle}>Let's personalize your experience</Text>
        </Animated.View>
      </LinearGradient>

      <View style={styles.content}>
        <Animated.View 
          entering={FadeInDown.delay(400).springify()}
          style={styles.inputContainer}
        >
          <Text style={styles.label}>What's your name?</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Enter your name"
            placeholderTextColor={Colors.light.textSecondary}
            autoFocus
            autoCapitalize="words"
          />
        </Animated.View>

        <Animated.View 
          entering={FadeInDown.delay(600).springify()}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[styles.button, !name.trim() && styles.buttonDisabled]}
            onPress={handleNext}
            disabled={!name.trim()}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}