// app/(tabs)/home.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  ColorValue,
  Dimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  Wind,
  BookOpen,
  CircleAlert as AlertCircle,
  BookType,
  Settings,
  Shield, 
  PenTool,
  Sparkles, 
  RefreshCw, 
  Info, 
  Zap, 
  Music, 
  Brain, 
  Headphones, 
  Heart, 
  Plane, 
  Volume2
} from "lucide-react-native";
import Colors from "@/constants/Colors";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Animated, { FadeInDown, FadeInRight, FadeInUp } from "react-native-reanimated";
import { useOfflineContext } from "@/components/OfflineProvider";
import { useDailyTip } from "@/hooks/useDailyTip";
import { useAviationStats } from '@/hooks/useAviationStats';
import { useTheme } from '@/components/ThemeProvider';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Type definitions
type QuickActionType = "breathe" | "sos" | "learn" | "journal";
type CategoryType = "turbulence" | "takeoff-landing" | "sounds";

interface QuickAction {
  icon: React.ComponentType<any>;
  text: string;
  gradient: string[];
  delay: number;
  action: QuickActionType;
}

export default function HomeScreen() {
  const { colors } = useTheme();
  const { currentUser } = useOfflineContext();
  const dailyTip = useDailyTip();
  const greeting = getGreeting();
  const insets = useSafeAreaInsets();
  const { currentStat, isLoading, getNextStat } = useAviationStats();

  const firstName = currentUser?.displayName?.split(' ')[0] || "Traveler";

  function getGreeting(): string {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
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
        router.push('/learn');
        break;
      case 'journal':
        router.push('/(tabs)/journal');
        break;
      case 'music':
        router.push('/(tabs)/music');
        break;
      case 'nature-sounds':
        router.push({
          pathname: '/(tabs)/music',
          params: { category: 'sounds' }
        });
        break;
      case 'relaxing-music':
        router.push({
          pathname: '/(tabs)/music',
          params: { category: 'music' }
        });
        break;
      case 'pre-flight-meditation':
        router.push({
          pathname: '/(tabs)/music',
          params: { category: 'pre-flight-meditation' }
        });
        break;
      case 'in-flight-meditation':
        router.push({
          pathname: '/(tabs)/music',
          params: { category: 'in-flight-meditation' }
        });
        break;
      case 'getting-ready-meditation':
        router.push({
          pathname: '/(tabs)/music',
          params: { category: 'getting-ready-meditation' }
        });
        break;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'safety': return '#10b981';
      case 'training': return '#6366f1';
      case 'technology': return '#06b6d4';
      case 'statistics': return '#f59e0b';
      default: return colors.primary;
    }
  };

  const handleLearnMore = (categoryId: string, faqId?: string) => {
    if (faqId) {
      router.push({
        pathname: '/learn',
        params: { category: categoryId, faq: faqId }
      });
    } else {
      router.push({
        pathname: '/learn',
        params: { category: categoryId }
      });
    }
  };

  const handleSettingsPress = (): void => {
    router.push("/profile");
  };

  const styles = createStyles(colors);

  const quickActions: QuickAction[] = [
    {
      icon: Wind,
      text: "Quick Breathe",
      gradient: Colors.light.gradient.primary,
      delay: 200,
      action: "breathe",
    },
    {
      icon: AlertCircle,
      text: "Panic Mode",
      gradient: Colors.light.gradient.accent,
      delay: 300,
      action: "sos",
    },
    {
      icon: BookOpen,
      text: "Flying FAQs",
      gradient: Colors.light.gradient.secondary,
      delay: 400,
      action: "learn",
    },
    {
      icon: BookType,
      text: "Journal",
      gradient: ["#9333ea", "#a855f7", "#c084fc"],
      delay: 500,
      action: "journal",
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modern Header */}
        <Animated.View 
          style={styles.headerContainer}
          entering={FadeInUp.delay(100).springify()}
        >
          <View style={styles.headerContent}>
            <View style={styles.greetingSection}>
              <Text style={styles.greeting}>{greeting}</Text>
              <Text style={styles.userName}>{firstName} ✈️</Text>
              <Text style={styles.welcomeMessage}>Ready for peaceful skies?</Text>
            </View>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={handleSettingsPress}
            >
              <Settings size={22} color={colors.textSecondary} strokeWidth={2} />
            </TouchableOpacity>
          </View>
          
          {/* Compact Aviation Safety Fact */}
          <Animated.View 
            style={styles.aviationFactContainer}
            entering={FadeInRight.delay(200).springify()}
          >
            {!isLoading && currentStat && (
              <View style={styles.aviationFactCard}>
                <View style={styles.aviationFactHeader}>
                  <View style={styles.aviationFactIcon}>
                    <Zap size={16} color={getCategoryColor(currentStat.category)} strokeWidth={2.5} />
                  </View>
                  <View style={[styles.factCategoryBadge, { backgroundColor: getCategoryColor(currentStat.category) }]}>
                    <Text style={styles.factCategoryText}>{currentStat.category.toUpperCase()}</Text>
                  </View>
                  <TouchableOpacity onPress={getNextStat} style={styles.factRefreshButton}>
                    <RefreshCw size={14} color={colors.textSecondary} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.aviationFactTitle}>{currentStat.title}</Text>
                <Text style={styles.aviationFactDescription}>{currentStat.description}</Text>
              </View>
            )}
          </Animated.View>
        </Animated.View>

        {/* Quick Actions Grid */}
        <Animated.View 
          style={styles.quickActionsContainer}
          entering={FadeInDown.delay(300).springify()}
        >
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActions}>
            {[
              { 
                icon: Wind, 
                text: 'Breathing Exercise',
                subtitle: 'Calm your mind',
                gradient: (colors.gradient?.primary || ['#6366f1', '#8b5cf6']) as unknown as readonly [string, string, ...string[]],
                delay: 400,
                action: 'breathe'
              },
              { 
                icon: Heart, 
                text: 'Getting Ready Meditations',
                subtitle: 'Prepare for your journey',
                gradient: ['#f59e0b', '#f97316'] as readonly [string, string, ...string[]],
                delay: 450,
                action: 'getting-ready-meditation'
              },
              { 
                icon: Brain, 
                text: 'Pre-Flight Calm Meditations',
                subtitle: 'Guided meditation',
                gradient: ['#8b5cf6', '#a855f7'] as readonly [string, string, ...string[]],
                delay: 500,
                action: 'pre-flight-meditation'
              },
              { 
                icon: Plane, 
                text: 'Onboard Ease Meditations',
                subtitle: 'Peaceful journey',
                gradient: ['#06b6d4', '#22d3ee'] as readonly [string, string, ...string[]],
                delay: 550,
                action: 'in-flight-meditation'
              },
              { 
                icon: Shield, 
                text: 'Emergency SOS',
                subtitle: 'Instant relief',
                gradient: ['#ef4444', '#f87171'] as readonly [string, string, ...string[]],
                delay: 600,
                action: 'sos'
              },
              { 
                icon: BookOpen, 
                text: 'Flight Q&A\'s',
                subtitle: 'Understanding flight',
                gradient: (colors.gradient?.accent || ['#10b981', '#34d399']) as unknown as readonly [string, string, ...string[]],
                delay: 650,
                action: 'learn'
              },
              { 
                icon: PenTool, 
                text: 'Journal Entry',
                subtitle: 'Track your progress',
                gradient: (colors.gradient?.secondary || ['#9333ea', '#a855f7']) as unknown as readonly [string, string, ...string[]],
                delay: 700,
                action: 'journal'
              },
              { 
                icon: Volume2, 
                text: 'Nature Sounds',
                subtitle: 'Calming natural audio',
                gradient: ['#10b981', '#34d399'] as readonly [string, string, ...string[]],
                delay: 750,
                action: 'nature-sounds'
              },
              { 
                icon: Music, 
                text: 'Relaxing Music',
                subtitle: 'Peaceful melodies',
                gradient: ['#8b5cf6', '#c084fc'] as readonly [string, string, ...string[]],
                delay: 800,
                action: 'relaxing-music'
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
                  <View style={styles.quickActionIconContainer}>
                    <action.icon size={28} color="#ffffff" strokeWidth={2.5} />
                  </View>
                  <View style={styles.quickActionTextContainer}>
                    <Text style={styles.quickActionText}>{action.text}</Text>
                    <Text style={styles.quickActionSubtitle}>{action.subtitle}</Text>
                  </View>
                </LinearGradient>
              </AnimatedTouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Featured Content */}
        <Animated.View 
          style={styles.section}
          entering={FadeInRight.delay(600).springify()}
        >
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured for You</Text>
            <TouchableOpacity onPress={() => router.push('/learn')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.featuredScroll}
            contentContainerStyle={styles.featuredContent}
          >
            <TouchableOpacity onPress={() => handleLearnMore('turbulence', 'turb_1')}>
              <View style={styles.featuredCard}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg' }}
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredOverlay}
                />
                <View style={styles.featuredContent}>
                  <View style={styles.featuredBadge}>
                    <Text style={styles.featuredBadgeText}>Popular</Text>
                  </View>
                  <Text style={styles.featuredTitle}>What is turbulence, really?</Text>
                  <Text style={styles.featuredDescription}>Learn why turbulence is completely normal and safe</Text>
                </View>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={() => handleLearnMore('takeoff-landing', 'tl_1')}>
              <View style={styles.featuredCard}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/46148/aircraft-jet-landing-cloud-46148.jpeg' }}
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredOverlay}
                />
                <View style={styles.featuredContent}>
                  <View style={[styles.featuredBadge, { backgroundColor: colors.secondary }]}>
                    <Text style={styles.featuredBadgeText}>Essential</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Why does takeoff feel so intense?</Text>
                  <Text style={styles.featuredDescription}>Understanding the takeoff process and sensations</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleLearnMore('sounds', 'sound_1')}>
              <View style={styles.featuredCard}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg' }}
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredOverlay}
                />
                <View style={styles.featuredContent}>
                  <View style={[styles.featuredBadge, { backgroundColor: colors.accent }]}>
                    <Text style={styles.featuredBadgeText}>New</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Why are airplanes so noisy?</Text>
                  <Text style={styles.featuredDescription}>Decode every sound you hear during flight</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handleLearnMore('safety', 'safety_1')}>
              <View style={styles.featuredCard}>
                <Image 
                  source={{ uri: 'https://images.pexels.com/photos/2007401/pexels-photo-2007401.jpeg' }}
                  style={styles.featuredImage}
                />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.featuredOverlay}
                />
                <View style={styles.featuredContent}>
                  <View style={[styles.featuredBadge, { backgroundColor: '#10b981' }]}>
                    <Text style={styles.featuredBadgeText}>Safety</Text>
                  </View>
                  <Text style={styles.featuredTitle}>Are airplanes really the safest?</Text>
                  <Text style={styles.featuredDescription}>The facts about aviation safety statistics</Text>
                </View>
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Animated.View>

        {/* Daily Insight */}
        <Animated.View 
          entering={FadeInUp.delay(800).springify()}
          style={styles.dailyInsightContainer}
        >
          <LinearGradient
            colors={[colors.primary, colors.primaryLight]}
            style={styles.dailyInsight}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View style={styles.dailyInsightHeader}>
              <View style={styles.dailyInsightIcon}>
                <Sparkles size={24} color="#ffffff" strokeWidth={2.5} />
              </View>
              <View>
                <Text style={styles.dailyInsightLabel}>Daily Insight</Text>
                <Text style={styles.dailyInsightDate}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'short', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            </View>
            <Text style={styles.dailyInsightTitle}>{dailyTip?.title}</Text>
            <Text style={styles.dailyInsightText}>{dailyTip?.content}</Text>
          </LinearGradient>
        </Animated.View>

        {/* Bottom Spacing for Tab Bar */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  headerContainer: {
    marginBottom: 32,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: colors.text,
    marginBottom: 8,
    lineHeight: 34,
  },
  welcomeMessage: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: colors.primary,
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 16,
  },
  aviationFactContainer: {
    marginTop: 8,
  },
  aviationFactCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  aviationFactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  aviationFactIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  factCategoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    flex: 1,
  },
  factCategoryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 9,
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  factRefreshButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aviationFactTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: colors.text,
    marginBottom: 6,
    lineHeight: 20,
  },
  aviationFactDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  quickActionsContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 22,
    color: colors.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  quickActions: {
    gap: 12,
  },
  quickActionWrapper: {
    marginBottom: 4,
  },
  quickActionCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: 'rgba(0, 0, 0, 0.1)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
    }),
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickActionTextContainer: {
    flex: 1,
  },
  quickActionText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
    marginBottom: 4,
  },
  quickActionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  section: {
    marginBottom: 32,
  },
  featuredScroll: {
    marginHorizontal: -20,
  },
  featuredContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  featuredCard: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: colors.card,
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 16,
      },
    }),
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  featuredOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
  },
  featuredBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  featuredBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  featuredTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  featuredDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  dailyInsightContainer: {
    marginBottom: 32,
  },
  dailyInsight: {
    borderRadius: 24,
    padding: 24,
    backgroundColor: colors.card,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },
  dailyInsightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  dailyInsightIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dailyInsightLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  dailyInsightDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  dailyInsightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 8,
  },
  dailyInsightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  bottomSpacing: {
    height: 100,
  },
});