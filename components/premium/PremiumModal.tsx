import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Modal } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Crown, Check, Sparkles } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

interface Props {
  visible: boolean;
  onClose: () => void;
  onPurchase: (planId: 'monthly' | 'annual') => void;
  onRestore: () => void;
  isLoading?: boolean;
}

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

export default function PremiumModal({ visible, onClose, onPurchase, onRestore, isLoading = false }: Props) {
  const { colors } = useTheme();
  const [selectedPlan, setSelectedPlan] = React.useState<'monthly' | 'annual'>('annual');

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
            <View style={styles.premiumBadge}>
              <LinearGradient
                colors={['#FFD700', '#FFA500', '#FF6B35']}
                style={styles.premiumBadgeGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Crown size={32} color="#ffffff" strokeWidth={2.5} />
                <Text style={styles.premiumBadgeText}>SkyCalm Premium</Text>
              </LinearGradient>
            </View>

            {/* Title */}
            <View style={styles.titleContainer}>
              <Text style={styles.title}>Unlock Advanced Breathing Techniques</Text>
              <Text style={styles.subtitle}>
                Access professional-grade breathing methods designed specifically for flying anxiety relief.
              </Text>
            </View>

            {/* Pricing Plans */}
            <View style={styles.pricingPlansContainer}>
              <Text style={styles.pricingTitle}>Choose Your Plan</Text>
              
              {/* Annual Plan */}
              <TouchableOpacity
                style={[
                  styles.pricingPlan,
                  selectedPlan === 'annual' && styles.selectedPlan
                ]}
                onPress={() => setSelectedPlan('annual')}
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
                        <Text style={styles.savingsText}>Save 72%</Text>
                      </View>
                    </View>
                    <View style={styles.pricingPlanRight}>
                      <Text style={[
                        styles.pricingPlanPrice,
                        selectedPlan === 'annual' && styles.selectedPlanText
                      ]}>
                        $19.99
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
                    Just $1.67 per month • Best Value
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Monthly Plan */}
              <TouchableOpacity
                style={[
                  styles.pricingPlan,
                  selectedPlan === 'monthly' && styles.selectedPlan
                ]}
                onPress={() => setSelectedPlan('monthly')}
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
                        $5.99
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
            </View>

            {/* Action Buttons */}
            <View style={styles.actionsContainer}>
              <TouchableOpacity 
                style={styles.purchaseButton}
                onPress={() => onPurchase(selectedPlan)}
                disabled={isLoading}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.purchaseButtonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Crown size={20} color="#ffffff" strokeWidth={2.5} />
                  <Text style={styles.purchaseButtonText}>
                    {isLoading ? 'Processing...' : `Start ${selectedPlan === 'annual' ? 'Annual' : 'Monthly'} Plan`}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.restoreButton}
                onPress={onRestore}
                disabled={isLoading}
              >
                <Text style={styles.restoreButtonText}>Restore Purchases</Text>
              </TouchableOpacity>
            </View>

            {/* Legal Text */}
            <View style={styles.legalContainer}>
              <Text style={styles.legalText}>
                Subscription automatically renews unless auto-renew is turned off at least 24 hours 
                before the end of the current period.
              </Text>
            </View>
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
  legalText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textTertiary,
    textAlign: 'center',
    lineHeight: 16,
  },
});