/**
 * GPS Lab Platform - AdminRoutes Component
 * 
 * Defines routes accessible only to admin users.
 * Includes user management, content management, system settings.
 * 
 * @module routes/AdminRoutes
 */

import React, { Suspense, lazy } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout/DashboardLayout';
import { RouteLoadingFallback, PlaceholderPage } from './PublicRoutes';
import './AdminRoutes.css';

// Lazy load admin pages
const AdminDashboard = lazy(() => import('../pages/AdminPage/AdminPage'));

/**
 * Admin route configuration
 */
export const ADMIN_ROUTES = [
  // Admin Dashboard
  {
    path: '/admin',
    element: 'AdminDashboard',
    title: 'Admin Dashboard',
    description: 'Platform administration',
    icon: 'admin',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [{ label: 'Admin', href: '/admin' }]
  },
  
  // User Management
  {
    path: '/admin/users',
    element: 'UserManagement',
    title: 'User Management',
    description: 'Manage platform users',
    icon: 'users',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users', href: '/admin/users' }
    ]
  },
  {
    path: '/admin/users/:userId',
    element: 'UserDetail',
    title: 'User Details',
    description: 'View user details',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Users', href: '/admin/users' },
      { label: 'User', href: '' }
    ]
  },
  
  // Mission Management
  {
    path: '/admin/missions',
    element: 'MissionManagement',
    title: 'Mission Management',
    description: 'Manage missions',
    icon: 'missions',
    requiredRoles: ['admin', 'super_admin', 'content_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Missions', href: '/admin/missions' }
    ]
  },
  {
    path: '/admin/missions/create',
    element: 'MissionEditor',
    title: 'Create Mission',
    description: 'Create new mission',
    requiredRoles: ['admin', 'super_admin', 'content_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Missions', href: '/admin/missions' },
      { label: 'Create', href: '/admin/missions/create' }
    ]
  },
  {
    path: '/admin/missions/:missionId/edit',
    element: 'MissionEditor',
    title: 'Edit Mission',
    description: 'Edit mission',
    requiredRoles: ['admin', 'super_admin', 'content_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Missions', href: '/admin/missions' },
      { label: 'Edit', href: '' }
    ]
  },
  
  // Stage Management
  {
    path: '/admin/stages',
    element: 'StageManagement',
    title: 'Stage Management',
    description: 'Manage 35 stages',
    icon: 'stages',
    requiredRoles: ['admin', 'super_admin', 'content_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Stages', href: '/admin/stages' }
    ]
  },
  
  // Content Management
  {
    path: '/admin/content',
    element: 'ContentManagement',
    title: 'Content Management',
    description: 'Manage platform content',
    icon: 'content',
    requiredRoles: ['admin', 'super_admin', 'content_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Content', href: '/admin/content' }
    ]
  },
  
  // GPO Management
  {
    path: '/admin/gpo',
    element: 'GPOManagement',
    title: 'GPO Management',
    description: 'Manage GPS Problem Opportunities',
    icon: 'gpo',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'GPO', href: '/admin/gpo' }
    ]
  },
  
  // University Management
  {
    path: '/admin/universities',
    element: 'UniversityManagement',
    title: 'University Management',
    description: 'Manage university partners',
    icon: 'university',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Universities', href: '/admin/universities' }
    ]
  },
  
  // Analytics
  {
    path: '/admin/analytics',
    element: 'AdminAnalytics',
    title: 'Analytics',
    description: 'Platform analytics',
    icon: 'analytics',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Analytics', href: '/admin/analytics' }
    ]
  },
  
  // Reports
  {
    path: '/admin/reports',
    element: 'AdminReports',
    title: 'Reports',
    description: 'Generate reports',
    icon: 'reports',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Reports', href: '/admin/reports' }
    ]
  },
  
  // System Settings
  {
    path: '/admin/settings',
    element: 'SystemSettings',
    title: 'System Settings',
    description: 'Platform settings',
    icon: 'settings',
    requiredRoles: ['super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Settings', href: '/admin/settings' }
    ]
  },
  
  // Baraka Economy
  {
    path: '/admin/baraka',
    element: 'BarakaManagement',
    title: 'Baraka Economy',
    description: 'Manage Baraka currency',
    icon: 'baraka',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Baraka', href: '/admin/baraka' }
    ]
  },
  
  // PSB Management
  {
    path: '/admin/psb',
    element: 'PSBManagement',
    title: 'PSB Management',
    description: 'Manage Problem Solving Bank',
    icon: 'psb',
    requiredRoles: ['admin', 'super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'PSB', href: '/admin/psb' }
    ]
  },
  
  // Audit Logs
  {
    path: '/admin/audit',
    element: 'AuditLogs',
    title: 'Audit Logs',
    description: 'View system audit logs',
    icon: 'audit',
    requiredRoles: ['super_admin'],
    breadcrumbs: [
      { label: 'Admin', href: '/admin' },
      { label: 'Audit', href: '/admin/audit' }
    ]
  }
];

/**
 * Get component for admin route element
 */
const getAdminRouteComponent = (elementName) => {
  const components = {
    AdminDashboard,
    // Placeholder for pages not yet implemented
    UserManagement: () => <PlaceholderPage title="User Management" />,
    UserDetail: () => <PlaceholderPage title="User Details" />,
    MissionManagement: () => <PlaceholderPage title="Mission Management" />,
    MissionEditor: () => <PlaceholderPage title="Mission Editor" />,
    StageManagement: () => <PlaceholderPage title="Stage Management" />,
    ContentManagement: () => <PlaceholderPage title="Content Management" />,
    GPOManagement: () => <PlaceholderPage title="GPO Management" />,
    UniversityManagement: () => <PlaceholderPage title="University Management" />,
    AdminAnalytics: () => <PlaceholderPage title="Analytics" />,
    AdminReports: () => <PlaceholderPage title="Reports" />,
    SystemSettings: () => <PlaceholderPage title="System Settings" />,
    BarakaManagement: () => <PlaceholderPage title="Baraka Economy" />,
    PSBManagement: () => <PlaceholderPage title="PSB Management" />,
    AuditLogs: () => <PlaceholderPage title="Audit Logs" />
  };
  
  return components[elementName] || (() => <PlaceholderPage title={elementName} />);
};

/**
 * AdminRoutes Component
 * 
 * Wraps routes with admin role check and admin layout.
 */
const AdminRoutes = ({
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
   * Build route elements with admin protection
   */
  const buildRouteElements = () => {
    return ADMIN_ROUTES.map(route => {
      const Component = getAdminRouteComponent(route.element);
      
      return {
        ...route,
        component: (
          <ProtectedRoute
            isAuthenticated={isAuthenticated}
            isLoading={isLoading}
            user={user}
            requiredRoles={route.requiredRoles}
            redirectTo="/login"
            showAccessDenied={true}
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
                <div className="admin-route">
                  <Component />
                </div>
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

export { getAdminRouteComponent };
export default AdminRoutes;