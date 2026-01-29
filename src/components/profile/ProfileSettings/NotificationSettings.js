/**
 * GPS Lab Platform - NotificationSettings Component
 * 
 * Notification preferences for email, push,
 * and in-app notifications.
 * 
 * @module components/profile/ProfileSettings/NotificationSettings
 */

import React, { useState, useCallback, useEffect } from 'react';
import './NotificationSettings.css';

/**
 * Notification categories
 */
const NOTIFICATION_CATEGORIES = [
  {
    id: 'progress',
    title: 'Progress & Learning',
    icon: '📈',
    settings: [
      { id: 'stageComplete', label: 'Stage Completion', description: 'When you complete a stage' },
      { id: 'biteReminder', label: 'Daily Bite Reminder', description: 'Remind me to complete daily bites' },
      { id: 'streakWarning', label: 'Streak Warning', description: 'Warning before losing streak' },
      { id: 'achievementUnlock', label: 'Achievement Unlocked', description: 'When you earn a new badge' }
    ]
  },
  {
    id: 'social',
    title: 'Social & Community',
    icon: '👥',
    settings: [
      { id: 'praiseReceived', label: 'Praise Received', description: 'When someone praises you' },
      { id: 'partyInvite', label: 'Party Invitations', description: 'When invited to join a party' },
      { id: 'partyActivity', label: 'Party Activity', description: 'Updates from your party' },
      { id: 'newMessage', label: 'New Messages', description: 'When you receive a message' },
      { id: 'mentions', label: 'Mentions', description: 'When someone mentions you' }
    ]
  },
  {
    id: 'projects',
    title: 'Projects & Collaboration',
    icon: '📁',
    settings: [
      { id: 'projectUpdate', label: 'Project Updates', description: 'Changes to projects you\'re part of' },
      { id: 'taskAssigned', label: 'Task Assignments', description: 'When assigned a new task' },
      { id: 'commentReply', label: 'Comment Replies', description: 'Replies to your comments' },
      { id: 'projectMilestone', label: 'Project Milestones', description: 'Major project achievements' }
    ]
  },
  {
    id: 'economy',
    title: 'Economy & Rewards',
    icon: '💰',
    settings: [
      { id: 'barakaEarned', label: 'Baraka Earned', description: 'When you earn Baraka coins' },
      { id: 'psbUpdates', label: 'PSB Updates', description: 'PSB market and trading updates' },
      { id: 'storeDeals', label: 'Store Deals', description: 'Special offers in the store' },
      { id: 'withdrawalStatus', label: 'Withdrawal Status', description: 'Updates on withdrawals' }
    ]
  },
  {
    id: 'system',
    title: 'System & Updates',
    icon: '⚙️',
    settings: [
      { id: 'newFeatures', label: 'New Features', description: 'Platform updates and new features' },
      { id: 'maintenance', label: 'Maintenance Alerts', description: 'Scheduled maintenance notices' },
      { id: 'securityAlerts', label: 'Security Alerts', description: 'Important security notifications' },
      { id: 'newsletter', label: 'GPS Lab Newsletter', description: 'Weekly digest and updates' }
    ]
  }
];

/**
 * Default notification settings
 */
const DEFAULT_SETTINGS = {};
NOTIFICATION_CATEGORIES.forEach((category) => {
  category.settings.forEach((setting) => {
    DEFAULT_SETTINGS[setting.id] = {
      email: true,
      push: true,
      inApp: true
    };
  });
});

/**
 * NotificationSettings Component
 */
const NotificationSettings = ({
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
  const [expandedCategories, setExpandedCategories] = useState(['progress']);
  
  // Update when initial settings change
  useEffect(() => {
    setSettings((prev) => ({ ...prev, ...initialSettings }));
  }, [initialSettings]);
  
  // Toggle category expansion
  const toggleCategory = useCallback((categoryId) => {
    setExpandedCategories((prev) => 
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  }, []);
  
  // Handle individual setting change
  const handleChange = useCallback((settingId, channel, value) => {
    setSettings((prev) => ({
      ...prev,
      [settingId]: {
        ...prev[settingId],
        [channel]: value
      }
    }));
    setIsDirty(true);
  }, []);
  
  // Toggle all settings in a category
  const toggleCategoryAll = useCallback((categoryId, channel, value) => {
    const category = NOTIFICATION_CATEGORIES.find((c) => c.id === categoryId);
    if (category) {
      const updates = {};
      category.settings.forEach((setting) => {
        updates[setting.id] = {
          ...settings[setting.id],
          [channel]: value
        };
      });
      setSettings((prev) => ({ ...prev, ...updates }));
      setIsDirty(true);
    }
  }, [settings]);
  
  // Handle save
  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(settings);
    }
    setIsDirty(false);
  }, [onSave, settings]);
  
  const classNames = [
    'notification-settings',
    isSaving && 'notification-settings--saving',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <header className="notification-settings__header">
        <h3 className="notification-settings__title">
          <span className="notification-settings__title-icon">🔔</span>
          Notification Settings
        </h3>
        <p className="notification-settings__subtitle">
          Choose how you want to be notified
        </p>
      </header>
      
      {/* Channel Headers */}
      <div className="notification-settings__channel-header">
        <span className="notification-settings__channel-spacer" />
        <div className="notification-settings__channels">
          <span className="notification-settings__channel" title="Email">📧</span>
          <span className="notification-settings__channel" title="Push">📱</span>
          <span className="notification-settings__channel" title="In-App">🔔</span>
        </div>
      </div>
      
      {/* Categories */}
      <div className="notification-settings__categories">
        {NOTIFICATION_CATEGORIES.map((category) => {
          const isExpanded = expandedCategories.includes(category.id);
          
          return (
            <section key={category.id} className="notification-settings__category">
              <button
                type="button"
                className="notification-settings__category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="notification-settings__category-info">
                  <span className="notification-settings__category-icon">
                    {category.icon}
                  </span>
                  <span className="notification-settings__category-title">
                    {category.title}
                  </span>
                </div>
                <span className={`notification-settings__category-arrow ${isExpanded ? 'notification-settings__category-arrow--expanded' : ''}`}>
                  ▼
                </span>
              </button>
              
              {isExpanded && (
                <div className="notification-settings__category-content">
                  {category.settings.map((setting) => (
                    <div key={setting.id} className="notification-settings__setting">
                      <div className="notification-settings__setting-info">
                        <span className="notification-settings__setting-label">
                          {setting.label}
                        </span>
                        <span className="notification-settings__setting-desc">
                          {setting.description}
                        </span>
                      </div>
                      <div className="notification-settings__setting-channels">
                        <ChannelToggle
                          checked={settings[setting.id]?.email ?? true}
                          onChange={(v) => handleChange(setting.id, 'email', v)}
                        />
                        <ChannelToggle
                          checked={settings[setting.id]?.push ?? true}
                          onChange={(v) => handleChange(setting.id, 'push', v)}
                        />
                        <ChannelToggle
                          checked={settings[setting.id]?.inApp ?? true}
                          onChange={(v) => handleChange(setting.id, 'inApp', v)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          );
        })}
      </div>
      
      {/* Actions */}
      <div className="notification-settings__actions">
        {onCancel && (
          <button
            type="button"
            className="notification-settings__cancel-btn"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button
          type="button"
          className="notification-settings__save-btn"
          onClick={handleSave}
          disabled={isSaving || !isDirty}
        >
          {isSaving ? (
            <>
              <span className="notification-settings__spinner" />
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
 * ChannelToggle Component
 */
const ChannelToggle = ({ checked, onChange }) => {
  return (
    <label className="notification-settings__channel-toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="notification-settings__channel-toggle-box">
        {checked && <span className="notification-settings__check">✓</span>}
      </span>
    </label>
  );
};

export { NOTIFICATION_CATEGORIES, DEFAULT_SETTINGS };
export default NotificationSettings;