/**
 * GPS Lab Platform - Sidebar Component
 * 
 * Main sidebar container with navigation, stats, and wallets.
 * 
 * @module components/layout/Sidebar/Sidebar
 * @version 1.0.0
 */

import React, { useState } from 'react';
import MainNav from './MainNav';
import QuickStats from './QuickStats';
import BarakaWallet from './BarakaWallet';
import PSBWallet from './PSBWallet';
import './Sidebar.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const SIDEBAR_VARIANTS = {
  DEFAULT: 'default',
  COMPACT: 'compact',
  EXPANDED: 'expanded'
};

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * Sidebar component
 * 
 * @param {Object} props - Component props
 * @param {string} [props.variant='default'] - Sidebar variant
 * @param {boolean} [props.isOpen=true] - Open state (for mobile)
 * @param {boolean} [props.isCollapsed=false] - Collapsed state (for desktop)
 * @param {Function} [props.onToggle] - Toggle handler
 * @param {Function} [props.onClose] - Close handler (mobile)
 * @param {Object} [props.user] - User data
 * @param {Object} [props.stats] - User stats
 * @param {Object} [props.wallets] - Wallet data
 * @param {string} [props.currentPath] - Current route path
 * @param {string} [props.className] - Additional CSS classes
 */
const Sidebar = ({
  variant = SIDEBAR_VARIANTS.DEFAULT,
  isOpen = true,
  isCollapsed = false,
  onToggle,
  onClose,
  user,
  stats,
  wallets,
  currentPath = '/',
  className = '',
  ...props
}) => {
  
  const [expandedSection, setExpandedSection] = useState(null);
  
  const handleSectionToggle = (sectionId) => {
    setExpandedSection(prev => prev === sectionId ? null : sectionId);
  };
  
  const classNames = [
    'sidebar',
    `sidebar--${variant}`,
    isOpen && 'sidebar--open',
    isCollapsed && 'sidebar--collapsed',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="sidebar__overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <aside className={classNames} {...props}>
        {/* Header */}
        <div className="sidebar__header">
          <a href="/" className="sidebar__logo">
            <div className="sidebar__logo-icon">
              <svg viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2"/>
                <path d="M20 8L20 20L28 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                <circle cx="20" cy="20" r="3" fill="currentColor"/>
              </svg>
            </div>
            {!isCollapsed && (
              <span className="sidebar__logo-text">
                <span className="sidebar__logo-gps">GPS</span>
                <span className="sidebar__logo-lab">Lab</span>
              </span>
            )}
          </a>
          
          {/* Collapse Toggle (Desktop) */}
          <button
            type="button"
            className="sidebar__collapse-btn"
            onClick={onToggle}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              {isCollapsed ? (
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
              ) : (
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
              )}
            </svg>
          </button>
          
          {/* Close Button (Mobile) */}
          <button
            type="button"
            className="sidebar__close-btn"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        </div>
        
        {/* Quick Stats */}
        {stats && !isCollapsed && (
          <QuickStats
            level={stats.level}
            xp={stats.xp}
            xpToNextLevel={stats.xpToNextLevel}
            currentStage={stats.currentStage}
            missionsCompleted={stats.missionsCompleted}
            streak={stats.streak}
          />
        )}
        
        {/* Main Navigation */}
        <MainNav
          currentPath={currentPath}
          isCollapsed={isCollapsed}
          expandedSection={expandedSection}
          onSectionToggle={handleSectionToggle}
        />
        
        {/* Wallets */}
        {wallets && !isCollapsed && (
          <div className="sidebar__wallets">
            <BarakaWallet
              balance={wallets.baraka?.balance || 0}
              pending={wallets.baraka?.pending || 0}
              tier={wallets.baraka?.tier}
            />
            <PSBWallet
              balance={wallets.psb?.balance || 0}
              invested={wallets.psb?.invested || 0}
            />
          </div>
        )}
        
        {/* Footer */}
        <div className="sidebar__footer">
          {!isCollapsed && (
            <div className="sidebar__footer-links">
              <a href="/help">Help</a>
              <a href="/terms">Terms</a>
              <a href="/privacy">Privacy</a>
            </div>
          )}
          <div className="sidebar__version">
            {isCollapsed ? 'v1' : 'v1.0.0'}
          </div>
        </div>
      </aside>
    </>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default Sidebar;