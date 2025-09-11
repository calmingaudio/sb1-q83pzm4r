import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Modal, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { X, Crown, Check, WifiOff } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import { usePremium } from '@/context/premiumContext';
import { useOfflineContext } from '@/components/OfflineProvider';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface Props {
  visible: boolean;
  onClose: () => void;
  // Allow callers that return boolean (success) or void for compatibility
  onPurchase: (planId: 'monthly' | 'annual') => Promise<boolean | void> | boolean | void;
  onStartTrial: (planId?: 'monthly' | 'annual') => Promise<boolean | void> | boolean | void;
  onRestore: () => Promise<boolean | void> | boolean | void;
  isLoading?: boolean;
  isTrialEligible?: boolean;
}

const handleOpenURL = (url: string) => {
  Linking.canOpenURL(url).then(supported => {
    if (supported) {
      Linking.openURL(url);
    } else {
      console.warn("Don't know how to open URI: " + url);
    }
  });
};

const premiumFeatures = [
  {
    icon: '🫁',
    title: '4-7-8 Breathing',
    description: 'Dr. Weil\'s proven method for deep relaxation and anxiety reduction'
  },
  {
    icon: '🎖️',
    title: 'Military Tactical Breathing',
    description: 'Battle-tested technique used by military personnel for stress management'
  },
  {
    icon: '📦',
    title: 'Box Breathing',
    description: 'Navy SEAL technique for focus and stress control in high-pressure situations'
  },
  {
    icon: '🧘‍♀️',
    title: 'Pre-Flight Meditations',
    description: 'Guided meditations to prepare for your journey and reduce pre-flight anxiety'
  },
  {
    icon: '✈️',
    title: 'In-Flight Meditations',
    description: 'Deep relaxation sessions designed specifically for during your flight'
  },
  {
    icon: '💬',
    title: 'Affirmations',
    description: 'Powerful positive affirmations for confidence and inner peace while flying'
  }
];

export default function PremiumModal({ visible, onClose, onPurchase, onRestore, isLoading = false, isTrialEligible = true }: Props) {
  const { colors } = useTheme();
  const { isPremium, plans } = usePremium();
  const { isOnline } = useOfflineContext();
  const [purchaseSuccess, setPurchaseSuccess] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'annual'>('annual');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const annualPlan = React.useMemo(() => plans.find(p => p.id === 'annual'), [plans]);
  const monthlyPlan = React.useMemo(() => plans.find(p => p.id === 'monthly'), [plans]);

  const handlePurchase = async () => {
    try {
      setIsProcessing(true);
      setErrorMessage(null);
      const result = await onPurchase(selectedPlan);
      const success = result === true;
      if (success) {
        setPurchaseSuccess(true);
        try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
        setTimeout(() => {
          setPurchaseSuccess(false);
          onClose();
        }, 600);
      } else {
        // For new users, don't auto-restore since they have no purchases
        // Just show a helpful error message
        setErrorMessage("Unable to process purchase. Please check your internet connection and try again.");
      }
    } catch (error) {
      console.error('Purchase error:', error);
      setErrorMessage('An unexpected error occurred during purchase. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Fallback: if context flips to premium (e.g., delayed listener), close modal
  React.useEffect(() => {
    if (!visible) return;
    if (isPremium) {
      // give a tiny delay to allow success animation to show if any
      const t = setTimeout(() => onClose(), 300);
      return () => clearTimeout(t);
    }
  }, [visible, isPremium, onClose]);

  const styles = createStyles(colors);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <X size={24} color={colors.textSecondary} strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Premium Badge */}
            <Animated.View 
              style={styles.premiumBadge}
              entering={FadeInDown.delay(200).springify()}
            >
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF6B35']}
                style={styles.premiumBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Crown size={32} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.premiumBadgeText}>SkyCalm Premium</Text>
              </LinearGradient>
            </Animated.View>

            {/* Title */}
            <Animated.View 
              style={styles.titleContainer}
              entering={FadeInDown.delay(300).springify()}
            >
              <Text style={styles.title}>
                {isTrialEligible ? 'Try Premium Free for 7 Days' : 'Unlock Advanced Breathing Techniques and Tailored Meditations'}
              </Text>
              <Text style={styles.subtitle}>
                {isTrialEligible 
                  ? 'Start your free trial and access professional-grade breathing methods designed specifically for flying anxiety relief.'
                  : 'Access professional-grade breathing methods and guided meditations designed specifically for flying anxiety relief.'
                }
              </Text>
            </Animated.View>

            {/* Pricing Plans */}
            <Animated.View 
              style={styles.pricingPlansContainer}
              entering={FadeInDown.delay(400).springify()}
            >
              <Text style={styles.pricingTitle}>Choose Your Plan</Text>
              
              {/* Annual Plan */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.pricingPlan, selectedPlan === 'annual' && styles.selectedPlan]}
                onPress={async () => { await Haptics.selectionAsync(); setSelectedPlan('annual'); }}
              >
                <LinearGradient
                  colors={selectedPlan === 'annual' ? ['#6366f1', '#8b5cf6'] : [colors.card, colors.card]}
                  style={styles.pricingPlanGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.pricingPlanHeader}>
                    <View style={styles.pricingPlanLeft}>
                      <Text style={[
                        styles.pricingPlanTitle,
                        selectedPlan === 'annual' && styles.selectedPlanText
                      ]}>
                        Annual Plan
                      </Text>
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>
                          {annualPlan?.savings ? `Save ${annualPlan.savings}%` : 'Best Value'}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.pricingPlanRight}>
                      <Text style={[
                        styles.pricingPlanPrice,
                        selectedPlan === 'annual' && styles.selectedPlanText
                      ]}>
                        {annualPlan?.localizedPrice || '$19.99'}
                      </Text>
                      <Text style={[
                        styles.pricingPlanPeriod,
                        selectedPlan === 'annual' && styles.selectedPlanSubtext
                      ]}>
                        per year
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.pricingPlanSubtext,
                    selectedPlan === 'annual' && styles.selectedPlanSubtext
                  ]}>
                    {annualPlan ? `Just ${(annualPlan.price / 12).toFixed(2).replace('.', ',')} per month` : 'Best Value'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Monthly Plan */}
              <TouchableOpacity
                activeOpacity={0.9}
                style={[styles.pricingPlan, selectedPlan === 'monthly' && styles.selectedPlan]}
                onPress={async () => { await Haptics.selectionAsync(); setSelectedPlan('monthly'); }}
              >
                <LinearGradient
                  colors={selectedPlan === 'monthly' ? ['#6366f1', '#8b5cf6'] : [colors.card, colors.card]}
                  style={styles.pricingPlanGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.pricingPlanHeader}>
                    <View style={styles.pricingPlanLeft}>
                      <Text style={[
                        styles.pricingPlanTitle,
                        selectedPlan === 'monthly' && styles.selectedPlanText
                      ]}>
                        Monthly Plan
                      </Text>
                    </View>
                    <View style={styles.pricingPlanRight}>
                      <Text style={[
                        styles.pricingPlanPrice,
                        selectedPlan === 'monthly' && styles.selectedPlanText
                      ]}>
                        {monthlyPlan?.localizedPrice || '$5.99'}
                      </Text>
                      <Text style={[
                        styles.pricingPlanPeriod,
                        selectedPlan === 'monthly' && styles.selectedPlanSubtext
                      ]}>
                        per month
                      </Text>
                    </View>
                  </View>
                  <Text style={[
                    styles.pricingPlanSubtext,
                    selectedPlan === 'monthly' && styles.selectedPlanSubtext
                  ]}>
                    Cancel anytime
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            {/* Features List */}
            <View style={styles.featuresContainer}>
              {premiumFeatures.map((feature, index) => (
                <Animated.View 
                  key={index}
                  style={styles.featureItem}
                  entering={FadeInDown.delay(500 + index * 50).springify()}
                >
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureEmoji}>{feature.icon}</Text>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>{feature.description}</Text>
                  </View>
                  <View style={styles.featureCheck}>
                    <Check size={16} color={colors.success} strokeWidth={2.5} />
                  </View>
                </Animated.View>
              ))}
            </View>

            {/* Additional Benefits */}
            <Animated.View 
              style={styles.additionalBenefits}
              entering={FadeInDown.delay(800).springify()}
            >
              <Text style={styles.additionalBenefitsTitle}>Plus Premium Benefits</Text>
              <View style={styles.benefitsList}>
                <View style={styles.benefitItem}>
                  <Check size={14} color={colors.success} strokeWidth={2.5} />
                  <Text style={styles.benefitText}>Offline access to all premium content</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={14} color={colors.success} strokeWidth={2.5} />
                  <Text style={styles.benefitText}>Future premium features included</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={14} color={colors.success} strokeWidth={2.5} />
                  <Text style={styles.benefitText}>Priority customer support</Text>
                </View>
                <View style={styles.benefitItem}>
                  <Check size={14} color={colors.success} strokeWidth={2.5} />
                  <Text style={styles.benefitText}>Ad-free experience</Text>
                </View>
              </View>
            </Animated.View>

            {/* Action Button */}
            <Animated.View 
              style={styles.actionsContainer}
              entering={FadeInDown.delay(900).springify()}
            >
              {/* Continue CTA (Apple applies intro offer automatically if eligible) */}
              <TouchableOpacity 
                style={styles.purchaseButton}
                onPress={handlePurchase}
                disabled={isLoading || purchaseSuccess || isProcessing || !isOnline}
              >
                <LinearGradient
                  colors={purchaseSuccess ? ['#10b981', '#059669'] : isProcessing ? ['#6b7280', '#9ca3af'] : ['#FFD700', '#FFA500']}
                  style={styles.purchaseButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  {purchaseSuccess ? (
                    <Animated.View entering={FadeIn.duration(300)}>
                      <Text style={[styles.purchaseButtonText, { fontSize: 24 }]}>✓</Text>
                    </Animated.View>
                  ) : (
                    <Crown size={20} color="#ffffff" strokeWidth={2.5} />
                  )}
                  <Text style={styles.purchaseButtonText}>
                    {purchaseSuccess ? 'Success!' : isLoading || isProcessing ? 'Processing...' : 'Continue'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {!purchaseSuccess && (
                <TouchableOpacity 
                  style={styles.restoreButton}
                  disabled={!isOnline || isLoading}
                  onPress={async () => {
                    try {
                      setIsProcessing(true);
                      const restored = await onRestore();
                      const ok = restored === true;
                      if (ok) {
                        try { await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success); } catch {}
                        setTimeout(() => {
                          onClose();
                        }, 500);
                      }
                    } finally {
                      setIsProcessing(false);
                    }
                  }}
                >
                  <Text style={styles.restoreButtonText}>Restore Purchases</Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* Legal Text */}
            <Animated.View 
              style={styles.legalContainer}
              entering={FadeInDown.delay(1000).springify()}
            >
              {!isOnline && (
                <View style={styles.offlineWarning}>
                  <WifiOff size={16} color={colors.text} strokeWidth={2} />
                  <Text style={styles.offlineText}>Purchases require an internet connection</Text>
                </View>
              )}
              {errorMessage && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorBannerText}>{errorMessage}</Text>
                </View>
              )}
              <View style={styles.legalLinksContainer}>
                <TouchableOpacity onPress={() => handleOpenURL('https://skycalm.app/privacy')}>
                  <Text style={styles.legalLink}>Privacy Policy</Text>
                </TouchableOpacity>
                <View style={styles.legalSeparator} />
                <TouchableOpacity onPress={() => handleOpenURL('https://skycalm.app/terms')}>
                  <Text style={styles.legalLink}>Terms of Use</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.legalText}>
                Subscription automatically renews unless auto-renew is turned off at least 24 hours 
                before the end of the current period. Payment will be charged to your account at 
                confirmation of purchase.
              </Text>
            </Animated.View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const createStyles = (colors: any) => StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: colors.card,
    borderRadius: 24,
    maxWidth: 500,
    width: '100%',
    maxHeight: '90%',
    minHeight: 400, // Ensure minimum height so modal doesn't collapse
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
      android: {
        elevation: 16,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
      },
    }),
  },
  scrollView: {
    flexGrow: 1, // Changed from flex: 1 to flexGrow: 1
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 20,
    paddingBottom: 0,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  premiumBadge: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  premiumBadgeGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  premiumBadgeText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#ffffff',
  },
  titleContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    lineHeight: 30,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  pricingPlansContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  pricingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  pricingPlan: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.card, // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 4,
      },
    }),
  },
  selectedPlan: {
    borderColor: colors.primary,
    ...Platform.select({
      ios: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  pricingPlanGradient: {
    padding: 20,
  },
  pricingPlanHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  pricingPlanLeft: {
    flex: 1,
  },
  pricingPlanTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  selectedPlanText: {
    color: '#ffffff',
  },
  savingsBadge: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  savingsText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: '#ffffff',
  },
  pricingPlanRight: {
    alignItems: 'flex-end',
  },
  pricingPlanPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 32,
    color: colors.text,
    lineHeight: 36,
  },
  pricingPlanPeriod: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  pricingPlanSubtext: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  selectedPlanSubtext: {
    color: 'rgba(255, 255, 255, 0.8)',
  },
  featuresContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: colors.backgroundSecondary,
    borderRadius: 16,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.text,
    marginBottom: 4,
  },
  featureDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 16,
  },
  featureCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.success + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 12,
  },
  additionalBenefits: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  additionalBenefitsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  benefitsList: {
    gap: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  benefitText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  secondaryButton: {
    backgroundColor: '#6366f1', // Update background for secondary state
    ...Platform.select({
      ios: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
      web: {
        shadowColor: '#6366f1',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
    }),
  },
  purchaseButton: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: '#FFD700', // Add solid background color for shadow calculation
    ...Platform.select({
      ios: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#FFD700',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  purchaseButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 8,
  },
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  selectedBadgeText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#ffffff',
  },
  purchaseButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#ffffff',
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  restoreButtonText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  legalContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  legalLinksContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  legalLink: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.textSecondary,
    textDecorationLine: 'underline',
  },
  legalSeparator: {
    width: 1,
    height: 12,
    backgroundColor: colors.border,
    marginHorizontal: 10,
  },
  legalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
  offlineWarning: {
    backgroundColor: '#fef3c7',
    borderColor: '#f59e0b',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  offlineText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#d97706',
    textAlign: 'center',
  },
  errorBanner: {
    backgroundColor: '#fee2e2',
    borderColor: '#ef4444',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  errorBannerText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: '#b91c1c',
    textAlign: 'center',
  },
});