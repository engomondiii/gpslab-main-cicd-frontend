/**
 * GPS 101 Dashboard Widget
 * 
 * Dashboard widget showing GPS 101 progress and quick actions.
 * 
 * FIXED: All navigation paths now use /gps101 (no dash)
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import { 
  formatBaraka, 
  formatWeeks,
  formatMissionCount 
} from '../../../utils/formatters/gps101.formatter';
import './GPS101Dashboard.css';

const GPS101Dashboard = () => {
  const navigate = useNavigate();
  const {
    isEnrolled,
    progressSummary,
    currentStage,
    nextMission,
    barakaProgress,
    getWeeksRemaining,
    isCompleted
  } = useGPS101();

  if (!isEnrolled) {
    return (
      <div className="gps101-dashboard-widget">
        <div className="enrollment-prompt">
          <div className="prompt-icon">🎯</div>
          <h3>Start Your GPS 101 Journey</h3>
          <p>Discover your life purpose through a transformative 15-week course</p>
          <button 
            className="enroll-button"
            onClick={() => navigate('/gps101')}
          >
            Learn More & Enroll
          </button>
        </div>
      </div>
    );
  }

  if (isCompleted) {
    return (
      <div className="gps101-dashboard-widget completed">
        <div className="completion-celebration">
          <div className="celebration-icon">🎓</div>
          <h3>GPS 101 Completed!</h3>
          <p className="completion-message">
            You've discovered your life purpose. Ready for GPS Prep?
          </p>
          <div className="completion-stats">
            <div className="stat">
              <span className="stat-icon">🏆</span>
              <span className="stat-value">30 Missions</span>
            </div>
            <div className="stat">
              <span className="stat-icon">💎</span>
              <span className="stat-value">{formatBaraka(barakaProgress.current)}</span>
            </div>
          </div>
          <button 
            className="next-course-button"
            onClick={() => navigate('/gps-prep')}
          >
            Continue to GPS Prep
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="gps101-dashboard-widget">
      {/* Header */}
      <div className="widget-header">
        <div className="header-left">
          <h3 className="widget-title">GPS 101 Journey</h3>
          <p className="widget-subtitle">
            {formatWeeks(getWeeksRemaining())} remaining
          </p>
        </div>
        <div className="header-right">
          <button 
            className="view-all-button"
            onClick={() => navigate('/gps101')}
          >
            View All
          </button>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="progress-overview">
        <div className="progress-stat">
          <span className="stat-label">Current Stage</span>
          <span className="stat-value">Stage {currentStage}/5</span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Missions</span>
          <span className="stat-value">
            {formatMissionCount(
              progressSummary.missions.completed, 
              progressSummary.missions.total
            )}
          </span>
        </div>
        <div className="progress-stat">
          <span className="stat-label">Overall</span>
          <span className="stat-value">{progressSummary.overallProgress}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="overall-progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progressSummary.overallProgress}%` }}
        />
      </div>

      {/* Orange Beacon Progress */}
      <div className="beacon-progress">
        <div className="beacon-header">
          <span className="beacon-icon">🟠</span>
          <span className="beacon-label">Orange Beacon Progress</span>
        </div>
        <div className="beacon-bar">
          <div 
            className="beacon-fill"
            style={{ width: `${barakaProgress.percentage}%` }}
          />
        </div>
        <div className="beacon-info">
          <span className="beacon-current">{formatBaraka(barakaProgress.current)}</span>
          <span className="beacon-separator">/</span>
          <span className="beacon-target">{formatBaraka(barakaProgress.target)}</span>
        </div>
      </div>

      {/* Next Mission */}
      {nextMission && (
        <div className="next-mission-section">
          <div className="section-label">Up Next</div>
          <div className="next-mission-card">
            <div className="mission-info">
              <h4 className="mission-title">{nextMission.title}</h4>
              <p className="mission-stage">
                Stage {nextMission.stageNumber} • Mission {nextMission.missionNumber}
              </p>
            </div>
            <button 
              className="start-mission-button"
              onClick={() => navigate(`/gps101/mission/${nextMission.missionId}`)}
            >
              Start →
            </button>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions">
        <button 
          className="action-button"
          onClick={() => navigate(`/gps101/stage/${currentStage}`)}
        >
          <span className="action-icon">📚</span>
          <span className="action-text">Current Stage</span>
        </button>
        <button 
          className="action-button"
          onClick={() => navigate('/portfolio')}
        >
          <span className="action-icon">📝</span>
          <span className="action-text">Deliverables</span>
        </button>
      </div>
    </div>
  );
};

export default GPS101Dashboard;