/**
 * GPS Lab Platform - BadgeAnimation Component
 * 
 * Animated badge reveal with particle effects,
 * glow, and rarity-specific animations.
 * 
 * Integrates with Phase 20 Badge System (RARITY_CONFIG)
 * 
 * @module components/celebration/BadgeUnlock/BadgeAnimation
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import './BadgeAnimation.css';

/**
 * Rarity configurations matching Phase 20 BadgeShowcase
 */
const BADGE_RARITY = {
  common: {
    color: '#a8dadc',
    glow: 'rgba(168, 218, 220, 0.5)',
    particles: 20,
    animationDuration: 1500
  },
  uncommon: {
    color: '#2ecc71',
    glow: 'rgba(46, 204, 113, 0.5)',
    particles: 30,
    animationDuration: 1800
  },
  rare: {
    color: '#00d4ff',
    glow: 'rgba(0, 212, 255, 0.6)',
    particles: 40,
    animationDuration: 2000
  },
  epic: {
    color: '#8e44ad',
    glow: 'rgba(142, 68, 173, 0.6)',
    particles: 50,
    animationDuration: 2500
  },
  legendary: {
    color: '#f1c40f',
    glow: 'rgba(241, 196, 15, 0.7)',
    particles: 80,
    animationDuration: 3000
  }
};

/**
 * Generate particles around the badge
 */
const generateParticles = (count, color) => {
  const particles = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = 60 + Math.random() * 40;
    const size = 4 + Math.random() * 6;
    const delay = Math.random() * 0.5;
    const duration = 0.8 + Math.random() * 0.4;
    
    particles.push({
      id: i,
      style: {
        '--angle': `${angle}rad`,
        '--distance': `${distance}px`,
        '--size': `${size}px`,
        '--delay': `${delay}s`,
        '--duration': `${duration}s`,
        '--color': color
      }
    });
  }
  return particles;
};

/**
 * BadgeAnimation Component
 */
const BadgeAnimation = ({
  badge = {},
  isActive = false,
  onAnimationComplete,
  showParticles = true,
  showGlow = true,
  showRing = true,
  size = 'large', // small, medium, large
  className = '',
  ...props
}) => {
  const [animationPhase, setAnimationPhase] = useState('idle'); // idle, reveal, shimmer, complete
  const [particles, setParticles] = useState([]);
  const animationTimeoutRef = useRef(null);
  
  const {
    icon = '🏅',
    name = 'Badge',
    rarity = 'common'
  } = badge;
  
  const rarityConfig = BADGE_RARITY[rarity] || BADGE_RARITY.common;
  
  // Start animation sequence
  const startAnimation = useCallback(() => {
    setAnimationPhase('reveal');
    
    // Generate particles
    if (showParticles) {
      setParticles(generateParticles(rarityConfig.particles, rarityConfig.color));
    }
    
    // Phase 2: Shimmer
    animationTimeoutRef.current = setTimeout(() => {
      setAnimationPhase('shimmer');
      
      // Phase 3: Complete
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationPhase('complete');
        if (onAnimationComplete) {
          onAnimationComplete();
        }
      }, rarityConfig.animationDuration / 2);
    }, rarityConfig.animationDuration / 2);
  }, [rarityConfig, showParticles, onAnimationComplete]);
  
  // Handle activation
  useEffect(() => {
    if (isActive) {
      startAnimation();
    } else {
      setAnimationPhase('idle');
      setParticles([]);
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    }
    
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, [isActive, startAnimation]);
  
  const classNames = [
    'badge-animation',
    `badge-animation--${size}`,
    `badge-animation--${rarity}`,
    `badge-animation--${animationPhase}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      style={{
        '--rarity-color': rarityConfig.color,
        '--rarity-glow': rarityConfig.glow
      }}
      {...props}
    >
      {/* Glow Effect */}
      {showGlow && (
        <div className="badge-animation__glow" />
      )}
      
      {/* Ring Effect */}
      {showRing && (
        <>
          <div className="badge-animation__ring badge-animation__ring--1" />
          <div className="badge-animation__ring badge-animation__ring--2" />
          <div className="badge-animation__ring badge-animation__ring--3" />
        </>
      )}
      
      {/* Particles */}
      {showParticles && particles.length > 0 && (
        <div className="badge-animation__particles">
          {particles.map((particle) => (
            <span
              key={particle.id}
              className="badge-animation__particle"
              style={particle.style}
            />
          ))}
        </div>
      )}
      
      {/* Badge Container */}
      <div className="badge-animation__badge">
        <div className="badge-animation__badge-inner">
          <span className="badge-animation__icon">{icon}</span>
        </div>
        
        {/* Shine effect for legendary */}
        {rarity === 'legendary' && (
          <div className="badge-animation__shine" />
        )}
      </div>
      
      {/* Badge Name */}
      <div className="badge-animation__name">{name}</div>
      
      {/* Rarity Label */}
      <div className="badge-animation__rarity">
        {rarity.charAt(0).toUpperCase() + rarity.slice(1)}
      </div>
    </div>
  );
};

export { BADGE_RARITY };
export default BadgeAnimation;