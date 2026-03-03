/**
 * GPS Lab Platform - StageProgressMap Component
 * GPS 101 INTEGRATION: Show GPS 101 as separate journey track
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
 * NEW: GPS 101 stages configuration
 */
const GPS101_STAGES = [
  { 
    id: 1, 
    title: 'Identity', 
    subtitle: 'Who am I?',
    question: 'Who am I at my core?',
    color: 'purple'
  },
  { 
    id: 2, 
    title: 'Problem', 
    subtitle: 'What breaks my heart?',
    question: 'What problem breaks my heart?',
    color: 'purple'
  },
  { 
    id: 3, 
    title: 'Owner', 
    subtitle: 'Who needs this solved?',
    question: 'Who is the problem owner?',
    color: 'purple'
  },
  { 
    id: 4, 
    title: 'Purpose', 
    subtitle: 'Why am I here?',
    question: 'What is my life purpose?',
    color: 'purple'
  },
  { 
    id: 5, 
    title: 'Project', 
    subtitle: 'What will I create?',
    question: 'What purpose-driven project will I launch?',
    color: 'purple'
  }
];

/**
 * StageProgressMap Component
 */
const StageProgressMap = ({
  stages = [],
  currentStage = 1,
  // NEW: GPS 101 props
  isGPS101Enrolled = false,
  gps101CurrentStage = 1,
  gps101Stages = [],
  showGPS101Track = true,
  viewMode = 'regular', // 'regular', 'gps101', 'both'
  onStageClick,
  showMiniMap = true,
  expandedView = false,
  className = '',
  ...props
}) => {
  const [selectedAdventure, setSelectedAdventure] = useState(
    Math.ceil(currentStage / 5)
  );
  const [activeView, setActiveView] = useState(viewMode);
  
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
   * NEW: Get GPS 101 stage data
   */
  const getGPS101StageData = useCallback((stageNumber) => {
    const stage = gps101Stages.find(s => s.stageNumber === stageNumber);
    const config = GPS101_STAGES[stageNumber - 1];
    
    if (stage) return { ...stage, ...config };
    
    // Default GPS 101 stage data
    let status = 'locked';
    if (stageNumber < gps101CurrentStage) status = 'completed';
    else if (stageNumber === gps101CurrentStage) status = 'in_progress';
    else if (stageNumber === gps101CurrentStage + 1) status = 'available';
    
    return {
      stageNumber,
      ...config,
      status,
      progress: status === 'in_progress' ? 0 : (status === 'completed' ? 100 : 0)
    };
  }, [gps101Stages, gps101CurrentStage]);
  
  /**
   * Calculate overall progress
   */
  const overallProgress = useMemo(() => {
    const completedCount = currentStage - 1;
    return Math.round((completedCount / 35) * 100);
  }, [currentStage]);
  
  /**
   * NEW: Calculate GPS 101 progress
   */
  const gps101Progress = useMemo(() => {
    const completedCount = gps101CurrentStage - 1;
    return Math.round((completedCount / 5) * 100);
  }, [gps101CurrentStage]);
  
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
    isGPS101Enrolled && showGPS101Track && 'stage-progress-map--with-gps101',
    `stage-progress-map--view-${activeView}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="stage-progress-map__header">
        <div className="stage-progress-map__title-section">
          <h2 className="stage-progress-map__title">Your Journey</h2>
          <p className="stage-progress-map__subtitle">
            {activeView === 'gps101' 
              ? `GPS 101 Stage ${gps101CurrentStage} of 5`
              : `Stage ${currentStage} of 35 • ${currentAdventure.title}`}
          </p>
        </div>
        
        {/* NEW: View Toggle (if GPS 101 enrolled) */}
        {isGPS101Enrolled && showGPS101Track && (
          <div className="stage-progress-map__view-toggle">
            <button
              type="button"
              className={`stage-progress-map__view-btn ${activeView === 'regular' ? 'stage-progress-map__view-btn--active' : ''}`}
              onClick={() => setActiveView('regular')}
            >
              Main Journey
            </button>
            <button
              type="button"
              className={`stage-progress-map__view-btn stage-progress-map__view-btn--gps101 ${activeView === 'gps101' ? 'stage-progress-map__view-btn--active' : ''}`}
              onClick={() => setActiveView('gps101')}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
              GPS 101
            </button>
          </div>
        )}
        
        {/* Overall Progress */}
        <div className="stage-progress-map__overall">
          <div className="stage-progress-map__overall-bar">
            <div 
              className="stage-progress-map__overall-fill"
              style={{ width: `${activeView === 'gps101' ? gps101Progress : overallProgress}%` }}
            />
          </div>
          <span className="stage-progress-map__overall-text">
            {activeView === 'gps101' ? gps101Progress : overallProgress}% complete
          </span>
        </div>
      </div>
      
      {/* NEW: GPS 101 View */}
      {activeView === 'gps101' && (
        <div className="stage-progress-map__gps101-view">
          <div className="stage-progress-map__gps101-header">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z"/>
            </svg>
            <div>
              <h3 className="stage-progress-map__gps101-title">GPS 101 Basic</h3>
              <p className="stage-progress-map__gps101-subtitle">15-Week Purpose Discovery Journey</p>
            </div>
          </div>
          
          <div className="stage-progress-map__gps101-stages">
            {GPS101_STAGES.map((stageConfig, index) => {
              const stageData = getGPS101StageData(stageConfig.id);
              return (
                <div key={stageConfig.id} className="stage-progress-map__gps101-stage-wrapper">
                  <div className={`stage-progress-map__gps101-stage stage-progress-map__gps101-stage--${stageData.status}`}>
                    <div className="stage-progress-map__gps101-stage-number">
                      <span>{stageConfig.id}</span>
                    </div>
                    <div className="stage-progress-map__gps101-stage-content">
                      <h4 className="stage-progress-map__gps101-stage-title">{stageConfig.title}</h4>
                      <p className="stage-progress-map__gps101-stage-subtitle">{stageConfig.subtitle}</p>
                      <p className="stage-progress-map__gps101-stage-question">"{stageConfig.question}"</p>
                      
                      {stageData.progress !== undefined && stageData.progress > 0 && (
                        <div className="stage-progress-map__gps101-stage-progress">
                          <div className="stage-progress-map__gps101-stage-bar">
                            <div 
                              className="stage-progress-map__gps101-stage-fill"
                              style={{ width: `${stageData.progress}%` }}
                            />
                          </div>
                          <span className="stage-progress-map__gps101-stage-percent">{stageData.progress}%</span>
                        </div>
                      )}
                      
                      {stageData.status === 'completed' && (
                        <div className="stage-progress-map__gps101-stage-complete">
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span>Complete</span>
                        </div>
                      )}
                      
                      {stageData.deliverable && (
                        <div className="stage-progress-map__gps101-stage-deliverable">
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd"/>
                          </svg>
                          <span>Deliverable: {stageData.deliverable}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {index < GPS101_STAGES.length - 1 && (
                    <div className={`stage-progress-map__gps101-connector ${stageData.status === 'completed' ? 'stage-progress-map__gps101-connector--completed' : ''}`}>
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd"/>
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Orange Beacon Info */}
          <div className="stage-progress-map__gps101-reward">
            <div className="stage-progress-map__gps101-reward-icon">
              <span className="stage-progress-map__gps101-beacon">🟠</span>
            </div>
            <div className="stage-progress-map__gps101-reward-content">
              <h4>Orange Beacon Reward</h4>
              <p>Complete all 5 stages to unlock the Orange Beacon and 5,000 Baraka</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Regular Journey View */}
      {activeView === 'regular' && (
        <>
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
        </>
      )}
    </div>
  );
};

export { ADVENTURES, GPS101_STAGES };
export default StageProgressMap;