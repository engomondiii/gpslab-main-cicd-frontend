/**
 * GPS Lab Platform - MissionObjectives Component
 * 
 * Displays mission objectives with completion tracking.
 * 
 * @module components/mission/MissionDetail/MissionObjectives
 */

import React, { useMemo } from 'react';
import './MissionObjectives.css';

/**
 * Objective type icons
 */
const OBJECTIVE_TYPE_ICONS = {
  task: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
    </svg>
  ),
  quiz: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd"/>
    </svg>
  ),
  coding: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"/>
    </svg>
  ),
  reading: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z"/>
    </svg>
  ),
  video: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
    </svg>
  ),
  submission: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd"/>
    </svg>
  ),
  discussion: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z" clipRule="evenodd"/>
    </svg>
  ),
  bonus: (
    <svg viewBox="0 0 20 20" fill="currentColor">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
    </svg>
  )
};

/**
 * ObjectiveItem Component
 */
const ObjectiveItem = ({ objective, onClick, isBonus = false }) => {
  const TypeIcon = OBJECTIVE_TYPE_ICONS[objective.type] || OBJECTIVE_TYPE_ICONS.task;
  
  return (
    <li 
      className={`mission-objectives__item ${objective.completed ? 'mission-objectives__item--completed' : ''} ${isBonus ? 'mission-objectives__item--bonus' : ''}`}
      onClick={() => onClick?.(objective)}
      role={onClick ? 'button' : undefined}
    >
      <span className="mission-objectives__checkbox">
        {objective.completed ? (
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
          </svg>
        ) : (
          <span className="mission-objectives__checkbox-empty" />
        )}
      </span>
      <span className="mission-objectives__type-icon">{TypeIcon}</span>
      <span className="mission-objectives__text">{objective.text || objective.title}</span>
      {objective.xpReward && (
        <span className="mission-objectives__xp">+{objective.xpReward} XP</span>
      )}
    </li>
  );
};

/**
 * MissionObjectives Component
 */
const MissionObjectives = ({
  objectives = [],
  onObjectiveClick,
  showProgress = true,
  collapsible = false,
  defaultExpanded = true,
  className = '',
  ...props
}) => {
  const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);
  
  const stats = useMemo(() => {
    const total = objectives.length;
    const completed = objectives.filter(obj => obj.completed).length;
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, percentage };
  }, [objectives]);
  
  const groupedObjectives = useMemo(() => {
    const required = objectives.filter(obj => obj.required !== false);
    const bonus = objectives.filter(obj => obj.required === false);
    return { required, bonus };
  }, [objectives]);
  
  const classNames = [
    'mission-objectives',
    collapsible && 'mission-objectives--collapsible',
    !isExpanded && 'mission-objectives--collapsed',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      <div 
        className="mission-objectives__header"
        onClick={collapsible ? () => setIsExpanded(!isExpanded) : undefined}
        role={collapsible ? 'button' : undefined}
      >
        <div className="mission-objectives__title-row">
          <h3 className="mission-objectives__title">Objectives</h3>
          <span className="mission-objectives__count">{stats.completed}/{stats.total}</span>
        </div>
        
        {showProgress && (
          <div className="mission-objectives__progress">
            <div className="mission-objectives__progress-bar">
              <div className="mission-objectives__progress-fill" style={{ width: `${stats.percentage}%` }} />
            </div>
            <span className="mission-objectives__progress-text">{stats.percentage}% complete</span>
          </div>
        )}
        
        {collapsible && (
          <button type="button" className="mission-objectives__toggle">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>
        )}
      </div>
      
      <div className="mission-objectives__content">
        {groupedObjectives.required.length > 0 && (
          <div className="mission-objectives__group">
            <span className="mission-objectives__group-label">Required</span>
            <ul className="mission-objectives__list">
              {groupedObjectives.required.map((objective, index) => (
                <ObjectiveItem key={objective.id || index} objective={objective} onClick={onObjectiveClick} />
              ))}
            </ul>
          </div>
        )}
        
        {groupedObjectives.bonus.length > 0 && (
          <div className="mission-objectives__group mission-objectives__group--bonus">
            <span className="mission-objectives__group-label">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Bonus
            </span>
            <ul className="mission-objectives__list">
              {groupedObjectives.bonus.map((objective, index) => (
                <ObjectiveItem key={objective.id || index} objective={objective} onClick={onObjectiveClick} isBonus />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export { OBJECTIVE_TYPE_ICONS, ObjectiveItem };
export default MissionObjectives;