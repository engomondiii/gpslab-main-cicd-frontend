/**
 * GPS Lab Platform - StageProgressMap Component
 * 
 * Visual progress map showing all 35 stages organized by adventure.
 * 
 * @module components/dashboard/StageProgress/StageProgressMap
 */

import React, { useMemo, useState, useCallback } from 'react';
import StageCard from './StageCard';
import './StageProgressMap.css';

/**
 * Adventures configuration (7 adventures x 5 stages = 35 stages)
 */
const ADVENTURES = [
  { id: 1, title: 'Foundation', subtitle: 'Building Blocks', color: 'cyan', stages: [1, 2, 3, 4, 5] },
  { id: 2, title: 'Discovery', subtitle: 'Exploring Horizons', color: 'teal', stages: [6, 7, 8, 9, 10] },
  { id: 3, title: 'Growth', subtitle: 'Expanding Skills', color: 'green', stages: [11, 12, 13, 14, 15] },
  { id: 4, title: 'Challenge', subtitle: 'Testing Limits', color: 'yellow', stages: [16, 17, 18, 19, 20] },
  { id: 5, title: 'Mastery', subtitle: 'Refining Craft', color: 'orange', stages: [21, 22, 23, 24, 25] },
  { id: 6, title: 'Innovation', subtitle: 'Creating Solutions', color: 'red', stages: [26, 27, 28, 29, 30] },
  { id: 7, title: 'Leadership', subtitle: 'Guiding Others', color: 'purple', stages: [31, 32, 33, 34, 35] }
];

/**
 * StageProgressMap Component
 */
const StageProgressMap = ({
  stages = [],
  currentStage = 1,
  onStageClick,
  showMiniMap = true,
  expandedView = false,
  className = '',
  ...props
}) => {
  const [selectedAdventure, setSelectedAdventure] = useState(
    Math.ceil(currentStage / 5)
  );
  
  /**
   * Get stage data by number
   */
  const getStageData = useCallback((stageNumber) => {
    const stage = stages.find(s => s.stageNumber === stageNumber);
    
    if (stage) return stage;
    
    // Default stage data
    let status = 'locked';
    if (stageNumber < currentStage) status = 'completed';
    else if (stageNumber === currentStage) status = 'in_progress';
    else if (stageNumber === currentStage + 1) status = 'available';
    
    return {
      stageNumber,
      title: `Stage ${stageNumber}`,
      status,
      progress: status === 'in_progress' ? 0 : (status === 'completed' ? 100 : 0)
    };
  }, [stages, currentStage]);
  
  /**
   * Calculate overall progress
   */
  const overallProgress = useMemo(() => {
    const completedCount = currentStage - 1;
    return Math.round((completedCount / 35) * 100);
  }, [currentStage]);
  
  /**
   * Current adventure
   */
  const currentAdventure = useMemo(() => {
    return ADVENTURES.find(a => a.stages.includes(currentStage)) || ADVENTURES[0];
  }, [currentStage]);
  
  /**
   * Handle adventure selection
   */
  const handleAdventureClick = useCallback((adventureId) => {
    setSelectedAdventure(adventureId);
  }, []);
  
  const classNames = [
    'stage-progress-map',
    expandedView && 'stage-progress-map--expanded',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="stage-progress-map__header">
        <div className="stage-progress-map__title-section">
          <h2 className="stage-progress-map__title">Your Journey</h2>
          <p className="stage-progress-map__subtitle">
            Stage {currentStage} of 35 • {currentAdventure.title}
          </p>
        </div>
        
        {/* Overall Progress */}
        <div className="stage-progress-map__overall">
          <div className="stage-progress-map__overall-bar">
            <div 
              className="stage-progress-map__overall-fill"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="stage-progress-map__overall-text">
            {overallProgress}% complete
          </span>
        </div>
      </div>
      
      {/* Mini Map (Adventure Selector) */}
      {showMiniMap && (
        <div className="stage-progress-map__minimap">
          {ADVENTURES.map(adventure => {
            const adventureProgress = adventure.stages.filter(
              s => s < currentStage
            ).length;
            const isActive = adventure.id === selectedAdventure;
            const isCurrent = adventure.stages.includes(currentStage);
            
            return (
              <button
                key={adventure.id}
                type="button"
                onClick={() => handleAdventureClick(adventure.id)}
                className={`stage-progress-map__adventure-btn stage-progress-map__adventure-btn--${adventure.color} ${isActive ? 'stage-progress-map__adventure-btn--active' : ''} ${isCurrent ? 'stage-progress-map__adventure-btn--current' : ''}`}
              >
                <span className="stage-progress-map__adventure-id">{adventure.id}</span>
                <span className="stage-progress-map__adventure-title">{adventure.title}</span>
                <span className="stage-progress-map__adventure-progress">
                  {adventureProgress}/5
                </span>
              </button>
            );
          })}
        </div>
      )}
      
      {/* Selected Adventure Detail */}
      <div className="stage-progress-map__adventure-detail">
        {ADVENTURES.filter(a => a.id === selectedAdventure).map(adventure => (
          <div key={adventure.id} className={`stage-progress-map__adventure stage-progress-map__adventure--${adventure.color}`}>
            <div className="stage-progress-map__adventure-header">
              <div className="stage-progress-map__adventure-number">
                Adventure {adventure.id}
              </div>
              <h3 className="stage-progress-map__adventure-name">{adventure.title}</h3>
              <p className="stage-progress-map__adventure-sub">{adventure.subtitle}</p>
            </div>
            
            {/* Stages Grid */}
            <div className="stage-progress-map__stages">
              {adventure.stages.map(stageNumber => {
                const stageData = getStageData(stageNumber);
                return (
                  <StageCard
                    key={stageNumber}
                    {...stageData}
                    adventureTitle={adventure.title}
                    onClick={() => onStageClick?.(stageNumber)}
                    size="small"
                    variant="compact"
                  />
                );
              })}
            </div>
            
            {/* Path Connectors */}
            <div className="stage-progress-map__path">
              {adventure.stages.slice(0, -1).map((_, index) => (
                <div 
                  key={index}
                  className={`stage-progress-map__connector ${
                    adventure.stages[index] < currentStage 
                      ? 'stage-progress-map__connector--completed' 
                      : ''
                  }`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { ADVENTURES };
export default StageProgressMap;