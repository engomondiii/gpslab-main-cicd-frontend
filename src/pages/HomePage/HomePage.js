/**
 * GPS Lab Platform - HomePage Component
 * 
 * Landing page for unauthenticated users.
 * Includes hero section, features, navigation header.
 * 
 * Updated: Hero section now matches AuthLayout branding panel styling
 * with dark navy gradient and cyan/teal decorative circles.
 * 
 * @module pages/HomePage
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './HomePage.css';

/**
 * Feature cards data
 */
const FEATURES = [
  {
    id: 'stages',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
        <text x="12" y="16" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">B</text>
      </svg>
    ),
    title: 'Baraka Currency',
    description: 'Earn real rewards as you learn. Use Baraka for courses, mentorship, and exclusive content.'
  },
  {
    id: 'parties',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    title: 'Study Parties',
    description: 'Learn together with peers. Form groups, tackle challenges as a team, and earn bonus rewards.'
  },
  {
    id: 'navigator',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
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
 * Navigation links for header
 */
const NAV_LINKS = [
  { path: '/features', label: 'Features' },
  { path: '/pricing', label: 'Pricing' },
  { path: '/about', label: 'About' },
  { path: '/help', label: 'Help' }
];

/**
 * Adventure stages for journey section
 */
const ADVENTURES = [
  { name: 'Foundation', color: '#EF4444', stages: '1-5' },
  { name: 'Discovery', color: '#F97316', stages: '6-10' },
  { name: 'Growth', color: '#EAB308', stages: '11-15' },
  { name: 'Challenge', color: '#22C55E', stages: '16-20' },
  { name: 'Mastery', color: '#3B82F6', stages: '21-25' },
  { name: 'Innovation', color: '#6366F1', stages: '26-30' },
  { name: 'Leadership', color: '#8B5CF6', stages: '31-35' }
];

/**
 * Generate star positions for hero background
 */
const generateStars = (count = 30) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    delay: `${Math.random() * 3}s`
  }));
};

/**
 * HomePage Component
 */
const HomePage = ({ className = '' }) => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stars] = useState(() => generateStars(30));
  
  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Navigation handlers
  const handleGetStarted = () => {
    navigate('/register');
  };
  
  const handleLogin = () => {
    navigate('/login');
  };
  
  const handleLearnMore = () => {
    // Scroll to features section
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  const classNames = ['home-page', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames}>
      {/* Navigation Header */}
      <header className={`home-page__header ${isScrolled ? 'home-page__header--scrolled' : ''}`}>
        <div className="home-page__header-container">
          {/* Logo */}
          <Link to="/" className="home-page__header-logo">
            <svg viewBox="0 0 100 100" fill="none" className="home-page__header-logo-icon">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3"/>
              <path 
                d="M50 10L50 50L75 75" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="6" fill="currentColor"/>
            </svg>
            <span className="home-page__header-logo-text">GPS Lab</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="home-page__header-nav">
            {NAV_LINKS.map(link => (
              <Link 
                key={link.path} 
                to={link.path} 
                className="home-page__header-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          {/* Auth Buttons */}
          <div className="home-page__header-actions">
            <button
              type="button"
              onClick={handleLogin}
              className="home-page__header-btn home-page__header-btn--secondary"
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={handleGetStarted}
              className="home-page__header-btn home-page__header-btn--primary"
            >
              Get Started
            </button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="home-page__header-mobile-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 18L18 6M6 6l12 12"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16"/>
              </svg>
            )}
          </button>
        </div>
        
        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="home-page__mobile-menu">
            <nav className="home-page__mobile-nav">
              {NAV_LINKS.map(link => (
                <Link 
                  key={link.path} 
                  to={link.path} 
                  className="home-page__mobile-nav-link"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="home-page__mobile-actions">
              <button
                type="button"
                onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                className="home-page__mobile-btn"
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { handleGetStarted(); setMobileMenuOpen(false); }}
                className="home-page__mobile-btn home-page__mobile-btn--primary"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section - AuthLayout Style */}
      <section className="home-page__hero">
        {/* Background - Matching AuthLayout branding panel */}
        <div className="home-page__hero-bg">
          {/* Main gradient */}
          <div className="home-page__hero-gradient" />
          
          {/* Grid overlay */}
          <div className="home-page__hero-grid" />
          
          {/* Decorative circles - Matching AuthLayout */}
          <div className="home-page__hero-circle home-page__hero-circle--1" />
          <div className="home-page__hero-circle home-page__hero-circle--2" />
          <div className="home-page__hero-circle home-page__hero-circle--3" />
          <div className="home-page__hero-circle home-page__hero-circle--4" />
          
          {/* Twinkling stars */}
          {stars.map(star => (
            <div 
              key={star.id}
              className="home-page__hero-star"
              style={{
                left: star.left,
                top: star.top,
                animationDelay: star.delay
              }}
            />
          ))}
        </div>
        
        {/* Hero Content */}
        <div className="home-page__hero-content">
          {/* Animated Logo */}
          <div className="home-page__logo">
            <svg viewBox="0 0 100 100" fill="none">
              <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3"/>
              <path 
                className="home-page__logo-needle"
                d="M50 10L50 50L75 75" 
                stroke="currentColor" 
                strokeWidth="3" 
                strokeLinecap="round"
              />
              <circle cx="50" cy="50" r="6" fill="currentColor"/>
            </svg>
          </div>
          
          {/* Title */}
          <h1 className="home-page__title">
            <span className="home-page__title-line">Master Problem Solving with</span>
            <span className="home-page__title-gps">GPS</span>{' '}
            <span className="home-page__title-lab">Lab</span>
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
              onClick={handleGetStarted}
              className="home-page__cta-btn home-page__cta-btn--primary"
            >
              Get Started Free
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={handleLearnMore}
              className="home-page__cta-btn home-page__cta-btn--secondary"
            >
              Learn More
            </button>
          </div>
          
          {/* Stats */}
          <div className="home-page__stats">
            {STATS.map(stat => (
              <div key={stat.label} className="home-page__stat">
                <div className="home-page__stat-value">{stat.value}</div>
                <div className="home-page__stat-label">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="home-page__features">
        <div className="home-page__features-container">
          <div className="home-page__features-header">
            <h2 className="home-page__features-title">Why GPS Lab?</h2>
            <p className="home-page__features-subtitle">
              Our platform combines gamification, AI guidance, and real-world projects 
              to create an unmatched learning experience.
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
        </div>
      </section>
      
      {/* Journey Section */}
      <section className="home-page__journey">
        <div className="home-page__journey-container">
          <div className="home-page__journey-content">
            <h2 className="home-page__journey-title">Your Learning Journey</h2>
            <p className="home-page__journey-text">
              GPS Lab guides you through 7 adventures, each containing 5 stages. 
              From Foundation to Leadership, you'll develop skills that transform 
              how you approach any problem.
            </p>
            
            <div className="home-page__journey-stages">
              {ADVENTURES.map((adventure, index) => (
                <div 
                  key={adventure.name} 
                  className="home-page__journey-stage"
                  style={{ '--stage-color': adventure.color }}
                >
                  <span className="home-page__journey-stage-num">{index + 1}</span>
                  <span className="home-page__journey-stage-name">{adventure.name}</span>
                  <span className="home-page__journey-stage-range">Stages {adventure.stages}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* How It Works Section */}
      <section className="home-page__how-it-works">
        <div className="home-page__how-container">
          <h2 className="home-page__how-title">How It Works</h2>
          
          <div className="home-page__how-steps">
            <div className="home-page__how-step">
              <div className="home-page__how-step-num">1</div>
              <h3 className="home-page__how-step-title">Accept Missions</h3>
              <p className="home-page__how-step-desc">
                Choose from a variety of problem-solving missions tailored to your current skill level.
              </p>
            </div>
            
            <div className="home-page__how-step">
              <div className="home-page__how-step-num">2</div>
              <h3 className="home-page__how-step-title">Complete Bites</h3>
              <p className="home-page__how-step-desc">
                Break down missions into manageable bite-sized tasks and complete them step by step.
              </p>
            </div>
            
            <div className="home-page__how-step">
              <div className="home-page__how-step-num">3</div>
              <h3 className="home-page__how-step-title">Pass Checkpoints</h3>
              <p className="home-page__how-step-desc">
                Demonstrate your skills at checkpoints to advance to the next stage.
              </p>
            </div>
            
            <div className="home-page__how-step">
              <div className="home-page__how-step-num">4</div>
              <h3 className="home-page__how-step-title">Earn Rewards</h3>
              <p className="home-page__how-step-desc">
                Collect Baraka currency, badges, and level up as you progress through stages.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="home-page__final-cta">
        <div className="home-page__final-cta-container">
          <h2 className="home-page__final-cta-title">Ready to Begin?</h2>
          <p className="home-page__final-cta-text">
            Join thousands of learners already transforming their problem-solving abilities.
          </p>
          <div className="home-page__final-cta-buttons">
            <button
              type="button"
              onClick={handleGetStarted}
              className="home-page__final-cta-btn"
            >
              Start Your Journey
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>
            <button
              type="button"
              onClick={handleLogin}
              className="home-page__final-cta-btn home-page__final-cta-btn--secondary"
            >
              Already have an account? Sign In
            </button>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="home-page__footer">
        <div className="home-page__footer-container">
          <div className="home-page__footer-brand">
            <Link to="/" className="home-page__footer-logo">
              <svg viewBox="0 0 100 100" fill="none">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="3"/>
                <path d="M50 10L50 50L75 75" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="50" cy="50" r="6" fill="currentColor"/>
              </svg>
              <span>GPS Lab</span>
            </Link>
            <p className="home-page__footer-tagline">
              Transforming curious learners into confident problem solvers.
            </p>
          </div>
          
          <div className="home-page__footer-links">
            <div className="home-page__footer-column">
              <h4>Platform</h4>
              <Link to="/features">Features</Link>
              <Link to="/pricing">Pricing</Link>
              <Link to="/missions">Missions</Link>
              <Link to="/study">Study Forge</Link>
            </div>
            
            <div className="home-page__footer-column">
              <h4>Company</h4>
              <Link to="/about">About Us</Link>
              <Link to="/contact">Contact</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
            </div>
            
            <div className="home-page__footer-column">
              <h4>Support</h4>
              <Link to="/help">Help Center</Link>
              <Link to="/faq">FAQ</Link>
              <Link to="/community">Community</Link>
              <Link to="/feedback">Feedback</Link>
            </div>
            
            <div className="home-page__footer-column">
              <h4>Legal</h4>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
              <Link to="/cookies">Cookie Policy</Link>
            </div>
          </div>
          
          <div className="home-page__footer-bottom">
            <p>&copy; {new Date().getFullYear()} GPS Lab. All rights reserved.</p>
            <div className="home-page__footer-social">
              <a href="https://twitter.com/gpslab" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </a>
              <a href="https://github.com/gpslab" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a href="https://linkedin.com/company/gpslab" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;