/**
 * GPS Lab Platform - StudyForgeHeader Component
 * 
 * Header for the Study Forge section displaying title, navigation,
 * and user study progress stats.
 * 
 * @module components/study/StudyForge/StudyForgeHeader
 */

import React from 'react';
import './StudyForgeHeader.css';

/**
 * StudyForgeHeader Component
 */
const StudyForgeHeader = ({
  title = 'Study Forge',
  subtitle = 'Master concepts and prepare for checkpoints',
  stats = {},
  onBack,
  onSearch,
  searchQuery = '',
  filterOptions = [],
  activeFilter = 'all',
  onFilterChange,
  className = '',
  ...props
}) => {
  const {
    modulesCompleted = 0,
    totalModules = 0,
    studyStreak = 0,
    xpEarned = 0,
    r2rAvailable = 0,
    pr2rAvailable = 0
  } = stats;
  
  const completionPercentage = totalModules > 0 
    ? Math.round((modulesCompleted / totalModules) * 100) 
    : 0;
  
  const classNames = [
    'study-forge-header',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <header className={classNames} {...props}>
      <div className="study-forge-header__top">
        {/* Back Navigation */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="study-forge-header__back-btn"
            aria-label="Go back"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
        
        {/* Title Section */}
        <div className="study-forge-header__title-section">
          <div className="study-forge-header__icon">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="study-forge-header__title-text">
            <h1 className="study-forge-header__title">{title}</h1>
            <p className="study-forge-header__subtitle">{subtitle}</p>
          </div>
        </div>
        
        {/* Quick Stats */}
        <div className="study-forge-header__stats">
          <div className="study-forge-header__stat">
            <span className="study-forge-header__stat-value">{studyStreak}</span>
            <span className="study-forge-header__stat-label">Day Streak</span>
            <span className="study-forge-header__stat-icon">🔥</span>
          </div>
          <div className="study-forge-header__stat">
            <span className="study-forge-header__stat-value">{xpEarned}</span>
            <span className="study-forge-header__stat-label">XP Earned</span>
            <span className="study-forge-header__stat-icon">⚡</span>
          </div>
          {(r2rAvailable > 0 || pr2rAvailable > 0) && (
            <div className="study-forge-header__retry-stats">
              {r2rAvailable > 0 && (
                <div className="study-forge-header__retry-badge study-forge-header__retry-badge--r2r">
                  <span className="study-forge-header__retry-count">{r2rAvailable}</span>
                  <span className="study-forge-header__retry-label">R2R</span>
                </div>
              )}
              {pr2rAvailable > 0 && (
                <div className="study-forge-header__retry-badge study-forge-header__retry-badge--pr2r">
                  <span className="study-forge-header__retry-count">{pr2rAvailable}</span>
                  <span className="study-forge-header__retry-label">pR2R</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="study-forge-header__progress">
        <div className="study-forge-header__progress-info">
          <span className="study-forge-header__progress-label">Overall Progress</span>
          <span className="study-forge-header__progress-value">
            {modulesCompleted}/{totalModules} modules • {completionPercentage}%
          </span>
        </div>
        <div className="study-forge-header__progress-bar">
          <div 
            className="study-forge-header__progress-fill"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Search and Filter */}
      <div className="study-forge-header__controls">
        {onSearch && (
          <div className="study-forge-header__search">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search study missions..."
              className="study-forge-header__search-input"
            />
          </div>
        )}
        
        {filterOptions.length > 0 && (
          <div className="study-forge-header__filters">
            {filterOptions.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`study-forge-header__filter-btn ${activeFilter === filter.value ? 'study-forge-header__filter-btn--active' : ''}`}
                onClick={() => onFilterChange && onFilterChange(filter.value)}
              >
                {filter.icon && <span className="study-forge-header__filter-icon">{filter.icon}</span>}
                {filter.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default StudyForgeHeader;