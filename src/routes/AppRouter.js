/**
 * App Router
 * * Main routing configuration for the application.
 */

import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import DashboardLayout from '../components/layout/DashboardLayout/DashboardLayout';

// Route Guards
import ProtectedRoute from '../components/auth/ProtectedRoute/ProtectedRoute';

// Loading Component
import LoadingOverlay from '../components/common/Loading/LoadingOverlay';

// Route Configs
import { PUBLIC_ROUTES, AUTHENTICATED_ROUTES } from '../config/routes.config';

// ==================== LAZY LOADED PAGES ====================

// Public Pages
const HomePage = lazy(() => import('../pages/HomePage/HomePage'));
const LoginPage = lazy(() => import('../pages/LoginPage/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/ForgotPasswordPage/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/ResetPasswordPage/ResetPasswordPage'));

// Dashboard
const DashboardPage = lazy(() => import('../pages/DashboardPage/DashboardPage'));

// Missions
const MissionsPage = lazy(() => import('../pages/MissionsPage/MissionsPage'));
const MissionDetailPage = lazy(() => import('../pages/MissionDetailPage/MissionDetailPage'));
const BiteBoardPage = lazy(() => import('../pages/BiteBoardPage/BiteBoardPage'));
const CheckpointPage = lazy(() => import('../pages/CheckpointPage/CheckpointPage'));

// Study
const StudyForgePage = lazy(() => import('../pages/StudyForgePage/StudyForgePage'));

// GPS 101 Pages (NEW)
const GPS101Page = lazy(() => import('../pages/GPS101/GPS101Page/GPS101Page'));
const GPS101StagePage = lazy(() => import('../pages/GPS101/GPS101StagePage/GPS101StagePage'));
const GPS101MissionPage = lazy(() => import('../pages/GPS101/GPS101MissionPage/GPS101MissionPage'));
const GPS101CheckpointPage = lazy(() => import('../pages/GPS101/GPS101CheckpointPage/GPS101CheckpointPage'));

// GPO Call
const GPOCallPage = lazy(() => import('../pages/GPOCallPage/GPOCallPage'));
const GPOCallSuccessPage = lazy(() => import('../pages/GPOCallPage/GPOCallSuccessPage'));

// Projects
const ProjectsPage = lazy(() => import('../pages/ProjectsPage/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('../pages/ProjectDetailPage/ProjectDetailPage'));

// Party
const PartyPage = lazy(() => import('../pages/PartyPage/PartyPage'));

// Portfolio
const PortfolioPage = lazy(() => import('../pages/PortfolioPage/PortfolioPage'));

// Profile
const ProfilePage = lazy(() => import('../pages/ProfilePage/ProfilePage'));

// Settings
const SettingsPage = lazy(() => import('../pages/SettingsPage/SettingsPage'));

// Leaderboard
const LeaderboardPage = lazy(() => import('../pages/LeaderboardPage/LeaderboardPage'));

// Subscription
const SubscriptionPage = lazy(() => import('../pages/SubscriptionPage/SubscriptionPage'));

// Mentor
const MentorPage = lazy(() => import('../pages/MentorPage/MentorPage'));

// Help
const HelpPage = lazy(() => import('../pages/HelpPage/HelpPage'));

// Admin
const AdminPage = lazy(() => import('../pages/AdminPage/AdminPage'));

// University
const UniversityPortalPage = lazy(() => import('../pages/UniversityPortalPage/UniversityPortalPage'));

// Error Pages
const NotFoundPage = lazy(() => import('../pages/NotFoundPage/NotFoundPage'));
const ErrorPage = lazy(() => import('../pages/ErrorPage/ErrorPage'));

/**
 * App Router Component
 */
const AppRouter = (props) => {
  // FIXED: Pull auth state from Redux AND sync it with local props to prevent loops
  const isReduxAuthenticated = useSelector((state) => state.auth?.isAuthenticated);
  const isAuthenticated = isReduxAuthenticated || props.isAuthenticated;
  const user = useSelector((state) => state.user?.currentUser) || props.user;

  // FIXED: Helper component to inject auth state into ProtectedRoute automatically
  const Protected = ({ children, ...routeProps }) => (
    <ProtectedRoute 
      isAuthenticated={isAuthenticated} 
      isLoading={props.isLoading} 
      user={user}
      {...routeProps}
    >
      {children}
    </ProtectedRoute>
  );

  return (
    <BrowserRouter>
      <Suspense fallback={<LoadingOverlay />}>
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          
          <Route
            path={PUBLIC_ROUTES.HOME}
            element={
              isAuthenticated ? <Navigate to={AUTHENTICATED_ROUTES.DASHBOARD} replace /> : <HomePage />
            }
          />

          <Route
            path={PUBLIC_ROUTES.LOGIN}
            element={
              isAuthenticated ? (
                <Navigate to={AUTHENTICATED_ROUTES.DASHBOARD} replace />
              ) : (
                <LoginPage onLogin={props.onLogin} onOAuthLogin={props.onOAuthLogin} />
              )
            }
          />

          <Route
            path={PUBLIC_ROUTES.REGISTER}
            element={
              isAuthenticated ? (
                <Navigate to={AUTHENTICATED_ROUTES.DASHBOARD} replace />
              ) : (
                <RegisterPage onRegister={props.onRegister} onOAuthLogin={props.onOAuthLogin} />
              )
            }
          />

          <Route path={PUBLIC_ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
          <Route path={PUBLIC_ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />

          {/* ==================== AUTHENTICATED ROUTES ==================== */}

          <Route path={AUTHENTICATED_ROUTES.DASHBOARD} element={
            <Protected>
              <DashboardLayout {...props}><DashboardPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.COMMAND_CENTER} element={
            <Protected>
              <Navigate to={AUTHENTICATED_ROUTES.DASHBOARD} replace />
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.MISSIONS} element={
            <Protected>
              <DashboardLayout {...props}><MissionsPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.MISSION_DETAIL} element={
            <Protected>
              <DashboardLayout {...props}><MissionDetailPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.BITE_BOARD} element={
            <Protected>
              <DashboardLayout {...props}><BiteBoardPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.CHECKPOINT} element={
            <Protected>
              <DashboardLayout {...props}><CheckpointPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.STUDY_FORGE} element={
            <Protected>
              <DashboardLayout {...props}><StudyForgePage /></DashboardLayout>
            </Protected>
          } />

          {/* ==================== GPS 101 ROUTES ==================== */}

          <Route path={AUTHENTICATED_ROUTES.GPS_101} element={
            <Protected>
              <DashboardLayout {...props}><GPS101Page /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.GPS_101_STAGE} element={
            <Protected requiresGPS101Enrollment>
              <DashboardLayout {...props}><GPS101StagePage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.GPS_101_MISSION} element={
            <Protected requiresGPS101Enrollment>
              <DashboardLayout {...props}><GPS101MissionPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.GPS_101_CHECKPOINT} element={
            <Protected requiresGPS101Enrollment>
              <DashboardLayout {...props}><GPS101CheckpointPage /></DashboardLayout>
            </Protected>
          } />

          {/* ==================== GPO CALL ROUTES ==================== */}

          <Route path={AUTHENTICATED_ROUTES.GPO_CALL} element={
            <Protected>
              <DashboardLayout {...props}><GPOCallPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.GPO_CALL_SUCCESS} element={
            <Protected>
              <DashboardLayout {...props}><GPOCallSuccessPage /></DashboardLayout>
            </Protected>
          } />

          {/* ==================== OTHER ROUTES ==================== */}

          <Route path={AUTHENTICATED_ROUTES.PROJECTS} element={
            <Protected>
              <DashboardLayout {...props}><ProjectsPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.PROJECT_DETAIL} element={
            <Protected>
              <DashboardLayout {...props}><ProjectDetailPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.PARTIES} element={
            <Protected>
              <DashboardLayout {...props}><PartyPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.PORTFOLIO} element={
            <Protected>
              <DashboardLayout {...props}><PortfolioPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.PROFILE} element={
            <Protected>
              <DashboardLayout {...props}><ProfilePage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.SETTINGS} element={
            <Protected>
              <DashboardLayout {...props}><SettingsPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.LEADERBOARD} element={
            <Protected>
              <DashboardLayout {...props}><LeaderboardPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.SUBSCRIPTION} element={
            <Protected>
              <DashboardLayout {...props}><SubscriptionPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.MENTORS} element={
            <Protected>
              <DashboardLayout {...props}><MentorPage /></DashboardLayout>
            </Protected>
          } />

          <Route path={AUTHENTICATED_ROUTES.HELP} element={
            <Protected>
              <DashboardLayout {...props}><HelpPage /></DashboardLayout>
            </Protected>
          } />

          <Route path="/admin/*" element={
            <Protected requiresAdmin>
              <DashboardLayout {...props}><AdminPage /></DashboardLayout>
            </Protected>
          } />

          <Route path="/university/*" element={
            <Protected requiresUniversity>
              <DashboardLayout {...props}><UniversityPortalPage /></DashboardLayout>
            </Protected>
          } />

          {/* ==================== ERROR ROUTES ==================== */}
          <Route path="*" element={<NotFoundPage />} />
          <Route path="/error" element={<ErrorPage />} />
          
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default AppRouter;