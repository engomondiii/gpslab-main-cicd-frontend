/**
 * GPS Lab Platform - DashboardOverview Component
 * 
 * Main overview section of the dashboard.
 * Displays stats grid and activity feed.
 * 
 * @module components/dashboard/DashboardOverview
 */

import React, { useMemo } from 'react';
import StatsWidget from './StatsWidget';
import ActivityFeed from './ActivityFeed';
import './DashboardOverview.css';

/**
 * DashboardOverview Component
 */
const DashboardOverview = ({
  user = {},
  stats = {},
  activities = [],
  isLoading = false,
  onStatClick,
  onActivityClick,
  onViewAllActivities,
  className = '',
  ...props
}) => {
  
  /**
   * Stats configuration
   */
  const statsConfig = useMemo(() => [
    {
      id: 'stage',
      icon: 'stage',
      label: 'Current Stage',
      value: stats.currentStage || 1,
      suffix: '/35',
      color: 'primary',
      trend: stats.stageTrend,
      trendLabel: 'stages completed this month'
    },
    {
      id: 'xp',
      icon: 'xp',
      label: 'Total XP',
      value: stats.currentXP || 0,
      color: 'accent',
      trend: stats.xpTrend,
      trendLabel: 'vs last week'
    },
    {
      id: 'missions',
      icon: 'missions',
      label: 'Missions Completed',
      value: stats.missionsCompleted || 0,
      color: 'success',
      trend: stats.missionsTrend,
      trendLabel: 'this week'
    },
    {
      id: 'streak',
      icon: 'streak',
      label: 'Current Streak',
      value: stats.currentStreak || 0,
      suffix: ' days',
      color: 'secondary',
      trend: stats.streakTrend
    },
    {
      id: 'baraka',
      icon: 'baraka',
      label: 'Baraka Balance',
      value: stats.barakaBalance || 0,
      prefix: 'ƀ',
      color: 'baraka',
      trend: stats.barakaTrend,
      trendLabel: 'this month'
    },
    {
      id: 'level',
      icon: 'level',
      label: 'Level',
      value: stats.level || 1,
      color: 'info',
      trend: stats.levelTrend
    }
  ], [stats]);
  
  /**
   * Get greeting based on time of day
   */
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  
  const classNames = ['dashboard-overview', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Welcome Header */}
      <div className="dashboard-overview__header">
        <div className="dashboard-overview__greeting">
          <h1 className="dashboard-overview__greeting-text">
            {greeting}, <span className="dashboard-overview__user-name">{user.firstName || user.displayName || 'Explorer'}</span>!
          </h1>
          <p className="dashboard-overview__greeting-sub">
            Ready to continue your problem-solving journey?
          </p>
        </div>
        
        {/* Level Progress */}
        {stats.level && (
          <div className="dashboard-overview__level">
            <div className="dashboard-overview__level-badge">
              <span className="dashboard-overview__level-number">{stats.level}</span>
            </div>
            <div className="dashboard-overview__level-info">
              <span className="dashboard-overview__level-label">Level {stats.level}</span>
              <div className="dashboard-overview__level-progress">
                <div 
                  className="dashboard-overview__level-progress-fill"
                  style={{ width: `${((stats.currentXP || 0) / (stats.requiredXP || 100)) * 100}%` }}
                />
              </div>
              <span className="dashboard-overview__level-xp">
                {stats.currentXP?.toLocaleString() || 0} / {stats.requiredXP?.toLocaleString() || 100} XP
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Stats Grid */}
      <div className="dashboard-overview__stats">
        {statsConfig.map(stat => (
          <StatsWidget
            key={stat.id}
            {...stat}
            onClick={() => onStatClick?.(stat.id)}
            className="dashboard-overview__stat"
          />
        ))}
      </div>
      
      {/* Activity Feed */}
      <div className="dashboard-overview__activity">
        <ActivityFeed
          activities={activities}
          title="Recent Activity"
          maxItems={5}
          showViewAll={true}
          onViewAll={onViewAllActivities}
          onActivityClick={onActivityClick}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DashboardOverview;