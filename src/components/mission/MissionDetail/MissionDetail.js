/**
 * GPS Lab Platform - MissionDetail Component
 * GPS 101 INTEGRATION: Shows GPS 101 context, Navigator guidance, deliverable info
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import MissionHeader from './MissionHeader';
import MissionObjectives from './MissionObjectives';
import MissionRewards from './MissionRewards';
import './MissionDetail.css';

/**
 * MissionDetail Component
 */
const MissionDetail = ({
  mission = {},
  onBack,
  onAccept,
  onContinue,
  onObjectiveClick,
  showBriefing = true,
  showAcceptButton = true,
  isLoading = false,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  
  const {
    id,
    title,
    description,
    type,
    status,
    difficulty,
    stageNumber,
    missionNumber,
    estimatedTime,
    xpReward,
    barakaReward,
    objectives = [],
    bonusRewards = [],
    badges = [],
    achievements = [],
    unlocks = [],
    prerequisites = [],
    tips = [],
    author,
    createdAt,
    progress,
    // NEW: GPS 101 fields
    isGPS101 = false,
    gps101StageNumber,
    gps101MissionNumber,
    gps101DeliverableName,
    gps101StageQuestion,
    isStageCompleter = false
  } = mission;
  
  const isAvailable = status === 'available';
  const isInProgress = status === 'in_progress';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  
  const classNames = [
    'mission-detail',
    isGPS101 && 'mission-detail--gps101',
    className
  ].filter(Boolean).join(' ');
  
  // NEW: GPS 101-aware continue handler
  const handleContinue = () => {
    if (isGPS101) {
      navigate(`/gps-101/stage/${gps101StageNumber}/mission/${gps101MissionNumber || id}`);
    } else if (onContinue) {
      onContinue(id);
    }
  };
  
  // NEW: GPS 101-aware accept handler
  const handleAccept = () => {
    if (onAccept) {
      onAccept(id);
    }
  };
  
  if (isLoading) {
    return (
      <div className={`${classNames} mission-detail--loading`}>
        <div className="mission-detail__skeleton-header">
          <div className="mission-detail__skeleton-badge" />
          <div className="mission-detail__skeleton-title" />
          <div className="mission-detail__skeleton-desc" />
        </div>
        <div className="mission-detail__skeleton-content">
          <div className="mission-detail__skeleton-section" />
          <div className="mission-detail__skeleton-section" />
        </div>
      </div>
    );
  }
  
  return (
    <div className={classNames} {...props}>
      {/* NEW: GPS 101 Header Banner */}
      {isGPS101 && (
        <div className="mission-detail__gps101-banner">
          <div className="mission-detail__gps101-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <span>GPS 101 Basic</span>
          </div>
          <div className="mission-detail__gps101-info">
            <span className="mission-detail__gps101-stage">Stage {gps101StageNumber}</span>
            {gps101StageQuestion && (
              <p className="mission-detail__gps101-question">{gps101StageQuestion}</p>
            )}
          </div>
          {isStageCompleter && (
            <div className="mission-detail__stage-completer-badge">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              <span>Stage Completer</span>
            </div>
          )}
        </div>
      )}
      
      {/* Header */}
      <MissionHeader
        id={id}
        title={title}
        description={description}
        type={isGPS101 ? 'gps101' : type}
        status={status}
        difficulty={difficulty}
        stageNumber={stageNumber}
        missionNumber={missionNumber}
        estimatedTime={estimatedTime}
        xpReward={xpReward}
        barakaReward={barakaReward}
        author={author}
        createdAt={createdAt}
        onBack={onBack}
        isGPS101={isGPS101}
        gps101StageNumber={gps101StageNumber}
      />
      
      {/* Content Grid */}
      <div className="mission-detail__content">
        {/* Main Column */}
        <div className="mission-detail__main">
          {/* Prerequisites */}
          {prerequisites.length > 0 && isLocked && (
            <div className="mission-detail__prerequisites">
              <h3 className="mission-detail__prerequisites-title">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                </svg>
                Prerequisites
              </h3>
              <ul className="mission-detail__prerequisites-list">
                {prerequisites.map((prereq, index) => (
                  <li
                    key={index}
                    className={`mission-detail__prereq ${prereq.completed ? 'mission-detail__prereq--completed' : ''}`}
                  >
                    {prereq.completed ? (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    ) : (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                      </svg>
                    )}
                    <span>{prereq.name || prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* NEW: GPS 101 Deliverable Info */}
          {isGPS101 && gps101DeliverableName && isStageCompleter && (
            <div className="mission-detail__gps101-deliverable">
              <h3 className="mission-detail__gps101-deliverable-title">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                </svg>
                Stage Deliverable
              </h3>
              <div className="mission-detail__gps101-deliverable-card">
                <div className="mission-detail__gps101-deliverable-icon">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                  </svg>
                </div>
                <div className="mission-detail__gps101-deliverable-content">
                  <h4 className="mission-detail__gps101-deliverable-name">{gps101DeliverableName}</h4>
                  <p className="mission-detail__gps101-deliverable-desc">
                    Complete this mission to unlock and submit your {gps101DeliverableName}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => navigate('/gps-101/deliverables')}
                  className="mission-detail__gps101-deliverable-btn"
                >
                  View Deliverables
                </button>
              </div>
            </div>
          )}
          
          {/* Objectives */}
          <MissionObjectives
            objectives={objectives}
            onObjectiveClick={onObjectiveClick}
            showProgress={isInProgress}
            collapsible={false}
          />
          
          {/* Tips */}
          {tips.length > 0 && (
            <div className="mission-detail__tips">
              <h3 className="mission-detail__tips-title">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                </svg>
                {isGPS101 ? 'Navigator Tips' : 'Pro Tips'}
              </h3>
              <ul className="mission-detail__tips-list">
                {tips.map((tip, index) => (
                  <li key={index} className="mission-detail__tip">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
                    </svg>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* NEW: GPS 101 Navigator Guidance Link */}
          {isGPS101 && (
            <div className="mission-detail__navigator-cta">
              <div className="mission-detail__navigator-cta-content">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
                </svg>
                <div>
                  <h4>Need guidance?</h4>
                  <p>Ask Navigator AI for help with this mission</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/navigator', { state: { context: 'gps101', missionId: id } })}
                className="mission-detail__navigator-cta-btn"
              >
                Ask Navigator
              </button>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <div className="mission-detail__sidebar">
          {/* Rewards */}
          <MissionRewards
            xpReward={xpReward}
            barakaReward={barakaReward}
            bonusRewards={bonusRewards}
            badges={badges}
            achievements={achievements}
            unlocks={unlocks}
          />
          
          {/* Action Buttons */}
          {showAcceptButton && (
            <div className="mission-detail__actions">
              {isAvailable && (
                <button
                  type="button"
                  onClick={handleAccept}
                  className="mission-detail__action-btn mission-detail__action-btn--accept"
                >
                  Accept Mission
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
              
              {isInProgress && (
                <button
                  type="button"
                  onClick={handleContinue}
                  className="mission-detail__action-btn mission-detail__action-btn--continue"
                >
                  Continue Mission
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                  </svg>
                </button>
              )}
              
              {isCompleted && (
                <div className="mission-detail__completed-badge">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Mission Completed</span>
                </div>
              )}
              
              {isLocked && (
                <div className="mission-detail__locked-badge">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/>
                  </svg>
                  <span>Mission Locked</span>
                </div>
              )}
            </div>
          )}
          
          {/* NEW: GPS 101 Quick Links */}
          {isGPS101 && (
            <div className="mission-detail__gps101-links">
              <h4 className="mission-detail__gps101-links-title">Quick Links</h4>
              <button
                type="button"
                onClick={() => navigate(`/gps-101/stage/${gps101StageNumber}`)}
                className="mission-detail__gps101-link"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
                </svg>
                <span>Back to Stage {gps101StageNumber}</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/gps-101')}
                className="mission-detail__gps101-link"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                </svg>
                <span>GPS 101 Overview</span>
              </button>
              <button
                type="button"
                onClick={() => navigate('/gps-101/deliverables')}
                className="mission-detail__gps101-link"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
                </svg>
                <span>My Deliverables</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;