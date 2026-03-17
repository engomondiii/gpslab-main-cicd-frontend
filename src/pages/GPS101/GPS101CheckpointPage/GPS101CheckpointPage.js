/**
 * GPS 101 Checkpoint Page
 * CORRECT STRUCTURE: Part of 150 total checkpoints (5 per sub-mission × 30 sub-missions)
 * Individual checkpoint view with submission form and comprehensive feedback
 * Routes: All use /gps101 (no dash)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import GPS101CheckpointForm from '../../../components/gps101/GPS101Checkpoint/GPS101CheckpointForm';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
// FIX: Import GPS_101_ALL_MISSIONS so we can scan for the parent sub-mission and
// mission of a checkpoint. Checkpoint objects from the constants file do NOT carry
// subMissionId or missionId fields, so the previous code
//   getSubMissionById(checkpoint.subMissionId)  →  always null
// was broken. We resolve the hierarchy by scanning the constants directly.
import { GPS_101_ALL_MISSIONS } from '../../../utils/constants/gps101.constants';
import './GPS101CheckpointPage.css';

const GPS101CheckpointPage = () => {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  const {
    getCheckpointById,
    getSubMissionById,
    getMissionById,
    isCheckpointUnlocked,
    submitCheckpoint,
    retryCheckpoint,
    getR2RBalance,
    getPR2RBalance,
    initialize,
    loading
  } = useGPS101();

  const [submissionResult, setSubmissionResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Get checkpoint from context (scans GPS_101_ALL_MISSIONS internally)
  const checkpoint = getCheckpointById(checkpointId);

  // FIX: checkpoint objects in gps101.constants do NOT have subMissionId or missionId
  // fields, so `getSubMissionById(checkpoint.subMissionId)` always returned null,
  // breaking breadcrumbs, navigator guidance, sub-mission progress display, and
  // the "continue to next checkpoint" navigation. We now scan GPS_101_ALL_MISSIONS
  // directly to find the parent sub-mission and mission for any given checkpoint ID.
  let subMission = null;
  let mission = null;
  if (checkpoint && GPS_101_ALL_MISSIONS) {
    outer: for (const m of GPS_101_ALL_MISSIONS) {
      if (!m.subMissions) continue;
      for (const sm of m.subMissions) {
        if (sm.checkpoints?.some(cp => cp.checkpointId === checkpointId)) {
          subMission = sm;
          mission = m;
          break outer;
        }
      }
    }
  }

  const isUnlocked = checkpoint ? isCheckpointUnlocked(checkpointId) : false;
  
  // Get R2R balances with fallback
  const r2rBalance = typeof getR2RBalance === 'function' ? getR2RBalance() : 3;
  const pr2rBalance = typeof getPR2RBalance === 'function' ? getPR2RBalance() : 2;

  // Redirect if not found or locked (after loading completes)
  useEffect(() => {
    if (!loading.checkpoints) {
      if (!checkpoint) {
        console.log('Checkpoint not found, redirecting...');
        const timeout = setTimeout(() => navigate('/gps101'), 1000);
        return () => clearTimeout(timeout);
      }
      if (!isUnlocked) {
        console.log('Checkpoint locked, redirecting...');
        navigate('/gps101');
      }
    }
  }, [loading.checkpoints, checkpoint, isUnlocked, navigate]);

  // FIX: loading is a Redux object {}, not a boolean.
  // The original `loading && !checkpoint` was ALWAYS truthy (object is truthy)
  // so the loading screen showed forever whenever checkpoint was null (e.g. bad URL).
  // Now we only check the specific boolean loading.checkpoints property.
  if (loading?.checkpoints || false) {
    return (
      <div className="gps101-checkpoint-page loading">
        <div className="loading-spinner" />
        <p>Loading checkpoint...</p>
      </div>
    );
  }

  // Error state - checkpoint not found
  if (!checkpoint) {
    return (
      <div className="gps101-checkpoint-page error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Checkpoint Not Found</h2>
          <p>The checkpoint you're looking for could not be loaded.</p>
          <div className="error-actions">
            <button 
              className="back-button"
              onClick={() => navigate('/gps101')}
            >
              ← Back to GPS 101
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Error state - checkpoint locked
  if (!isUnlocked) {
    return (
      <div className="gps101-checkpoint-page error">
        <div className="error-container">
          <div className="error-icon">🔒</div>
          <h2>Checkpoint Locked</h2>
          <p>Complete previous checkpoints to unlock this one.</p>
          <div className="error-actions">
            <button 
              className="back-button"
              onClick={() => navigate('/gps101')}
            >
              ← Back to GPS 101
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Handle checkpoint submission
   */
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);
    
    try {
      const result = await submitCheckpoint(checkpointId, formData);
      
      if (result?.success) {
        setSubmissionResult(result.data);
        setShowResultModal(true);
      } else {
        throw new Error('API unavailable');
      }
    } catch (error) {
      console.log('API not available, using mock submission result');
      
      // Mock successful submission for development
      setSubmissionResult({
        passed: true,
        score: 85,
        feedback: 'Great work! Your answer demonstrates solid understanding of the concepts.',
        barakaEarned: 33,
        xpEarned: 5
      });
      setShowResultModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle save draft
   */
  const handleSaveDraft = async (formData) => {
    console.log('Saving draft:', formData);
    
    try {
      const drafts = JSON.parse(localStorage.getItem('gps101_checkpoint_drafts') || '{}');
      drafts[checkpointId] = {
        ...formData,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem('gps101_checkpoint_drafts', JSON.stringify(drafts));
      
      // Show brief success feedback
      console.log('Draft saved successfully');
    } catch (err) {
      console.error('Could not save draft:', err);
    }
  };

  /**
   * Handle retry with R2R or pR2R
   */
  const handleRetry = async (retryType) => {
    console.log(`Retrying with ${retryType}`);
    
    try {
      const result = await retryCheckpoint(checkpointId, retryType);
      
      if (result?.success) {
        setShowResultModal(false);
        window.location.reload();
      } else {
        throw new Error('Retry failed');
      }
    } catch (error) {
      console.log('Retry API not available, reloading page');
      setShowResultModal(false);
      window.location.reload();
    }
  };

  /**
   * Handle continue to next checkpoint
   */
  const handleContinue = () => {
    setShowResultModal(false);
    
    const nextCheckpoint = getNextCheckpoint();
    if (nextCheckpoint) {
      navigate(`/gps101/checkpoint/${nextCheckpoint.checkpointId}`);
    } else if (subMission) {
      // No more checkpoints in this sub-mission, go to sub-mission completion
      navigate(`/gps101/submission/${subMission.subMissionId}/complete`);
    } else if (mission) {
      // Fallback to mission page
      navigate(`/gps101/mission/${mission.missionId}`);
    } else {
      navigate('/gps101');
    }
  };

  /**
   * Get next checkpoint in sub-mission
   */
  const getNextCheckpoint = () => {
    if (!subMission?.checkpoints) return null;
    
    const currentIndex = subMission.checkpoints.findIndex(
      cp => cp.checkpointId === checkpointId
    );
    
    return subMission.checkpoints[currentIndex + 1] || null;
  };

  /**
   * Format checkpoint type display
   */
  const formatCheckpointType = (type) => {
    const types = {
      'reflection': 'Reflection',
      'essay': 'Essay',
      'multiple_choice': 'Multiple Choice',
      'short_answer': 'Short Answer',
      'case_study': 'Case Study',
      'research': 'Research',
      'analysis': 'Analysis'
    };
    return types[type] || type;
  };

  /**
   * Format Baraka amount
   */
  const formatBaraka = (amount) => `${amount} ƀ`;

  /**
   * Format XP amount
   */
  const formatXP = (amount) => `${amount} XP`;

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
          {mission && (
            <>
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
                Mission
              </button>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          {subMission && (
            <>
              <button 
                className="breadcrumb-link"
                onClick={() => navigate(`/gps101/submission/${subMission.subMissionId}`)}
              >
                Sub-mission {subMission.order}
              </button>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span className="breadcrumb-current">Checkpoint {checkpoint.order}</span>
        </div>

        {/* Checkpoint Header */}
        <div className="checkpoint-header">
          <div className="checkpoint-badge-row">
            <div className="checkpoint-number-badge">
              Checkpoint {checkpoint.order} of 5
            </div>
            <div className="checkpoint-type-badge">
              {formatCheckpointType(checkpoint.type)}
            </div>
            {checkpoint.status === 'passed' && (
              <div className="checkpoint-status-badge passed">
                <span className="status-icon">✓</span>
                <span className="status-text">Passed</span>
              </div>
            )}
          </div>

          <h1 className="checkpoint-question">
            {checkpoint.question}
          </h1>
          {checkpoint.questionKo && (
            <p className="checkpoint-question-ko">{checkpoint.questionKo}</p>
          )}

          {/* Context/Description */}
          {checkpoint.context && (
            <div className="checkpoint-context">
              <p>{checkpoint.context}</p>
            </div>
          )}

          {/* Requirements Banner */}
          <div className="checkpoint-requirements-banner">
            <span className="requirements-icon">ℹ️</span>
            <div className="requirements-content">
              <span className="requirements-text">
                {checkpoint.requirements || 
                 `Provide a thoughtful ${formatCheckpointType(checkpoint.type).toLowerCase()} response. Minimum ${checkpoint.minWords || 50} words required.`}
              </span>
              {checkpoint.passingScore && (
                <span className="passing-score">
                  Passing Score: {checkpoint.passingScore}%
                </span>
              )}
            </div>
          </div>

          {/* Rewards */}
          <div className="checkpoint-rewards">
            <div className="reward-item">
              <span className="reward-icon">💎</span>
              <span className="reward-text">{formatBaraka(checkpoint.barakaReward || 33)} Baraka</span>
            </div>
            <div className="reward-item">
              <span className="reward-icon">⭐</span>
              <span className="reward-text">{formatXP(checkpoint.xpReward || 5)} XP</span>
            </div>
          </div>
        </div>

        <div className="checkpoint-content-grid">
          {/* Main Content - Submission Form */}
          <div className="checkpoint-main">
            <GPS101CheckpointForm
              checkpoint={checkpoint}
              onSubmit={handleSubmit}
              onSaveDraft={handleSaveDraft}
              isSubmitting={isSubmitting}
            />
          </div>

          {/* Sidebar - Navigator & Info */}
          <div className="checkpoint-sidebar">
            {/* Navigator Guidance */}
            {mission && (
              <GPS101NavigatorGuide 
                stageNumber={mission.stageNumber}
                missionId={mission.missionId}
                checkpointId={checkpointId}
                context="checkpoint"
              />
            )}

            {/* Progress in Sub-mission */}
            {subMission && (
              <div className="progress-panel">
                <h3>Sub-mission Progress</h3>
                <div className="progress-stats">
                  <div className="progress-bar-container">
                    <div 
                      className="progress-bar-fill"
                      style={{ 
                        width: `${((checkpoint.order - 1) / 5) * 100}%` 
                      }}
                    />
                  </div>
                  <p className="progress-text">
                    Checkpoint {checkpoint.order} of 5
                  </p>
                </div>
              </div>
            )}

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

            {/* Tips Panel */}
            <div className="tips-panel">
              <h3>💡 Tips</h3>
              <ul className="tips-list">
                <li>Take your time to think through your answer</li>
                <li>Save drafts frequently to avoid losing work</li>
                <li>Review the requirements before submitting</li>
                <li>Be specific and provide examples</li>
              </ul>
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
                    <span className="reward-amount">
                      {formatBaraka(submissionResult.barakaEarned || checkpoint.barakaReward || 33)}
                    </span>
                    <span className="reward-label">Baraka</span>
                  </div>
                  <div className="reward-item">
                    <span className="reward-icon">⭐</span>
                    <span className="reward-amount">
                      {formatXP(submissionResult.xpEarned || checkpoint.xpReward || 5)}
                    </span>
                    <span className="reward-label">XP</span>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="result-actions">
                {submissionResult.passed ? (
                  <>
                    <button 
                      className="continue-button"
                      onClick={handleContinue}
                    >
                      {getNextCheckpoint() 
                        ? 'Continue to Next Checkpoint' 
                        : 'Complete Sub-mission'}
                    </button>
                    {mission && (
                      <button 
                        className="back-button secondary"
                        onClick={() => navigate(`/gps101/mission/${mission.missionId}`)}
                      >
                        Back to Mission
                      </button>
                    )}
                  </>
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
                        {r2rBalance === 0 && pr2rBalance === 0 && (
                          <p className="no-retries">No retry rights available</p>
                        )}
                      </div>
                    </div>
                    
                    <button 
                      className="back-button"
                      onClick={() => {
                        if (mission) {
                          navigate(`/gps101/mission/${mission.missionId}`);
                        } else {
                          navigate('/gps101');
                        }
                      }}
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