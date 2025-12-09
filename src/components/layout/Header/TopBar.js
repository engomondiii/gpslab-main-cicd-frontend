/**
 * GPS Lab Platform - TopBar Component
 * 
 * Displays user stats (Baraka, XP, Level) at the top of the header.
 * Uses the GPS Lab beacon color system for stage progression.
 * 
 * @module components/layout/Header/TopBar
 * @version 1.0.0
 */

import React from 'react';
import './TopBar.css';

// =============================================================================
// CONSTANTS
// =============================================================================

// Beacon colors for each stage range (7 beacons)
const BEACON_COLORS = {
  1: { color: '#FF6B6B', name: 'Red', range: '1-5' },      // GPS 101
  2: { color: '#FF8C42', name: 'Orange', range: '6-10' },  // GPS Prep
  3: { color: '#F1C40F', name: 'Yellow', range: '11-15' }, // GPS Simulation
  4: { color: '#2A9D8F', name: 'Green', range: '16-20' },  // GPS Capstone 1
  5: { color: '#00D4FF', name: 'Blue', range: '21-25' },   // GPS Capstone 2
  6: { color: '#9B59B6', name: 'Indigo', range: '26-30' }, // Venture Acceleration
  7: { color: '#8E44AD', name: 'Purple', range: '31-35' }  // Venture Capitalization
};

// Get beacon info based on stage
const getBeaconInfo = (stage) => {
  if (stage <= 5) return BEACON_COLORS[1];
  if (stage <= 10) return BEACON_COLORS[2];
  if (stage <= 15) return BEACON_COLORS[3];
  if (stage <= 20) return BEACON_COLORS[4];
  if (stage <= 25) return BEACON_COLORS[5];
  if (stage <= 30) return BEACON_COLORS[6];
  return BEACON_COLORS[7];
};

// Format large numbers
const formatNumber = (num) => {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toLocaleString();
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * TopBar component
 * 
 * @param {Object} props - Component props
 * @param {number} [props.baraka=0] - Baraka balance
 * @param {number} [props.xp=0] - Experience points
 * @param {number} [props.level=1] - User level
 * @param {number} [props.currentStage=1] - Current learning stage
 * @param {string} [props.className] - Additional CSS classes
 */
const TopBar = ({
  baraka = 0,
  xp = 0,
  level = 1,
  currentStage = 1,
  className = '',
  ...props
}) => {
  
  const beaconInfo = getBeaconInfo(currentStage);
  
  const classNames = [
    'topbar',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="topbar__container">
        {/* Stage Beacon Indicator */}
        <div className="topbar__beacon" style={{ '--beacon-color': beaconInfo.color }}>
          <span className="topbar__beacon-dot" />
          <span className="topbar__beacon-text">
            Stage {currentStage}
          </span>
        </div>
        
        {/* Stats */}
        <div className="topbar__stats">
          {/* Baraka */}
          <div className="topbar__stat topbar__stat--baraka">
            <span className="topbar__stat-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
              </svg>
            </span>
            <span className="topbar__stat-value">{formatNumber(baraka)}</span>
            <span className="topbar__stat-label">Baraka</span>
          </div>
          
          {/* XP */}
          <div className="topbar__stat topbar__stat--xp">
            <span className="topbar__stat-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
              </svg>
            </span>
            <span className="topbar__stat-value">{formatNumber(xp)}</span>
            <span className="topbar__stat-label">XP</span>
          </div>
          
          {/* Level */}
          <div className="topbar__stat topbar__stat--level">
            <span className="topbar__stat-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
            </span>
            <span className="topbar__stat-value">Lvl {level}</span>
          </div>
        </div>
        
        {/* Quick Links */}
        <div className="topbar__links">
          <a href="/leaderboard" className="topbar__link">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
            </svg>
            <span>Leaderboard</span>
          </a>
          <a href="/achievements" className="topbar__link">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd"/>
            </svg>
            <span>Achievements</span>
          </a>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default TopBar;