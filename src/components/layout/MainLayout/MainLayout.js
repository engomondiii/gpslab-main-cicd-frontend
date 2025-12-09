/**
 * GPS Lab Platform - MainLayout Component
 * 
 * Main application layout with header and footer (no sidebar).
 * Used for public pages like landing, about, etc.
 * 
 * @module components/layout/MainLayout/MainLayout
 */

import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import './MainLayout.css';

const MainLayout = ({
  children,
  user,
  notifications = [],
  stats,
  showHeader = true,
  showFooter = true,
  showTopBar = false,
  headerVariant = 'default',
  footerVariant = 'default',
  currentLanguage = 'en',
  onLanguageChange,
  onLogout,
  onNotificationClick,
  className = '',
  ...props
}) => {
  
  const classNames = ['main-layout', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {showHeader && (
        <Header
          variant={headerVariant}
          user={user}
          notifications={notifications}
          stats={stats}
          showTopBar={showTopBar}
          currentLanguage={currentLanguage}
          onLanguageChange={onLanguageChange}
          onLogout={onLogout}
          onNotificationClick={onNotificationClick}
        />
      )}
      
      <main className="main-layout__content">
        {children}
      </main>
      
      {showFooter && (
        <Footer variant={footerVariant} />
      )}
    </div>
  );
};

export default MainLayout;