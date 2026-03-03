/**
 * GPS Lab Platform - CharacterBadge Component
 * GPS 101 INTEGRATION: Character badge with GPS 101 context awareness
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
    description: 'Guides your learning journey',
    // NEW: GPS 101 specific description
    gps101Description: 'Guides your purpose discovery journey'
  },
  [AI_CHARACTERS.COMPANION]: {
    name: 'Companion',
    icon: '🤝',
    color: '#16a34a',
    description: 'Supports your daily practice',
    gps101Description: 'Supports your daily reflection'
  },
  [AI_CHARACTERS.COACH]: {
    name: 'Coach',
    icon: '🎯',
    color: '#f59e0b',
    description: 'Challenges you to grow',
    gps101Description: 'Challenges you to dig deeper'
  },
  [AI_CHARACTERS.MENTOR]: {
    name: 'Mentor',
    icon: '🦉',
    color: '#7c3aed',
    description: 'Shares wisdom and insights',
    gps101Description: 'Shares purpose-discovery wisdom'
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
 * @param {boolean} [props.isGPS101=false] - GPS 101 context
 * @param {number} [props.gps101StageNumber] - GPS 101 stage number
 * @param {string} [props.className] - Additional CSS classes
 */
const CharacterBadge = ({
  character,
  showName = true,
  showIcon = true,
  compact = false,
  active = false,
  // NEW: GPS 101 props
  isGPS101 = false,
  gps101StageNumber,
  className = '',
  ...props
}) => {
  
  const info = CHARACTER_INFO[character];
  
  if (!info) {
    console.warn(`Unknown character: ${character}`);
    return null;
  }
  
  // Use GPS 101 description if in GPS 101 context
  const description = isGPS101 ? info.gps101Description : info.description;
  
  const classNames = [
    'character-badge',
    `character-badge--${character}`,
    compact && 'character-badge--compact',
    active && 'character-badge--active',
    isGPS101 && 'character-badge--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <span 
      className={classNames}
      style={{ '--character-color': info.color }}
      title={description}
      {...props}
    >
      {showIcon && (
        <span className="character-badge__icon">{info.icon}</span>
      )}
      {showName && !compact && (
        <span className="character-badge__name">{info.name}</span>
      )}
      {/* NEW: GPS 101 indicator */}
      {isGPS101 && !compact && (
        <span className="character-badge__gps101">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
          </svg>
          {gps101StageNumber && <span className="character-badge__gps101-stage">S{gps101StageNumber}</span>}
        </span>
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