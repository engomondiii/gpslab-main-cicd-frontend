/**
 * GPS Lab Platform - BiteWorkspace Component
 * 
 * Main workspace for executing a bite task with timer, subtasks, notes, and resources.
 * 
 * @module components/bite/BiteExecution/BiteWorkspace
 */

import React, { useState, useEffect, useCallback } from 'react';
import BiteWorkBreakdown from '../BitePlanning/BiteWorkBreakdown';
import BiteNotes from './BiteNotes';
import BiteResources from './BiteResources';
import './BiteWorkspace.css';

/**
 * BiteWorkspace Component
 */
const BiteWorkspace = ({
  bite,
  subtasks = [],
  notes = [],
  resources = [],
  suggestedResources = [],
  onSubtaskToggle,
  onSubtaskAdd,
  onSubtaskRemove,
  onSubtaskUpdate,
  onSubtaskReorder,
  onNoteAdd,
  onNoteUpdate,
  onNoteDelete,
  onResourceAdd,
  onResourceRemove,
  onPause,
  onResume,
  onSubmit,
  onSave,
  isPaused = false,
  timeSpent = 0,
  className = '',
  ...props
}) => {
  const [elapsedTime, setElapsedTime] = useState(timeSpent);
  const [activeTab, setActiveTab] = useState('subtasks');
  
  // Timer logic
  useEffect(() => {
    let interval;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);
  
  // Sync with prop
  useEffect(() => {
    setElapsedTime(timeSpent);
  }, [timeSpent]);
  
  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const progress = subtasks.length > 0 ? Math.round((completedSubtasks / subtasks.length) * 100) : 0;
  const estimatedTime = bite?.estimatedTime || subtasks.reduce((sum, s) => sum + (s.estimatedTime || 0), 0);
  const estimatedSeconds = estimatedTime * 60;
  const timeProgress = estimatedSeconds > 0 ? Math.min(100, Math.round((elapsedTime / estimatedSeconds) * 100)) : 0;
  const isOvertime = elapsedTime > estimatedSeconds && estimatedSeconds > 0;
  
  const handlePauseResume = () => {
    if (isPaused) {
      onResume?.();
    } else {
      onPause?.();
    }
  };
  
  const handleSave = useCallback(() => {
    onSave?.({ timeSpent: elapsedTime });
  }, [elapsedTime, onSave]);
  
  const classNames = ['bite-workspace', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-workspace__header">
        <div className="bite-workspace__header-left">
          <span className="bite-workspace__task-id">#{bite?.id?.slice(-6)}</span>
          <h2 className="bite-workspace__task-title">{bite?.title}</h2>
        </div>
        
        <div className="bite-workspace__header-actions">
          {onSave && (
            <button type="button" onClick={handleSave} className="bite-workspace__save-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
                <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
              </svg>
              Save Progress
            </button>
          )}
          {onSubmit && (
            <button type="button" onClick={onSubmit} className="bite-workspace__submit-btn" disabled={progress < 100}>
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
              </svg>
              Submit
            </button>
          )}
        </div>
      </div>
      
      {/* Timer & Progress Section */}
      <div className="bite-workspace__stats">
        {/* Timer */}
        <div className={`bite-workspace__timer ${isPaused ? 'bite-workspace__timer--paused' : ''} ${isOvertime ? 'bite-workspace__timer--overtime' : ''}`}>
          <div className="bite-workspace__timer-display">
            <span className="bite-workspace__timer-value">{formatTime(elapsedTime)}</span>
            {estimatedSeconds > 0 && (
              <span className="bite-workspace__timer-estimate">/ {formatTime(estimatedSeconds)}</span>
            )}
          </div>
          <button type="button" onClick={handlePauseResume} className="bite-workspace__timer-btn">
            {isPaused ? (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
            ) : (
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
            )}
          </button>
          {isPaused && <span className="bite-workspace__paused-badge">Paused</span>}
          {isOvertime && <span className="bite-workspace__overtime-badge">Overtime</span>}
        </div>
        
        {/* Progress */}
        <div className="bite-workspace__progress">
          <div className="bite-workspace__progress-header">
            <span className="bite-workspace__progress-label">Progress</span>
            <span className="bite-workspace__progress-value">{progress}%</span>
          </div>
          <div className="bite-workspace__progress-bar">
            <div className="bite-workspace__progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="bite-workspace__progress-count">{completedSubtasks} of {subtasks.length} subtasks</span>
        </div>
        
        {/* Time Progress */}
        {estimatedSeconds > 0 && (
          <div className="bite-workspace__time-progress">
            <div className="bite-workspace__time-progress-header">
              <span className="bite-workspace__time-progress-label">Time</span>
              <span className={`bite-workspace__time-progress-value ${isOvertime ? 'bite-workspace__time-progress-value--overtime' : ''}`}>
                {timeProgress}%
              </span>
            </div>
            <div className="bite-workspace__time-progress-bar">
              <div
                className={`bite-workspace__time-progress-fill ${isOvertime ? 'bite-workspace__time-progress-fill--overtime' : ''}`}
                style={{ width: `${Math.min(100, timeProgress)}%` }}
              />
            </div>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="bite-workspace__tabs">
        <button
          type="button"
          onClick={() => setActiveTab('subtasks')}
          className={`bite-workspace__tab ${activeTab === 'subtasks' ? 'bite-workspace__tab--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
          </svg>
          Subtasks
          <span className="bite-workspace__tab-count">{subtasks.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('notes')}
          className={`bite-workspace__tab ${activeTab === 'notes' ? 'bite-workspace__tab--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z"/>
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd"/>
          </svg>
          Notes
          <span className="bite-workspace__tab-count">{notes.length}</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('resources')}
          className={`bite-workspace__tab ${activeTab === 'resources' ? 'bite-workspace__tab--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
          </svg>
          Resources
          <span className="bite-workspace__tab-count">{resources.length}</span>
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bite-workspace__content">
        {activeTab === 'subtasks' && (
          <BiteWorkBreakdown
            subtasks={subtasks}
            onToggle={onSubtaskToggle}
            onAdd={onSubtaskAdd}
            onRemove={onSubtaskRemove}
            onUpdate={onSubtaskUpdate}
            onReorder={onSubtaskReorder}
          />
        )}
        {activeTab === 'notes' && (
          <BiteNotes
            notes={notes}
            onAdd={onNoteAdd}
            onUpdate={onNoteUpdate}
            onDelete={onNoteDelete}
          />
        )}
        {activeTab === 'resources' && (
          <BiteResources
            resources={resources}
            suggestedResources={suggestedResources}
            onAdd={onResourceAdd}
            onRemove={onResourceRemove}
          />
        )}
      </div>
    </div>
  );
};

export default BiteWorkspace;