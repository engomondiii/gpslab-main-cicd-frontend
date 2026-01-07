/**
 * GPS Lab Platform - StudyModuleList Component
 * 
 * List container for study modules within a mission.
 * Handles module navigation and progress tracking.
 * 
 * @module components/study/StudyModules/StudyModuleList
 */

import React from 'react';
import StudyModuleItem from './StudyModuleItem';
import './StudyModuleList.css';

/**
 * StudyModuleList Component
 */
const StudyModuleList = ({
  modules = [],
  currentModuleId,
  onModuleSelect,
  showProgress = true,
  variant = 'default',
  className = '',
  ...props
}) => {
  const completedCount = modules.filter(m => m.status === 'completed').length;
  const totalCount = modules.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  
  const classNames = [
    'study-module-list',
    `study-module-list--${variant}`,
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Progress Header */}
      {showProgress && (
        <div className="study-module-list__header">
          <div className="study-module-list__progress-info">
            <span className="study-module-list__progress-label">Module Progress</span>
            <span className="study-module-list__progress-count">
              {completedCount} of {totalCount} complete
            </span>
          </div>
          <div className="study-module-list__progress-bar">
            <div 
              className="study-module-list__progress-fill"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      )}
      
      {/* Modules */}
      <div className="study-module-list__items">
        {modules.length > 0 ? (
          modules.map((module, index) => (
            <StudyModuleItem
              key={module.id}
              number={index + 1}
              isCurrent={currentModuleId === module.id}
              onSelect={onModuleSelect}
              variant={variant === 'compact' ? 'compact' : 'default'}
              {...module}
            />
          ))
        ) : (
          <div className="study-module-list__empty">
            <p>No modules available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyModuleList;