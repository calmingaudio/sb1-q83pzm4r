import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ColorValue, Linking, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Colors from '@/constants/Colors';
import { breathingPatterns } from '@/constants/BreathingPatterns';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import BreathingExercise from '../../components/breathing/BreathingExercise';
import { useTheme } from '@/components/ThemeProvider';
import { Users, Star, X, TriangleAlert as AlertTriangle, ExternalLink, Lock, Crown, Sparkles, Zap } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PremiumModal from '@/components/premium/PremiumModal';
import PremiumBadge from '@/components/premium/PremiumBadge';
import { usePremium } from '@/hooks/usePremium';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DISCLAIMER_KEY = 'breathe_disclaimer_dismissed';

interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  inhaleSeconds: number;
  exhaleSeconds: number;
  holdInhaleSeconds: number;
  holdExhaleSeconds: number;
  benefits: string[];
  citationUrl?: string;
  sourceUrl?: string;
  sourceName?: string;
  isPremium?: boolean;
}

export default function BreatheScreen() {
  const { colors } = useTheme();
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { isPremium, isLoading: premiumLoading, simulatePremiumPurchase, restorePurchases } = usePremium();

  useEffect(() => {
    checkDisclaimerStatus();
  }, []);

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

  const handlePatternSelect = (pattern: BreathingPattern) => {
    if (pattern.isPremium && !isPremium) {
      setShowPremiumModal(true);
    } else {
      setSelectedPattern(pattern);
    }
  };

  const handlePremiumPurchase = async () => {
    setIsProcessing(true);
    try {
      // In a real app, this would integrate with RevenueCat
      // For demo purposes, we'll simulate the purchase
      await simulatePremiumPurchase();
      setShowPremiumModal(false);
      
      // Show success message or automatically start the selected pattern
      // For now, we'll just close the modal
    } catch (error) {
      console.error('Error purchasing premium:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRestorePurchases = async () => {
    setIsProcessing(true);
    try {
      await restorePurchases();
    } catch (error) {
      console.error('Error restoring purchases:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Separate free and premium patterns
  const freePatterns = breathingPatterns.filter(pattern => !pattern.isPremium);
  const premiumPatterns = breathingPatterns.filter(pattern => pattern.isPremium);

  const styles = createStyles(colors);
  
  if (selectedPattern) {
    return <BreathingExercise pattern={selectedPattern} onClose={() => setSelectedPattern(null)} />;
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchase={handlePremiumPurchase}
        onRestore={handleRestorePurchases}
        isLoading={isProcessing}
      />

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
                colors={Colors.light.gradient.primary as [ColorValue, ColorValue, ...ColorValue[]]}
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
          colors={Colors.light.gradient.primary as [ColorValue, ColorValue, ...ColorValue[]]}
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
        {/* Quick Start Section */}
        <Animated.View 
          style={styles.quickStartSection}
          entering={FadeInDown.delay(200).springify()}
        >
          <Text style={styles.sectionTitle}>Quick Start</Text>
          <TouchableOpacity
            onPress={() => handlePatternSelect(breathingPatterns[0])}
            style={styles.quickStartCard}
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
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Free Techniques Section */}
        <View style={styles.patternsSection}>
          <Text style={styles.sectionTitle}>Free Techniques</Text>
          {freePatterns.map((pattern, index) => (
            <Animated.View
              key={pattern.id}
              entering={FadeInDown.delay(300 + index * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handlePatternSelect(pattern)}
                style={styles.patternCard}
              >
                <View style={styles.patternHeader}>
                  <View style={styles.patternTitleSection}>
                    <View style={styles.patternTitleRow}>
                      <Text style={styles.patternName}>{pattern.name}</Text>
                    </View>
                    <Text style={styles.patternDescription}>{pattern.description}</Text>
                  </View>
                  <View style={styles.patternMeta}>
                    <View style={styles.metaItem}>
                      <Users size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.metaText}>Popular</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star size={14} color={colors.accent} strokeWidth={2} fill={colors.accent} />
                      <Text style={styles.metaText}>4.8</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.patternContent}>
                  <View style={styles.timingsContainer}>
                    <View style={styles.timingColumn}>
                      <Text style={styles.timingValue}>{pattern.inhaleSeconds}s</Text>
                      <Text style={styles.timingLabel}>Inhale</Text>
                    </View>
                    
                    {pattern.holdInhaleSeconds > 0 && (
                      <View style={styles.timingColumn}>
                        <Text style={styles.timingValue}>{pattern.holdInhaleSeconds}s</Text>
                        <Text style={styles.timingLabel}>Hold</Text>
                      </View>
                    )}
                    
                    <View style={styles.timingColumn}>
                      <Text style={styles.timingValue}>{pattern.exhaleSeconds}s</Text>
                      <Text style={styles.timingLabel}>Exhale</Text>
                    </View>
                    
                    {pattern.holdExhaleSeconds > 0 && (
                      <View style={styles.timingColumn}>
                        <Text style={styles.timingValue}>{pattern.holdExhaleSeconds}s</Text>
                        <Text style={styles.timingLabel}>Rest</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.benefitsContainer}>
                    <Text style={styles.benefitsTitle}>Benefits</Text>
                    <View style={styles.benefitsList}>
                      {pattern.benefits.slice(0, 2).map((benefit, idx) => (
                        <View key={idx} style={styles.benefitItem}>
                          <View style={styles.benefitDot} />
                          <Text style={styles.benefitText}>{benefit}</Text>
                        </View>
                      ))}
                    </View>
                  </View>

                  {/* Source Link */}
                  {pattern.sourceUrl && pattern.sourceName && (
                    <TouchableOpacity 
                      style={styles.sourceContainer}
                      onPress={() => handleSourceLink(pattern.sourceUrl)}
                    >
                      <ExternalLink size={12} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.sourceText}>Source: {pattern.sourceName}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Premium Techniques Section */}
        <View style={styles.premiumSection}>
          <Animated.View 
            style={styles.premiumSectionHeader}
            entering={FadeInDown.delay(600).springify()}
          >
            <LinearGradient
              colors={['#FFD700', '#FFA500', '#FF6B35']}
              style={styles.premiumHeaderGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.premiumHeaderContent}>
                <View style={styles.premiumHeaderLeft}>
                  <Crown size={24} color="#ffffff" strokeWidth={2.5} />
                  <Text style={styles.premiumSectionTitle}>Premium Techniques</Text>
                </View>
                <View style={styles.premiumHeaderRight}>
                  <Sparkles size={20} color="#ffffff" strokeWidth={2} />
                </View>
              </View>
              <Text style={styles.premiumSectionSubtitle}>
                Professional-grade breathing methods used by military, medical professionals, and anxiety specialists
              </Text>
            </LinearGradient>
          </Animated.View>

          {!isPremium && (
            <Animated.View 
              style={styles.premiumUpgradeCard}
              entering={FadeInDown.delay(700).springify()}
            >
              <TouchableOpacity
                onPress={() => setShowPremiumModal(true)}
                style={styles.premiumUpgradeButton}
              >
                <LinearGradient
                  colors={['#6366f1', '#8b5cf6', '#a855f7']}
                  style={styles.premiumUpgradeGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.premiumUpgradeContent}>
                    <View style={styles.premiumUpgradeIcon}>
                      <Zap size={28} color="#ffffff" strokeWidth={2.5} />
                    </View>
                    <View style={styles.premiumUpgradeText}>
                      <Text style={styles.premiumUpgradeTitle}>Unlock Premium Techniques</Text>
                      <Text style={styles.premiumUpgradeSubtitle}>
                        Get instant access to 4 advanced breathing methods • 7-day free trial
                      </Text>
                    </View>
                    <View style={styles.premiumUpgradeArrow}>
                      <Text style={styles.premiumUpgradeArrowText}>→</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          )}

          {premiumPatterns.map((pattern, index) => (
            <Animated.View
              key={pattern.id}
              entering={FadeInDown.delay(800 + index * 100).springify()}
            >
              <TouchableOpacity
                onPress={() => handlePatternSelect(pattern)}
                style={[
                  styles.premiumPatternCard,
                  !isPremium && styles.lockedPatternCard
                ]}
              >
                {/* Premium Glow Effect */}
                {isPremium && (
                  <LinearGradient
                    colors={['#FFD700', '#FFA500', '#FF6B35']}
                    style={styles.premiumGlow}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  />
                )}

                <View style={styles.patternHeader}>
                  <View style={styles.patternTitleSection}>
                    <View style={styles.patternTitleRow}>
                      <Text style={[styles.patternName, isPremium && styles.premiumPatternName]}>
                        {pattern.name}
                      </Text>
                      <View style={styles.premiumBadgeContainer}>
                        <PremiumBadge size="small" />
                      </View>
                    </View>
                    <Text style={styles.patternDescription}>{pattern.description}</Text>
                  </View>
                  <View style={styles.patternMeta}>
                    <View style={styles.metaItem}>
                      <Users size={14} color={colors.textSecondary} strokeWidth={2} />
                      <Text style={styles.metaText}>Professional</Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Star size={14} color="#FFD700" strokeWidth={2} fill="#FFD700" />
                      <Text style={styles.metaText}>4.9</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.patternContent}>
                  {!isPremium ? (
                    <View style={styles.premiumLockedContent}>
                      <LinearGradient
                        colors={['#FF6B35', '#FFD700']}
                        style={styles.premiumLockedGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Crown size={32} color="#ffffff" strokeWidth={2.5} />
                        <Text style={styles.premiumLockedTitle}>Premium Technique</Text>
                        <Text style={styles.premiumLockedSubtext}>
                          Unlock this advanced breathing method with SkyCalm Premium
                        </Text>
                        <View style={styles.premiumLockedFeatures}>
                          <Text style={styles.premiumLockedFeature}>✓ Battle-tested effectiveness</Text>
                          <Text style={styles.premiumLockedFeature}>✓ Professional-grade technique</Text>
                          <Text style={styles.premiumLockedFeature}>✓ Instant anxiety relief</Text>
                        </View>
                      </LinearGradient>
                    </View>
                  ) : (
                    <>
                      <View style={styles.timingsContainer}>
                        <View style={styles.timingColumn}>
                          <Text style={styles.timingValue}>{pattern.inhaleSeconds}s</Text>
                          <Text style={styles.timingLabel}>Inhale</Text>
                        </View>
                        
                        {pattern.holdInhaleSeconds > 0 && (
                          <View style={styles.timingColumn}>
                            <Text style={styles.timingValue}>{pattern.holdInhaleSeconds}s</Text>
                            <Text style={styles.timingLabel}>Hold</Text>
                          </View>
                        )}
                        
                        <View style={styles.timingColumn}>
                          <Text style={styles.timingValue}>{pattern.exhaleSeconds}s</Text>
                          <Text style={styles.timingLabel}>Exhale</Text>
                        </View>
                        
                        {pattern.holdExhaleSeconds > 0 && (
                          <View style={styles.timingColumn}>
                            <Text style={styles.timingValue}>{pattern.holdExhaleSeconds}s</Text>
                            <Text style={styles.timingLabel}>Rest</Text>
                          </View>
                        )}
                      </View>

                      <View style={styles.benefitsContainer}>
                        <Text style={styles.benefitsTitle}>Benefits</Text>
                        <View style={styles.benefitsList}>
                          {pattern.benefits.slice(0, 2).map((benefit, idx) => (
                            <View key={idx} style={styles.benefitItem}>
                              <View style={styles.benefitDot} />
                              <Text style={styles.benefitText}>{benefit}</Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Source Link */}
                      {pattern.sourceUrl && pattern.sourceName && (
                        <TouchableOpacity 
                          style={styles.sourceContainer}
                          onPress={() => handleSourceLink(pattern.sourceUrl)}
                        >
                          <ExternalLink size={12} color={colors.textSecondary} strokeWidth={2} />
                          <Text style={styles.sourceText}>Source: {pattern.sourceName}</Text>
                        </TouchableOpacity>
                      )}
                    </>
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
    marginBottom: 8,
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
  premiumSection: {
    marginBottom: 32,
  },
  premiumSectionHeader: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
    }),
  },
  premiumHeaderGradient: {
    padding: 24,
  },
  premiumHeaderContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  premiumHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumSectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#ffffff',
  },
  premiumHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  premiumSectionSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  premiumUpgradeCard: {
    marginBottom: 20,
  },
  premiumUpgradeButton: {
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
      },
    }),
  },
  premiumUpgradeGradient: {
    padding: 24,
  },
  premiumUpgradeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumUpgradeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  premiumUpgradeText: {
    flex: 1,
  },
  premiumUpgradeTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 4,
  },
  premiumUpgradeSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  premiumUpgradeArrow: {
    marginLeft: 12,
  },
  premiumUpgradeArrowText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#ffffff',
  },
  patternCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 16,
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
  premiumPatternCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
    }),
  },
  premiumGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  lockedPatternCard: {
    borderWidth: 2,
    borderColor: '#FF6B35',
  },
  patternHeader: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  patternTitleSection: {
    marginBottom: 12,
  },
  patternTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  patternName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    flex: 1,
  },
  premiumPatternName: {
    color: '#FF6B35',
  },
  premiumBadgeContainer: {
    marginLeft: 8,
  },
  patternDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  patternMeta: {
    flexDirection: 'row',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
  },
  patternContent: {
    padding: 20,
  },
  premiumLockedContent: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  premiumLockedGradient: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  premiumLockedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
    marginTop: 12,
    marginBottom: 8,
  },
  premiumLockedSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  premiumLockedFeatures: {
    alignItems: 'center',
    gap: 6,
  },
  premiumLockedFeature: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  timingsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 12,
  },
  timingColumn: {
    alignItems: 'center',
  },
  timingValue: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.primary,
    marginBottom: 4,
  },
  timingLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
  },
  benefitsContainer: {
    gap: 8,
    marginBottom: 16,
  },
  benefitsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  benefitsList: {
    gap: 6,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
    flex: 1,
  },
  sourceContainer: {
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
  bottomSpacing: {
    height: 100,
  },
});