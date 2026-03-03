/**
 * GPS 101 Mission Page
 * 
 * Individual mission view with checkpoints and submission.
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import GPS101CheckpointCard from '../../../components/gps101/GPS101Checkpoint/GPS101CheckpointCard';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
import CheckpointProgressRing from '../../../components/gps101/GPS101Progress/CheckpointProgressRing';
import { 
  formatMissionTitle,
  formatBaraka,
  formatXP 
} from '../../../utils/formatters/gps101.formatter';
import './GPS101MissionPage.css';

const GPS101MissionPage = () => {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const {
    getMissionById,
    getCheckpointById,
    isMissionUnlocked,
    isCheckpointUnlocked,
    getMissionCompletionPercentage,
    startMission,
    completeMission,
    initialize,
    loading
  } = useGPS101();

  const [missionData, setMissionData] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const mission = getMissionById(missionId);
  const isUnlocked = isMissionUnlocked(missionId);
  const completion = getMissionCompletionPercentage(missionId);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (mission) {
      setMissionData(mission);
    }
  }, [mission]);

  useEffect(() => {
    if (!isUnlocked && !loading.missions) {
      navigate('/gps-101');
    }
  }, [isUnlocked, loading.missions, navigate]);

  if (!mission || loading.missions) {
    return (
      <div className="gps101-mission-page loading">
        <div className="loading-spinner" />
        <p>Loading mission...</p>
      </div>
    );
  }

  const handleStartMission = async () => {
    setIsStarting(true);
    const result = await startMission(missionId);
    if (result.success) {
      setMissionData({ ...missionData, status: 'in_progress' });
    }
    setIsStarting(false);
  };

  const handleCompleteMission = async () => {
    const result = await completeMission(missionId);
    if (result.success) {
      setShowCompletionModal(true);
    }
  };

  const handleCheckpointClick = (checkpointId) => {
    if (isCheckpointUnlocked(checkpointId)) {
      navigate(`/gps-101/checkpoint/${checkpointId}`);
    }
  };

  const getCheckpointStatus = (checkpoint) => {
    // This would come from actual checkpoint state
    return 'available'; // placeholder
  };

  const passedCheckpoints = mission.checkpoints.filter(
    cp => getCheckpointStatus(cp) === 'passed'
  ).length;

  const allCheckpointsPassed = passedCheckpoints === mission.checkpoints.length;

  return (
    <div className="gps101-mission-page">
      <div className="page-container">
        {/* Breadcrumb Navigation */}
        <div className="breadcrumb">
          <button 
            className="breadcrumb-link"
            onClick={() => navigate('/gps-101')}
          >
            GPS 101
          </button>
          <span className="breadcrumb-separator">/</span>
          <button 
            className="breadcrumb-link"
            onClick={() => navigate(`/gps-101/stage/${mission.stageNumber}`)}
          >
            Stage {mission.stageNumber}
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Mission {mission.missionNumber}</span>
        </div>

        {/* Mission Header */}
        <div className="mission-header">
          <div className="mission-header-content">
            <div className="mission-badge-row">
              <div className="mission-number-badge">
                Mission {mission.missionNumber}
              </div>
              {mission.isStageCompleter && (
                <div className="stage-completer-badge">
                  <span className="badge-icon">🏆</span>
                  <span className="badge-text">Stage Completer</span>
                </div>
              )}
            </div>

            <h1 className="mission-title">
              {formatMissionTitle(mission)}
            </h1>
            {mission.titleKo && (
              <p className="mission-title-ko">{mission.titleKo}</p>
            )}

            {/* Mission Description */}
            {mission.description && (
              <p className="mission-description">{mission.description}</p>
            )}

            {/* Mission Objectives */}
            {mission.objectives && mission.objectives.length > 0 && (
              <div className="mission-objectives">
                <h3>Learning Objectives</h3>
                <ul className="objectives-list">
                  {mission.objectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mission Stats */}
            <div className="mission-stats">
              <div className="stat-item">
                <span className="stat-icon">✓</span>
                <span className="stat-text">
                  {passedCheckpoints}/{mission.checkpoints.length} Checkpoints
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">💎</span>
                <span className="stat-text">
                  {formatBaraka(150)} Baraka
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-icon">⭐</span>
                <span className="stat-text">
                  {formatXP(30)} XP
                </span>
              </div>
            </div>
          </div>

          {/* Mission Progress */}
          <div className="mission-progress-section">
            <CheckpointProgressRing
              completed={passedCheckpoints}
              total={mission.checkpoints.length}
              size="large"
              showLabel={true}
            />
          </div>
        </div>

        {/* Start Mission CTA */}
        {missionData?.status !== 'in_progress' && missionData?.status !== 'completed' && (
          <div className="start-mission-section">
            <div className="start-mission-card">
              <div className="card-content">
                <h2>Ready to Begin?</h2>
                <p>
                  This mission contains {mission.checkpoints.length} checkpoints. 
                  Complete all checkpoints to finish the mission.
                </p>
              </div>
              <button 
                className="start-mission-button"
                onClick={handleStartMission}
                disabled={isStarting}
              >
                {isStarting ? 'Starting...' : 'Start Mission'}
              </button>
            </div>
          </div>
        )}

        {/* Navigator Guidance */}
        {(missionData?.status === 'in_progress' || missionData?.status === 'completed') && (
          <div className="navigator-section">
            <GPS101NavigatorGuide 
              stageNumber={mission.stageNumber}
              missionId={missionId}
            />
          </div>
        )}

        {/* Checkpoints Grid */}
        {(missionData?.status === 'in_progress' || missionData?.status === 'completed') && (
          <div className="checkpoints-section">
            <div className="section-header">
              <h2>Mission Checkpoints</h2>
              <p className="section-subtitle">
                Complete each checkpoint to progress through the mission
              </p>
            </div>

            <div className="checkpoints-grid">
              {mission.checkpoints.map((checkpoint, index) => {
                const status = getCheckpointStatus(checkpoint);
                const isUnlocked = isCheckpointUnlocked(checkpoint.checkpointId);

                return (
                  <GPS101CheckpointCard
                    key={checkpoint.checkpointId}
                    checkpoint={checkpoint}
                    status={status}
                    isUnlocked={isUnlocked}
                    order={checkpoint.order}
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Complete Mission CTA */}
        {allCheckpointsPassed && missionData?.status !== 'completed' && (
          <div className="complete-mission-section">
            <div className="complete-mission-card">
              <div className="celebration-icon">🎉</div>
              <h2>Mission Complete!</h2>
              <p>
                You've passed all checkpoints. Complete this mission to earn your rewards.
              </p>
              <button 
                className="complete-mission-button"
                onClick={handleCompleteMission}
              >
                Complete Mission
              </button>
            </div>
          </div>
        )}

        {/* Mission Navigation */}
        <div className="mission-navigation">
          <button 
            className="nav-button back"
            onClick={() => navigate(`/gps-101/stage/${mission.stageNumber}`)}
          >
            ← Back to Stage
          </button>
        </div>
      </div>

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="completion-modal-overlay">
          <div className="completion-modal">
            <div className="modal-content">
              <div className="completion-animation">
                <div className="success-checkmark">✓</div>
              </div>

              <h2>Mission Completed!</h2>
              <p className="completion-message">
                Excellent work! You've completed all checkpoints.
              </p>

              {/* Rewards */}
              <div className="rewards-earned">
                <div className="reward-item">
                  <span className="reward-icon">💎</span>
                  <span className="reward-amount">{formatBaraka(150)}</span>
                  <span className="reward-label">Baraka</span>
                </div>
                <div className="reward-item">
                  <span className="reward-icon">⭐</span>
                  <span className="reward-amount">{formatXP(30)}</span>
                  <span className="reward-label">XP</span>
                </div>
              </div>

              {/* Next Steps */}
              <div className="next-steps">
                {mission.isStageCompleter ? (
                  <>
                    <p className="next-step-message">
                      You've completed this stage! Time to submit your deliverable.
                    </p>
                    <button 
                      className="next-action-button"
                      onClick={() => {
                        setShowCompletionModal(false);
                        navigate('/portfolio');
                      }}
                    >
                      Submit Deliverable
                    </button>
                  </>
                ) : (
                  <>
                    <p className="next-step-message">
                      Ready for the next mission?
                    </p>
                    <button 
                      className="next-action-button"
                      onClick={() => {
                        setShowCompletionModal(false);
                        navigate(`/gps-101/stage/${mission.stageNumber}`);
                      }}
                    >
                      Continue to Next Mission
                    </button>
                  </>
                )}
              </div>

              <button 
                className="modal-close-button"
                onClick={() => setShowCompletionModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPS101MissionPage;