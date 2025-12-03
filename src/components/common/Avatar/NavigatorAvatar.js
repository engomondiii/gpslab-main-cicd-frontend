/**
 * GPS Lab Platform - NavigatorAvatar Component
 * 
 * AI character avatar with speaking animation and character styling.
 * 
 * @module components/common/Avatar/NavigatorAvatar
 * @version 1.0.0
 */

import React from 'react';
import { AI_CHARACTERS } from '../Badge/CharacterBadge';
import './NavigatorAvatar.css';

// =============================================================================
// CONSTANTS
// =============================================================================

// Character info
const CHARACTER_INFO = {
  [AI_CHARACTERS.NAVIGATOR]: {
    name: 'Navigator',
    icon: '🧭',
    color: '#2563eb',
    gradient: 'linear-gradient(135deg, #2563eb, #1d4ed8)'
  },
  [AI_CHARACTERS.COMPANION]: {
    name: 'Companion',
    icon: '🤝',
    color: '#16a34a',
    gradient: 'linear-gradient(135deg, #16a34a, #15803d)'
  },
  [AI_CHARACTERS.COACH]: {
    name: 'Coach',
    icon: '🎯',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)'
  },
  [AI_CHARACTERS.MENTOR]: {
    name: 'Mentor',
    icon: '🦉',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, #7c3aed, #6d28d9)'
  }
};

export const NAVIGATOR_SIZES = {
  SM: 'sm',
  MD: 'md',
  LG: 'lg',
  XL: 'xl'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * NavigatorAvatar component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.character='navigator'] - AI character type
 * @param {string} [props.size='md'] - Avatar size
 * @param {boolean} [props.speaking=false] - Speaking/active state
 * @param {boolean} [props.thinking=false] - Thinking state
 * @param {boolean} [props.listening=false] - Listening state
 * @param {string} [props.customImage] - Custom avatar image
 * @param {Function} [props.onClick] - Click handler
 * @param {string} [props.className] - Additional CSS classes
 */
const NavigatorAvatar = ({
  character = AI_CHARACTERS.NAVIGATOR,
  size = NAVIGATOR_SIZES.MD,
  speaking = false,
  thinking = false,
  listening = false,
  customImage,
  onClick,
  className = '',
  ...props
}) => {
  
  const info = CHARACTER_INFO[character] || CHARACTER_INFO[AI_CHARACTERS.NAVIGATOR];
  
  const classNames = [
    'navigator-avatar',
    `navigator-avatar--${character}`,
    `navigator-avatar--${size}`,
    speaking && 'navigator-avatar--speaking',
    thinking && 'navigator-avatar--thinking',
    listening && 'navigator-avatar--listening',
    onClick && 'navigator-avatar--clickable',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div
      className={classNames}
      style={{ '--character-color': info.color }}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...props}
    >
      {/* Outer ring (animated when speaking) */}
      <div className="navigator-avatar__ring">
        <div className="navigator-avatar__ring-inner" />
      </div>
      
      {/* Main avatar */}
      <div 
        className="navigator-avatar__main"
        style={{ background: info.gradient }}
      >
        {customImage ? (
          <img 
            src={customImage} 
            alt={info.name}
            className="navigator-avatar__image"
          />
        ) : (
          <span className="navigator-avatar__icon">{info.icon}</span>
        )}
      </div>
      
      {/* Thinking dots */}
      {thinking && (
        <div className="navigator-avatar__thinking">
          <span className="navigator-avatar__dot" />
          <span className="navigator-avatar__dot" />
          <span className="navigator-avatar__dot" />
        </div>
      )}
      
      {/* Listening indicator */}
      {listening && (
        <div className="navigator-avatar__listening">
          <span className="navigator-avatar__wave" />
          <span className="navigator-avatar__wave" />
          <span className="navigator-avatar__wave" />
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default NavigatorAvatar;
export { AI_CHARACTERS };