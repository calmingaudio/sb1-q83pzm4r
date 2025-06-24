export interface AviationStat {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'safety' | 'training' | 'technology' | 'statistics';
}

export const aviationStats: AviationStat[] = [
  {
    id: 'crash_odds',
    title: 'Your odds of a plane crash are 1 in 11 million',
    description: "Flying is one of the safest activities you can do—statistically far safer than driving.",
    icon: '🎯',
    category: 'statistics'
  },
  {
    id: 'daily_flights',
    title: 'Over 100,000 flights happen safely every day',
    description: "Commercial airlines operate tens of thousands of flights each day without incident.",
    icon: '🌍',
    category: 'statistics'
  },
  {
    id: 'success_rate',
    title: '99.999% of flights arrive without any problem',
    description: "The aviation industry has nearly perfect safety records.",
    icon: '✅',
    category: 'statistics'
  },
  {
    id: 'no_fatalities',
    title: 'No U.S. commercial airline fatalities since 2009',
    description: "Over a decade of perfect safety among major U.S. carriers.",
    icon: '🇺🇸',
    category: 'safety'
  },
  {
    id: 'pilot_hours',
    title: 'Pilots require over 1,500 hours of training',
    description: "Extensive flight hours are mandatory before piloting a commercial jet.",
    icon: '👨‍✈️',
    category: 'training'
  },
  {
    id: 'wing_strength',
    title: 'Modern planes are built to handle intense stress',
    description: "Wings can bend up to 26 feet without breaking—much more than needed.",
    icon: '💪',
    category: 'technology'
  },
  {
    id: 'engine_durability',
    title: 'Aircraft engines are built to withstand fire, birds, and hail',
    description: "Jet engines go through extreme tests before certification.",
    icon: '⚙️',
    category: 'technology'
  },
  {
    id: 'single_engine',
    title: 'Planes can fly with one engine',
    description: "Commercial aircraft are designed to safely operate with a single engine if needed.",
    icon: '🛩️',
    category: 'technology'
  },
  {
    id: 'pre_flight_inspection',
    title: 'All aircraft are inspected before every flight',
    description: "Maintenance checks are routine and mandatory before takeoff.",
    icon: '🔧',
    category: 'safety'
  },
  {
    id: 'weather_radar',
    title: 'Aircraft radar can detect storms over 160 miles away',
    description: "Giving pilots time to avoid bad weather safely and efficiently.",
    icon: '📡',
    category: 'technology'
  },
  {
    id: 'lightning_safe',
    title: 'Lightning strikes are common—and harmless',
    description: "Aircraft are struck about once a year and safely dissipate the energy.",
    icon: '⚡',
    category: 'technology'
  },
  {
    id: 'autopilot_usage',
    title: 'Over 90% of long-haul flights use autopilot',
    description: "Advanced systems reduce pilot workload and increase precision.",
    icon: '🤖',
    category: 'technology'
  },
  {
    id: 'glide_capability',
    title: 'Planes are certified to glide without engines',
    description: "They can glide up to 60 miles if necessary after engine failure.",
    icon: '🪂',
    category: 'technology'
  },
  {
    id: 'turbulence_harmless',
    title: 'Turbulence rarely causes injury',
    description: "It feels scary but is structurally harmless and usually brief.",
    icon: '🌪️',
    category: 'safety'
  },
  {
    id: 'black_box_durability',
    title: 'Flight data recorders withstand fire and pressure',
    description: "Black boxes survive the most extreme conditions for safety investigation.",
    icon: '📦',
    category: 'technology'
  },
  {
    id: 'wing_flexibility',
    title: 'Aircraft wings flex to absorb turbulence',
    description: "This flexibility is a safety feature that helps the plane ride out rough air.",
    icon: '🌊',
    category: 'technology'
  },
  {
    id: 'crew_training_frequency',
    title: 'Emergency procedures are practiced yearly by all crew',
    description: "Flight attendants and pilots drill fire, smoke, and evacuation protocols.",
    icon: '🎯',
    category: 'training'
  },
  {
    id: 'pilot_testing',
    title: 'Pilots are tested every 6 to 12 months',
    description: "Regular evaluations keep their skills sharp and up to date.",
    icon: '📋',
    category: 'training'
  },
  {
    id: 'redundant_systems',
    title: 'Commercial planes are required to have multiple backups',
    description: "Redundant hydraulic, electrical, and flight control systems ensure safety.",
    icon: '🔄',
    category: 'technology'
  },
  {
    id: 'storm_avoidance',
    title: 'Planes avoid storms, not fly through them',
    description: "Routes are planned around rough weather using satellite and radar data.",
    icon: '🌤️',
    category: 'safety'
  },
  {
    id: 'turbulence_no_crash',
    title: 'Turbulence has never caused a plane to crash',
    description: "Modern aircraft are built to handle far more than turbulence delivers.",
    icon: '🛡️',
    category: 'safety'
  },
  {
    id: 'passenger_injuries_rare',
    title: 'Passenger injuries are extremely rare',
    description: "Most are avoidable by staying seated with a seatbelt on.",
    icon: '🪑',
    category: 'safety'
  },
  {
    id: 'weather_delays',
    title: 'Most airline delays are weather-related, not mechanical',
    description: "Safety is always prioritized, and planes are rarely the cause of delays.",
    icon: '🌧️',
    category: 'safety'
  },
  {
    id: 'annual_passengers',
    title: 'Over 4.5 billion people fly safely each year',
    description: "That's more than half the world's population—every year.",
    icon: '👥',
    category: 'statistics'
  },
  {
    id: 'real_time_tracking',
    title: 'Every flight is tracked in real time',
    description: "Satellites and radar monitor flights from takeoff to landing.",
    icon: '🛰️',
    category: 'technology'
  },
  {
    id: 'cabin_pressure_safe',
    title: 'Cabin pressure is safe and regulated',
    description: "Controlled to ensure oxygen and comfort even at 35,000 feet.",
    icon: '💨',
    category: 'technology'
  },
  {
    id: 'airport_emergency_crews',
    title: 'Modern airports have emergency crews on standby 24/7',
    description: "Fire, medical, and rescue teams are always ready.",
    icon: '🚒',
    category: 'safety'
  },
  {
    id: 'maintenance_standards',
    title: 'Commercial aircraft are inspected far beyond government minimums',
    description: "Airlines go above and beyond legal requirements for maintenance.",
    icon: '🔍',
    category: 'safety'
  },
  {
    id: 'autoland_capability',
    title: 'Planes land safely in low or zero visibility',
    description: "Autoland technology enables safe landing in fog, snow, or storms.",
    icon: '🌫️',
    category: 'technology'
  },
  {
    id: 'crew_medical_training',
    title: 'Crew members are trained in CPR and emergency medical response',
    description: "Medical events onboard are rare but well-managed.",
    icon: '🏥',
    category: 'training'
  },
  {
    id: 'radio_backups',
    title: 'Aircraft have multiple radio systems for backup communication',
    description: "Ensuring constant contact with air traffic control.",
    icon: '📻',
    category: 'technology'
  },
  {
    id: 'simulator_training',
    title: 'Flight simulators are used for real-life emergency training',
    description: "Pilots practice rare events like engine failure and extreme weather.",
    icon: '🎮',
    category: 'training'
  },
  {
    id: 'flight_attendant_safety',
    title: 'Flight attendants are trained to manage panic and keep passengers safe',
    description: "They're not just servers—they're safety professionals.",
    icon: '👩‍✈️',
    category: 'training'
  },
  {
    id: 'international_standards',
    title: 'International safety standards are uniform worldwide',
    description: "Global organizations ensure all aircraft follow the same strict rules.",
    icon: '🌐',
    category: 'safety'
  },
  {
    id: 'deicing_mandatory',
    title: 'De-icing is mandatory in cold weather',
    description: "It ensures lift and control even in freezing temperatures.",
    icon: '❄️',
    category: 'safety'
  },
  {
    id: 'aircraft_brakes',
    title: 'Aircraft brakes can stop a plane at full takeoff speed',
    description: "If something goes wrong before lift-off, planes can stop safely.",
    icon: '🛑',
    category: 'technology'
  },
  {
    id: 'runway_strength',
    title: 'Runways are built to handle heavy landings',
    description: "They're reinforced and regularly maintained to handle every plane type.",
    icon: '🛤️',
    category: 'safety'
  },
  {
    id: 'atc_daily_flights',
    title: 'Air Traffic Control handles over 45,000 flights daily in the U.S. alone',
    description: "And coordinates them all safely through the skies.",
    icon: '🎯',
    category: 'statistics'
  },
  {
    id: 'flight_plans',
    title: 'Every flight must file and follow a specific flight plan',
    description: "Ensuring the safest and most efficient route is used.",
    icon: '🗺️',
    category: 'safety'
  },
  {
    id: 'pilot_experience',
    title: 'Pilots often have military or corporate aviation experience first',
    description: "Bringing thousands of flight hours into commercial cockpits.",
    icon: '🎖️',
    category: 'training'
  },
  {
    id: 'high_altitude_design',
    title: 'Planes are designed to fly at high altitude to avoid turbulence',
    description: "Cruising altitudes are above most weather systems.",
    icon: '☁️',
    category: 'technology'
  },
  {
    id: 'boeing_777_safety',
    title: 'The Boeing 777 has logged over 20 million flight hours safely',
    description: "It's among the safest planes ever built.",
    icon: '✈️',
    category: 'statistics'
  },
  {
    id: 'airbus_frequency',
    title: 'Airbus A320 aircraft take off every 1.6 seconds globally',
    description: "With an incredible safety record across millions of flights.",
    icon: '🚀',
    category: 'statistics'
  },
  {
    id: 'backup_oxygen',
    title: 'Backup oxygen systems activate if cabin pressure drops',
    description: "Ensuring passengers and crew remain safe at high altitudes.",
    icon: '😷',
    category: 'technology'
  },
  {
    id: 'pilot_health_exams',
    title: 'Commercial pilots retire after strict health exams',
    description: "Regular screenings ensure only the healthiest pilots fly.",
    icon: '🩺',
    category: 'training'
  },
  {
    id: 'satellite_navigation',
    title: 'Advanced satellite navigation reduces midair collision risk to near zero',
    description: "Planes are precisely spaced and monitored worldwide.",
    icon: '🛰️',
    category: 'technology'
  },
  {
    id: 'stress_testing',
    title: 'Modern jets are tested in wind tunnels and real-world stress simulations',
    description: "Ensuring they hold up in the harshest possible conditions.",
    icon: '🌪️',
    category: 'technology'
  },
  {
    id: 'airline_investment',
    title: 'Airlines invest billions in safety improvements yearly',
    description: "It's their top priority for customers and employees alike.",
    icon: '💰',
    category: 'safety'
  },
  {
    id: 'safety_evolution',
    title: 'Aviation is 50 times safer now than in the 1960s',
    description: "Thanks to decades of improvements in tech, training, and monitoring.",
    icon: '📈',
    category: 'statistics'
  },
  {
    id: 'travel_efficiency',
    title: 'Flying reduces travel time, fatigue, and road-related risks',
    description: "It's faster, safer, and more efficient than any other form of long-distance travel.",
    icon: '🎯',
    category: 'statistics'
  }
];