/**
 * GPS Lab Platform - DashboardOverview Component
 * * Main overview section of the dashboard.
 * Displays stats grid and activity feed.
 * * UPDATED: GPS 101 Integration - Always shows GPS 101 stats. Re-routes to enrollment if not enrolled.
 * * @module components/dashboard/DashboardOverview
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
  // GPS 101 Props
  gps101Enrolled = false,
  gps101Stats = {},
  isLoading = false,
  onStatClick,
  onActivityClick,
  onViewAllActivities,
  className = '',
  ...props
}) => {
  
  /**
   * Stats configuration with GPS 101 integration
   */
  const statsConfig = useMemo(() => {
    const baseStats = [
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
    ];
    
    // ALWAYS SHOW GPS 101 STATS (Values set to 0 if not enrolled)
    const gps101StatsToAdd = [
      {
        id: 'gps101-stage',
        icon: 'gps101',
        label: 'GPS 101 Stage',
        value: gps101Enrolled ? (gps101Stats.currentStage || 1) : 0,
        suffix: '/5',
        color: 'gps101',
        trend: gps101Enrolled ? gps101Stats.stageTrend : undefined,
        trendLabel: gps101Enrolled ? 'stages completed' : 'Start your journey'
      },
      {
        id: 'gps101-checkpoints',
        icon: 'checkpoints',
        label: 'Checkpoints Passed',
        value: gps101Enrolled ? (gps101Stats.checkpointsPassed || 0) : 0,
        suffix: '/150',
        color: 'gps101',
        trend: gps101Enrolled ? gps101Stats.checkpointsTrend : undefined,
        trendLabel: gps101Enrolled ? 'this week' : 'Enroll to begin'
      },
      {
        id: 'gps101-deliverables',
        icon: 'deliverables',
        label: 'Deliverables',
        value: gps101Enrolled ? (gps101Stats.deliverablesCompleted || 0) : 0,
        suffix: '/5',
        color: 'gps101',
        trendLabel: gps101Enrolled ? 'saved to portfolio' : 'Build your portfolio'
      },
      {
        id: 'orange-beacon',
        icon: 'orange_beacon',
        label: 'Orange Beacon',
        value: gps101Enrolled ? Math.floor(gps101Stats.orangeBeaconProgress || 0) : 0,
        suffix: '%',
        color: 'orange-beacon',
        trend: gps101Enrolled ? gps101Stats.beaconTrend : undefined,
        trendLabel: gps101Enrolled ? 'toward 5,000 Baraka' : 'Earn the beacon'
      }
    ];
    
    // Insert GPS 101 stats after level (position 6)
    return [...baseStats.slice(0, 6), ...gps101StatsToAdd, ...baseStats.slice(6)];
    
  }, [stats, gps101Enrolled, gps101Stats]);
  
  /**
   * Get greeting based on time of day
   */
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  
  /**
   * GPS 101 progress message
   */
  const gps101Message = useMemo(() => {
    if (!gps101Enrolled) return 'Ready to discover your life purpose?';
    
    const stage = gps101Stats.currentStage || 1;
    const stageMessages = {
      1: 'Discovering your identity',
      2: 'Exploring your life problem',
      3: 'Understanding problem owners',
      4: 'Defining your purpose',
      5: 'Designing your project'
    };
    
    return stageMessages[stage] || 'On your GPS 101 journey';
  }, [gps101Enrolled, gps101Stats]);
  
  const classNames = ['dashboard-overview', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Welcome Header - Always styled to hint at GPS 101 if enrolled or not */}
      <div className={`dashboard-overview__header ${gps101Enrolled ? 'dashboard-overview__header--gps101' : ''}`}>
        <div className="dashboard-overview__greeting">
          <h1 className="dashboard-overview__greeting-text">
            {greeting}, <span className="dashboard-overview__user-name">{user.firstName || user.displayName || 'Explorer'}</span>!
          </h1>
          <p className="dashboard-overview__greeting-sub">
            <span className="dashboard-overview__gps101-badge">GPS 101</span>
            {gps101Message}
          </p>
        </div>
        
        {/* Level Progress */}
        {stats.level && (
          <div className="dashboard-overview__level">
            <div className={`dashboard-overview__level-badge ${gps101Enrolled ? 'dashboard-overview__level-badge--gps101' : ''}`}>
              <span className="dashboard-overview__level-number">{stats.level}</span>
            </div>
            <div className="dashboard-overview__level-info">
              <span className="dashboard-overview__level-label">Level {stats.level}</span>
              <div className="dashboard-overview__level-progress">
                <div 
                  className={`dashboard-overview__level-progress-fill ${gps101Enrolled ? 'dashboard-overview__level-progress-fill--gps101' : ''}`}
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
            // Intercept clicks if not enrolled
            onClick={() => {
              if (!gps101Enrolled && (stat.id.includes('gps101') || stat.id === 'orange-beacon')) {
                onStatClick?.('enroll-gps101');
              } else {
                onStatClick?.(stat.id);
              }
            }}
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