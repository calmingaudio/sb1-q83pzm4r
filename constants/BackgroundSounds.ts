export interface BackgroundSound {
  id: string;
  name: string;
  description: string;
  category: 'nature' | 'ambient' | 'music' | 'white-noise';
  icon: string;
  audioFile?: any; // Local require() or URL
  isPremium?: boolean;
}

export const backgroundSounds: BackgroundSound[] = [
  {
    id: 'none',
    name: 'Silent',
    description: 'Practice in complete silence',
    category: 'nature',
    icon: '🔇',
    isPremium: false
  },
  {
    id: 'rain',
    name: 'Rain',
    description: 'Delicate drops tapping rhythmically on windows and rooftops',
    category: 'nature',
    icon: '🌧️',
    audioFile: require('../assets/sounds/Rain.mp3'),
    isPremium: false
  },
  {
    id: 'ocean',
    name: 'Ocean Waves',
    description: 'Gentle waves lapping against the shore',
    category: 'nature',
    icon: '🌊',
    audioFile: require('../assets/sounds/Ocean.mp3'),
    isPremium: false
  },
  {
    id: 'music',
    name: 'Relaxing Music',
    description: 'Soft instrumental music for deep relaxation',
    category: 'music',
    icon: '🎵',
    audioFile: require('../assets/sounds/Music.mp3'),
    isPremium: false
  }
];

export const soundCategories = [
  { id: 'all', name: 'All Sounds', icon: '🎵' }
];