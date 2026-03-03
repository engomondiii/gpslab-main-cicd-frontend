/**
 * Checkpoint Progress Ring Component
 * 
 * Circular progress indicator for checkpoint completion within a mission.
 */

import React from 'react';
import './CheckpointProgressRing.css';

const CheckpointProgressRing = ({ 
  completed, 
  total, 
  size = 'medium',
  showLabel = true,
  animate = true 
}) => {
  const percentage = Math.round((completed / total) * 100);
  
  // Calculate circle properties
  const radius = size === 'small' ? 20 : size === 'large' ? 40 : 30;
  const strokeWidth = size === 'small' ? 3 : size === 'large' ? 6 : 4;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const getSizeClass = () => {
    return `ring-${size}`;
  };

  const getStatusColor = () => {
    if (percentage === 100) return '#4CAF50';
    if (percentage >= 60) return '#667eea';
    if (percentage >= 20) return '#FFC107';
    return '#999';
  };

  return (
    <div className={`checkpoint-progress-ring ${getSizeClass()}`}>
      <svg
        height={radius * 2}
        width={radius * 2}
        className={animate ? 'animate' : ''}
      >
        {/* Background circle */}
        <circle
          className="ring-background"
          stroke="#e0e0e0"
          fill="transparent"
          strokeWidth={strokeWidth}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        
        {/* Progress circle */}
        <circle
          className="ring-progress"
          stroke={getStatusColor()}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference + ' ' + circumference}
          style={{ strokeDashoffset }}
          strokeLinecap="round"
          r={normalizedRadius}
          cx={radius}
          cy={radius}
          transform={`rotate(-90 ${radius} ${radius})`}
        />
        
        {/* Center text */}
        <text
          x="50%"
          y="50%"
          className="ring-text"
          dominantBaseline="middle"
          textAnchor="middle"
          fill={getStatusColor()}
        >
          {completed}/{total}
        </text>
      </svg>
      
      {showLabel && (
        <div className="ring-label">
          <span className="ring-percentage">{percentage}%</span>
          <span className="ring-description">Complete</span>
        </div>
      )}
    </div>
  );
};

export default CheckpointProgressRing;