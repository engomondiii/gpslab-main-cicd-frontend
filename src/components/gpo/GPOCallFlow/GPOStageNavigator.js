/**
 * GPS Lab Platform - GPOStageNavigator Component
 * 
 * Visual navigation between GPO Call stages.
 * 
 * @module components/gpo/GPOCallFlow/GPOStageNavigator
 */

import React from 'react';
import './GPOStageNavigator.css';

/**
 * GPOStageNavigator Component
 */
const GPOStageNavigator = ({
  stages = [],
  currentStage = -4,
  completedStages = [],
  onNavigateToStage,
  className = '',
  ...props
}) => {
  
  /**
   * Get stage status
   */
  const getStageStatus = (stageNumber) => {
    if (completedStages.includes(stageNumber)) return 'completed';
    if (stageNumber === currentStage) return 'current';
    if (stageNumber > currentStage) return 'locked';
    return 'available';
  };

  const classNames = ['gpo-stage-navigator', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="gpo-stage-navigator__track">
        {stages.map((stage, index) => {
          const status = getStageStatus(stage.number);
          const isClickable = status !== 'locked';

          return (
            <React.Fragment key={stage.number}>
              {/* Stage Node */}
              <button
                type="button"
                onClick={() => isClickable && onNavigateToStage?.(stage.number)}
                disabled={!isClickable}
                className={`gpo-stage-navigator__node gpo-stage-navigator__node--${status}`}
                aria-label={`Stage ${stage.number}: ${stage.title}`}
                title={stage.title}
              >
                <div className="gpo-stage-navigator__node-inner">
                  <span className="gpo-stage-navigator__node-icon">
                    {status === 'completed' ? '✓' : stage.icon}
                  </span>
                </div>
                
                {status === 'current' && (
                  <div className="gpo-stage-navigator__node-pulse" />
                )}
              </button>

              {/* Connection Line */}
              {index < stages.length - 1 && (
                <div 
                  className={`gpo-stage-navigator__line ${
                    completedStages.includes(stage.number) ? 'gpo-stage-navigator__line--completed' : ''
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Stage Labels */}
      <div className="gpo-stage-navigator__labels">
        {stages.map((stage) => {
          const status = getStageStatus(stage.number);
          
          return (
            <div 
              key={stage.number}
              className={`gpo-stage-navigator__label gpo-stage-navigator__label--${status}`}
            >
              <div className="gpo-stage-navigator__label-number">Stage {stage.number}</div>
              <div className="gpo-stage-navigator__label-title">{stage.subtitle}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GPOStageNavigator;