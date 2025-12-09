/**
 * GPS Lab Platform - MissionHeader Component
 * 
 * Header section for mission detail page.
 * Displays mission title, status, type, and key info.
 * 
 * @module components/mission/MissionDetail/MissionHeader
 */

import React from 'react';
import { MISSION_STATUS, MISSION_TYPE_ICONS, DIFFICULTY_CONFIG } from '../MissionList/MissionListItem';
import './MissionHeader.css';

/**
 * MissionHeader Component
 */
const MissionHeader = ({
  id,
  title,
  description,
  type = 'standard',
  status = 'available',
  difficulty = 'medium',
  stageNumber,
  missionNumber,
  estimatedTime,
  xpReward = 0,
  barakaReward = 0,
  author,
  createdAt,
  onBack,
  className = '',
  ...props
}) => {
  const statusConfig = MISSION_STATUS[status] || MISSION_STATUS.available;
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const TypeIcon = MISSION_TYPE_ICONS[type] || MISSION_TYPE_ICONS.standard;
  
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
  
  /**
   * Format date
   */
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const classNames = [
    'mission-header',
    `mission-header--${status}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Background */}
      <div className="mission-header__bg">
        <div className="mission-header__bg-gradient" />
        <div className="mission-header__bg-pattern" />
      </div>
      
      {/* Content */}
      <div className="mission-header__content">
        {/* Back Button */}
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="mission-header__back"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Missions
          </button>
        )}
        
        {/* Top Row */}
        <div className="mission-header__top">
          {/* Mission Type Badge */}
          <div className={`mission-header__type mission-header__type--${type}`}>
            {TypeIcon}
            <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
          </div>
          
          {/* Status Badge */}
          <div className={`mission-header__status mission-header__status--${statusConfig.color}`}>
            {statusConfig.icon}
            <span>{statusConfig.label}</span>
          </div>
        </div>
        
        {/* Mission Number */}
        {(stageNumber || missionNumber) && (
          <span className="mission-header__number">
            {stageNumber && `Stage ${stageNumber} • `}Mission {missionNumber}
          </span>
        )}
        
        {/* Title */}
        <h1 className="mission-header__title">{title}</h1>
        
        {/* Description */}
        <p className="mission-header__description">{description}</p>
        
        {/* Meta Grid */}
        <div className="mission-header__meta">
          {/* Difficulty */}
          <div className="mission-header__meta-item">
            <span className="mission-header__meta-label">Difficulty</span>
            <span className={`mission-header__meta-value mission-header__difficulty--${difficultyConfig.color}`}>
              {[...Array(difficultyConfig.stars)].map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
              ))}
              {difficultyConfig.label}
            </span>
          </div>
          
          {/* Time */}
          {estimatedTime && (
            <div className="mission-header__meta-item">
              <span className="mission-header__meta-label">Estimated Time</span>
              <span className="mission-header__meta-value">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                </svg>
                {formatTime(estimatedTime)}
              </span>
            </div>
          )}
          
          {/* XP Reward */}
          {xpReward > 0 && (
            <div className="mission-header__meta-item">
              <span className="mission-header__meta-label">XP Reward</span>
              <span className="mission-header__meta-value mission-header__meta-value--xp">
                +{xpReward} XP
              </span>
            </div>
          )}
          
          {/* Baraka Reward */}
          {barakaReward > 0 && (
            <div className="mission-header__meta-item">
              <span className="mission-header__meta-label">Baraka Reward</span>
              <span className="mission-header__meta-value mission-header__meta-value--baraka">
                +{barakaReward} ƀ
              </span>
            </div>
          )}
        </div>
        
        {/* Author & Date */}
        {(author || createdAt) && (
          <div className="mission-header__footer">
            {author && (
              <span className="mission-header__author">
                Created by <strong>{author}</strong>
              </span>
            )}
            {createdAt && (
              <span className="mission-header__date">
                {formatDate(createdAt)}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionHeader;