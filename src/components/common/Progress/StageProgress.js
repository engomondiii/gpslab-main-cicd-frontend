/**
 * GPS Lab Platform - StageProgress Component
 * 
 * Multi-stage progress indicator for the 35-stage learning journey.
 * Shows adventure progress with stage milestones.
 * 
 * @module components/common/Progress/StageProgress
 * @version 1.0.0
 */

import React from 'react';
import './StageProgress.css';

// =============================================================================
// CONSTANTS
// =============================================================================

export const STAGE_STATUS = {
  LOCKED: 'locked',
  AVAILABLE: 'available',
  CURRENT: 'current',
  COMPLETED: 'completed'
};

// Adventure colors (7 adventures)
const ADVENTURE_COLORS = [
  '#2563eb', // Adventure 1: Identity - Blue
  '#16a34a', // Adventure 2: Foundation - Green
  '#f59e0b', // Adventure 3: Skills - Amber
  '#dc2626', // Adventure 4: Connection - Red
  '#7c3aed', // Adventure 5: Creation - Purple
  '#0891b2', // Adventure 6: Impact - Cyan
  '#ec4899'  // Adventure 7: Launch - Pink
];

// =============================================================================
// COMPONENT
// =============================================================================

/**
 * StageProgress component
 * 
 * @param {Object} props - Component props
 * @param {number} props.currentStage - Current stage (1-35)
 * @param {number} props.totalStages - Total stages (default 35)
 * @param {number} [props.stagesPerAdventure=5] - Stages per adventure
 * @param {Array} [props.completedStages=[]] - Array of completed stage numbers
 * @param {boolean} [props.showMilestones=true] - Show adventure milestones
 * @param {boolean} [props.compact=false] - Compact display mode
 * @param {Function} [props.onStageClick] - Stage click handler
 * @param {string} [props.className] - Additional CSS classes
 */
const StageProgress = ({
  currentStage = 1,
  totalStages = 35,
  stagesPerAdventure = 5,
  completedStages = [],
  showMilestones = true,
  compact = false,
  onStageClick,
  className = '',
  ...props
}) => {
  
  // Calculate adventure info
  const currentAdventure = Math.ceil(currentStage / stagesPerAdventure);
  const totalAdventures = Math.ceil(totalStages / stagesPerAdventure);
  const completedCount = completedStages.length;
  const overallProgress = (completedCount / totalStages) * 100;
  
  // Get stage status
  const getStageStatus = (stageNum) => {
    if (completedStages.includes(stageNum)) return STAGE_STATUS.COMPLETED;
    if (stageNum === currentStage) return STAGE_STATUS.CURRENT;
    if (stageNum <= currentStage) return STAGE_STATUS.AVAILABLE;
    return STAGE_STATUS.LOCKED;
  };
  
  // Get adventure for stage
  const getAdventure = (stageNum) => Math.ceil(stageNum / stagesPerAdventure);
  
  // Get adventure color
  const getAdventureColor = (adventureNum) => 
    ADVENTURE_COLORS[(adventureNum - 1) % ADVENTURE_COLORS.length];
  
  const classNames = [
    'stage-progress',
    compact && 'stage-progress--compact',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Overall progress bar */}
      <div className="stage-progress__overview">
        <div className="stage-progress__stats">
          <span className="stage-progress__current">
            Stage {currentStage} of {totalStages}
          </span>
          <span className="stage-progress__percent">
            {Math.round(overallProgress)}% Complete
          </span>
        </div>
        
        <div className="stage-progress__bar">
          {Array.from({ length: totalAdventures }).map((_, idx) => {
            const adventureNum = idx + 1;
            const startStage = (adventureNum - 1) * stagesPerAdventure + 1;
            const endStage = Math.min(adventureNum * stagesPerAdventure, totalStages);
            const adventureCompleted = completedStages.filter(
              s => s >= startStage && s <= endStage
            ).length;
            const adventureTotal = endStage - startStage + 1;
            const adventureProgress = (adventureCompleted / adventureTotal) * 100;
            
            return (
              <div 
                key={adventureNum}
                className="stage-progress__segment"
                style={{ 
                  '--adventure-color': getAdventureColor(adventureNum),
                  flex: adventureTotal
                }}
              >
                <div 
                  className="stage-progress__segment-fill"
                  style={{ width: `${adventureProgress}%` }}
                />
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Stage dots (non-compact) */}
      {!compact && (
        <div className="stage-progress__stages">
          {Array.from({ length: totalStages }).map((_, idx) => {
            const stageNum = idx + 1;
            const status = getStageStatus(stageNum);
            const adventure = getAdventure(stageNum);
            const isAdventureStart = (stageNum - 1) % stagesPerAdventure === 0;
            
            return (
              <React.Fragment key={stageNum}>
                {/* Adventure milestone marker */}
                {showMilestones && isAdventureStart && stageNum > 1 && (
                  <div className="stage-progress__milestone" />
                )}
                
                {/* Stage dot */}
                <button
                  type="button"
                  className={`stage-progress__stage stage-progress__stage--${status}`}
                  style={{ '--adventure-color': getAdventureColor(adventure) }}
                  onClick={() => onStageClick?.(stageNum, status)}
                  disabled={status === STAGE_STATUS.LOCKED}
                  aria-label={`Stage ${stageNum}: ${status}`}
                  title={`Stage ${stageNum}`}
                >
                  {status === STAGE_STATUS.COMPLETED && (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {status === STAGE_STATUS.CURRENT && (
                    <span className="stage-progress__stage-number">{stageNum}</span>
                  )}
                </button>
              </React.Fragment>
            );
          })}
        </div>
      )}
      
      {/* Adventure labels */}
      {!compact && showMilestones && (
        <div className="stage-progress__adventures">
          {Array.from({ length: totalAdventures }).map((_, idx) => {
            const adventureNum = idx + 1;
            const isCurrent = currentAdventure === adventureNum;
            
            return (
              <div 
                key={adventureNum}
                className={`stage-progress__adventure ${isCurrent ? 'stage-progress__adventure--current' : ''}`}
                style={{ '--adventure-color': getAdventureColor(adventureNum) }}
              >
                <span className="stage-progress__adventure-num">A{adventureNum}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// =============================================================================
// EXPORTS
// =============================================================================

export default StageProgress;