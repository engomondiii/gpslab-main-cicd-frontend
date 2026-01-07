/**
 * GPS Lab Platform - CheckpointFeedback Component
 * 
 * Main feedback container that combines AI and Mentor feedback.
 * Provides tabbed interface for different feedback sources.
 * 
 * @module components/checkpoint/CheckpointFeedback/CheckpointFeedback
 */

import React, { useState } from 'react';
import AIFeedback from './AIFeedback';
import MentorFeedback from './MentorFeedback';
import './CheckpointFeedback.css';

/**
 * CheckpointFeedback Component
 */
const CheckpointFeedback = ({
  checkpoint,
  aiFeedback = {},
  mentorFeedback = {},
  mentor,
  criteriaFeedback = [],
  onRequestMentorReview,
  onScheduleSession,
  onSendMentorMessage,
  onThankMentor,
  onAskAI,
  isAILoading = false,
  isMentorLoading = false,
  hasThankedMentor = false,
  defaultTab = 'ai',
  showTabs = true,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab);
  
  const hasMentorFeedback = mentor && Object.keys(mentorFeedback).length > 0;
  
  const classNames = [
    'checkpoint-feedback',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="checkpoint-feedback__header">
        <h2 className="checkpoint-feedback__title">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
          </svg>
          Feedback & Insights
        </h2>
        <p className="checkpoint-feedback__subtitle">
          Review your performance feedback from AI and mentors
        </p>
      </div>
      
      {/* Tabs */}
      {showTabs && (
        <div className="checkpoint-feedback__tabs">
          <button
            type="button"
            className={`checkpoint-feedback__tab ${activeTab === 'ai' ? 'checkpoint-feedback__tab--active' : ''}`}
            onClick={() => setActiveTab('ai')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>AI Navigator</span>
            {isAILoading && <span className="checkpoint-feedback__tab-loading" />}
          </button>
          <button
            type="button"
            className={`checkpoint-feedback__tab ${activeTab === 'mentor' ? 'checkpoint-feedback__tab--active' : ''}`}
            onClick={() => setActiveTab('mentor')}
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Mentor</span>
            {hasMentorFeedback && <span className="checkpoint-feedback__tab-badge">New</span>}
            {isMentorLoading && <span className="checkpoint-feedback__tab-loading" />}
          </button>
        </div>
      )}
      
      {/* Content */}
      <div className="checkpoint-feedback__content">
        {/* AI Feedback Tab */}
        {activeTab === 'ai' && (
          <AIFeedback
            feedback={aiFeedback}
            criteriaFeedback={criteriaFeedback}
            isLoading={isAILoading}
            onAskQuestion={onAskAI}
          />
        )}
        
        {/* Mentor Feedback Tab */}
        {activeTab === 'mentor' && (
          <MentorFeedback
            mentor={mentor}
            feedback={mentorFeedback}
            isLoading={isMentorLoading}
            onRequestSession={onScheduleSession}
            onSendMessage={onSendMentorMessage}
            onThankMentor={onThankMentor}
            hasThanked={hasThankedMentor}
          />
        )}
      </div>
      
      {/* Quick Actions */}
      {!showTabs && (
        <div className="checkpoint-feedback__quick-actions">
          {!hasMentorFeedback && onRequestMentorReview && (
            <button
              type="button"
              className="checkpoint-feedback__quick-action"
              onClick={onRequestMentorReview}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
              </svg>
              Request Mentor Review
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckpointFeedback;