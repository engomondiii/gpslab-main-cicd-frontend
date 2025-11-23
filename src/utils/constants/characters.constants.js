/* ============================================
   GPS LAB - Character Constants
   35 Character badges with descriptions
   ============================================ */

/**
 * 35 Character badges aligned with 35 stages
 */
export const CharacterBadges = {
  // GPS 101 (Red Beacon) - Stages 1-5
  1: {
    id: 'courage',
    name: 'Courage',
    stage: 1,
    beacon: 'GPS 101',
    description: 'Face challenges with bravery and determination',
    longDescription: 'The ability to confront fear, danger, or adversity with confidence and resolve. Courage means taking action despite uncertainty or risk.',
    icon: 'courage.svg',
    color: '#FF6B6B',
    pointsToEarn: 100,
    earnCriteria: [
      'Accept challenging missions',
      'Take calculated risks',
      'Overcome fears and doubts',
      'Stand up for what is right',
    ],
  },
  2: {
    id: 'humility',
    name: 'Humility',
    stage: 2,
    beacon: 'GPS 101',
    description: 'Recognize your limitations and seek help when needed',
    longDescription: 'The quality of being modest and respectful, acknowledging that you don\'t have all the answers and being willing to learn from others.',
    icon: 'humility.svg',
    color: '#FF6B6B',
    pointsToEarn: 100,
    earnCriteria: [
      'Ask for help when needed',
      'Accept constructive feedback',
      'Acknowledge mistakes',
      'Give credit to others',
    ],
  },
  3: {
    id: 'integrity',
    name: 'Integrity',
    stage: 3,
    beacon: 'GPS 101',
    description: 'Do the right thing, even when no one is watching',
    longDescription: 'The quality of being honest and having strong moral principles. Integrity means your actions align with your values consistently.',
    icon: 'integrity.svg',
    color: '#FF6B6B',
    pointsToEarn: 100,
    earnCriteria: [
      'Be honest in all dealings',
      'Follow through on commitments',
      'Resist shortcuts or cheating',
      'Report issues transparently',
    ],
  },
  4: {
    id: 'excellence',
    name: 'Excellence',
    stage: 4,
    beacon: 'GPS 101',
    description: 'Pursue quality and mastery in all you do',
    longDescription: 'The commitment to high standards and continuous improvement. Excellence is about doing your best work consistently.',
    icon: 'excellence.svg',
    color: '#FF6B6B',
    pointsToEarn: 100,
    earnCriteria: [
      'Exceed expectations regularly',
      'Pay attention to details',
      'Seek continuous improvement',
      'Deliver high-quality work',
    ],
  },
  5: {
    id: 'compassion',
    name: 'Compassion',
    stage: 5,
    beacon: 'GPS 101',
    description: 'Show empathy and care for others',
    longDescription: 'The ability to understand and share the feelings of others, coupled with a desire to help alleviate their suffering.',
    icon: 'compassion.svg',
    color: '#FF6B6B',
    pointsToEarn: 100,
    earnCriteria: [
      'Help struggling team members',
      'Show understanding and patience',
      'Consider others\' perspectives',
      'Practice active listening',
    ],
  },

  // GPS Prep (Orange Beacon) - Stages 6-10
  6: {
    id: 'wisdom',
    name: 'Wisdom',
    stage: 6,
    beacon: 'GPS Prep',
    description: 'Apply knowledge with discernment and good judgment',
    longDescription: 'The ability to use knowledge, experience, and understanding to make sound decisions and judgments.',
    icon: 'wisdom.svg',
    color: '#FF8C42',
    pointsToEarn: 100,
    earnCriteria: [
      'Make thoughtful decisions',
      'Learn from past experiences',
      'Consider long-term consequences',
      'Seek counsel from mentors',
    ],
  },
  7: {
    id: 'stewardship',
    name: 'Stewardship',
    stage: 7,
    beacon: 'GPS Prep',
    description: 'Manage resources responsibly and sustainably',
    longDescription: 'The careful and responsible management of resources entrusted to your care, thinking beyond personal benefit.',
    icon: 'stewardship.svg',
    color: '#FF8C42',
    pointsToEarn: 100,
    earnCriteria: [
      'Use resources efficiently',
      'Consider environmental impact',
      'Plan for sustainability',
      'Leave things better than you found them',
    ],
  },
  8: {
    id: 'resilience',
    name: 'Resilience',
    stage: 8,
    beacon: 'GPS Prep',
    description: 'Bounce back from setbacks and challenges',
    longDescription: 'The capacity to recover quickly from difficulties and adapt to change or adversity.',
    icon: 'resilience.svg',
    color: '#FF8C42',
    pointsToEarn: 100,
    earnCriteria: [
      'Overcome obstacles',
      'Learn from failures',
      'Maintain positive attitude',
      'Adapt to changing circumstances',
    ],
  },
  9: {
    id: 'diligence',
    name: 'Diligence',
    stage: 9,
    beacon: 'GPS Prep',
    description: 'Work persistently and carefully toward goals',
    longDescription: 'Careful and persistent effort applied to one\'s work or duties, characterized by steady attention and energetic application.',
    icon: 'diligence.svg',
    color: '#FF8C42',
    pointsToEarn: 100,
    earnCriteria: [
      'Complete tasks thoroughly',
      'Meet deadlines consistently',
      'Work steadily toward goals',
      'Maintain focus and concentration',
    ],
  },
  10: {
    id: 'generosity',
    name: 'Generosity',
    stage: 10,
    beacon: 'GPS Prep',
    description: 'Give freely of your time, talents, and resources',
    longDescription: 'The quality of being kind, understanding, and not selfish; willingness to give help, time, or resources to others.',
    icon: 'generosity.svg',
    color: '#FF8C42',
    pointsToEarn: 100,
    earnCriteria: [
      'Share knowledge freely',
      'Help others succeed',
      'Contribute to community',
      'Give without expecting return',
    ],
  },

  // GPS Simulation (Yellow Beacon) - Stages 11-15
  11: {
    id: 'innovation',
    name: 'Innovation',
    stage: 11,
    beacon: 'GPS Simulation',
    description: 'Create novel and valuable solutions',
    longDescription: 'The introduction of new ideas, methods, or products; thinking creatively to solve problems in original ways.',
    icon: 'innovation.svg',
    color: '#F1C40F',
    pointsToEarn: 100,
    earnCriteria: [
      'Generate creative solutions',
      'Challenge conventional thinking',
      'Experiment with new approaches',
      'Turn ideas into reality',
    ],
  },
  12: {
    id: 'collaboration',
    name: 'Collaboration',
    stage: 12,
    beacon: 'GPS Simulation',
    description: 'Work effectively with diverse teams',
    longDescription: 'The ability to work cooperatively with others toward common goals, leveraging diverse perspectives and skills.',
    icon: 'collaboration.svg',
    color: '#F1C40F',
    pointsToEarn: 100,
    earnCriteria: [
      'Contribute to team success',
      'Communicate effectively',
      'Resolve conflicts constructively',
      'Value diverse perspectives',
    ],
  },
  13: {
    id: 'perseverance',
    name: 'Perseverance',
    stage: 13,
    beacon: 'GPS Simulation',
    description: 'Keep going despite difficulties and obstacles',
    longDescription: 'Continued effort to do or achieve something despite difficulties, failure, or opposition.',
    icon: 'perseverance.svg',
    color: '#F1C40F',
    pointsToEarn: 100,
    earnCriteria: [
      'Push through challenges',
      'Maintain effort over time',
      'Refuse to give up',
      'Stay committed to goals',
    ],
  },
  14: {
    id: 'gratitude',
    name: 'Gratitude',
    stage: 14,
    beacon: 'GPS Simulation',
    description: 'Appreciate and acknowledge what you have',
    longDescription: 'The quality of being thankful and showing appreciation for kindness, opportunities, and blessings.',
    icon: 'gratitude.svg',
    color: '#F1C40F',
    pointsToEarn: 100,
    earnCriteria: [
      'Express appreciation regularly',
      'Recognize others\' contributions',
      'Focus on positives',
      'Practice thankfulness',
    ],
  },
  15: {
    id: 'accountability',
    name: 'Accountability',
    stage: 15,
    beacon: 'GPS Simulation',
    description: 'Take ownership of your actions and results',
    longDescription: 'The state of being responsible for decisions and actions, and being willing to accept consequences.',
    icon: 'accountability.svg',
    color: '#F1C40F',
    pointsToEarn: 100,
    earnCriteria: [
      'Own your mistakes',
      'Follow through on commitments',
      'Accept responsibility',
      'Report progress honestly',
    ],
  },

  // GPS Capstone 1 (Green Beacon) - Stages 16-20
  16: {
    id: 'leadership',
    name: 'Leadership',
    stage: 16,
    beacon: 'GPS Capstone 1',
    description: 'Guide and inspire others toward shared goals',
    longDescription: 'The ability to influence, motivate, and enable others to contribute toward organizational or team success.',
    icon: 'leadership.svg',
    color: '#2A9D8F',
    pointsToEarn: 100,
    earnCriteria: [
      'Lead by example',
      'Inspire and motivate others',
      'Make difficult decisions',
      'Develop others\' potential',
    ],
  },
  17: {
    id: 'service',
    name: 'Service',
    stage: 17,
    beacon: 'GPS Capstone 1',
    description: 'Put others\' needs before your own',
    longDescription: 'The act of helping or doing work for others without expecting personal reward; servant leadership.',
    icon: 'service.svg',
    color: '#2A9D8F',
    pointsToEarn: 100,
    earnCriteria: [
      'Serve others selflessly',
      'Prioritize community needs',
      'Volunteer your time',
      'Help without seeking recognition',
    ],
  },
  18: {
    id: 'vision',
    name: 'Vision',
    stage: 18,
    beacon: 'GPS Capstone 1',
    description: 'See possibilities and opportunities others miss',
    longDescription: 'The ability to think about or plan the future with imagination, insight, and foresight.',
    icon: 'vision.svg',
    color: '#2A9D8F',
    pointsToEarn: 100,
    earnCriteria: [
      'Identify future opportunities',
      'Create compelling visions',
      'Think strategically',
      'Anticipate trends',
    ],
  },
  19: {
    id: 'justice',
    name: 'Justice',
    stage: 19,
    beacon: 'GPS Capstone 1',
    description: 'Stand up for what is right and fair',
    longDescription: 'The quality of being fair and reasonable; upholding what is morally right and equitable.',
    icon: 'justice.svg',
    color: '#2A9D8F',
    pointsToEarn: 100,
    earnCriteria: [
      'Advocate for fairness',
      'Challenge injustice',
      'Treat everyone equitably',
      'Stand up for the marginalized',
    ],
  },
  20: {
    id: 'hope',
    name: 'Hope',
    stage: 20,
    beacon: 'GPS Capstone 1',
    description: 'Maintain optimism and belief in positive outcomes',
    longDescription: 'A feeling of expectation and desire for positive outcomes; the belief that good things are possible.',
    icon: 'hope.svg',
    color: '#2A9D8F',
    pointsToEarn: 100,
    earnCriteria: [
      'Stay positive in adversity',
      'Encourage others',
      'Believe in possibilities',
      'Inspire optimism',
    ],
  },

  // GPS Capstone 2 (Blue Beacon) - Stages 21-25
  21: {
    id: 'patience',
    name: 'Patience',
    stage: 21,
    beacon: 'GPS Capstone 2',
    description: 'Wait calmly for results without frustration',
    longDescription: 'The capacity to accept or tolerate delay, problems, or suffering without becoming annoyed or anxious.',
    icon: 'patience.svg',
    color: '#00D4FF',
    pointsToEarn: 100,
    earnCriteria: [
      'Remain calm under pressure',
      'Wait without complaining',
      'Give others time to learn',
      'Trust the process',
    ],
  },
  22: {
    id: 'faithfulness',
    name: 'Faithfulness',
    stage: 22,
    beacon: 'GPS Capstone 2',
    description: 'Remain loyal and committed through challenges',
    longDescription: 'The quality of being loyal, reliable, and steadfast in affection or allegiance.',
    icon: 'faithfulness.svg',
    color: '#00D4FF',
    pointsToEarn: 100,
    earnCriteria: [
      'Keep commitments',
      'Stay loyal to team',
      'Be reliable and consistent',
      'Stand by your values',
    ],
  },
  23: {
    id: 'courage-advanced',
    name: 'Advanced Courage',
    stage: 23,
    beacon: 'GPS Capstone 2',
    description: 'Take bigger risks for bigger rewards',
    longDescription: 'Elevated courage that involves taking significant risks in pursuit of meaningful goals and positive change.',
    icon: 'courage-advanced.svg',
    color: '#00D4FF',
    pointsToEarn: 100,
    earnCriteria: [
      'Take calculated big risks',
      'Lead in uncertain situations',
      'Challenge the status quo',
      'Be bold in decision-making',
    ],
  },
  24: {
    id: 'creativity',
    name: 'Creativity',
    stage: 24,
    beacon: 'GPS Capstone 2',
    description: 'Think outside the box and generate original ideas',
    longDescription: 'The use of imagination or original ideas to create something; the ability to transcend traditional ideas and create meaningful new ideas.',
    icon: 'creativity.svg',
    color: '#00D4FF',
    pointsToEarn: 100,
    earnCriteria: [
      'Generate unique ideas',
      'Approach problems creatively',
      'Express yourself artistically',
      'Find unconventional solutions',
    ],
  },
  25: {
    id: 'adaptability',
    name: 'Adaptability',
    stage: 25,
    beacon: 'GPS Capstone 2',
    description: 'Adjust quickly to changing circumstances',
    longDescription: 'The quality of being able to adjust to new conditions and environments; flexibility in approach and mindset.',
    icon: 'adaptability.svg',
    color: '#00D4FF',
    pointsToEarn: 100,
    earnCriteria: [
      'Embrace change',
      'Pivot when necessary',
      'Learn new skills quickly',
      'Thrive in uncertainty',
    ],
  },

  // Venture Acceleration (Indigo Beacon) - Stages 26-30
  26: {
    id: 'strategic-thinking',
    name: 'Strategic Thinking',
    stage: 26,
    beacon: 'Venture Acceleration',
    description: 'Plan multiple steps ahead with clarity',
    longDescription: 'The ability to think critically about long-term goals and develop comprehensive plans to achieve them.',
    icon: 'strategic-thinking.svg',
    color: '#9B59B6',
    pointsToEarn: 100,
    earnCriteria: [
      'Develop long-term plans',
      'Anticipate obstacles',
      'Think systematically',
      'Align actions with goals',
    ],
  },
  27: {
    id: 'entrepreneurship',
    name: 'Entrepreneurship',
    stage: 27,
    beacon: 'Venture Acceleration',
    description: 'Identify and seize opportunities',
    longDescription: 'The activity of setting up businesses or ventures, taking on financial risks in the hope of profit and impact.',
    icon: 'entrepreneurship.svg',
    color: '#9B59B6',
    pointsToEarn: 100,
    earnCriteria: [
      'Spot opportunities',
      'Take business risks',
      'Create value',
      'Build sustainable ventures',
    ],
  },
  28: {
    id: 'influence',
    name: 'Influence',
    stage: 28,
    beacon: 'Venture Acceleration',
    description: 'Persuade and motivate others effectively',
    longDescription: 'The capacity to have an effect on the character, development, or behavior of others through example, persuasion, or authority.',
    icon: 'influence.svg',
    color: '#9B59B6',
    pointsToEarn: 100,
    earnCriteria: [
      'Persuade others effectively',
      'Build strong networks',
      'Inspire action',
      'Lead through influence',
    ],
  },
  29: {
    id: 'risk-management',
    name: 'Risk Management',
    stage: 29,
    beacon: 'Venture Acceleration',
    description: 'Balance opportunity with prudent caution',
    longDescription: 'The identification, evaluation, and prioritization of risks followed by coordinated efforts to minimize their impact.',
    icon: 'risk-management.svg',
    color: '#9B59B6',
    pointsToEarn: 100,
    earnCriteria: [
      'Assess risks accurately',
      'Mitigate potential problems',
      'Make informed decisions',
      'Balance risk and reward',
    ],
  },
  30: {
    id: 'mentorship',
    name: 'Mentorship',
    stage: 30,
    beacon: 'Venture Acceleration',
    description: 'Guide and develop the next generation',
    longDescription: 'The act of guiding and supporting others in their personal and professional development.',
    icon: 'mentorship.svg',
    color: '#9B59B6',
    pointsToEarn: 100,
    earnCriteria: [
      'Mentor others regularly',
      'Share knowledge generously',
      'Develop others\' potential',
      'Leave a positive legacy',
    ],
  },

  // Venture Capitalization (Purple Beacon) - Stages 31-35
  31: {
    id: 'impact',
    name: 'Impact',
    stage: 31,
    beacon: 'Venture Capitalization',
    description: 'Create lasting, meaningful change',
    longDescription: 'The ability to create significant, lasting change that improves lives and transforms communities.',
    icon: 'impact.svg',
    color: '#8E44AD',
    pointsToEarn: 100,
    earnCriteria: [
      'Measure your impact',
      'Focus on outcomes',
      'Create lasting change',
      'Touch many lives',
    ],
  },
  32: {
    id: 'scale',
    name: 'Scale',
    stage: 32,
    beacon: 'Venture Capitalization',
    description: 'Grow solutions exponentially',
    longDescription: 'The ability to expand operations, reach, and impact significantly while maintaining quality and effectiveness.',
    icon: 'scale.svg',
    color: '#8E44AD',
    pointsToEarn: 100,
    earnCriteria: [
      'Multiply your impact',
      'Build scalable systems',
      'Expand reach efficiently',
      'Grow sustainably',
    ],
  },
  33: {
    id: 'sustainability',
    name: 'Sustainability',
    stage: 33,
    beacon: 'Venture Capitalization',
    description: 'Build solutions that last for generations',
    longDescription: 'The ability to create and maintain solutions that can continue indefinitely without depleting resources or causing harm.',
    icon: 'sustainability.svg',
    color: '#8E44AD',
    pointsToEarn: 100,
    earnCriteria: [
      'Think long-term',
      'Build sustainable models',
      'Preserve resources',
      'Ensure continuity',
    ],
  },
  34: {
    id: 'legacy',
    name: 'Legacy',
    stage: 34,
    beacon: 'Venture Capitalization',
    description: 'Leave something meaningful for future generations',
    longDescription: 'Something transmitted by or received from an ancestor or predecessor; creating lasting value that outlives you.',
    icon: 'legacy.svg',
    color: '#8E44AD',
    pointsToEarn: 100,
    earnCriteria: [
      'Think generationally',
      'Build lasting institutions',
      'Transfer knowledge',
      'Inspire future leaders',
    ],
  },
  35: {
    id: 'mastery',
    name: 'Mastery',
    stage: 35,
    beacon: 'Venture Capitalization',
    description: 'Achieve expert-level proficiency',
    longDescription: 'Comprehensive knowledge or skill in a subject or activity; the pinnacle of capability and understanding.',
    icon: 'mastery.svg',
    color: '#8E44AD',
    pointsToEarn: 100,
    earnCriteria: [
      'Demonstrate expertise',
      'Teach others effectively',
      'Push boundaries',
      'Achieve excellence consistently',
    ],
  },
};

/**
 * Get character badge by ID
 * @param {string} badgeId - Badge ID
 * @returns {Object|null} Badge configuration
 */
export const getCharacterBadge = (badgeId) => {
  return Object.values(CharacterBadges).find(badge => badge.id === badgeId) || null;
};

/**
 * Get character badge by stage
 * @param {number} stageNumber - Stage number
 * @returns {Object|null} Badge configuration
 */
export const getCharacterBadgeByStage = (stageNumber) => {
  return CharacterBadges[stageNumber] || null;
};

/**
 * Get all character badges as array
 * @returns {Array} Array of all badges
 */
export const getAllCharacterBadges = () => {
  return Object.values(CharacterBadges).sort((a, b) => a.stage - b.stage);
};

/**
 * Get character badges by beacon
 * @param {string} beaconPhase - Beacon phase name
 * @returns {Array} Array of badges
 */
export const getCharacterBadgesByBeacon = (beaconPhase) => {
  return Object.values(CharacterBadges).filter(badge => badge.beacon === beaconPhase);
};

/**
 * Character badge categories
 */
export const CharacterCategories = {
  MORAL: 'moral',           // Integrity, Justice, Courage
  INTERPERSONAL: 'interpersonal', // Compassion, Collaboration, Service
  COGNITIVE: 'cognitive',   // Wisdom, Strategic Thinking, Creativity
  PERFORMANCE: 'performance', // Excellence, Diligence, Perseverance
  LEADERSHIP: 'leadership', // Leadership, Influence, Mentorship
};

/**
 * Total points to earn all badges
 */
export const TOTAL_CHARACTER_POINTS = Object.keys(CharacterBadges).length * 100;

export default {
  CharacterBadges,
  CharacterCategories,
  TOTAL_CHARACTER_POINTS,
  getCharacterBadge,
  getCharacterBadgeByStage,
  getAllCharacterBadges,
  getCharacterBadgesByBeacon,
};