/**
 * GPS 101 Navigator Guide Component
 * 
 * Context-aware Navigator AI assistance for GPS 101.
 */

import React, { useState } from 'react';
import { useGPS101Context } from '../../../context/GPS101Context';
import StageGuidance from './StageGuidance';
import './GPS101NavigatorGuide.css';

const GPS101NavigatorGuide = ({ stageNumber, missionId, checkpointId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { getCurrentStageData, getMissionById, getCheckpointById } = useGPS101Context();

  const stage = getCurrentStageData();
  const mission = missionId ? getMissionById(missionId) : null;
  const checkpoint = checkpointId ? getCheckpointById(checkpointId) : null;

  const getContextualGuidance = () => {
    if (checkpoint) {
      return {
        type: 'checkpoint',
        title: 'Checkpoint Guidance',
        content: getCheckpointGuidance(checkpoint)
      };
    }

    if (mission) {
      return {
        type: 'mission',
        title: 'Mission Guidance',
        content: getMissionGuidance(mission)
      };
    }

    if (stage) {
      return {
        type: 'stage',
        title: 'Stage Overview',
        content: getStageGuidance(stage)
      };
    }

    return {
      type: 'general',
      title: 'GPS 101 Navigation',
      content: getGeneralGuidance()
    };
  };

  const getCheckpointGuidance = (checkpoint) => {
    const guidance = {
      purpose: `This checkpoint helps you ${checkpoint.type === 'reflection' ? 'reflect on' : 'develop'} your understanding.`,
      tips: [
        'Take your time to think deeply',
        'Be honest and authentic in your response',
        'Use ChatGPT for brainstorming if needed',
        'Review the question carefully before submitting'
      ],
      chatGPTPrompts: getCheckpointPrompts(checkpoint)
    };

    return guidance;
  };

  const getMissionGuidance = (mission) => {
    const guidance = {
      purpose: mission.description,
      objectives: mission.objectives,
      tips: [
        'Complete checkpoints in order',
        'Save your work frequently',
        'Ask for help if you get stuck',
        'Reflect on your learning as you go'
      ],
      estimatedTime: '30-45 minutes'
    };

    return guidance;
  };

  const getStageGuidance = (stage) => {
    const guidance = {
      question: stage.question,
      expectedOutcome: stage.expectedOutcome,
      description: stage.description,
      duration: stage.duration,
      missions: stage.missions
    };

    return guidance;
  };

  const getGeneralGuidance = () => {
    return {
      welcome: 'Welcome to GPS 101!',
      purpose: 'This 15-week journey will help you discover your life purpose.',
      tips: [
        'Be patient with yourself',
        'Engage deeply with each stage',
        'Connect with your community',
        'Embrace the process of self-discovery'
      ]
    };
  };

  const getCheckpointPrompts = (checkpoint) => {
    const prompts = {
      reflection: [
        'Help me reflect on my identity and who I am as a person',
        'Guide me through understanding my strengths and values',
        'What questions should I ask myself about my purpose?'
      ],
      analysis: [
        'Help me analyze this problem from different perspectives',
        'What frameworks can I use to understand this issue?',
        'Guide me in breaking down this complex topic'
      ],
      creative: [
        'Help me brainstorm creative ideas for this challenge',
        'What are some innovative approaches I could take?',
        'Guide me in thinking outside the box'
      ],
      planning: [
        'Help me create a structured plan for this task',
        'What steps should I consider in my planning?',
        'Guide me in setting realistic milestones'
      ]
    };

    return prompts[checkpoint.type] || prompts.reflection;
  };

  const guidance = getContextualGuidance();

  return (
    <div className={`gps101-navigator-guide ${isExpanded ? 'expanded' : ''}`}>
      <div 
        className="navigator-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="header-left">
          <span className="navigator-icon">🧭</span>
          <span className="navigator-title">Navigator Guide</span>
        </div>
        <button className="expand-button">
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="navigator-content">
          <h3 className="guidance-title">{guidance.title}</h3>

          {guidance.type === 'stage' && (
            <StageGuidance stage={stage} />
          )}

          {guidance.type === 'mission' && (
            <div className="mission-guidance">
              <div className="guidance-section">
                <h4>Purpose</h4>
                <p>{guidance.content.purpose}</p>
              </div>

              <div className="guidance-section">
                <h4>Learning Objectives</h4>
                <ul className="objectives-list">
                  {guidance.content.objectives.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              </div>

              <div className="guidance-section">
                <h4>Tips for Success</h4>
                <ul className="tips-list">
                  {guidance.content.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="estimated-time">
                <span className="time-icon">⏱️</span>
                <span>Estimated time: {guidance.content.estimatedTime}</span>
              </div>
            </div>
          )}

          {guidance.type === 'checkpoint' && (
            <div className="checkpoint-guidance">
              <div className="guidance-section">
                <h4>About This Checkpoint</h4>
                <p>{guidance.content.purpose}</p>
              </div>

              <div className="guidance-section">
                <h4>Tips</h4>
                <ul className="tips-list">
                  {guidance.content.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>

              <div className="guidance-section">
                <h4>ChatGPT Prompts You Can Use</h4>
                <div className="prompts-list">
                  {guidance.content.chatGPTPrompts.map((prompt, index) => (
                    <div key={index} className="prompt-card">
                      <span className="prompt-icon">💡</span>
                      <p className="prompt-text">"{prompt}"</p>
                      <button 
                        className="copy-prompt-button"
                        onClick={() => navigator.clipboard.writeText(prompt)}
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {guidance.type === 'general' && (
            <div className="general-guidance">
              <div className="guidance-section">
                <h4>{guidance.content.welcome}</h4>
                <p>{guidance.content.purpose}</p>
              </div>

              <div className="guidance-section">
                <h4>Getting Started</h4>
                <ul className="tips-list">
                  {guidance.content.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Navigator AI Chat Link */}
          <div className="navigator-chat-link">
            <button className="chat-button">
              <span className="chat-icon">💬</span>
              <span>Ask Navigator AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GPS101NavigatorGuide;