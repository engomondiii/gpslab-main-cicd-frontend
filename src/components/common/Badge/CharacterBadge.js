/**
 * GPS Lab Platform - CharacterBadge Component
 * 
 * Badge for displaying AI character identity (Navigator, Companion, Coach, Mentor).
 * 
 * @module components/common/Badge/CharacterBadge
 * @version 1.0.0
 */

import React from 'react';
import './CharacterBadge.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const AI_CHARACTERS = {
  NAVIGATOR: 'navigator',
  COMPANION: 'companion',
  COACH: 'coach',
  MENTOR: 'mentor'
};

// Character info
const CHARACTER_INFO = {
  [AI_CHARACTERS.NAVIGATOR]: {
    name: 'Navigator',
    icon: '🧭',
    color: '#2563eb',
    description: 'Guides your learning journey'
  },
  [AI_CHARACTERS.COMPANION]: {
    name: 'Companion',
    icon: '🤝',
    color: '#16a34a',
    description: 'Supports your daily practice'
  },
  [AI_CHARACTERS.COACH]: {
    name: 'Coach',
    icon: '🎯',
    color: '#f59e0b',
    description: 'Challenges you to grow'
  },
  [AI_CHARACTERS.MENTOR]: {
    name: 'Mentor',
    icon: '🦉',
    color: '#7c3aed',
    description: 'Shares wisdom and insights'
  }
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * CharacterBadge component
 * 
 * @param {Object} props - Component props
 * @param {string} props.character - Character type
 * @param {boolean} [props.showName=true] - Show character name
 * @param {boolean} [props.showIcon=true] - Show character icon
 * @param {boolean} [props.compact=false] - Compact mode
 * @param {boolean} [props.active=false] - Active/speaking state
 * @param {string} [props.className] - Additional CSS classes
 */
const CharacterBadge = ({
  character,
  showName = true,
  showIcon = true,
  compact = false,
  active = false,
  className = '',
  ...props
}) => {
  
  const info = CHARACTER_INFO[character];
  
  if (!info) {
    console.warn(`Unknown character: ${character}`);
    return null;
  }
  
  const classNames = [
    'character-badge',
    `character-badge--${character}`,
    compact && 'character-badge--compact',
    active && 'character-badge--active',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span 
      className={classNames}
      style={{ '--character-color': info.color }}
      title={info.description}
      {...props}
    >
      {showIcon && (
        <span className="character-badge__icon">{info.icon}</span>
      )}
      {showName && !compact && (
        <span className="character-badge__name">{info.name}</span>
      )}
      {active && (
        <span className="character-badge__indicator" />
      )}
    </span>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default CharacterBadge;