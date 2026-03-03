/**
 * GPS Lab Platform - MissionBriefing Component
 * GPS 101 INTEGRATION: Shows GPS 101 context, stage info, Navigator guidance
 */

import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BriefingVideo from './BriefingVideo';
import './MissionBriefing.css';

/**
 * MissionBriefing Component
 */
const MissionBriefing = ({
  mission = {},
  onStart,
  onSkip,
  onClose,
  showVideo = true,
  autoPlayVideo = false,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [videoWatched, setVideoWatched] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  
  const {
    id,
    title,
    description,
    briefingText,
    videoUrl,
    videoPoster,
    objectives = [],
    xpReward = 0,
    barakaReward = 0,
    difficulty,
    estimatedTime,
    tips = [],
    // NEW: GPS 101 fields
    isGPS101 = false,
    gps101StageNumber,
    gps101StageQuestion,
    gps101DeliverableName,
    isStageCompleter = false
  } = mission;
  
  /**
   * Handle video completion
   */
  const handleVideoComplete = useCallback(() => {
    setVideoWatched(true);
  }, []);
  
  /**
   * Handle start mission
   */
  const handleStart = useCallback(async () => {
    setIsStarting(true);
    try {
      await onStart?.(id);
    } finally {
      setIsStarting(false);
    }
  }, [id, onStart]);
  
  /**
   * Format time
   */
  const formatTime = (minutes) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };
  
  const classNames = [
    'mission-briefing',
    isGPS101 && 'mission-briefing--gps101',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Background */}
      <div className="mission-briefing__bg">
        <div className="mission-briefing__bg-gradient" />
        <div className="mission-briefing__bg-pattern" />
      </div>
      
      {/* Close Button */}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="mission-briefing__close"
          aria-label="Close briefing"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      )}
      
      {/* Content */}
      <div className="mission-briefing__content">
        {/* NEW: GPS 101 Header Banner */}
        {isGPS101 && (
          <div className="mission-briefing__gps101-header">
            <div className="mission-briefing__gps101-badge">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
              </svg>
              <div className="mission-briefing__gps101-text">
                <span className="mission-briefing__gps101-title">GPS 101 Basic</span>
                <span className="mission-briefing__gps101-stage">Stage {gps101StageNumber}</span>
              </div>
            </div>
            {gps101StageQuestion && (
              <p className="mission-briefing__gps101-question">"{gps101StageQuestion}"</p>
            )}
            {isStageCompleter && gps101DeliverableName && (
              <div className="mission-briefing__gps101-deliverable-badge">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span>Stage Completer • Unlocks: {gps101DeliverableName}</span>
              </div>
            )}
          </div>
        )}
        
        {/* Header */}
        <div className="mission-briefing__header">
          <span className="mission-briefing__label">
            {isGPS101 ? 'Mission Briefing' : 'Mission Briefing'}
          </span>
          <h1 className="mission-briefing__title">{title}</h1>
          <p className="mission-briefing__desc">{description}</p>
        </div>
        
        {/* Video Section */}
        {showVideo && videoUrl && (
          <div className="mission-briefing__video-section">
            <BriefingVideo
              src={videoUrl}
              poster={videoPoster}
              title="Mission Briefing"
              autoPlay={autoPlayVideo}
              onComplete={handleVideoComplete}
            />
            {!videoWatched && (
              <p className="mission-briefing__video-hint">
                {isGPS101
                  ? '📹 Watch the briefing to understand your GPS 101 mission'
                  : 'Watch the briefing video to learn about your mission'}
              </p>
            )}
          </div>
        )}
        
        {/* Briefing Text */}
        {briefingText && (
          <div className="mission-briefing__text">
            <h3 className="mission-briefing__text-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              Your Mission
            </h3>
            <p>{briefingText}</p>
          </div>
        )}
        
        {/* Info Grid */}
        <div className="mission-briefing__info">
          {/* Objectives Preview */}
          <div className="mission-briefing__info-card">
            <h4 className="mission-briefing__info-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
              </svg>
              Objectives
            </h4>
            <ul className="mission-briefing__objectives">
              {objectives.slice(0, 4).map((obj, index) => (
                <li key={index}>{obj.text || obj.title || obj}</li>
              ))}
              {objectives.length > 4 && (
                <li className="mission-briefing__more">+{objectives.length - 4} more</li>
              )}
            </ul>
          </div>
          
          {/* Rewards */}
          <div className="mission-briefing__info-card">
            <h4 className="mission-briefing__info-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Rewards
            </h4>
            <div className="mission-briefing__rewards">
              {xpReward > 0 && (
                <span className="mission-briefing__reward mission-briefing__reward--xp">
                  +{xpReward} XP
                </span>
              )}
              {barakaReward > 0 && (
                <span className="mission-briefing__reward mission-briefing__reward--baraka">
                  +{barakaReward} ƀ
                </span>
              )}
            </div>
          </div>
          
          {/* Stats */}
          <div className="mission-briefing__info-card">
            <h4 className="mission-briefing__info-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
              </svg>
              Details
            </h4>
            <div className="mission-briefing__stats">
              {estimatedTime && (
                <div className="mission-briefing__stat">
                  <span className="mission-briefing__stat-label">Duration</span>
                  <span className="mission-briefing__stat-value">{formatTime(estimatedTime)}</span>
                </div>
              )}
              {difficulty && (
                <div className="mission-briefing__stat">
                  <span className="mission-briefing__stat-label">Difficulty</span>
                  <span className="mission-briefing__stat-value">{difficulty}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Tips */}
        {tips.length > 0 && (
          <div className="mission-briefing__tips">
            <h4 className="mission-briefing__tips-title">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z"/>
              </svg>
              {isGPS101 ? 'Navigator Tips' : 'Pro Tips'}
            </h4>
            <ul className="mission-briefing__tips-list">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
        
        {/* NEW: GPS 101 Navigator CTA */}
        {isGPS101 && (
          <div className="mission-briefing__navigator-banner">
            <div className="mission-briefing__navigator-icon">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
              </svg>
            </div>
            <div className="mission-briefing__navigator-content">
              <h4>Navigator AI is here to help</h4>
              <p>Get personalized guidance for your GPS 101 journey</p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/navigator', { state: { context: 'gps101', missionId: id } })}
              className="mission-briefing__navigator-btn"
            >
              Ask Navigator
            </button>
          </div>
        )}
        
        {/* Actions */}
        <div className="mission-briefing__actions">
          {onSkip && (
            <button
              type="button"
              onClick={onSkip}
              className="mission-briefing__btn mission-briefing__btn--skip"
            >
              Skip Briefing
            </button>
          )}
          
          <button
            type="button"
            onClick={handleStart}
            disabled={isStarting}
            className="mission-briefing__btn mission-briefing__btn--start"
          >
            {isStarting ? (
              <>
                <span className="mission-briefing__spinner" />
                Starting...
              </>
            ) : (
              <>
                {isGPS101 ? 'Begin Mission' : 'Start Mission'}
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MissionBriefing;