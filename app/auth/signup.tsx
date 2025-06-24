// app/auth/signup.tsx
import React, { useState, useRef } from 'react';
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
  Linking,
  ScrollView,
  KeyboardAvoidingView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Mail, Apple, CheckSquare, Square } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { router } from 'expo-router';
import { useAuth } from '../../context/authContext';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faApple, faGoogle } from '@fortawesome/free-brands-svg-icons';

const openURL = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (supported) {
    await Linking.openURL(url);
  } else {
    Alert.alert(`Don't know how to open this URL: ${url}`);
  }
};

export default function SignupScreen() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState("");
  const [marketingOptIn, setMarketingOptIn] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);

  const lastNameInputRef = useRef<TextInput>(null);
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);

  const {
    signUpWithEmail,
    signInWithApple,
    signInWithGoogle,
    isLoading: isAuthLoading,
  } = useAuth();

  const handleEmailSignup = async () => {
    // Basic validation
    if (!firstName || !lastName || !email || !password) {
      Alert.alert("Missing Fields", "Please fill out all of the fields.");
      return;
    }
    if (password.length < 6) {
      Alert.alert(
        "Weak Password",
        "Password should be at least 6 characters."
      );
      return;
    }

    setIsEmailLoading(true);
    try {
      // Call the new context function with displayName
      const displayName = `${firstName} ${lastName}`;
      const result = await signUpWithEmail(email, password, displayName);
      if (!result.success) {
        Alert.alert("Sign-Up Error", result.error);
      } else {
        // Navigation will be handled by the root layout guard
      }
    } catch (error: any) {
      // Firebase provides user-friendly error messages
      Alert.alert("Sign-Up Error", error.message);
    } finally {
      setIsEmailLoading(false);
    }
  };

  const handleAppleSignupAttempt = async () => {
    try {
      const result = await signInWithApple();
      if (!result.success) {
        Alert.alert('Sign-In Error', result.error || 'Could not sign in with Apple. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Sign-In Error', 'Could not sign in with Apple. Please try again.');
    }
  };

  const handleGoogleSignupAttempt = async () => {
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
          <Text style={styles.title}>Welcome to SkyCalm</Text>
          <Text style={styles.subtitle}>Your companion for peaceful flights</Text>
        </LinearGradient>

        <ScrollView
          style={styles.content}
          contentContainerStyle={styles.scrollContentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.nameContainer}>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                style={styles.input}
                value={firstName}
                onChangeText={setFirstName}
                placeholder="First"
                placeholderTextColor={Colors.light.textSecondary}
                returnKeyType="next"
                onSubmitEditing={() => lastNameInputRef.current?.focus()}
              />
            </View>
            <View style={styles.nameInputWrapper}>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                ref={lastNameInputRef}
                style={styles.input}
                value={lastName}
                onChangeText={setLastName}
                placeholder="Last"
                placeholderTextColor={Colors.light.textSecondary}
                returnKeyType='next'
                onSubmitEditing={() => emailInputRef.current?.focus()}
              />
            </View>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              ref={emailInputRef}
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Email"
              placeholderTextColor={Colors.light.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              returnKeyType="next" // Changes the return key to "Next"
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
              placeholder="Create a password"
              placeholderTextColor={Colors.light.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              returnKeyType="go" 
              onSubmitEditing={handleEmailSignup} 
            />
          </View>

          <TouchableOpacity
            style={[styles.button, styles.emailButton]}
            onPress={handleEmailSignup}
            disabled={isEmailLoading || isAuthLoading}
          >
            <Mail size={20} color="#ffffff" />
            <Text style={styles.buttonText}>
              {isEmailLoading ? "Creating Account..." : "Continue with Email"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.checkboxContainer}
            onPress={() => setMarketingOptIn(!marketingOptIn)}
          >
            {marketingOptIn ? (
              <CheckSquare size={24} color={Colors.light.primary} />
            ) : (
              <Square size={24} color={Colors.light.textSecondary} />
            )}
            <Text style={styles.checkboxLabel}>
              I'd like to receive marketing emails and updates from SkyCalm.
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Sign In Buttons */}
          <View style={styles.socialButtons}>
            <TouchableOpacity
              style={[styles.socialButton, styles.googleButton]}
              onPress={handleGoogleSignupAttempt}
              disabled={isAuthLoading || isEmailLoading}
            >
              <FontAwesomeIcon icon={faGoogle} size={20} color={Colors.light.text} />
              <Text style={styles.socialButtonLabel}>Google</Text>
            </TouchableOpacity>

            {Platform.OS === "ios" && (
              <TouchableOpacity
                style={[styles.socialButton, styles.appleButton]}
                onPress={handleAppleSignupAttempt}
                disabled={isAuthLoading || isEmailLoading}
              >
                <FontAwesomeIcon icon={faApple} size={20} color="#ffffff" />
                <Text style={[styles.socialButtonLabel, { color: "#ffffff" }]}>Apple</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.switchScreenButton}
            onPress={() => router.replace("/auth/login")}
          >
            <Text style={styles.switchScreenText}>
              Already have an account?{" "}
              <Text style={styles.link}>Sign In</Text>
            </Text>
          </TouchableOpacity>

          <Text style={styles.terms}>
            By continuing, you agree to our{" "}
            <Text
              style={styles.link}
              onPress={() => openURL("https://skycalm.net/terms")}
            >
              Terms of Service
            </Text>{" "}
            and{" "}
            <Text
              style={styles.link}
              onPress={() => openURL("https://skycalm.net/privacy")}
            >
              Privacy Policy
            </Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles (ensure they are complete and correct)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  flexContainer: {
    flex: 1,
  },
  header: {
    // Make header height flexible instead of fixed
    minHeight: 250,
    justifyContent: "flex-end",
    padding: 24,
    paddingTop: 60, // Add padding for status bar
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
    // This will now be the scrollable part
    flex: 1,
  },
  scrollContentContainer: {
    // Use this for padding inside the scroll view
    padding: 24,
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 16, // Adds space between the two input fields
  },
  nameInputWrapper: {
    flex: 1,
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
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 12,
  },
  checkboxLabel: {
    flex: 1, // Allows text to wrap
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
  appleButton: {
    backgroundColor: "#000000",
  },
  buttonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#ffffff",
  },
  appleButtonText: {
    fontFamily: "Inter-SemiBold",
    fontSize: 16,
    color: "#ffffff",
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
  terms: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    textAlign: "center",
    marginTop: 24,
  },
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
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    gap: 8,
  },
  googleButton: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  socialButtonLabel: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: Colors.light.text,
  },
});