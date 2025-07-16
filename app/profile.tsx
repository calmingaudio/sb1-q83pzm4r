// app/(tabs)/profile.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Linking,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Bell,
  ShieldCheck,
  FileText,
  Settings,
  CircleHelp,
  ArrowRight,
  LogOut,
  Trash2,
} from "lucide-react-native";
import BackButton from "@/components/BackButton";
import Colors from "@/constants/Colors";
import { useAuth } from "@/context/authContext";
import { router } from "expo-router";

export default function ProfileScreen() {
  const { logout, deleteAccount } = useAuth();
  const [offlineAccessEnabled, setOfflineAccessEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  const openURL = async (url: string) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log(`Don't know how to open this URL: ${url}`);
    }
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to permanently delete your account and all of your data? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              const result = await deleteAccount();
              if (!result.success) {
                console.log("Deletion failed:", result.error);
              }
            } catch (error) {
              console.log("Deletion failed, user was notified.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* New Custom Header */}
      <View style={styles.screenHeader}>
        <BackButton />
        <Text style={styles.screenHeaderTitle}>Settings</Text>
        {/* This empty view is a trick to center the title perfectly */}
        <View style={styles.headerRightPlaceholder} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Settings size={22} color={Colors.light.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Offline Access</Text>
                <Text style={styles.settingDescription}>
                  Access key features without internet
                </Text>
              </View>
            </View>
            <Switch
              value={offlineAccessEnabled}
              onValueChange={setOfflineAccessEnabled}
              trackColor={{ false: "#e2e8f0", true: Colors.light.primaryLight }}
              thumbColor={
                offlineAccessEnabled ? Colors.light.primary : "#f1f5f9"
              }
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Settings size={22} color={Colors.light.primary} />
              </View>
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Haptic Feedback</Text>
                <Text style={styles.settingDescription}>
                  Enable vibration during breathing exercises
                </Text>
              </View>
            </View>
            <Switch
              value={hapticFeedbackEnabled}
              onValueChange={setHapticFeedbackEnabled}
              trackColor={{ false: "#e2e8f0", true: Colors.light.primaryLight }}
              thumbColor={
                hapticFeedbackEnabled ? Colors.light.primary : "#f1f5f9"
              }
            />
          </View>
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity 
            style={styles.linkItem}
            onPress={() => openURL("https://skycalm.net/contact")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <CircleHelp size={22} color={Colors.light.primary} />
              </View>
              <Text style={styles.settingTitle}>Help & Support</Text>
            </View>
            <ArrowRight size={18} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => openURL("https://skycalm.net/privacy")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <ShieldCheck size={22} color={Colors.light.primary} />
              </View>
              <Text style={styles.settingTitle}>Privacy Policy</Text>
            </View>
            <ArrowRight size={18} color={Colors.light.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.linkItem}
            onPress={() => openURL("https://skycalm.net/terms")}
          >
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <FileText size={22} color={Colors.light.primary} />
              </View>
              <Text style={styles.settingTitle}>Terms of Service</Text>
            </View>
            <ArrowRight size={18} color={Colors.light.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={[styles.linkItem, styles.deleteButton]}
            onPress={handleDeletePress}
            disabled={isDeleting}
          >
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Trash2 size={22} color="#ef4444" />
              </View>
              <Text style={[styles.settingTitle, styles.deleteButtonText]}>
                {isDeleting ? "Deleting Account..." : "Delete Account"}
              </Text>
            </View>
            <ArrowRight size={18} color="#ef4444" />
          </TouchableOpacity>
        </View>

        {/* Sign Out Section */}
        <View style={styles.signOutSection}>
          <TouchableOpacity style={styles.signOutButton} onPress={logout}>
            <LogOut size={18} color="#ef4444" />
            <Text style={styles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  // New Header Styles
  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  backButton: {
    padding: 4, // Increase touchable area
  },
  screenHeaderTitle: {
    fontFamily: "Inter-SemiBold",
    fontSize: 18,
    color: Colors.light.text,
  },
  headerRightPlaceholder: {
    width: 24, // Match the icon size to balance the layout
    padding: 4,
  },
  // Existing Styles
  content: {
    flex: 1,
  },
  section: {
    marginTop: 24,
  },
  deleteButton: {
    backgroundColor: "#fee2e2",
  },
  deleteButtonText: {
    color: "#ef4444",
  },
  signOutSection: {
    marginTop: 16,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: "center",
    alignItems: "center",
  },
  settingTextContainer: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: Colors.light.text,
  },
  settingDescription: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  signOutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 8,
  },
  signOutButtonText: {
    fontFamily: "Inter-Medium",
    fontSize: 16,
    color: "#ef4444",
  },
  versionContainer: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontFamily: "Inter-Regular",
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});