/**
 * GPS Lab Platform - BiteResources Component
 * 
 * Resource links and references for task execution.
 * 
 * @module components/bite/BiteExecution/BiteResources
 */

import React, { useState, useCallback } from 'react';
import './BiteResources.css';

/**
 * Resource type icons and colors
 */
const RESOURCE_TYPES = {
  link: { icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"/></svg>, color: 'primary' },
  documentation: { icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd"/></svg>, color: 'info' },
  video: { icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z"/></svg>, color: 'secondary' },
  code: { icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>, color: 'accent' },
  tool: { icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"/></svg>, color: 'warning' },
  file: { icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>, color: 'neutral' }
};

/**
 * BiteResources Component
 */
const BiteResources = ({
  resources = [],
  suggestedResources = [],
  onAdd,
  onRemove,
  isEditable = true,
  className = '',
  ...props
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newType, setNewType] = useState('link');
  const [showForm, setShowForm] = useState(false);
  
  const handleAdd = useCallback(() => {
    if (newTitle.trim() && newUrl.trim() && onAdd) {
      onAdd({
        title: newTitle.trim(),
        url: newUrl.trim(),
        type: newType
      });
      setNewTitle('');
      setNewUrl('');
      setNewType('link');
      setShowForm(false);
    }
  }, [newTitle, newUrl, newType, onAdd]);
  
  const addSuggested = (resource) => {
    if (onAdd) {
      onAdd(resource);
    }
  };
  
  const getResourceType = (resource) => {
    if (resource.type && RESOURCE_TYPES[resource.type]) {
      return resource.type;
    }
    const url = resource.url?.toLowerCase() || '';
    if (url.includes('youtube') || url.includes('vimeo')) return 'video';
    if (url.includes('github') || url.includes('gitlab')) return 'code';
    if (url.includes('docs') || url.includes('documentation')) return 'documentation';
    return 'link';
  };
  
  const classNames = ['bite-resources', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-resources__header">
        <h3 className="bite-resources__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
          Resources
        </h3>
        {isEditable && onAdd && !showForm && (
          <button type="button" onClick={() => setShowForm(true)} className="bite-resources__add-trigger">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
      
      {/* Add Form */}
      {showForm && (
        <div className="bite-resources__form">
          <input type="text" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Resource title" className="bite-resources__form-input" />
          <input type="url" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} placeholder="URL" className="bite-resources__form-input" />
          <select value={newType} onChange={(e) => setNewType(e.target.value)} className="bite-resources__form-select">
            {Object.entries(RESOURCE_TYPES).map(([key]) => (
              <option key={key} value={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</option>
            ))}
          </select>
          <div className="bite-resources__form-actions">
            <button type="button" onClick={() => setShowForm(false)} className="bite-resources__form-cancel">Cancel</button>
            <button type="button" onClick={handleAdd} disabled={!newTitle.trim() || !newUrl.trim()} className="bite-resources__form-submit">Add</button>
          </div>
        </div>
      )}
      
      {/* Content */}
      <div className="bite-resources__content">
        {resources.length > 0 ? (
          <div className="bite-resources__list">
            {resources.map((resource, index) => {
              const type = getResourceType(resource);
              const typeConfig = RESOURCE_TYPES[type];
              return (
                <div key={resource.id || index} className="bite-resources__item">
                  <a href={resource.url} target="_blank" rel="noopener noreferrer" className="bite-resources__link">
                    <div className={`bite-resources__icon bite-resources__icon--${typeConfig.color}`}>
                      {typeConfig.icon}
                    </div>
                    <div className="bite-resources__info">
                      <span className="bite-resources__name">{resource.title}</span>
                      <span className="bite-resources__url">{resource.url}</span>
                    </div>
                  </a>
                  {isEditable && onRemove && (
                    <button type="button" onClick={() => onRemove(resource.id || index)} className="bite-resources__remove" aria-label="Remove resource">
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <p className="bite-resources__empty">No resources added yet</p>
        )}
        
        {/* Suggested Resources */}
        {suggestedResources.length > 0 && (
          <div className="bite-resources__suggested">
            <h4 className="bite-resources__suggested-title">Suggested Resources</h4>
            <div className="bite-resources__suggested-list">
              {suggestedResources.map((resource, index) => {
                const type = getResourceType(resource);
                const typeConfig = RESOURCE_TYPES[type];
                const isAdded = resources.some(r => r.url === resource.url);
                return (
                  <div key={index} className={`bite-resources__suggested-item ${isAdded ? 'bite-resources__suggested-item--added' : ''}`}>
                    <div className={`bite-resources__icon bite-resources__icon--${typeConfig.color}`}>
                      {typeConfig.icon}
                    </div>
                    <div className="bite-resources__info">
                      <span className="bite-resources__name">{resource.title}</span>
                    </div>
                    {isAdded ? (
                      <span className="bite-resources__added-badge">Added</span>
                    ) : (
                      <button type="button" onClick={() => addSuggested(resource)} className="bite-resources__add-suggested">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                        </svg>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BiteResources;