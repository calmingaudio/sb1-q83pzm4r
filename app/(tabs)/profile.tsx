import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Moon, Settings, CircleHelp as HelpCircle, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/Colors';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [offlineAccessEnabled, setOfflineAccessEnabled] = useState(true);
  const [hapticFeedbackEnabled, setHapticFeedbackEnabled] = useState(true);
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Bell size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Notifications</Text>
                <Text style={styles.settingDescription}>
                  Receive anxiety tips and exercise reminders
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#e2e8f0', true: Colors.light.primaryLight }}
              thumbColor={notificationsEnabled ? Colors.light.primary : '#f1f5f9'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Moon size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Dark Mode</Text>
                <Text style={styles.settingDescription}>
                  Use a darker theme for night flights
                </Text>
              </View>
            </View>
            <Switch
              value={darkModeEnabled}
              onValueChange={setDarkModeEnabled}
              trackColor={{ false: '#e2e8f0', true: Colors.light.primaryLight }}
              thumbColor={darkModeEnabled ? Colors.light.primary : '#f1f5f9'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Settings size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Offline Access</Text>
                <Text style={styles.settingDescription}>
                  Access key features without internet
                </Text>
              </View>
            </View>
            <Switch
              value={offlineAccessEnabled}
              onValueChange={setOfflineAccessEnabled}
              trackColor={{ false: '#e2e8f0', true: Colors.light.primaryLight }}
              thumbColor={offlineAccessEnabled ? Colors.light.primary : '#f1f5f9'}
            />
          </View>
          
          <View style={styles.settingItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <Settings size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Haptic Feedback</Text>
                <Text style={styles.settingDescription}>
                  Enable vibration during breathing exercises
                </Text>
              </View>
            </View>
            <Switch
              value={hapticFeedbackEnabled}
              onValueChange={setHapticFeedbackEnabled}
              trackColor={{ false: '#e2e8f0', true: Colors.light.primaryLight }}
              thumbColor={hapticFeedbackEnabled ? Colors.light.primary : '#f1f5f9'}
            />
          </View>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <HelpCircle size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Help & Support</Text>
              </View>
            </View>
            <ArrowLeft size={18} color={Colors.light.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <HelpCircle size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Privacy Policy</Text>
              </View>
            </View>
            <ArrowLeft size={18} color={Colors.light.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.linkItem}>
            <View style={styles.settingInfo}>
              <View style={styles.iconContainer}>
                <HelpCircle size={22} color={Colors.light.primary} />
              </View>
              <View>
                <Text style={styles.settingTitle}>Terms of Service</Text>
              </View>
            </View>
            <ArrowLeft size={18} color={Colors.light.textSecondary} style={{ transform: [{ rotate: '180deg' }] }} />
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
  header: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.light.text,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingTitle: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: Colors.light.text,
  },
  settingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: 2,
  },
  linkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  versionContainer: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  versionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: Colors.light.textSecondary,
  },
});