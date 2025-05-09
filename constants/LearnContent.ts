export interface FAQCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  faqs: FAQ[];
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
}

export const faqCategories: FAQCategory[] = [
  {
    id: 'general-fear',
    title: '💭 General Fear of Flying',
    icon: 'plane',
    description: 'Understanding and managing flight anxiety',
    faqs: [
      {
        id: 'fear_1',
        question: 'Is it normal to be scared of flying?',
        answer: 'Yes—very normal. Millions of people feel nervous, even frequent flyers. It\'s not a sign of weakness or danger. Your brain is reacting to unfamiliar surroundings and a lack of control. The good news? Flying is one of the safest activities you can do.'
      },
      {
        id: 'fear_2',
        question: 'What if I have a panic attack mid-flight?',
        answer: 'You\'re not stuck, and you\'re never alone. Flight attendants are trained to help with anxiety and will care for you kindly and without judgment. You can also open the SOS section of SkyCalm—it walks you through a calming plan using grounding, visualization, and affirmations.'
      },
      {
        id: 'fear_3',
        question: 'What can I do to feel calmer during the flight?',
        answer: 'Practice deep breathing, focus on something comforting, and use SkyCalm\'s Breathe section to slow your heartbeat and regulate your nervous system. Bringing a familiar item like a soft sweater, stress ball, or your favorite playlist can also help anchor your mind.'
      }
    ]
  },
  {
    id: 'how-planes-fly',
    title: '✈️ How Planes Fly',
    icon: 'plane',
    description: 'Understanding the science and physics of flight',
    faqs: [
      {
        id: 'planes_1',
        question: 'How do airplanes stay in the air?',
        answer: 'Airplanes fly because of lift—a force created by the wings as they move through the air. It\'s simple physics and deeply understood. Aviation engineers and pilots rely on it every single day.'
      },
      {
        id: 'planes_2',
        question: 'What keeps a plane from falling out of the sky?',
        answer: 'Even in rare mechanical problems, planes are designed to remain stable and glide safely. Everything about commercial aircraft is built with redundancy, safety layers, and years of tested engineering.'
      },
      {
        id: 'planes_3',
        question: 'Can a plane glide if the engines stop?',
        answer: 'Yes. Commercial jets can glide for over 60 miles from cruising altitude. This is part of pilot training, and it\'s happened safely in real-world situations.'
      },
      {
        id: 'planes_4',
        question: 'What happens if one engine fails?',
        answer: 'Modern aircraft are designed to fly perfectly fine with just one engine. Pilots train regularly to handle this situation, and procedures are clear and precise.'
      }
    ]
  },
  {
    id: 'takeoff-landing',
    title: '🛬 Takeoff & Landing',
    icon: 'plane-landing',
    description: 'What to expect during takeoff and landing',
    faqs: [
      {
        id: 'tl_1',
        question: 'Why is takeoff so loud and intense?',
        answer: 'The engines are at full thrust to lift the plane into the air. The vibrations and sounds might seem alarming, but they\'re completely normal. It\'s the plane doing exactly what it\'s supposed to.'
      },
      {
        id: 'tl_2',
        question: 'Is takeoff or landing more dangerous?',
        answer: 'Both are very safe. They\'re the most controlled phases of flight with the most crew oversight. Pilots rehearse these procedures thousands of times in simulators and are prepared for every scenario.'
      },
      {
        id: 'tl_3',
        question: 'Why do my ears pop during ascent or descent?',
        answer: 'It\'s just your eardrums adjusting to changing air pressure. Chewing gum, swallowing, or yawning helps. It\'s uncomfortable but not harmful.'
      },
      {
        id: 'tl_4',
        question: 'Why do the lights dim during takeoff and landing?',
        answer: 'It helps your eyes adjust in case of an evacuation (which is extremely rare). It\'s a routine safety measure—not a sign that something is wrong.'
      }
    ]
  },
  {
    id: 'turbulence',
    title: '🌩️ Turbulence',
    icon: 'wind',
    description: 'Understanding and coping with turbulence',
    faqs: [
      {
        id: 'turb_1',
        question: 'What causes turbulence?',
        answer: 'Turbulence is simply air moving at different speeds—like a pothole in the sky. It might feel unsettling, but planes are built to handle it without issue.'
      },
      {
        id: 'turb_2',
        question: 'Can turbulence crash a plane?',
        answer: 'No. It might feel scary, but turbulence is routine and expected. Aircraft are tested to endure far worse than any turbulence you\'ll feel on a commercial flight.'
      },
      {
        id: 'turb_3',
        question: 'Why does turbulence feel worse in certain seats?',
        answer: 'Seats near the wings tend to feel smoother. Toward the back, movement is more noticeable. Choosing a seat over the wing or in the front may help ease your comfort.'
      },
      {
        id: 'turb_4',
        question: 'Can pilots avoid turbulence?',
        answer: 'Often, yes. Pilots use radar and reports from other aircraft to avoid turbulent zones. If turbulence can\'t be avoided, they\'ll slow the plane down to minimize the bumps.'
      }
    ]
  },
  {
    id: 'sounds',
    title: '🔊 Airplane Sounds',
    icon: 'volume-2',
    description: 'Understanding common airplane noises',
    faqs: [
      {
        id: 'sound_1',
        question: 'What\'s that clunking or banging noise during flight?',
        answer: 'These are sounds from the landing gear retracting, flaps moving, or cabin systems adjusting. They\'re mechanical operations—not problems.'
      },
      {
        id: 'sound_2',
        question: 'What is the high-pitched sound during descent?',
        answer: 'That\'s usually the engine or air pressure system adjusting for landing. Though it might sound odd, it\'s expected and harmless.'
      },
      {
        id: 'sound_3',
        question: 'Are those mechanical noises normal?',
        answer: 'Yes! Planes make all kinds of mechanical noises as they go through each stage of flight—just like your car does when shifting or braking.'
      },
      {
        id: 'sound_4',
        question: 'Why do I hear the landing gear deploy?',
        answer: 'That thunk is a great sound—it means the plane is preparing to land safely. The gear locks into place and you\'ll be on the ground soon.'
      }
    ]
  },
  {
    id: 'safety',
    title: '🛡️ Aircraft Safety',
    icon: 'shield',
    description: 'Understanding aviation safety measures',
    faqs: [
      {
        id: 'safety_1',
        question: 'How safe is flying compared to driving?',
        answer: 'Flying is statistically much safer than driving. Commercial aviation is one of the most regulated, inspected, and trained industries in the world.'
      },
      {
        id: 'safety_2',
        question: 'How often are planes inspected?',
        answer: 'Every day. Each aircraft undergoes routine checks before, during, and after flights. There are also in-depth monthly and yearly inspections.'
      },
      {
        id: 'safety_3',
        question: 'What happens during an emergency?',
        answer: 'Planes have detailed protocols, redundant systems, and trained professionals. From the oxygen masks to emergency landings, your crew is always ready—and real emergencies are extremely rare.'
      },
      {
        id: 'safety_4',
        question: 'How do oxygen masks work?',
        answer: 'If cabin pressure drops, the masks provide oxygen from a self-contained canister. Just pull the mask, place it over your nose and mouth, and breathe normally—it\'s automatic and very safe.'
      }
    ]
  },
  {
    id: 'experience',
    title: '💺 In-Flight Experience',
    icon: 'armchair',
    description: 'Making your flight more comfortable',
    faqs: [
      {
        id: 'exp_1',
        question: 'Why do tray tables and seats have to be upright?',
        answer: 'It ensures the path is clear in case of an evacuation and helps your posture be safer during landing or takeoff.'
      },
      {
        id: 'exp_2',
        question: 'Can I walk around during the flight?',
        answer: 'Yes—when the seatbelt sign is off. Walking can help with circulation and reduce anxiety. Just follow crew instructions and be mindful of turbulence.'
      },
      {
        id: 'exp_3',
        question: 'What if I get sick or anxious mid-flight?',
        answer: 'Let the crew know—they\'re trained to help. You can also open SkyCalm\'s SOS section for panic support, or use Breathe to steady your heart rate.'
      }
    ]
  },
  {
    id: 'luggage',
    title: '🧳 Luggage & Baggage',
    icon: 'luggage',
    description: 'Understanding baggage procedures',
    faqs: [
      {
        id: 'lug_1',
        question: 'What happens to my luggage after check-in?',
        answer: 'It enters a secure, automated system that scans, sorts, and loads it into the cargo hold. It\'s carefully tracked from gate to gate.'
      },
      {
        id: 'lug_2',
        question: 'What if my bag gets lost?',
        answer: 'Airlines use tracking tags and barcode scans to keep tabs on bags. Most "lost" luggage is just delayed and arrives within a day. For peace of mind, you can place an Apple AirTag or similar tracker inside your bag to see exactly where it is at all times from your phone.'
      },
      {
        id: 'lug_3',
        question: 'Why are there limits on liquids and bag size?',
        answer: 'These are global safety regulations. Limiting certain items helps prevent dangerous substances from being brought on board. Keeping bag sizes regulated also ensures everything fits safely in the cabin or cargo.'
      },
      {
        id: 'lug_4',
        question: 'What should I pack in my carry-on just in case?',
        answer: 'Essentials: phone, charger, medications, ID/passport, one change of clothes, valuables, and anything that comforts you (snacks, headphones, hand wipes). That way, even if your checked bag is delayed, you\'ll have what you need.'
      }
    ]
  },
  {
    id: 'procedures',
    title: '🛫 Flight Procedures',
    icon: 'clipboard-list',
    description: 'Understanding flight procedures and delays',
    faqs: [
      {
        id: 'proc_1',
        question: 'Why do I need to arrive early for my flight?',
        answer: 'Airports have security, check-in, and boarding timelines. Arriving early prevents stress and gives you time to adjust and get comfortable.'
      },
      {
        id: 'proc_2',
        question: 'Why do planes wait on the runway sometimes?',
        answer: 'It\'s usually due to traffic congestion, weather, or air traffic control spacing. It\'s inconvenient, but it means your crew is following strict safety timing.'
      },
      {
        id: 'proc_3',
        question: 'Why are some flights delayed or rerouted?',
        answer: 'Delays are always for your safety—whether due to weather, maintenance, or coordination with airport traffic. Though frustrating, they\'re one of the best examples of safety taking priority.'
      }
    ]
  }
];