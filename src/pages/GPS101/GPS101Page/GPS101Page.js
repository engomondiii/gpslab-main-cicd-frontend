/**
 * GPS 101 Main Page
 * * Landing page for GPS 101 Basic course with enrollment and overview.
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
    enroll,
    initialize,
    getWeeksRemaining,
    loading
  } = useGPS101();

  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showEnrollmentModal, setShowEnrollmentModal] = useState(false);

  useEffect(() => {
    initialize();
  }, [initialize]);

  // FIXED: Mock enrollment function to handle frontend-only environments
  const handleEnroll = async () => {
    setIsEnrolling(true);
    
    try {
      // Attempt Redux API call (will fail gracefully if no backend)
      if (enroll) await enroll();
    } catch (error) {
      console.warn('API Enrollment failed, falling back to local mock enrollment.');
    }

    // Mock the enrollment locally
    setTimeout(() => {
      // 1. Get current user from storage
      const storedUserString = localStorage.getItem('gps_user');
      if (storedUserString) {
        const storedUser = JSON.parse(storedUserString);
        // 2. Update enrollment status locally
        storedUser.gps101Enrolled = true;
        // 3. Save back to storage
        localStorage.setItem('gps_user', JSON.stringify(storedUser));
      }
      
      setShowEnrollmentModal(false);
      setIsEnrolling(false);

      // 4. Force a reload so App.js picks up the new status and unlocks everything!
      window.location.reload();
    }, 800); // 800ms delay to simulate loading
  };

  if (loading.enrollment) {
    return (
      <div className="gps101-page loading">
        <div className="loading-spinner" />
        <p>Loading GPS 101...</p>
      </div>
    );
  }

  // Not Enrolled State
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
                A transformative 15-week journey to uncover what you were sent to solve
              </p>
              
              <div className="hero-stats">
                <div className="stat">
                  <span className="stat-number">15</span>
                  <span className="stat-label">Weeks</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5</span>
                  <span className="stat-label">Stages</span>
                </div>
                <div className="stat">
                  <span className="stat-number">30</span>
                  <span className="stat-label">Missions</span>
                </div>
                <div className="stat">
                  <span className="stat-number">5K</span>
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
                <div className="stage-preview">
                  <span className="stage-icon">🎯</span>
                  <span className="stage-text">Stage 1: Who are you?</span>
                </div>
                <div className="stage-preview">
                  <span className="stage-icon">💡</span>
                  <span className="stage-text">Stage 2: Life Meaning</span>
                </div>
                <div className="stage-preview">
                  <span className="stage-icon">📖</span>
                  <span className="stage-text">Stage 3: Problem Owner Story</span>
                </div>
                <div className="stage-preview">
                  <span className="stage-icon">🌟</span>
                  <span className="stage-text">Stage 4: Life Purpose</span>
                </div>
                <div className="stage-preview">
                  <span className="stage-icon">🚀</span>
                  <span className="stage-text">Stage 5: Purpose-Driven Project</span>
                </div>
              </div>
            </div>
          </section>

          {/* What You'll Learn */}
          <section className="learning-section">
            <h2>What You'll Discover</h2>
            <div className="learning-grid">
              <div className="learning-card">
                <div className="learning-icon">🪞</div>
                <h3>Your Identity</h3>
                <p>
                  Understand who you truly are through deep reflection, 
                  timeline analysis, and identity manifestos.
                </p>
              </div>
              <div className="learning-card">
                <div className="learning-icon">❓</div>
                <h3>Your Problem</h3>
                <p>
                  Discover the global problem you were sent to solve 
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
                <div className="learning-icon">🎯</div>
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
                  Earn 5,000 Baraka and unlock the prestigious 
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
                    While designed for 15 weeks, you can move at your own pace. 
                    Each stage takes approximately 3 weeks, with 6 missions per stage.
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
              {GPS_101_CONFIG.DELIVERABLES.map((deliverable, index) => (
                <div key={deliverable.id} className="deliverable-preview-card">
                  <div className="deliverable-number">{index + 1}</div>
                  <h3>{deliverable.name}</h3>
                  <p>{deliverable.description}</p>
                </div>
              ))}
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
                {GPS_101_CONFIG.PREREQUISITES.map((prerequisite, index) => (
                  <div key={index} className="prerequisite-item">
                    <span className="prerequisite-icon">✓</span>
                    <span className="prerequisite-text">{prerequisite}</span>
                  </div>
                ))}
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
              >
                ✕
              </button>

              <div className="modal-content">
                <div className="modal-icon">🎯</div>
                <h2>Enroll in GPS 101 Basic</h2>
                <p className="modal-subtitle">
                  Begin your 15-week journey to discovering your life purpose
                </p>

                <div className="commitment-checklist">
                  <div className="commitment-item">
                    <span className="check-icon">✓</span>
                    <span>I commit to completing all 5 stages</span>
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
                    <span className="info-value">15 weeks</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Mode:</span>
                    <span className="info-value">Solo Journey</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Reward:</span>
                    <span className="info-value">5,000 Baraka + Orange Beacon</span>
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
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Completed State
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

            <div className="completion-stats">
              <div className="completion-stat">
                <span className="stat-icon">✓</span>
                <span className="stat-text">30 Missions Completed</span>
              </div>
              <div className="completion-stat">
                <span className="stat-icon">💎</span>
                <span className="stat-text">5,000 Baraka Earned</span>
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

  // Enrolled & In Progress State
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

        {/* Progress Overview */}
        <div className="progress-overview-section">
          <GPS101ProgressWidget />
        </div>

        {/* Weekly Timeline */}
        <div className="weekly-timeline-section">
          <WeeklyProgressBar
            weeksCompleted={15 - getWeeksRemaining()}
            enrollmentDate={new Date()} // Get from user data
          />
        </div>

        {/* Navigator Guidance */}
        <div className="navigator-section">
          <GPS101NavigatorGuide stageNumber={currentStage} />
        </div>

        {/* Stage Map */}
        <div className="stage-map-section">
          <GPS101StageMap />
        </div>

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
              onClick={() => navigate(`/gps-101/mission/${nextMission.missionId}`)}
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
              onClick={() => navigate(`/gps-101/stage/${currentStage}`)}
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