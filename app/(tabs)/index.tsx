import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Wind, BookOpen, CircleAlert as AlertCircle, BookType, Settings } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, { FadeInDown, FadeInRight } from 'react-native-reanimated';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useDailyTip } from '@/hooks/useDailyTip';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { profile } = useUserProfile();
  const dailyTip = useDailyTip();
  const userFears = ['turbulence', 'takeoff'];
  const greeting = getGreeting();
  
  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  }

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'breathe':
        router.push('/(tabs)/breathe');
        break;
      case 'sos':
        router.push('/(tabs)/sos');
        break;
      case 'learn':
        router.push('/(tabs)/learn');
        break;
      case 'journal':
        router.push('/(tabs)/journal');
        break;
    }
  };

  const handleLearnMore = (categoryId: string) => {
    router.push({
      pathname: '/(tabs)/learn',
      params: { category: categoryId }
    });
  };
  
  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Header */}
        <View style={styles.headerContainer}>
          <Animated.View 
            style={styles.welcomeHeader}
            entering={FadeInDown.delay(50).springify()}
          >
            <Text style={styles.greeting}>{greeting},</Text>
            <Text style={styles.userName}>{profile?.name || 'Traveler'}</Text>
            <Text style={styles.welcomeMessage}>Ready for a peaceful journey?</Text>
          </Animated.View>
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => router.push('/(tabs)/settings')}
          >
            <Settings size={24} color={Colors.light.text} />
          </TouchableOpacity>
        </View>

        {/* Quick Action Cards */}
        <View style={styles.quickActions}>
          {[
            { 
              icon: Wind, 
              text: 'Quick Breathe',
              gradient: Colors.light.gradient.primary,
              delay: 200,
              action: 'breathe'
            },
            { 
              icon: AlertCircle, 
              text: 'Panic Mode',
              gradient: Colors.light.gradient.accent,
              delay: 300,
              action: 'sos'
            },
            { 
              icon: BookOpen, 
              text: 'Flying FAQs',
              gradient: Colors.light.gradient.secondary,
              delay: 400,
              action: 'learn'
            },
            { 
              icon: BookType, 
              text: 'Journal',
              gradient: ['#9333ea', '#a855f7', '#c084fc'],
              delay: 500,
              action: 'journal'
            },
          ].map((action, index) => (
            <AnimatedTouchableOpacity
              key={index}
              entering={FadeInDown.delay(action.delay).springify()}
              onPress={() => handleQuickAction(action.action)}
              style={styles.quickActionWrapper}
            >
              <LinearGradient
                colors={action.gradient}
                style={styles.quickActionCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.quickActionIcon}>
                  <action.icon size={24} color="#ffffff" />
                </View>
                <Text style={styles.quickActionText}>{action.text}</Text>
              </LinearGradient>
            </AnimatedTouchableOpacity>
          ))}
        </View>

        {/* Personalized Recommendations */}
        <Animated.View 
          style={styles.section}
          entering={FadeInRight.delay(500).springify()}
        >
          <Text style={styles.sectionTitle}>Personalized For You</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.recommendationsScroll}
            contentContainerStyle={styles.recommendationsContent}
          >
            <TouchableOpacity onPress={() => handleLearnMore('turbulence')}>
              <LinearGradient
                colors={Colors.light.gradient.primary}
                style={styles.recommendationCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg' }}
                  style={styles.recommendationImage}
                />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Understanding Turbulence</Text>
                  <Text style={styles.recommendationDescription}>Learn what causes turbulence and why it's a normal part of flying</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleLearnMore('takeoff-landing')}>
              <LinearGradient
                colors={Colors.light.gradient.secondary}
                style={styles.recommendationCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg' }}
                  style={styles.recommendationImage}
                />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Takeoff & Landing Guide</Text>
                  <Text style={styles.recommendationDescription}>Expert tips for staying calm during takeoff and landing</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleLearnMore('sounds')}>
              <LinearGradient
                colors={Colors.light.gradient.accent}
                style={styles.recommendationCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg' }}
                  style={styles.recommendationImage}
                />
                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>Aircraft Sounds Explained</Text>
                  <Text style={styles.recommendationDescription}>Understanding common airplane noises and why they're normal</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Tip of the Day */}
        <Animated.View 
          entering={FadeInRight.delay(600).springify()}
        >
          <LinearGradient
            colors={Colors.light.gradient.accent}
            style={styles.tipContainer}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.tipTitle}>Tip of the Day</Text>
            <Text style={styles.tipHeading}>{dailyTip?.title}</Text>
            <Text style={styles.tipText}>{dailyTip?.content}</Text>
          </LinearGradient>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 32,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 32,
  },
  welcomeHeader: {
    flex: 1,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.light.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: 8,
  },
  welcomeMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 18,
    color: Colors.light.primary,
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  quickActionWrapper: {
    width: '47%',
  },
  quickActionCard: {
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  quickActionText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#ffffff',
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: Colors.light.text,
    marginBottom: 20,
  },
  recommendationsScroll: {
    marginHorizontal: -20,
  },
  recommendationsContent: {
    paddingHorizontal: 20,
    paddingBottom: 8,
    gap: 16,
  },
  recommendationCard: {
    borderRadius: 24,
    width: 300,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  recommendationImage: {
    width: '100%',
    height: 180,
  },
  recommendationContent: {
    padding: 20,
  },
  recommendationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  recommendationDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  tipContainer: {
    borderRadius: 24,
    padding: 24,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  tipTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: '#ffffff',
    marginBottom: 16,
  },
  tipHeading: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 8,
  },
  tipText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 26,
  },
});