/**
 * GPS Lab Platform - CommandCenter Component
 * 
 * Central command center showing current mission, 3D globe, and objectives.
 * Features full Cesium globe with real problem beacons!
 * 
 * UPDATED: GPS 101 Integration - Shows GPS 101 journey alongside regular missions
 * 
 * @module components/dashboard/CommandCenter
 */

import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import CommandCenterGlobe from './CommandCenterGlobe';
import './CommandCenter.css';

/**
 * CommandCenter Component
 */
const CommandCenter = ({
  user = {},
  currentStage = 1,
  currentMission = null,
  upcomingMissions = [],
  completedMissions = [],
  objectives = [],
  navigatorMessage = '',
  // GPS 101 Props
  gps101Enrolled = false,
  gps101CurrentStage = null,
  gps101Progress = 0,
  gps101NextCheckpoint = null,
  gps101OrangeBeaconProgress = 0,
  onMissionClick,
  onStartMission,
  onViewObjectives,
  onGPS101Click,
  onStartGPS101,
  className = '',
  ...props
}) => {
  
  /**
   * Current mission status
   */
  const missionStatus = useMemo(() => {
    if (!currentMission) return 'none';
    if (currentMission.completed) return 'completed';
    if (currentMission.progress > 0) return 'in_progress';
    return 'available';
  }, [currentMission]);
  
  /**
   * Determine which mission to display (GPS 101 takes priority if active)
   */
  const displayMission = useMemo(() => {
    if (gps101Enrolled && gps101CurrentStage && gps101Progress < 100) {
      // GPS 101 is active
      return {
        type: 'gps101',
        title: `GPS 101: Stage ${gps101CurrentStage}`,
        description: getGPS101StageDescription(gps101CurrentStage),
        progress: gps101Progress,
        isGPS101: true
      };
    }
    return currentMission;
  }, [gps101Enrolled, gps101CurrentStage, gps101Progress, currentMission]);
  
  /**
   * Incomplete objectives count
   */
  const incompleteObjectives = useMemo(() => {
    return objectives.filter(obj => !obj.completed).length;
  }, [objectives]);
  
  /**
   * GPS 101 objectives (if enrolled)
   */
  const gps101Objectives = useMemo(() => {
    if (!gps101Enrolled || !gps101CurrentStage) return [];
    
    const stageObjectives = [
      {
        id: 'gps101-checkpoint-next',
        text: gps101NextCheckpoint || 'Complete current checkpoint',
        completed: false,
        reward: 100,
        isGPS101: true
      },
      {
        id: 'gps101-deliverable',
        text: `Submit Stage ${gps101CurrentStage} deliverable`,
        completed: gps101Progress === 100,
        reward: 500,
        isGPS101: true
      },
      {
        id: 'gps101-orange-beacon',
        text: `Progress toward Orange Beacon (${Math.floor(gps101OrangeBeaconProgress)}% complete)`,
        completed: gps101OrangeBeaconProgress >= 100,
        reward: 5000,
        isGPS101: true
      }
    ];
    
    return stageObjectives;
  }, [gps101Enrolled, gps101CurrentStage, gps101NextCheckpoint, gps101Progress, gps101OrangeBeaconProgress]);
  
  /**
   * Combined objectives (GPS 101 + Regular)
   */
  const allObjectives = useMemo(() => {
    return [...gps101Objectives, ...objectives];
  }, [gps101Objectives, objectives]);
  
  const classNames = ['command-center', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="command-center__header">
        <div className="command-center__title-section">
          <h2 className="command-center__title">Command Center</h2>
          <span className="command-center__stage">
            {gps101Enrolled && gps101CurrentStage ? `GPS 101 Stage ${gps101CurrentStage}` : `Stage ${currentStage}`}
          </span>
        </div>
        
        {/* Navigator Status */}
        <div className="command-center__navigator">
          <div className="command-center__navigator-avatar">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-5.5-2.5l7.51-3.49L17.5 6.5 9.99 9.99 6.5 17.5zm5.5-6.6c.61 0 1.1.49 1.1 1.1s-.49 1.1-1.1 1.1-1.1-.49-1.1-1.1.49-1.1 1.1-1.1z"/>
            </svg>
          </div>
          <span className="command-center__navigator-status">Navigator Active</span>
        </div>
      </div>
      
      {/* Globe Section - Full 3D Cesium Globe */}
      <div className="command-center__globe-section">
        <CommandCenterGlobe
          currentStage={currentStage}
          onProblemClick={onMissionClick}
        />
      </div>
      
      {/* Content Grid */}
      <div className="command-center__content">
        {/* Current Mission (GPS 101 or Regular) */}
        <div className="command-center__mission">
          <div className="command-center__section-header">
            <h3 className="command-center__section-title">
              {displayMission?.isGPS101 ? 'GPS 101 Journey' : 'Current Mission'}
            </h3>
            {displayMission && (
              <span className={`command-center__mission-status command-center__mission-status--${
                displayMission.isGPS101 ? 'in_progress' : missionStatus
              }`}>
                {displayMission.isGPS101 ? 'GPS 101 Active' : 
                 missionStatus === 'in_progress' ? 'In Progress' : 
                 missionStatus === 'completed' ? 'Completed' : 'Ready'}
              </span>
            )}
          </div>
          
          {displayMission ? (
            <div className={`command-center__mission-card ${displayMission.isGPS101 ? 'command-center__mission-card--gps101' : ''}`}>
              <div className={`command-center__mission-icon ${displayMission.isGPS101 ? 'command-center__mission-icon--gps101' : ''}`}>
                {displayMission.isGPS101 ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                  </svg>
                )}
              </div>
              
              <div className="command-center__mission-info">
                <h4 className="command-center__mission-name">{displayMission.title}</h4>
                <p className="command-center__mission-desc">{displayMission.description}</p>
                
                {displayMission.progress !== undefined && (
                  <div className="command-center__mission-progress">
                    <div className="command-center__mission-progress-bar">
                      <div 
                        className={`command-center__mission-progress-fill ${displayMission.isGPS101 ? 'command-center__mission-progress-fill--gps101' : ''}`}
                        style={{ width: `${displayMission.progress}%` }}
                      />
                    </div>
                    <span className="command-center__mission-progress-text">
                      {displayMission.progress}% complete
                      {displayMission.isGPS101 && ` • ${Math.floor(gps101OrangeBeaconProgress)}% to Orange Beacon`}
                    </span>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => displayMission.isGPS101 ? onGPS101Click?.() : onStartMission?.(displayMission)}
                className={`command-center__mission-btn ${displayMission.isGPS101 ? 'command-center__mission-btn--gps101' : ''}`}
              >
                {displayMission.isGPS101 ? 'Continue GPS 101' : (missionStatus === 'in_progress' ? 'Continue' : 'Start')}
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="command-center__mission-empty">
              {!gps101Enrolled ? (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71L12 2z"/>
                  </svg>
                  <p>Start your GPS 101 journey to discover your life purpose!</p>
                  <button
                    type="button"
                    onClick={onStartGPS101}
                    className="command-center__mission-btn command-center__mission-btn--gps101"
                    style={{ marginTop: '12px' }}
                  >
                    Enroll in GPS 101
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  <p>No active mission. Choose your next challenge!</p>
                </>
              )}
            </div>
          )}
        </div>
        
        {/* Objectives Panel (Combined GPS 101 + Regular) */}
        <div className="command-center__objectives">
          <div className="command-center__section-header">
            <h3 className="command-center__section-title">Objectives</h3>
            {incompleteObjectives > 0 && (
              <span className="command-center__objectives-count">{incompleteObjectives} remaining</span>
            )}
          </div>
          
          {allObjectives.length > 0 ? (
            <ul className="command-center__objectives-list">
              {allObjectives.slice(0, 5).map((objective, index) => (
                <li 
                  key={objective.id || index}
                  className={`command-center__objective ${objective.completed ? 'command-center__objective--completed' : ''} ${objective.isGPS101 ? 'command-center__objective--gps101' : ''}`}
                >
                  <span className="command-center__objective-check">
                    {objective.completed ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <span className="command-center__objective-dot" />
                    )}
                  </span>
                  <span className="command-center__objective-text">
                    {objective.isGPS101 && <span className="command-center__objective-gps101-badge">GPS 101</span>}
                    {objective.text}
                  </span>
                  {objective.reward && (
                    <span className={`command-center__objective-reward ${objective.isGPS101 ? 'command-center__objective-reward--gps101' : ''}`}>
                      +{objective.reward} {objective.isGPS101 && objective.reward >= 5000 ? 'Baraka' : 'XP'}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="command-center__objectives-empty">
              <p>No objectives yet</p>
            </div>
          )}
          
          {allObjectives.length > 5 && (
            <button
              type="button"
              onClick={onViewObjectives}
              className="command-center__view-all"
            >
              View all {allObjectives.length} objectives
            </button>
          )}
        </div>
        
        {/* Navigator Message */}
        {navigatorMessage && (
          <div className="command-center__navigator-message">
            <div className="command-center__navigator-bubble">
              <div className="command-center__navigator-avatar-small">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <p className="command-center__navigator-text">{navigatorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Helper function to get GPS 101 stage description
 */
function getGPS101StageDescription(stageNumber) {
  const descriptions = {
    1: 'Discover your core identity through deep self-reflection',
    2: 'Identify the problem that breaks your heart',
    3: 'Tell the story of those experiencing your problem',
    4: 'Synthesize your purpose from identity and problem',
    5: 'Design your purpose-driven project'
  };
  return descriptions[stageNumber] || `Complete Stage ${stageNumber} of GPS 101`;
}

CommandCenter.propTypes = {
  user: PropTypes.object,
  currentStage: PropTypes.number,
  currentMission: PropTypes.object,
  upcomingMissions: PropTypes.array,
  completedMissions: PropTypes.array,
  objectives: PropTypes.array,
  navigatorMessage: PropTypes.string,
  // GPS 101 Props
  gps101Enrolled: PropTypes.bool,
  gps101CurrentStage: PropTypes.number,
  gps101Progress: PropTypes.number,
  gps101NextCheckpoint: PropTypes.string,
  gps101OrangeBeaconProgress: PropTypes.number,
  onMissionClick: PropTypes.func,
  onStartMission: PropTypes.func,
  onViewObjectives: PropTypes.func,
  onGPS101Click: PropTypes.func,
  onStartGPS101: PropTypes.func,
  className: PropTypes.string
};

export default CommandCenter;