/**
 * Deliverable Editor Component
 * 
 * Editor for creating and updating GPS 101 deliverables.
 */

import React, { useState, useEffect } from 'react';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import { validateDeliverable } from '../../../utils/validators/gps101.validator';
import { formatWordCount, formatCharacterCount } from '../../../utils/formatters/gps101.formatter';
import './DeliverableEditor.css';

const DeliverableEditor = ({ deliverableId, initialData, onSave, onCancel }) => {
  const deliverableConfig = GPS_101_CONFIG.DELIVERABLES.find(d => d.id === deliverableId);
  
  const [data, setData] = useState(initialData || getInitialData());
  const [errors, setErrors] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  function getInitialData() {
    switch (deliverableConfig.type) {
      case 'text':
      case 'narrative':
        return { content: '', draft: true };
      case 'list':
        return { items: [], draft: true };
      case 'project':
        return { 
          title: '', 
          description: '', 
          problem: '', 
          solution: '', 
          impact: '',
          draft: true 
        };
      default:
        return { draft: true };
    }
  }

  useEffect(() => {
    if (initialData) {
      setData(initialData);
    }
  }, [initialData]);

  const handleSave = async (isDraft = false) => {
    setIsSaving(true);
    setErrors([]);

    const validation = validateDeliverable(deliverableId, data);
    
    if (!isDraft && !validation.valid) {
      setErrors(validation.errors);
      setIsSaving(false);
      return;
    }

    const saveData = {
      ...data,
      draft: isDraft,
      submitted: !isDraft,
      updatedAt: new Date().toISOString()
    };

    try {
      await onSave(deliverableId, saveData);
    } catch (error) {
      setErrors([error.message || 'Failed to save deliverable']);
    } finally {
      setIsSaving(false);
    }
  };

  const renderEditor = () => {
    switch (deliverableConfig.type) {
      case 'text':
      case 'narrative':
        return renderTextEditor();
      case 'list':
        return renderListEditor();
      case 'project':
        return renderProjectEditor();
      default:
        return <div>Unknown deliverable type</div>;
    }
  };

  const renderTextEditor = () => (
    <div className="editor-section">
      <div className="editor-header">
        <label className="editor-label">{deliverableConfig.name}</label>
        <div className="character-count">
          {formatCharacterCount(data.content || '')} • {formatWordCount(data.content || '')}
        </div>
      </div>
      
      <textarea
        className="deliverable-textarea"
        value={data.content || ''}
        onChange={(e) => setData({ ...data, content: e.target.value })}
        placeholder={`Write your ${deliverableConfig.name.toLowerCase()} here...`}
        rows={15}
      />
      
      <div className="editor-hints">
        <p className="hint-text">
          Minimum: {deliverableConfig.minLength} characters • 
          Maximum: {deliverableConfig.maxLength} characters
        </p>
      </div>
    </div>
  );

  const renderListEditor = () => {
    const [newItem, setNewItem] = useState('');

    const addItem = () => {
      if (newItem.trim()) {
        const items = data.items || [];
        setData({ 
          ...data, 
          items: [...items, { 
            title: newItem.trim(), 
            description: '',
            id: Date.now() 
          }] 
        });
        setNewItem('');
      }
    };

    const removeItem = (index) => {
      const items = [...data.items];
      items.splice(index, 1);
      setData({ ...data, items });
    };

    const updateItem = (index, field, value) => {
      const items = [...data.items];
      items[index] = { ...items[index], [field]: value };
      setData({ ...data, items });
    };

    return (
      <div className="editor-section">
        <div className="editor-header">
          <label className="editor-label">{deliverableConfig.name}</label>
          <div className="item-count">
            {data.items?.length || 0} / {deliverableConfig.minItems}-{deliverableConfig.maxItems} problems
          </div>
        </div>

        {/* Add new item */}
        <div className="add-item-section">
          <input
            type="text"
            className="item-input"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addItem()}
            placeholder="Enter problem title and press Enter"
          />
          <button className="add-item-button" onClick={addItem}>
            Add Problem
          </button>
        </div>

        {/* Items list */}
        <div className="items-list">
          {data.items?.map((item, index) => (
            <div key={item.id} className="list-item-editor">
              <div className="item-header">
                <span className="item-number">{index + 1}.</span>
                <input
                  type="text"
                  className="item-title-input"
                  value={item.title}
                  onChange={(e) => updateItem(index, 'title', e.target.value)}
                  placeholder="Problem title"
                />
                <button 
                  className="remove-item-button"
                  onClick={() => removeItem(index)}
                >
                  ✕
                </button>
              </div>
              <textarea
                className="item-description-input"
                value={item.description}
                onChange={(e) => updateItem(index, 'description', e.target.value)}
                placeholder="Describe this problem..."
                rows={3}
              />
            </div>
          ))}
        </div>

        <div className="editor-hints">
          <p className="hint-text">
            Add {deliverableConfig.minItems} to {deliverableConfig.maxItems} global problems you care about
          </p>
        </div>
      </div>
    );
  };

  const renderProjectEditor = () => (
    <div className="editor-section">
      <div className="editor-header">
        <label className="editor-label">{deliverableConfig.name}</label>
      </div>

      <div className="project-fields">
        <div className="field-group">
          <label className="field-label">Project Title *</label>
          <input
            type="text"
            className="field-input"
            value={data.title || ''}
            onChange={(e) => setData({ ...data, title: e.target.value })}
            placeholder="Give your project a compelling title"
          />
        </div>

        <div className="field-group">
          <label className="field-label">Description *</label>
          <textarea
            className="field-textarea"
            value={data.description || ''}
            onChange={(e) => setData({ ...data, description: e.target.value })}
            placeholder="Describe your purpose-driven project"
            rows={4}
          />
          <div className="field-hint">{formatCharacterCount(data.description || '')}</div>
        </div>

        <div className="field-group">
          <label className="field-label">Problem Statement *</label>
          <textarea
            className="field-textarea"
            value={data.problem || ''}
            onChange={(e) => setData({ ...data, problem: e.target.value })}
            placeholder="What problem does this project solve?"
            rows={4}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Solution Approach *</label>
          <textarea
            className="field-textarea"
            value={data.solution || ''}
            onChange={(e) => setData({ ...data, solution: e.target.value })}
            placeholder="How will you solve this problem?"
            rows={4}
          />
        </div>

        <div className="field-group">
          <label className="field-label">Expected Impact *</label>
          <textarea
            className="field-textarea"
            value={data.impact || ''}
            onChange={(e) => setData({ ...data, impact: e.target.value })}
            placeholder="What impact will this project have?"
            rows={4}
          />
        </div>
      </div>

      <div className="editor-hints">
        <p className="hint-text">
          All fields are required for submission
        </p>
      </div>
    </div>
  );

  return (
    <div className="deliverable-editor">
      <div className="editor-container">
        {/* Header */}
        <div className="editor-top-bar">
          <div>
            <h2 className="editor-title">{deliverableConfig.name}</h2>
            <p className="editor-subtitle">{deliverableConfig.description}</p>
          </div>
          <button className="close-button" onClick={onCancel}>
            ✕
          </button>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="editor-errors">
            <div className="error-header">
              <span className="error-icon">⚠️</span>
              <span>Please fix the following errors:</span>
            </div>
            <ul className="error-list">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Editor Content */}
        {renderEditor()}

        {/* Actions */}
        <div className="editor-actions">
          <button 
            className="cancel-button"
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          
          <div className="save-buttons">
            <button 
              className="draft-button"
              onClick={() => handleSave(true)}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>
            
            <button 
              className="submit-button"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              {isSaving ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeliverableEditor;