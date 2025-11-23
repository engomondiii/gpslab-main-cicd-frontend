/* ============================================
   GPS LAB - Tiers Constants
   Subscription tier configuration
   ============================================ */

/**
 * Subscription tiers
 */
export const SubscriptionTiers = {
  FREE: {
    id: 'free',
    name: 'Free Tier',
    slug: 'free',
    price: 0,
    currency: 'USD',
    billingPeriod: null,
    description: 'Get started with GPS Lab',
    color: '#8B949E',
    icon: 'free-tier.svg',
    features: [
      'Access to GPS 101 (Stages 1-5)',
      '5 missions per stage',
      'Basic Navigator AI assistance',
      'Community access',
      'Baraka economy participation',
      'Character badges (Red Beacon)',
      'Basic portfolio',
    ],
    limitations: [
      'Limited to GPS 101 stages',
      'Basic Navigator features only',
      'No party formations',
      'No mentor access',
      'Limited storage (100MB)',
    ],
    maxStages: 5,
    maxPartySize: 0,
    storageLimit: 100 * 1024 * 1024, // 100MB
    navigatorAccess: 'basic',
    mentorAccess: false,
    priority: 1,
  },

  CONTENDER: {
    id: 'contender',
    name: 'Contender',
    slug: 'contender',
    price: 29,
    currency: 'USD',
    billingPeriod: 'month',
    description: 'For serious problem solvers',
    color: '#FF8C42',
    icon: 'contender.svg',
    features: [
      'Everything in Free',
      'Access to GPS Prep & Simulation (Stages 1-15)',
      'Form and join parties',
      'Advanced Navigator AI',
      'Study mode & R2R rights',
      'Priority checkpoint reviews',
      'Extended portfolio',
      'Exclusive Contender community',
    ],
    limitations: [
      'Limited to stages 1-15',
      'Party size limited to 5',
      'Storage limited to 1GB',
    ],
    maxStages: 15,
    maxPartySize: 5,
    storageLimit: 1 * 1024 * 1024 * 1024, // 1GB
    navigatorAccess: 'advanced',
    mentorAccess: false,
    priority: 2,
    popular: false,
  },

  PATHFINDER: {
    id: 'pathfinder',
    name: 'Pathfinder',
    slug: 'pathfinder',
    price: 99,
    currency: 'USD',
    billingPeriod: 'month',
    description: 'For aspiring entrepreneurs',
    color: '#00D4FF',
    icon: 'pathfinder.svg',
    features: [
      'Everything in Contender',
      'Access to GPS Capstones (Stages 1-25)',
      'Unlimited party formations',
      'Pro Bono Ally (mentor) access',
      'Premium Navigator AI',
      'pR2R (Provisional Retry Rights)',
      'Adventure missions',
      'Professional portfolio',
      'GPS Lab certification upon completion',
    ],
    limitations: [
      'Limited to stages 1-25',
      'Storage limited to 5GB',
    ],
    maxStages: 25,
    maxPartySize: 10,
    storageLimit: 5 * 1024 * 1024 * 1024, // 5GB
    navigatorAccess: 'premium',
    mentorAccess: true,
    priority: 3,
    popular: true,
  },

  NAVIGATORS_CIRCLE: {
    id: 'navigators-circle',
    name: "Navigator's Circle",
    slug: 'navigators-circle',
    price: 299,
    currency: 'USD',
    billingPeriod: 'month',
    description: 'For committed change makers',
    color: '#8E44AD',
    icon: 'navigators-circle.svg',
    features: [
      'Everything in Pathfinder',
      'Access to ALL stages (1-35)',
      'Venture Acceleration & Capitalization',
      'Elite Navigator AI (fastest, most advanced)',
      'Dedicated mentor',
      'Investment readiness support',
      'Fundraising connections',
      'Exclusive events and retreats',
      'Lifetime access to GPS Lab network',
      'Priority support',
    ],
    limitations: [],
    maxStages: 35,
    maxPartySize: 20,
    storageLimit: 20 * 1024 * 1024 * 1024, // 20GB
    navigatorAccess: 'elite',
    mentorAccess: true,
    dedicatedMentor: true,
    priority: 4,
    popular: false,
  },
};

/**
 * Tier order (free to premium)
 */
export const TierOrder = ['free', 'contender', 'pathfinder', 'navigators-circle'];

/**
 * Get tier by ID
 * @param {string} tierId - Tier ID
 * @returns {Object|null} Tier configuration
 */
export const getTier = (tierId) => {
  return SubscriptionTiers[tierId.toUpperCase()] || null;
};

/**
 * Get tier by slug
 * @param {string} slug - Tier slug
 * @returns {Object|null} Tier configuration
 */
export const getTierBySlug = (slug) => {
  return Object.values(SubscriptionTiers).find(tier => tier.slug === slug) || null;
};

/**
 * Get all tiers as array (ordered)
 * @returns {Array} Array of tiers
 */
export const getAllTiers = () => {
  return TierOrder.map(slug => getTierBySlug(slug));
};

/**
 * Check if tier has access to stage
 * @param {string} tierId - Tier ID
 * @param {number} stageNumber - Stage number
 * @returns {boolean}
 */
export const tierHasStageAccess = (tierId, stageNumber) => {
  const tier = getTier(tierId);
  if (!tier) return false;
  return stageNumber <= tier.maxStages;
};

/**
 * Check if tier has mentor access
 * @param {string} tierId - Tier ID
 * @returns {boolean}
 */
export const tierHasMentorAccess = (tierId) => {
  const tier = getTier(tierId);
  return tier ? tier.mentorAccess : false;
};

/**
 * Get tier upgrade recommendations
 * @param {string} currentTierId - Current tier ID
 * @param {number} desiredStage - Desired stage number
 * @returns {Object|null} Recommended tier
 */
export const getRecommendedTierUpgrade = (currentTierId, desiredStage) => {
  const currentTier = getTier(currentTierId);
  if (!currentTier) return null;

  if (desiredStage <= currentTier.maxStages) return null;

  for (const tierId of TierOrder) {
    const tier = getTier(tierId);
    if (tier && tier.maxStages >= desiredStage && tier.priority > currentTier.priority) {
      return tier;
    }
  }

  return null;
};

/**
 * Calculate annual savings
 * @param {number} monthlyPrice - Monthly price
 * @returns {number} Annual savings
 */
export const calculateAnnualSavings = (monthlyPrice) => {
  const annualPrice = monthlyPrice * 12;
  const discountedAnnual = annualPrice * 0.8; // 20% discount
  return annualPrice - discountedAnnual;
};

/**
 * Tier comparison features
 */
export const TierComparisonFeatures = [
  {
    category: 'Access',
    features: [
      { name: 'Stage Access', free: '1-5', contender: '1-15', pathfinder: '1-25', navigators: '1-35' },
      { name: 'Missions per Stage', free: '5', contender: '5', pathfinder: '5', navigators: '5' },
      { name: 'Party Formation', free: false, contender: true, pathfinder: true, navigators: true },
      { name: 'Max Party Size', free: '0', contender: '5', pathfinder: '10', navigators: '20' },
    ],
  },
  {
    category: 'Support',
    features: [
      { name: 'Navigator AI', free: 'Basic', contender: 'Advanced', pathfinder: 'Premium', navigators: 'Elite' },
      { name: 'Mentor Access', free: false, contender: false, pathfinder: true, navigators: true },
      { name: 'Dedicated Mentor', free: false, contender: false, pathfinder: false, navigators: true },
      { name: 'Priority Support', free: false, contender: false, pathfinder: false, navigators: true },
    ],
  },
  {
    category: 'Features',
    features: [
      { name: 'Study Mode & R2R', free: false, contender: true, pathfinder: true, navigators: true },
      { name: 'pR2R Rights', free: false, contender: false, pathfinder: true, navigators: true },
      { name: 'Adventure Missions', free: false, contender: false, pathfinder: true, navigators: true },
      { name: 'Investment Support', free: false, contender: false, pathfinder: false, navigators: true },
    ],
  },
  {
    category: 'Storage & Portfolio',
    features: [
      { name: 'Storage', free: '100MB', contender: '1GB', pathfinder: '5GB', navigators: '20GB' },
      { name: 'Portfolio Type', free: 'Basic', contender: 'Extended', pathfinder: 'Professional', navigators: 'Professional' },
      { name: 'Certification', free: false, contender: false, pathfinder: true, navigators: true },
    ],
  },
];

export default {
  SubscriptionTiers,
  TierOrder,
  TierComparisonFeatures,
  getTier,
  getTierBySlug,
  getAllTiers,
  tierHasStageAccess,
  tierHasMentorAccess,
  getRecommendedTierUpgrade,
  calculateAnnualSavings,
};