/**
 * GPS Lab Platform - PrivacySettings Component
 * 
 * Privacy controls for profile visibility,
 * data sharing, and activity tracking.
 * 
 * @module components/profile/ProfileSettings/PrivacySettings
 */

import React, { useState, useCallback, useEffect } from 'react';
import './PrivacySettings.css';

/**
 * Privacy setting options
 */
const PRIVACY_OPTIONS = {
  profileVisibility: [
    { value: 'public', label: 'Public', description: 'Anyone can view your profile' },
    { value: 'members', label: 'Members Only', description: 'Only GPS Lab members can view' },
    { value: 'private', label: 'Private', description: 'Only you can view your profile' }
  ],
  activityVisibility: [
    { value: 'all', label: 'Show All', description: 'All activity visible' },
    { value: 'achievements', label: 'Achievements Only', description: 'Only show achievements' },
    { value: 'none', label: 'Hide All', description: 'Hide all activity' }
  ]
};

/**
 * Default privacy settings
 */
const DEFAULT_SETTINGS = {
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
 * PrivacySettings Component
 */
const PrivacySettings = ({
  initialSettings = {},
  onSave,
  onCancel,
  isSaving = false,
  className = '',
  ...props
}) => {
  const [settings, setSettings] = useState({
    ...DEFAULT_SETTINGS,
    ...initialSettings
  });
  const [isDirty, setIsDirty] = useState(false);
  
  // Update when initial settings change
  useEffect(() => {
    setSettings((prev) => ({ ...prev, ...initialSettings }));
  }, [initialSettings]);
  
  // Handle setting change
  const handleChange = useCallback((key, value) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value
    }));
    setIsDirty(true);
  }, []);
  
  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(settings);
    }
    setIsDirty(false);
  }, [onSave, settings]);
  
  const classNames = [
    'privacy-settings',
    isSaving && 'privacy-settings--saving',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <header className="privacy-settings__header">
        <h3 className="privacy-settings__title">
          <span className="privacy-settings__title-icon">🔒</span>
          Privacy Settings
        </h3>
        <p className="privacy-settings__subtitle">
          Control who can see your profile and activity
        </p>
      </header>
      
      {/* Profile Visibility */}
      <section className="privacy-settings__section">
        <h4 className="privacy-settings__section-title">Profile Visibility</h4>
        
        <div className="privacy-settings__option-group">
          {PRIVACY_OPTIONS.profileVisibility.map((option) => (
            <label
              key={option.value}
              className={`privacy-settings__radio-option ${settings.profileVisibility === option.value ? 'privacy-settings__radio-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="profileVisibility"
                value={option.value}
                checked={settings.profileVisibility === option.value}
                onChange={(e) => handleChange('profileVisibility', e.target.value)}
              />
              <span className="privacy-settings__radio-indicator" />
              <div className="privacy-settings__radio-content">
                <span className="privacy-settings__radio-label">{option.label}</span>
                <span className="privacy-settings__radio-desc">{option.description}</span>
              </div>
            </label>
          ))}
        </div>
      </section>
      
      {/* Profile Elements */}
      <section className="privacy-settings__section">
        <h4 className="privacy-settings__section-title">Show on Profile</h4>
        
        <div className="privacy-settings__toggles">
          <SettingToggle
            label="Online Status"
            description="Show when you're active"
            icon="🟢"
            checked={settings.showOnlineStatus}
            onChange={(v) => handleChange('showOnlineStatus', v)}
          />
          
          <SettingToggle
            label="Location"
            description="Display your location"
            icon="📍"
            checked={settings.showLocation}
            onChange={(v) => handleChange('showLocation', v)}
          />
          
          <SettingToggle
            label="Statistics"
            description="Show your progress stats"
            icon="📊"
            checked={settings.showStats}
            onChange={(v) => handleChange('showStats', v)}
          />
          
          <SettingToggle
            label="Badges"
            description="Display earned badges"
            icon="🎖️"
            checked={settings.showBadges}
            onChange={(v) => handleChange('showBadges', v)}
          />
        </div>
      </section>
      
      {/* Activity Visibility */}
      <section className="privacy-settings__section">
        <h4 className="privacy-settings__section-title">Activity Visibility</h4>
        
        <div className="privacy-settings__option-group">
          {PRIVACY_OPTIONS.activityVisibility.map((option) => (
            <label
              key={option.value}
              className={`privacy-settings__radio-option ${settings.activityVisibility === option.value ? 'privacy-settings__radio-option--selected' : ''}`}
            >
              <input
                type="radio"
                name="activityVisibility"
                value={option.value}
                checked={settings.activityVisibility === option.value}
                onChange={(e) => handleChange('activityVisibility', e.target.value)}
              />
              <span className="privacy-settings__radio-indicator" />
              <div className="privacy-settings__radio-content">
                <span className="privacy-settings__radio-label">{option.label}</span>
                <span className="privacy-settings__radio-desc">{option.description}</span>
              </div>
            </label>
          ))}
        </div>
      </section>
      
      {/* Social Settings */}
      <section className="privacy-settings__section">
        <h4 className="privacy-settings__section-title">Social & Discovery</h4>
        
        <div className="privacy-settings__toggles">
          <SettingToggle
            label="Allow Messaging"
            description="Let others send you messages"
            icon="💬"
            checked={settings.allowMessaging}
            onChange={(v) => handleChange('allowMessaging', v)}
          />
          
          <SettingToggle
            label="Party Invites"
            description="Allow party invitations"
            icon="🎉"
            checked={settings.allowPartyInvites}
            onChange={(v) => handleChange('allowPartyInvites', v)}
          />
          
          <SettingToggle
            label="Leaderboards"
            description="Appear in public leaderboards"
            icon="🏆"
            checked={settings.showInLeaderboards}
            onChange={(v) => handleChange('showInLeaderboards', v)}
          />
          
          <SettingToggle
            label="Search Discovery"
            description="Allow profile to be found via search"
            icon="🔍"
            checked={settings.allowSearchDiscovery}
            onChange={(v) => handleChange('allowSearchDiscovery', v)}
          />
          
          <SettingToggle
            label="Party Progress Sharing"
            description="Share your progress with party members"
            icon="👥"
            checked={settings.shareProgressWithParty}
            onChange={(v) => handleChange('shareProgressWithParty', v)}
          />
        </div>
      </section>
      
      {/* Actions */}
      <div className="privacy-settings__actions">
        {onCancel && (
          <button
            type="button"
            className="privacy-settings__cancel-btn"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className="privacy-settings__save-btn"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? (
            <>
              <span className="privacy-settings__spinner" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </div>
  );
};

/**
 * SettingToggle Component
 */
const SettingToggle = ({
  label,
  description,
  icon,
  checked,
  onChange,
  disabled = false
}) => {
  return (
    <label className={`privacy-settings__toggle ${disabled ? 'privacy-settings__toggle--disabled' : ''}`}>
      <div className="privacy-settings__toggle-info">
        <span className="privacy-settings__toggle-icon">{icon}</span>
        <div className="privacy-settings__toggle-text">
          <span className="privacy-settings__toggle-label">{label}</span>
          <span className="privacy-settings__toggle-desc">{description}</span>
        </div>
      </div>
      <div className="privacy-settings__toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="privacy-settings__toggle-slider" />
      </div>
    </label>
  );
};

export { DEFAULT_SETTINGS, PRIVACY_OPTIONS };
export default PrivacySettings;