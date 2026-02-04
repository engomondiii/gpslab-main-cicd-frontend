/**
 * GPS Lab Platform - GPOCallSuccessPage Component
 * 
 * Success page after completing GPO Call.
 * 
 * @module pages/GPOCallPage/GPOCallSuccessPage
 */

import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './GPOCallSuccessPage.css';

/**
 * GPOCallSuccessPage Component
 */
const GPOCallSuccessPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const showcaseData = location.state?.showcaseData;

  return (
    <div className="gpo-success-page">
      <div className="gpo-success-page__container">
        {/* Success Icon */}
        <div className="gpo-success-page__icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
          </svg>
        </div>

        {/* Content */}
        <div className="gpo-success-page__content">
          <h1 className="gpo-success-page__title">
            🎉 Problem Showcase Created!
          </h1>
          <p className="gpo-success-page__subtitle">
            Congratulations! You've successfully created your Problem Showcase. 
            Your problem is now visible to Global Problem Solvers around the world.
          </p>

          {/* Stats */}
          <div className="gpo-success-page__stats">
            <div className="gpo-success-page__stat">
              <div className="gpo-success-page__stat-value">5/5</div>
              <div className="gpo-success-page__stat-label">Stages Completed</div>
            </div>
            <div className="gpo-success-page__stat">
              <div className="gpo-success-page__stat-value">+300</div>
              <div className="gpo-success-page__stat-label">XP Earned</div>
            </div>
            <div className="gpo-success-page__stat">
              <div className="gpo-success-page__stat-value">+100</div>
              <div className="gpo-success-page__stat-label">Baraka Earned</div>
            </div>
          </div>

          {/* Achievement */}
          <div className="gpo-success-page__achievement">
            <div className="gpo-success-page__achievement-icon">🏆</div>
            <div className="gpo-success-page__achievement-content">
              <h3 className="gpo-success-page__achievement-title">
                Achievement Unlocked: Problem Owner
              </h3>
              <p className="gpo-success-page__achievement-text">
                You've taken the first step in solving your problem. 
                You can now access GPS training to become a Problem Solver yourself!
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="gpo-success-page__next-steps">
            <h3 className="gpo-success-page__next-steps-title">
              What's Next?
            </h3>
            <ul className="gpo-success-page__steps-list">
              <li>
                <span className="gpo-success-page__step-icon">📢</span>
                <span>Your Problem Showcase is now live on the GPS Lab globe</span>
              </li>
              <li>
                <span className="gpo-success-page__step-icon">🔔</span>
                <span>You'll receive notifications when Problem Solvers show interest</span>
              </li>
              <li>
                <span className="gpo-success-page__step-icon">🎓</span>
                <span>Start GPS training to learn how to solve problems like yours</span>
              </li>
              <li>
                <span className="gpo-success-page__step-icon">🤝</span>
                <span>Connect with other Problem Owners facing similar challenges</span>
              </li>
            </ul>
          </div>

          {/* Actions */}
          <div className="gpo-success-page__actions">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="gpo-success-page__button gpo-success-page__button--primary"
            >
              Go to Dashboard
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </button>

            <button
              type="button"
              onClick={() => navigate('/showcase')}
              className="gpo-success-page__button gpo-success-page__button--secondary"
            >
              View My Showcase
            </button>

            <button
              type="button"
              onClick={() => navigate('/training')}
              className="gpo-success-page__button gpo-success-page__button--secondary"
            >
              Start GPS Training
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GPOCallSuccessPage;