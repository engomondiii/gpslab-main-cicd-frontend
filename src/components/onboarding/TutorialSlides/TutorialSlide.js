/**
 * GPS Lab Platform - TutorialSlide Component
 * 
 * Individual slide for the tutorial carousel.
 * 
 * @module components/onboarding/TutorialSlides/TutorialSlide
 */

import React from 'react';
import './TutorialSlide.css';

/**
 * Slide icon components
 */
const SlideIcons = {
  compass: (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3"/>
      <path d="M32 8v48M8 32h48" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
      <polygon points="32,12 36,32 32,52 28,32" fill="currentColor"/>
    </svg>
  ),
  stages: (
    <svg viewBox="0 0 64 64" fill="none">
      <path d="M12 52h8v-16h-8v16zM28 52h8V20h-8v32zM44 52h8V8h-8v44z" fill="currentColor"/>
    </svg>
  ),
  missions: (
    <svg viewBox="0 0 64 64" fill="none">
      <rect x="8" y="8" width="48" height="48" rx="4" stroke="currentColor" strokeWidth="3"/>
      <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  baraka: (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="3"/>
      <text x="32" y="42" textAnchor="middle" fill="currentColor" fontSize="28" fontWeight="bold">B</text>
    </svg>
  ),
  party: (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="20" cy="24" r="8" stroke="currentColor" strokeWidth="3"/>
      <circle cx="44" cy="24" r="8" stroke="currentColor" strokeWidth="3"/>
      <circle cx="32" cy="44" r="8" stroke="currentColor" strokeWidth="3"/>
      <path d="M26 28l6 12M38 28l-6 12" stroke="currentColor" strokeWidth="2"/>
    </svg>
  ),
  navigator: (
    <svg viewBox="0 0 64 64" fill="none">
      <circle cx="32" cy="20" r="12" stroke="currentColor" strokeWidth="3"/>
      <path d="M16 56c0-10 7-16 16-16s16 6 16 16" stroke="currentColor" strokeWidth="3"/>
      <circle cx="32" cy="20" r="4" fill="currentColor"/>
    </svg>
  )
};

/**
 * TutorialSlide Component
 */
const TutorialSlide = ({
  title,
  description,
  icon = 'compass',
  image,
  imageAlt,
  highlights = [],
  isActive = false,
  className = '',
  ...props
}) => {
  
  const IconComponent = SlideIcons[icon] || SlideIcons.compass;
  
  const classNames = [
    'tutorial-slide',
    isActive && 'tutorial-slide--active',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Visual */}
      <div className="tutorial-slide__visual">
        {image ? (
          <img 
            src={image} 
            alt={imageAlt || title}
            className="tutorial-slide__image"
          />
        ) : (
          <div className="tutorial-slide__icon">
            {IconComponent}
          </div>
        )}
        
        {/* Decorative Elements */}
        <div className="tutorial-slide__glow" />
        <div className="tutorial-slide__ring tutorial-slide__ring--1" />
        <div className="tutorial-slide__ring tutorial-slide__ring--2" />
      </div>
      
      {/* Content */}
      <div className="tutorial-slide__content">
        <h2 className="tutorial-slide__title">{title}</h2>
        <p className="tutorial-slide__description">{description}</p>
        
        {/* Highlights */}
        {highlights.length > 0 && (
          <ul className="tutorial-slide__highlights">
            {highlights.map((highlight, index) => (
              <li key={index} className="tutorial-slide__highlight">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export { SlideIcons };
export default TutorialSlide;