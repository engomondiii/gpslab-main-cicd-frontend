/**
 * GPS 101 Stage Page
 * 
 * Individual stage overview with missions and deliverables.
 * 
 * FIXED: All navigation paths now use /gps101 (no dash)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
import CheckpointProgressRing from '../../../components/gps101/GPS101Progress/CheckpointProgressRing';
import { 
  formatStageTitle, 
  formatStageQuestion, 
  formatStageOutcome,
  formatStageDuration,
  formatDeliverableName
} from '../../../utils/formatters/gps101.formatter';
import './GPS101StagePage.css';

const GPS101StagePage = () => {
  const { stageNumber } = useParams();
  const navigate = useNavigate();
  const {
    getCurrentStageData,
    getCurrentStageMissions,
    isStageUnlocked,
    isMissionUnlocked,
    getStageCompletionPercentage,
    getMissionCompletionPercentage,
    getStageDeliverableStatus,
    initialize
  } = useGPS101();

  const [selectedMission, setSelectedMission] = useState(null);

  const stage = getCurrentStageData();
  const missions = getCurrentStageMissions();
  const isUnlocked = isStageUnlocked(parseInt(stageNumber));
  const completion = getStageCompletionPercentage(parseInt(stageNumber));
  const deliverableStatus = getStageDeliverableStatus(parseInt(stageNumber));

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (!isUnlocked) {
      // FIXED: Navigate to /gps101 (no dash)
      navigate('/gps101');
    }
  }, [isUnlocked, navigate]);

  if (!stage) {
    return (
      <div className="gps101-stage-page loading">
        <div className="loading-spinner" />
        <p>Loading stage...</p>
      </div>
    );
  }

  const handleMissionClick = (mission) => {
    if (isMissionUnlocked(mission.missionId)) {
      // FIXED: Navigate to /gps101 (no dash)
      navigate(`/gps101/mission/${mission.missionId}`);
    } else {
      setSelectedMission(mission);
    }
  };

  const handleStartMission = (missionId) => {
    // FIXED: Navigate to /gps101 (no dash)
    navigate(`/gps101/mission/${missionId}`);
  };

  const getMissionStatus = (mission) => {
    const missionCompletion = getMissionCompletionPercentage(mission.missionId);
    if (missionCompletion === 100) return 'completed';
    if (missionCompletion > 0) return 'in-progress';
    if (isMissionUnlocked(mission.missionId)) return 'available';
    return 'locked';
  };

  return (
    <div className="gps101-stage-page">
      <div className="page-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <button 
            className="breadcrumb-link"
            onClick={() => navigate('/gps101')}
          >
            GPS 101
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Stage {stageNumber}</span>
        </div>

        {/* Stage Header */}
        <div className="stage-header">
          <div className="stage-header-content">
            <div className="stage-number-badge">
              Stage {stageNumber}
            </div>
            <h1 className="stage-title">{formatStageTitle(parseInt(stageNumber))}</h1>
            <p className="stage-question">{formatStageQuestion(parseInt(stageNumber))}</p>
            <div className="stage-outcome">
              <span className="outcome-label">Expected Outcome:</span>
              <p className="outcome-text">{formatStageOutcome(parseInt(stageNumber))}</p>
            </div>

            {/* Stage Meta */}
            <div className="stage-meta">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="meta-text">{formatStageDuration(parseInt(stageNumber))}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🎯</span>
                <span className="meta-text">{missions.length} missions</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">📄</span>
                <span className="meta-text">{formatDeliverableName(stage.deliverable)}</span>
              </div>
            </div>
          </div>

          {/* Progress Circle */}
          <div className="stage-progress-circle">
            <svg viewBox="0 0 200 200" className="progress-svg">
              <circle
                className="progress-bg"
                cx="100"
                cy="100"
                r="85"
                fill="none"
                strokeWidth="10"
              />
              <circle
                className="progress-fill"
                cx="100"
                cy="100"
                r="85"
                fill="none"
                strokeWidth="10"
                strokeDasharray={`${(completion / 100) * 534.07} 534.07`}
                transform="rotate(-90 100 100)"
              />
              <text
                x="100"
                y="95"
                textAnchor="middle"
                className="progress-percentage"
              >
                {completion}%
              </text>
              <text
                x="100"
                y="115"
                textAnchor="middle"
                className="progress-label"
              >
                Complete
              </text>
            </svg>
          </div>
        </div>

        {/* Navigator Guidance */}
        <div className="navigator-section">
          <GPS101NavigatorGuide stageNumber={parseInt(stageNumber)} />
        </div>

        {/* Missions Grid */}
        <div className="missions-section">
          <div className="section-header">
            <h2>Stage Missions</h2>
            <p className="section-subtitle">
              Complete all {missions.length} missions to unlock the next stage
            </p>
          </div>

          <div className="missions-grid">
            {missions.map((mission, index) => {
              const status = getMissionStatus(mission);
              const missionCompletion = getMissionCompletionPercentage(mission.missionId);
              const isLocked = !isMissionUnlocked(mission.missionId);

              return (
                <div
                  key={mission.missionId}
                  className={`mission-card ${status} ${isLocked ? 'locked' : ''}`}
                  onClick={() => handleMissionClick(mission)}
                  role="button"
                  tabIndex={isLocked ? -1 : 0}
                >
                  {/* Mission Number Badge */}
                  <div className="mission-number-badge">
                    <span className="mission-number">M{mission.missionNumber}</span>
                  </div>

                  {/* Mission Status Badge */}
                  <div className={`mission-status ${status}`}>
                    <span className="status-icon">
                      {status === 'completed' ? '✓' : 
                       status === 'in-progress' ? '⏳' : 
                       status === 'available' ? '→' : '🔒'}
                    </span>
                    <span className="status-text">
                      {status === 'completed' ? 'Completed' : 
                       status === 'in-progress' ? 'In Progress' : 
                       status === 'available' ? 'Available' : 'Locked'}
                    </span>
                  </div>

                  {/* Mission Content */}
                  <div className="mission-card-content">
                    <h3 className="mission-title">{mission.title}</h3>
                    {mission.titleKo && (
                      <p className="mission-title-ko">{mission.titleKo}</p>
                    )}

                    {/* Mission Description */}
                    {mission.description && (
                      <p className="mission-description">{mission.description}</p>
                    )}

                    {/* Checkpoint Progress */}
                    {!isLocked && (
                      <div className="checkpoint-progress">
                        <CheckpointProgressRing
                          completed={Math.floor((missionCompletion / 100) * mission.checkpoints.length)}
                          total={mission.checkpoints.length}
                          size="small"
                          showLabel={false}
                        />
                        <span className="checkpoint-count">
                          {Math.floor((missionCompletion / 100) * mission.checkpoints.length)}/
                          {mission.checkpoints.length} Checkpoints
                        </span>
                      </div>
                    )}

                    {/* Stage Completer Badge */}
                    {mission.isStageCompleter && (
                      <div className="stage-completer-badge">
                        <span className="badge-icon">🏆</span>
                        <span className="badge-text">Stage Completer</span>
                      </div>
                    )}
                  </div>

                  {/* Mission Footer */}
                  <div className="mission-card-footer">
                    {!isLocked && (
                      <button 
                        className="mission-action-button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartMission(mission.missionId);
                        }}
                      >
                        {status === 'completed' ? 'Review' : 
                         status === 'in-progress' ? 'Continue' : 
                         'Start Mission'}
                      </button>
                    )}
                    {isLocked && (
                      <div className="locked-message">
                        Complete previous mission
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deliverable Section */}
        <div className="deliverable-section">
          <div className="section-header">
            <h2>Stage Deliverable</h2>
            <p className="section-subtitle">
              Your final output for this stage
            </p>
          </div>

          <div className={`deliverable-card ${deliverableStatus.completed ? 'completed' : ''}`}>
            <div className="deliverable-icon">📄</div>
            <div className="deliverable-content">
              <h3>{deliverableStatus.name}</h3>
              <p className="deliverable-description">
                {parseInt(stageNumber) === 1 && "A comprehensive statement defining who you are"}
                {parseInt(stageNumber) === 2 && "A curated list of 5-20 global problems that resonate with you"}
                {parseInt(stageNumber) === 3 && "A compelling narrative about people affected by your chosen problem"}
                {parseInt(stageNumber) === 4 && "A clear, actionable statement of your life purpose"}
                {parseInt(stageNumber) === 5 && "A detailed plan for your first purpose-driven initiative"}
              </p>

              {deliverableStatus.completed ? (
                <div className="deliverable-status completed">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Submitted</span>
                </div>
              ) : (
                <div className="deliverable-status pending">
                  <span className="status-icon">⏳</span>
                  <span className="status-text">Complete missions to unlock</span>
                </div>
              )}
            </div>

            {deliverableStatus.completed && (
              <button 
                className="view-deliverable-button"
                onClick={() => navigate('/portfolio')}
              >
                View in Portfolio
              </button>
            )}
          </div>
        </div>

        {/* Stage Navigation */}
        <div className="stage-navigation">
          {parseInt(stageNumber) > 1 && (
            <button 
              className="nav-button prev"
              onClick={() => navigate(`/gps101/stage/${parseInt(stageNumber) - 1}`)}
            >
              ← Previous Stage
            </button>
          )}
          
          {parseInt(stageNumber) < 5 && (
            <button 
              className="nav-button next"
              onClick={() => navigate(`/gps101/stage/${parseInt(stageNumber) + 1}`)}
              disabled={completion < 100}
            >
              Next Stage →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPS101StagePage;