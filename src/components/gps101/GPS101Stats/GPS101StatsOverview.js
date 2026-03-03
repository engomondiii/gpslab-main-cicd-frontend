/**
 * GPS 101 Stats Overview Component
 * 
 * Comprehensive statistics dashboard for GPS 101 progress.
 */

import React from 'react';
import { 
  formatBaraka, 
  formatXP,
  formatWeeks 
} from '../../../utils/formatters/gps101.formatter';
import './GPS101StatsOverview.css';

const GPS101StatsOverview = ({ 
  progressSummary,
  barakaEarned,
  xpEarned,
  earnedBadges,
  weeksElapsed,
  weeksRemaining,
  isOnTrack,
  r2rBalance,
  pr2rBalance
}) => {
  const stats = [
    {
      category: 'Progress',
      items: [
        {
          icon: '📚',
          label: 'Stages',
          value: `${progressSummary.stages.completed}/${progressSummary.stages.total}`,
          percentage: progressSummary.stages.percentage,
          color: '#667eea'
        },
        {
          icon: '🎯',
          label: 'Missions',
          value: `${progressSummary.missions.completed}/${progressSummary.missions.total}`,
          percentage: progressSummary.missions.percentage,
          color: '#764ba2'
        },
        {
          icon: '✓',
          label: 'Checkpoints',
          value: `${progressSummary.checkpoints.completed}/${progressSummary.checkpoints.total}`,
          percentage: progressSummary.checkpoints.percentage,
          color: '#4CAF50'
        }
      ]
    },
    {
      category: 'Rewards',
      items: [
        {
          icon: '💎',
          label: 'Baraka Earned',
          value: formatBaraka(barakaEarned),
          subtext: 'Total rewards',
          color: '#FFA500'
        },
        {
          icon: '⭐',
          label: 'XP Earned',
          value: formatXP(xpEarned),
          subtext: 'Experience points',
          color: '#FFD700'
        },
        {
          icon: '🏆',
          label: 'Badges',
          value: earnedBadges.length,
          subtext: 'Unlocked',
          color: '#9C27B0'
        }
      ]
    },
    {
      category: 'Timeline',
      items: [
        {
          icon: '📅',
          label: 'Weeks Elapsed',
          value: formatWeeks(weeksElapsed),
          color: '#2196F3'
        },
        {
          icon: '⏰',
          label: 'Weeks Remaining',
          value: formatWeeks(weeksRemaining),
          color: '#FF5722'
        },
        {
          icon: isOnTrack ? '✓' : '⚠️',
          label: 'Status',
          value: isOnTrack ? 'On Track' : 'Behind',
          color: isOnTrack ? '#4CAF50' : '#FFC107'
        }
      ]
    },
    {
      category: 'Study System',
      items: [
        {
          icon: '🔄',
          label: 'R2R Balance',
          value: r2rBalance,
          subtext: 'Retry rights',
          color: '#00BCD4'
        },
        {
          icon: '⚡',
          label: 'pR2R Balance',
          value: pr2rBalance,
          subtext: 'Provisional',
          color: '#FF9800'
        }
      ]
    }
  ];

  return (
    <div className="gps101-stats-overview">
      <div className="stats-header">
        <h2>GPS 101 Statistics</h2>
        <p className="stats-subtitle">Your journey at a glance</p>
      </div>

      <div className="stats-grid">
        {stats.map((section, sectionIndex) => (
          <div key={sectionIndex} className="stats-section">
            <h3 className="section-title">{section.category}</h3>
            <div className="section-stats">
              {section.items.map((stat, statIndex) => (
                <div key={statIndex} className="stat-card">
                  <div className="stat-icon" style={{ color: stat.color }}>
                    {stat.icon}
                  </div>
                  <div className="stat-content">
                    <div className="stat-label">{stat.label}</div>
                    <div className="stat-value" style={{ color: stat.color }}>
                      {stat.value}
                    </div>
                    {stat.subtext && (
                      <div className="stat-subtext">{stat.subtext}</div>
                    )}
                    {stat.percentage !== undefined && (
                      <div className="stat-progress-bar">
                        <div 
                          className="stat-progress-fill"
                          style={{ 
                            width: `${stat.percentage}%`,
                            background: stat.color
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Overall Progress Ring */}
      <div className="overall-progress-section">
        <div className="progress-ring-large">
          <svg viewBox="0 0 200 200">
            <circle
              className="progress-ring-bg"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="12"
            />
            <circle
              className="progress-ring-fill"
              cx="100"
              cy="100"
              r="90"
              fill="none"
              strokeWidth="12"
              strokeDasharray={`${(progressSummary.overallProgress / 100) * 565.48} 565.48`}
              transform="rotate(-90 100 100)"
            />
            <text
              x="100"
              y="90"
              textAnchor="middle"
              className="progress-percentage-large"
            >
              {progressSummary.overallProgress}%
            </text>
            <text
              x="100"
              y="115"
              textAnchor="middle"
              className="progress-label-large"
            >
              Complete
            </text>
          </svg>
        </div>
        <div className="progress-description">
          <h3>Overall Progress</h3>
          <p>
            You've completed {progressSummary.missions.completed} out of 30 missions 
            in your GPS 101 journey.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GPS101StatsOverview;