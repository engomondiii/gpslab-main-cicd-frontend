/**
 * GPS 101 Stage Page
 * CORRECT STRUCTURE: Each stage has 1 Mission with 6 Sub-missions (30 Checkpoints total)
 * Routes: All use /gps101 (no dash)
 */

import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
import CheckpointProgressRing from '../../../components/gps101/GPS101Progress/CheckpointProgressRing';
import './GPS101StagePage.css';

// EXACT CURRICULUM DATA - 5 Stages with exact questions
const STAGE_DATA = {
  1: {
    question: "Who are you?",
    outcome: "Identity Statement",
    deliverable: "Identity Statement",
    icon: "🪪",
    duration: "3 weeks",
    description: "Deep self-reflection to understand your values, strengths, and passions. Discover who you are at your core."
  },
  2: {
    question: "What is the meaning of your life?",
    outcome: "Problem Candidate",
    deliverable: "Problem Candidate List",
    icon: "🧩",
    duration: "3 weeks",
    description: "Identify meaningful problems that resonate with your identity and call you to action."
  },
  3: {
    question: "Whose pain are you called to solve?",
    outcome: "Problem Owner Story",
    deliverable: "Problem Owner Story",
    icon: "💝",
    duration: "3 weeks",
    description: "Understand and tell the story of those experiencing your chosen problem. Build genuine empathy."
  },
  4: {
    question: "What is your life purpose?",
    outcome: "Life Purpose Statement",
    deliverable: "Life Purpose Statement",
    icon: "✨",
    duration: "3 weeks",
    description: "Synthesize your identity and problem into a clear, compelling purpose statement."
  },
  5: {
    question: "What is your Purpose-driven Project?",
    outcome: "Purpose-driven Project",
    deliverable: "Purpose-driven Project Plan",
    icon: "🚀",
    duration: "3 weeks",
    description: "Design a concrete project that embodies your purpose and creates tangible impact."
  }
};

const GPS101StagePage = () => {
  const { stageNumber } = useParams();
  const navigate = useNavigate();
  const {
    getStageByNumber,
    getMissionByStageNumber,
    getSubMissionsByMissionId,
    isStageUnlocked,
    getStageCompletionPercentage,
    getStageDeliverableStatus,
    initialize,
    loading
  } = useGPS101();

  const stageNum = parseInt(stageNumber);
  const stage = getStageByNumber(stageNum);
  const mission = getMissionByStageNumber(stageNum); // ONE mission per stage
  const subMissions = mission ? getSubMissionsByMissionId(mission.missionId) : [];
  const stageInfo = STAGE_DATA[stageNum];
  const isUnlocked = isStageUnlocked(stageNum);
  const completion = getStageCompletionPercentage(stageNum);
  const deliverableStatus = getStageDeliverableStatus(stageNum);

  // FIX: loading is a Redux object {}, not a boolean.
  // Destructure specific boolean flags instead of using the object directly.
  const isPageLoading = loading?.stages || loading?.progress || loading?.enrollment || false;

  useEffect(() => {
    initialize();
  }, [initialize]);

  // FIX: was `!loading` which is always false because loading={} is always truthy.
  // Now uses the specific boolean isPageLoading.
  useEffect(() => {
    if (!isUnlocked && !isPageLoading) {
      navigate('/gps101');
    }
  }, [isUnlocked, isPageLoading, navigate]);

  // FIX: was `if (loading || ...)` which always rendered the loading screen.
  // Now uses the specific boolean isPageLoading.
  if (isPageLoading || !stage || !stageInfo) {
    return (
      <div className="gps101-stage-page loading">
        <div className="loading-spinner" />
        <p>Loading stage...</p>
      </div>
    );
  }

  // Calculate progress - CORRECT NUMBERS
  const totalSubMissions = 6; // Each mission has 6 sub-missions
  const totalCheckpoints = 30; // 5 checkpoints × 6 sub-missions
  
  const completedSubMissions = subMissions?.filter(sm => sm.status === 'completed').length || 0;
  const completedCheckpoints = subMissions?.reduce((total, sm) => {
    return total + (sm.checkpoints?.filter(c => c.status === 'passed').length || 0);
  }, 0) || 0;

  const missionStatus = mission?.status || 'locked';
  const totalBaraka = mission?.barakaReward || 1000;

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
          <span className="breadcrumb-current">Stage {stageNum}</span>
        </div>

        {/* Stage Header */}
        <div className="stage-header">
          <div className="stage-header-content">
            <div className="stage-number-badge">
              Stage {stageNum} of 5
            </div>
            
            <h1 className="stage-title">
              {stageInfo.icon} Stage {stageNum}
            </h1>
            
            <p className="stage-question">"{stageInfo.question}"</p>
            
            <div className="stage-outcome">
              <span className="outcome-label">Expected Outcome:</span>
              <p className="outcome-text">{stageInfo.outcome}</p>
            </div>
            
            <p className="stage-description">{stageInfo.description}</p>

            {/* Stage Meta Info */}
            <div className="stage-meta">
              <div className="meta-item">
                <span className="meta-icon">⏱️</span>
                <span className="meta-text">{stageInfo.duration}</span>
              </div>
              <div className="meta-item">
                <span className="meta-icon">🎯</span>
                <span className="meta-text">1 Mission</span>
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
              <div className="meta-item">
                <span className="meta-icon">📄</span>
                <span className="meta-text">{stageInfo.deliverable}</span>
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
          <GPS101NavigatorGuide 
            stageNumber={stageNum}
            context="stage"
          />
        </div>

        {/* Mission Section - ONE MISSION PER STAGE */}
        <div className="mission-section">
          <div className="section-header">
            <h2>Stage Mission</h2>
            <p className="section-subtitle">
              Complete all {totalSubMissions} sub-missions ({totalCheckpoints} checkpoints) to finish this stage
            </p>
          </div>

          {mission ? (
            <div 
              className={`mission-card ${missionStatus}`}
              onClick={() => {
                if (missionStatus !== 'locked') {
                  navigate(`/gps101/mission/${mission.missionId}`);
                }
              }}
              role="button"
              tabIndex={missionStatus === 'locked' ? -1 : 0}
            >
              {/* Mission Number Badge */}
              <div className="mission-number-badge">M1</div>
              
              {/* Mission Status Badge */}
              <div className={`mission-status ${missionStatus}`}>
                <span className="status-icon">
                  {missionStatus === 'completed' ? '✓' : 
                   missionStatus === 'in_progress' ? '⏳' : 
                   missionStatus === 'available' ? '→' : '🔒'}
                </span>
                <span className="status-text">
                  {missionStatus === 'completed' ? 'Completed' : 
                   missionStatus === 'in_progress' ? 'In Progress' : 
                   missionStatus === 'available' ? 'Available' : 'Locked'}
                </span>
              </div>

              {/* Mission Content */}
              <div className="mission-card-content">
                <h3 className="mission-title">{mission.title}</h3>
                {mission.titleKo && (
                  <p className="mission-title-ko">{mission.titleKo}</p>
                )}

                {mission.description && (
                  <p className="mission-description">{mission.description}</p>
                )}

                {/* Mission Objectives */}
                {mission.objectives && mission.objectives.length > 0 && (
                  <div className="mission-objectives">
                    <h4>Learning Objectives</h4>
                    <ul className="objectives-list">
                      {mission.objectives.map((objective, index) => (
                        <li key={index}>{objective}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sub-mission Progress */}
                {missionStatus !== 'locked' && (
                  <div className="checkpoint-progress">
                    <CheckpointProgressRing
                      completed={completedSubMissions}
                      total={totalSubMissions}
                      size="small"
                      showLabel={false}
                    />
                    <span className="checkpoint-count">
                      {completedSubMissions}/{totalSubMissions} Sub-missions
                    </span>
                  </div>
                )}

                {/* Checkpoint Progress */}
                {missionStatus !== 'locked' && (
                  <div className="checkpoint-progress">
                    <span className="checkpoint-icon">✓</span>
                    <span className="checkpoint-count">
                      {completedCheckpoints}/{totalCheckpoints} Checkpoints Passed
                    </span>
                  </div>
                )}

                {mission.isStageCompleter && (
                  <div className="stage-completer-badge">
                    <span className="badge-icon">🏆</span>
                    <span className="badge-text">Stage Completer</span>
                  </div>
                )}
              </div>

              {/* Mission Footer */}
              <div className="mission-card-footer">
                {missionStatus !== 'locked' ? (
                  <button 
                    className="mission-action-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/gps101/mission/${mission.missionId}`);
                    }}
                  >
                    {missionStatus === 'completed' ? 'Review Mission' : 
                     missionStatus === 'in_progress' ? 'Continue Mission' : 
                     'Start Mission'}
                  </button>
                ) : (
                  <div className="locked-message">
                    Complete previous stage to unlock
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-mission-card">
              <p>No mission available for this stage yet.</p>
            </div>
          )}
        </div>

        {/* Deliverable Section */}
        <div className="deliverable-section">
          <div className="section-header">
            <h2>Stage Deliverable</h2>
            <p className="section-subtitle">
              Your final output for Stage {stageNum}
            </p>
          </div>

          <div className={`deliverable-card ${deliverableStatus?.completed ? 'completed' : ''}`}>
            <div className="deliverable-icon">{stageInfo.icon}</div>
            <div className="deliverable-content">
              <h3>{stageInfo.deliverable}</h3>
              <p className="deliverable-description">{stageInfo.description}</p>
              
              {deliverableStatus?.completed ? (
                <div className="deliverable-status completed">
                  <span className="status-icon">✓</span>
                  <span className="status-text">Submitted</span>
                </div>
              ) : completion === 100 ? (
                <div className="deliverable-status ready">
                  <span className="status-icon">→</span>
                  <span className="status-text">Ready to Submit</span>
                </div>
              ) : (
                <div className="deliverable-status pending">
                  <span className="status-icon">⏳</span>
                  <span className="status-text">
                    Complete all {totalSubMissions} sub-missions to unlock
                  </span>
                </div>
              )}
            </div>

            {completion === 100 && !deliverableStatus?.completed && (
              <button 
                className="view-deliverable-button"
                onClick={() => navigate('/portfolio')}
              >
                Submit Deliverable
              </button>
            )}

            {deliverableStatus?.completed && (
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
          {stageNum > 1 && (
            <button 
              className="nav-button prev"
              onClick={() => navigate(`/gps101/stage/${stageNum - 1}`)}
            >
              ← Previous Stage
            </button>
          )}
          
          {stageNum < 5 && (
            <button 
              className="nav-button next"
              onClick={() => navigate(`/gps101/stage/${stageNum + 1}`)}
              disabled={completion < 100}
            >
              Next Stage →
            </button>
          )}

          {stageNum === 5 && completion === 100 && (
            <button 
              className="nav-button complete"
              onClick={() => navigate('/gps101')}
            >
              Complete GPS 101 →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GPS101StagePage;