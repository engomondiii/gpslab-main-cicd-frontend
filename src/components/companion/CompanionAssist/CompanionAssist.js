/**
 * GPS Lab Platform - CompanionAssist Component
 * 
 * Floating assistance panel for Companion AI that
 * provides contextual help during bite execution.
 * 
 * @module components/companion/CompanionAssist/CompanionAssist
 */

import React, { useState, useCallback } from 'react';
import './CompanionAssist.css';

/**
 * Assist modes
 */
const ASSIST_MODES = {
  hint: { icon: '💡', label: 'Hints', description: 'Get progressive hints' },
  debug: { icon: '🔧', label: 'Debug', description: 'Help with errors' },
  review: { icon: '✅', label: 'Review', description: 'Check your work' },
  learn: { icon: '📚', label: 'Learn', description: 'Related resources' }
};

/**
 * CompanionAssist Component
 */
const CompanionAssist = ({
  bite = null,
  isExpanded = false,
  onToggleExpand,
  onOpenChat,
  onModeSelect,
  className = '',
  ...props
}) => {
  const [activeMode, setActiveMode] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [currentHint, setCurrentHint] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const handleModeSelect = useCallback((modeId) => {
    setActiveMode(modeId);
    if (onModeSelect) {
      onModeSelect(modeId);
    }
    
    if (modeId === 'hint') {
      const nextLevel = Math.min(hintLevel + 1, 3);
      setHintLevel(nextLevel);
      setCurrentHint(getHintForLevel(nextLevel, bite));
    }
  }, [hintLevel, bite, onModeSelect]);
  
  const handleReset = useCallback(() => {
    setActiveMode(null);
    setHintLevel(0);
    setCurrentHint(null);
  }, []);
  
  const handleQuickCheck = useCallback(() => {
    // Simulate a quick check
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 2000);
  }, []);
  
  const classNames = [
    'companion-assist',
    isExpanded && 'companion-assist--expanded',
    activeMode && 'companion-assist--active',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Minimized State - Floating Button */}
      {!isExpanded && (
        <button
          type="button"
          className="companion-assist__trigger"
          onClick={onToggleExpand}
          title="Ask Companion for help"
        >
          <span className="companion-assist__trigger-icon">🤖</span>
          <span className="companion-assist__trigger-pulse" />
        </button>
      )}
      
      {/* Expanded Panel */}
      {isExpanded && (
        <div className="companion-assist__panel">
          {/* Header */}
          <header className="companion-assist__header">
            <div className="companion-assist__header-left">
              <span className="companion-assist__avatar">🤖</span>
              <div className="companion-assist__header-info">
                <h4 className="companion-assist__title">Companion Assist</h4>
                <span className="companion-assist__subtitle">
                  {bite ? bite.name : 'Ready to help'}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="companion-assist__close-btn"
              onClick={onToggleExpand}
            >
              ✕
            </button>
          </header>
          
          {/* Content */}
          <div className="companion-assist__content">
            {/* Mode Selection */}
            {!activeMode && (
              <div className="companion-assist__modes">
                <p className="companion-assist__modes-label">How can I help?</p>
                <div className="companion-assist__modes-grid">
                  {Object.entries(ASSIST_MODES).map(([id, mode]) => (
                    <button
                      key={id}
                      type="button"
                      className="companion-assist__mode-btn"
                      onClick={() => handleModeSelect(id)}
                    >
                      <span className="companion-assist__mode-icon">{mode.icon}</span>
                      <span className="companion-assist__mode-label">{mode.label}</span>
                      <span className="companion-assist__mode-desc">{mode.description}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Hint Mode */}
            {activeMode === 'hint' && (
              <div className="companion-assist__hint-mode">
                <div className="companion-assist__hint-progress">
                  <span className="companion-assist__hint-level">Hint Level {hintLevel}/3</span>
                  <div className="companion-assist__hint-bar">
                    <div 
                      className="companion-assist__hint-fill" 
                      style={{ width: `${(hintLevel / 3) * 100}%` }}
                    />
                  </div>
                </div>
                
                {currentHint && (
                  <div className="companion-assist__hint-card">
                    <span className="companion-assist__hint-icon">
                      {hintLevel === 1 && '💡'}
                      {hintLevel === 2 && '🔍'}
                      {hintLevel === 3 && '🎯'}
                    </span>
                    <p className="companion-assist__hint-text">{currentHint}</p>
                  </div>
                )}
                
                <div className="companion-assist__hint-actions">
                  {hintLevel < 3 && (
                    <button
                      type="button"
                      className="companion-assist__action-btn"
                      onClick={() => handleModeSelect('hint')}
                    >
                      Need more help
                    </button>
                  )}
                  <button
                    type="button"
                    className="companion-assist__action-btn companion-assist__action-btn--secondary"
                    onClick={handleReset}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            
            {/* Debug Mode */}
            {activeMode === 'debug' && (
              <div className="companion-assist__debug-mode">
                <div className="companion-assist__debug-input">
                  <textarea
                    placeholder="Paste your error message or describe the issue..."
                    className="companion-assist__debug-textarea"
                    rows={4}
                  />
                </div>
                <div className="companion-assist__debug-actions">
                  <button
                    type="button"
                    className="companion-assist__action-btn"
                    onClick={() => onOpenChat && onOpenChat()}
                  >
                    Analyze Issue
                  </button>
                  <button
                    type="button"
                    className="companion-assist__action-btn companion-assist__action-btn--secondary"
                    onClick={handleReset}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            
            {/* Review Mode */}
            {activeMode === 'review' && (
              <div className="companion-assist__review-mode">
                <div className="companion-assist__review-checklist">
                  <h5 className="companion-assist__review-title">Quick Review Checklist</h5>
                  <ul className="companion-assist__review-list">
                    <li className="companion-assist__review-item">
                      <input type="checkbox" id="check1" />
                      <label htmlFor="check1">Meets acceptance criteria</label>
                    </li>
                    <li className="companion-assist__review-item">
                      <input type="checkbox" id="check2" />
                      <label htmlFor="check2">Code is clean and readable</label>
                    </li>
                    <li className="companion-assist__review-item">
                      <input type="checkbox" id="check3" />
                      <label htmlFor="check3">Tested with sample data</label>
                    </li>
                    <li className="companion-assist__review-item">
                      <input type="checkbox" id="check4" />
                      <label htmlFor="check4">Edge cases handled</label>
                    </li>
                  </ul>
                </div>
                <div className="companion-assist__review-actions">
                  <button
                    type="button"
                    className="companion-assist__action-btn"
                    onClick={handleQuickCheck}
                  >
                    Run Quick Check
                  </button>
                  <button
                    type="button"
                    className="companion-assist__action-btn companion-assist__action-btn--secondary"
                    onClick={handleReset}
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
            
            {/* Learn Mode */}
            {activeMode === 'learn' && (
              <div className="companion-assist__learn-mode">
                <div className="companion-assist__resources">
                  <div className="companion-assist__resource-card">
                    <span className="companion-assist__resource-icon">📖</span>
                    <div className="companion-assist__resource-info">
                      <span className="companion-assist__resource-title">Documentation</span>
                      <span className="companion-assist__resource-desc">Official guides and references</span>
                    </div>
                  </div>
                  <div className="companion-assist__resource-card">
                    <span className="companion-assist__resource-icon">🎥</span>
                    <div className="companion-assist__resource-info">
                      <span className="companion-assist__resource-title">Video Tutorial</span>
                      <span className="companion-assist__resource-desc">Step-by-step walkthrough</span>
                    </div>
                  </div>
                  <div className="companion-assist__resource-card">
                    <span className="companion-assist__resource-icon">💬</span>
                    <div className="companion-assist__resource-info">
                      <span className="companion-assist__resource-title">Community</span>
                      <span className="companion-assist__resource-desc">Ask the GPS community</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  className="companion-assist__action-btn companion-assist__action-btn--secondary"
                  onClick={handleReset}
                >
                  Back
                </button>
              </div>
            )}
          </div>
          
          {/* Footer */}
          <footer className="companion-assist__footer">
            <button
              type="button"
              className="companion-assist__chat-link"
              onClick={() => onOpenChat && onOpenChat()}
            >
              <span className="companion-assist__chat-icon">💬</span>
              Open full chat
            </button>
          </footer>
          
          {/* Celebration Overlay */}
          {showCelebration && (
            <div className="companion-assist__celebration">
              <span className="companion-assist__celebration-icon">✨</span>
              <span className="companion-assist__celebration-text">Looking good!</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Get hint for specific level
 */
function getHintForLevel(level, bite) {
  const biteContext = bite?.name || 'this task';
  
  const hints = {
    1: `Start by understanding what ${biteContext} is asking for. Break down the requirements into smaller pieces.`,
    2: `Consider the main input and output. What transformation needs to happen? Think about edge cases.`,
    3: `Here's a direct approach: Focus on the core functionality first, get it working with a simple test case, then expand.`
  };
  
  return hints[level] || hints[1];
}

export default CompanionAssist;