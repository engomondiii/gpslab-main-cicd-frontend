/**
 * GPS Lab Platform - ProfileStats Component
 * 
 * Displays comprehensive user statistics including
 * stage progress, achievements, currencies, and activity.
 * 
 * @module components/profile/UserProfile/ProfileStats
 */

import React from 'react';
import './ProfileStats.css';

/**
 * Format large numbers with K/M suffix
 */
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toLocaleString();
};

/**
 * Default stats configuration
 */
const DEFAULT_STATS = {
  // Progress Stats
  currentStage: 1,
  totalStages: 35,
  completedBites: 0,
  totalBites: 245,
  completedCheckpoints: 0,
  totalCheckpoints: 35,
  
  // Achievement Stats
  badgesEarned: 0,
  totalBadges: 50,
  achievementsUnlocked: 0,
  totalAchievements: 100,
  
  // Currency Stats
  barakaBalance: 0,
  psbBalance: 0,
  
  // Social Stats
  praiseGiven: 0,
  praiseReceived: 0,
  partiesJoined: 0,
  projectsCompleted: 0,
  
  // Activity Stats
  daysActive: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalXP: 0,
  rank: null
};

/**
 * ProfileStats Component
 */
const ProfileStats = ({
  stats = {},
  showProgress = true,
  showAchievements = true,
  showCurrency = true,
  showSocial = true,
  showActivity = true,
  variant = 'default', // default, compact, expanded
  className = '',
  ...props
}) => {
  // Merge with defaults
  const mergedStats = { ...DEFAULT_STATS, ...stats };
  
  const {
    currentStage,
    totalStages,
    completedBites,
    totalBites,
    completedCheckpoints,
    totalCheckpoints,
    badgesEarned,
    totalBadges,
    achievementsUnlocked,
    totalAchievements,
    barakaBalance,
    psbBalance,
    praiseGiven,
    praiseReceived,
    partiesJoined,
    projectsCompleted,
    daysActive,
    currentStreak,
    longestStreak,
    totalXP,
    rank
  } = mergedStats;
  
  // Calculate percentages
  const stageProgress = (currentStage / totalStages) * 100;
  const biteProgress = (completedBites / totalBites) * 100;
  const badgeProgress = (badgesEarned / totalBadges) * 100;
  
  const classNames = [
    'profile-stats',
    `profile-stats--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={classNames} {...props}>
        <div className="profile-stats__compact-grid">
          <div className="profile-stats__compact-item">
            <span className="profile-stats__compact-value">{currentStage}</span>
            <span className="profile-stats__compact-label">Stage</span>
          </div>
          <div className="profile-stats__compact-item">
            <span className="profile-stats__compact-value">{completedBites}</span>
            <span className="profile-stats__compact-label">Bites</span>
          </div>
          <div className="profile-stats__compact-item">
            <span className="profile-stats__compact-value">{badgesEarned}</span>
            <span className="profile-stats__compact-label">Badges</span>
          </div>
          <div className="profile-stats__compact-item">
            <span className="profile-stats__compact-value">{formatNumber(totalXP)}</span>
            <span className="profile-stats__compact-label">XP</span>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Progress Section */}
      {showProgress && (
        <section className="profile-stats__section">
          <h3 className="profile-stats__section-title">
            <span className="profile-stats__section-icon">📈</span>
            Progress
          </h3>
          <div className="profile-stats__grid">
            <div className="profile-stats__item profile-stats__item--large">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🎯</span>
                <span className="profile-stats__item-label">Current Stage</span>
              </div>
              <div className="profile-stats__item-value">
                Stage {currentStage}
                <span className="profile-stats__item-total">/ {totalStages}</span>
              </div>
              <div className="profile-stats__progress-bar">
                <div 
                  className="profile-stats__progress-fill"
                  style={{ width: `${stageProgress}%` }}
                />
              </div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🍎</span>
                <span className="profile-stats__item-label">Bites Completed</span>
              </div>
              <div className="profile-stats__item-value">
                {completedBites}
                <span className="profile-stats__item-total">/ {totalBites}</span>
              </div>
              <div className="profile-stats__progress-bar">
                <div 
                  className="profile-stats__progress-fill profile-stats__progress-fill--success"
                  style={{ width: `${biteProgress}%` }}
                />
              </div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🏁</span>
                <span className="profile-stats__item-label">Checkpoints</span>
              </div>
              <div className="profile-stats__item-value">
                {completedCheckpoints}
                <span className="profile-stats__item-total">/ {totalCheckpoints}</span>
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Achievements Section */}
      {showAchievements && (
        <section className="profile-stats__section">
          <h3 className="profile-stats__section-title">
            <span className="profile-stats__section-icon">🏆</span>
            Achievements
          </h3>
          <div className="profile-stats__grid">
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🎖️</span>
                <span className="profile-stats__item-label">Badges Earned</span>
              </div>
              <div className="profile-stats__item-value">
                {badgesEarned}
                <span className="profile-stats__item-total">/ {totalBadges}</span>
              </div>
              <div className="profile-stats__progress-bar">
                <div 
                  className="profile-stats__progress-fill profile-stats__progress-fill--warning"
                  style={{ width: `${badgeProgress}%` }}
                />
              </div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">⭐</span>
                <span className="profile-stats__item-label">Achievements</span>
              </div>
              <div className="profile-stats__item-value">
                {achievementsUnlocked}
                <span className="profile-stats__item-total">/ {totalAchievements}</span>
              </div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">✨</span>
                <span className="profile-stats__item-label">Total XP</span>
              </div>
              <div className="profile-stats__item-value profile-stats__item-value--highlight">
                {formatNumber(totalXP)}
              </div>
            </div>
            
            {rank && (
              <div className="profile-stats__item profile-stats__item--rank">
                <div className="profile-stats__item-header">
                  <span className="profile-stats__item-icon">👑</span>
                  <span className="profile-stats__item-label">Global Rank</span>
                </div>
                <div className="profile-stats__item-value profile-stats__item-value--rank">
                  #{rank}
                </div>
              </div>
            )}
          </div>
        </section>
      )}
      
      {/* Currency Section */}
      {showCurrency && (
        <section className="profile-stats__section">
          <h3 className="profile-stats__section-title">
            <span className="profile-stats__section-icon">💰</span>
            Currency
          </h3>
          <div className="profile-stats__grid profile-stats__grid--two-col">
            <div className="profile-stats__item profile-stats__item--currency">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🪙</span>
                <span className="profile-stats__item-label">Baraka</span>
              </div>
              <div className="profile-stats__item-value profile-stats__item-value--baraka">
                {formatNumber(barakaBalance)}
              </div>
            </div>
            
            <div className="profile-stats__item profile-stats__item--currency">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">💎</span>
                <span className="profile-stats__item-label">PSB</span>
              </div>
              <div className="profile-stats__item-value profile-stats__item-value--psb">
                {formatNumber(psbBalance)}
              </div>
            </div>
          </div>
        </section>
      )}
      
      {/* Social Section */}
      {showSocial && (
        <section className="profile-stats__section">
          <h3 className="profile-stats__section-title">
            <span className="profile-stats__section-icon">👥</span>
            Social
          </h3>
          <div className="profile-stats__grid">
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">👏</span>
                <span className="profile-stats__item-label">Praise Given</span>
              </div>
              <div className="profile-stats__item-value">{praiseGiven}</div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🙌</span>
                <span className="profile-stats__item-label">Praise Received</span>
              </div>
              <div className="profile-stats__item-value">{praiseReceived}</div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🎉</span>
                <span className="profile-stats__item-label">Parties Joined</span>
              </div>
              <div className="profile-stats__item-value">{partiesJoined}</div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">📁</span>
                <span className="profile-stats__item-label">Projects</span>
              </div>
              <div className="profile-stats__item-value">{projectsCompleted}</div>
            </div>
          </div>
        </section>
      )}
      
      {/* Activity Section */}
      {showActivity && (
        <section className="profile-stats__section">
          <h3 className="profile-stats__section-title">
            <span className="profile-stats__section-icon">📊</span>
            Activity
          </h3>
          <div className="profile-stats__grid">
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">📅</span>
                <span className="profile-stats__item-label">Days Active</span>
              </div>
              <div className="profile-stats__item-value">{daysActive}</div>
            </div>
            
            <div className="profile-stats__item profile-stats__item--streak">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🔥</span>
                <span className="profile-stats__item-label">Current Streak</span>
              </div>
              <div className="profile-stats__item-value profile-stats__item-value--streak">
                {currentStreak} days
              </div>
            </div>
            
            <div className="profile-stats__item">
              <div className="profile-stats__item-header">
                <span className="profile-stats__item-icon">🏅</span>
                <span className="profile-stats__item-label">Longest Streak</span>
              </div>
              <div className="profile-stats__item-value">{longestStreak} days</div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProfileStats;