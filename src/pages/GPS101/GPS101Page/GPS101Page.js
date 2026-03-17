/**
 * GPS 101 Main Page
 * CORRECT STRUCTURE: 5 Stages, 5 Missions (1 per stage), 30 Sub-missions, 150 Checkpoints
 * Landing page with enrollment and comprehensive overview
 * 
 * UPDATED: Added defensive checks for config imports to prevent crashes
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGPS101 from '../../../hooks/useGPS101';
import GPS101StageMap from '../../../components/gps101/GPS101StageMap/GPS101StageMap';
import GPS101ProgressWidget from '../../../components/gps101/GPS101Progress/GPS101ProgressWidget';
import WeeklyProgressBar from '../../../components/gps101/GPS101Progress/WeeklyProgressBar';
import GPS101NavigatorGuide from '../../../components/gps101/GPS101Navigator/GPS101NavigatorGuide';
import { GPS_101_CONFIG } from '../../../config/gps101.config';
import './GPS101Page.css';

const GPS101Page = () => {
  const navigate = useNavigate();
  const {
    isEnrolled,
    isCompleted,
    progressSummary,
    currentStage,
    nextMission,
    barakaProgress,
    stages,
    totalBaraka,
    enroll,
    initialize,
    getWeeksRemaining,
    loading
  } = useGPS101();

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);
  const [enrollmentSuccess, setEnrollmentSuccess] = useState(false);

  // ==================== CONFIG VALIDATION ====================
  // Defensive check: Ensure config is loaded properly
  if (!GPS_101_CONFIG) {
    return (
      <div className="gps101-page error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Configuration Error</h2>
          <p>GPS 101 configuration could not be loaded. Please refresh the page.</p>
          <button onClick={() => window.location.reload()} className="retry-button">
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Defensive check: Ensure required config properties exist
  const safeConfig = {
    DELIVERABLES: GPS_101_CONFIG.DELIVERABLES || [],
    PREREQUISITES: GPS_101_CONFIG.PREREQUISITES || [],
    STAGES: GPS_101_CONFIG.STAGES || [],
    TOTAL_STAGES: GPS_101_CONFIG.TOTAL_STAGES || 5,
    TOTAL_MISSIONS: GPS_101_CONFIG.TOTAL_MISSIONS || 5,
    TOTAL_SUB_MISSIONS: GPS_101_CONFIG.TOTAL_SUB_MISSIONS || 30,
    TOTAL_CHECKPOINTS: GPS_101_CONFIG.TOTAL_CHECKPOINTS || 150,
    TOTAL_BARAKA: GPS_101_CONFIG.TOTAL_BARAKA || 5000,
    DURATION_WEEKS: GPS_101_CONFIG.DURATION_WEEKS || 15
  };

  // Initialize once on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  /**
   * Handle enrollment without page reload
   */
  const handleEnroll = async () => {
    setIsEnrolling(true);
    
    try {
      const result = await enroll();
      
      if (result.success) {
        const storedUserString = localStorage.getItem('gps_user');
        if (storedUserString) {
          const storedUser = JSON.parse(storedUserString);
          storedUser.gps101Enrolled = true;
          localStorage.setItem('gps_user', JSON.stringify(storedUser));
        }
        
        setEnrollmentSuccess(true);
        
        setTimeout(() => {
          setShowEnrollmentModal(false);
          setIsEnrolling(false);
          navigate('/gps101/stage/1');
        }, 800);
        
        return;
      }
    } catch (error) {
      console.warn('API Enrollment failed, using fallback:', error);
    }

    // Fallback enrollment
    const storedUserString = localStorage.getItem('gps_user');
    if (storedUserString) {
      const storedUser = JSON.parse(storedUserString);
      storedUser.gps101Enrolled = true;
      localStorage.setItem('gps_user', JSON.stringify(storedUser));
    }
    
    setEnrollmentSuccess(true);
    
    try {
      await initialize();
    } catch (error) {
      console.warn('Initialize failed:', error);
    }
    
    setTimeout(() => {
      setShowEnrollmentModal(false);
      setIsEnrolling(false);
      navigate('/gps101/stage/1');
    }, 1000);
  };

  // Initial loading state
  if (loading?.enrollment || (!isEnrolled && loading?.progress)) {
    return (
      <div className="gps101-page loading">
        <div className="loading-spinner" />
        <p>Loading GPS 101...</p>
      </div>
    );
  }

  // ==================== NOT ENROLLED STATE ====================
  if (!isEnrolled) {
    return (
      <div className="gps101-page not-enrolled">
        <div className="page-container">
          {/* Hero Section */}
          <section className="hero-section">
            <div className="hero-content">
              <div className="hero-badge">GPS 101 BASIC</div>
              <h1 className="hero-title">
                Discover Your Life Purpose
              </h1>
              <p className="hero-subtitle">
                A transformative {safeConfig.DURATION_WEEKS}-week journey to uncover what you were sent to solve
              </p>
              
              {/* CORRECTED STATS: 5 Stages, 5 Missions, 30 Sub-missions, 150 Checkpoints, 5K Baraka */}
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">{safeConfig.DURATION_WEEKS}</span>
                  <span className="stat-label">Weeks</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{safeConfig.TOTAL_STAGES}</span>
                  <span className="stat-label">Stages</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{safeConfig.TOTAL_MISSIONS || 5}</span>
                  <span className="stat-label">Missions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{safeConfig.TOTAL_SUB_MISSIONS}</span>
                  <span className="stat-label">Sub-missions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{safeConfig.TOTAL_CHECKPOINTS}</span>
                  <span className="stat-label">Checkpoints</span>
                </div>
                <div className="stat">
                  <span className="stat-number">{(safeConfig.TOTAL_BARAKA / 1000).toFixed(0)}K</span>
                  <span className="stat-label">Baraka</span>
                </div>
              </div>

              <button 
                className="enroll-cta-button"
                onClick={() => setShowEnrollmentModal(true)}
              >
                Start Your Journey
              </button>
            </div>

            <div className="hero-visual">
              <div className="journey-preview">
                {/* EXACT STAGE QUESTIONS FROM CURRICULUM */}
                {safeConfig.STAGES.length > 0 ? (
                  safeConfig.STAGES.map((stage) => (
                    <div key={stage.stageId} className="stage-preview">
                      <span className="stage-icon">
                        {stage.stageNumber === 1 ? '🪪' : 
                         stage.stageNumber === 2 ? '🧩' :
                         stage.stageNumber === 3 ? '💝' :
                         stage.stageNumber === 4 ? '✨' : '🚀'}
                      </span>
                      <span className="stage-text">Stage {stage.stageNumber}: {stage.question}</span>
                    </div>
                  ))
                ) : (
                  // Fallback if STAGES array is empty
                  <>
                    <div className="stage-preview">
                      <span className="stage-icon">🪪</span>
                      <span className="stage-text">Stage 1: Who are you?</span>
                    </div>
                    <div className="stage-preview">
                      <span className="stage-icon">🧩</span>
                      <span className="stage-text">Stage 2: What is the meaning of your life?</span>
                    </div>
                    <div className="stage-preview">
                      <span className="stage-icon">💝</span>
                      <span className="stage-text">Stage 3: Whose pain are you called to solve?</span>
                    </div>
                    <div className="stage-preview">
                      <span className="stage-icon">✨</span>
                      <span className="stage-text">Stage 4: What is your life purpose?</span>
                    </div>
                    <div className="stage-preview">
                      <span className="stage-icon">🚀</span>
                      <span className="stage-text">Stage 5: What is your Purpose-driven Project?</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>

          {/* What You'll Discover */}
          <section className="learning-section">
            <h2>What You'll Discover</h2>
            <div className="learning-grid">
              <div className="learning-card">
                <div className="learning-icon">🪪</div>
                <h3>Your Identity</h3>
                <p>
                  Understand who you truly are through deep reflection, 
                  timeline analysis, and identity exploration.
                </p>
              </div>
              <div className="learning-card">
                <div className="learning-icon">🧩</div>
                <h3>Your Problem</h3>
                <p>
                  Discover the meaningful problem you were sent to solve 
                  through systematic exploration and inner reflection.
                </p>
              </div>
              <div className="learning-card">
                <div className="learning-icon">💝</div>
                <h3>Problem Owners</h3>
                <p>
                  Develop genuine empathy by learning the stories of 
                  those affected by your chosen problem.
                </p>
              </div>
              <div className="learning-card">
                <div className="learning-icon">✨</div>
                <h3>Your Purpose</h3>
                <p>
                  Craft a clear, actionable life purpose statement 
                  that guides all your decisions.
                </p>
              </div>
              <div className="learning-card">
                <div className="learning-icon">🚀</div>
                <h3>Your Project</h3>
                <p>
                  Design your first purpose-driven project to make 
                  tangible impact in the world.
                </p>
              </div>
              <div className="learning-card">
                <div className="learning-icon">🏆</div>
                <h3>Orange Beacon</h3>
                <p>
                  Earn {safeConfig.TOTAL_BARAKA.toLocaleString()} Baraka and unlock the prestigious 
                  Orange Beacon upon completion.
                </p>
              </div>
            </div>
          </section>

          {/* Course Structure */}
          <section className="structure-section">
            <h2>Course Structure</h2>
            <div className="structure-content">
              <div className="structure-info">
                <div className="info-item">
                  <h3>Solo Journey</h3>
                  <p>
                    GPS 101 is a personal journey of self-discovery. 
                    You'll work independently through each stage, supported 
                    by Navigator AI and the GPS Lab community.
                  </p>
                </div>
                <div className="info-item">
                  <h3>Flexible Pacing</h3>
                  <p>
                    While designed for {safeConfig.DURATION_WEEKS} weeks, you can move at your own pace. 
                    Each stage takes approximately 3 weeks, with 6 sub-missions per stage.
                  </p>
                </div>
                <div className="info-item">
                  <h3>Rich Deliverables</h3>
                  <p>
                    Each stage culminates in a deliverable that becomes part of 
                    your GPS Portfolio - tangible proof of your purpose discovery.
                  </p>
                </div>
                <div className="info-item">
                  <h3>AI-Powered Support</h3>
                  <p>
                    Navigator AI provides context-aware guidance, ChatGPT prompts, 
                    and personalized tips throughout your journey.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Deliverables Preview */}
          <section className="deliverables-section">
            <h2>Your GPS 101 Portfolio</h2>
            <div className="deliverables-grid">
              {safeConfig.DELIVERABLES.length > 0 ? (
                safeConfig.DELIVERABLES.map((deliverable, index) => (
                  <div key={deliverable.id} className="deliverable-preview-card">
                    <div className="deliverable-number">{index + 1}</div>
                    <h3>{deliverable.name}</h3>
                    <p>{deliverable.description}</p>
                  </div>
                ))
              ) : (
                <p className="no-deliverables">Deliverables information is being loaded...</p>
              )}
            </div>
          </section>

          {/* Prerequisites */}
          <section className="prerequisites-section">
            <h2>Prerequisites</h2>
            <div className="prerequisites-content">
              <p className="prerequisites-intro">
                GPS 101 is designed for anyone seeking purpose. No prior experience needed.
              </p>
              <div className="prerequisites-list">
                {safeConfig.PREREQUISITES.length > 0 ? (
                  safeConfig.PREREQUISITES.map((prerequisite, index) => (
                    <div key={index} className="prerequisite-item">
                      <span className="prerequisite-icon">✓</span>
                      <span className="prerequisite-text">{prerequisite}</span>
                    </div>
                  ))
                ) : (
                  <div className="prerequisite-item">
                    <span className="prerequisite-icon">✓</span>
                    <span className="prerequisite-text">Open heart and willingness to discover your purpose</span>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="final-cta-section">
            <div className="final-cta-content">
              <h2>Ready to Discover Your Purpose?</h2>
              <p>
                Join thousands of Global Problem Solvers who have transformed 
                their lives through GPS 101.
              </p>
              <button 
                className="enroll-final-button"
                onClick={() => setShowEnrollmentModal(true)}
              >
                Enroll in GPS 101 Basic
              </button>
            </div>
          </section>
        </div>

        {/* Enrollment Modal */}
        {showEnrollmentModal && (
          <div className="enrollment-modal-overlay">
            <div className="enrollment-modal">
              <button 
                className="modal-close"
                onClick={() => setShowEnrollmentModal(false)}
                disabled={isEnrolling}
              >
                ✕
              </button>

              <div className="modal-content">
                <div className="modal-icon">
                  {enrollmentSuccess ? '🎉' : '🎯'}
                </div>
                <h2>
                  {enrollmentSuccess ? 'Welcome to GPS 101!' : 'Enroll in GPS 101 Basic'}
                </h2>
                <p className="modal-subtitle">
                  {enrollmentSuccess 
                    ? 'Your purpose discovery journey begins now'
                    : `Begin your ${safeConfig.DURATION_WEEKS}-week journey to discovering your life purpose`
                  }
                </p>

                {!enrollmentSuccess && (
                  <>
                    <div className="commitment-checklist">
                      <div className="commitment-item">
                        <span className="check-icon">✓</span>
                        <span>I commit to completing all {safeConfig.TOTAL_STAGES} stages</span>
                      </div>
                      <div className="commitment-item">
                        <span className="check-icon">✓</span>
                        <span>I will engage authentically with each checkpoint</span>
                      </div>
                      <div className="commitment-item">
                        <span className="check-icon">✓</span>
                        <span>I'm ready to discover my life purpose</span>
                      </div>
                    </div>

                    <div className="enrollment-info">
                      <div className="info-row">
                        <span className="info-label">Duration:</span>
                        <span className="info-value">{safeConfig.DURATION_WEEKS} weeks</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Structure:</span>
                        <span className="info-value">
                          {safeConfig.TOTAL_STAGES} Stages • {safeConfig.TOTAL_MISSIONS} Missions • {safeConfig.TOTAL_SUB_MISSIONS} Sub-missions • {safeConfig.TOTAL_CHECKPOINTS} Checkpoints
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Reward:</span>
                        <span className="info-value">{safeConfig.TOTAL_BARAKA.toLocaleString()} Baraka + Orange Beacon</span>
                      </div>
                    </div>

                    <div className="modal-actions">
                      <button 
                        className="cancel-button"
                        onClick={() => setShowEnrollmentModal(false)}
                        disabled={isEnrolling}
                      >
                        Not Yet
                      </button>
                      <button 
                        className="confirm-enroll-button"
                        onClick={handleEnroll}
                        disabled={isEnrolling}
                      >
                        {isEnrolling ? 'Enrolling...' : 'Start My Journey'}
                      </button>
                    </div>
                  </>
                )}

                {enrollmentSuccess && (
                  <div className="enrollment-success">
                    <p className="success-message">
                      Redirecting to Stage 1...
                    </p>
                    <div className="success-spinner">
                      <div className="spinner-ring" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ==================== COMPLETED STATE ====================
  if (isCompleted) {
    return (
      <div className="gps101-page completed">
        <div className="page-container">
          <div className="completion-hero">
            <div className="completion-badge">
              <div className="badge-icon">🎓</div>
              <div className="badge-glow" />
            </div>
            <h1>GPS 101 Basic Completed!</h1>
            <p className="completion-message">
              You've discovered your life purpose and earned the Orange Beacon
            </p>

            {/* CORRECTED: 5 Stages, 5 Missions, 30 Sub-missions, 150 Checkpoints */}
            <div className="completion-stats">
              <div className="completion-stat">
                <span className="stat-icon">✓</span>
                <span className="stat-text">{safeConfig.TOTAL_STAGES} Stages Completed</span>
              </div>
              <div className="completion-stat">
                <span className="stat-icon">🎯</span>
                <span className="stat-text">{safeConfig.TOTAL_MISSIONS} Missions Completed</span>
              </div>
              <div className="completion-stat">
                <span className="stat-icon">📝</span>
                <span className="stat-text">{safeConfig.TOTAL_SUB_MISSIONS} Sub-missions Completed</span>
              </div>
              <div className="completion-stat">
                <span className="stat-icon">✅</span>
                <span className="stat-text">{safeConfig.TOTAL_CHECKPOINTS} Checkpoints Passed</span>
              </div>
              <div className="completion-stat">
                <span className="stat-icon">💎</span>
                <span className="stat-text">{safeConfig.TOTAL_BARAKA.toLocaleString()} Baraka Earned</span>
              </div>
              <div className="completion-stat">
                <span className="stat-icon">🟠</span>
                <span className="stat-text">Orange Beacon Unlocked</span>
              </div>
            </div>

            <div className="next-steps">
              <h2>What's Next?</h2>
              <div className="next-steps-cards">
                <div className="next-step-card">
                  <h3>GPS Prep</h3>
                  <p>Deep dive into problem analysis and solution design</p>
                  <button 
                    className="next-step-button"
                    onClick={() => navigate('/gps-prep')}
                  >
                    Explore GPS Prep
                  </button>
                </div>
                <div className="next-step-card">
                  <h3>Review Portfolio</h3>
                  <p>Review and refine your GPS 101 deliverables</p>
                  <button 
                    className="next-step-button"
                    onClick={() => navigate('/portfolio')}
                  >
                    View Portfolio
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==================== ENROLLED & IN PROGRESS STATE ====================
  if (loading?.progress || loading?.stages || loading?.missions) {
    return (
      <div className="gps101-page loading">
        <div className="loading-spinner" />
        <p>Loading your GPS 101 progress...</p>
      </div>
    );
  }

  // Calculate correct stats with safe fallbacks
  const totalStages = safeConfig.TOTAL_STAGES;
  const totalMissions = safeConfig.TOTAL_MISSIONS;
  const totalSubMissions = safeConfig.TOTAL_SUB_MISSIONS;
  const totalCheckpoints = safeConfig.TOTAL_CHECKPOINTS;
  const orangeBeaconTarget = safeConfig.TOTAL_BARAKA;

  const completedStages = stages?.filter(s => s.status === 'completed').length || 0;
  const completedMissions = stages?.filter(s => s.mission?.status === 'completed').length || 0;
  const completedSubMissions = stages?.reduce((total, stage) => {
    const mission = stage.mission;
    return total + (mission?.subMissions?.filter(sm => sm.status === 'completed').length || 0);
  }, 0) || 0;
  const completedCheckpoints = stages?.reduce((total, stage) => {
    const mission = stage.mission;
    return total + (mission?.subMissions?.reduce((smTotal, sm) => {
      return smTotal + (sm.checkpoints?.filter(c => c.status === 'passed').length || 0);
    }, 0) || 0);
  }, 0) || 0;

  return (
    <div className="gps101-page enrolled">
      <div className="page-container">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-left">
            <h1>GPS 101 Basic</h1>
            <p className="page-subtitle">
              Your journey to discovering life purpose
            </p>
          </div>
          <div className="header-right">
            <div className="weeks-indicator">
              <span className="weeks-icon">⏰</span>
              <span className="weeks-text">
                {getWeeksRemaining()} weeks remaining
              </span>
            </div>
          </div>
        </div>

        {/* Progress Stats Grid - CORRECTED STATS */}
        <div className="progress-stats-grid">
          <div className="progress-stat-card">
            <div className="stat-icon">🎯</div>
            <div className="stat-content">
              <p className="stat-value">{completedStages}/{totalStages}</p>
              <p className="stat-label">Stages</p>
            </div>
          </div>
          <div className="progress-stat-card">
            <div className="stat-icon">🎖️</div>
            <div className="stat-content">
              <p className="stat-value">{completedMissions}/{totalMissions}</p>
              <p className="stat-label">Missions</p>
            </div>
          </div>
          <div className="progress-stat-card">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <p className="stat-value">{completedSubMissions}/{totalSubMissions}</p>
              <p className="stat-label">Sub-missions</p>
            </div>
          </div>
          <div className="progress-stat-card">
            <div className="stat-icon">✓</div>
            <div className="stat-content">
              <p className="stat-value">{completedCheckpoints}/{totalCheckpoints}</p>
              <p className="stat-label">Checkpoints</p>
            </div>
          </div>
          <div className="progress-stat-card">
            <div className="stat-icon">💎</div>
            <div className="stat-content">
              <p className="stat-value">{totalBaraka || 0}</p>
              <p className="stat-label">Baraka Earned</p>
            </div>
          </div>
        </div>

        {/* Orange Beacon Progress */}
        <div className="orange-beacon-section">
          <div className="orange-beacon-header">
            <div className="beacon-icon">🔥</div>
            <div className="beacon-info">
              <h3>Orange Beacon Progress</h3>
              <p>Earn {orangeBeaconTarget.toLocaleString()} Baraka to unlock the Orange Beacon</p>
            </div>
          </div>
          <div className="beacon-progress-bar">
            <div 
              className="beacon-progress-fill" 
              style={{ width: `${Math.min(((totalBaraka || 0) / orangeBeaconTarget) * 100, 100)}%` }}
            />
            <div className="beacon-progress-label">
              {totalBaraka || 0} / {orangeBeaconTarget.toLocaleString()} ƀ ({(((totalBaraka || 0) / orangeBeaconTarget) * 100).toFixed(1)}%)
            </div>
          </div>
        </div>

        {/* Progress Widget */}
        {progressSummary && (
          <div className="progress-overview-section">
            <GPS101ProgressWidget />
          </div>
        )}

        {/* Weekly Timeline */}
        <div className="weekly-timeline-section">
          <WeeklyProgressBar
            weeksCompleted={safeConfig.DURATION_WEEKS - getWeeksRemaining()}
            enrollmentDate={new Date()}
          />
        </div>

        {/* Navigator Guidance */}
        {currentStage && (
          <div className="navigator-section">
            <GPS101NavigatorGuide stageNumber={currentStage} />
          </div>
        )}

        {/* Stage Map */}
        {progressSummary && (
          <div className="stage-map-section">
            <GPS101StageMap />
          </div>
        )}

        {/* Next Mission CTA */}
        {nextMission && (
          <div className="next-mission-cta">
            <div className="cta-content">
              <h3>Continue Your Journey</h3>
              <p className="mission-title">{nextMission.title}</p>
              <p className="mission-stage">
                Stage {nextMission.stageNumber} • Mission {nextMission.missionNumber}
              </p>
            </div>
            <button 
              className="continue-button"
              onClick={() => navigate(`/gps101/mission/${nextMission.missionId}`)}
            >
              Continue Mission →
            </button>
          </div>
        )}

        {/* Quick Links */}
        <div className="quick-links-section">
          <h2>Quick Access</h2>
          <div className="quick-links-grid">
            <button 
              className="quick-link-card"
              onClick={() => navigate(`/gps101/stage/${currentStage}`)}
            >
              <span className="link-icon">📚</span>
              <span className="link-text">Current Stage</span>
            </button>
            <button 
              className="quick-link-card"
              onClick={() => navigate('/portfolio')}
            >
              <span className="link-icon">📝</span>
              <span className="link-text">Deliverables</span>
            </button>
            <button 
              className="quick-link-card"
              onClick={() => navigate('/study-forge')}
            >
              <span className="link-icon">📖</span>
              <span className="link-text">Study Forge</span>
            </button>
            <button 
              className="quick-link-card"
              onClick={() => navigate('/navigator')}
            >
              <span className="link-icon">🧭</span>
              <span className="link-text">Navigator AI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPS101Page;