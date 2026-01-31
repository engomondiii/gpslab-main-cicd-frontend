/**
 * GPS Lab Platform - Header Component
 * 
 * Main header container that orchestrates TopBar, Navigation, and other header elements.
 * Integrates with the GPS Lab theme system and provides responsive behavior.
 * 
 * @module components/layout/Header/Header
 * @version 1.1.0
 * 
 * FIXED: Converted all <a href> to React Router <Link> components
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import TopBar from './TopBar';
import Navigation from './Navigation';
import UserMenu from './UserMenu';
import NotificationBell from './NotificationBell';
import LanguageSelector from './LanguageSelector';
import './Header.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const HEADER_VARIANTS = {
  DEFAULT: 'default',
  TRANSPARENT: 'transparent',
  MINIMAL: 'minimal'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Header component - Main application header
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Header style variant
 * @param {Object} [props.user] - Current user data
 * @param {Array} [props.notifications] - User notifications
 * @param {Function} [props.onMenuToggle] - Mobile menu toggle handler
 * @param {Function} [props.onLogout] - Logout handler
 * @param {Function} [props.onNotificationClick] - Notification click handler
 * @param {string} [props.currentLanguage='en'] - Current language code
 * @param {Function} [props.onLanguageChange] - Language change handler
 * @param {boolean} [props.showTopBar=true] - Show top bar with stats
 * @param {Object} [props.stats] - User stats for top bar (baraka, xp, level)
 * @param {string} [props.className] - Additional CSS classes
 */
const Header = ({
  variant = HEADER_VARIANTS.DEFAULT,
  user,
  notifications = [],
  onMenuToggle,
  onLogout,
  onNotificationClick,
  currentLanguage = 'en',
  onLanguageChange,
  showTopBar = true,
  stats,
  className = '',
  ...props
}) => {
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle mobile menu
  const handleMobileMenuToggle = useCallback(() => {
    setIsMobileMenuOpen(prev => !prev);
    onMenuToggle?.(!isMobileMenuOpen);
  }, [isMobileMenuOpen, onMenuToggle]);
  
  // Close mobile menu on navigation
  const handleNavigation = useCallback(() => {
    setIsMobileMenuOpen(false);
  }, []);
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.read).length;
  
  const classNames = [
    'header',
    `header--${variant}`,
    isScrolled && 'header--scrolled',
    isMobileMenuOpen && 'header--menu-open',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <header className={classNames} {...props}>
      {/* Top Bar with Stats (optional) */}
      {showTopBar && stats && (
        <TopBar
          baraka={stats.baraka}
          xp={stats.xp}
          level={stats.level}
          currentStage={stats.currentStage}
        />
      )}
      
      {/* Main Header Content */}
      <div className="header__main">
        <div className="header__container">
          {/* Logo - FIXED: Using Link instead of <a> */}
          <div className="header__logo">
            <Link to="/" className="header__logo-link">
              <div className="header__logo-icon">
                <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                  <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="20" cy="20" r="3" fill="currentColor"/>
                </svg>
              </div>
              <span className="header__logo-text">
                <span className="header__logo-gps">GPS</span>
                <span className="header__logo-lab">Lab</span>
              </span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <Navigation 
            className="header__nav header__nav--desktop"
            onNavigate={handleNavigation}
          />
          
          {/* Header Actions */}
          <div className="header__actions">
            {/* Language Selector */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onChange={onLanguageChange}
              className="header__action header__action--language"
            />
            
            {/* Notifications */}
            {user && (
              <NotificationBell
                notifications={notifications}
                unreadCount={unreadCount}
                onClick={onNotificationClick}
                className="header__action header__action--notifications"
              />
            )}
            
            {/* User Menu or Auth Links */}
            {user ? (
              <UserMenu
                user={user}
                onLogout={onLogout}
                className="header__action header__action--user"
              />
            ) : (
              <div className="header__auth">
                {/* FIXED: Using Link instead of <a> */}
                <Link to="/login" className="header__auth-link">Log In</Link>
                <Link to="/register" className="header__auth-btn">Sign Up</Link>
              </div>
            )}
            
            {/* Mobile Menu Toggle */}
            <button
              type="button"
              className="header__mobile-toggle"
              onClick={handleMobileMenuToggle}
              aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="header__mobile-toggle-icon">
                {isMobileMenuOpen ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 18L18 6M6 6l12 12"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={`header__mobile-nav ${isMobileMenuOpen ? 'header__mobile-nav--open' : ''}`}>
        <Navigation 
          variant="mobile"
          onNavigate={handleNavigation}
        />
        
        {/* Mobile Auth Links - FIXED: Using Link instead of <a> */}
        {!user && (
          <div className="header__mobile-auth">
            <Link to="/login" className="header__mobile-auth-link" onClick={handleNavigation}>
              Log In
            </Link>
            <Link to="/register" className="header__mobile-auth-btn" onClick={handleNavigation}>
              Sign Up Free
            </Link>
          </div>
        )}
      </div>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="header__overlay"
          onClick={handleMobileMenuToggle}
          aria-hidden="true"
        />
      )}
    </header>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Header;