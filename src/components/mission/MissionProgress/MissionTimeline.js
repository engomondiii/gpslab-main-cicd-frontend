/**
 * GPS Lab Platform - MissionTimeline Component
 * GPS 101 INTEGRATION: Shows GPS 101-specific step types and styling
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
  complete: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>,
  // NEW: GPS 101-specific step types
  reflection: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/></svg>,
  deliverable: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/></svg>
};

const MissionTimeline = ({
  steps = [],
  currentStepIndex = 0,
  onStepClick,
  variant = 'vertical',
  showDuration = true,
  isGPS101 = false, // NEW: GPS 101 flag
  className = '',
  ...props
}) => {
  const classNames = [
    'mission-timeline',
    `mission-timeline--${variant}`,
    isGPS101 && 'mission-timeline--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div className="mission-timeline__track">
        {steps.map((step, index) => {
          const isCompleted = index < currentStepIndex;
          const isCurrent = index === currentStepIndex;
          const isLocked = index > currentStepIndex && !step.unlocked;
          const StepIcon = STEP_ICONS[step.type] || STEP_ICONS.task;
          
          // NEW: GPS 101-specific step rendering
          const isGPS101DeliverableStep = isGPS101 && step.type === 'deliverable';
          
          return (
            <div
              key={step.id || index}
              className={`mission-timeline__step ${isCompleted ? 'mission-timeline__step--completed' : ''} ${isCurrent ? 'mission-timeline__step--current' : ''} ${isLocked ? 'mission-timeline__step--locked' : ''} ${isGPS101DeliverableStep ? 'mission-timeline__step--deliverable' : ''}`}
              onClick={() => !isLocked && onStepClick?.(step, index)}
              role={onStepClick && !isLocked ? 'button' : undefined}
            >
              {index > 0 && (
                <div className={`mission-timeline__connector ${isCompleted ? 'mission-timeline__connector--completed' : ''}`} />
              )}
              
              <div className="mission-timeline__node">
                <div className="mission-timeline__node-icon">
                  {isCompleted ? STEP_ICONS.complete : StepIcon}
                </div>
                {isCurrent && <span className="mission-timeline__node-pulse" />}
                
                {/* NEW: GPS 101 deliverable indicator */}
                {isGPS101DeliverableStep && (
                  <div className="mission-timeline__deliverable-badge">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="mission-timeline__content">
                <span className="mission-timeline__step-number">
                  {isGPS101 ? `${step.type === 'deliverable' ? 'Deliverable' : 'Step'} ${index + 1}` : `Step ${index + 1}`}
                </span>
                <h4 className="mission-timeline__step-title">{step.title}</h4>
                {step.description && (
                  <p className="mission-timeline__step-desc">{step.description}</p>
                )}
                {showDuration && step.duration && (
                  <span className="mission-timeline__step-duration">~{step.duration} min</span>
                )}
                
                {/* NEW: GPS 101-specific step metadata */}
                {isGPS101 && step.gps101Metadata && (
                  <div className="mission-timeline__gps101-meta">
                    {step.gps101Metadata.deliverableName && (
                      <span className="mission-timeline__deliverable-name">
                        📄 {step.gps101Metadata.deliverableName}
                      </span>
                    )}
                    {step.gps101Metadata.navigatorTip && (
                      <div className="mission-timeline__navigator-tip">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                        </svg>
                        <span>{step.gps101Metadata.navigatorTip}</span>
                      </div>
                    )}
                  </div>
                )}
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