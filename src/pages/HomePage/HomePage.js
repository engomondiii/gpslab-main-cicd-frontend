/**
 * GPS Lab Platform - HomePage Component
 * 
 * Landing page for unauthenticated users.
 * 
 * @module pages/HomePage
 */

import React from 'react';
import './HomePage.css';

/**
 * Feature cards data
 */
const FEATURES = [
  {
    id: 'stages',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
      </svg>
    ),
    title: '35 Progressive Stages',
    description: 'Journey through carefully designed stages that build skills incrementally from beginner to mastery.'
  },
  {
    id: 'missions',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
      </svg>
    ),
    title: '875 Learning Tasks',
    description: 'Hands-on missions and bite-sized challenges designed to reinforce learning through practice.'
  },
  {
    id: 'baraka',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="10"/>
      </svg>
    ),
    title: 'Baraka Currency',
    description: 'Earn real rewards as you learn. Use Baraka for courses, mentorship, and exclusive content.'
  },
  {
    id: 'parties',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    title: 'Study Parties',
    description: 'Learn together with peers. Form groups, tackle challenges as a team, and earn bonus rewards.'
  },
  {
    id: 'navigator',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-5.5 17.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5z"/>
      </svg>
    ),
    title: 'AI Navigator',
    description: 'Your personal AI guide helps you stay on track with personalized recommendations and support.'
  },
  {
    id: 'psb',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/>
      </svg>
    ),
    title: 'Problem Solving Bank',
    description: 'Invest your Baraka to grow your balance. Watch your problem-solving capital multiply.'
  }
];

/**
 * Stats data
 */
const STATS = [
  { value: '35', label: 'Stages' },
  { value: '875', label: 'Tasks' },
  { value: '7', label: 'Adventures' },
  { value: '150K+', label: 'Learners' }
];

/**
 * HomePage Component
 */
const HomePage = ({
  onGetStarted,
  onLearnMore,
  onLogin,
  className = '',
  ...props
}) => {
  const classNames = ['home-page', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Hero Section */}
      <section className="home-page__hero">
        {/* Background */}
        <div className="home-page__hero-bg">
          <div className="home-page__hero-gradient" />
          <div className="home-page__hero-grid" />
          {[...Array(15)].map((_, i) => (
            <div 
              key={i}
              className="home-page__hero-star"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}
        </div>
        
        {/* Content */}
        <div className="home-page__hero-content">
          {/* Logo */}
          <div className="home-page__logo">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3"/>
              <path 
                d="M50 10L50 50L75 75" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
                className="home-page__logo-needle"
              />
              <circle cx="50" cy="50" r="6" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="home-page__title">
            <span className="home-page__title-line">Master Problem Solving with</span>
            <span className="home-page__title-brand">GPS Lab</span>
          </h1>
          
          {/* Subtitle */}
          <p className="home-page__subtitle">
            A gamified learning platform that transforms you from curious learner 
            to confident problem solver through 35 progressive stages.
          </p>
          
          {/* CTA Buttons */}
          <div className="home-page__cta">
            <button
              type="button"
              onClick={onGetStarted}
              className="home-page__cta-btn home-page__cta-btn--primary"
            >
              Get Started Free
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={onLearnMore}
              className="home-page__cta-btn home-page__cta-btn--secondary"
            >
              Learn More
            </button>
          </div>
          
          {/* Stats */}
          <div className="home-page__stats">
            {STATS.map(stat => (
              <div key={stat.label} className="home-page__stat">
                <span className="home-page__stat-value">{stat.value}</span>
                <span className="home-page__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="home-page__features">
        <div className="home-page__features-header">
          <h2 className="home-page__features-title">Why GPS Lab?</h2>
          <p className="home-page__features-subtitle">
            Everything you need to become a world-class problem solver
          </p>
        </div>
        
        <div className="home-page__features-grid">
          {FEATURES.map(feature => (
            <div key={feature.id} className="home-page__feature">
              <div className="home-page__feature-icon">
                {feature.icon}
              </div>
              <h3 className="home-page__feature-title">{feature.title}</h3>
              <p className="home-page__feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>
      
      {/* Journey Section */}
      <section className="home-page__journey">
        <div className="home-page__journey-content">
          <h2 className="home-page__journey-title">Your Learning Journey</h2>
          <p className="home-page__journey-text">
            GPS Lab guides you through 7 adventures, each containing 5 stages. 
            From Foundation to Leadership, you'll develop skills that transform 
            how you approach any problem.
          </p>
          
          <div className="home-page__journey-stages">
            {['Foundation', 'Discovery', 'Growth', 'Challenge', 'Mastery', 'Innovation', 'Leadership'].map((stage, index) => (
              <div key={stage} className="home-page__journey-stage">
                <span className="home-page__journey-stage-num">{index + 1}</span>
                <span className="home-page__journey-stage-name">{stage}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="home-page__final-cta">
        <h2 className="home-page__final-cta-title">Ready to Begin?</h2>
        <p className="home-page__final-cta-text">
          Join thousands of learners already transforming their problem-solving abilities.
        </p>
        <button
          type="button"
          onClick={onGetStarted}
          className="home-page__final-cta-btn"
        >
          Start Your Journey
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
          </svg>
        </button>
      </section>
    </div>
  );
};

export default HomePage;