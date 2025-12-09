/**
 * GPS Lab Platform - MissionCelebration Component
 * 
 * Animated celebration overlay for mission completion.
 * 
 * @module components/mission/MissionCompletion/MissionCelebration
 */

import React, { useEffect, useState } from 'react';
import './MissionCelebration.css';

const CONFETTI_COLORS = ['#00d4ff', '#2a9d8f', '#f1c40f', '#ff6b6b', '#9b59b6'];

const MissionCelebration = ({
  isActive = false,
  duration = 3000,
  particleCount = 50,
  onComplete,
  className = '',
  ...props
}) => {
  const [particles, setParticles] = useState([]);
  
  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 0.5,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360
      }));
      setParticles(newParticles);
      
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isActive, particleCount, duration, onComplete]);
  
  if (!isActive && particles.length === 0) return null;
  
  return (
    <div className={`mission-celebration ${className}`} {...props}>
      {/* Confetti */}
      {particles.map(p => (
        <div
          key={p.id}
          className="mission-celebration__particle"
          style={{
            left: `${p.x}%`,
            animationDelay: `${p.delay}s`,
            backgroundColor: p.color,
            width: `${p.size}px`,
            height: `${p.size}px`,
            transform: `rotate(${p.rotation}deg)`
          }}
        />
      ))}
      
      {/* Center Burst */}
      <div className="mission-celebration__burst">
        <svg viewBox="0 0 100 100" className="mission-celebration__star">
          <polygon points="50,0 61,35 98,35 68,57 79,91 50,70 21,91 32,57 2,35 39,35" fill="currentColor"/>
        </svg>
      </div>
      
      {/* Rings */}
      <div className="mission-celebration__rings">
        <div className="mission-celebration__ring mission-celebration__ring--1" />
        <div className="mission-celebration__ring mission-celebration__ring--2" />
        <div className="mission-celebration__ring mission-celebration__ring--3" />
      </div>
    </div>
  );
};

export default MissionCelebration;