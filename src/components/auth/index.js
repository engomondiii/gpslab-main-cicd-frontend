/**
 * GPS Lab Platform - Auth Components Index
 * 
 * @module components/auth
 */

// Protected Route
export { default as ProtectedRoute, getRedirectAfterLogin, hasRole, hasAnyRole } from './ProtectedRoute/ProtectedRoute';

// Login Form
export { default as LoginForm, validateLoginForm } from './LoginForm/LoginForm';

// Register Form
export { default as RegisterForm, validateRegisterForm, checkPasswordStrength, PASSWORD_REQUIREMENTS } from './RegisterForm/RegisterForm';

// Forgot Password Form
export { default as ForgotPasswordForm } from './ForgotPasswordForm/ForgotPasswordForm';

// Reset Password Form
export { default as ResetPasswordForm } from './ResetPasswordForm/ResetPasswordForm';

// OAuth Buttons
export { default as OAuthButtons, GoogleLogin, AppleLogin } from './OAuthButtons/OAuthButtons';