import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform, ScrollView, Dimensions, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Heart, Shuffle, Repeat, Music as MusicIcon, Headphones, Clock, Star, Crown, Lock, Download, Trash2, Brain } from 'lucide-react-native';
import { useTheme } from '@/components/ThemeProvider';
import Animated, { FadeIn, FadeInDown, FadeInUp, useSharedValue, useAnimatedStyle, withTiming, withRepeat } from 'react-native-reanimated';
import { usePremium } from '@/hooks/usePremium';
import { useOfflineMusic } from '@/hooks/useOfflineMusic';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import PremiumModal from '@/components/premium/PremiumModal';
import PremiumBadge from '@/components/premium/PremiumBadge';
import DownloadButton from '@/components/music/DownloadButton';
import OfflineIndicator from '@/components/music/OfflineIndicator';
import { useLocalSearchParams } from 'expo-router';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: string;
  category: 'sounds' | 'music' | 'getting-ready-meditation' | 'pre-flight-meditation' | 'in-flight-meditation';
  image: string;
  description: string;
  audioFile: string;
  isPlaying?: boolean;
  isPremium?: boolean;
}

const musicTracks: Track[] = [
  // Sounds (Free) - All the comprehensive sound library
  {
    id: '1',
    title: 'Airplane',
    artist: 'Ambient Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Airplane%20Sounds.jpg',
    description: 'Steady engine hum echoing through pressurized cabin air',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Airplane%20Noise.mp3',
    isPremium: false
  },
  {
    id: '2',
    title: 'Bamboo Fountain',
    artist: 'Nature Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Bamboo%20Fountain.jpg',
    description: 'Rhythmic clack and splash of falling bamboo water',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Bamboo%20Fountain.mp3',
    isPremium: false
  },
  {
    id: '3',
    title: 'Brown Noise',
    artist: 'White Noise',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Brown%20Noise.jpg',
    description: 'Deep, rumbling static like distant thunder or ocean waves',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Brown%20Noise.mp3',
    isPremium: false
  },
  {
    id: '4',
    title: 'Cat Purr',
    artist: 'Ambient Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Cat%20Purr.jpg',
    description: 'Soft, vibrating hum of feline comfort and contentment',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Cat%20Purr.mp3',
    isPremium: false
  },
  {
    id: '5',
    title: 'Coffee Shop',
    artist: 'Ambient Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Coffee%20Shop.jpg',
    description: 'Murmured voices, clinking cups, and espresso machines steaming',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Coffee%20Shop.mp3',
    isPremium: false
  },
  {
    id: '6',
    title: 'Fan',
    artist: 'White Noise',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Fan%20Noise.jpg',
    description: 'Constant, whirring breeze that soothes and cools the air',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Fan%20Noise.mp3',
    isPremium: false
  },
  {
    id: '7',
    title: 'Fireplace',
    artist: 'Ambient Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Fireplace.jpg',
    description: 'Crackling logs and gentle pops of cozy, warm flames',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Fireplace.mp3',
    isPremium: false
  },
  {
    id: '8',
    title: 'Gentle Stream',
    artist: 'Nature Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Gentle%20Stream.jpg',
    description: 'Trickle of water weaving softly over smooth stones',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Gentle%20Stream.mp3',
    isPremium: false
  },
  {
    id: '9',
    title: 'Hair Dryer',
    artist: 'White Noise',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Hair%20Dryer.jpg',
    description: 'High-pitched roar of hot air blowing steadily',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Hair%20Dryer.mp3',
    isPremium: false
  },
  {
    id: '10',
    title: 'Pink Noise',
    artist: 'White Noise',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Pink%20Noise.jpg',
    description: 'Balanced static, softer and deeper than white noise',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Pink%20Noise.mp3',
    isPremium: false
  },
  {
    id: '11',
    title: 'Rain',
    artist: 'Nature Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Rain.jpg',
    description: 'Delicate drops tapping rhythmically on windows and rooftops',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Rain.mp3',
    isPremium: false
  },
  {
    id: '12',
    title: 'Rainforest',
    artist: 'Nature Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Rainforest.jpg',
    description: 'Birds, insects, and dripping leaves in dense, humid canopy',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Rainforest.mp3',
    isPremium: false
  },
  {
    id: '13',
    title: 'Thunderstorm',
    artist: 'Nature Sounds',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/Thunderstorm.jpg',
    description: 'Distant rumbles and cracks of sky-splitting lightning strikes',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/Thunderstorm.mp3',
    isPremium: false
  },
  {
    id: '14',
    title: 'White Noise',
    artist: 'White Noise',
    duration: 'Loops',
    category: 'sounds',
    image: 'https://storage.googleapis.com/skycalm/Images/White%20Noise.jpg',
    description: 'Hissing static masking background sounds with even frequency',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Sounds/White%20Noise.mp3',
    isPremium: false
  },

  // Relaxing Music (Free)
  {
    id: '15',
    title: 'Drift Away',
    artist: 'Relaxing Music',
    duration: 'Loops',
    category: 'music',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Relaxing%20Music%20Pt%201.jpg',
    description: 'Gentle melodies to drift away your worries',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Skycalm%20Relaxing%20Music.mp3',
    isPremium: false
  },
  {
    id: '16',
    title: 'Simple Glow',
    artist: 'Relaxing Music',
    duration: 'Loops',
    category: 'music',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Relaxing%20Music%20Pt%202.jpg',
    description: 'Simple melodies that glow with peaceful energy',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/SkyCalm%20Relaxing%20Music%20Part%202.mp3',
    isPremium: false
  },
  {
    id: '17',
    title: 'Floating',
    artist: 'Relaxing Music',
    duration: 'Loops',
    category: 'music',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Relaxing%20Music%20Pt%203.jpg',
    description: 'Feel like you\'re floating on clouds of serenity',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/SkyCalm%20Relaxing%20Music%20Part%203.mp3',
    isPremium: false
  },
  {
    id: '18',
    title: 'Weightlessness',
    artist: 'Relaxing Music',
    duration: 'Loops',
    category: 'music',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Relaxing%20Music%20Pt%204.jpg',
    description: 'Experience the weightlessness of pure relaxation',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/SkyCalm%20Relaxing%20Music%20Part%204.mp3',
    isPremium: false
  },

  // Getting Ready Meditations (Premium)
  {
    id: '19',
    title: 'Affirmations for a Calm Traveler',
    artist: 'Getting Ready Meditation',
    duration: '15:30',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/Calm%20Traveler.jpg',
    description: 'Positive affirmations to build confidence for your upcoming journey',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/Affirmations%20for%20a%20Calm%20Traveler.mp3',
    isPremium: true
  },
  {
    id: '20',
    title: 'Breathing Basics: Reset Your Nervous System',
    artist: 'Getting Ready Meditation',
    duration: '18:45',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/Breathing%20Basics.jpg',
    description: 'Learn fundamental breathing techniques to calm your nervous system',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/Breathing%20Basics%20Reset%20Your%20Nervous%20System.mp3',
    isPremium: true
  },
  {
    id: '21',
    title: 'Calm Body Scan for Sleep',
    artist: 'Getting Ready Meditation',
    duration: '22:15',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/Calm%20Body%20Scan.jpg',
    description: 'Progressive body scan meditation for restful sleep before travel',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/Calm%20Body%20Scan%20for%20Sleep.mp3',
    isPremium: true
  },
  {
    id: '22',
    title: 'EFT for Flying Anxiety',
    artist: 'Getting Ready Meditation',
    duration: '25:00',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/EFT.jpg',
    description: 'Emotional Freedom Technique to release flying anxiety and fear',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/EFT%20for%20Flying%20Anxiety.mp3',
    isPremium: true
  },
  {
    id: '23',
    title: 'Releasing Control & Trusting the Experts',
    artist: 'Getting Ready Meditation',
    duration: '20:30',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/Releasing%20Control%20%26%20Trusting%20the%20Experts.jpg',
    description: 'Learn to let go of control and trust in aviation professionals',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/Releasing%20Control%20and%20Trusting%20The%20Experts.mp3',
    isPremium: true
  },
  {
    id: '24',
    title: 'Visualize the Best Case Scenario',
    artist: 'Getting Ready Meditation',
    duration: '16:45',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/Visualize%20the%20Best%20Case%20Scenario.jpg',
    description: 'Guided visualization of a smooth, peaceful flight experience',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/Visualize%20the%20Best%20Case%20Scenario.mp3',
    isPremium: true
  },
  {
    id: '25',
    title: 'Your Brain on Airplanes: Normalize the Fear',
    artist: 'Getting Ready Meditation',
    duration: '19:20',
    category: 'getting-ready-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Getting%20Ready/Your%20Brain%20on%20Airplanes.jpg',
    description: 'Understanding and normalizing your brain\'s response to flying',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Days%20Leading%20Up%20To%20the%20Flight/Your%20Brain%20on%20Airplanes%20-%20Normalize%20the%20Fear.mp3',
    isPremium: true
  },

  // Pre-Flight Calm Meditations (Premium)
  {
    id: '26',
    title: '5-4-3-2-1 Grounding Exercise',
    artist: 'Pre-Flight Calm Meditation',
    duration: '12:30',
    category: 'pre-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Pre-Flight%20Meditations/Grounding.jpg',
    description: 'Powerful grounding technique using your five senses to stay present',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Pre-Flight/5-4-3-2-1_Grounding_Exercise.mp3',
    isPremium: true
  },
  {
    id: '27',
    title: 'Affirmations While Waiting',
    artist: 'Pre-Flight Calm Meditation',
    duration: '15:45',
    category: 'pre-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Pre-Flight%20Meditations/Affirmations%20While%20Waiting.jpg',
    description: 'Calming affirmations to use while waiting at the gate or in the airport',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Pre-Flight/Affirmations%20While%20Waiting.mp3',
    isPremium: true
  },
  {
    id: '28',
    title: 'EFT Tapping: Pre-Boarding Jitters',
    artist: 'Pre-Flight Calm Meditation',
    duration: '18:20',
    category: 'pre-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Pre-Flight%20Meditations/EFT.jpg',
    description: 'EFT tapping sequence to release pre-boarding anxiety and nervousness',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Pre-Flight/EFT%20Tapping%20Pre-Boarding%20Jitters.mp3',
    isPremium: true
  },
  {
    id: '29',
    title: 'Practical Grounding and Airport Checklist',
    artist: 'Pre-Flight Calm Meditation',
    duration: '14:15',
    category: 'pre-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Pre-Flight%20Meditations/Airport%20Checklist.jpg',
    description: 'Practical grounding techniques combined with a calming airport checklist',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Pre-Flight/Practical%20Grounding%20and%20Airport%20Checklist.mp3',
    isPremium: true
  },
  {
    id: '30',
    title: 'Visualize Walking Calmly Onto Plane',
    artist: 'Pre-Flight Calm Meditation',
    duration: '16:30',
    category: 'pre-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Pre-Flight%20Meditations/Calmly%20onto%20Plane.jpg',
    description: 'Guided visualization of boarding the plane with confidence and calm',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Pre-Flight/Visualize%20Walking%20Calmly%20Onto%20the%20Plane.mp3',
    isPremium: true
  },

  // Onboard Ease Meditations (Premium)
  {
    id: '31',
    title: 'Mind Body Loop: Breaking the Panic Cycle',
    artist: 'Onboard Ease Meditation',
    duration: '18:45',
    category: 'in-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Onboard%20Ease/Mind%20Body.jpg',
    description: 'Learn to break the cycle of panic and anxiety during your flight',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Mid-Flight/Mind%20Body%20Loop%20Breaking%20The%20Panic%20Cycle.mp3',
    isPremium: true
  },
  {
    id: '32',
    title: 'Reframing Intrusive Thoughts Mid-Flight',
    artist: 'Onboard Ease Meditation',
    duration: '16:20',
    category: 'in-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Onboard%20Ease/Reframing%20Intrusive%20Thoughts.jpg',
    description: 'Transform negative thoughts into calm, rational perspectives while flying',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Mid-Flight/Reframing%20Intrusive%20Thoughts%20Mid-Flight.mp3',
    isPremium: true
  },
  {
    id: '33',
    title: 'Turbulence Reframe: Like Bumps on a Road',
    artist: 'Onboard Ease Meditation',
    duration: '14:30',
    category: 'in-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Onboard%20Ease/Turbulence%20Reframe.jpg',
    description: 'Reframe turbulence as normal road bumps to reduce fear and anxiety',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Mid-Flight/Turbulence%20Reframe%20Like%20Bumps%20on%20a%20Road.mp3',
    isPremium: true
  },
  {
    id: '34',
    title: 'You\'re Already Safe Visualization',
    artist: 'Onboard Ease Meditation',
    duration: '20:15',
    category: 'in-flight-meditation',
    image: 'https://storage.googleapis.com/skycalm/Images/Relaxing%20Music%20Images/Onboard%20Ease/You\'re%20Already%20Safe.jpg',
    description: 'Powerful visualization to reinforce your safety and security during flight',
    audioFile: 'https://storage.googleapis.com/skycalm/Meditations/Mid-Flight/You\'re%20Already%20Safe%20Visualization.mp3',
    isPremium: true
  }
];

const categories = [
  { id: 'all', name: 'All', icon: MusicIcon, isPremium: false },
  { id: 'downloaded', name: 'Downloaded', icon: Download, isPremium: false },
  { id: 'sounds', name: 'Sounds', icon: Volume2, isPremium: false },
  { id: 'music', name: 'Music', icon: Headphones, isPremium: false },
  { id: 'getting-ready-meditation', name: 'Getting Ready', icon: Clock, isPremium: true },
  { id: 'pre-flight-meditation', name: 'Pre-Flight Calm', icon: Brain, isPremium: true },
  { id: 'in-flight-meditation', name: 'Onboard Ease', icon: Star, isPremium: true }
];

export default function MusicScreen() {
  const { colors } = useTheme();
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDownloadManager, setShowDownloadManager] = useState(false);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const { isPremium, isLoading: premiumLoading, simulatePremiumPurchase, restorePurchases } = usePremium();
  const { 
    downloadedTracks, 
    downloadProgress, 
    isTrackDownloaded, 
    downloadTrack, 
    deleteTrack, 
    getTotalDownloadSize, 
    formatFileSize,
    clearAllDownloads 
  } = useOfflineMusic();
  const audioPlayer = useAudioPlayer();

  // Get URL parameters for deep linking
  const params = useLocalSearchParams();
  const { category: categoryParam } = params;

  useEffect(() => {
    // Handle deep linking from Quick Actions
    if (categoryParam) {
      // Map 'nature' to 'sounds' for backward compatibility
      const mappedCategory = categoryParam === 'nature' ? 'sounds' : categoryParam;
      const targetCategory = categories.find(cat => cat.id === mappedCategory);
      if (targetCategory) {
        if (targetCategory.isPremium && !isPremium) {
          setShowPremiumModal(true);
        } else {
          setSelectedCategory(mappedCategory as string);
        }
      }
    }
  }, [categoryParam, isPremium]);

  const getFilteredTracks = () => {
    if (selectedCategory === 'downloaded') {
      return musicTracks.filter(track => isTrackDownloaded(track.id));
    }
    return selectedCategory === 'all' 
      ? musicTracks 
      : musicTracks.filter(track => track.category === selectedCategory);
  };

  const filteredTracks = getFilteredTracks();

  const handleTrackSelect = async (track: Track) => {
    if (track.isPremium && !isPremium) {
      setShowPremiumModal(true);
      return;
    }

    // If same track is playing, toggle play/pause
    if (currentTrack?.id === track.id) {
      if (audioPlayer.isPlaying) {
        await audioPlayer.pauseSound();
      } else {
        await audioPlayer.resumeSound();
      }
      return;
    }

    // Stop current track and play new one
    await audioPlayer.stopSound();
    setCurrentTrack(track);
    await audioPlayer.playSound(track.audioFile, track.id);
  };

  const handleCategorySelect = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (category?.isPremium && !isPremium) {
      setShowPremiumModal(true);
      return;
    }
    setSelectedCategory(categoryId);
  };

  const handleDownload = async (track: Track) => {
    if (track.isPremium && !isPremium) {
      setShowPremiumModal(true);
      return;
    }

    const success = await downloadTrack(track);
    if (!success) {
      Alert.alert('Download Failed', 'Unable to download track. Please try again.');
    }
  };

  const handleDeleteDownload = async (trackId: string) => {
    Alert.alert(
      'Delete Download',
      'Are you sure you want to delete this downloaded track?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const success = await deleteTrack(trackId);
            if (!success) {
              Alert.alert('Error', 'Unable to delete track. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handleClearAllDownloads = () => {
    Alert.alert(
      'Clear All Downloads',
      `This will delete all ${downloadedTracks.length} downloaded tracks and free up ${formatFileSize(getTotalDownloadSize())} of storage. This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: async () => {
            const success = await clearAllDownloads();
            if (!success) {
              Alert.alert('Error', 'Unable to clear downloads. Please try again.');
            }
          }
        }
      ]
    );
  };

  const handlePremiumPurchase = async () => {
    setIsProcessing(true);
    try {
      await simulatePremiumPurchase();
      setShowPremiumModal(false);
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

  const getCategoryDisplayName = (categoryId: string) => {
    switch (categoryId) {
      case 'all':
        return 'All Tracks';
      case 'downloaded':
        return 'Downloaded Tracks';
      case 'sounds':
        return 'Sounds & Nature';
      case 'getting-ready-meditation':
        return 'Getting Ready Meditations';
      case 'pre-flight-meditation':
        return 'Pre-Flight Calm Meditations';
      case 'in-flight-meditation':
        return 'Onboard Ease Meditations';
      default:
        const category = categories.find(c => c.id === categoryId);
        return category?.name || 'Tracks';
    }
  };

  // Calculate progress percentage for progress bar
  const getProgressPercentage = () => {
    if (!audioPlayer.duration || audioPlayer.duration === 0) return 0;
    return (audioPlayer.position / audioPlayer.duration) * 100;
  };

  // Handle image loading errors with fallback
  const handleImageError = (trackId: string) => {
    setImageErrors(prev => ({ ...prev, [trackId]: true }));
  };

  const getImageSource = (track: Track) => {
    // If image failed to load, use fallback
    if (imageErrors[track.id]) {
      return { uri: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg' };
    }
    
    // Try the original image first
    return { uri: track.image };
  };

  // Cleanup audio when component unmounts
  useEffect(() => {
    return () => {
      audioPlayer.stopSound();
    };
  }, []);

  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.container}>
      {/* Premium Modal */}
      <PremiumModal
        visible={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onPurchase={handlePremiumPurchase}
        onRestore={handleRestorePurchases}
        isLoading={isProcessing}
      />

      {/* Header */}
      <Animated.View 
        style={styles.header}
        entering={FadeInUp.delay(100).springify()}
      >
        <LinearGradient
          colors={['#8b5cf6', '#a855f7', '#c084fc']}
          style={styles.headerGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <View style={styles.titleContainer}>
                <Text style={styles.title}>Music, Sounds, Meditations</Text>
                <Text style={styles.subtitle}>
                  Soothing sounds and guided meditations{'\n'}for your journey
                </Text>
              </View>
              {downloadedTracks.length > 0 && (
                <TouchableOpacity 
                  style={styles.downloadManagerButton}
                  onPress={() => setShowDownloadManager(!showDownloadManager)}
                >
                  <Download size={20} color="#ffffff" strokeWidth={2} />
                </TouchableOpacity>
              )}
            </View>
          </View>
          {downloadedTracks.length > 0 && (
            <View style={styles.headerStats}>
              <View style={styles.statItem}>
                <Download size={16} color="rgba(255, 255, 255, 0.8)" strokeWidth={2} />
                <Text style={styles.statText}>{downloadedTracks.length} offline</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </Animated.View>

      {/* Offline Indicator */}
      <OfflineIndicator
        downloadedCount={downloadedTracks.length}
        totalSize={formatFileSize(getTotalDownloadSize())}
        isVisible={downloadedTracks.length > 0}
      />

      {/* Download Manager */}
      {showDownloadManager && downloadedTracks.length > 0 && (
        <Animated.View 
          style={styles.downloadManager}
          entering={FadeInDown.delay(200).springify()}
        >
          <View style={styles.downloadManagerHeader}>
            <Text style={styles.downloadManagerTitle}>Downloaded Tracks</Text>
            <TouchableOpacity 
              style={styles.clearAllButton}
              onPress={handleClearAllDownloads}
            >
              <Trash2 size={16} color={colors.error} strokeWidth={2} />
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.downloadManagerSubtitle}>
            {downloadedTracks.length} tracks • {formatFileSize(getTotalDownloadSize())}
          </Text>
        </Animated.View>
      )}

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Now Playing Card */}
        {currentTrack && (
          <Animated.View 
            style={styles.nowPlayingCard}
            entering={FadeIn.delay(200)}
          >
            <Image 
              source={getImageSource(currentTrack)}
              style={styles.nowPlayingImage}
              onError={() => handleImageError(currentTrack.id)}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={styles.nowPlayingOverlay}
            />
            
            {/* Premium Badge for Premium Tracks */}
            {currentTrack.isPremium && (
              <View style={styles.nowPlayingPremiumBadge}>
                <PremiumBadge size="small" />
              </View>
            )}

            {/* Download Button */}
            <View style={styles.nowPlayingDownloadButton}>
              <DownloadButton
                isDownloaded={isTrackDownloaded(currentTrack.id)}
                isDownloading={!!downloadProgress[currentTrack.id]?.isDownloading}
                progress={downloadProgress[currentTrack.id]?.progress || 0}
                onDownload={() => handleDownload(currentTrack)}
                onDelete={() => handleDeleteDownload(currentTrack.id)}
                size="large"
                disabled={currentTrack.isPremium && !isPremium}
              />
            </View>
            
            <View style={styles.nowPlayingContent}>
              <View style={styles.nowPlayingInfo}>
                <Text style={styles.nowPlayingTitle}>{currentTrack.title}</Text>
                <Text style={styles.nowPlayingArtist}>{currentTrack.artist}</Text>
                <Text style={styles.nowPlayingDescription}>{currentTrack.description}</Text>
              </View>

              {/* Progress Bar */}
              <View style={styles.progressContainer}>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${getProgressPercentage()}%` }]} />
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>
                    {audioPlayer.formatTime(audioPlayer.position)}
                  </Text>
                  <Text style={styles.timeText}>
                    {currentTrack.duration === 'Loops' ? 'Loops' : audioPlayer.formatTime(audioPlayer.duration)}
                  </Text>
                </View>
              </View>

              {/* Player Controls */}
              <View style={styles.playerControls}>
                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => audioPlayer.seekTo(Math.max(0, audioPlayer.position - 10000))}
                >
                  <SkipBack size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.playButton} 
                  onPress={() => handleTrackSelect(currentTrack)}
                >
                  <LinearGradient
                    colors={['rgba(255,255,255,0.9)', 'rgba(255,255,255,0.7)']}
                    style={styles.playButtonGradient}
                  >
                    {audioPlayer.isPlaying && audioPlayer.currentSoundId === currentTrack.id ? (
                      <Pause size={32} color="#8b5cf6" strokeWidth={2.5} />
                    ) : (
                      <Play size={32} color="#8b5cf6" strokeWidth={2.5} />
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.controlButton}
                  onPress={() => audioPlayer.seekTo(Math.min(audioPlayer.duration, audioPlayer.position + 10000))}
                >
                  <SkipForward size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                </TouchableOpacity>
              </View>

              {/* Volume Control */}
              <View style={styles.volumeContainer}>
                <TouchableOpacity onPress={() => audioPlayer.setVolume(0)}>
                  <VolumeX size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                </TouchableOpacity>
                <View style={styles.volumeSlider}>
                  <View style={[styles.volumeFill, { width: `${audioPlayer.volume * 100}%` }]} />
                </View>
                <TouchableOpacity onPress={() => audioPlayer.setVolume(1)}>
                  <Volume2 size={20} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        )}

        {/* Category Filter */}
        <Animated.View 
          style={styles.categoriesSection}
          entering={FadeInDown.delay(300).springify()}
        >
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => {
              const IconComponent = category.icon;
              const isLocked = category.isPremium && !isPremium;
              const isDownloadedCategory = category.id === 'downloaded';
              const downloadedCount = isDownloadedCategory ? downloadedTracks.length : 0;
              
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.id && styles.categoryButtonActive,
                    isLocked && styles.categoryButtonLocked
                  ]}
                  onPress={() => handleCategorySelect(category.id)}
                >
                  {isLocked ? (
                    <Crown size={16} color={colors.textSecondary} strokeWidth={2} />
                  ) : (
                    <IconComponent 
                      size={18} 
                      color={selectedCategory === category.id ? '#ffffff' : colors.textSecondary} 
                      strokeWidth={2} 
                    />
                  )}
                  <Text style={[
                    styles.categoryText,
                    selectedCategory === category.id && styles.categoryTextActive,
                    isLocked && styles.categoryTextLocked
                  ]}>
                    {category.name}
                    {isDownloadedCategory && downloadedCount > 0 && ` (${downloadedCount})`}
                  </Text>
                  {category.isPremium && (
                    <View style={styles.categoryPremiumBadge}>
                      <Crown size={12} color="#FFD700" strokeWidth={2} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </Animated.View>

        {/* Track List */}
        <View style={styles.trackListSection}>
          <Text style={styles.sectionTitle}>
            {getCategoryDisplayName(selectedCategory)}
          </Text>
          
          {filteredTracks.length === 0 && selectedCategory === 'downloaded' && (
            <View style={styles.emptyState}>
              <Download size={48} color={colors.textTertiary} strokeWidth={1.5} />
              <Text style={styles.emptyStateTitle}>No Downloaded Tracks</Text>
              <Text style={styles.emptyStateSubtitle}>
                Download tracks to listen offline during your flights
              </Text>
            </View>
          )}
          
          {filteredTracks.map((track, index) => (
            <Animated.View
              key={track.id}
              entering={FadeInDown.delay(400 + index * 100).springify()}
            >
              <TouchableOpacity
                style={[
                  styles.trackItem,
                  currentTrack?.id === track.id && styles.trackItemActive,
                  track.isPremium && !isPremium && styles.trackItemLocked
                ]}
                onPress={() => handleTrackSelect(track)}
              >
                <View style={styles.trackImageContainer}>
                  <Image 
                    source={getImageSource(track)}
                    style={styles.trackImage}
                    onError={() => handleImageError(track.id)}
                    resizeMode="cover"
                  />
                  {track.isPremium && !isPremium && (
                    <View style={styles.trackImageOverlay}>
                      <Lock size={20} color="#ffffff" strokeWidth={2.5} />
                    </View>
                  )}
                </View>
                
                <View style={styles.trackInfo}>
                  <View style={styles.trackTitleRow}>
                    <Text style={[
                      styles.trackTitle,
                      currentTrack?.id === track.id && styles.trackTitleActive,
                      track.isPremium && !isPremium && styles.trackTitleLocked
                    ]}>
                      {track.title}
                    </Text>
                    {track.isPremium && (
                      <View style={styles.trackPremiumBadge}>
                        <PremiumBadge size="small" />
                      </View>
                    )}
                  </View>
                  <Text style={[
                    styles.trackArtist,
                    track.isPremium && !isPremium && styles.trackArtistLocked
                  ]}>
                    {track.artist}
                  </Text>
                  <Text style={[
                    styles.trackDescription,
                    track.isPremium && !isPremium && styles.trackDescriptionLocked
                  ]} numberOfLines={1}>
                    {track.isPremium && !isPremium ? 'Unlock with Premium' : track.description}
                  </Text>
                </View>

                <View style={styles.trackMeta}>
                  <Text style={[
                    styles.trackDuration,
                    track.isPremium && !isPremium && styles.trackDurationLocked
                  ]}>
                    {track.duration}
                  </Text>
                  
                  <View style={styles.trackActions}>
                    {/* Download Button */}
                    <DownloadButton
                      isDownloaded={isTrackDownloaded(track.id)}
                      isDownloading={!!downloadProgress[track.id]?.isDownloading}
                      progress={downloadProgress[track.id]?.progress || 0}
                      onDownload={() => handleDownload(track)}
                      onDelete={() => handleDeleteDownload(track.id)}
                      size="small"
                      disabled={track.isPremium && !isPremium}
                    />
                    
                    {/* Playing Indicator */}
                    {currentTrack?.id === track.id && audioPlayer.isPlaying && audioPlayer.currentSoundId === track.id && (
                      <View style={styles.playingIndicator}>
                        <View style={[styles.playingBar, styles.playingBar1]} />
                        <View style={[styles.playingBar, styles.playingBar2]} />
                        <View style={[styles.playingBar, styles.playingBar3]} />
                      </View>
                    )}
                  </View>
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
    marginBottom: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 28,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 22,
  },
  downloadManagerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerStats: {
    flexDirection: 'row',
    gap: 24,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  downloadManager: {
    backgroundColor: colors.card,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
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
  downloadManagerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  downloadManagerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: colors.backgroundSecondary,
  },
  clearAllText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: colors.error,
  },
  downloadManagerSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  nowPlayingCard: {
    height: 400,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
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
  nowPlayingImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  nowPlayingOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
  },
  nowPlayingPremiumBadge: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  nowPlayingDownloadButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    zIndex: 1,
  },
  nowPlayingContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
  },
  nowPlayingInfo: {
    marginBottom: 24,
  },
  nowPlayingTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 24,
    color: '#ffffff',
    marginBottom: 4,
  },
  nowPlayingArtist: {
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  nowPlayingDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
  },
  progressContainer: {
    marginBottom: 24,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    gap: 20,
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
  },
  playButtonGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  volumeSlider: {
    flex: 1,
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  volumeFill: {
    height: '100%',
    backgroundColor: '#ffffff',
    borderRadius: 2,
  },
  categoriesSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: colors.text,
    marginBottom: 16,
  },
  categoriesScroll: {
    marginHorizontal: -20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 12,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.backgroundSecondary,
    gap: 8,
    position: 'relative',
  },
  categoryButtonActive: {
    backgroundColor: colors.primary,
  },
  categoryButtonLocked: {
    opacity: 0.6,
  },
  categoryText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  categoryTextLocked: {
    color: colors.textTertiary,
  },
  categoryPremiumBadge: {
    marginLeft: 4,
  },
  trackListSection: {
    marginBottom: 32,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  trackItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
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
  trackItemActive: {
    backgroundColor: colors.primaryLight + '20',
    borderWidth: 1,
    borderColor: colors.primary,
  },
  trackItemLocked: {
    borderWidth: 3,
    borderColor: '#FF6B35',
    backgroundColor: colors.card,
    ...Platform.select({
      ios: {
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
      web: {
        shadowColor: '#FF6B35',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
    }),
  },
  trackImageContainer: {
    position: 'relative',
    marginRight: 16,
  },
  trackImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: colors.backgroundSecondary, // Fallback background
  },
  trackImageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trackInfo: {
    flex: 1,
  },
  trackTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  trackTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  trackTitleActive: {
    color: colors.primary,
  },
  trackTitleLocked: {
    color: colors.textSecondary,
  },
  trackPremiumBadge: {
    marginLeft: 8,
  },
  trackArtist: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  trackArtistLocked: {
    color: colors.textTertiary,
  },
  trackDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textTertiary,
  },
  trackDescriptionLocked: {
    color: '#FF6B35',
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  trackMeta: {
    alignItems: 'flex-end',
  },
  trackDuration: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  trackDurationLocked: {
    color: colors.textTertiary,
  },
  trackActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  playingIndicator: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
  },
  playingBar: {
    width: 3,
    backgroundColor: colors.primary,
    borderRadius: 1.5,
  },
  playingBar1: {
    height: 12,
  },
  playingBar2: {
    height: 8,
  },
  playingBar3: {
    height: 16,
  },
  bottomSpacing: {
    height: 100,
  },
});