/**
 * Journey Timeline Component
 * 
 * Visual timeline of GPS 101 journey with milestones.
 */

import React from 'react';
import { GPS_101_ALL_MISSIONS } from '../../../utils/constants/gps101.constants';
import './JourneyTimeline.css';

const JourneyTimeline = ({ 
  completedStages = [],
  completedMissions = [],
  currentStage = 1,
  enrollmentDate 
}) => {
  const stages = [1, 2, 3, 4, 5];

  const getStageMilestones = (stageNumber) => {
    const stageMissions = GPS_101_ALL_MISSIONS.filter(
      m => m.stageNumber === stageNumber
    );

    return stageMissions.map(mission => ({
      id: mission.missionId,
      title: mission.title,
      completed: completedMissions.includes(mission.missionId),
      isStageCompleter: mission.isStageCompleter
    }));
  };

  const getStageStatus = (stageNumber) => {
    if (completedStages.includes(stageNumber)) return 'completed';
    if (stageNumber === currentStage) return 'current';
    if (stageNumber < currentStage) return 'completed';
    return 'upcoming';
  };

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getProjectedDate = (stageNumber) => {
    if (!enrollmentDate) return '';
    
    const weeksPerStage = 3;
    const weeksToStage = (stageNumber - 1) * weeksPerStage;
    const projected = new Date(enrollmentDate);
    projected.setDate(projected.getDate() + (weeksToStage * 7));
    
    return projected;
  };

  return (
    <div className="journey-timeline">
      <div className="timeline-header">
        <h2>Your GPS 101 Journey</h2>
        <p className="timeline-subtitle">
          {enrollmentDate && `Started ${formatDate(enrollmentDate)}`}
        </p>
      </div>

      <div className="timeline-container">
        {stages.map((stageNumber, index) => {
          const status = getStageStatus(stageNumber);
          const milestones = getStageMilestones(stageNumber);
          const projectedDate = getProjectedDate(stageNumber);

          return (
            <div key={stageNumber} className={`timeline-stage ${status}`}>
              {/* Timeline Line */}
              {index > 0 && (
                <div className={`timeline-connector ${status}`} />
              )}

              {/* Stage Node */}
              <div className="stage-node-wrapper">
                <div className={`stage-node ${status}`}>
                  <div className="stage-node-inner">
                    {status === 'completed' ? (
                      <span className="node-icon">✓</span>
                    ) : status === 'current' ? (
                      <span className="node-number">{stageNumber}</span>
                    ) : (
                      <span className="node-number">{stageNumber}</span>
                    )}
                  </div>
                </div>

                {/* Current Indicator */}
                {status === 'current' && (
                  <div className="current-indicator">
                    <div className="indicator-pulse" />
                    <span className="indicator-text">Current</span>
                  </div>
                )}
              </div>

              {/* Stage Content */}
              <div className="stage-timeline-content">
                <div className="stage-timeline-header">
                  <h3 className="stage-timeline-title">
                    Stage {stageNumber}
                  </h3>
                  {projectedDate && status !== 'completed' && (
                    <span className="projected-date">
                      {formatDate(projectedDate)}
                    </span>
                  )}
                </div>

                <p className="stage-question">
                  {stageNumber === 1 && "Who are you?"}
                  {stageNumber === 2 && "What is the meaning of your life?"}
                  {stageNumber === 3 && "Tell a story of problem owners"}
                  {stageNumber === 4 && "What is your life purpose?"}
                  {stageNumber === 5 && "What is your Purpose-driven Major?"}
                </p>

                {/* Milestones */}
                <div className="stage-milestones">
                  {milestones.map((milestone, idx) => (
                    <div 
                      key={milestone.id}
                      className={`milestone ${milestone.completed ? 'completed' : ''}`}
                    >
                      <span className="milestone-icon">
                        {milestone.completed ? '✓' : '○'}
                      </span>
                      <span className="milestone-title">
                        {milestone.title}
                      </span>
                      {milestone.isStageCompleter && (
                        <span className="milestone-badge">Stage Completer</span>
                      )}
                    </div>
                  ))}
                </div>

                {/* Deliverable */}
                <div className="stage-deliverable-info">
                  <span className="deliverable-icon">📄</span>
                  <span className="deliverable-text">
                    {stageNumber === 1 && "Identity Statement"}
                    {stageNumber === 2 && "Problem Candidate List"}
                    {stageNumber === 3 && "Problem Owner Story"}
                    {stageNumber === 4 && "Life Purpose Statement"}
                    {stageNumber === 5 && "Purpose-Driven Project"}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Journey Stats */}
      <div className="journey-stats">
        <div className="stat">
          <span className="stat-label">Stages Completed</span>
          <span className="stat-value">{completedStages.length}/5</span>
        </div>
        <div className="stat">
          <span className="stat-label">Missions Completed</span>
          <span className="stat-value">{completedMissions.length}/30</span>
        </div>
        <div className="stat">
          <span className="stat-label">Completion</span>
          <span className="stat-value">
            {Math.round((completedMissions.length / 30) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default JourneyTimeline;