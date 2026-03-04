/**
 * Checkpoint Questions Component
 * 
 * Renders different types of checkpoint questions:
 * - Short answer
 * - Long answer / Essay
 * - Multiple choice
 * - Multiple select
 * - True/False
 * - Rating scale
 */

import React from 'react';
import './CheckpointQuestions.css';

const CheckpointQuestions = ({ checkpoint, answers, onAnswerChange, errors = {} }) => {
  // Render based on checkpoint type
  const renderQuestion = (question, index) => {
    switch (question.type) {
      case 'short_answer':
        return renderShortAnswer(question, index);
      case 'long_answer':
      case 'essay':
        return renderLongAnswer(question, index);
      case 'multiple_choice':
        return renderMultipleChoice(question, index);
      case 'multiple_select':
        return renderMultipleSelect(question, index);
      case 'true_false':
        return renderTrueFalse(question, index);
      case 'rating':
        return renderRating(question, index);
      default:
        return renderLongAnswer(question, index);
    }
  };

  const renderShortAnswer = (question, index) => {
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <label className="question-label">
            <span className="question-number">Q{index + 1}</span>
            {question.required && <span className="required-mark">*</span>}
            <span className="question-text">{question.question}</span>
          </label>
          {question.questionKo && (
            <p className="question-korean">{question.questionKo}</p>
          )}
        </div>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
        
        <input
          type="text"
          className={`short-answer-input ${errors[question.id] ? 'error' : ''}`}
          value={answers[question.id] || ''}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          placeholder={question.placeholder || 'Enter your answer...'}
          maxLength={question.maxLength || 200}
        />
        
        {errors[question.id] && (
          <div className="field-error">{errors[question.id]}</div>
        )}
        
        <div className="character-count">
          {(answers[question.id] || '').length} / {question.maxLength || 200} characters
        </div>
      </div>
    );
  };

  const renderLongAnswer = (question, index) => {
    const currentLength = (answers[question.id] || '').length;
    const wordCount = (answers[question.id] || '').split(/\s+/).filter(w => w.length > 0).length;
    
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <label className="question-label">
            <span className="question-number">Q{index + 1}</span>
            {question.required && <span className="required-mark">*</span>}
            <span className="question-text">{question.question}</span>
          </label>
          {question.questionKo && (
            <p className="question-korean">{question.questionKo}</p>
          )}
        </div>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
        
        <textarea
          className={`long-answer-textarea ${errors[question.id] ? 'error' : ''}`}
          value={answers[question.id] || ''}
          onChange={(e) => onAnswerChange(question.id, e.target.value)}
          placeholder={question.placeholder || 'Write your answer here...'}
          rows={question.rows || 12}
          maxLength={question.maxLength || 5000}
        />
        
        {errors[question.id] && (
          <div className="field-error">{errors[question.id]}</div>
        )}
        
        <div className="answer-stats">
          <span className="stat-item">{currentLength} characters</span>
          <span className="stat-separator">•</span>
          <span className="stat-item">{wordCount} words</span>
          {question.minLength && (
            <>
              <span className="stat-separator">•</span>
              <span className="stat-item">
                Min: {question.minLength} characters
              </span>
            </>
          )}
        </div>
        
        {question.hints && (
          <div className="question-hints">
            <div className="hints-header">💡 Tips:</div>
            <ul className="hints-list">
              {question.hints.map((hint, i) => (
                <li key={i}>{hint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  const renderMultipleChoice = (question, index) => {
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <label className="question-label">
            <span className="question-number">Q{index + 1}</span>
            {question.required && <span className="required-mark">*</span>}
            <span className="question-text">{question.question}</span>
          </label>
          {question.questionKo && (
            <p className="question-korean">{question.questionKo}</p>
          )}
        </div>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
        
        <div className={`options-container ${errors[question.id] ? 'error' : ''}`}>
          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="option-label">
              <input
                type="radio"
                name={question.id}
                value={option.value}
                checked={answers[question.id] === option.value}
                onChange={(e) => onAnswerChange(question.id, e.target.value)}
              />
              <span className="option-text">{option.text}</span>
              {option.textKo && (
                <span className="option-korean">{option.textKo}</span>
              )}
            </label>
          ))}
        </div>
        
        {errors[question.id] && (
          <div className="field-error">{errors[question.id]}</div>
        )}
      </div>
    );
  };

  const renderMultipleSelect = (question, index) => {
    const selectedValues = answers[question.id] || [];
    
    const handleCheckboxChange = (value) => {
      const newValues = selectedValues.includes(value)
        ? selectedValues.filter(v => v !== value)
        : [...selectedValues, value];
      onAnswerChange(question.id, newValues);
    };
    
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <label className="question-label">
            <span className="question-number">Q{index + 1}</span>
            {question.required && <span className="required-mark">*</span>}
            <span className="question-text">{question.question}</span>
          </label>
          {question.questionKo && (
            <p className="question-korean">{question.questionKo}</p>
          )}
        </div>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
        
        <p className="select-instruction">Select all that apply</p>
        
        <div className={`options-container ${errors[question.id] ? 'error' : ''}`}>
          {question.options.map((option, optionIndex) => (
            <label key={optionIndex} className="option-label">
              <input
                type="checkbox"
                value={option.value}
                checked={selectedValues.includes(option.value)}
                onChange={() => handleCheckboxChange(option.value)}
              />
              <span className="option-text">{option.text}</span>
              {option.textKo && (
                <span className="option-korean">{option.textKo}</span>
              )}
            </label>
          ))}
        </div>
        
        {errors[question.id] && (
          <div className="field-error">{errors[question.id]}</div>
        )}
      </div>
    );
  };

  const renderTrueFalse = (question, index) => {
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <label className="question-label">
            <span className="question-number">Q{index + 1}</span>
            {question.required && <span className="required-mark">*</span>}
            <span className="question-text">{question.question}</span>
          </label>
          {question.questionKo && (
            <p className="question-korean">{question.questionKo}</p>
          )}
        </div>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
        
        <div className={`true-false-container ${errors[question.id] ? 'error' : ''}`}>
          <label className="option-label">
            <input
              type="radio"
              name={question.id}
              value="true"
              checked={answers[question.id] === 'true'}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
            />
            <span className="option-text">True</span>
          </label>
          
          <label className="option-label">
            <input
              type="radio"
              name={question.id}
              value="false"
              checked={answers[question.id] === 'false'}
              onChange={(e) => onAnswerChange(question.id, e.target.value)}
            />
            <span className="option-text">False</span>
          </label>
        </div>
        
        {errors[question.id] && (
          <div className="field-error">{errors[question.id]}</div>
        )}
      </div>
    );
  };

  const renderRating = (question, index) => {
    const maxRating = question.maxRating || 5;
    const ratings = Array.from({ length: maxRating }, (_, i) => i + 1);
    
    return (
      <div key={question.id} className="question-container">
        <div className="question-header">
          <label className="question-label">
            <span className="question-number">Q{index + 1}</span>
            {question.required && <span className="required-mark">*</span>}
            <span className="question-text">{question.question}</span>
          </label>
          {question.questionKo && (
            <p className="question-korean">{question.questionKo}</p>
          )}
        </div>
        
        {question.description && (
          <p className="question-description">{question.description}</p>
        )}
        
        <div className={`rating-container ${errors[question.id] ? 'error' : ''}`}>
          {question.minLabel && (
            <span className="rating-label min">{question.minLabel}</span>
          )}
          
          <div className="rating-options">
            {ratings.map(rating => (
              <label key={rating} className="rating-option">
                <input
                  type="radio"
                  name={question.id}
                  value={rating}
                  checked={answers[question.id] === rating.toString()}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                />
                <span className="rating-number">{rating}</span>
              </label>
            ))}
          </div>
          
          {question.maxLabel && (
            <span className="rating-label max">{question.maxLabel}</span>
          )}
        </div>
        
        {errors[question.id] && (
          <div className="field-error">{errors[question.id]}</div>
        )}
      </div>
    );
  };

  // Main render
  if (!checkpoint) {
    return null;
  }

  // If checkpoint has a single main question (like original structure)
  if (checkpoint.question && !checkpoint.questions) {
    return (
      <div className="checkpoint-questions">
        <div className="main-question">
          <h2 className="checkpoint-question">{checkpoint.question}</h2>
          {checkpoint.questionKo && (
            <p className="checkpoint-question-ko">{checkpoint.questionKo}</p>
          )}
        </div>
      </div>
    );
  }

  // Render multiple questions
  return (
    <div className="checkpoint-questions">
      {checkpoint.questions && checkpoint.questions.map((question, index) => 
        renderQuestion(question, index)
      )}
    </div>
  );
};

export default CheckpointQuestions;