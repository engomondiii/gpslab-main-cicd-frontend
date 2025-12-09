/**
 * GPS Lab Platform - TutorialSlides Component
 * 
 * Carousel of tutorial slides for onboarding.
 * 
 * @module components/onboarding/TutorialSlides/TutorialSlides
 */

import React, { useState, useCallback, useEffect } from 'react';
import TutorialSlide from './TutorialSlide';
import './TutorialSlides.css';

/**
 * Default tutorial slides content
 */
const DEFAULT_SLIDES = [
  {
    id: 'stages',
    icon: 'stages',
    title: '35 Progressive Stages',
    description: 'Your journey is divided into 35 carefully designed stages. Each stage builds on the previous one, taking you from foundational skills to advanced problem-solving mastery.',
    highlights: [
      '7 Adventures containing 5 stages each',
      'Unlock new abilities as you progress',
      'Stage gates ensure you\'re ready to advance'
    ]
  },
  {
    id: 'missions',
    icon: 'missions',
    title: 'Complete Missions',
    description: 'Every stage contains missions - hands-on challenges that teach through doing. Missions are broken into bite-sized tasks that you can tackle at your own pace.',
    highlights: [
      '875 total learning tasks across all stages',
      'Recursive study loops for deep learning',
      'Real-world problems to solve'
    ]
  },
  {
    id: 'baraka',
    icon: 'baraka',
    title: 'Earn Baraka Currency',
    description: 'Baraka is the reward currency of GPS Lab. Earn it by completing missions, helping others, and achieving milestones. Use it for real rewards!',
    highlights: [
      '6 tier progression: Yellow → Black',
      'Invest in the Problem Solving Bank',
      'Redeem for courses, mentorship, and more'
    ]
  },
  {
    id: 'party',
    icon: 'party',
    title: 'Join Study Parties',
    description: 'Learning is better together! Join or create study parties to collaborate with fellow problem solvers. Tackle challenges as a team and earn bonus rewards.',
    highlights: [
      'Form groups of 2-8 members',
      'Collaborate on complex problems',
      'Earn party bonus Baraka'
    ]
  },
  {
    id: 'navigator',
    icon: 'navigator',
    title: 'Your AI Navigator',
    description: 'Meet your personal AI guide - the Navigator. It will help you stay on track, suggest next steps, and provide encouragement throughout your journey.',
    highlights: [
      'Personalized learning recommendations',
      'Progress insights and tips',
      'Available 24/7 to help you succeed'
    ]
  }
];

/**
 * TutorialSlides Component
 */
const TutorialSlides = ({
  slides = DEFAULT_SLIDES,
  onComplete,
  onSkip,
  autoPlay = false,
  autoPlayInterval = 5000,
  showSkip = true,
  className = '',
  ...props
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  
  const totalSlides = slides.length;
  const isLastSlide = currentIndex === totalSlides - 1;
  
  /**
   * Go to next slide
   */
  const nextSlide = useCallback(() => {
    if (isLastSlide) {
      onComplete?.();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  }, [isLastSlide, onComplete]);
  
  /**
   * Go to previous slide
   */
  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  }, []);
  
  /**
   * Go to specific slide
   */
  const goToSlide = useCallback((index) => {
    setCurrentIndex(index);
  }, []);
  
  /**
   * Handle skip
   */
  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);
  
  /**
   * Auto-play effect
   */
  useEffect(() => {
    if (!autoPlay || isPaused || isLastSlide) return;
    
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, isPaused, isLastSlide, nextSlide, autoPlayInterval]);
  
  /**
   * Keyboard navigation
   */
  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          nextSlide();
          break;
        case 'ArrowLeft':
          prevSlide();
          break;
        case 'Escape':
          handleSkip();
          break;
        default:
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide, handleSkip]);
  
  const classNames = ['tutorial-slides', className].filter(Boolean).join(' ');
  
  return (
    <div 
      className={classNames}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      {...props}
    >
      {/* Skip Button */}
      {showSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="tutorial-slides__skip"
        >
          Skip Tutorial
        </button>
      )}
      
      {/* Slides Container */}
      <div className="tutorial-slides__container">
        {slides.map((slide, index) => (
          <TutorialSlide
            key={slide.id || index}
            {...slide}
            isActive={index === currentIndex}
          />
        ))}
      </div>
      
      {/* Navigation */}
      <div className="tutorial-slides__nav">
        {/* Previous Button */}
        <button
          type="button"
          onClick={prevSlide}
          disabled={currentIndex === 0}
          className="tutorial-slides__nav-btn tutorial-slides__nav-btn--prev"
          aria-label="Previous slide"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        </button>
        
        {/* Dots */}
        <div className="tutorial-slides__dots">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goToSlide(index)}
              className={`tutorial-slides__dot ${index === currentIndex ? 'tutorial-slides__dot--active' : ''}`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
        {/* Next/Complete Button */}
        <button
          type="button"
          onClick={nextSlide}
          className={`tutorial-slides__nav-btn tutorial-slides__nav-btn--next ${isLastSlide ? 'tutorial-slides__nav-btn--complete' : ''}`}
        >
          {isLastSlide ? (
            <>
              <span>Get Started</span>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
            </>
          ) : (
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
            </svg>
          )}
        </button>
      </div>
      
      {/* Progress Bar */}
      <div className="tutorial-slides__progress">
        <div 
          className="tutorial-slides__progress-bar"
          style={{ width: `${((currentIndex + 1) / totalSlides) * 100}%` }}
        />
      </div>
    </div>
  );
};

export { DEFAULT_SLIDES };
export default TutorialSlides;