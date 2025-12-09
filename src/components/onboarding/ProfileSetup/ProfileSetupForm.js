/**
 * GPS Lab Platform - ProfileSetupForm Component
 * 
 * Profile setup step in onboarding flow.
 * Collects user preferences and profile information.
 * 
 * @module components/onboarding/ProfileSetup
 */

import React, { useState, useCallback } from 'react';
import './ProfileSetupForm.css';

/**
 * Learning goals options
 */
const LEARNING_GOALS = [
  { id: 'problem_solving', label: 'Improve Problem Solving', icon: '🧩' },
  { id: 'critical_thinking', label: 'Develop Critical Thinking', icon: '🤔' },
  { id: 'career_growth', label: 'Career Advancement', icon: '📈' },
  { id: 'academic', label: 'Academic Excellence', icon: '🎓' },
  { id: 'entrepreneurship', label: 'Build a Startup', icon: '🚀' },
  { id: 'social_impact', label: 'Create Social Impact', icon: '🌍' }
];

/**
 * Experience level options
 */
const EXPERIENCE_LEVELS = [
  { id: 'beginner', label: 'Beginner', description: 'Just starting my journey' },
  { id: 'intermediate', label: 'Intermediate', description: 'Some problem-solving experience' },
  { id: 'advanced', label: 'Advanced', description: 'Experienced problem solver' }
];

/**
 * Time commitment options
 */
const TIME_COMMITMENTS = [
  { id: 'casual', label: '1-3 hours/week', description: 'Casual learning' },
  { id: 'moderate', label: '4-7 hours/week', description: 'Steady progress' },
  { id: 'intensive', label: '8+ hours/week', description: 'Fast track' }
];

/**
 * ProfileSetupForm Component
 */
const ProfileSetupForm = ({
  initialData = {},
  onSubmit,
  onBack,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    displayName: initialData.displayName || '',
    bio: initialData.bio || '',
    learningGoals: initialData.learningGoals || [],
    experienceLevel: initialData.experienceLevel || 'beginner',
    timeCommitment: initialData.timeCommitment || 'moderate',
    interests: initialData.interests || '',
    university: initialData.university || '',
    notifications: initialData.notifications !== false
  });
  
  const [errors, setErrors] = useState({});
  
  /**
   * Handle input change
   */
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  /**
   * Toggle learning goal
   */
  const toggleGoal = useCallback((goalId) => {
    setFormData(prev => {
      const goals = prev.learningGoals.includes(goalId)
        ? prev.learningGoals.filter(g => g !== goalId)
        : [...prev.learningGoals, goalId];
      return { ...prev, learningGoals: goals };
    });
  }, []);
  
  /**
   * Validate form
   */
  const validate = useCallback(() => {
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    } else if (formData.displayName.length < 2) {
      newErrors.displayName = 'Display name must be at least 2 characters';
    }
    
    if (formData.learningGoals.length === 0) {
      newErrors.learningGoals = 'Please select at least one learning goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);
  
  /**
   * Handle submit
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit?.(formData);
  }, [formData, validate, onSubmit]);
  
  const classNames = ['profile-setup-form', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="profile-setup-form__header">
        <div className="profile-setup-form__icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        </div>
        <h2 className="profile-setup-form__title">Set Up Your Profile</h2>
        <p className="profile-setup-form__description">
          Tell us a bit about yourself so we can personalize your GPS journey.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="profile-setup-form__form">
        {/* Display Name */}
        <div className={`profile-setup-form__field ${errors.displayName ? 'profile-setup-form__field--error' : ''}`}>
          <label htmlFor="displayName" className="profile-setup-form__label">
            Display Name *
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formData.displayName}
            onChange={handleChange}
            placeholder="How should we call you?"
            className="profile-setup-form__input"
            disabled={isLoading}
          />
          {errors.displayName && (
            <span className="profile-setup-form__error">{errors.displayName}</span>
          )}
        </div>
        
        {/* Bio */}
        <div className="profile-setup-form__field">
          <label htmlFor="bio" className="profile-setup-form__label">
            Short Bio
            <span className="profile-setup-form__optional">(optional)</span>
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Tell us a bit about yourself..."
            rows={3}
            className="profile-setup-form__textarea"
            disabled={isLoading}
          />
        </div>
        
        {/* Learning Goals */}
        <div className={`profile-setup-form__field ${errors.learningGoals ? 'profile-setup-form__field--error' : ''}`}>
          <label className="profile-setup-form__label">
            What are your learning goals? *
          </label>
          <div className="profile-setup-form__goals">
            {LEARNING_GOALS.map(goal => (
              <button
                key={goal.id}
                type="button"
                onClick={() => toggleGoal(goal.id)}
                className={`profile-setup-form__goal ${formData.learningGoals.includes(goal.id) ? 'profile-setup-form__goal--selected' : ''}`}
                disabled={isLoading}
              >
                <span className="profile-setup-form__goal-icon">{goal.icon}</span>
                <span className="profile-setup-form__goal-label">{goal.label}</span>
              </button>
            ))}
          </div>
          {errors.learningGoals && (
            <span className="profile-setup-form__error">{errors.learningGoals}</span>
          )}
        </div>
        
        {/* Experience Level */}
        <div className="profile-setup-form__field">
          <label className="profile-setup-form__label">
            Your experience level
          </label>
          <div className="profile-setup-form__levels">
            {EXPERIENCE_LEVELS.map(level => (
              <label
                key={level.id}
                className={`profile-setup-form__level ${formData.experienceLevel === level.id ? 'profile-setup-form__level--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level.id}
                  checked={formData.experienceLevel === level.id}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="profile-setup-form__level-label">{level.label}</span>
                <span className="profile-setup-form__level-desc">{level.description}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* Time Commitment */}
        <div className="profile-setup-form__field">
          <label className="profile-setup-form__label">
            How much time can you commit?
          </label>
          <div className="profile-setup-form__times">
            {TIME_COMMITMENTS.map(time => (
              <label
                key={time.id}
                className={`profile-setup-form__time ${formData.timeCommitment === time.id ? 'profile-setup-form__time--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="timeCommitment"
                  value={time.id}
                  checked={formData.timeCommitment === time.id}
                  onChange={handleChange}
                  disabled={isLoading}
                />
                <span className="profile-setup-form__time-label">{time.label}</span>
                <span className="profile-setup-form__time-desc">{time.description}</span>
              </label>
            ))}
          </div>
        </div>
        
        {/* University/Organization */}
        <div className="profile-setup-form__field">
          <label htmlFor="university" className="profile-setup-form__label">
            University / Organization
            <span className="profile-setup-form__optional">(optional)</span>
          </label>
          <input
            type="text"
            id="university"
            name="university"
            value={formData.university}
            onChange={handleChange}
            placeholder="e.g., Handong University"
            className="profile-setup-form__input"
            disabled={isLoading}
          />
        </div>
        
        {/* Notifications */}
        <div className="profile-setup-form__field">
          <label className="profile-setup-form__checkbox">
            <input
              type="checkbox"
              name="notifications"
              checked={formData.notifications}
              onChange={handleChange}
              disabled={isLoading}
            />
            <span className="profile-setup-form__checkbox-mark" />
            <span className="profile-setup-form__checkbox-text">
              Send me updates about my progress and new features
            </span>
          </label>
        </div>
        
        {/* Actions */}
        <div className="profile-setup-form__actions">
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="profile-setup-form__btn profile-setup-form__btn--back"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
              </svg>
              Back
            </button>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="profile-setup-form__btn profile-setup-form__btn--submit"
          >
            {isLoading ? (
              <>
                <span className="profile-setup-form__spinner" />
                <span>Creating Profile...</span>
              </>
            ) : (
              <>
                <span>Complete Setup</span>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export { LEARNING_GOALS, EXPERIENCE_LEVELS, TIME_COMMITMENTS };
export default ProfileSetupForm;