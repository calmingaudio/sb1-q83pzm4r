// app/questionnaire/name.tsx (or wherever this screen is located)
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import Colors from "@/constants/Colors";
import { router } from "expo-router";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useAuthentication } from "@/hooks/useAuthentication";

export default function NameScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Use our new unified hook to get the updateProfile function
  const { updateProfile } = useAuthentication();

  // Ref for smooth keyboard navigation
  const lastNameInputRef = useRef<TextInput>(null);

  const handleNext = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      return;
    }
    setIsLoading(true);
    try {
      await updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
      router.push("/questionnaire/goal");
    } catch (error) {
      console.error("Failed to update name:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={Colors.light.gradient.primary as any}
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

          {/* CHANGE 4: Use the side-by-side layout for name inputs */}
          <View style={styles.nameContainer}>
            <View style={styles.nameInputWrapper}>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First Name"
                placeholderTextColor={Colors.light.textSecondary}
                autoFocus
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
              />
            </View>
            <View style={styles.nameInputWrapper}>
              <TextInput
                ref={lastNameInputRef}
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last Name"
                placeholderTextColor={Colors.light.textSecondary}
                autoCapitalize="words"
                returnKeyType="go"
                onSubmitEditing={handleNext}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInDown.delay(600).springify()}
          style={styles.buttonContainer}
        >
          <TouchableOpacity
            style={[
              styles.button,
              (!firstName.trim() || !lastName.trim() || isLoading) &&
                styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!firstName.trim() || !lastName.trim() || isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Saving..." : "Continue"}
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// --- CHANGE 5: Update the StyleSheet ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 48,
    justifyContent: "flex-end",
    minHeight: 200,
  },
  headerContent: {},
  welcomeText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 32,
    color: "#ffffff",
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: "Inter-Regular",
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.9)",
  },
  content: {
    flex: 1,
    padding: 24,
  },
  inputContainer: {
    marginBottom: 32,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
  },
  // New styles for the side-by-side layout
  nameContainer: {
    flexDirection: "row",
    gap: 16,
  },
  nameInputWrapper: {
    flex: 1,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    fontFamily: "Inter-Regular",
    fontSize: 16,
    color: Colors.light.text,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  buttonContainer: {
    marginTop: "auto",
    paddingBottom: 16,
  },
  button: {
    backgroundColor: Colors.light.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: Colors.light.primaryLight,
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
});