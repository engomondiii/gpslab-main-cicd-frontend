/**
 * GPS Lab Platform - DashboardLayout Component
 * 
 * Dashboard layout with header, sidebar, and main content area.
 * Used for authenticated user pages.
 * 
 * UPDATED: GPS 101 Integration - Passes GPS 101 props to Sidebar
 * 
 * @module components/layout/DashboardLayout/DashboardLayout
 * @version 2.0.0
 */

import React, { useState, useCallback } from 'react';
import Header from '../Header/Header';
import Sidebar from '../Sidebar/Sidebar';
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs';
import './DashboardLayout.css';

const DashboardLayout = ({
  children,
  user,
  notifications = [],
  stats,
  wallets,
  breadcrumbs = [],
  currentPath = '/',
  showBreadcrumbs = true,
  currentLanguage = 'en',
  onLanguageChange,
  onLogout,
  onNotificationClick,
  pageTitle,
  pageActions,
  // GPS 101 Props
  gps101Enrolled = false,
  gps101CurrentStage = 1,
  gps101Progress = 0,
  gps101OrangeBeaconProgress = 0,
  className = '',
  ...props
}) => {
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  const handleMenuToggle = useCallback(() => {
    setSidebarOpen(prev => !prev);
  }, []);
  
  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);
  
  const handleSidebarToggle = useCallback(() => {
    setSidebarCollapsed(prev => !prev);
  }, []);
  
  const classNames = [
    'dashboard-layout',
    sidebarCollapsed && 'dashboard-layout--sidebar-collapsed',
    gps101Enrolled && 'dashboard-layout--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <Header
        variant="default"
        user={user}
        notifications={notifications}
        stats={stats}
        showTopBar={true}
        currentLanguage={currentLanguage}
        onLanguageChange={onLanguageChange}
        onLogout={onLogout}
        onNotificationClick={onNotificationClick}
        onMenuToggle={handleMenuToggle}
      />
      
      {/* Sidebar with GPS 101 Props */}
      <Sidebar
        isOpen={sidebarOpen}
        isCollapsed={sidebarCollapsed}
        onToggle={handleSidebarToggle}
        onClose={handleSidebarClose}
        user={user}
        stats={stats}
        wallets={wallets}
        currentPath={currentPath}
        // GPS 101 Props passed to Sidebar
        gps101Enrolled={gps101Enrolled}
        gps101CurrentStage={gps101CurrentStage}
        gps101Progress={gps101Progress}
        gps101OrangeBeaconProgress={gps101OrangeBeaconProgress}
      />
      
      {/* Main Content */}
      <main className="dashboard-layout__main">
        {/* Page Header */}
        {(showBreadcrumbs || pageTitle || pageActions) && (
          <div className="dashboard-layout__page-header">
            <div className="dashboard-layout__page-header-content">
              {showBreadcrumbs && breadcrumbs.length > 0 && (
                <Breadcrumbs items={breadcrumbs} />
              )}
              {pageTitle && (
                <h1 className="dashboard-layout__page-title">{pageTitle}</h1>
              )}
            </div>
            {pageActions && (
              <div className="dashboard-layout__page-actions">
                {pageActions}
              </div>
            )}
          </div>
        )}
        
        {/* Page Content */}
        <div className="dashboard-layout__content">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;