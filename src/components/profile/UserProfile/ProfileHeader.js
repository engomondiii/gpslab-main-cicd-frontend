/**
 * GPS Lab Platform - ProfileHeader Component
 * 
 * Displays user profile header with avatar, name,
 * title, and quick action buttons.
 * 
 * @module components/profile/UserProfile/ProfileHeader
 */

import React from 'react';
import './ProfileHeader.css';

/**
 * Get stage title based on current stage
 */
const getStageTitle = (stage) => {
  if (stage <= 5) return 'Novice Problem Solver';
  if (stage <= 10) return 'Apprentice Thinker';
  if (stage <= 15) return 'Rising Analyst';
  if (stage <= 20) return 'Skilled Strategist';
  if (stage <= 25) return 'Expert Navigator';
  if (stage <= 30) return 'Master Innovator';
  return 'Global Problem Solver';
};

/**
 * ProfileHeader Component
 */
const ProfileHeader = ({
  user = {},
  stats = {},
  isOwnProfile = false,
  onEditProfile,
  onViewPortfolio,
  onShareProfile,
  onFollow,
  onMessage,
  isFollowing = false,
  showActions = true,
  variant = 'default', // default, compact, banner
  className = '',
  ...props
}) => {
  const {
    id,
    displayName = 'GPS Explorer',
    username = 'explorer',
    avatarUrl,
    bio = '',
    location = '',
    joinedDate,
    isOnline = false,
    isVerified = false,
    customTitle
  } = user;
  
  const {
    currentStage = 1,
    totalXP = 0,
    badgesEarned = 0,
    currentStreak = 0
  } = stats;
  
  const title = customTitle || getStageTitle(currentStage);
  
  // Format joined date
  const formatJoinedDate = (date) => {
    if (!date) return 'Recently';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  };
  
  const classNames = [
    'profile-header',
    `profile-header--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  // Compact variant
  if (variant === 'compact') {
    return (
      <div className={classNames} {...props}>
        <div className="profile-header__avatar-wrapper profile-header__avatar-wrapper--small">
          {avatarUrl ? (
            <img 
              src={avatarUrl} 
              alt={displayName}
              className="profile-header__avatar"
            />
          ) : (
            <div className="profile-header__avatar profile-header__avatar--placeholder">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
          {isOnline && <span className="profile-header__online-badge" />}
        </div>
        <div className="profile-header__info">
          <span className="profile-header__name">
            {displayName}
            {isVerified && <span className="profile-header__verified">✓</span>}
          </span>
          <span className="profile-header__username">@{username}</span>
        </div>
        <span className="profile-header__stage-badge">Stage {currentStage}</span>
      </div>
    );
  }
  
  return (
    <header className={classNames} {...props}>
      {/* Banner Background */}
      {variant === 'banner' && (
        <div className="profile-header__banner">
          <div className="profile-header__banner-gradient" />
        </div>
      )}
      
      <div className="profile-header__content">
        {/* Avatar */}
        <div className="profile-header__avatar-section">
          <div className="profile-header__avatar-wrapper">
            {avatarUrl ? (
              <img 
                src={avatarUrl} 
                alt={displayName}
                className="profile-header__avatar"
              />
            ) : (
              <div className="profile-header__avatar profile-header__avatar--placeholder">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
            {isOnline && <span className="profile-header__online-badge" />}
            <div className="profile-header__stage-ring" data-stage={currentStage}>
              <span className="profile-header__stage-number">{currentStage}</span>
            </div>
          </div>
          
          {/* Streak Badge */}
          {currentStreak > 0 && (
            <div className="profile-header__streak-badge">
              <span className="profile-header__streak-icon">🔥</span>
              <span className="profile-header__streak-count">{currentStreak}</span>
            </div>
          )}
        </div>
        
        {/* Info Section */}
        <div className="profile-header__info-section">
          <div className="profile-header__name-row">
            <h1 className="profile-header__name">
              {displayName}
              {isVerified && (
                <span className="profile-header__verified" title="Verified">
                  ✓
                </span>
              )}
            </h1>
            <span className="profile-header__username">@{username}</span>
          </div>
          
          <p className="profile-header__title">{title}</p>
          
          {bio && (
            <p className="profile-header__bio">{bio}</p>
          )}
          
          <div className="profile-header__meta">
            {location && (
              <span className="profile-header__meta-item">
                <span className="profile-header__meta-icon">📍</span>
                {location}
              </span>
            )}
            <span className="profile-header__meta-item">
              <span className="profile-header__meta-icon">📅</span>
              Joined {formatJoinedDate(joinedDate)}
            </span>
          </div>
          
          {/* Quick Stats */}
          <div className="profile-header__quick-stats">
            <div className="profile-header__quick-stat">
              <span className="profile-header__quick-stat-value">{totalXP.toLocaleString()}</span>
              <span className="profile-header__quick-stat-label">XP</span>
            </div>
            <div className="profile-header__quick-stat">
              <span className="profile-header__quick-stat-value">{badgesEarned}</span>
              <span className="profile-header__quick-stat-label">Badges</span>
            </div>
            <div className="profile-header__quick-stat">
              <span className="profile-header__quick-stat-value">Stage {currentStage}</span>
              <span className="profile-header__quick-stat-label">Progress</span>
            </div>
          </div>
        </div>
        
        {/* Actions */}
        {showActions && (
          <div className="profile-header__actions">
            {isOwnProfile ? (
              <>
                <button
                  type="button"
                  className="profile-header__action-btn profile-header__action-btn--primary"
                  onClick={onEditProfile}
                >
                  <span className="profile-header__action-icon">✏️</span>
                  Edit Profile
                </button>
                <button
                  type="button"
                  className="profile-header__action-btn"
                  onClick={onViewPortfolio}
                >
                  <span className="profile-header__action-icon">📁</span>
                  Portfolio
                </button>
                <button
                  type="button"
                  className="profile-header__action-btn"
                  onClick={onShareProfile}
                >
                  <span className="profile-header__action-icon">🔗</span>
                  Share
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className={`profile-header__action-btn ${isFollowing ? 'profile-header__action-btn--following' : 'profile-header__action-btn--primary'}`}
                  onClick={onFollow}
                >
                  <span className="profile-header__action-icon">
                    {isFollowing ? '✓' : '➕'}
                  </span>
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button
                  type="button"
                  className="profile-header__action-btn"
                  onClick={onMessage}
                >
                  <span className="profile-header__action-icon">💬</span>
                  Message
                </button>
                <button
                  type="button"
                  className="profile-header__action-btn"
                  onClick={onViewPortfolio}
                >
                  <span className="profile-header__action-icon">📁</span>
                  Portfolio
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default ProfileHeader;