/**
 * Character Constants
 * 
 * Character badges and Love Quotient (LQ) traits.
 */

import { GPS_101_CONFIG } from '../../config/gps101.config';

// ==================== LQ CHARACTER TRAITS ====================

export const LQ_TRAITS = [
  {
    id: 'courage',
    name: 'Courage',
    description: 'The strength to face fear and take action',
    icon: '🦁',
    category: 'Strength'
  },
  {
    id: 'humility',
    name: 'Humility',
    description: 'Modest view of one\'s importance',
    icon: '🙏',
    category: 'Virtue'
  },
  {
    id: 'integrity',
    name: 'Integrity',
    description: 'Honesty and strong moral principles',
    icon: '⚖️',
    category: 'Virtue'
  },
  {
    id: 'excellence',
    name: 'Excellence',
    description: 'Pursuit of quality in all endeavors',
    icon: '⭐',
    category: 'Achievement'
  },
  {
    id: 'compassion',
    name: 'Compassion',
    description: 'Sympathetic concern for others',
    icon: '💝',
    category: 'Empathy'
  },
  {
    id: 'wisdom',
    name: 'Wisdom',
    description: 'Sound judgment and insight',
    icon: '🦉',
    category: 'Knowledge'
  },
  {
    id: 'stewardship',
    name: 'Stewardship',
    description: 'Responsible management of resources',
    icon: '🌱',
    category: 'Responsibility'
  },
  {
    id: 'resilience',
    name: 'Resilience',
    description: 'Ability to recover from difficulties',
    icon: '💪',
    category: 'Strength'
  },
  {
    id: 'justice',
    name: 'Justice',
    description: 'Fairness and moral rightness',
    icon: '⚖️',
    category: 'Virtue'
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Appreciation and thankfulness',
    icon: '🙏',
    category: 'Virtue'
  },
  {
    id: 'patience',
    name: 'Patience',
    description: 'Ability to wait calmly',
    icon: '⏳',
    category: 'Temperance'
  },
  {
    id: 'generosity',
    name: 'Generosity',
    description: 'Willingness to give and share',
    icon: '🎁',
    category: 'Virtue'
  },
  {
    id: 'forgiveness',
    name: 'Forgiveness',
    description: 'Letting go of resentment',
    icon: '🕊️',
    category: 'Virtue'
  },
  {
    id: 'faithfulness',
    name: 'Faithfulness',
    description: 'Loyalty and commitment',
    icon: '🤝',
    category: 'Virtue'
  },
  {
    id: 'hope',
    name: 'Hope',
    description: 'Optimism and trust in the future',
    icon: '🌟',
    category: 'Faith'
  },
  {
    id: 'love',
    name: 'Love',
    description: 'Deep affection and care',
    icon: '❤️',
    category: 'Faith'
  },
  {
    id: 'peace',
    name: 'Peace',
    description: 'Inner calm and harmony',
    icon: '☮️',
    category: 'Temperance'
  },
  {
    id: 'joy',
    name: 'Joy',
    description: 'Deep sense of happiness',
    icon: '😊',
    category: 'Emotion'
  },
  {
    id: 'kindness',
    name: 'Kindness',
    description: 'Gentle and caring behavior',
    icon: '💕',
    category: 'Empathy'
  },
  {
    id: 'goodness',
    name: 'Goodness',
    description: 'Moral excellence',
    icon: '✨',
    category: 'Virtue'
  },
  {
    id: 'gentleness',
    name: 'Gentleness',
    description: 'Mild and tender manner',
    icon: '🌸',
    category: 'Temperance'
  },
  {
    id: 'self-control',
    name: 'Self-Control',
    description: 'Restraint over impulses',
    icon: '🎯',
    category: 'Temperance'
  },
  {
    id: 'perseverance',
    name: 'Perseverance',
    description: 'Persistence in adversity',
    icon: '🏔️',
    category: 'Strength'
  },
  {
    id: 'diligence',
    name: 'Diligence',
    description: 'Careful and persistent work',
    icon: '📊',
    category: 'Achievement'
  },
  {
    id: 'authenticity',
    name: 'Authenticity',
    description: 'Being true to oneself',
    icon: '🎭',
    category: 'Identity'
  },
  {
    id: 'empathy',
    name: 'Empathy',
    description: 'Understanding others\' feelings',
    icon: '🤗',
    category: 'Empathy'
  },
  {
    id: 'accountability',
    name: 'Accountability',
    description: 'Taking responsibility',
    icon: '📋',
    category: 'Responsibility'
  },
  {
    id: 'servant-leadership',
    name: 'Servant Leadership',
    description: 'Leading by serving others',
    icon: '👥',
    category: 'Leadership'
  },
  {
    id: 'vision',
    name: 'Vision',
    description: 'Clear sense of future direction',
    icon: '🔭',
    category: 'Leadership'
  },
  {
    id: 'creativity',
    name: 'Creativity',
    description: 'Innovative thinking',
    icon: '🎨',
    category: 'Achievement'
  },
  {
    id: 'collaboration',
    name: 'Collaboration',
    description: 'Working together effectively',
    icon: '🤝',
    category: 'Teamwork'
  },
  {
    id: 'discernment',
    name: 'Discernment',
    description: 'Good judgment and insight',
    icon: '👁️',
    category: 'Knowledge'
  },
  {
    id: 'boldness',
    name: 'Boldness',
    description: 'Confident courage',
    icon: '🦅',
    category: 'Strength'
  },
  {
    id: 'trust',
    name: 'Trust',
    description: 'Firm belief in reliability',
    icon: '🔒',
    category: 'Faith'
  },
  {
    id: 'sacrifice',
    name: 'Sacrifice',
    description: 'Giving up for greater good',
    icon: '🕯️',
    category: 'Virtue'
  }
];

// ==================== GPS 101 CHARACTER PROGRESSION ====================

export const GPS_101_CHARACTER_TRAITS = {
  STAGE_1: [
    { trait: 'authenticity', emphasis: 'high' },
    { trait: 'courage', emphasis: 'medium' },
    { trait: 'humility', emphasis: 'medium' }
  ],
  STAGE_2: [
    { trait: 'empathy', emphasis: 'high' },
    { trait: 'wisdom', emphasis: 'medium' },
    { trait: 'discernment', emphasis: 'medium' }
  ],
  STAGE_3: [
    { trait: 'compassion', emphasis: 'high' },
    { trait: 'justice', emphasis: 'high' },
    { trait: 'empathy', emphasis: 'medium' }
  ],
  STAGE_4: [
    { trait: 'vision', emphasis: 'high' },
    { trait: 'boldness', emphasis: 'medium' },
    { trait: 'faithfulness', emphasis: 'medium' }
  ],
  STAGE_5: [
    { trait: 'creativity', emphasis: 'high' },
    { trait: 'diligence', emphasis: 'medium' },
    { trait: 'perseverance', emphasis: 'medium' }
  ]
};

// ==================== CHARACTER BADGE UNLOCK CRITERIA ====================

export const CHARACTER_BADGE_UNLOCK = {
  courage: {
    criteria: 'Complete challenging missions despite fear',
    missions: ['face-difficult-truth', 'take-bold-action']
  },
  empathy: {
    criteria: 'Demonstrate deep understanding of problem owners',
    missions: ['problem-owner-interview', 'empathy-mapping']
  },
  vision: {
    criteria: 'Articulate clear future direction',
    missions: ['vision-statement', 'future-scenario']
  },
  // Add criteria for other traits as needed
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get trait by ID
 */
export const getTraitById = (traitId) => {
  return LQ_TRAITS.find(trait => trait.id === traitId);
};

/**
 * Get traits by category
 */
export const getTraitsByCategory = (category) => {
  return LQ_TRAITS.filter(trait => trait.category === category);
};

/**
 * Get GPS 101 stage traits
 */
export const getGPS101StageTraits = (stageNumber) => {
  return GPS_101_CHARACTER_TRAITS[`STAGE_${stageNumber}`] || [];
};

/**
 * Get all GPS 101 emphasized traits
 */
export const getAllGPS101Traits = () => {
  const allTraits = new Set();
  
  Object.values(GPS_101_CHARACTER_TRAITS).forEach(stageTraits => {
    stageTraits.forEach(({ trait }) => {
      allTraits.add(trait);
    });
  });
  
  return Array.from(allTraits).map(traitId => getTraitById(traitId));
};

// Export default
export default {
  LQ_TRAITS,
  GPS_101_CHARACTER_TRAITS,
  CHARACTER_BADGE_UNLOCK,
  getTraitById,
  getTraitsByCategory,
  getGPS101StageTraits,
  getAllGPS101Traits
};