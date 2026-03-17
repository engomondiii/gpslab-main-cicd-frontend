/**
 * GPS 101 Mission Page
 * CORRECT STRUCTURE: Each mission has 6 sub-missions, each sub-mission has 5 checkpoints
 * Shows mission briefing, sub-missions grid, and comprehensive progress tracking
 * Routes: All use /gps101 (no dash)
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
import CheckpointProgressRing from '../../../components/gps101/GPS101Progress/CheckpointProgressRing';
import GPS101MissionBriefing from '../../../components/mission/MissionBriefing/GPS101MissionBriefing';
import GPS101BriefingVideo from '../../../components/mission/MissionBriefing/GPS101BriefingVideo';
import GPS101MissionAcceptButton from '../../../components/mission/MissionAccept/GPS101MissionAcceptButton';
import GPS101MissionAcceptModal from '../../../components/mission/MissionAccept/GPS101MissionAcceptModal';
import './GPS101MissionPage.css';

const GPS101MissionPage = () => {
  const { missionId } = useParams();
  const navigate = useNavigate();
  const {
    getMissionById,
    getSubMissionsByMissionId,
    isMissionUnlocked,
    isSubMissionUnlocked,
    getMissionCompletionPercentage,
    startMission,
    completeMission,
    initialize,
    loading
  } = useGPS101();

  // FIX: loading is a Redux object {}, not a boolean. Any non-null object is always
  // truthy, so `if (loading)` and `!loading` never work as intended.
  // Extract specific boolean flags from the loading object instead.
  const isPageLoading = loading?.missions || loading?.progress || loading?.stages || false;

  const [showBriefing, setShowBriefing] = useState(true);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [missionStarted, setMissionStarted] = useState(false);

  const mission = getMissionById(missionId);
  const subMissions = getSubMissionsByMissionId(missionId); // Returns 6 sub-missions
  const isUnlocked = isMissionUnlocked(missionId);
  const completion = getMissionCompletionPercentage(missionId);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (mission) {
      // Check if mission already started from API
      if (mission.status === 'in_progress' || mission.status === 'completed') {
        setMissionStarted(true);
        setShowBriefing(false);
      } else {
        // Check localStorage fallback
        try {
          const startedMissions = JSON.parse(localStorage.getItem('gps101_started_missions') || '[]');
          if (startedMissions.includes(missionId)) {
            setMissionStarted(true);
            setShowBriefing(false);
          }
        } catch (error) {
          console.warn('Could not read from localStorage:', error);
        }
      }
    }
  }, [mission, missionId]);

  // FIX: was `!loading` which is always false because loading={} is always truthy.
  // Now uses the specific boolean isPageLoading.
  useEffect(() => {
    if (!isUnlocked && !isPageLoading) {
      navigate('/gps101');
    }
  }, [isUnlocked, isPageLoading, navigate]);

  // FIX: was `loading` which is always truthy → stuck forever on "Loading mission..."
  // Now uses the specific boolean isPageLoading.
  if (!mission || isPageLoading) {
    return (
      <div className="gps101-mission-page loading">
        <div className="loading-spinner" />
        <p>Loading mission...</p>
      </div>
    );
  }

  /**
   * Handle Accept Mission - with API + localStorage fallback
   */
  const handleAcceptMission = async () => {
    setIsStarting(true);
    
    try {
      const result = await startMission(missionId);
      
      if (result?.success) {
        setMissionStarted(true);
        setShowBriefing(false);
        setShowAcceptModal(false);
        setIsStarting(false);
        return;
      }
    } catch (error) {
      console.warn('API start failed, using fallback:', error);
    }

    // Fallback: Mark as started in localStorage
    try {
      const startedMissions = JSON.parse(localStorage.getItem('gps101_started_missions') || '[]');
      if (!startedMissions.includes(missionId)) {
        startedMissions.push(missionId);
        localStorage.setItem('gps101_started_missions', JSON.stringify(startedMissions));
      }
    } catch (error) {
      console.warn('Could not write to localStorage:', error);
    }

    setMissionStarted(true);
    setShowBriefing(false);
    setShowAcceptModal(false);
    setIsStarting(false);
  };

  /**
   * Handle Complete Mission
   */
  const handleCompleteMission = async () => {
    try {
      const result = await completeMission(missionId);
      if (result?.success) {
        setShowCompletionModal(true);
      }
    } catch (error) {
      console.warn('Complete mission API not available:', error);
      // Fallback: Show modal anyway
      setShowCompletionModal(true);
    }
  };

  /**
   * Handle Sub-mission Click
   */
  const handleSubMissionClick = (subMission, isSubMissionUnlocked) => {
    if (isSubMissionUnlocked && subMission.checkpoints && subMission.checkpoints.length > 0) {
      // Navigate to first checkpoint of this sub-mission
      const firstCheckpoint = subMission.checkpoints[0];
      navigate(`/gps101/checkpoint/${firstCheckpoint.checkpointId}`);
    }
  };

  // Calculate stats - CORRECT NUMBERS
  const totalSubMissions = 6; // Each mission has 6 sub-missions
  const totalCheckpoints = 30; // 5 checkpoints × 6 sub-missions
  
  const completedSubMissions = subMissions?.filter(sm => sm.status === 'completed').length || 0;
  const completedCheckpoints = subMissions?.reduce((total, sm) => {
    return total + (sm.checkpoints?.filter(c => c.status === 'passed').length || 0);
  }, 0) || 0;

  const totalBaraka = mission.barakaReward || 1000; // Default mission baraka
  const earnedBaraka = Math.floor((completion / 100) * totalBaraka);

  const allSubMissionsCompleted = completedSubMissions === totalSubMissions;

  return (
    <div className="gps101-mission-page">
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
          <span className="breadcrumb-current">Mission</span>
        </div>

        {/* SHOW BRIEFING IF NOT STARTED */}
        {showBriefing && !missionStarted ? (
          <div className="mission-briefing-container">
            {/* FIX: Pass onStart so the "Begin Mission" button inside GPS101MissionBriefing
                actually calls handleAcceptMission. Without this prop, onStart?.() is a
                no-op and clicking "Begin Mission" does nothing.
                onSkip lets the user bypass the briefing and go straight to the mission. */}
            <GPS101MissionBriefing
              mission={mission}
              onStart={handleAcceptMission}
              onSkip={() => {
                setShowBriefing(false);
                setMissionStarted(true);
              }}
            />
            
            {mission.videoUrl && (
              <GPS101BriefingVideo 
                videoUrl={mission.videoUrl}
                title={mission.title}
              />
            )}

            <GPS101MissionAcceptButton 
              onClick={() => setShowAcceptModal(true)}
            />

            {showAcceptModal && (
              <GPS101MissionAcceptModal
                mission={mission}
                onAccept={handleAcceptMission}
                onCancel={() => setShowAcceptModal(false)}
                isAccepting={isStarting}
              />
            )}
          </div>
        ) : (
          <>
            {/* MISSION STARTED - SHOW CONTENT */}
            
            {/* Mission Header */}
            <div className="mission-header">
              <div className="mission-header-content">
                <div className="mission-badge-row">
                  <div className="mission-badge">
                    <span className="badge-icon">🎯</span>
                    <span className="badge-text">Mission</span>
                  </div>
                  {mission.isStageCompleter && (
                    <div className="stage-completer-badge">
                      <span className="badge-icon">🏆</span>
                      <span className="badge-text">Stage Completer</span>
                    </div>
                  )}
                </div>

                <h1 className="mission-title">{mission.title}</h1>
                {mission.titleKo && (
                  <p className="mission-title-ko">{mission.titleKo}</p>
                )}
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

                {/* Mission Meta Info */}
                <div className="mission-meta">
                  <div className="meta-item">
                    <span className="meta-icon">🎯</span>
                    <span className="meta-text">Stage {mission.stageNumber}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">📝</span>
                    <span className="meta-text">{totalSubMissions} Sub-missions</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">✓</span>
                    <span className="meta-text">{totalCheckpoints} Checkpoints</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-icon">💎</span>
                    <span className="meta-text">{totalBaraka} ƀ</span>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="progress-stats">
                  <div className="stat-item">
                    <span className="stat-label">Sub-missions</span>
                    <span className="stat-value">{completedSubMissions}/{totalSubMissions}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Checkpoints</span>
                    <span className="stat-value">{completedCheckpoints}/{totalCheckpoints}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Baraka Earned</span>
                    <span className="stat-value">{earnedBaraka}/{totalBaraka} ƀ</span>
                  </div>
                </div>
              </div>

              {/* Progress Circle */}
              <div className="mission-progress-circle">
                <CheckpointProgressRing
                  completed={completedCheckpoints}
                  total={totalCheckpoints}
                  size="large"
                  showLabel={true}
                />
              </div>
            </div>

            {/* Navigator Guidance */}
            <div className="navigator-section">
              <GPS101NavigatorGuide 
                stageNumber={mission.stageNumber}
                missionId={missionId}
                context="mission"
              />
            </div>

            {/* Sub-missions Section */}
            <div className="submissions-section">
              <div className="section-header">
                <h2>Sub-missions ({completedSubMissions}/{totalSubMissions})</h2>
                <p className="section-subtitle">
                  Complete all {totalSubMissions} sub-missions to finish this mission and earn {totalBaraka} Baraka
                </p>
              </div>

              <div className="submissions-grid">
                {subMissions && subMissions.length > 0 ? (
                  subMissions.map((subMission, index) => {
                    // Calculate sub-mission completion (out of 5 checkpoints)
                    const subMissionCheckpointsTotal = 5;
                    const subMissionCheckpointsCompleted = subMission.checkpoints 
                      ? subMission.checkpoints.filter(c => c.status === 'passed').length
                      : 0;
                    const subMissionCompletion = (subMissionCheckpointsCompleted / subMissionCheckpointsTotal) * 100;
                    
                    // Check if this sub-mission is unlocked (previous one completed)
                    const isSubMissionUnlocked = index === 0 || 
                      (subMissions[index - 1] && subMissions[index - 1].status === 'completed');

                    return (
                      <div 
                        key={subMission.subMissionId}
                        className={`submission-card ${subMission.status || 'available'} ${!isSubMissionUnlocked ? 'locked' : ''}`}
                        onClick={() => handleSubMissionClick(subMission, isSubMissionUnlocked)}
                        role="button"
                        tabIndex={isSubMissionUnlocked ? 0 : -1}
                      >
                        {/* Sub-mission Number Badge */}
                        <div className="submission-number">
                          SM{index + 1}
                        </div>

                        {/* Status Badge */}
                        <div className={`submission-status ${subMission.status || 'available'}`}>
                          <span className="status-icon">
                            {subMission.status === 'completed' ? '✓' : 
                             subMission.status === 'in_progress' ? '⏳' : 
                             isSubMissionUnlocked ? '→' : '🔒'}
                          </span>
                          <span className="status-text">
                            {subMission.status === 'completed' ? 'Complete' : 
                             subMission.status === 'in_progress' ? 'In Progress' : 
                             isSubMissionUnlocked ? 'Start' : 'Locked'}
                          </span>
                        </div>

                        {/* Sub-mission Content */}
                        <h3 className="submission-title">{subMission.title}</h3>
                        {subMission.titleKo && (
                          <p className="submission-title-ko">{subMission.titleKo}</p>
                        )}
                        {subMission.description && (
                          <p className="submission-description">{subMission.description}</p>
                        )}

                        {/* Checkpoint Progress Bar */}
                        {isSubMissionUnlocked && (
                          <div className="checkpoint-progress">
                            <div className="progress-bar">
                              <div 
                                className="progress-fill"
                                style={{ width: `${subMissionCompletion}%` }}
                              />
                            </div>
                            <span className="checkpoint-text">
                              {subMissionCheckpointsCompleted}/{subMissionCheckpointsTotal} Checkpoints
                            </span>
                          </div>
                        )}

                        {/* Action Button */}
                        {isSubMissionUnlocked && (
                          <button 
                            className="submission-action"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSubMissionClick(subMission, isSubMissionUnlocked);
                            }}
                          >
                            {subMission.status === 'completed' ? 'Review' : 
                             subMission.status === 'in_progress' ? 'Continue' : 
                             'Start'}
                          </button>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="no-submissions">
                    <p>No sub-missions available for this mission yet.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Complete Mission CTA - Show when all sub-missions done */}
            {allSubMissionsCompleted && mission.status !== 'completed' && (
              <div className="complete-mission-section">
                <div className="complete-mission-card">
                  <div className="celebration-icon">🎉</div>
                  <h2>Mission Complete!</h2>
                  <p>
                    You've completed all {totalSubMissions} sub-missions and {totalCheckpoints} checkpoints. 
                    Complete this mission to earn your rewards.
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
                onClick={() => navigate(`/gps101/stage/${mission.stageNumber}`)}
              >
                ← Back to Stage {mission.stageNumber}
              </button>
            </div>
          </>
        )}
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
                Excellent work! You've completed all {totalSubMissions} sub-missions and {totalCheckpoints} checkpoints.
              </p>

              {/* Rewards */}
              <div className="rewards-earned">
                <div className="reward-item">
                  <span className="reward-icon">💎</span>
                  <span className="reward-amount">{totalBaraka}</span>
                  <span className="reward-label">Baraka</span>
                </div>
                {mission.xpReward && (
                  <div className="reward-item">
                    <span className="reward-icon">⭐</span>
                    <span className="reward-amount">{mission.xpReward}</span>
                    <span className="reward-label">XP</span>
                  </div>
                )}
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
                        navigate(`/gps101/stage/${mission.stageNumber}`);
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