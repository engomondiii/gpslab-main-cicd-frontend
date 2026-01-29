/**
 * GPS Lab Platform - ProfileSettings Component
 * 
 * Complete settings interface combining privacy,
 * notifications, and account settings.
 * 
 * @module components/profile/ProfileSettings/ProfileSettings
 */

import React, { useState, useCallback } from 'react';
import PrivacySettings from './PrivacySettings';
import NotificationSettings from './NotificationSettings';
import './ProfileSettings.css';

/**
 * Settings tabs configuration
 */
const SETTINGS_TABS = [
  { id: 'privacy', label: 'Privacy', icon: '🔒' },
  { id: 'notifications', label: 'Notifications', icon: '🔔' },
  { id: 'account', label: 'Account', icon: '👤' },
  { id: 'appearance', label: 'Appearance', icon: '🎨' },
  { id: 'data', label: 'Data & Export', icon: '📊' }
];

/**
 * ProfileSettings Component
 */
const ProfileSettings = ({
  user = {},
  privacySettings = {},
  notificationSettings = {},
  onSavePrivacy,
  onSaveNotifications,
  onSaveAccount,
  onDeleteAccount,
  onExportData,
  isSaving = false,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('privacy');
  const [accountFormData, setAccountFormData] = useState({
    email: user.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [accountErrors, setAccountErrors] = useState({});
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const handleAccountChange = useCallback((field, value) => {
    setAccountFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setAccountErrors((prev) => ({ ...prev, [field]: null }));
  }, []);
  
  const handleSaveAccount = useCallback(() => {
    const errors = {};
    
    if (accountFormData.newPassword) {
      if (accountFormData.newPassword.length < 8) {
        errors.newPassword = 'Password must be at least 8 characters';
      }
      if (accountFormData.newPassword !== accountFormData.confirmPassword) {
        errors.confirmPassword = 'Passwords do not match';
      }
      if (!accountFormData.currentPassword) {
        errors.currentPassword = 'Current password is required';
      }
    }
    
    setAccountErrors(errors);
    
    if (Object.keys(errors).length === 0 && onSaveAccount) {
      onSaveAccount(accountFormData);
    }
  }, [accountFormData, onSaveAccount]);
  
  const handleDeleteAccount = useCallback(() => {
    if (onDeleteAccount) {
      onDeleteAccount();
    }
    setShowDeleteConfirm(false);
  }, [onDeleteAccount]);
  
  const classNames = [
    'profile-settings',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="profile-settings__header">
        <h2 className="profile-settings__title">
          <span className="profile-settings__title-icon">⚙️</span>
          Settings
        </h2>
        <p className="profile-settings__subtitle">
          Manage your account preferences and settings
        </p>
      </header>
      
      {/* Layout */}
      <div className="profile-settings__layout">
        {/* Sidebar Navigation */}
        <nav className="profile-settings__nav">
          {SETTINGS_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`profile-settings__nav-item ${activeTab === tab.id ? 'profile-settings__nav-item--active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="profile-settings__nav-icon">{tab.icon}</span>
              <span className="profile-settings__nav-label">{tab.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Content */}
        <div className="profile-settings__content">
          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <PrivacySettings
              initialSettings={privacySettings}
              onSave={onSavePrivacy}
              isSaving={isSaving}
            />
          )}
          
          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <NotificationSettings
              initialSettings={notificationSettings}
              onSave={onSaveNotifications}
              isSaving={isSaving}
            />
          )}
          
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="profile-settings__account">
              <header className="profile-settings__section-header">
                <h3 className="profile-settings__section-title">
                  <span className="profile-settings__section-icon">👤</span>
                  Account Settings
                </h3>
                <p className="profile-settings__section-subtitle">
                  Manage your email and password
                </p>
              </header>
              
              {/* Email Section */}
              <section className="profile-settings__section">
                <h4 className="profile-settings__field-title">Email Address</h4>
                <div className="profile-settings__field">
                  <input
                    type="email"
                    value={accountFormData.email}
                    onChange={(e) => handleAccountChange('email', e.target.value)}
                    placeholder="your@email.com"
                    className="profile-settings__input"
                  />
                </div>
              </section>
              
              {/* Password Section */}
              <section className="profile-settings__section">
                <h4 className="profile-settings__field-title">Change Password</h4>
                
                <div className="profile-settings__field">
                  <label className="profile-settings__label">Current Password</label>
                  <input
                    type="password"
                    value={accountFormData.currentPassword}
                    onChange={(e) => handleAccountChange('currentPassword', e.target.value)}
                    placeholder="Enter current password"
                    className={`profile-settings__input ${accountErrors.currentPassword ? 'profile-settings__input--error' : ''}`}
                  />
                  {accountErrors.currentPassword && (
                    <span className="profile-settings__error">{accountErrors.currentPassword}</span>
                  )}
                </div>
                
                <div className="profile-settings__field">
                  <label className="profile-settings__label">New Password</label>
                  <input
                    type="password"
                    value={accountFormData.newPassword}
                    onChange={(e) => handleAccountChange('newPassword', e.target.value)}
                    placeholder="Enter new password"
                    className={`profile-settings__input ${accountErrors.newPassword ? 'profile-settings__input--error' : ''}`}
                  />
                  {accountErrors.newPassword && (
                    <span className="profile-settings__error">{accountErrors.newPassword}</span>
                  )}
                </div>
                
                <div className="profile-settings__field">
                  <label className="profile-settings__label">Confirm New Password</label>
                  <input
                    type="password"
                    value={accountFormData.confirmPassword}
                    onChange={(e) => handleAccountChange('confirmPassword', e.target.value)}
                    placeholder="Confirm new password"
                    className={`profile-settings__input ${accountErrors.confirmPassword ? 'profile-settings__input--error' : ''}`}
                  />
                  {accountErrors.confirmPassword && (
                    <span className="profile-settings__error">{accountErrors.confirmPassword}</span>
                  )}
                </div>
                
                <button
                  type="button"
                  className="profile-settings__save-btn"
                  onClick={handleSaveAccount}
                  disabled={isSaving}
                >
                  {isSaving ? 'Saving...' : 'Update Account'}
                </button>
              </section>
              
              {/* Danger Zone */}
              <section className="profile-settings__section profile-settings__section--danger">
                <h4 className="profile-settings__field-title profile-settings__field-title--danger">
                  Danger Zone
                </h4>
                <p className="profile-settings__danger-text">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <button
                  type="button"
                  className="profile-settings__delete-btn"
                  onClick={() => setShowDeleteConfirm(true)}
                >
                  Delete Account
                </button>
              </section>
            </div>
          )}
          
          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="profile-settings__appearance">
              <header className="profile-settings__section-header">
                <h3 className="profile-settings__section-title">
                  <span className="profile-settings__section-icon">🎨</span>
                  Appearance
                </h3>
                <p className="profile-settings__section-subtitle">
                  Customize the look and feel
                </p>
              </header>
              
              <section className="profile-settings__section">
                <div className="profile-settings__theme-options">
                  <div className="profile-settings__theme-option profile-settings__theme-option--active">
                    <div className="profile-settings__theme-preview profile-settings__theme-preview--dark" />
                    <span>Dark Mode</span>
                  </div>
                  <div className="profile-settings__theme-option profile-settings__theme-option--disabled">
                    <div className="profile-settings__theme-preview profile-settings__theme-preview--light" />
                    <span>Light Mode (Coming Soon)</span>
                  </div>
                </div>
              </section>
              
              <section className="profile-settings__section">
                <h4 className="profile-settings__field-title">Accent Color</h4>
                <div className="profile-settings__color-options">
                  <button className="profile-settings__color-option profile-settings__color-option--cyan profile-settings__color-option--active" />
                  <button className="profile-settings__color-option profile-settings__color-option--purple" />
                  <button className="profile-settings__color-option profile-settings__color-option--green" />
                  <button className="profile-settings__color-option profile-settings__color-option--orange" />
                  <button className="profile-settings__color-option profile-settings__color-option--pink" />
                </div>
              </section>
            </div>
          )}
          
          {/* Data & Export Tab */}
          {activeTab === 'data' && (
            <div className="profile-settings__data">
              <header className="profile-settings__section-header">
                <h3 className="profile-settings__section-title">
                  <span className="profile-settings__section-icon">📊</span>
                  Data & Export
                </h3>
                <p className="profile-settings__section-subtitle">
                  Download and manage your data
                </p>
              </header>
              
              <section className="profile-settings__section">
                <h4 className="profile-settings__field-title">Export Your Data</h4>
                <p className="profile-settings__data-text">
                  Download a copy of all your data including progress, achievements, and portfolio entries.
                </p>
                <button
                  type="button"
                  className="profile-settings__export-btn"
                  onClick={onExportData}
                >
                  <span>📥</span> Export Data
                </button>
              </section>
              
              <section className="profile-settings__section">
                <h4 className="profile-settings__field-title">Data Included</h4>
                <ul className="profile-settings__data-list">
                  <li>Profile information</li>
                  <li>Progress and stage completion</li>
                  <li>Badges and achievements</li>
                  <li>Portfolio entries</li>
                  <li>Transaction history</li>
                  <li>Activity logs</li>
                </ul>
              </section>
            </div>
          )}
        </div>
      </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="profile-settings__modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="profile-settings__modal" onClick={(e) => e.stopPropagation()}>
            <h4 className="profile-settings__modal-title">Delete Account?</h4>
            <p className="profile-settings__modal-text">
              This action cannot be undone. All your data will be permanently deleted.
            </p>
            <div className="profile-settings__modal-actions">
              <button
                type="button"
                className="profile-settings__modal-cancel"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="profile-settings__modal-confirm"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export { SETTINGS_TABS };
export default ProfileSettings;