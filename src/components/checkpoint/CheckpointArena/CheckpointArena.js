/**
 * GPS Lab Platform - CheckpointArena Component
 * GPS 101 INTEGRATION: GPS 101-specific validation, Navigator guidance, progress tracking
 * 
 * Main checkpoint evaluation arena with question display,
 * answer input, timer, and submission handling.
 * 
 * @module components/checkpoint/CheckpointArena/CheckpointArena
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckpointHeader from './CheckpointHeader';
import './CheckpointArena.css';

/**
 * Question type configurations
 */
const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  LONG_ANSWER: 'long_answer',
  CODE: 'code',
  // NEW: GPS 101-specific types
  REFLECTION: 'reflection',
  PURPOSE_ALIGNMENT: 'purpose_alignment'
};

/**
 * CheckpointArena Component
 */
const CheckpointArena = ({
  checkpoint,
  mission,
  stage = 1,
  questions = [],
  // NEW: GPS 101 props
  isGPS101 = false,
  gps101StageNumber,
  gps101StageQuestion,
  gps101DeliverableName,
  gps101NavigatorTips = [],
  gps101ValidationCriteria = [], // e.g., ['depth', 'self-awareness', 'purpose-connection']
  onSubmit,
  onExit,
  passingScore = 70,
  timeLimit = 0,
  allowPause = true,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [isPaused, setIsPaused] = useState(false);
  const [status, setStatus] = useState('in_progress');
  const [showNavigatorHelp, setShowNavigatorHelp] = useState(false);
  const timerRef = useRef(null);
  
  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;
  const canSubmit = answeredCount === totalQuestions;
  
  /**
   * Timer effect
   */
  useEffect(() => {
    if (timeLimit === 0 || status !== 'in_progress' || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [timeLimit, status, isPaused]);
  
  /**
   * Handle time up
   */
  const handleTimeUp = useCallback(() => {
    setStatus('submitted');
    if (onSubmit) {
      onSubmit({
        answers,
        timeExpired: true,
        isGPS101,
        gps101StageNumber
      });
    }
  }, [answers, onSubmit, isGPS101, gps101StageNumber]);
  
  /**
   * Handle answer change
   */
  const handleAnswerChange = useCallback((questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  }, []);
  
  /**
   * Navigate questions
   */
  const handlePrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);
  
  const handleNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);
  
  const handleGoToQuestion = useCallback((index) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions]);
  
  /**
   * Handle pause/resume
   */
  const handlePause = useCallback(() => {
    if (allowPause) {
      setIsPaused(true);
    }
  }, [allowPause]);
  
  const handleResume = useCallback(() => {
    setIsPaused(false);
  }, []);
  
  /**
   * Handle submission
   */
  const handleSubmit = useCallback(() => {
    if (!canSubmit) return;
    
    setStatus('submitted');
    if (onSubmit) {
      onSubmit({
        answers,
        timeRemaining,
        isGPS101,
        gps101StageNumber,
        gps101ValidationCriteria
      });
    }
  }, [answers, canSubmit, timeRemaining, onSubmit, isGPS101, gps101StageNumber, gps101ValidationCriteria]);
  
  /**
   * Render answer input based on question type
   */
  const renderAnswerInput = (question) => {
    const answer = answers[question.id] || '';
    
    switch (question.type) {
      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <div className="checkpoint-arena__options">
            {question.options?.map((option, index) => (
              <label key={index} className="checkpoint-arena__option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.value || option}
                  checked={answer === (option.value || option)}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  className="checkpoint-arena__option-input"
                />
                <span className="checkpoint-arena__option-label">
                  {option.label || option}
                </span>
              </label>
            ))}
          </div>
        );
      
      case QUESTION_TYPES.TRUE_FALSE:
        return (
          <div className="checkpoint-arena__options checkpoint-arena__options--boolean">
            <label className="checkpoint-arena__option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="true"
                checked={answer === 'true'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="checkpoint-arena__option-input"
              />
              <span className="checkpoint-arena__option-label">True</span>
            </label>
            <label className="checkpoint-arena__option">
              <input
                type="radio"
                name={`question-${question.id}`}
                value="false"
                checked={answer === 'false'}
                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                className="checkpoint-arena__option-input"
              />
              <span className="checkpoint-arena__option-label">False</span>
            </label>
          </div>
        );
      
      case QUESTION_TYPES.SHORT_ANSWER:
        return (
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder={isGPS101 ? 'Share your thoughts...' : 'Enter your answer...'}
            className="checkpoint-arena__text-input"
          />
        );
      
      case QUESTION_TYPES.LONG_ANSWER:
      case QUESTION_TYPES.REFLECTION:
      case QUESTION_TYPES.PURPOSE_ALIGNMENT:
        return (
          <div className="checkpoint-arena__textarea-wrapper">
            <textarea
              value={answer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              placeholder={
                question.type === QUESTION_TYPES.REFLECTION
                  ? 'Reflect deeply on your thoughts and experiences...'
                  : question.type === QUESTION_TYPES.PURPOSE_ALIGNMENT
                  ? 'How does this connect to your purpose journey?...'
                  : isGPS101
                  ? 'Share your reflections...'
                  : 'Enter your answer...'
              }
              rows={isGPS101 ? 8 : 6}
              className="checkpoint-arena__textarea"
            />
            <div className="checkpoint-arena__char-count">
              {answer.length} characters
              {isGPS101 && question.minLength && answer.length < question.minLength && (
                <span className="checkpoint-arena__char-warning">
                  {' '}(Minimum {question.minLength} characters for thoughtful reflection)
                </span>
              )}
            </div>
            
            {/* NEW: GPS 101 Reflection Prompts */}
            {isGPS101 && (question.type === QUESTION_TYPES.REFLECTION || question.type === QUESTION_TYPES.PURPOSE_ALIGNMENT) && question.reflectionPrompts && (
              <div className="checkpoint-arena__reflection-prompts">
                <h5>Consider:</h5>
                <ul>
                  {question.reflectionPrompts.map((prompt, index) => (
                    <li key={index}>{prompt}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );
      
      case QUESTION_TYPES.CODE:
        return (
          <textarea
            value={answer}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="// Write your code here..."
            rows={10}
            className="checkpoint-arena__code-input"
            spellCheck={false}
          />
        );
      
      default:
        return null;
    }
  };
  
  const classNames = [
    'checkpoint-arena',
    isGPS101 && 'checkpoint-arena--gps101',
    isPaused && 'checkpoint-arena--paused',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <CheckpointHeader
        checkpoint={checkpoint}
        mission={mission}
        stage={stage}
        status={status}
        timeLimit={timeLimit}
        timeRemaining={timeRemaining}
        onBack={onExit}
        onPause={handlePause}
        onResume={handleResume}
        onSubmit={handleSubmit}
        isPaused={isPaused}
        canSubmit={canSubmit}
      />
      
      {/* NEW: GPS 101 Context Banner */}
      {isGPS101 && (
        <div className="checkpoint-arena__gps101-banner">
          <div className="checkpoint-arena__gps101-badge">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
            <div>
              <strong>GPS 101 Stage {gps101StageNumber} Checkpoint</strong>
              {gps101StageQuestion && <p>"{gps101StageQuestion}"</p>}
            </div>
          </div>
          {gps101DeliverableName && (
            <div className="checkpoint-arena__gps101-deliverable">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd"/>
              </svg>
              <span>Progress toward: {gps101DeliverableName}</span>
            </div>
          )}
        </div>
      )}
      
      {/* Pause Overlay */}
      {isPaused && (
        <div className="checkpoint-arena__pause-overlay">
          <div className="checkpoint-arena__pause-card">
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            <h3>Checkpoint Paused</h3>
            <p>Take your time. Resume when ready.</p>
            <button type="button" onClick={handleResume} className="checkpoint-arena__resume-btn">
              <svg viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
              </svg>
              Resume Checkpoint
            </button>
          </div>
        </div>
      )}
      
      {/* Main Content */}
      <div className="checkpoint-arena__main">
        {/* Sidebar - Question Navigator */}
        <aside className="checkpoint-arena__sidebar">
          <div className="checkpoint-arena__progress">
            <h3 className="checkpoint-arena__progress-title">Progress</h3>
            <div className="checkpoint-arena__progress-stats">
              <span className="checkpoint-arena__progress-count">
                {answeredCount}/{totalQuestions}
              </span>
              <span className="checkpoint-arena__progress-label">Answered</span>
            </div>
            <div className="checkpoint-arena__progress-bar">
              <div
                className="checkpoint-arena__progress-fill"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>
          
          <div className="checkpoint-arena__question-nav">
            <h4 className="checkpoint-arena__question-nav-title">Questions</h4>
            <div className="checkpoint-arena__question-grid">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleGoToQuestion(index)}
                  className={`checkpoint-arena__question-btn ${index === currentQuestionIndex ? 'checkpoint-arena__question-btn--active' : ''} ${answers[q.id] ? 'checkpoint-arena__question-btn--answered' : ''}`}
                >
                  {index + 1}
                  {answers[q.id] && (
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* NEW: GPS 101 Navigator Help */}
          {isGPS101 && (
            <div className="checkpoint-arena__navigator-section">
              <button
                type="button"
                onClick={() => setShowNavigatorHelp(!showNavigatorHelp)}
                className="checkpoint-arena__navigator-toggle"
              >
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0c0 .993-.241 1.929-.668 2.754l-1.524-1.525a3.997 3.997 0 00.078-2.183l1.562-1.562C15.802 8.249 16 9.1 16 10zm-5.165 3.913l1.58 1.58A5.98 5.98 0 0110 16a5.976 5.976 0 01-2.516-.552l1.562-1.562a4.006 4.006 0 001.789.027zm-4.677-2.796a4.002 4.002 0 01-.041-2.08l-.08.08-1.53-1.533A5.98 5.98 0 004 10c0 .954.223 1.856.619 2.657l1.54-1.54zm1.088-6.45A5.974 5.974 0 0110 4c.954 0 1.856.223 2.657.619l-1.54 1.54a4.002 4.002 0 00-2.346.033L7.246 4.668zM12 10a2 2 0 11-4 0 2 2 0 014 0z" clipRule="evenodd"/>
                </svg>
                Navigator Tips
                <svg viewBox="0 0 20 20" fill="currentColor" className={`checkpoint-arena__navigator-chevron ${showNavigatorHelp ? 'checkpoint-arena__navigator-chevron--open' : ''}`}>
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
              
              {showNavigatorHelp && (
                <div className="checkpoint-arena__navigator-tips">
                  {gps101NavigatorTips.length > 0 ? (
                    <ul>
                      {gps101NavigatorTips.map((tip, index) => (
                        <li key={index}>{tip}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>Focus on depth, authenticity, and connecting your answers to your purpose journey.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => navigate('/navigator', { state: { context: 'gps101', checkpoint: checkpoint?.id } })}
                    className="checkpoint-arena__navigator-link"
                  >
                    Ask Navigator AI
                  </button>
                </div>
              )}
            </div>
          )}
        </aside>
        
        {/* Question Display */}
        <div className="checkpoint-arena__question-area">
          {currentQuestion && (
            <>
              <div className="checkpoint-arena__question-header">
                <span className="checkpoint-arena__question-number">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                {currentQuestion.type && (
                  <span className={`checkpoint-arena__question-type checkpoint-arena__question-type--${currentQuestion.type}`}>
                    {currentQuestion.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                )}
                {currentQuestion.points && (
                  <span className="checkpoint-arena__question-points">
                    {currentQuestion.points} {currentQuestion.points === 1 ? 'point' : 'points'}
                  </span>
                )}
              </div>
              
              <div className="checkpoint-arena__question-content">
                <h2 className="checkpoint-arena__question-text">{currentQuestion.text}</h2>
                
                {currentQuestion.description && (
                  <p className="checkpoint-arena__question-description">{currentQuestion.description}</p>
                )}
                
                {/* NEW: GPS 101 Question Context */}
                {isGPS101 && currentQuestion.gps101Context && (
                  <div className="checkpoint-arena__gps101-question-context">
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                    </svg>
                    <p>{currentQuestion.gps101Context}</p>
                  </div>
                )}
                
                {currentQuestion.image && (
                  <img src={currentQuestion.image} alt="Question illustration" className="checkpoint-arena__question-image" />
                )}
                
                {currentQuestion.code && (
                  <pre className="checkpoint-arena__question-code">
                    <code>{currentQuestion.code}</code>
                  </pre>
                )}
              </div>
              
              <div className="checkpoint-arena__answer-section">
                <h3 className="checkpoint-arena__answer-title">
                  {isGPS101 ? 'Your Response' : 'Your Answer'}
                </h3>
                {renderAnswerInput(currentQuestion)}
              </div>
              
              {/* Navigation */}
              <div className="checkpoint-arena__question-nav-actions">
                <button
                  type="button"
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  className="checkpoint-arena__nav-btn checkpoint-arena__nav-btn--prev"
                >
                  <svg viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"/>
                  </svg>
                  Previous
                </button>
                
                {currentQuestionIndex < totalQuestions - 1 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="checkpoint-arena__nav-btn checkpoint-arena__nav-btn--next"
                  >
                    Next
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"/>
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={!canSubmit}
                    className="checkpoint-arena__nav-btn checkpoint-arena__nav-btn--submit"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                    </svg>
                    {isGPS101 ? 'Submit Checkpoint' : 'Submit All Answers'}
                  </button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export { QUESTION_TYPES };
export default CheckpointArena;