export interface Question {
  id: string;
  text: string;
  options: Option[];
  multiSelect?: boolean;
}

export interface Option {
  id: string;
  text: string;
  value: string;
}

export const onboardingQuestions: Question[] = [
  {
    id: 'fear_type',
    text: 'What aspects of flying cause you the most anxiety?',
    options: [
      { id: 'takeoff', text: 'Takeoff', value: 'takeoff' },
      { id: 'landing', text: 'Landing', value: 'landing' },
      { id: 'turbulence', text: 'Turbulence', value: 'turbulence' },
      { id: 'enclosed', text: 'Being in an enclosed space', value: 'enclosed' },
      { id: 'crashes', text: 'Fear of crashes', value: 'crashes' },
      { id: 'control', text: 'Lack of control', value: 'control' },
      { id: 'claustrophobia', text: 'Claustrophobia', value: 'claustrophobia' },
    ],
    multiSelect: true,
  },
  {
    id: 'anxiety_level',
    text: 'How would you rate your typical anxiety level during flights?',
    options: [
      { id: 'mild', text: 'Mild - Slightly nervous but manageable', value: 'mild' },
      { id: 'moderate', text: 'Moderate - Noticeably anxious during parts of the flight', value: 'moderate' },
      { id: 'severe', text: 'Severe - Very anxious for most or all of the flight', value: 'severe' },
      { id: 'extreme', text: 'Extreme - Panic attacks or avoiding flying when possible', value: 'extreme' },
    ],
  },
  {
    id: 'coping_strategies',
    text: 'Which coping strategies have you tried before?',
    options: [
      { id: 'breathing', text: 'Deep breathing exercises', value: 'breathing' },
      { id: 'distraction', text: 'Distraction (movies, music, books)', value: 'distraction' },
      { id: 'medication', text: 'Medication', value: 'medication' },
      { id: 'alcohol', text: 'Alcohol', value: 'alcohol' },
      { id: 'therapy', text: 'Therapy or counseling', value: 'therapy' },
      { id: 'education', text: 'Learning about how planes work', value: 'education' },
      { id: 'none', text: 'None of these', value: 'none' },
    ],
    multiSelect: true,
  },
  {
    id: 'flight_frequency',
    text: 'How frequently do you fly?',
    options: [
      { id: 'never', text: 'Never or almost never', value: 'never' },
      { id: 'yearly', text: 'A few times per year', value: 'yearly' },
      { id: 'monthly', text: 'Monthly', value: 'monthly' },
      { id: 'weekly', text: 'Weekly or more', value: 'weekly' },
    ],
  },
];