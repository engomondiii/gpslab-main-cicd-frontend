/**
 * GPS Lab Platform - ProfileEditor Component
 * 
 * Complete profile editing form with avatar upload,
 * personal info, bio, and social links.
 * 
 * @module components/profile/ProfileEditor/ProfileEditor
 */

import React, { useState, useCallback, useEffect } from 'react';
import AvatarUpload from './AvatarUpload';
import './ProfileEditor.css';

/**
 * Social platform options
 */
const SOCIAL_PLATFORMS = [
  { id: 'github', label: 'GitHub', icon: '💻', placeholder: 'username' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼', placeholder: 'profile URL' },
  { id: 'twitter', label: 'Twitter/X', icon: '🐦', placeholder: '@username' },
  { id: 'website', label: 'Website', icon: '🌐', placeholder: 'https://' }
];

/**
 * ProfileEditor Component
 */
const ProfileEditor = ({
  initialData = {},
  onSave,
  onCancel,
  isSaving = false,
  errors = {},
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    displayName: '',
    username: '',
    bio: '',
    location: '',
    pronouns: '',
    customTitle: '',
    avatarUrl: '',
    socialLinks: {},
    ...initialData
  });
  
  const [avatarFile, setAvatarFile] = useState(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [localErrors, setLocalErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  
  // Update form data when initial data changes
  useEffect(() => {
    setFormData((prev) => ({ ...prev, ...initialData }));
  }, [initialData]);
  
  // Handle input change
  const handleInputChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    setLocalErrors((prev) => ({ ...prev, [field]: null }));
  }, []);
  
  // Handle social link change
  const handleSocialChange = useCallback((platform, value) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value
      }
    }));
    setIsDirty(true);
  }, []);
  
  // Handle avatar upload
  const handleAvatarUpload = useCallback((file) => {
    setAvatarFile(file);
    setIsDirty(true);
    // In a real app, you'd upload the file to a server here
    // For now, create a local preview URL
    const previewUrl = URL.createObjectURL(file);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: previewUrl
    }));
  }, []);
  
  // Handle avatar remove
  const handleAvatarRemove = useCallback(() => {
    setAvatarFile(null);
    setFormData((prev) => ({
      ...prev,
      avatarUrl: ''
    }));
    setIsDirty(true);
  }, []);
  
  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length > 50) {
      newErrors.displayName = 'Display name must be 50 characters or less';
    }
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }
    
    if (formData.bio.length > 500) {
      newErrors.bio = 'Bio must be 500 characters or less';
    }
    
    setLocalErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  // Handle submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validateForm() && onSave) {
      onSave({
        ...formData,
        avatarFile
      });
    }
  }, [validateForm, onSave, formData, avatarFile]);
  
  // Combine errors
  const allErrors = { ...localErrors, ...errors };
  
  const classNames = [
    'profile-editor',
    isSaving && 'profile-editor--saving',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <form className={classNames} onSubmit={handleSubmit} {...props}>
      {/* Header */}
      <header className="profile-editor__header">
        <h2 className="profile-editor__title">
          <span className="profile-editor__title-icon">✏️</span>
          Edit Profile
        </h2>
        <p className="profile-editor__subtitle">
          Customize your public profile information
        </p>
      </header>
      
      {/* Avatar Section */}
      <section className="profile-editor__section">
        <AvatarUpload
          currentAvatarUrl={formData.avatarUrl}
          displayName={formData.displayName}
          onUpload={handleAvatarUpload}
          onRemove={handleAvatarRemove}
          isUploading={isAvatarUploading}
        />
      </section>
      
      {/* Basic Info Section */}
      <section className="profile-editor__section">
        <h3 className="profile-editor__section-title">Basic Information</h3>
        
        <div className="profile-editor__field">
          <label className="profile-editor__label" htmlFor="displayName">
            Display Name *
          </label>
          <input
            id="displayName"
            type="text"
            value={formData.displayName}
            onChange={(e) => handleInputChange('displayName', e.target.value)}
            placeholder="Your display name"
            className={`profile-editor__input ${allErrors.displayName ? 'profile-editor__input--error' : ''}`}
            maxLength={50}
          />
          {allErrors.displayName && (
            <span className="profile-editor__error">{allErrors.displayName}</span>
          )}
          <span className="profile-editor__hint">
            {formData.displayName.length}/50 characters
          </span>
        </div>
        
        <div className="profile-editor__field">
          <label className="profile-editor__label" htmlFor="username">
            Username *
          </label>
          <div className="profile-editor__input-wrapper">
            <span className="profile-editor__input-prefix">@</span>
            <input
              id="username"
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value.toLowerCase())}
              placeholder="username"
              className={`profile-editor__input ${allErrors.username ? 'profile-editor__input--error' : ''}`}
            />
          </div>
          {allErrors.username && (
            <span className="profile-editor__error">{allErrors.username}</span>
          )}
        </div>
        
        <div className="profile-editor__field-row">
          <div className="profile-editor__field">
            <label className="profile-editor__label" htmlFor="pronouns">
              Pronouns
            </label>
            <select
              id="pronouns"
              value={formData.pronouns}
              onChange={(e) => handleInputChange('pronouns', e.target.value)}
              className="profile-editor__select"
            >
              <option value="">Prefer not to say</option>
              <option value="he/him">He/Him</option>
              <option value="she/her">She/Her</option>
              <option value="they/them">They/Them</option>
              <option value="other">Other</option>
            </select>
          </div>
          
          <div className="profile-editor__field">
            <label className="profile-editor__label" htmlFor="location">
              Location
            </label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              placeholder="City, Country"
              className="profile-editor__input"
            />
          </div>
        </div>
      </section>
      
      {/* Bio Section */}
      <section className="profile-editor__section">
        <h3 className="profile-editor__section-title">About You</h3>
        
        <div className="profile-editor__field">
          <label className="profile-editor__label" htmlFor="customTitle">
            Custom Title
          </label>
          <input
            id="customTitle"
            type="text"
            value={formData.customTitle}
            onChange={(e) => handleInputChange('customTitle', e.target.value)}
            placeholder="e.g., Aspiring Data Scientist"
            className="profile-editor__input"
            maxLength={100}
          />
          <span className="profile-editor__hint">
            Leave empty to use your stage-based title
          </span>
        </div>
        
        <div className="profile-editor__field">
          <label className="profile-editor__label" htmlFor="bio">
            Bio
          </label>
          <textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => handleInputChange('bio', e.target.value)}
            placeholder="Tell us about yourself, your goals, and what you're working on..."
            className={`profile-editor__textarea ${allErrors.bio ? 'profile-editor__input--error' : ''}`}
            rows={4}
            maxLength={500}
          />
          {allErrors.bio && (
            <span className="profile-editor__error">{allErrors.bio}</span>
          )}
          <span className="profile-editor__hint">
            {formData.bio.length}/500 characters
          </span>
        </div>
      </section>
      
      {/* Social Links Section */}
      <section className="profile-editor__section">
        <h3 className="profile-editor__section-title">Social Links</h3>
        
        <div className="profile-editor__social-links">
          {SOCIAL_PLATFORMS.map((platform) => (
            <div key={platform.id} className="profile-editor__field">
              <label className="profile-editor__label" htmlFor={platform.id}>
                <span className="profile-editor__social-icon">{platform.icon}</span>
                {platform.label}
              </label>
              <input
                id={platform.id}
                type="text"
                value={formData.socialLinks[platform.id] || ''}
                onChange={(e) => handleSocialChange(platform.id, e.target.value)}
                placeholder={platform.placeholder}
                className="profile-editor__input"
              />
            </div>
          ))}
        </div>
      </section>
      
      {/* Actions */}
      <div className="profile-editor__actions">
        {onCancel && (
          <button
            type="button"
            className="profile-editor__cancel-btn"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="profile-editor__save-btn"
          disabled={isSaving || !isDirty}
        >
          {isSaving ? (
            <>
              <span className="profile-editor__spinner" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export { SOCIAL_PLATFORMS };
export default ProfileEditor;