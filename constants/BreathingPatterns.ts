export interface BreathingPattern {
  id: string;
  name: string;
  description: string;
  benefits: string[];
  inhaleSeconds: number;
  holdInhaleSeconds: number;
  exhaleSeconds: number;
  holdExhaleSeconds: number;
  totalCycles: number;
}

export const breathingPatterns: BreathingPattern[] = [
  {
    id: 'calm',
    name: 'Calming Breath',
    description: 'A simple pattern to reduce anxiety during takeoff or landing',
    benefits: [
      'Reduces acute anxiety',
      'Helps during takeoff and landing',
      'Easy to follow when stressed',
      'Promotes mental clarity'
    ],
    inhaleSeconds: 4,
    holdInhaleSeconds: 0,
    exhaleSeconds: 6,
    holdExhaleSeconds: 0,
    totalCycles: 10,
  },
  {
    id: 'deep',
    name: 'Deep Relaxation',
    description: 'Use this during cruise to achieve deep relaxation',
    benefits: [
      'Induces deep relaxation',
      'Perfect for longer flights',
      'Helps with sleep',
      'Reduces muscle tension'
    ],
    inhaleSeconds: 4,
    holdInhaleSeconds: 2,
    exhaleSeconds: 6,
    holdExhaleSeconds: 0,
    totalCycles: 10,
  },
  {
    id: '478',
    name: '4-7-8 Technique',
    description: 'Dr. Weil\'s technique for relaxation and anxiety reduction',
    benefits: [
      'Reduces panic attacks',
      'Helps with insomnia',
      'Decreases heart rate',
      'Calms racing thoughts'
    ],
    inhaleSeconds: 4,
    holdInhaleSeconds: 7,
    exhaleSeconds: 8,
    holdExhaleSeconds: 0,
    totalCycles: 8,
  },
  {
    id: 'box',
    name: 'Box Breathing',
    description: 'Used by Navy SEALs to calm down and focus in stressful situations',
    benefits: [
      'Improves concentration',
      'Manages acute stress',
      'Increases mental clarity',
      'Used by professional pilots'
    ],
    inhaleSeconds: 4,
    holdInhaleSeconds: 4,
    exhaleSeconds: 4,
    holdExhaleSeconds: 4,
    totalCycles: 10,
  },
  {
    id: 'quick',
    name: 'Quick Calm',
    description: 'A shorter pattern for immediate anxiety relief during turbulence',
    benefits: [
      'Instant anxiety relief',
      'Perfect during turbulence',
      'Easy to remember',
      'Helps with dizziness'
    ],
    inhaleSeconds: 3,
    holdInhaleSeconds: 0,
    exhaleSeconds: 3,
    holdExhaleSeconds: 0,
    totalCycles: 10,
  }
];

export interface SoundOption {
  id: string;
  name: string;
  description: string;
}

export const soundOptions: SoundOption[] = [
  {
    id: 'none',
    name: 'No Sound',
    description: 'Practice in silence',
  },
  {
    id: 'waves',
    name: 'Ocean Waves',
    description: 'Gentle, rhythmic waves',
  },
  {
    id: 'rain',
    name: 'Rainfall',
    description: 'Soft, steady rainfall',
  },
  {
    id: 'forest',
    name: 'Forest Ambience',
    description: 'Peaceful forest sounds',
  },
  {
    id: 'whitenoise',
    name: 'White Noise',
    description: 'Steady background noise',
  },
];