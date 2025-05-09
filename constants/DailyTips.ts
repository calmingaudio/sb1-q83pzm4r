export interface DailyTip {
  id: string;
  title: string;
  content: string;
  category: 'preparation' | 'during-flight' | 'coping' | 'education' | 'mindset';
}

export const dailyTips: DailyTip[] = [
  // Preparation Tips
  {
    id: 'prep_1',
    title: 'Choose Your Seat Wisely',
    content: 'Seats over the wing experience less turbulence. Book these seats for a smoother flight experience.',
    category: 'preparation'
  },
  {
    id: 'prep_2',
    title: 'Morning Flight Advantage',
    content: "Book morning flights when possible. Air tends to be calmer, and there's typically less turbulence.",
    category: 'preparation'
  },
  {
    id: 'prep_3',
    title: 'Comfort Kit Essentials',
    content: 'Pack a comfort kit: noise-canceling headphones, eye mask, cozy socks, and your favorite snacks.',
    category: 'preparation'
  },
  {
    id: 'prep_4',
    title: 'Airport Arrival Strategy',
    content: 'Arrive early to avoid rushing. Extra time helps reduce stress and allows you to settle your nerves.',
    category: 'preparation'
  },
  {
    id: 'prep_5',
    title: 'Pre-Flight Routine',
    content: 'Establish a calming pre-flight routine: light exercise, meditation, or reading can help center you.',
    category: 'preparation'
  },
  
  // During Flight Tips
  {
    id: 'flight_1',
    title: 'Turbulence Technique',
    content: "During turbulence, focus on a fixed point inside the aircraft and imagine you're on a boat gently rocking.",
    category: 'during-flight'
  },
  {
    id: 'flight_2',
    title: 'Cabin Crew Wisdom',
    content: 'Watch the cabin crew during moments of uncertainty. Their calm demeanor confirms that everything is normal.',
    category: 'during-flight'
  },
  {
    id: 'flight_3',
    title: 'Stay Hydrated',
    content: 'Regular sips of water help maintain physical comfort and can be a mindful activity during anxious moments.',
    category: 'during-flight'
  },
  {
    id: 'flight_4',
    title: 'Muscle Relaxation',
    content: 'Progressively tense and relax each muscle group, starting from your toes up to your head.',
    category: 'during-flight'
  },
  {
    id: 'flight_5',
    title: 'Window Seat Perspective',
    content: 'If you have a window seat, looking at the horizon can help maintain your sense of balance.',
    category: 'during-flight'
  },
  
  // Coping Strategies
  {
    id: 'cope_1',
    title: 'The 5-4-3-2-1 Technique',
    content: 'Name 5 things you see, 4 you feel, 3 you hear, 2 you smell, and 1 you taste. This grounding exercise helps manage anxiety.',
    category: 'coping'
  },
  {
    id: 'cope_2',
    title: 'Breathing Box',
    content: 'Practice box breathing: inhale for 4, hold for 4, exhale for 4, hold for 4. Repeat as needed.',
    category: 'coping'
  },
  {
    id: 'cope_3',
    title: 'Positive Mantras',
    content: 'Develop a personal mantra like "I am safe" or "This will pass" to repeat during anxious moments.',
    category: 'coping'
  },
  {
    id: 'cope_4',
    title: 'Distraction Power',
    content: 'Engage in absorbing activities: puzzles, audiobooks, or writing can help redirect anxious thoughts.',
    category: 'coping'
  },
  {
    id: 'cope_5',
    title: 'Hand Massage',
    content: 'Give yourself a hand massage. This self-soothing technique can help release tension and anxiety.',
    category: 'coping'
  },
  
  // Educational Tips
  {
    id: 'edu_1',
    title: 'Wing Flex Facts',
    content: 'Aircraft wings are designed to flex up to 90 degrees. That movement you see is a safety feature, not a flaw.',
    category: 'education'
  },
  {
    id: 'edu_2',
    title: 'Multiple Backups',
    content: 'Commercial aircraft have multiple backup systems for every critical component. Redundancy equals safety.',
    category: 'education'
  },
  {
    id: 'edu_3',
    title: 'Turbulence Truth',
    content: 'Turbulence has never caused a modern commercial aircraft to crash. It\'s uncomfortable but not dangerous.',
    category: 'education'
  },
  {
    id: 'edu_4',
    title: 'Lightning Protection',
    content: 'Aircraft are designed to handle lightning strikes. They occur regularly and pose no risk to modern planes.',
    category: 'education'
  },
  {
    id: 'edu_5',
    title: 'Pilot Training',
    content: 'Pilots undergo rigorous training every 6 months, practicing responses to every possible scenario.',
    category: 'education'
  },
  
  // Mindset Tips
  {
    id: 'mind_1',
    title: 'Growth Perspective',
    content: 'View each flight as an opportunity to build confidence. Every successful trip is proof of your resilience.',
    category: 'mindset'
  },
  {
    id: 'mind_2',
    title: 'Statistical Safety',
    content: 'Flying is statistically the safest form of travel, far safer than driving to the airport.',
    category: 'mindset'
  },
  {
    id: 'mind_3',
    title: 'Anxiety vs. Danger',
    content: "Remember: feeling anxious doesn't mean you're in danger. It's just your body's natural response to uncertainty.",
    category: 'mindset'
  },
  {
    id: 'mind_4',
    title: 'Celebrate Progress',
    content: 'Acknowledge your courage in flying despite your fears. Every flight is an achievement.',
    category: 'mindset'
  },
  {
    id: 'mind_5',
    title: 'Future Focus',
    content: 'Think about the destination and what awaits you there. The flight is just a short part of your journey.',
    category: 'mindset'
  }
];