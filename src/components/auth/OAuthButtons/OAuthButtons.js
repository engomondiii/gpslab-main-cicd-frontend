/**
 * GPS Lab Platform - OAuthButtons Component
 * 
 * Combined OAuth login buttons with divider.
 * 
 * @module components/auth/OAuthButtons/OAuthButtons
 */

import React from 'react';
import GoogleLogin from './GoogleLogin';
import AppleLogin from './AppleLogin';
import './OAuthButtons.css';

/**
 * OAuthButtons Component
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onOAuthLogin - OAuth login handler
 * @param {boolean} props.isLoading - Loading state
 * @param {string} props.loadingProvider - Currently loading provider
 * @param {boolean} props.showGoogle - Show Google button
 * @param {boolean} props.showApple - Show Apple button
 * @param {boolean} props.showDivider - Show divider
 * @param {string} props.dividerText - Divider text
 * @param {string} props.variant - Button variant
 */
const OAuthButtons = ({
  onOAuthLogin,
  isLoading = false,
  loadingProvider = null,
  showGoogle = true,
  showApple = true,
  showDivider = true,
  dividerText = 'or continue with email',
  variant = 'default',
  className = '',
  ...props
}) => {
  
  const handleLogin = (provider) => {
    if (onOAuthLogin) {
      onOAuthLogin(provider);
    }
  };
  
  const classNames = ['oauth-buttons', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="oauth-buttons__list">
        {showGoogle && (
          <GoogleLogin
            onLogin={handleLogin}
            isLoading={isLoading && loadingProvider === 'google'}
            disabled={isLoading && loadingProvider !== 'google'}
            variant={variant}
          />
        )}
        
        {showApple && (
          <AppleLogin
            onLogin={handleLogin}
            isLoading={isLoading && loadingProvider === 'apple'}
            disabled={isLoading && loadingProvider !== 'apple'}
            variant={variant}
          />
        )}
      </div>
      
      {showDivider && (
        <div className="oauth-buttons__divider">
          <span className="oauth-buttons__divider-line" />
          <span className="oauth-buttons__divider-text">{dividerText}</span>
          <span className="oauth-buttons__divider-line" />
        </div>
      )}
    </div>
  );
};

export { GoogleLogin, AppleLogin };
export default OAuthButtons;