/**
 * GPS Lab Platform - UserProfile Component
 * 
 * Complete user profile view combining header, stats,
 * badges, and activity feed.
 * 
 * @module components/profile/UserProfile/UserProfile
 */

import React, { useState, useCallback } from 'react';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import './UserProfile.css';

/**
 * Profile tabs configuration
 */
const PROFILE_TABS = [
  { id: 'overview', label: 'Overview', icon: '📊' },
  { id: 'achievements', label: 'Achievements', icon: '🏆' },
  { id: 'activity', label: 'Activity', icon: '📈' },
  { id: 'portfolio', label: 'Portfolio', icon: '📁' }
];

/**
 * UserProfile Component
 */
const UserProfile = ({
  user = {},
  stats = {},
  badges = [],
  recentActivity = [],
  portfolioItems = [],
  isOwnProfile = false,
  isFollowing = false,
  onEditProfile,
  onViewPortfolio,
  onShareProfile,
  onFollow,
  onMessage,
  onTabChange,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  
  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    if (onTabChange) {
      onTabChange(tabId);
    }
  }, [onTabChange]);
  
  const classNames = [
    'user-profile',
    isLoading && 'user-profile--loading',
    className
  ].filter(Boolean).join(' ');
  
  if (isLoading) {
    return (
      <div className={classNames} {...props}>
        <div className="user-profile__loading">
          <div className="user-profile__loading-spinner" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <ProfileHeader
        user={user}
        stats={stats}
        isOwnProfile={isOwnProfile}
        isFollowing={isFollowing}
        onEditProfile={onEditProfile}
        onViewPortfolio={onViewPortfolio}
        onShareProfile={onShareProfile}
        onFollow={onFollow}
        onMessage={onMessage}
        variant="banner"
      />
      
      {/* Navigation Tabs */}
      <nav className="user-profile__tabs">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`user-profile__tab ${activeTab === tab.id ? 'user-profile__tab--active' : ''}`}
            onClick={() => handleTabChange(tab.id)}
          >
            <span className="user-profile__tab-icon">{tab.icon}</span>
            <span className="user-profile__tab-label">{tab.label}</span>
          </button>
        ))}
      </nav>
      
      {/* Tab Content */}
      <div className="user-profile__content">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="user-profile__overview">
            <div className="user-profile__overview-main">
              <ProfileStats
                stats={stats}
                showProgress={true}
                showAchievements={true}
                showCurrency={true}
                showSocial={true}
                showActivity={true}
              />
            </div>
            
            <aside className="user-profile__overview-sidebar">
              {/* Featured Badges */}
              <section className="user-profile__sidebar-section">
                <h3 className="user-profile__sidebar-title">
                  <span className="user-profile__sidebar-icon">🎖️</span>
                  Featured Badges
                </h3>
                <div className="user-profile__featured-badges">
                  {badges.slice(0, 6).map((badge, index) => (
                    <div 
                      key={badge.id || index}
                      className="user-profile__featured-badge"
                      title={badge.name}
                    >
                      <span className="user-profile__badge-icon">
                        {badge.icon || '🏅'}
                      </span>
                    </div>
                  ))}
                  {badges.length === 0 && (
                    <p className="user-profile__empty-text">No badges yet</p>
                  )}
                </div>
                {badges.length > 0 && (
                  <button
                    type="button"
                    className="user-profile__view-all-btn"
                    onClick={() => handleTabChange('achievements')}
                  >
                    View All Badges →
                  </button>
                )}
              </section>
              
              {/* Recent Activity */}
              <section className="user-profile__sidebar-section">
                <h3 className="user-profile__sidebar-title">
                  <span className="user-profile__sidebar-icon">📋</span>
                  Recent Activity
                </h3>
                <div className="user-profile__recent-activity">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={activity.id || index} className="user-profile__activity-item">
                      <span className="user-profile__activity-icon">
                        {activity.icon || '📌'}
                      </span>
                      <div className="user-profile__activity-content">
                        <span className="user-profile__activity-text">
                          {activity.text}
                        </span>
                        <span className="user-profile__activity-time">
                          {activity.timeAgo}
                        </span>
                      </div>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="user-profile__empty-text">No recent activity</p>
                  )}
                </div>
              </section>
            </aside>
          </div>
        )}
        
        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="user-profile__achievements">
            <div className="user-profile__achievements-header">
              <h2 className="user-profile__section-title">
                <span className="user-profile__section-icon">🏆</span>
                Achievements & Badges
              </h2>
              <div className="user-profile__achievements-stats">
                <span className="user-profile__achievements-count">
                  {badges.length} / 50 Badges
                </span>
              </div>
            </div>
            
            <div className="user-profile__badges-grid">
              {badges.map((badge, index) => (
                <div 
                  key={badge.id || index}
                  className={`user-profile__badge-card ${badge.rarity ? `user-profile__badge-card--${badge.rarity}` : ''}`}
                >
                  <span className="user-profile__badge-card-icon">
                    {badge.icon || '🏅'}
                  </span>
                  <span className="user-profile__badge-card-name">
                    {badge.name}
                  </span>
                  <span className="user-profile__badge-card-date">
                    {badge.earnedDate || 'Earned'}
                  </span>
                </div>
              ))}
              {badges.length === 0 && (
                <div className="user-profile__empty-state">
                  <span className="user-profile__empty-icon">🎖️</span>
                  <p>No badges earned yet</p>
                  <span className="user-profile__empty-hint">
                    Complete stages and challenges to earn badges!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="user-profile__activity-tab">
            <h2 className="user-profile__section-title">
              <span className="user-profile__section-icon">📈</span>
              Activity Feed
            </h2>
            
            <div className="user-profile__activity-feed">
              {recentActivity.map((activity, index) => (
                <div key={activity.id || index} className="user-profile__activity-card">
                  <div className="user-profile__activity-card-icon">
                    {activity.icon || '📌'}
                  </div>
                  <div className="user-profile__activity-card-content">
                    <p className="user-profile__activity-card-text">
                      {activity.text}
                    </p>
                    {activity.details && (
                      <p className="user-profile__activity-card-details">
                        {activity.details}
                      </p>
                    )}
                    <span className="user-profile__activity-card-time">
                      {activity.timeAgo}
                    </span>
                  </div>
                </div>
              ))}
              {recentActivity.length === 0 && (
                <div className="user-profile__empty-state">
                  <span className="user-profile__empty-icon">📋</span>
                  <p>No activity yet</p>
                  <span className="user-profile__empty-hint">
                    Start completing stages to build your activity history!
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Portfolio Tab */}
        {activeTab === 'portfolio' && (
          <div className="user-profile__portfolio-tab">
            <div className="user-profile__portfolio-header">
              <h2 className="user-profile__section-title">
                <span className="user-profile__section-icon">📁</span>
                Portfolio
              </h2>
              {isOwnProfile && (
                <button
                  type="button"
                  className="user-profile__add-portfolio-btn"
                  onClick={onViewPortfolio}
                >
                  <span>➕</span> Add Entry
                </button>
              )}
            </div>
            
            <div className="user-profile__portfolio-grid">
              {portfolioItems.map((item, index) => (
                <div key={item.id || index} className="user-profile__portfolio-card">
                  {item.thumbnailUrl && (
                    <div className="user-profile__portfolio-thumbnail">
                      <img src={item.thumbnailUrl} alt={item.title} />
                    </div>
                  )}
                  <div className="user-profile__portfolio-info">
                    <h4 className="user-profile__portfolio-title">{item.title}</h4>
                    <p className="user-profile__portfolio-desc">{item.description}</p>
                    <div className="user-profile__portfolio-tags">
                      {item.tags?.slice(0, 3).map((tag, i) => (
                        <span key={i} className="user-profile__portfolio-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {portfolioItems.length === 0 && (
                <div className="user-profile__empty-state user-profile__empty-state--full">
                  <span className="user-profile__empty-icon">📁</span>
                  <p>No portfolio entries yet</p>
                  <span className="user-profile__empty-hint">
                    {isOwnProfile 
                      ? 'Add your projects and achievements to showcase your work!'
                      : 'This user hasn\'t added any portfolio entries yet.'}
                  </span>
                  {isOwnProfile && (
                    <button
                      type="button"
                      className="user-profile__empty-action-btn"
                      onClick={onViewPortfolio}
                    >
                      Create Portfolio Entry
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { PROFILE_TABS };
export default UserProfile;