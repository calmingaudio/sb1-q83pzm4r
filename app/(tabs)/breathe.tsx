import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ColorValue, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { breathingPatterns } from '@/constants/BreathingPatterns';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import BreathingExercise from '../../components/breathing/BreathingExercise';
import { useTheme } from '@/components/ThemeProvider';
import { X, TriangleAlert as AlertTriangle, ExternalLink, Lock, Crown, Sparkles, Zap, WifiOff } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PremiumBadge from '@/components/premium/PremiumBadge';
import { usePremium } from '@/context/premiumContext';
import { useOfflineContent } from '@/hooks/useOfflineContent';
import OfflineStatusBanner from '@/components/OfflineStatusBanner';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DISCLAIMER_KEY = 'breathe_disclaimer_dismissed';

interface BreathingPatternExtended {
  id: string;
  name: string;
  description: string;
  inhaleSeconds: number;
  exhaleSeconds: number;
  holdInhaleSeconds: number;
  holdExhaleSeconds: number;
  benefits: string[];
  totalCycles: number;
  citationUrl: string;
  sourceUrl?: string;
  sourceName?: string;
  isPremium?: boolean;
}

export default function BreatheScreen() {
  const { colors } = useTheme();
  const [selectedPattern, setSelectedPattern] = useState<BreathingPatternExtended | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [patterns, setPatterns] = useState<BreathingPatternExtended[]>([]);
  const { isPremium, showPremiumModal } = usePremium();
  const { 
    isOnline, 
    isAuthenticated, 
    canAccessFeature,
    getOfflineBreathingPatterns 
  } = useOfflineContent();

  useEffect(() => {
    checkDisclaimerStatus();
    loadBreathingPatterns();
  }, []);

  const loadBreathingPatterns = async () => {
    try {
      // Try to get patterns from offline storage first
      const offlinePatterns = await getOfflineBreathingPatterns();
      if (offlinePatterns) {
        createExtendedPatterns(offlinePatterns);
      } else {
        // Fallback to constants
        createExtendedPatterns(breathingPatterns);
      }
    } catch (error) {
      console.error('Error loading breathing patterns:', error);
      // Fallback to constants
      createExtendedPatterns(breathingPatterns);
    }
  };

  const createExtendedPatterns = (patternData: any[]) => {
    const extendedPatterns: BreathingPatternExtended[] = patternData.map(pattern => ({
      ...pattern,
      isPremium: pattern.id === 'box' || pattern.id === '478', // Last two patterns are premium
      sourceUrl: pattern.citationUrl,
      sourceName: pattern.id === 'box' ? 'MedicineNet' : 
                  pattern.id === '478' ? 'Dr. Andrew Weil' :
                  pattern.id === 'calm' || pattern.id === 'quick' ? 'UC Berkeley Health' :
                  pattern.id === 'deep' ? 'MedMate' : 'Scientific Research'
    }));
    setPatterns(extendedPatterns);
  };

  const checkDisclaimerStatus = async () => {
    try {
      const dismissed = await AsyncStorage.getItem(DISCLAIMER_KEY);
      if (!dismissed) {
        setShowDisclaimer(true);
      }
    } catch (error) {
      console.error('Error checking disclaimer status:', error);
      setShowDisclaimer(true);
    }
  };

  const dismissDisclaimer = async () => {
    try {
      await AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
      setShowDisclaimer(false);
    } catch (error) {
      console.error('Error saving disclaimer status:', error);
      setShowDisclaimer(false); // Still dismiss even if we can't save
    }
  };

  const handleSourceLink = async (url: string) => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      console.error('Error opening source link:', error);
    }
  };

  const handlePatternSelect = (pattern: BreathingPatternExtended) => {
    if (pattern.isPremium && !isPremium) {
      showPremiumModal();
    } else {
      setSelectedPattern(pattern);
    }
  };

  // Separate free and premium patterns
  const freePatterns = patterns.filter(pattern => !pattern.isPremium);
  const premiumPatterns = patterns.filter(pattern => pattern.isPremium);

  const styles = createStyles(colors);
  
  if (selectedPattern) {
    return <BreathingExercise pattern={selectedPattern} onClose={() => setSelectedPattern(null)} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      {/* Medical Disclaimer Modal */}
      {showDisclaimer && (
        <View style={styles.disclaimerOverlay}>
          <Animated.View 
            style={styles.disclaimerModal}
            entering={FadeInDown.delay(200).springify()}
          >
            <View style={styles.disclaimerHeader}>
              <View style={styles.disclaimerIconContainer}>
                <AlertTriangle size={24} color={colors.warning} strokeWidth={2.5} />
              </View>
              <TouchableOpacity 
                style={styles.disclaimerCloseButton}
                onPress={dismissDisclaimer}
              >
                <X size={20} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
            
            <Text style={styles.disclaimerText}>
              The breathing exercises in this app are for relaxation and stress management purposes only. 
              They are not intended to diagnose, treat, cure, or prevent any medical condition.
            </Text>
            
            <Text style={styles.disclaimerText}>
              If you have any respiratory conditions, heart problems, or other medical concerns, 
              please consult with your healthcare provider before using these breathing techniques.
            </Text>
            
            <Text style={styles.disclaimerText}>
              If you experience dizziness, shortness of breath, or any discomfort during the exercises, 
              stop immediately and seek medical attention if necessary.
            </Text>
            
            <TouchableOpacity 
              style={styles.disclaimerButton}
              onPress={dismissDisclaimer}
            >
              <LinearGradient
                colors={Colors.light.gradient.primary}
                style={styles.disclaimerButtonGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.disclaimerButtonText}>I Understand</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>
        </View>
      )}

      {/* Modern Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).springify()}
      >
        <LinearGradient
          colors={Colors.light.gradient.primary}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <Text style={styles.title}>Breathe & Relax</Text>
            <Text style={styles.subtitle}>Choose a technique to find your calm</Text>
          </View>
        </LinearGradient>
      </Animated.View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Offline Status Banner */}
        <OfflineStatusBanner />

        {/* Quick Start Section */}
        <Animated.View 
          style={styles.quickStartSection}
          entering={FadeInDown.delay(200).springify()}
        >
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <TouchableOpacity
            onPress={() => handlePatternSelect(patterns[0])}
            style={styles.quickStartCard}
            disabled={!canAccessFeature('breathing')}
          >
            <LinearGradient
              colors={[colors.secondary, colors.secondaryLight]}
              style={styles.quickStartGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.quickStartContent}>
                <View style={styles.quickStartIcon}>
                  <Text style={styles.quickStartEmoji}>🫁</Text>
                </View>
                <View style={styles.quickStartText}>
                  <Text style={styles.quickStartTitle}>Start Breathing Now</Text>
                  <Text style={styles.quickStartSubtitle}>Begin with our most popular technique</Text>
                </View>
                {!canAccessFeature('breathing') && (
                  <View style={styles.offlineIndicator}>
                    <WifiOff size={16} color={colors.textSecondary} />
                  </View>
                )}
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Free Patterns Section */}
        <Animated.View 
          style={styles.patternsSection}
          entering={FadeInDown.delay(300).springify()}
        >
          <Text style={styles.sectionTitle}>Free Techniques</Text>
          <View style={styles.patternsGrid}>
            {freePatterns.map((pattern, index) => (
              <TouchableOpacity
                key={pattern.id}
                style={styles.patternCard}
                onPress={() => handlePatternSelect(pattern)}
                disabled={!canAccessFeature('breathing')}
              >
                <LinearGradient
                  colors={[colors.card, colors.backgroundSecondary]}
                  style={styles.patternGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.patternHeader}>
                    <Text style={styles.patternName}>{pattern.name}</Text>
                    <View style={styles.patternDuration}>
                      <Text style={styles.patternDurationText}>
                        {pattern.totalCycles} cycles
                      </Text>
                    </View>
                  </View>
                  
                  <Text style={styles.patternDescription}>
                    {pattern.description}
                  </Text>
                  
                  <View style={styles.patternBenefits}>
                    {pattern.benefits.slice(0, 2).map((benefit, idx) => (
                      <View key={idx} style={styles.benefitTag}>
                        <Text style={styles.benefitText}>{benefit}</Text>
                      </View>
                    ))}
                  </View>
                  
                  {pattern.sourceName && (
                    <TouchableOpacity
                      style={styles.sourceLink}
                      onPress={() => handleSourceLink(pattern.sourceUrl || '')}
                    >
                      <ExternalLink size={12} color={colors.primary} strokeWidth={2} />
                      <Text style={styles.sourceText}>{pattern.sourceName}</Text>
                    </TouchableOpacity>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Premium Patterns Section */}
        {premiumPatterns.length > 0 && (
          <Animated.View 
            style={styles.premiumSection}
            entering={FadeInDown.delay(400).springify()}
          >
            <View style={styles.premiumHeader}>
              <Text style={styles.sectionTitle}>Premium Techniques</Text>
              <PremiumBadge />
            </View>
            <View style={styles.patternsGrid}>
              {premiumPatterns.map((pattern) => (
                <TouchableOpacity
                  key={pattern.id}
                  style={styles.patternCard}
                  onPress={() => handlePatternSelect(pattern)}
                  disabled={!canAccessFeature('breathing')}
                >
                  <LinearGradient
                    colors={[colors.card, colors.backgroundSecondary]}
                    style={styles.patternGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <View style={styles.patternHeader}>
                      <Text style={styles.patternName}>{pattern.name}</Text>
                      <View style={styles.premiumBadge}>
                        <Crown size={12} color={colors.primary} strokeWidth={2} />
                      </View>
                    </View>
                    
                    <Text style={styles.patternDescription}>
                      {pattern.description}
                    </Text>
                    
                    <View style={styles.patternBenefits}>
                      {pattern.benefits.slice(0, 2).map((benefit, idx) => (
                        <View key={idx} style={styles.benefitTag}>
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                    
                    {pattern.sourceName && (
                      <TouchableOpacity
                        style={styles.sourceLink}
                        onPress={() => handleSourceLink(pattern.sourceUrl || '')}
                      >
                        <ExternalLink size={12} color={colors.primary} strokeWidth={2} />
                        <Text style={styles.sourceText}>{pattern.sourceName}</Text>
                      </TouchableOpacity>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  disclaimerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    paddingHorizontal: 20,
  },
  disclaimerModal: {
    backgroundColor: colors.card,
    borderRadius: 24,
    padding: 24,
    maxWidth: 400,
    width: '100%',
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: {
        elevation: 12,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
    }),
  },
  disclaimerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  disclaimerIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerCloseButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  disclaimerText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
    textAlign: 'left',
  },
  disclaimerButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  disclaimerButtonGradient: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  disclaimerButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  header: {
    marginBottom: 24,
  },
  headerGradient: {
    paddingHorizontal: 24,
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerContent: {
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#ffffff',
    marginVertical: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  quickStartSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 16,
  },
  quickStartCard: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: colors.card, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 12,
      },
    }),
  },
  quickStartGradient: {
    padding: 24,
  },
  quickStartContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quickStartIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  quickStartEmoji: {
    fontSize: 28,
  },
  quickStartText: {
    flex: 1,
  },
  quickStartTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  quickStartSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  patternsSection: {
    marginBottom: 32,
  },
  patternsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  patternCard: {
    width: '48%', // Two columns
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
    }),
  },
  patternGradient: {
    padding: 16,
    borderRadius: 16,
  },
  patternHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  patternName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  patternDuration: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  patternDurationText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  patternDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 12,
  },
  patternBenefits: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  benefitTag: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  sourceLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  sourceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  offlineIndicator: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.warning,
    borderRadius: 12,
    padding: 4,
    zIndex: 1,
  },
  premiumSection: {
    marginBottom: 32,
  },
  premiumHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  premiumBadge: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 4,
  },
  bottomSpacing: {
    height: 100,
  },
  citationsSection: {
    marginBottom: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  citationsSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
  },
  disclaimerBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: colors.warning,
  },
  disclaimerIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  disclaimerBannerText: {
    flex: 1,
  },
  disclaimerBannerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  disclaimerBannerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  citationsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  citationItem: {
    backgroundColor: colors.card,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
      web: {
        shadowColor: colors.text,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
    }),
  },
  citationContent: {
    gap: 6,
  },
  citationPatternName: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.text,
  },
  citationSource: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  citationSourceText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
});