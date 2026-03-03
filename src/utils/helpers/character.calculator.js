/**
 * Character Calculator
 * 
 * Calculate character development and LQ trait progression.
 */

import { LQ_TRAITS, GPS_101_CHARACTER_TRAITS } from '../constants/characters.constants';

/**
 * Calculate character badge progress
 */
export const calculateCharacterBadgeProgress = (traitId, userData) => {
  const trait = LQ_TRAITS.find(t => t.id === traitId);
  if (!trait) return { progress: 0, unlocked: false };

  const relatedMissions = userData.completedMissions?.filter(
    mission => mission.characterTraits?.includes(traitId)
  ) || [];

  const progress = Math.min(100, relatedMissions.length * 20);
  const unlocked = progress >= 100;

  return {
    trait: trait.name,
    progress,
    unlocked,
    missionsCompleted: relatedMissions.length,
    missionsRequired: 5
  };
};

/**
 * Get GPS 101 character development
 */
export const getGPS101CharacterDevelopment = (completedStages) => {
  const developedTraits = [];

  completedStages.forEach(stageNumber => {
    const stageTraits = GPS_101_CHARACTER_TRAITS[`STAGE_${stageNumber}`];
    if (stageTraits) {
      stageTraits.forEach(({ trait, emphasis }) => {
        const existing = developedTraits.find(t => t.trait === trait);
        if (existing) {
          existing.stages.push(stageNumber);
          if (emphasis === 'high') existing.highEmphasis++;
        } else {
          developedTraits.push({
            trait,
            stages: [stageNumber],
            highEmphasis: emphasis === 'high' ? 1 : 0
          });
        }
      });
    }
  });

  return developedTraits.map(dt => ({
    ...dt,
    traitData: LQ_TRAITS.find(t => t.id === dt.trait),
    development: dt.highEmphasis >= 2 ? 'strong' : 'developing'
  }));
};

/**
 * Calculate overall LQ score
 */
export const calculateLQScore = (userData) => {
  const earnedCharacterBadges = userData.characterBadges || [];
  const maxBadges = LQ_TRAITS.length;

  const score = (earnedCharacterBadges.length / maxBadges) * 100;

  return {
    score: Math.round(score),
    earnedBadges: earnedCharacterBadges.length,
    totalBadges: maxBadges,
    level: getLQLevel(score)
  };
};

/**
 * Get LQ level based on score
 */
export const getLQLevel = (score) => {
  if (score >= 90) return 'Master';
  if (score >= 75) return 'Advanced';
  if (score >= 50) return 'Intermediate';
  if (score >= 25) return 'Developing';
  return 'Beginner';
};

/**
 * Get recommended traits to develop
 */
export const getRecommendedTraits = (userData, limit = 5) => {
  const earnedTraits = userData.characterBadges || [];
  const availableTraits = LQ_TRAITS.filter(
    trait => !earnedTraits.includes(trait.id)
  );

  // Prioritize traits based on user's GPS 101 progress
  if (userData.gps101CurrentStage) {
    const stageTraits = GPS_101_CHARACTER_TRAITS[`STAGE_${userData.gps101CurrentStage}`];
    if (stageTraits) {
      const recommended = stageTraits
        .map(({ trait }) => LQ_TRAITS.find(t => t.id === trait))
        .filter(t => t && !earnedTraits.includes(t.id));
      
      return recommended.slice(0, limit);
    }
  }

  return availableTraits.slice(0, limit);
};

/**
 * Export all calculator functions
 */
export default {
  calculateCharacterBadgeProgress,
  getGPS101CharacterDevelopment,
  calculateLQScore,
  getLQLevel,
  getRecommendedTraits
};