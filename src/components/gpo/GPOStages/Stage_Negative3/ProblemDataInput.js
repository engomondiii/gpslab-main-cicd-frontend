/**
 * GPS Lab Platform - ProblemDataInput Component
 * 
 * Add key statistics or facts about the problem.
 * 
 * @module components/gpo/GPOStages/Stage_Negative3/ProblemDataInput
 */

import React, { useState, useCallback } from 'react';
import './ProblemDataInput.css';

/**
 * ProblemDataInput Component
 */
const ProblemDataInput = ({
  statistics = [],
  onStatisticsUpdate,
  className = '',
  ...props
}) => {
  const [newStat, setNewStat] = useState({
    label: '',
    value: '',
    source: ''
  });

  /**
   * Handle add statistic
   */
  const handleAdd = useCallback(() => {
    if (newStat.label.trim() && newStat.value.trim()) {
      const stat = {
        id: Date.now(),
        ...newStat,
        label: newStat.label.trim(),
        value: newStat.value.trim(),
        source: newStat.source.trim()
      };

      onStatisticsUpdate?.([...statistics, stat]);
      
      setNewStat({
        label: '',
        value: '',
        source: ''
      });
    }
  }, [newStat, statistics, onStatisticsUpdate]);

  /**
   * Handle remove statistic
   */
  const handleRemove = useCallback((id) => {
    const updated = statistics.filter(s => s.id !== id);
    onStatisticsUpdate?.(updated);
  }, [statistics, onStatisticsUpdate]);

  const classNames = ['problem-data-input', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      <div className="problem-data-input__container">
        {/* Header */}
        <div className="problem-data-input__header">
          <h3 className="problem-data-input__title">
            Add Data & Facts 📊
          </h3>
          <p className="problem-data-input__subtitle">
            Support your problem statement with key statistics, facts, or data points. This is optional but highly recommended.
          </p>
        </div>

        {/* Instructions */}
        <div className="problem-data-input__instructions">
          <h4 className="problem-data-input__instructions-title">Examples:</h4>
          <ul className="problem-data-input__examples">
            <li>
              <strong>Number of people affected:</strong> "500 families (approx. 2,500 people)"
            </li>
            <li>
              <strong>Time burden:</strong> "4+ hours daily spent fetching water"
            </li>
            <li>
              <strong>Health impact:</strong> "30% of children under 5 have waterborne illnesses"
            </li>
            <li>
              <strong>Economic impact:</strong> "$200/month lost income due to illness"
            </li>
          </ul>
        </div>

        {/* Input Form */}
        <div className="problem-data-input__form">
          <div className="problem-data-input__fields">
            <div className="problem-data-input__field">
              <label htmlFor="stat-label" className="problem-data-input__label">
                Statistic Label
              </label>
              <input
                type="text"
                id="stat-label"
                value={newStat.label}
                onChange={(e) => setNewStat(prev => ({ ...prev, label: e.target.value }))}
                placeholder="e.g., People affected, Time spent, Distance traveled"
                className="problem-data-input__input"
              />
            </div>

            <div className="problem-data-input__field">
              <label htmlFor="stat-value" className="problem-data-input__label">
                Value/Number
              </label>
              <input
                type="text"
                id="stat-value"
                value={newStat.value}
                onChange={(e) => setNewStat(prev => ({ ...prev, value: e.target.value }))}
                placeholder="e.g., 500 families, 4+ hours, 2km"
                className="problem-data-input__input"
              />
            </div>

            <div className="problem-data-input__field">
              <label htmlFor="stat-source" className="problem-data-input__label">
                Source (Optional)
              </label>
              <input
                type="text"
                id="stat-source"
                value={newStat.source}
                onChange={(e) => setNewStat(prev => ({ ...prev, source: e.target.value }))}
                placeholder="e.g., Community survey 2024, Local health clinic"
                className="problem-data-input__input"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleAdd}
            disabled={!newStat.label.trim() || !newStat.value.trim()}
            className="problem-data-input__add-button"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
            </svg>
            Add Statistic
          </button>
        </div>

        {/* Statistics List */}
        {statistics.length > 0 && (
          <div className="problem-data-input__list">
            <h4 className="problem-data-input__list-title">Your Statistics ({statistics.length})</h4>
            <div className="problem-data-input__items">
              {statistics.map((stat) => (
                <div key={stat.id} className="problem-data-input__item">
                  <div className="problem-data-input__item-content">
                    <div className="problem-data-input__item-label">{stat.label}</div>
                    <div className="problem-data-input__item-value">{stat.value}</div>
                    {stat.source && (
                      <div className="problem-data-input__item-source">
                        Source: {stat.source}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemove(stat.id)}
                    className="problem-data-input__item-remove"
                    aria-label="Remove statistic"
                  >
                    <svg viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {statistics.length === 0 && (
          <div className="problem-data-input__empty">
            <svg viewBox="0 0 24 24" fill="currentColor" className="problem-data-input__empty-icon">
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"/>
              <path d="M3 5a2 2 0 012-2h1a1 1 0 010 2H5v7h2l1 2h4l1-2h2V5h-1a1 1 0 110-2h1a2 2 0 012 2v7a2 2 0 01-2 2h-5a2 2 0 01-2 2H5a2 2 0 01-2-2V5z"/>
            </svg>
            <p className="problem-data-input__empty-text">
              No statistics added yet. Add data to strengthen your problem statement.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDataInput;