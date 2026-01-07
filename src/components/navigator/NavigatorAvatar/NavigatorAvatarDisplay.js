/**
 * GPS Lab Platform - NavigatorAvatarDisplay Component
 * 
 * Animated Navigator avatar with expressions and
 * interactive states for different contexts.
 * 
 * @module components/navigator/NavigatorAvatar/NavigatorAvatarDisplay
 */

import React, { useState, useEffect } from 'react';
import './NavigatorAvatarDisplay.css';

/**
 * Expression configurations
 */
const EXPRESSIONS = {
  default: { emoji: '🧭', animation: 'float' },
  happy: { emoji: '😊', animation: 'bounce' },
  thinking: { emoji: '🤔', animation: 'pulse' },
  encouraging: { emoji: '💪', animation: 'wave' },
  celebrating: { emoji: '🎉', animation: 'spin' },
  supportive: { emoji: '🤗', animation: 'pulse' },
  curious: { emoji: '🧐', animation: 'tilt' },
  proud: { emoji: '🌟', animation: 'glow' },
  helpful: { emoji: '🙋', animation: 'wave' },
  listening: { emoji: '👂', animation: 'pulse' }
};

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * NavigatorAvatarDisplay Component
 */
const NavigatorAvatarDisplay = ({
  expression = 'default',
  size = 'medium', // small, medium, large, xlarge
  isOnline = true,
  isAnimated = true,
  userStage = 1,
  showGlow = true,
  showStatus = true,
  onClick,
  onHover,
  tooltip,
  className = '',
  ...props
}) => {
  const [currentExpression, setCurrentExpression] = useState(expression);
  const [isHovered, setIsHovered] = useState(false);
  
  const beaconColor = getBeaconColor(userStage);
  const expressionConfig = EXPRESSIONS[currentExpression] || EXPRESSIONS.default;
  
  // Update expression when prop changes
  useEffect(() => {
    setCurrentExpression(expression);
  }, [expression]);
  
  // Handle hover for expression change
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (onHover) {
      onHover(true);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovered(false);
    if (onHover) {
      onHover(false);
    }
  };
  
  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };
  
  const classNames = [
    'navigator-avatar-display',
    `navigator-avatar-display--${size}`,
    isAnimated && `navigator-avatar-display--animated`,
    isAnimated && `navigator-avatar-display--${expressionConfig.animation}`,
    showGlow && 'navigator-avatar-display--glow',
    isHovered && 'navigator-avatar-display--hovered',
    onClick && 'navigator-avatar-display--clickable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={classNames}
      style={{ '--beacon-color': beaconColor }}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      title={tooltip}
      {...props}
    >
      {/* Background Glow */}
      {showGlow && (
        <div className="navigator-avatar-display__glow" />
      )}
      
      {/* Avatar Circle */}
      <div className="navigator-avatar-display__circle">
        {/* Expression Icon */}
        <span className="navigator-avatar-display__icon">
          {expressionConfig.emoji}
        </span>
        
        {/* Compass Ring */}
        <div className="navigator-avatar-display__ring">
          <svg viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="46"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
          </svg>
        </div>
        
        {/* Cardinal Points */}
        <div className="navigator-avatar-display__cardinals">
          <span className="navigator-avatar-display__cardinal navigator-avatar-display__cardinal--n">N</span>
          <span className="navigator-avatar-display__cardinal navigator-avatar-display__cardinal--e">E</span>
          <span className="navigator-avatar-display__cardinal navigator-avatar-display__cardinal--s">S</span>
          <span className="navigator-avatar-display__cardinal navigator-avatar-display__cardinal--w">W</span>
        </div>
      </div>
      
      {/* Status Indicator */}
      {showStatus && (
        <div className={`navigator-avatar-display__status ${isOnline ? 'navigator-avatar-display__status--online' : ''}`} />
      )}
      
      {/* Particle Effects (for celebrating) */}
      {currentExpression === 'celebrating' && isAnimated && (
        <div className="navigator-avatar-display__particles">
          <span className="navigator-avatar-display__particle">✨</span>
          <span className="navigator-avatar-display__particle">🌟</span>
          <span className="navigator-avatar-display__particle">⭐</span>
          <span className="navigator-avatar-display__particle">✨</span>
        </div>
      )}
    </div>
  );
};

export default NavigatorAvatarDisplay;