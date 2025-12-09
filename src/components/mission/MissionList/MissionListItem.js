/**
 * GPS Lab Platform - MissionListItem Component
 * 
 * Individual mission card displaying mission info in list view.
 * 
 * @module components/mission/MissionList/MissionListItem
 */

import React, { useMemo } from 'react';
import './MissionListItem.css';

const MISSION_STATUS = {
  locked: { label: 'Locked', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg>, color: 'locked' },
  available: { label: 'Available', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd"/></svg>, color: 'available' },
  in_progress: { label: 'In Progress', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg>, color: 'in_progress' },
  completed: { label: 'Completed', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg>, color: 'completed' },
  failed: { label: 'Failed', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/></svg>, color: 'failed' }
};

const MISSION_TYPE_ICONS = {
  standard: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/></svg>,
  boss: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
  checkpoint: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>,
  challenge: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z"/></svg>,
  party: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
};

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: 'success', stars: 1 },
  medium: { label: 'Medium', color: 'warning', stars: 2 },
  hard: { label: 'Hard', color: 'error', stars: 3 },
  expert: { label: 'Expert', color: 'secondary', stars: 4 }
};

const formatTime = (minutes) => {
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

const MissionListItem = ({
  id, title, description, type = 'standard', status = 'available', difficulty = 'medium',
  stageNumber, missionNumber, estimatedTime, progress = 0, xpReward = 0, barakaReward = 0,
  objectives = [], tags = [], isPartyMission = false, partySize, onClick, onAccept,
  size = 'medium', variant = 'default', className = '', ...props
}) => {
  const statusConfig = MISSION_STATUS[status] || MISSION_STATUS.available;
  const difficultyConfig = DIFFICULTY_CONFIG[difficulty] || DIFFICULTY_CONFIG.medium;
  const TypeIcon = MISSION_TYPE_ICONS[type] || MISSION_TYPE_ICONS.standard;
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isInProgress = status === 'in_progress';
  
  const completedObjectives = useMemo(() => objectives.filter(obj => obj.completed).length, [objectives]);
  
  const classNames = ['mission-list-item', `mission-list-item--${status}`, `mission-list-item--${size}`, `mission-list-item--${variant}`, onClick && !isLocked && 'mission-list-item--clickable', className].filter(Boolean).join(' ');
  
  const handleClick = () => { if (!isLocked && onClick) onClick(id); };
  const handleAccept = (e) => { e.stopPropagation(); if (onAccept && status === 'available') onAccept(id); };
  
  return (
    <div className={classNames} onClick={handleClick} role={onClick && !isLocked ? 'button' : undefined} tabIndex={onClick && !isLocked ? 0 : undefined} aria-disabled={isLocked} {...props}>
      <div className={`mission-list-item__type mission-list-item__type--${type}`}>
        {TypeIcon}
        {isPartyMission && <span className="mission-list-item__party-badge">{partySize || '2-8'}</span>}
      </div>
      
      <div className="mission-list-item__content">
        <div className="mission-list-item__header">
          <div className="mission-list-item__title-row">
            {missionNumber && <span className="mission-list-item__number">{stageNumber && `S${stageNumber}.`}M{missionNumber}</span>}
            <h3 className="mission-list-item__title">{title}</h3>
          </div>
          <div className={`mission-list-item__status mission-list-item__status--${statusConfig.color}`}>
            {statusConfig.icon}<span>{statusConfig.label}</span>
          </div>
        </div>
        
        <p className="mission-list-item__description">{description}</p>
        
        {isInProgress && (
          <div className="mission-list-item__progress">
            <div className="mission-list-item__progress-bar"><div className="mission-list-item__progress-fill" style={{ width: `${progress}%` }} /></div>
            <span className="mission-list-item__progress-text">{progress}% • {completedObjectives}/{objectives.length} objectives</span>
          </div>
        )}
        
        <div className="mission-list-item__meta">
          <div className={`mission-list-item__difficulty mission-list-item__difficulty--${difficultyConfig.color}`}>
            {[...Array(difficultyConfig.stars)].map((_, i) => <svg key={i} viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>)}
            <span>{difficultyConfig.label}</span>
          </div>
          {estimatedTime && <div className="mission-list-item__time"><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg><span>{formatTime(estimatedTime)}</span></div>}
          {tags.length > 0 && <div className="mission-list-item__tags">{tags.slice(0, 3).map(tag => <span key={tag} className="mission-list-item__tag">{tag}</span>)}</div>}
        </div>
      </div>
      
      <div className="mission-list-item__actions">
        {!isLocked && (xpReward > 0 || barakaReward > 0) && (
          <div className="mission-list-item__rewards">
            {xpReward > 0 && <span className="mission-list-item__reward mission-list-item__reward--xp">+{xpReward} XP</span>}
            {barakaReward > 0 && <span className="mission-list-item__reward mission-list-item__reward--baraka">+{barakaReward} ƀ</span>}
          </div>
        )}
        {status === 'available' && onAccept && <button type="button" onClick={handleAccept} className="mission-list-item__accept-btn">Accept<svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/></svg></button>}
        {isInProgress && <button type="button" onClick={handleClick} className="mission-list-item__continue-btn">Continue<svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/></svg></button>}
        {isCompleted && <div className="mission-list-item__completed-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg></div>}
        {isLocked && <div className="mission-list-item__locked-badge"><svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"/></svg></div>}
      </div>
    </div>
  );
};

export { MISSION_STATUS, MISSION_TYPE_ICONS, DIFFICULTY_CONFIG };
export default MissionListItem;