/**
 * GPS Lab Platform - PortfolioEditor Component
 * GPS 101 INTEGRATION: Editor for GPS 101 deliverables with special validation
 * 
 * Form for creating and editing portfolio entries.
 * 
 * @module components/portfolio/PortfolioEditor/PortfolioEditor
 */

import React, { useState, useCallback, useEffect } from 'react';
import { ENTRY_TYPES } from '../PortfolioEntries/PortfolioEntryCard';
import './PortfolioEditor.css';

/**
 * Default entry data
 */
const DEFAULT_ENTRY = {
  title: '',
  description: '',
  type: 'project',
  thumbnailUrl: '',
  externalUrl: '',
  tags: [],
  category: '',
  stageCompleted: null,
  isFeatured: false,
  content: '',
  // NEW: GPS 101 fields
  isGPS101Deliverable: false,
  gps101StageNumber: null,
  gps101StageName: ''
};

/**
 * NEW: GPS 101 deliverable configurations
 */
const GPS101_DELIVERABLE_CONFIG = {
  1: {
    name: 'Identity Statement',
    description: 'A clear articulation of who you are at your core',
    minLength: 100,
    maxLength: 500,
    placeholder: 'I am someone who... (describe your core values, strengths, and passions)',
    hints: [
      'Focus on your authentic self, not roles or titles',
      'Include your core values and what drives you',
      'Be specific and personal'
    ]
  },
  2: {
    name: 'Life Problem Candidate',
    description: 'A problem that deeply resonates with your identity',
    minLength: 150,
    maxLength: 1000,
    placeholder: 'The problem that breaks my heart is...',
    hints: [
      'Choose a problem that genuinely moves you',
      'Explain why this problem matters to you personally',
      'Consider the scope and impact'
    ]
  },
  3: {
    name: 'Problem Owner Story',
    description: 'A narrative about someone experiencing your identified problem',
    minLength: 200,
    maxLength: 1500,
    placeholder: 'Meet [name], who struggles with...',
    hints: [
      'Tell a specific, real story (can be anonymized)',
      'Show the human impact of the problem',
      'Include concrete details and emotions'
    ]
  },
  4: {
    name: 'Life Purpose Statement',
    description: 'A declaration of your unique purpose in addressing this problem',
    minLength: 100,
    maxLength: 500,
    placeholder: 'My purpose is to...',
    hints: [
      'Connect your identity to your problem',
      'Be specific about your intended impact',
      'Make it personal and authentic'
    ]
  },
  5: {
    name: 'Purpose-Driven Project',
    description: 'A concrete project that embodies your purpose',
    minLength: 300,
    maxLength: 2000,
    placeholder: 'I will create/build/launch...',
    hints: [
      'Describe a specific, actionable project',
      'Explain how it addresses your problem',
      'Include your vision for impact'
    ]
  }
};

/**
 * PortfolioEditor Component
 */
const PortfolioEditor = ({
  initialData = null,
  stages = [],
  categories = [],
  // NEW: GPS 101 props
  isGPS101Mode = false,
  gps101StageNumber = null,
  onSave,
  onCancel,
  onDelete,
  isSaving = false,
  isEditing = false,
  className = '',
  ...props
}) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_ENTRY,
    ...initialData,
    // NEW: Set GPS 101 fields if in GPS 101 mode
    ...(isGPS101Mode && gps101StageNumber ? {
      isGPS101Deliverable: true,
      gps101StageNumber,
      gps101StageName: GPS101_DELIVERABLE_CONFIG[gps101StageNumber]?.name || '',
      type: 'gps101_deliverable',
      title: GPS101_DELIVERABLE_CONFIG[gps101StageNumber]?.name || ''
    } : {})
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnailUrl || '');
  
  // NEW: Get GPS 101 config if applicable
  const gps101Config = formData.isGPS101Deliverable && formData.gps101StageNumber
    ? GPS101_DELIVERABLE_CONFIG[formData.gps101StageNumber]
    : null;
  
  // Update when initial data changes
  useEffect(() => {
    if (initialData) {
      setFormData({ ...DEFAULT_ENTRY, ...initialData });
      setThumbnailPreview(initialData.thumbnailUrl || '');
    }
  }, [initialData]);
  
  // Handle input change
  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    setIsDirty(true);
    setErrors((prev) => ({ ...prev, [field]: null }));
  }, []);
  
  // Handle thumbnail URL change
  const handleThumbnailChange = useCallback((value) => {
    handleChange('thumbnailUrl', value);
    setThumbnailPreview(value);
  }, [handleChange]);
  
  // Handle tag addition
  const handleAddTag = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const tag = tagInput.trim().toLowerCase();
      if (tag && !formData.tags.includes(tag) && formData.tags.length < 10) {
        handleChange('tags', [...formData.tags, tag]);
        setTagInput('');
      }
    }
  }, [tagInput, formData.tags, handleChange]);
  
  // Handle tag removal
  const handleRemoveTag = useCallback((tagToRemove) => {
    handleChange('tags', formData.tags.filter((t) => t !== tagToRemove));
  }, [formData.tags, handleChange]);
  
  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Title must be 100 characters or less';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (gps101Config) {
      // NEW: GPS 101 specific validation
      if (formData.description.length < gps101Config.minLength) {
        newErrors.description = `GPS 101 deliverable must be at least ${gps101Config.minLength} characters`;
      } else if (formData.description.length > gps101Config.maxLength) {
        newErrors.description = `GPS 101 deliverable must not exceed ${gps101Config.maxLength} characters`;
      }
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be 500 characters or less';
    }
    
    if (formData.externalUrl && !isValidUrl(formData.externalUrl)) {
      newErrors.externalUrl = 'Please enter a valid URL';
    }
    
    if (formData.thumbnailUrl && !isValidUrl(formData.thumbnailUrl)) {
      newErrors.thumbnailUrl = 'Please enter a valid image URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, gps101Config]);
  
  // URL validation helper
  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };
  
  // Handle submit
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (validateForm() && onSave) {
      onSave(formData);
    }
  }, [validateForm, onSave, formData]);
  
  const classNames = [
    'portfolio-editor',
    isSaving && 'portfolio-editor--saving',
    formData.isGPS101Deliverable && 'portfolio-editor--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <form className={classNames} onSubmit={handleSubmit} {...props}>
      {/* Header */}
      <header className="portfolio-editor__header">
        {/* NEW: GPS 101 Badge */}
        {formData.isGPS101Deliverable && (
          <div className="portfolio-editor__gps101-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
            <div>
              <span className="portfolio-editor__gps101-label">GPS 101 Deliverable</span>
              {formData.gps101StageNumber && (
                <span className="portfolio-editor__gps101-stage">Stage {formData.gps101StageNumber}</span>
              )}
            </div>
          </div>
        )}
        
        <h2 className="portfolio-editor__title">
          <span className="portfolio-editor__title-icon">
            {formData.isGPS101Deliverable ? '🎓' : isEditing ? '✏️' : '➕'}
          </span>
          {formData.isGPS101Deliverable && gps101Config
            ? `${isEditing ? 'Edit' : 'Create'} ${gps101Config.name}`
            : isEditing ? 'Edit Entry' : 'Add Portfolio Entry'}
        </h2>
        <p className="portfolio-editor__subtitle">
          {formData.isGPS101Deliverable && gps101Config
            ? gps101Config.description
            : isEditing 
              ? 'Update your portfolio entry details'
              : 'Showcase your work and achievements'}
        </p>
      </header>
      
      {/* NEW: GPS 101 Guidance Section */}
      {formData.isGPS101Deliverable && gps101Config && (
        <section className="portfolio-editor__gps101-guidance">
          <h3 className="portfolio-editor__guidance-title">
            <span className="portfolio-editor__guidance-icon">💡</span>
            Writing Guidelines
          </h3>
          <ul className="portfolio-editor__guidance-list">
            {gps101Config.hints.map((hint, i) => (
              <li key={i} className="portfolio-editor__guidance-item">
                {hint}
              </li>
            ))}
          </ul>
        </section>
      )}
      
      {/* Basic Info */}
      <section className="portfolio-editor__section">
        <h3 className="portfolio-editor__section-title">
          {formData.isGPS101Deliverable ? 'Deliverable Content' : 'Basic Information'}
        </h3>
        
        {/* Title (auto-filled for GPS 101) */}
        {!formData.isGPS101Deliverable && (
          <div className="portfolio-editor__field">
            <label className="portfolio-editor__label" htmlFor="title">
              Title *
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="My Awesome Project"
              className={`portfolio-editor__input ${errors.title ? 'portfolio-editor__input--error' : ''}`}
              maxLength={100}
            />
            {errors.title && (
              <span className="portfolio-editor__error">{errors.title}</span>
            )}
            <span className="portfolio-editor__hint">
              {formData.title.length}/100 characters
            </span>
          </div>
        )}
        
        <div className="portfolio-editor__field">
          <label className="portfolio-editor__label" htmlFor="description">
            {formData.isGPS101Deliverable ? `Your ${gps101Config?.name} *` : 'Description *'}
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder={gps101Config?.placeholder || 'Describe your project, what you learned, and the impact...'}
            className={`portfolio-editor__textarea ${errors.description ? 'portfolio-editor__input--error' : ''} ${formData.isGPS101Deliverable ? 'portfolio-editor__textarea--gps101' : ''}`}
            rows={formData.isGPS101Deliverable ? 12 : 4}
            maxLength={gps101Config?.maxLength || 500}
          />
          {errors.description && (
            <span className="portfolio-editor__error">{errors.description}</span>
          )}
          <div className="portfolio-editor__hint">
            <span>
              {formData.description.length}/{gps101Config?.maxLength || 500} characters
            </span>
            {gps101Config && (
              <span className={`portfolio-editor__hint-requirement ${
                formData.description.length >= gps101Config.minLength 
                  ? 'portfolio-editor__hint-requirement--met' 
                  : ''
              }`}>
                {formData.description.length >= gps101Config.minLength
                  ? '✓ Minimum length met'
                  : `${gps101Config.minLength - formData.description.length} more characters needed`}
              </span>
            )}
          </div>
        </div>
        
        {/* Type Selection (disabled for GPS 101) */}
        {!formData.isGPS101Deliverable && (
          <div className="portfolio-editor__field-row">
            <div className="portfolio-editor__field">
              <label className="portfolio-editor__label" htmlFor="type">
                Entry Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => handleChange('type', e.target.value)}
                className="portfolio-editor__select"
              >
                {Object.entries(ENTRY_TYPES).filter(([key]) => key !== 'gps101_deliverable').map(([key, config]) => (
                  <option key={key} value={key}>
                    {config.icon} {config.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="portfolio-editor__field">
              <label className="portfolio-editor__label" htmlFor="category">
                Category
              </label>
              <input
                id="category"
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                placeholder="e.g., Web Development"
                className="portfolio-editor__input"
                list="categories"
              />
              <datalist id="categories">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>
        )}
      </section>
      
      {/* Media (optional for GPS 101) */}
      <section className="portfolio-editor__section">
        <h3 className="portfolio-editor__section-title">
          Media & Links {formData.isGPS101Deliverable && '(Optional)'}
        </h3>
        
        <div className="portfolio-editor__field">
          <label className="portfolio-editor__label" htmlFor="thumbnailUrl">
            Thumbnail URL
          </label>
          <input
            id="thumbnailUrl"
            type="url"
            value={formData.thumbnailUrl}
            onChange={(e) => handleThumbnailChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className={`portfolio-editor__input ${errors.thumbnailUrl ? 'portfolio-editor__input--error' : ''}`}
          />
          {errors.thumbnailUrl && (
            <span className="portfolio-editor__error">{errors.thumbnailUrl}</span>
          )}
          
          {/* Preview */}
          {thumbnailPreview && (
            <div className="portfolio-editor__thumbnail-preview">
              <img 
                src={thumbnailPreview} 
                alt="Thumbnail preview"
                onError={() => setThumbnailPreview('')}
              />
            </div>
          )}
        </div>
        
        <div className="portfolio-editor__field">
          <label className="portfolio-editor__label" htmlFor="externalUrl">
            External Link
          </label>
          <input
            id="externalUrl"
            type="url"
            value={formData.externalUrl}
            onChange={(e) => handleChange('externalUrl', e.target.value)}
            placeholder="https://github.com/username/project"
            className={`portfolio-editor__input ${errors.externalUrl ? 'portfolio-editor__input--error' : ''}`}
          />
          {errors.externalUrl && (
            <span className="portfolio-editor__error">{errors.externalUrl}</span>
          )}
          <span className="portfolio-editor__hint">
            Link to GitHub, live demo, or external page
          </span>
        </div>
      </section>
      
      {/* Tags & Settings (simplified for GPS 101) */}
      <section className="portfolio-editor__section">
        <h3 className="portfolio-editor__section-title">
          {formData.isGPS101Deliverable ? 'Additional Settings' : 'Tags & GPS Stage'}
        </h3>
        
        <div className="portfolio-editor__field">
          <label className="portfolio-editor__label" htmlFor="tags">
            Tags
          </label>
          <div className="portfolio-editor__tags-container">
            {formData.tags.map((tag) => (
              <span key={tag} className="portfolio-editor__tag">
                {tag}
                <button
                  type="button"
                  className="portfolio-editor__tag-remove"
                  onClick={() => handleRemoveTag(tag)}
                >
                  ✕
                </button>
              </span>
            ))}
            <input
              id="tags"
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder={formData.tags.length < 10 ? "Add tag..." : "Max tags reached"}
              className="portfolio-editor__tags-input"
              disabled={formData.tags.length >= 10}
            />
          </div>
          <span className="portfolio-editor__hint">
            Press Enter or comma to add a tag ({formData.tags.length}/10)
          </span>
        </div>
        
        {!formData.isGPS101Deliverable && (
          <>
            <div className="portfolio-editor__field">
              <label className="portfolio-editor__label" htmlFor="stageCompleted">
                Related GPS Stage
              </label>
              <select
                id="stageCompleted"
                value={formData.stageCompleted || ''}
                onChange={(e) => handleChange('stageCompleted', e.target.value ? parseInt(e.target.value) : null)}
                className="portfolio-editor__select"
              >
                <option value="">Not stage-related</option>
                {Array.from({ length: 35 }, (_, i) => i + 1).map((stage) => (
                  <option key={stage} value={stage}>
                    Stage {stage}
                  </option>
                ))}
              </select>
              <span className="portfolio-editor__hint">
                Link this entry to a specific GPS stage
              </span>
            </div>
            
            <div className="portfolio-editor__field">
              <label className="portfolio-editor__checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.isFeatured}
                  onChange={(e) => handleChange('isFeatured', e.target.checked)}
                />
                <span className="portfolio-editor__checkbox-box">✓</span>
                <span className="portfolio-editor__checkbox-text">
                  Feature this entry on your profile
                </span>
              </label>
            </div>
          </>
        )}
      </section>
      
      {/* Actions */}
      <div className="portfolio-editor__actions">
        {isEditing && onDelete && !formData.isGPS101Deliverable && (
          <button
            type="button"
            className="portfolio-editor__delete-btn"
            onClick={() => onDelete(formData)}
          >
            🗑️ Delete
          </button>
        )}
        <div className="portfolio-editor__actions-right">
          {onCancel && (
            <button
              type="button"
              className="portfolio-editor__cancel-btn"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className="portfolio-editor__save-btn"
            disabled={isSaving || !isDirty}
          >
            {isSaving ? (
              <>
                <span className="portfolio-editor__spinner" />
                Saving...
              </>
            ) : formData.isGPS101Deliverable ? (
              isEditing ? 'Update Deliverable' : 'Submit Deliverable'
            ) : (
              isEditing ? 'Update Entry' : 'Create Entry'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export { DEFAULT_ENTRY, GPS101_DELIVERABLE_CONFIG };
export default PortfolioEditor;