/**
 * GPS 101 Checkpoint Page
 * 
 * Individual checkpoint view with submission form.
 * 
 * FIXED: All navigation paths now use /gps101 (no dash)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import CheckpointSubmission from '../../../components/gps101/GPS101Checkpoint/CheckpointSubmission';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
import { 
  formatCheckpointType,
  formatCheckpointRequirements,
  formatBaraka,
  formatXP
} from '../../../utils/formatters/gps101.formatter';
import './GPS101CheckpointPage.css';

const GPS101CheckpointPage = () => {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const {
    getCheckpointById,
    getMissionById,
    isCheckpointUnlocked,
    submitCheckpoint,
    retryCheckpoint,
    getR2RBalance,
    getPR2RBalance,
    initialize,
    loading
  } = useGPS101();

  const [checkpointData, setCheckpointData] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);

  const checkpoint = getCheckpointById(checkpointId);
  const mission = checkpoint ? getMissionById(checkpoint.missionId) : null;
  const isUnlocked = isCheckpointUnlocked(checkpointId);
  const r2rBalance = getR2RBalance();
  const pr2rBalance = getPR2RBalance();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (checkpoint) {
      setCheckpointData(checkpoint);
    }
  }, [checkpoint]);

  useEffect(() => {
    if (!isUnlocked && !loading.checkpoints) {
      // FIXED: Navigate to /gps101 (no dash)
      navigate('/gps101');
    }
  }, [isUnlocked, loading.checkpoints, navigate]);

  if (!checkpoint || !mission || loading.checkpoints) {
    return (
      <div className="gps101-checkpoint-page loading">
        <div className="loading-spinner" />
        <p>Loading checkpoint...</p>
      </div>
    );
  }

  const handleSubmit = async (submissionData) => {
    const result = await submitCheckpoint(checkpointId, submissionData);
    
    if (result.success) {
      setSubmissionResult(result.data);
      setShowResultModal(true);
    }
  };

  const handleSaveDraft = async (draftData) => {
    // Save draft logic
    console.log('Draft saved:', draftData);
  };

  const handleRetry = async (retryType) => {
    const result = await retryCheckpoint(checkpointId, retryType);
    
    if (result.success) {
      setShowResultModal(false);
      window.location.reload();
    }
  };

  const handleContinue = () => {
    setShowResultModal(false);
    
    // Navigate to next checkpoint or back to mission
    const nextCheckpoint = getNextCheckpointInMission();
    if (nextCheckpoint) {
      // FIXED: Navigate to /gps101 (no dash)
      navigate(`/gps101/checkpoint/${nextCheckpoint.checkpointId}`);
    } else {
      // FIXED: Navigate to /gps101 (no dash)
      navigate(`/gps101/mission/${mission.missionId}`);
    }
  };

  const getNextCheckpointInMission = () => {
    const currentIndex = mission.checkpoints.findIndex(
      cp => cp.checkpointId === checkpointId
    );
    return mission.checkpoints[currentIndex + 1] || null;
  };

  return (
    <div className="gps101-checkpoint-page">
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
          <button 
            className="breadcrumb-link"
            onClick={() => navigate(`/gps101/stage/${mission.stageNumber}`)}
          >
            Stage {mission.stageNumber}
          </button>
          <span className="breadcrumb-separator">/</span>
          <button 
            className="breadcrumb-link"
            onClick={() => navigate(`/gps101/mission/${mission.missionId}`)}
          >
            Mission {mission.missionNumber}
          </button>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current">Checkpoint {checkpoint.order}</span>
        </div>

        {/* Checkpoint Header */}
        <div className="checkpoint-header">
          <div className="checkpoint-badge-row">
            <div className="checkpoint-number-badge">
              Checkpoint {checkpoint.order}
            </div>
            <div className="checkpoint-type-badge">
              {formatCheckpointType(checkpoint.type)}
            </div>
          </div>

          <h1 className="checkpoint-question">
            {checkpoint.question}
          </h1>
          {checkpoint.questionKo && (
            <p className="checkpoint-question-ko">{checkpoint.questionKo}</p>
          )}

          {/* Requirements */}
          <div className="checkpoint-requirements-banner">
            <span className="requirements-icon">ℹ️</span>
            <span className="requirements-text">
              {formatCheckpointRequirements(checkpoint)}
            </span>
          </div>

          {/* Rewards */}
          <div className="checkpoint-rewards">
            <div className="reward-item">
              <span className="reward-icon">💎</span>
              <span className="reward-text">{formatBaraka(25)} Baraka</span>
            </div>
            <div className="reward-item">
              <span className="reward-icon">⭐</span>
              <span className="reward-text">{formatXP(5)} XP</span>
            </div>
          </div>
        </div>

        <div className="checkpoint-content-grid">
          {/* Main Content - Submission Form */}
          <div className="checkpoint-main">
            <CheckpointSubmission
              checkpoint={checkpoint}
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              initialData={checkpointData?.submission}
            />
          </div>

          {/* Sidebar - Navigator & R2R */}
          <div className="checkpoint-sidebar">
            {/* Navigator Guidance */}
            <GPS101NavigatorGuide 
              stageNumber={mission.stageNumber}
              missionId={mission.missionId}
              checkpointId={checkpointId}
            />

            {/* R2R/pR2R Panel */}
            <div className="r2r-panel">
              <h3>Retry Rights</h3>
              <div className="r2r-balances">
                <div className="r2r-item">
                  <span className="r2r-label">R2R Balance</span>
                  <span className="r2r-value">{r2rBalance}</span>
                </div>
                <div className="r2r-item">
                  <span className="r2r-label">pR2R Balance</span>
                  <span className="r2r-value">{pr2rBalance}</span>
                </div>
              </div>
              <p className="r2r-info">
                Use retry rights to resubmit if you don't pass on first attempt.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Result Modal */}
      {showResultModal && submissionResult && (
        <div className="result-modal-overlay">
          <div className={`result-modal ${submissionResult.passed ? 'passed' : 'failed'}`}>
            <div className="modal-content">
              {/* Result Icon */}
              <div className="result-icon">
                {submissionResult.passed ? '✓' : '✗'}
              </div>

              {/* Result Title */}
              <h2>
                {submissionResult.passed ? 'Checkpoint Passed!' : 'Not Quite There'}
              </h2>

              {/* Score */}
              <div className="result-score">
                <span className="score-label">Your Score</span>
                <span className="score-value">{submissionResult.score}%</span>
                <span className="score-threshold">
                  (Passing: {checkpoint.passingScore || 70}%)
                </span>
              </div>

              {/* Feedback */}
              {submissionResult.feedback && (
                <div className="result-feedback">
                  <h3>Feedback</h3>
                  <p>{submissionResult.feedback}</p>
                </div>
              )}

              {/* Rewards (if passed) */}
              {submissionResult.passed && (
                <div className="rewards-earned">
                  <div className="reward-item">
                    <span className="reward-icon">💎</span>
                    <span className="reward-amount">{formatBaraka(25)}</span>
                    <span className="reward-label">Baraka</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">⭐</span>
                    <span className="reward-amount">{formatXP(5)}</span>
                    <span className="reward-label">XP</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="result-actions">
                {submissionResult.passed ? (
                  <button 
                    className="continue-button"
                    onClick={handleContinue}
                  >
                    Continue to Next Checkpoint
                  </button>
                ) : (
                  <>
                    <div className="retry-options">
                      <p className="retry-message">
                        Use retry rights to try again
                      </p>
                      <div className="retry-buttons">
                        {r2rBalance > 0 && (
                          <button 
                            className="retry-button r2r"
                            onClick={() => handleRetry('R2R')}
                          >
                            Use R2R ({r2rBalance} left)
                          </button>
                        )}
                        {pr2rBalance > 0 && (
                          <button 
                            className="retry-button pr2r"
                            onClick={() => handleRetry('pR2R')}
                          >
                            Use pR2R ({pr2rBalance} left)
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      className="back-button"
                      onClick={() => navigate(`/gps101/mission/${mission.missionId}`)}
                    >
                      Back to Mission
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPS101CheckpointPage;