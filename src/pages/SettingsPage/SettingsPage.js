/**
 * GPS Lab Platform - SettingsPage Component
 * 
 * Main settings page integrating privacy, notifications,
 * and account settings.
 * 
 * @module pages/SettingsPage/SettingsPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import ProfileSettings from '../../components/profile/ProfileSettings/ProfileSettings';
import './SettingsPage.css';

/**
 * Mock user data
 */
const MOCK_USER = {
  id: 'user-001',
  displayName: 'GPS Explorer',
  username: 'gpsexplorer',
  email: 'explorer@gpslab.app'
};

/**
 * Mock privacy settings
 */
const MOCK_PRIVACY_SETTINGS = {
  profileVisibility: 'public',
  showOnlineStatus: true,
  showLocation: true,
  showStats: true,
  showBadges: true,
  activityVisibility: 'all',
  allowMessaging: true,
  allowPartyInvites: true,
  showInLeaderboards: true,
  allowSearchDiscovery: true,
  shareProgressWithParty: true
};

/**
 * Mock notification settings
 */
const MOCK_NOTIFICATION_SETTINGS = {
  stageComplete: { email: true, push: true, inApp: true },
  biteReminder: { email: false, push: true, inApp: true },
  streakWarning: { email: true, push: true, inApp: true },
  achievementUnlock: { email: true, push: true, inApp: true },
  praiseReceived: { email: false, push: true, inApp: true },
  partyInvite: { email: true, push: true, inApp: true },
  partyActivity: { email: false, push: false, inApp: true },
  newMessage: { email: true, push: true, inApp: true },
  mentions: { email: true, push: true, inApp: true },
  projectUpdate: { email: false, push: true, inApp: true },
  taskAssigned: { email: true, push: true, inApp: true },
  commentReply: { email: false, push: true, inApp: true },
  projectMilestone: { email: true, push: true, inApp: true },
  barakaEarned: { email: false, push: false, inApp: true },
  psbUpdates: { email: false, push: false, inApp: true },
  storeDeals: { email: true, push: false, inApp: true },
  withdrawalStatus: { email: true, push: true, inApp: true },
  newFeatures: { email: true, push: false, inApp: true },
  maintenance: { email: true, push: true, inApp: true },
  securityAlerts: { email: true, push: true, inApp: true },
  newsletter: { email: true, push: false, inApp: false }
};

/**
 * SettingsPage Component
 */
const SettingsPage = ({
  className = '',
  ...props
}) => {
  const [user, setUser] = useState(MOCK_USER);
  const [privacySettings, setPrivacySettings] = useState(MOCK_PRIVACY_SETTINGS);
  const [notificationSettings, setNotificationSettings] = useState(MOCK_NOTIFICATION_SETTINGS);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(null);
  
  // Fetch settings
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        // In production: const response = await api.getSettings();
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSettings();
  }, []);
  
  // Handle save privacy
  const handleSavePrivacy = useCallback(async (settings) => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production: await api.updatePrivacySettings(settings);
      setPrivacySettings(settings);
      setSaveSuccess('privacy');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to save privacy settings:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);
  
  // Handle save notifications
  const handleSaveNotifications = useCallback(async (settings) => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production: await api.updateNotificationSettings(settings);
      setNotificationSettings(settings);
      setSaveSuccess('notifications');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to save notification settings:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);
  
  // Handle save account
  const handleSaveAccount = useCallback(async (accountData) => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production: await api.updateAccount(accountData);
      setUser((prev) => ({
        ...prev,
        email: accountData.email
      }));
      setSaveSuccess('account');
      setTimeout(() => setSaveSuccess(null), 3000);
    } catch (error) {
      console.error('Failed to save account settings:', error);
    } finally {
      setIsSaving(false);
    }
  }, []);
  
  // Handle delete account
  const handleDeleteAccount = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // In production: await api.deleteAccount();
      // Redirect to goodbye page or home
      window.location.href = '/goodbye';
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  }, []);
  
  // Handle export data
  const handleExportData = useCallback(async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      // In production: const blob = await api.exportData();
      // Download file
      alert('Your data export has been prepared! Download will start shortly.');
    } catch (error) {
      console.error('Failed to export data:', error);
    }
  }, []);
  
  const classNames = [
    'settings-page',
    isLoading && 'settings-page--loading',
    className
  ].filter(Boolean).join(' ');
  
  if (isLoading) {
    return (
      <div className={classNames} {...props}>
        <div className="settings-page__loading">
          <div className="settings-page__spinner" />
          <p>Loading settings...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      <div className="settings-page__container">
        {/* Success Message */}
        {saveSuccess && (
          <div className="settings-page__success-message">
            <span className="settings-page__success-icon">✓</span>
            Settings saved successfully!
          </div>
        )}
        
        <ProfileSettings
          user={user}
          privacySettings={privacySettings}
          notificationSettings={notificationSettings}
          onSavePrivacy={handleSavePrivacy}
          onSaveNotifications={handleSaveNotifications}
          onSaveAccount={handleSaveAccount}
          onDeleteAccount={handleDeleteAccount}
          onExportData={handleExportData}
          isSaving={isSaving}
        />
      </div>
    </div>
  );
};

export default SettingsPage;