/**
 * GPS Lab Platform - NavigatorGuidance Component
 * GPS 101 INTEGRATION: GPS 101 stage/mission/checkpoint guidance
 * 
 * Comprehensive guidance panel showing suggestions,
 * tips, progress insights, and contextual help.
 * 
 * @module components/navigator/NavigatorGuidance/NavigatorGuidance
 */

import React, { useState, useCallback } from 'react';
import GuidanceSuggestions from './GuidanceSuggestions';
import './NavigatorGuidance.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * Stage name mapping
 */
const STAGE_NAMES = {
  1: 'Spark',
  2: 'Explore',
  3: 'Design',
  4: 'Build',
  5: 'Test',
  6: 'Launch',
  7: 'Scale'
};

/**
 * NEW: GPS 101 stage names
 */
const GPS101_STAGE_NAMES = {
  1: 'Identity',
  2: 'Problem',
  3: 'Owner',
  4: 'Purpose',
  5: 'Project'
};

/**
 * NavigatorGuidance Component
 */
const NavigatorGuidance = ({
  user = {},
  suggestions = [],
  dailyTip = null,
  progressInsights = [],
  // NEW: GPS 101 props
  isGPS101Enrolled = false,
  gps101CurrentStage = 1,
  gps101Progress = 0,
  gps101Suggestions = [],
  gps101DailyTip = null,
  showGPS101Section = true,
  onSuggestionClick,
  onTipDismiss,
  onOpenChat,
  onRefresh,
  isLoading = false,
  className = '',
  ...props
}) => {
  const [activeTab, setActiveTab] = useState('suggestions');
  const [dismissedTip, setDismissedTip] = useState(false);
  const [dismissedGPS101Tip, setDismissedGPS101Tip] = useState(false);
  const [showGPS101Only, setShowGPS101Only] = useState(false);
  
  const {
    name: userName = 'GPS Student',
    stage: userStage = 1,
    progress = {},
    streak = 0
  } = user;
  
  const beaconColor = getBeaconColor(userStage);
  const stageName = STAGE_NAMES[userStage] || 'Unknown';
  
  const handleTipDismiss = useCallback(() => {
    setDismissedTip(true);
    if (onTipDismiss) {
      onTipDismiss(dailyTip?.id);
    }
  }, [dailyTip, onTipDismiss]);
  
  const handleGPS101TipDismiss = useCallback(() => {
    setDismissedGPS101Tip(true);
    if (onTipDismiss) {
      onTipDismiss(gps101DailyTip?.id);
    }
  }, [gps101DailyTip, onTipDismiss]);
  
  const classNames = [
    'navigator-guidance',
    isLoading && 'navigator-guidance--loading',
    isGPS101Enrolled && showGPS101Section && 'navigator-guidance--with-gps101',
    className
  ].filter(Boolean).join(' ');
  
  // Combine suggestions
  const displaySuggestions = showGPS101Only 
    ? gps101Suggestions 
    : [...gps101Suggestions, ...suggestions];
  
  return (
    <div className={classNames} style={{ '--beacon-color': beaconColor }} {...props}>
      {/* Header */}
      <header className="navigator-guidance__header">
        <div className="navigator-guidance__header-left">
          <div className="navigator-guidance__avatar">
            <span className="navigator-guidance__avatar-icon">🧭</span>
          </div>
          <div className="navigator-guidance__header-info">
            <h2 className="navigator-guidance__title">Navigator Guidance</h2>
            <p className="navigator-guidance__greeting">
              Hi {userName}! Here's your personalized guidance.
            </p>
          </div>
        </div>
        
        <div className="navigator-guidance__header-actions">
          {onRefresh && (
            <button
              type="button"
              className="navigator-guidance__refresh-btn"
              onClick={onRefresh}
              disabled={isLoading}
              title="Refresh"
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd"/>
              </svg>
            </button>
          )}
          {onOpenChat && (
            <button
              type="button"
              className="navigator-guidance__chat-btn"
              onClick={onOpenChat}
            >
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
              Chat with Navigator
            </button>
          )}
        </div>
      </header>
      
      {/* Stage Overview */}
      <div className="navigator-guidance__stage">
        <div className="navigator-guidance__stage-beacon" />
        <div className="navigator-guidance__stage-info">
          <span className="navigator-guidance__stage-label">Current Stage</span>
          <span className="navigator-guidance__stage-name">
            Stage {userStage}: {stageName}
          </span>
        </div>
        {streak > 0 && (
          <div className="navigator-guidance__streak">
            <span className="navigator-guidance__streak-icon">🔥</span>
            <span className="navigator-guidance__streak-count">{streak} day streak</span>
          </div>
        )}
      </div>
      
      {/* NEW: GPS 101 Status Section */}
      {isGPS101Enrolled && showGPS101Section && (
        <div className="navigator-guidance__gps101">
          <div className="navigator-guidance__gps101-header">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
            </svg>
            <div className="navigator-guidance__gps101-info">
              <span className="navigator-guidance__gps101-label">GPS 101 Progress</span>
              <span className="navigator-guidance__gps101-stage">
                Stage {gps101CurrentStage}/5: {GPS101_STAGE_NAMES[gps101CurrentStage]}
              </span>
            </div>
            <button
              type="button"
              className={`navigator-guidance__gps101-filter ${showGPS101Only ? 'navigator-guidance__gps101-filter--active' : ''}`}
              onClick={() => setShowGPS101Only(!showGPS101Only)}
              title="Show GPS 101 guidance only"
            >
              GPS 101 Only
            </button>
          </div>
          
          <div className="navigator-guidance__gps101-progress">
            <div className="navigator-guidance__gps101-progress-bar">
              <div 
                className="navigator-guidance__gps101-progress-fill"
                style={{ width: `${gps101Progress}%` }}
              />
            </div>
            <span className="navigator-guidance__gps101-progress-text">{gps101Progress}%</span>
          </div>
        </div>
      )}
      
      {/* Daily Tips */}
      <div className="navigator-guidance__tips-container">
        {/* Regular Daily Tip */}
        {dailyTip && !dismissedTip && !showGPS101Only && (
          <div className="navigator-guidance__daily-tip">
            <div className="navigator-guidance__tip-header">
              <span className="navigator-guidance__tip-icon">💡</span>
              <span className="navigator-guidance__tip-label">Daily Tip</span>
              <button
                type="button"
                className="navigator-guidance__tip-dismiss"
                onClick={handleTipDismiss}
              >
                ✕
              </button>
            </div>
            <p className="navigator-guidance__tip-text">{dailyTip.content}</p>
          </div>
        )}
        
        {/* NEW: GPS 101 Daily Tip */}
        {gps101DailyTip && !dismissedGPS101Tip && isGPS101Enrolled && (
          <div className="navigator-guidance__daily-tip navigator-guidance__daily-tip--gps101">
            <div className="navigator-guidance__tip-header">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
              </svg>
              <span className="navigator-guidance__tip-label">GPS 101 Tip</span>
              <button
                type="button"
                className="navigator-guidance__tip-dismiss"
                onClick={handleGPS101TipDismiss}
              >
                ✕
              </button>
            </div>
            <p className="navigator-guidance__tip-text">{gps101DailyTip.content}</p>
          </div>
        )}
      </div>
      
      {/* Tabs */}
      <div className="navigator-guidance__tabs">
        <button
          type="button"
          className={`navigator-guidance__tab ${activeTab === 'suggestions' ? 'navigator-guidance__tab--active' : ''}`}
          onClick={() => setActiveTab('suggestions')}
        >
          <span className="navigator-guidance__tab-icon">🎯</span>
          Suggestions
          {displaySuggestions.length > 0 && (
            <span className="navigator-guidance__tab-badge">{displaySuggestions.length}</span>
          )}
        </button>
        <button
          type="button"
          className={`navigator-guidance__tab ${activeTab === 'insights' ? 'navigator-guidance__tab--active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <span className="navigator-guidance__tab-icon">📈</span>
          Insights
        </button>
        <button
          type="button"
          className={`navigator-guidance__tab ${activeTab === 'help' ? 'navigator-guidance__tab--active' : ''}`}
          onClick={() => setActiveTab('help')}
        >
          <span className="navigator-guidance__tab-icon">❓</span>
          Help
        </button>
      </div>
      
      {/* Content */}
      <div className="navigator-guidance__content">
        {/* Loading State */}
        {isLoading && (
          <div className="navigator-guidance__loading">
            <div className="navigator-guidance__spinner" />
            <span>Loading guidance...</span>
          </div>
        )}
        
        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && !isLoading && (
          <GuidanceSuggestions
            suggestions={displaySuggestions}
            userStage={userStage}
            isGPS101Context={showGPS101Only}
            gps101Stage={gps101CurrentStage}
            onSuggestionClick={onSuggestionClick}
            showHeader={false}
          />
        )}
        
        {/* Insights Tab */}
        {activeTab === 'insights' && !isLoading && (
          <div className="navigator-guidance__insights">
            {progressInsights.length > 0 ? (
              progressInsights.map((insight, index) => (
                <div 
                  key={index} 
                  className={`navigator-guidance__insight ${insight.isGPS101 ? 'navigator-guidance__insight--gps101' : ''}`}
                >
                  <div className="navigator-guidance__insight-icon">{insight.icon}</div>
                  <div className="navigator-guidance__insight-content">
                    {insight.isGPS101 && (
                      <span className="navigator-guidance__insight-gps101-badge">
                        <svg viewBox="0 0 20 20" fill="currentColor">
                          <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                        </svg>
                        GPS 101
                      </span>
                    )}
                    <h4 className="navigator-guidance__insight-title">{insight.title}</h4>
                    <p className="navigator-guidance__insight-text">{insight.text}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="navigator-guidance__empty">
                <span className="navigator-guidance__empty-icon">📊</span>
                <p>Complete more activities to see insights about your progress!</p>
              </div>
            )}
          </div>
        )}
        
        {/* Help Tab */}
        {activeTab === 'help' && !isLoading && (
          <div className="navigator-guidance__help">
            {/* NEW: GPS 101 Help Topics (if enrolled) */}
            {isGPS101Enrolled && (
              <div className="navigator-guidance__help-section">
                <h4 className="navigator-guidance__help-title">
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3z"/>
                  </svg>
                  GPS 101 Help Topics
                </h4>
                <div className="navigator-guidance__help-topics">
                  <button type="button" className="navigator-guidance__help-topic navigator-guidance__help-topic--gps101">
                    🎓 Understanding GPS 101 stages
                  </button>
                  <button type="button" className="navigator-guidance__help-topic navigator-guidance__help-topic--gps101">
                    📝 Writing powerful deliverables
                  </button>
                  <button type="button" className="navigator-guidance__help-topic navigator-guidance__help-topic--gps101">
                    💭 Reflection best practices
                  </button>
                  <button type="button" className="navigator-guidance__help-topic navigator-guidance__help-topic--gps101">
                    🎯 Purpose discovery tips
                  </button>
                  <button type="button" className="navigator-guidance__help-topic navigator-guidance__help-topic--gps101">
                    🟠 Unlocking the Orange Beacon
                  </button>
                </div>
              </div>
            )}
            
            <div className="navigator-guidance__help-section">
              <h4 className="navigator-guidance__help-title">Quick Help Topics</h4>
              <div className="navigator-guidance__help-topics">
                <button type="button" className="navigator-guidance__help-topic">
                  🎯 How missions work
                </button>
                <button type="button" className="navigator-guidance__help-topic">
                  🍕 Understanding bites
                </button>
                <button type="button" className="navigator-guidance__help-topic">
                  🏁 Checkpoint evaluations
                </button>
                <button type="button" className="navigator-guidance__help-topic">
                  🪙 Earning Baraka
                </button>
                <button type="button" className="navigator-guidance__help-topic">
                  👥 Forming a party
                </button>
                <button type="button" className="navigator-guidance__help-topic">
                  📚 Study resources
                </button>
              </div>
            </div>
            
            <div className="navigator-guidance__help-cta">
              <p>Can't find what you need?</p>
              {onOpenChat && (
                <button
                  type="button"
                  className="navigator-guidance__help-chat-btn"
                  onClick={onOpenChat}
                >
                  Chat with Navigator
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavigatorGuidance;