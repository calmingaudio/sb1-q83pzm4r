export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  category: 'breathing' | 'learning' | 'journal' | 'sos' | 'general';
  condition: string;
  secret?: boolean;
}

export const achievements: Achievement[] = [
  {
    id: 'first_breathe',
    title: 'First Breath',
    description: 'Complete your first breathing exercise',
    icon: '🫁',
    points: 50,
    category: 'breathing',
    condition: 'Complete 1 breathing session'
  },
  {
    id: 'breath_master',
    title: 'Breath Master',
    description: 'Complete 10 breathing exercises',
    icon: '🧘',
    points: 200,
    category: 'breathing',
    condition: 'Complete 10 breathing sessions'
  },
  {
    id: 'knowledge_seeker',
    title: 'Knowledge Seeker',
    description: 'Read 5 articles in Learn section',
    icon: '📚',
    points: 100,
    category: 'learning',
    condition: 'Read 5 articles'
  },
  {
    id: 'daily_journal',
    title: 'Dear Diary',
    description: 'Write your first journal entry',
    icon: '📖',
    points: 50,
    category: 'journal',
    condition: 'Create 1 journal entry'
  },
  {
    id: 'journal_streak',
    title: 'Consistent Chronicler',
    description: 'Write journal entries 5 days in a row',
    icon: '✍️',
    points: 300,
    category: 'journal',
    condition: '5-day journal streak'
  },
  {
    id: 'calm_in_crisis',
    title: 'Calm in Crisis',
    description: 'Successfully use SOS mode to calm down',
    icon: '🆘',
    points: 150,
    category: 'sos',
    condition: 'Complete SOS session'
  },
  {
    id: 'early_bird',
    title: 'Early Bird',
    description: 'Use the app before 7 AM',
    icon: '🌅',
    points: 100,
    category: 'general',
    condition: 'Use app before 7 AM',
    secret: true
  },
  {
    id: 'night_owl',
    title: 'Night Owl',
    description: 'Use the app after 11 PM',
    icon: '🌙',
    points: 100,
    category: 'general',
    condition: 'Use app after 11 PM',
    secret: true
  }
];

export interface Level {
  level: number;
  pointsNeeded: number;
  title: string;
  icon: string;
}

export const levels: Level[] = [
  { level: 1, pointsNeeded: 0, title: 'Nervous Novice', icon: '🐣' },
  { level: 2, pointsNeeded: 100, title: 'Calm Beginner', icon: '🌱' },
  { level: 3, pointsNeeded: 300, title: 'Steady Explorer', icon: '🌿' },
  { level: 4, pointsNeeded: 600, title: 'Serene Adventurer', icon: '🌺' },
  { level: 5, pointsNeeded: 1000, title: 'Tranquil Voyager', icon: '🦋' },
  { level: 6, pointsNeeded: 1500, title: 'Peace Pilot', icon: '✈️' },
  { level: 7, pointsNeeded: 2100, title: 'Sky Master', icon: '🌟' },
  { level: 8, pointsNeeded: 2800, title: 'Cloud Conqueror', icon: '☁️' },
  { level: 9, pointsNeeded: 3600, title: 'Zen Navigator', icon: '🎯' },
  { level: 10, pointsNeeded: 4500, title: 'Flight Guru', icon: '👑' }
];

export interface Streak {
  current: number;
  longest: number;
  lastCheckIn: string;
}

export interface UserProgress {
  points: number;
  level: number;
  achievements: string[];
  streak: Streak;
}