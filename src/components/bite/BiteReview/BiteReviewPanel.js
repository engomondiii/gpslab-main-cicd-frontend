/**
 * GPS Lab Platform - BiteReviewPanel Component
 * 
 * Combined review panel with AI and peer reviews.
 * 
 * @module components/bite/BiteReview/BiteReviewPanel
 */

import React, { useState } from 'react';
import BiteAIReview from './BiteAIReview';
import BitePeerReview from './BitePeerReview';
import './BiteReviewPanel.css';

/**
 * Review status configurations
 */
const REVIEW_STATUS = {
  pending: { label: 'Pending Review', color: 'warning', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/></svg> },
  in_review: { label: 'In Review', color: 'info', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd"/></svg> },
  approved: { label: 'Approved', color: 'success', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/></svg> },
  needs_revision: { label: 'Needs Revision', color: 'error', icon: <svg viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/></svg> }
};

/**
 * BiteReviewPanel Component
 */
const BiteReviewPanel = ({
  bite,
  aiReview,
  peerReviews = [],
  reviewStatus = 'pending',
  onSubmitPeerReview,
  onRequestRevision,
  onApprove,
  canReview = false,
  canModerate = false,
  isAIReviewLoading = false,
  aiReviewError = null,
  onRetryAIReview,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('ai');
  
  const statusConfig = REVIEW_STATUS[reviewStatus] || REVIEW_STATUS.pending;
  
  const classNames = ['bite-review-panel', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="bite-review-panel__header">
        <div className="bite-review-panel__header-left">
          <h2 className="bite-review-panel__title">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
            Review
          </h2>
          <div className={`bite-review-panel__status bite-review-panel__status--${statusConfig.color}`}>
            {statusConfig.icon}
            {statusConfig.label}
          </div>
        </div>
        
        {/* Moderation Actions */}
        {canModerate && reviewStatus !== 'approved' && (
          <div className="bite-review-panel__mod-actions">
            {onRequestRevision && (
              <button type="button" onClick={onRequestRevision} className="bite-review-panel__mod-btn bite-review-panel__mod-btn--revision">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
                </svg>
                Request Revision
              </button>
            )}
            {onApprove && (
              <button type="button" onClick={onApprove} className="bite-review-panel__mod-btn bite-review-panel__mod-btn--approve">
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Approve
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Approved Banner */}
      {reviewStatus === 'approved' && (
        <div className="bite-review-panel__approved-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
          </svg>
          <div className="bite-review-panel__approved-text">
            <span className="bite-review-panel__approved-title">Work Approved!</span>
            <span className="bite-review-panel__approved-subtitle">
              {bite?.xpReward && `+${bite.xpReward} XP`}
              {bite?.xpReward && bite?.barakaReward && ' • '}
              {bite?.barakaReward && `+${bite.barakaReward} ƀ Baraka`}
            </span>
          </div>
        </div>
      )}
      
      {/* Revision Needed Banner */}
      {reviewStatus === 'needs_revision' && (
        <div className="bite-review-panel__revision-banner">
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
          </svg>
          <div className="bite-review-panel__revision-text">
            <span className="bite-review-panel__revision-title">Revision Requested</span>
            <span className="bite-review-panel__revision-subtitle">Please address the feedback and resubmit</span>
          </div>
        </div>
      )}
      
      {/* Tabs */}
      <div className="bite-review-panel__tabs">
        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`bite-review-panel__tab ${activeTab === 'ai' ? 'bite-review-panel__tab--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.672 1.911a1 1 0 10-1.932.518l.259.966a1 1 0 001.932-.518l-.26-.966zM2.429 4.74a1 1 0 10-.517 1.932l.966.259a1 1 0 00.517-1.932l-.966-.26zm8.814-.569a1 1 0 00-1.415-1.414l-.707.707a1 1 0 101.414 1.415l.708-.708zm-7.071 7.072l.707-.707A1 1 0 003.465 9.12l-.708.707a1 1 0 001.415 1.415zm3.2-5.171a1 1 0 00-1.3 1.3l4 10a1 1 0 001.823.075l1.38-2.759 3.018 3.02a1 1 0 001.414-1.415l-3.019-3.02 2.76-1.379a1 1 0 00-.076-1.822l-10-4z" clipRule="evenodd"/>
          </svg>
          AI Review
          {aiReview && <span className="bite-review-panel__tab-badge">✓</span>}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('peer')}
          className={`bite-review-panel__tab ${activeTab === 'peer' ? 'bite-review-panel__tab--active' : ''}`}
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"/>
          </svg>
          Peer Reviews
          {peerReviews.length > 0 && (
            <span className="bite-review-panel__tab-count">{peerReviews.length}</span>
          )}
        </button>
      </div>
      
      {/* Tab Content */}
      <div className="bite-review-panel__content">
        {activeTab === 'ai' && (
          <BiteAIReview
            review={aiReview}
            isLoading={isAIReviewLoading}
            error={aiReviewError}
            onRetry={onRetryAIReview}
          />
        )}
        {activeTab === 'peer' && (
          <BitePeerReview
            reviews={peerReviews}
            onSubmitReview={onSubmitPeerReview}
            canReview={canReview}
          />
        )}
      </div>
    </div>
  );
};

export default BiteReviewPanel;