/**
 * Weekly Progress Bar Component
 * 
 * Shows week-by-week progress through GPS 101.
 */

import React from 'react';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import './WeeklyProgressBar.css';

const WeeklyProgressBar = ({ weeksCompleted, enrollmentDate }) => {
  const totalWeeks = GPS_101_CONFIG.DURATION_WEEKS;
  const weeks = Array.from({ length: totalWeeks }, (_, i) => i + 1);

  const getCurrentWeek = () => {
    if (!enrollmentDate) return 1;
    
    const now = new Date();
    const enrolled = new Date(enrollmentDate);
    const diffTime = Math.abs(now - enrolled);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const currentWeek = Math.ceil(diffDays / 7);
    
    return Math.min(currentWeek, totalWeeks);
  };

  const currentWeek = getCurrentWeek();

  const getWeekStatus = (weekNumber) => {
    if (weekNumber < currentWeek) return 'completed';
    if (weekNumber === currentWeek) return 'current';
    return 'upcoming';
  };

  const getWeekStage = (weekNumber) => {
    return Math.ceil(weekNumber / 3);
  };

  return (
    <div className="weekly-progress-bar">
      <div className="weekly-progress-header">
        <h4>15-Week Journey</h4>
        <span className="current-week-label">Week {currentWeek}</span>
      </div>

      <div className="weeks-container">
        <div className="weeks-grid">
          {weeks.map((week) => {
            const status = getWeekStatus(week);
            const stage = getWeekStage(week);

            return (
              <div
                key={week}
                className={`week-block ${status}`}
                title={`Week ${week} - Stage ${stage}`}
              >
                <div className="week-number">{week}</div>
                {status === 'completed' && (
                  <div className="week-checkmark">✓</div>
                )}
                {status === 'current' && (
                  <div className="week-pulse" />
                )}
              </div>
            );
          })}
        </div>

        {/* Stage Markers */}
        <div className="stage-markers">
          {[1, 2, 3, 4, 5].map((stage) => (
            <div 
              key={stage}
              className="stage-marker"
              style={{ left: `${((stage * 3 - 1.5) / totalWeeks) * 100}%` }}
            >
              <div className="stage-marker-line" />
              <div className="stage-marker-label">Stage {stage}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Summary */}
      <div className="weekly-progress-summary">
        <div className="summary-item">
          <span className="summary-label">Completed</span>
          <span className="summary-value">{currentWeek - 1} weeks</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Remaining</span>
          <span className="summary-value">{totalWeeks - currentWeek + 1} weeks</span>
        </div>
        <div className="summary-item">
          <span className="summary-label">Completion</span>
          <span className="summary-value">
            {Math.round(((currentWeek - 1) / totalWeeks) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default WeeklyProgressBar;