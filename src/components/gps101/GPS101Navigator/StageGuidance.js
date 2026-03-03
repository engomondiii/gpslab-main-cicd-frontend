/**
 * Stage Guidance Component
 * 
 * Detailed guidance for each GPS 101 stage.
 */

import React from 'react';
import './StageGuidance.css';

const StageGuidance = ({ stage }) => {
  const getStageSpecificGuidance = () => {
    const stageGuidance = {
      1: {
        focus: 'Self-Discovery and Identity',
        keyActivities: [
          'Create your life timeline',
          'Identify defining moments',
          'Interview your future self',
          'Draft your identity manifesto',
          'Practice your "Who am I?" speech'
        ],
        commonChallenges: [
          'Being vulnerable and honest about failures',
          'Balancing humility with confidence',
          'Seeing yourself objectively'
        ],
        successTips: [
          'Don\'t rush - deep reflection takes time',
          'Be brutally honest with yourself',
          'Celebrate your unique journey',
          'Share your story with trusted peers'
        ]
      },
      2: {
        focus: 'Finding Your Life Problem',
        keyActivities: [
          'Explore global problems',
          'Run a problems tournament',
          'Bridge personal experiences to problems',
          'Engage in inner reflection',
          'Create a problems mind map',
          'Document 5-20 problem candidates'
        ],
        commonChallenges: [
          'Overwhelming number of global problems',
          'Distinguishing genuine calling from obligation',
          'Narrowing down to specific problems'
        ],
        successTips: [
          'Follow your emotional resonance',
          'Connect problems to personal experiences',
          'Don\'t overthink - trust your gut',
          'Quality matters more than quantity'
        ]
      },
      3: {
        focus: 'Understanding Problem Owners',
        keyActivities: [
          'Watch problem owner documentaries',
          'Research problem owners deeply',
          'Analyze systemic injustice',
          'Create mock fundraiser',
          'Write compelling problem owner story'
        ],
        commonChallenges: [
          'Developing genuine empathy vs. sympathy',
          'Understanding systemic vs. individual issues',
          'Writing engaging narratives'
        ],
        successTips: [
          'Listen more than you assume',
          'Seek first-hand stories',
          'Connect emotionally, analyze systemically',
          'Let their stories change you'
        ]
      },
      4: {
        focus: 'Defining Your Life Purpose',
        keyActivities: [
          'Draft problem and purpose statements',
          'Pressure test your purpose',
          'Capture your vision',
          'Conduct gap analysis',
          'Finalize life purpose statement'
        ],
        commonChallenges: [
          'Making purpose statement concise yet meaningful',
          'Balancing ambition with authenticity',
          'Overcoming self-doubt'
        ],
        successTips: [
          'Aim for clarity over complexity',
          'Make it actionable, not just aspirational',
          'Test it against real scenarios',
          'Revise until it resonates deeply'
        ]
      },
      5: {
        focus: 'Creating Your Purpose-Driven Project',
        keyActivities: [
          'Brainstorm project ideas',
          'Draft problem-solution canvas',
          'Pitch your project',
          'Gather feedback',
          'Finalize project plan'
        ],
        commonChallenges: [
          'Moving from abstract purpose to concrete project',
          'Defining realistic first steps',
          'Pitching with confidence'
        ],
        successTips: [
          'Start small, think big',
          'Focus on impact, not perfection',
          'Embrace feedback openly',
          'Your first project is a learning opportunity'
        ]
      }
    };

    return stageGuidance[stage.stageNumber] || {};
  };

  const guidance = getStageSpecificGuidance();

  return (
    <div className="stage-guidance">
      {/* Stage Overview */}
      <div className="guidance-section">
        <h4>Stage Question</h4>
        <div className="stage-question-card">
          <p className="question-text">{stage.question}</p>
          <p className="outcome-text">→ {stage.expectedOutcome}</p>
        </div>
      </div>

      {/* Focus */}
      {guidance.focus && (
        <div className="guidance-section">
          <h4>Primary Focus</h4>
          <p className="focus-text">{guidance.focus}</p>
        </div>
      )}

      {/* Key Activities */}
      {guidance.keyActivities && (
        <div className="guidance-section">
          <h4>Key Activities</h4>
          <ul className="activities-list">
            {guidance.keyActivities.map((activity, index) => (
              <li key={index}>{activity}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Common Challenges */}
      {guidance.commonChallenges && (
        <div className="guidance-section">
          <h4>Common Challenges</h4>
          <div className="challenges-list">
            {guidance.commonChallenges.map((challenge, index) => (
              <div key={index} className="challenge-card">
                <span className="challenge-icon">⚠️</span>
                <p>{challenge}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Success Tips */}
      {guidance.successTips && (
        <div className="guidance-section">
          <h4>Tips for Success</h4>
          <div className="tips-grid">
            {guidance.successTips.map((tip, index) => (
              <div key={index} className="tip-card">
                <span className="tip-icon">✨</span>
                <p>{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stage Metadata */}
      <div className="stage-metadata">
        <div className="metadata-item">
          <span className="metadata-label">Duration</span>
          <span className="metadata-value">{stage.duration}</span>
        </div>
        <div className="metadata-item">
          <span className="metadata-label">Missions</span>
          <span className="metadata-value">{stage.missions} missions</span>
        </div>
      </div>
    </div>
  );
};

export default StageGuidance;