/**
 * GPS Lab Platform - CommandCenter Component
 * 
 * Central command center showing current mission, 3D globe, and objectives.
 * Features full Cesium globe with real problem beacons!
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
  onMissionClick,
  onStartMission,
  onViewObjectives,
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
   * Incomplete objectives count
   */
  const incompleteObjectives = useMemo(() => {
    return objectives.filter(obj => !obj.completed).length;
  }, [objectives]);
  
  const classNames = ['command-center', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="command-center__header">
        <div className="command-center__title-section">
          <h2 className="command-center__title">Command Center</h2>
          <span className="command-center__stage">Stage {currentStage}</span>
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
        {/* Current Mission */}
        <div className="command-center__mission">
          <div className="command-center__section-header">
            <h3 className="command-center__section-title">Current Mission</h3>
            {missionStatus !== 'none' && (
              <span className={`command-center__mission-status command-center__mission-status--${missionStatus}`}>
                {missionStatus === 'in_progress' ? 'In Progress' : 
                 missionStatus === 'completed' ? 'Completed' : 'Ready'}
              </span>
            )}
          </div>
          
          {currentMission ? (
            <div className="command-center__mission-card">
              <div className="command-center__mission-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              
              <div className="command-center__mission-info">
                <h4 className="command-center__mission-name">{currentMission.title}</h4>
                <p className="command-center__mission-desc">{currentMission.description}</p>
                
                {currentMission.progress !== undefined && (
                  <div className="command-center__mission-progress">
                    <div className="command-center__mission-progress-bar">
                      <div 
                        className="command-center__mission-progress-fill"
                        style={{ width: `${currentMission.progress}%` }}
                      />
                    </div>
                    <span className="command-center__mission-progress-text">
                      {currentMission.progress}% complete
                    </span>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={() => onStartMission?.(currentMission)}
                className="command-center__mission-btn"
              >
                {missionStatus === 'in_progress' ? 'Continue' : 'Start'}
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          ) : (
            <div className="command-center__mission-empty">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <p>No active mission. Choose your next challenge!</p>
            </div>
          )}
        </div>
        
        {/* Objectives Panel */}
        <div className="command-center__objectives">
          <div className="command-center__section-header">
            <h3 className="command-center__section-title">Objectives</h3>
            {incompleteObjectives > 0 && (
              <span className="command-center__objectives-count">{incompleteObjectives} remaining</span>
            )}
          </div>
          
          {objectives.length > 0 ? (
            <ul className="command-center__objectives-list">
              {objectives.slice(0, 5).map((objective, index) => (
                <li 
                  key={objective.id || index}
                  className={`command-center__objective ${objective.completed ? 'command-center__objective--completed' : ''}`}
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
                  <span className="command-center__objective-text">{objective.text}</span>
                  {objective.reward && (
                    <span className="command-center__objective-reward">+{objective.reward} XP</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <div className="command-center__objectives-empty">
              <p>No objectives yet</p>
            </div>
          )}
          
          {objectives.length > 5 && (
            <button
              type="button"
              onClick={onViewObjectives}
              className="command-center__view-all"
            >
              View all {objectives.length} objectives
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

CommandCenter.propTypes = {
  user: PropTypes.object,
  currentStage: PropTypes.number,
  currentMission: PropTypes.object,
  upcomingMissions: PropTypes.array,
  completedMissions: PropTypes.array,
  objectives: PropTypes.array,
  navigatorMessage: PropTypes.string,
  onMissionClick: PropTypes.func,
  onStartMission: PropTypes.func,
  onViewObjectives: PropTypes.func,
  className: PropTypes.string
};

export default CommandCenter;