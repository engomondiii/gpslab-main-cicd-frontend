/**
 * GPS Lab Platform - UniversityRoutes Component
 * 
 * Defines routes for university portal.
 * Includes cohort management, student progress, reports.
 * 
 * @module routes/UniversityRoutes
 */

import React, { Suspense, lazy } from 'react';
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout/DashboardLayout';
import { RouteLoadingFallback, PlaceholderPage } from './PublicRoutes';
import './UniversityRoutes.css';

// Lazy load university pages
const UniversityPortalPage = lazy(() => import('../pages/UniversityPortalPage/UniversityPortalPage'));

/**
 * University route configuration
 */
export const UNIVERSITY_ROUTES = [
  // University Dashboard
  {
    path: '/university',
    element: 'UniversityDashboard',
    title: 'University Portal',
    description: 'University administration portal',
    icon: 'university',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [{ label: 'University', href: '/university' }]
  },
  
  // Cohort Management
  {
    path: '/university/cohorts',
    element: 'CohortList',
    title: 'Cohorts',
    description: 'Manage student cohorts',
    icon: 'cohorts',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Cohorts', href: '/university/cohorts' }
    ]
  },
  {
    path: '/university/cohorts/create',
    element: 'CohortCreate',
    title: 'Create Cohort',
    description: 'Create a new student cohort',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Cohorts', href: '/university/cohorts' },
      { label: 'Create', href: '/university/cohorts/create' }
    ]
  },
  {
    path: '/university/cohorts/:cohortId',
    element: 'CohortDetail',
    title: 'Cohort Details',
    description: 'View cohort details',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Cohorts', href: '/university/cohorts' },
      { label: 'Cohort', href: '' }
    ]
  },
  {
    path: '/university/cohorts/:cohortId/edit',
    element: 'CohortEdit',
    title: 'Edit Cohort',
    description: 'Edit cohort settings',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Cohorts', href: '/university/cohorts' },
      { label: 'Edit', href: '' }
    ]
  },
  
  // Student Management
  {
    path: '/university/students',
    element: 'StudentList',
    title: 'Students',
    description: 'View and manage students',
    icon: 'students',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Students', href: '/university/students' }
    ]
  },
  {
    path: '/university/students/:studentId',
    element: 'StudentDetail',
    title: 'Student Profile',
    description: 'View student progress',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Students', href: '/university/students' },
      { label: 'Student', href: '' }
    ]
  },
  {
    path: '/university/students/invite',
    element: 'StudentInvite',
    title: 'Invite Students',
    description: 'Invite students to cohort',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Students', href: '/university/students' },
      { label: 'Invite', href: '/university/students/invite' }
    ]
  },
  
  // Progress Tracking
  {
    path: '/university/progress',
    element: 'ProgressOverview',
    title: 'Progress Tracking',
    description: 'Track student progress',
    icon: 'progress',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Progress', href: '/university/progress' }
    ]
  },
  {
    path: '/university/progress/:cohortId',
    element: 'CohortProgress',
    title: 'Cohort Progress',
    description: 'View cohort progress',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Progress', href: '/university/progress' },
      { label: 'Cohort', href: '' }
    ]
  },
  
  // Analytics & Reports
  {
    path: '/university/analytics',
    element: 'UniversityAnalytics',
    title: 'Analytics',
    description: 'University analytics',
    icon: 'analytics',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Analytics', href: '/university/analytics' }
    ]
  },
  {
    path: '/university/reports',
    element: 'UniversityReports',
    title: 'Reports',
    description: 'Generate reports',
    icon: 'reports',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Reports', href: '/university/reports' }
    ]
  },
  {
    path: '/university/reports/generate',
    element: 'ReportGenerator',
    title: 'Generate Report',
    description: 'Create a new report',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Reports', href: '/university/reports' },
      { label: 'Generate', href: '/university/reports/generate' }
    ]
  },
  
  // Assignments & Missions
  {
    path: '/university/assignments',
    element: 'AssignmentList',
    title: 'Assignments',
    description: 'Manage assignments',
    icon: 'assignments',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Assignments', href: '/university/assignments' }
    ]
  },
  {
    path: '/university/assignments/create',
    element: 'AssignmentCreate',
    title: 'Create Assignment',
    description: 'Create new assignment',
    requiredRoles: ['university_admin', 'professor', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Assignments', href: '/university/assignments' },
      { label: 'Create', href: '/university/assignments/create' }
    ]
  },
  {
    path: '/university/assignments/:assignmentId',
    element: 'AssignmentDetail',
    title: 'Assignment Details',
    description: 'View assignment',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Assignments', href: '/university/assignments' },
      { label: 'Assignment', href: '' }
    ]
  },
  
  // Grading
  {
    path: '/university/grading',
    element: 'GradingQueue',
    title: 'Grading',
    description: 'Grade submissions',
    icon: 'grading',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Grading', href: '/university/grading' }
    ]
  },
  {
    path: '/university/grading/:submissionId',
    element: 'GradingDetail',
    title: 'Grade Submission',
    description: 'Grade student submission',
    requiredRoles: ['university_admin', 'professor', 'teaching_assistant', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Grading', href: '/university/grading' },
      { label: 'Submission', href: '' }
    ]
  },
  
  // Settings
  {
    path: '/university/settings',
    element: 'UniversitySettings',
    title: 'Settings',
    description: 'University settings',
    icon: 'settings',
    requiredRoles: ['university_admin', 'admin', 'super_admin'],
    breadcrumbs: [
      { label: 'University', href: '/university' },
      { label: 'Settings', href: '/university/settings' }
    ]
  }
];

/**
 * Get component for university route element
 */
const getUniversityRouteComponent = (elementName) => {
  const components = {
    UniversityDashboard: UniversityPortalPage,
    // Placeholder for pages not yet implemented
    CohortList: () => <PlaceholderPage title="Cohorts" />,
    CohortCreate: () => <PlaceholderPage title="Create Cohort" />,
    CohortDetail: () => <PlaceholderPage title="Cohort Details" />,
    CohortEdit: () => <PlaceholderPage title="Edit Cohort" />,
    StudentList: () => <PlaceholderPage title="Students" />,
    StudentDetail: () => <PlaceholderPage title="Student Profile" />,
    StudentInvite: () => <PlaceholderPage title="Invite Students" />,
    ProgressOverview: () => <PlaceholderPage title="Progress Tracking" />,
    CohortProgress: () => <PlaceholderPage title="Cohort Progress" />,
    UniversityAnalytics: () => <PlaceholderPage title="Analytics" />,
    UniversityReports: () => <PlaceholderPage title="Reports" />,
    ReportGenerator: () => <PlaceholderPage title="Generate Report" />,
    AssignmentList: () => <PlaceholderPage title="Assignments" />,
    AssignmentCreate: () => <PlaceholderPage title="Create Assignment" />,
    AssignmentDetail: () => <PlaceholderPage title="Assignment Details" />,
    GradingQueue: () => <PlaceholderPage title="Grading" />,
    GradingDetail: () => <PlaceholderPage title="Grade Submission" />,
    UniversitySettings: () => <PlaceholderPage title="University Settings" />
  };
  
  return components[elementName] || (() => <PlaceholderPage title={elementName} />);
};

/**
 * UniversityRoutes Component
 * 
 * Wraps routes with university role check and dashboard layout.
 */
const UniversityRoutes = ({
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
   * Build route elements with university protection
   */
  const buildRouteElements = () => {
    return UNIVERSITY_ROUTES.map(route => {
      const Component = getUniversityRouteComponent(route.element);
      
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
                <div className="university-route">
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

export { getUniversityRouteComponent };
export default UniversityRoutes;