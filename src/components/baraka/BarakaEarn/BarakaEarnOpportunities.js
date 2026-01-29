/**
 * GPS Lab Platform - BarakaEarnOpportunities Component
 * 
 * Displays opportunities to earn Baraka with
 * progress tracking and quick action buttons.
 * 
 * @module components/baraka/BarakaEarn/BarakaEarnOpportunities
 */

import React, { useState, useCallback } from 'react';
import './BarakaEarnOpportunities.css';

/**
 * Earning opportunity categories
 */
const OPPORTUNITY_CATEGORIES = [
  { id: 'all', label: 'All', icon: '🌟' },
  { id: 'missions', label: 'Missions', icon: '🎯' },
  { id: 'social', label: 'Social', icon: '👥' },
  { id: 'daily', label: 'Daily', icon: '📅' },
  { id: 'bonus', label: 'Bonus', icon: '🎁' }
];

/**
 * Default earning opportunities
 */
const DEFAULT_OPPORTUNITIES = [
  {
    id: 'bite-complete',
    category: 'missions',
    title: 'Complete Bites',
    description: 'Earn Baraka by completing learning bites',
    reward: { min: 10, max: 50 },
    icon: '🍽️',
    action: 'Continue Learning',
    link: '/missions'
  },
  {
    id: 'checkpoint-complete',
    category: 'missions',
    title: 'Complete Checkpoints',
    description: 'Big rewards for checkpoint completion',
    reward: { min: 100, max: 500 },
    icon: '🏁',
    action: 'View Checkpoints',
    link: '/missions'
  },
  {
    id: 'praise-send',
    category: 'social',
    title: 'Give Praise',
    description: 'Encourage others in the GPS Lab community',
    reward: { fixed: 5 },
    icon: '🎉',
    action: 'Give Praise',
    link: '/praise'
  },
  {
    id: 'party-help',
    category: 'social',
    title: 'Help Party Members',
    description: 'Assist your party with their missions',
    reward: { min: 10, max: 25 },
    icon: '🤝',
    action: 'View Party',
    link: '/party'
  },
  {
    id: 'daily-login',
    category: 'daily',
    title: 'Daily Login',
    description: 'Log in every day to earn bonus Baraka',
    reward: { fixed: 10 },
    icon: '📅',
    progress: { current: 1, total: 1 },
    action: 'Claim Now',
    claimable: true
  },
  {
    id: 'streak-bonus',
    category: 'daily',
    title: 'Streak Bonus',
    description: 'Maintain your login streak for extra rewards',
    reward: { min: 20, max: 100 },
    icon: '🔥',
    action: 'View Streak',
    link: '/profile'
  },
  {
    id: 'stage-advance',
    category: 'bonus',
    title: 'Stage Advancement',
    description: 'Major rewards when advancing to next stage',
    reward: { min: 500, max: 2000 },
    icon: '⬆️',
    action: 'View Progress',
    link: '/progress'
  },
  {
    id: 'achievement',
    category: 'bonus',
    title: 'Achievements',
    description: 'Unlock achievements for special rewards',
    reward: { min: 50, max: 500 },
    icon: '🏆',
    action: 'View Achievements',
    link: '/achievements'
  }
];

/**
 * Format reward display
 */
const formatReward = (reward) => {
  if (reward.fixed) return `${reward.fixed} 🪙`;
  return `${reward.min}-${reward.max} 🪙`;
};

/**
 * BarakaEarnOpportunities Component
 */
const BarakaEarnOpportunities = ({
  opportunities = DEFAULT_OPPORTUNITIES,
  onOpportunityAction,
  onClaim,
  showCategories = true,
  showHeader = true,
  className = '',
  ...props
}) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [claimingId, setClaimingId] = useState(null);
  
  // Filter opportunities
  const filteredOpportunities = opportunities.filter((opp) => {
    if (activeCategory === 'all') return true;
    return opp.category === activeCategory;
  });
  
  const handleAction = useCallback((opportunity) => {
    if (opportunity.claimable && onClaim) {
      setClaimingId(opportunity.id);
      onClaim(opportunity).finally(() => {
        setClaimingId(null);
      });
    } else if (onOpportunityAction) {
      onOpportunityAction(opportunity);
    }
  }, [onClaim, onOpportunityAction]);
  
  const classNames = [
    'baraka-earn',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      {showHeader && (
        <header className="baraka-earn__header">
          <h3 className="baraka-earn__title">
            <span className="baraka-earn__title-icon">💰</span>
            Earn Baraka
          </h3>
          <p className="baraka-earn__subtitle">
            Complete activities to earn more Baraka
          </p>
        </header>
      )}
      
      {/* Categories */}
      {showCategories && (
        <div className="baraka-earn__categories">
          {OPPORTUNITY_CATEGORIES.map((category) => (
            <button
              key={category.id}
              type="button"
              className={`baraka-earn__category ${activeCategory === category.id ? 'baraka-earn__category--active' : ''}`}
              onClick={() => setActiveCategory(category.id)}
            >
              <span className="baraka-earn__category-icon">{category.icon}</span>
              <span className="baraka-earn__category-label">{category.label}</span>
            </button>
          ))}
        </div>
      )}
      
      {/* Opportunities Grid */}
      <div className="baraka-earn__grid">
        {filteredOpportunities.map((opportunity) => (
          <article key={opportunity.id} className="baraka-earn__card">
            {/* Card Header */}
            <div className="baraka-earn__card-header">
              <span className="baraka-earn__card-icon">{opportunity.icon}</span>
              <div className="baraka-earn__card-reward">
                {formatReward(opportunity.reward)}
              </div>
            </div>
            
            {/* Card Content */}
            <div className="baraka-earn__card-content">
              <h4 className="baraka-earn__card-title">{opportunity.title}</h4>
              <p className="baraka-earn__card-description">{opportunity.description}</p>
            </div>
            
            {/* Progress */}
            {opportunity.progress && (
              <div className="baraka-earn__card-progress">
                <div className="baraka-earn__progress-bar">
                  <div 
                    className="baraka-earn__progress-fill"
                    style={{ 
                      width: `${(opportunity.progress.current / opportunity.progress.total) * 100}%` 
                    }}
                  />
                </div>
                <span className="baraka-earn__progress-text">
                  {opportunity.progress.current}/{opportunity.progress.total}
                </span>
              </div>
            )}
            
            {/* Action Button */}
            <button
              type="button"
              className={`baraka-earn__card-action ${opportunity.claimable ? 'baraka-earn__card-action--claimable' : ''}`}
              onClick={() => handleAction(opportunity)}
              disabled={claimingId === opportunity.id}
            >
              {claimingId === opportunity.id ? (
                <>
                  <span className="baraka-earn__spinner" />
                  Claiming...
                </>
              ) : (
                opportunity.action
              )}
            </button>
            
            {/* Highlight for claimable */}
            {opportunity.claimable && (
              <div className="baraka-earn__card-glow" />
            )}
          </article>
        ))}
      </div>
      
      {/* Empty State */}
      {filteredOpportunities.length === 0 && (
        <div className="baraka-earn__empty">
          <span className="baraka-earn__empty-icon">🔍</span>
          <p className="baraka-earn__empty-text">
            No opportunities in this category
          </p>
        </div>
      )}
    </div>
  );
};

export { OPPORTUNITY_CATEGORIES, DEFAULT_OPPORTUNITIES };
export default BarakaEarnOpportunities;