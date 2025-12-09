/**
 * GPS Lab Platform - MissionRewards Component
 * 
 * Displays mission rewards summary and breakdown.
 * 
 * @module components/mission/MissionDetail/MissionRewards
 */

import React, { useMemo } from 'react';
import './MissionRewards.css';

/**
 * Reward type configurations
 */
const REWARD_TYPES = {
  xp: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    label: 'XP',
    color: 'accent'
  },
  baraka: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    label: 'Baraka',
    color: 'baraka',
    symbol: 'ƀ'
  },
  badge: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/>
      </svg>
    ),
    label: 'Badge',
    color: 'secondary'
  },
  achievement: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/>
      </svg>
    ),
    label: 'Achievement',
    color: 'warning'
  },
  unlock: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z"/>
      </svg>
    ),
    label: 'Unlocks',
    color: 'primary'
  },
  bonus: {
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
      </svg>
    ),
    label: 'Bonus',
    color: 'warning'
  }
};

/**
 * MissionRewards Component
 */
const MissionRewards = ({
  xpReward = 0,
  barakaReward = 0,
  bonusRewards = [],
  badges = [],
  achievements = [],
  unlocks = [],
  showBreakdown = true,
  variant = 'default',
  className = '',
  ...props
}) => {
  
  /**
   * Total rewards calculation
   */
  const totals = useMemo(() => {
    let totalXP = xpReward;
    let totalBaraka = barakaReward;
    
    bonusRewards.forEach(reward => {
      if (reward.type === 'xp') totalXP += reward.amount;
      if (reward.type === 'baraka') totalBaraka += reward.amount;
    });
    
    return { xp: totalXP, baraka: totalBaraka };
  }, [xpReward, barakaReward, bonusRewards]);
  
  /**
   * Has any rewards
   */
  const hasRewards = totals.xp > 0 || totals.baraka > 0 || 
    badges.length > 0 || achievements.length > 0 || unlocks.length > 0;
  
  if (!hasRewards) return null;
  
  const classNames = [
    'mission-rewards',
    `mission-rewards--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="mission-rewards__header">
        <h3 className="mission-rewards__title">Rewards</h3>
      </div>
      
      {/* Main Rewards */}
      <div className="mission-rewards__main">
        {/* XP */}
        {totals.xp > 0 && (
          <div className="mission-rewards__card mission-rewards__card--accent">
            <div className="mission-rewards__card-icon">
              {REWARD_TYPES.xp.icon}
            </div>
            <div className="mission-rewards__card-content">
              <span className="mission-rewards__card-value">+{totals.xp.toLocaleString()}</span>
              <span className="mission-rewards__card-label">XP</span>
            </div>
          </div>
        )}
        
        {/* Baraka */}
        {totals.baraka > 0 && (
          <div className="mission-rewards__card mission-rewards__card--baraka">
            <div className="mission-rewards__card-icon">
              {REWARD_TYPES.baraka.icon}
            </div>
            <div className="mission-rewards__card-content">
              <span className="mission-rewards__card-value">+{totals.baraka.toLocaleString()}</span>
              <span className="mission-rewards__card-label">Baraka (ƀ)</span>
            </div>
          </div>
        )}
      </div>
      
      {/* Badges */}
      {badges.length > 0 && (
        <div className="mission-rewards__section">
          <h4 className="mission-rewards__section-title">
            {REWARD_TYPES.badge.icon}
            Badges
          </h4>
          <div className="mission-rewards__badges">
            {badges.map((badge, index) => (
              <div key={badge.id || index} className="mission-rewards__badge">
                {badge.icon ? (
                  <img src={badge.icon} alt={badge.name} className="mission-rewards__badge-icon" />
                ) : (
                  <div className="mission-rewards__badge-placeholder">
                    {REWARD_TYPES.badge.icon}
                  </div>
                )}
                <span className="mission-rewards__badge-name">{badge.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Achievements */}
      {achievements.length > 0 && (
        <div className="mission-rewards__section">
          <h4 className="mission-rewards__section-title">
            {REWARD_TYPES.achievement.icon}
            Achievements
          </h4>
          <div className="mission-rewards__achievements">
            {achievements.map((achievement, index) => (
              <div key={achievement.id || index} className="mission-rewards__achievement">
                <div className="mission-rewards__achievement-icon">
                  {REWARD_TYPES.achievement.icon}
                </div>
                <div className="mission-rewards__achievement-content">
                  <span className="mission-rewards__achievement-name">{achievement.name}</span>
                  {achievement.description && (
                    <span className="mission-rewards__achievement-desc">{achievement.description}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Unlocks */}
      {unlocks.length > 0 && (
        <div className="mission-rewards__section">
          <h4 className="mission-rewards__section-title">
            {REWARD_TYPES.unlock.icon}
            Unlocks
          </h4>
          <ul className="mission-rewards__unlocks">
            {unlocks.map((unlock, index) => (
              <li key={index} className="mission-rewards__unlock">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/>
                </svg>
                <span>{unlock.name || unlock}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {/* Bonus Breakdown */}
      {showBreakdown && bonusRewards.length > 0 && (
        <div className="mission-rewards__breakdown">
          <h4 className="mission-rewards__breakdown-title">Bonus Rewards</h4>
          <div className="mission-rewards__breakdown-list">
            {bonusRewards.map((bonus, index) => (
              <div key={index} className="mission-rewards__breakdown-item">
                <span className="mission-rewards__breakdown-name">{bonus.name}</span>
                <span className={`mission-rewards__breakdown-value mission-rewards__breakdown-value--${bonus.type}`}>
                  +{bonus.amount} {bonus.type === 'baraka' ? 'ƀ' : 'XP'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export { REWARD_TYPES };
export default MissionRewards;