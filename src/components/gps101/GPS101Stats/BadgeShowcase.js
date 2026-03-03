/**
 * Badge Showcase Component
 * 
 * Display earned and available GPS 101 badges.
 */

import React from 'react';
import { GPS_101_BADGES } from '../../../utils/constants/gps101.constants';
import { formatBadgeName } from '../../../utils/formatters/gps101.formatter';
import './BadgeShowcase.css';

const BadgeShowcase = ({ earnedBadges = [], currentStage = 1 }) => {
  const allBadges = GPS_101_BADGES;

  const getBadgeStatus = (badge) => {
    if (earnedBadges.includes(badge.id)) return 'earned';
    
    // Check if badge is unlockable
    if (badge.stage && badge.stage <= currentStage) {
      return 'available';
    }
    
    if (badge.isCompletion) return 'locked';
    if (badge.isBarakaMilestone) return 'available';
    
    return 'locked';
  };

  const stageBadges = allBadges.filter(b => b.stage);
  const specialBadges = allBadges.filter(b => b.isCompletion || b.isBarakaMilestone);

  return (
    <div className="badge-showcase">
      <div className="showcase-header">
        <h2>GPS 101 Badges</h2>
        <p className="showcase-subtitle">
          {earnedBadges.length}/{allBadges.length} badges earned
        </p>
      </div>

      {/* Stage Badges */}
      <div className="badge-section">
        <h3 className="section-title">Stage Completion Badges</h3>
        <div className="badges-grid">
          {stageBadges.map((badge) => {
            const status = getBadgeStatus(badge);

            return (
              <div key={badge.id} className={`badge-card ${status}`}>
                <div className="badge-icon-wrapper">
                  {status === 'earned' ? (
                    <div className="badge-icon earned">🏆</div>
                  ) : status === 'available' ? (
                    <div className="badge-icon available">⭐</div>
                  ) : (
                    <div className="badge-icon locked">🔒</div>
                  )}
                  {status === 'earned' && (
                    <div className="earned-checkmark">✓</div>
                  )}
                </div>

                <div className="badge-info">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>
                  
                  {badge.stage && (
                    <div className="badge-stage">Stage {badge.stage}</div>
                  )}

                  <div className={`badge-status-text ${status}`}>
                    {status === 'earned' ? 'Earned!' : 
                     status === 'available' ? 'In Progress' : 
                     'Locked'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Special Badges */}
      <div className="badge-section">
        <h3 className="section-title">Special Badges</h3>
        <div className="badges-grid">
          {specialBadges.map((badge) => {
            const status = getBadgeStatus(badge);

            return (
              <div key={badge.id} className={`badge-card special ${status}`}>
                <div className="badge-icon-wrapper">
                  {status === 'earned' ? (
                    <div className="badge-icon earned special">
                      {badge.id === 'orange-beacon' ? '🟠' : '🎓'}
                    </div>
                  ) : (
                    <div className="badge-icon locked">
                      {badge.id === 'orange-beacon' ? '⚪' : '🔒'}
                    </div>
                  )}
                  {status === 'earned' && (
                    <div className="earned-checkmark special">✓</div>
                  )}
                </div>

                <div className="badge-info">
                  <h4 className="badge-name">{badge.name}</h4>
                  <p className="badge-description">{badge.description}</p>

                  {badge.barakaThreshold && (
                    <div className="badge-requirement">
                      {badge.barakaThreshold.toLocaleString()} Baraka
                    </div>
                  )}

                  <div className={`badge-status-text ${status}`}>
                    {status === 'earned' ? 'Earned!' : 
                     'Complete GPS 101'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="badge-progress-summary">
        <div className="progress-stat">
          <span className="progress-label">Stage Badges</span>
          <span className="progress-value">
            {stageBadges.filter(b => earnedBadges.includes(b.id)).length}/{stageBadges.length}
          </span>
        </div>
        <div className="progress-stat">
          <span className="progress-label">Special Badges</span>
          <span className="progress-value">
            {specialBadges.filter(b => earnedBadges.includes(b.id)).length}/{specialBadges.length}
          </span>
        </div>
        <div className="progress-stat">
          <span className="progress-label">Completion</span>
          <span className="progress-value">
            {Math.round((earnedBadges.length / allBadges.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default BadgeShowcase;