/**
 * GPS Lab Platform - PortfolioHeader Component
 * 
 * Header section for portfolio view with user info,
 * stats, and action buttons.
 * 
 * @module components/portfolio/PortfolioView/PortfolioHeader
 */

import React from 'react';
import './PortfolioHeader.css';

/**
 * PortfolioHeader Component
 */
const PortfolioHeader = ({
  user = {},
  portfolioStats = {},
  isOwnPortfolio = false,
  onEditPortfolio,
  onAddEntry,
  onShare,
  className = '',
  ...props
}) => {
  const {
    displayName = 'GPS Explorer',
    username = 'explorer',
    avatarUrl,
    customTitle
  } = user;
  
  const {
    totalEntries = 0,
    totalViews = 0,
    totalLikes = 0,
    featuredCount = 0
  } = portfolioStats;
  
  const classNames = [
    'portfolio-header',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <header className={classNames} {...props}>
      <div className="portfolio-header__banner">
        <div className="portfolio-header__banner-gradient" />
      </div>
      
      <div className="portfolio-header__content">
        {/* User Info */}
        <div className="portfolio-header__user">
          <div className="portfolio-header__avatar-wrapper">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="portfolio-header__avatar"
              />
            ) : (
              <div className="portfolio-header__avatar portfolio-header__avatar--placeholder">
                {displayName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="portfolio-header__user-info">
            <h1 className="portfolio-header__title">
              {displayName}'s Portfolio
            </h1>
            <p className="portfolio-header__username">@{username}</p>
            {customTitle && (
              <p className="portfolio-header__custom-title">{customTitle}</p>
            )}
          </div>
        </div>
        
        {/* Stats */}
        <div className="portfolio-header__stats">
          <div className="portfolio-header__stat">
            <span className="portfolio-header__stat-value">{totalEntries}</span>
            <span className="portfolio-header__stat-label">Projects</span>
          </div>
          <div className="portfolio-header__stat">
            <span className="portfolio-header__stat-value">{totalViews.toLocaleString()}</span>
            <span className="portfolio-header__stat-label">Views</span>
          </div>
          <div className="portfolio-header__stat">
            <span className="portfolio-header__stat-value">{totalLikes.toLocaleString()}</span>
            <span className="portfolio-header__stat-label">Likes</span>
          </div>
          {featuredCount > 0 && (
            <div className="portfolio-header__stat portfolio-header__stat--featured">
              <span className="portfolio-header__stat-value">{featuredCount}</span>
              <span className="portfolio-header__stat-label">Featured</span>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="portfolio-header__actions">
          {isOwnPortfolio ? (
            <>
              <button
                type="button"
                className="portfolio-header__action-btn portfolio-header__action-btn--primary"
                onClick={onAddEntry}
              >
                <span className="portfolio-header__action-icon">➕</span>
                Add Entry
              </button>
              <button
                type="button"
                className="portfolio-header__action-btn"
                onClick={onEditPortfolio}
              >
                <span className="portfolio-header__action-icon">✏️</span>
                Edit
              </button>
              <button
                type="button"
                className="portfolio-header__action-btn"
                onClick={onShare}
              >
                <span className="portfolio-header__action-icon">🔗</span>
                Share
              </button>
            </>
          ) : (
            <button
              type="button"
              className="portfolio-header__action-btn"
              onClick={onShare}
            >
              <span className="portfolio-header__action-icon">🔗</span>
              Share Portfolio
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PortfolioHeader;