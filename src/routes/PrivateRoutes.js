/**
 * GPS Lab Platform - PrivateRoutes Component
 * 
 * Defines routes requiring authentication.
 * Includes dashboard, missions, projects, profile, etc.
 * 
 * @module routes/PrivateRoutes
 */

import React, { Suspense, lazy } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout/DashboardLayout';
import { RouteLoadingFallback, PlaceholderPage } from './PublicRoutes';
import './PrivateRoutes.css';

// Lazy load pages for code splitting
const DashboardPage = lazy(() => import('../pages/DashboardPage/DashboardPage'));
const MissionsPage = lazy(() => import('../pages/MissionsPage/MissionsPage'));
const MissionDetailPage = lazy(() => import('../pages/MissionDetailPage/MissionDetailPage'));
const BiteBoardPage = lazy(() => import('../pages/BiteBoardPage/BiteBoardPage'));
const CheckpointPage = lazy(() => import('../pages/CheckpointPage/CheckpointPage'));
const StudyForgePage = lazy(() => import('../pages/StudyForgePage/StudyForgePage'));
const ProjectsPage = lazy(() => import('../pages/ProjectsPage/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage/ProjectDetailPage'));
const PartyPage = lazy(() => import('../pages/PartyPage/PartyPage'));
const PortfolioPage = lazy(() => import('../pages/PortfolioPage/PortfolioPage'));
const LeaderboardPage = lazy(() => import('../pages/LeaderboardPage/LeaderboardPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage/SettingsPage'));
const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage/SubscriptionPage'));
const MentorPage = lazy(() => import('../pages/MentorPage/MentorPage'));
const HelpPage = lazy(() => import('../pages/HelpPage/HelpPage'));

/**
 * Private route configuration
 */
export const PRIVATE_ROUTES = [
  // Dashboard
  {
    path: '/dashboard',
    element: 'DashboardPage',
    title: 'Dashboard',
    description: 'Your GPS Lab command center',
    icon: 'dashboard',
    showInNav: true,
    breadcrumbs: [{ label: 'Dashboard', href: '/dashboard' }]
  },
  
  // Training - Missions
  {
    path: '/missions',
    element: 'MissionsPage',
    title: 'Missions',
    description: 'Browse and accept missions',
    icon: 'missions',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Missions', href: '/missions' }
    ]
  },
  {
    path: '/missions/:missionId',
    element: 'MissionDetailPage',
    title: 'Mission Details',
    description: 'View mission details',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Missions', href: '/missions' },
      { label: 'Mission', href: '' }
    ]
  },
  {
    path: '/missions/:missionId/bites',
    element: 'BiteBoardPage',
    title: 'Bite Board',
    description: 'Manage mission bites',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Missions', href: '/missions' },
      { label: 'Bites', href: '' }
    ]
  },
  
  // Training - Checkpoints
  {
    path: '/checkpoints',
    element: 'CheckpointPage',
    title: 'Checkpoints',
    description: 'View checkpoint evaluations',
    icon: 'checkpoint',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Checkpoints', href: '/checkpoints' }
    ]
  },
  {
    path: '/checkpoints/:checkpointId',
    element: 'CheckpointPage',
    title: 'Checkpoint Arena',
    description: 'Complete checkpoint evaluation',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Checkpoints', href: '/checkpoints' },
      { label: 'Arena', href: '' }
    ]
  },
  
  // Training - Study
  {
    path: '/study',
    element: 'StudyForgePage',
    title: 'Study Forge',
    description: 'Access study materials',
    icon: 'study',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Study Forge', href: '/study' }
    ]
  },
  {
    path: '/study/:studyId',
    element: 'StudyForgePage',
    title: 'Study Mission',
    description: 'Complete study mission',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Study Forge', href: '/study' },
      { label: 'Study', href: '' }
    ]
  },
  
  // Projects
  {
    path: '/projects',
    element: 'ProjectsPage',
    title: 'Projects',
    description: 'Manage your projects',
    icon: 'projects',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' }
    ]
  },
  {
    path: '/projects/:projectId',
    element: 'ProjectDetailPage',
    title: 'Project Details',
    description: 'View project details',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' },
      { label: 'Project', href: '' }
    ]
  },
  {
    path: '/projects/gpo',
    element: 'ProjectsPage',
    title: 'GPO Projects',
    description: 'GPS Problem Opportunities',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Projects', href: '/projects' },
      { label: 'GPO', href: '/projects/gpo' }
    ]
  },
  
  // Community
  {
    path: '/parties',
    element: 'PartyPage',
    title: 'Study Parties',
    description: 'Join or create study parties',
    icon: 'party',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Parties', href: '/parties' }
    ]
  },
  {
    path: '/parties/:partyId',
    element: 'PartyPage',
    title: 'Party Details',
    description: 'View party details',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Parties', href: '/parties' },
      { label: 'Party', href: '' }
    ]
  },
  {
    path: '/mentors',
    element: 'MentorPage',
    title: 'Mentors',
    description: 'Connect with mentors',
    icon: 'mentor',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Mentors', href: '/mentors' }
    ]
  },
  
  // Progress & Recognition
  {
    path: '/portfolio',
    element: 'PortfolioPage',
    title: 'Portfolio',
    description: 'View your portfolio',
    icon: 'portfolio',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Portfolio', href: '/portfolio' }
    ]
  },
  {
    path: '/leaderboard',
    element: 'LeaderboardPage',
    title: 'Leaderboard',
    description: 'View rankings',
    icon: 'leaderboard',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Leaderboard', href: '/leaderboard' }
    ]
  },
  
  // User
  {
    path: '/profile',
    element: 'ProfilePage',
    title: 'Profile',
    description: 'Your profile',
    icon: 'profile',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Profile', href: '/profile' }
    ]
  },
  {
    path: '/profile/:userId',
    element: 'ProfilePage',
    title: 'User Profile',
    description: 'View user profile',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Profile', href: '' }
    ]
  },
  {
    path: '/settings',
    element: 'SettingsPage',
    title: 'Settings',
    description: 'Account settings',
    icon: 'settings',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/settings' }
    ]
  },
  {
    path: '/settings/:section',
    element: 'SettingsPage',
    title: 'Settings',
    description: 'Account settings',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Settings', href: '/settings' }
    ]
  },
  
  // Subscription & Marketplace
  {
    path: '/subscription',
    element: 'SubscriptionPage',
    title: 'Subscription',
    description: 'Manage subscription',
    icon: 'subscription',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Subscription', href: '/subscription' }
    ]
  },
  {
    path: '/marketplace',
    element: 'MarketplacePage',
    title: 'Marketplace',
    description: 'Browse marketplace',
    icon: 'marketplace',
    showInNav: true,
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Marketplace', href: '/marketplace' }
    ]
  },
  
  // Wallet
  {
    path: '/wallet',
    element: 'WalletPage',
    title: 'Wallet',
    description: 'Manage your wallets',
    icon: 'wallet',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Wallet', href: '/wallet' }
    ]
  },
  {
    path: '/wallet/baraka',
    element: 'BarakaWalletPage',
    title: 'Baraka Wallet',
    description: 'Baraka currency',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Wallet', href: '/wallet' },
      { label: 'Baraka', href: '/wallet/baraka' }
    ]
  },
  {
    path: '/wallet/psb',
    element: 'PSBWalletPage',
    title: 'PSB Account',
    description: 'Problem Solving Bank',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Wallet', href: '/wallet' },
      { label: 'PSB', href: '/wallet/psb' }
    ]
  },
  
  // Help
  {
    path: '/help',
    element: 'HelpPage',
    title: 'Help Center',
    description: 'Get help',
    icon: 'help',
    breadcrumbs: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Help', href: '/help' }
    ]
  }
];

/**
 * Get component for route element
 */
const getPrivateRouteComponent = (elementName) => {
  const components = {
    DashboardPage,
    MissionsPage,
    MissionDetailPage,
    BiteBoardPage,
    CheckpointPage,
    StudyForgePage,
    ProjectsPage,
    ProjectDetailPage,
    PartyPage,
    PortfolioPage,
    LeaderboardPage,
    ProfilePage,
    SettingsPage,
    SubscriptionPage,
    MentorPage,
    HelpPage,
    // Placeholder for pages not yet implemented
    MarketplacePage: () => <PlaceholderPage title="Marketplace" />,
    WalletPage: () => <PlaceholderPage title="Wallet" />,
    BarakaWalletPage: () => <PlaceholderPage title="Baraka Wallet" />,
    PSBWalletPage: () => <PlaceholderPage title="PSB Account" />
  };
  
  // Return placeholder if component not found
  return components[elementName] || (() => <PlaceholderPage title={elementName} />);
};

/**
 * PrivateRoutes Component
 * 
 * Wraps routes with authentication check and dashboard layout.
 */
const PrivateRoutes = ({
  user,
  isAuthenticated,
  isLoading,
  notifications,
  stats,
  wallets,
  currentLanguage,
  onLanguageChange,
  onLogout,
  onNotificationClick
}) => {
  
  /**
   * Build route elements with protection and layout
   */
  const buildRouteElements = () => {
    return PRIVATE_ROUTES.map(route => {
      const Component = getPrivateRouteComponent(route.element);
      
      return {
        ...route,
        component: (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            user={user}
            redirectTo="/login"
          >
            <Suspense fallback={<RouteLoadingFallback />}>
              <DashboardLayout
                user={user}
                notifications={notifications}
                stats={stats}
                wallets={wallets}
                breadcrumbs={route.breadcrumbs}
                currentPath={route.path}
                currentLanguage={currentLanguage}
                onLanguageChange={onLanguageChange}
                onLogout={onLogout}
                onNotificationClick={onNotificationClick}
                pageTitle={route.title}
              >
                <Component />
              </DashboardLayout>
            </Suspense>
          </ProtectedRoute>
        )
      };
    });
  };
  
  return {
    routes: buildRouteElements()
  };
};

export { getPrivateRouteComponent };
export default PrivateRoutes;