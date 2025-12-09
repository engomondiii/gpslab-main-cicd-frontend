/**
 * GPS Lab Platform - MissionTimeline Component
 * 
 * Timeline visualization of mission steps and checkpoints.
 * 
 * @module components/mission/MissionProgress/MissionTimeline
 */

import React from 'react';
import './MissionTimeline.css';

const STEP_ICONS = {
  briefing: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/></svg>,
  task: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>,
  quiz: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/></svg>,
  coding: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg>,
  submission: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/></svg>,
  checkpoint: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd"/></svg>,
  complete: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>
};

const MissionTimeline = ({
  steps = [],
  currentStepIndex = 0,
  onStepClick,
  variant = 'vertical',
  showDuration = true,
  className = '',
  ...props
}) => {
  const classNames = ['mission-timeline', `mission-timeline--${variant}`, className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="mission-timeline__track">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLocked = index > currentStepIndex && !step.unlocked;
          const StepIcon = STEP_ICONS[step.type] || STEP_ICONS.task;
          
          return (
            <div
              key={step.id || index}
              className={`mission-timeline__step ${isCompleted ? 'mission-timeline__step--completed' : ''} ${isCurrent ? 'mission-timeline__step--current' : ''} ${isLocked ? 'mission-timeline__step--locked' : ''}`}
              onClick={() => !isLocked && onStepClick?.(step, index)}
              role={onStepClick && !isLocked ? 'button' : undefined}
            >
              {index > 0 && (
                <div className={`mission-timeline__connector ${isCompleted ? 'mission-timeline__connector--completed' : ''}`} />
              )}
              <div className="mission-timeline__node">
                <div className="mission-timeline__node-icon">{isCompleted ? STEP_ICONS.complete : StepIcon}</div>
                {isCurrent && <span className="mission-timeline__node-pulse" />}
              </div>
              <div className="mission-timeline__content">
                <span className="mission-timeline__step-number">Step {index + 1}</span>
                <h4 className="mission-timeline__step-title">{step.title}</h4>
                {step.description && <p className="mission-timeline__step-desc">{step.description}</p>}
                {showDuration && step.duration && <span className="mission-timeline__step-duration">~{step.duration} min</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { STEP_ICONS };
export default MissionTimeline;