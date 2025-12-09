/**
 * GPS Lab Platform - MissionDetail Component
 * 
 * Complete mission detail view combining header, objectives, and rewards.
 * 
 * @module components/mission/MissionDetail/MissionDetail
 */

import React from 'react';
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
    progress
  } = mission;
  
  const isAvailable = status === 'available';
  const isInProgress = status === 'in_progress';
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';
  
  const classNames = ['mission-detail', className].filter(Boolean).join(' ');
  
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
      {/* Header */}
      <MissionHeader
        id={id}
        title={title}
        description={description}
        type={type}
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
                  <li key={index} className={`mission-detail__prereq ${prereq.completed ? 'mission-detail__prereq--completed' : ''}`}>
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
                Pro Tips
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
                  onClick={() => onAccept?.(id)}
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
                  onClick={() => onContinue?.(id)}
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
        </div>
      </div>
    </div>
  );
};

export default MissionDetail;