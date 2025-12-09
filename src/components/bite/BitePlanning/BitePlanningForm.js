/**
 * GPS Lab Platform - BitePlanningForm Component
 * 
 * Form for planning bite task details before starting work.
 * 
 * @module components/bite/BitePlanning/BitePlanningForm
 */

import React, { useState, useCallback } from 'react';
import BiteWorkBreakdown from './BiteWorkBreakdown';
import './BitePlanningForm.css';

/**
 * Default subtask template
 */
const DEFAULT_SUBTASKS = [
  { id: '1', text: 'Review requirements', completed: false, estimatedTime: 15 },
  { id: '2', text: 'Research approach', completed: false, estimatedTime: 30 },
  { id: '3', text: 'Implement solution', completed: false, estimatedTime: 60 },
  { id: '4', text: 'Test and validate', completed: false, estimatedTime: 20 },
  { id: '5', text: 'Document work', completed: false, estimatedTime: 15 }
];

/**
 * BitePlanningForm Component
 */
const BitePlanningForm = ({
  bite,
  onSave,
  onCancel,
  onStartWork,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [approach, setApproach] = useState(bite?.approach || '');
  const [resources, setResources] = useState(bite?.plannedResources?.join('\n') || '');
  const [challenges, setChallenges] = useState(bite?.challenges || '');
  const [subtasks, setSubtasks] = useState(bite?.subtasks || []);
  const [useTemplate, setUseTemplate] = useState(false);
  
  const totalEstimate = subtasks.reduce((sum, s) => sum + (s.estimatedTime || 0), 0);
  
  const formatTime = (minutes) => {
    if (!minutes) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const handleAddSubtask = useCallback((data) => {
    const newSubtask = {
      id: `subtask-${Date.now()}`,
      text: data.text,
      estimatedTime: data.estimatedTime,
      completed: false
    };
    setSubtasks(prev => [...prev, newSubtask]);
  }, []);
  
  const handleRemoveSubtask = useCallback((id) => {
    setSubtasks(prev => prev.filter(s => s.id !== id));
  }, []);
  
  const handleToggleSubtask = useCallback((id) => {
    setSubtasks(prev => prev.map(s => 
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
  }, []);
  
  const handleUpdateSubtask = useCallback((id, data) => {
    setSubtasks(prev => prev.map(s => 
      s.id === id ? { ...s, ...data } : s
    ));
  }, []);
  
  const handleReorderSubtasks = useCallback((fromIndex, toIndex) => {
    setSubtasks(prev => {
      const result = [...prev];
      const [removed] = result.splice(fromIndex, 1);
      result.splice(toIndex, 0, removed);
      return result;
    });
  }, []);
  
  const loadTemplate = () => {
    setSubtasks(DEFAULT_SUBTASKS.map((s, i) => ({
      ...s,
      id: `template-${Date.now()}-${i}`
    })));
    setUseTemplate(true);
  };
  
  const handleSave = () => {
    if (onSave) {
      onSave({
        approach,
        plannedResources: resources.split('\n').filter(r => r.trim()),
        challenges,
        subtasks,
        totalEstimate
      });
    }
  };
  
  const handleStart = () => {
    handleSave();
    if (onStartWork) {
      onStartWork(bite?.id);
    }
  };
  
  const isValid = approach.trim() && subtasks.length > 0;
  
  const classNames = ['bite-planning-form', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-planning-form__header">
        <h2 className="bite-planning-form__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"/>
          </svg>
          Plan Your Work
        </h2>
        <p className="bite-planning-form__subtitle">
          Before diving in, take a moment to plan your approach
        </p>
      </div>
      
      {/* Bite Context */}
      {bite && (
        <div className="bite-planning-form__context">
          <div className="bite-planning-form__context-header">
            <span className="bite-planning-form__context-label">Planning for:</span>
            <span className="bite-planning-form__context-id">#{bite.id?.slice(-6)}</span>
          </div>
          <h3 className="bite-planning-form__context-title">{bite.title}</h3>
          {bite.estimatedTime && (
            <div className="bite-planning-form__context-meta">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              Suggested: {formatTime(bite.estimatedTime)}
            </div>
          )}
        </div>
      )}
      
      {/* Form Content */}
      <div className="bite-planning-form__content">
        {/* Approach Section */}
        <div className="bite-planning-form__section">
          <label className="bite-planning-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
            </svg>
            Your Approach
            <span className="bite-planning-form__required">*</span>
          </label>
          <p className="bite-planning-form__hint">
            Describe how you plan to tackle this task
          </p>
          <textarea
            value={approach}
            onChange={(e) => setApproach(e.target.value)}
            placeholder="I'll start by reviewing the requirements, then..."
            className="bite-planning-form__textarea"
            rows={4}
          />
        </div>
        
        {/* Work Breakdown Section */}
        <div className="bite-planning-form__section">
          <div className="bite-planning-form__section-header">
            <label className="bite-planning-form__label">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Work Breakdown
              <span className="bite-planning-form__required">*</span>
            </label>
            {subtasks.length === 0 && !useTemplate && (
              <button
                type="button"
                onClick={loadTemplate}
                className="bite-planning-form__template-btn"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
                </svg>
                Use Template
              </button>
            )}
          </div>
          <p className="bite-planning-form__hint">
            Break down the work into smaller steps
          </p>
          
          <BiteWorkBreakdown
            subtasks={subtasks}
            onAdd={handleAddSubtask}
            onRemove={handleRemoveSubtask}
            onToggle={handleToggleSubtask}
            onUpdate={handleUpdateSubtask}
            onReorder={handleReorderSubtasks}
            showEstimates={true}
          />
          
          {subtasks.length > 0 && (
            <div className="bite-planning-form__estimate">
              <span className="bite-planning-form__estimate-label">Total Estimated Time:</span>
              <span className="bite-planning-form__estimate-value">{formatTime(totalEstimate)}</span>
            </div>
          )}
        </div>
        
        {/* Resources Section */}
        <div className="bite-planning-form__section">
          <label className="bite-planning-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
            </svg>
            Resources Needed
          </label>
          <p className="bite-planning-form__hint">
            List any documentation, tools, or references you'll need (one per line)
          </p>
          <textarea
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            placeholder="Official documentation&#10;Stack Overflow thread&#10;Tutorial video"
            className="bite-planning-form__textarea"
            rows={3}
          />
        </div>
        
        {/* Challenges Section */}
        <div className="bite-planning-form__section">
          <label className="bite-planning-form__label">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            Potential Challenges
          </label>
          <p className="bite-planning-form__hint">
            Anticipate any obstacles you might encounter
          </p>
          <textarea
            value={challenges}
            onChange={(e) => setChallenges(e.target.value)}
            placeholder="Complex edge cases to handle..."
            className="bite-planning-form__textarea"
            rows={2}
          />
        </div>
      </div>
      
      {/* Actions */}
      <div className="bite-planning-form__actions">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="bite-planning-form__cancel-btn"
            disabled={isLoading}
          >
            Cancel
          </button>
        )}
        
        <button
          type="button"
          onClick={handleSave}
          className="bite-planning-form__save-btn"
          disabled={!isValid || isLoading}
        >
          Save Plan
        </button>
        
        {onStartWork && (
          <button
            type="button"
            onClick={handleStart}
            className="bite-planning-form__start-btn"
            disabled={!isValid || isLoading}
          >
            {isLoading ? (
              <>
                <span className="bite-planning-form__spinner" />
                Starting...
              </>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                </svg>
                Start Working
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default BitePlanningForm;