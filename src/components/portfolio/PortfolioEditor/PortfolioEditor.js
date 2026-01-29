/**
 * GPS Lab Platform - PortfolioEditor Component
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
  content: ''
};

/**
 * PortfolioEditor Component
 */
const PortfolioEditor = ({
  initialData = null,
  stages = [],
  categories = [],
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
    ...initialData
  });
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isDirty, setIsDirty] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState(initialData?.thumbnailUrl || '');
  
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
  }, [formData]);
  
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
    className
  ].filter(Boolean).join(' ');
  
  return (
    <form className={classNames} onSubmit={handleSubmit} {...props}>
      {/* Header */}
      <header className="portfolio-editor__header">
        <h2 className="portfolio-editor__title">
          <span className="portfolio-editor__title-icon">
            {isEditing ? '✏️' : '➕'}
          </span>
          {isEditing ? 'Edit Entry' : 'Add Portfolio Entry'}
        </h2>
        <p className="portfolio-editor__subtitle">
          {isEditing 
            ? 'Update your portfolio entry details'
            : 'Showcase your work and achievements'}
        </p>
      </header>
      
      {/* Basic Info */}
      <section className="portfolio-editor__section">
        <h3 className="portfolio-editor__section-title">Basic Information</h3>
        
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
        
        <div className="portfolio-editor__field">
          <label className="portfolio-editor__label" htmlFor="description">
            Description *
          </label>
          <textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            placeholder="Describe your project, what you learned, and the impact..."
            className={`portfolio-editor__textarea ${errors.description ? 'portfolio-editor__input--error' : ''}`}
            rows={4}
            maxLength={500}
          />
          {errors.description && (
            <span className="portfolio-editor__error">{errors.description}</span>
          )}
          <span className="portfolio-editor__hint">
            {formData.description.length}/500 characters
          </span>
        </div>
        
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
              {Object.entries(ENTRY_TYPES).map(([key, config]) => (
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
      </section>
      
      {/* Media */}
      <section className="portfolio-editor__section">
        <h3 className="portfolio-editor__section-title">Media & Links</h3>
        
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
      
      {/* Tags & Stage */}
      <section className="portfolio-editor__section">
        <h3 className="portfolio-editor__section-title">Tags & GPS Stage</h3>
        
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
      </section>
      
      {/* Actions */}
      <div className="portfolio-editor__actions">
        {isEditing && onDelete && (
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
            ) : isEditing ? (
              'Update Entry'
            ) : (
              'Create Entry'
            )}
          </button>
        </div>
      </div>
    </form>
  );
};

export { DEFAULT_ENTRY };
export default PortfolioEditor;