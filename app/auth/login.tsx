// app/auth/login.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
  Image,
  Alert,
  ColorValue,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { ArrowLeft, Mail, Apple, Sparkles } from 'lucide-react-native';
import { useTheme } from "@/components/ThemeProvider";
import { router } from "expo-router";
import { useAuth } from "../../context/authContext";
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import Colors from '@/constants/Colors';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';


export default function LoginScreen() {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordInputRef = useRef<TextInput>(null);
  const { signInWithEmail, signInWithApple, signInWithGoogle } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Fields", "Please enter both email and password.");
      return;
    }
    setIsLoading(true);
    try {
      const result = await signInWithEmail(email, password);
      if (!result.success) {
        Alert.alert("Login Error", result.error);
      }
      // On success, the root layout guard will handle navigation
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleSignIn = async () => {
    try {
      const result = await signInWithApple();
      if (!result.success) {
        Alert.alert('Sign-In Error', result.error || 'Could not sign in with Apple. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Sign-In Error', 'Could not sign in with Apple. Please try again.');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // For now, we'll use a placeholder ID token
      // In a real implementation, you'd get this from Google Sign-In SDK
      const idToken = "placeholder_google_id_token";
      const result = await signInWithGoogle(idToken);
      if (!result.success) {
        Alert.alert('Google Sign-In Error', result.error || 'Could not sign in with Google. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Google Sign-In Error', 'Could not sign in with Google. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom", "left", "right"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flexContainer}
      >
        <LinearGradient
          colors={
            Colors.light.gradient.primary as [
              ColorValue,
              ColorValue,
              ...ColorValue[],
            ]
          }
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Image
            source={{
              uri: "https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg",
            }}
            style={styles.headerImage}
          />
          <View style={styles.overlay} />
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your journey</Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
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
              returnKeyType="next"
              onSubmitEditing={() => passwordInputRef.current?.focus()}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              ref={passwordInputRef}
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor={Colors.light.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="go"
              onSubmitEditing={handleLogin}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Mail size={20} color="#ffffff" />
            <Text style={styles.buttonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign In */}
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
              <FontAwesomeIcon icon={faGoogle} size={20} color={Colors.light.text} />
              <Text style={styles.socialButtonLabel}>Google</Text>
            </TouchableOpacity>

            {Platform.OS === 'ios' && (
              <TouchableOpacity style={styles.socialButton} onPress={handleAppleSignIn}>
                <FontAwesomeIcon icon={faApple} size={20} color={Colors.light.text} />
                <Text style={styles.socialButtonLabel}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.switchScreenButton}
            onPress={() => router.replace("/auth/signup")}
          >
            <Text style={styles.switchScreenText}>
              Don't have an account?{" "}
              <Text style={styles.link}>Sign Up</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Use the same styles from your signup screen, with one addition
const styles = StyleSheet.create({
  // ... (copy all styles from signup.tsx)
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    minHeight: 250,
    justifyContent: "flex-end",
    padding: 24,
    paddingTop: 60,
  },
  headerImage: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  title: {
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
  },
  scrollContentContainer: {
    padding: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: Colors.light.text,
    marginBottom: 8,
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
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    gap: 12,
  },
  emailButton: {
    backgroundColor: Colors.light.primary,
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
  // New style for the switch button
  switchScreenButton: {
    marginTop: 16,
    alignItems: "center",
  },
  switchScreenText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  link: {
    color: Colors.light.primary,
    fontFamily: "Inter-SemiBold",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.light.border,
  },
  dividerText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginHorizontal: 16,
  },
  socialButtons: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.light.card,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: Colors.light.border,
    gap: 8,
  },
  socialButtonLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: Colors.light.text,
  },
});