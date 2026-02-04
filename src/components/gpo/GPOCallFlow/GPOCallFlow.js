/**
 * GPS Lab Platform - GPOCallFlow Component
 * 
 * Main GPO Call workflow container managing stages -4 to 0.
 * Guides Problem Owners through creating their Problem Showcase.
 * 
 * @module components/gpo/GPOCallFlow
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GPOStageNavigator from './GPOStageNavigator';

// Stage components
import IntroductionForm from '../GPOStages/Stage_Negative4/IntroductionForm';
import ProblemStatementForm from '../GPOStages/Stage_Negative3/ProblemStatementForm';
import ProblemOwnerStoryForm from '../GPOStages/Stage_Negative2/ProblemOwnerStoryForm';
import VisionStatementForm from '../GPOStages/Stage_Negative1/VisionStatementForm';
import CallToActionForm from '../GPOStages/Stage0/CallToActionForm';
import ShowcasePreview from '../GPOShowcase/ShowcasePreview';

import './GPOCallFlow.css';

/**
 * GPO Stage Configuration
 */
const GPO_STAGES = [
  {
    number: -4,
    title: 'Who are you?',
    subtitle: 'Introduction',
    description: 'Introduce yourself and your community',
    component: IntroductionForm,
    icon: '👋'
  },
  {
    number: -3,
    title: 'What is your problem?',
    subtitle: 'Problem Definition',
    description: 'Define the problem clearly',
    component: ProblemStatementForm,
    icon: '🎯'
  },
  {
    number: -2,
    title: 'Whose pain?',
    subtitle: 'Problem Impact',
    description: 'Show who is affected by this problem',
    component: ProblemOwnerStoryForm,
    icon: '💔'
  },
  {
    number: -1,
    title: 'What future?',
    subtitle: 'Vision Statement',
    description: 'Paint a picture of the solution',
    component: VisionStatementForm,
    icon: '🌟'
  },
  {
    number: 0,
    title: 'How can GPS help?',
    subtitle: 'Call to Action',
    description: 'Invite Global Problem Solvers to collaborate',
    component: CallToActionForm,
    icon: '🤝'
  }
];

/**
 * GPOCallFlow Component
 */
const GPOCallFlow = ({
  initialStage = -4,
  onComplete,
  className = '',
  ...props
}) => {
  const navigate = useNavigate();
  const [currentStage, setCurrentStage] = useState(initialStage);
  const [stageData, setStageData] = useState({});
  const [completedStages, setCompletedStages] = useState([]);
  const [showPreview, setShowPreview] = useState(false);

  /**
   * Get current stage configuration
   */
  const currentStageConfig = GPO_STAGES.find(s => s.number === currentStage);
  const CurrentStageComponent = currentStageConfig?.component;

  /**
   * Calculate progress
   */
  const progress = ((completedStages.length / GPO_STAGES.length) * 100).toFixed(0);

  /**
   * Handle stage completion
   */
  const handleStageComplete = useCallback((stageNumber, data) => {
    // Save stage data
    setStageData(prev => ({
      ...prev,
      [stageNumber]: data
    }));

    // Mark stage as completed
    if (!completedStages.includes(stageNumber)) {
      setCompletedStages(prev => [...prev, stageNumber]);
    }

    // Move to next stage
    if (stageNumber < 0) {
      setCurrentStage(stageNumber + 1);
    } else {
      // Stage 0 completed - show preview
      setShowPreview(true);
    }
  }, [completedStages]);

  /**
   * Handle navigation to specific stage
   */
  const handleNavigateToStage = useCallback((stageNumber) => {
    setCurrentStage(stageNumber);
    setShowPreview(false);
  }, []);

  /**
   * Handle final submission
   */
  const handleSubmit = useCallback(async () => {
    try {
      // Submit complete showcase
      console.log('Submitting Problem Showcase:', stageData);
      
      // Call completion handler
      onComplete?.(stageData);
      
      // Navigate to success page
      navigate('/gpo-call/success');
    } catch (error) {
      console.error('Failed to submit showcase:', error);
    }
  }, [stageData, onComplete, navigate]);

  const classNames = ['gpo-call-flow', className].filter(Boolean).join(' ');

  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <div className="gpo-call-flow__header">
        <div className="gpo-call-flow__branding">
          <div className="gpo-call-flow__icon">📢</div>
          <div className="gpo-call-flow__title-section">
            <h1 className="gpo-call-flow__title">GPO Call</h1>
            <p className="gpo-call-flow__subtitle">Create Your Problem Showcase</p>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="gpo-call-flow__progress">
          <div className="gpo-call-flow__progress-bar">
            <div 
              className="gpo-call-flow__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="gpo-call-flow__progress-text">{progress}% Complete</span>
        </div>
      </div>

      {/* Stage Navigator */}
      <GPOStageNavigator
        stages={GPO_STAGES}
        currentStage={currentStage}
        completedStages={completedStages}
        onNavigateToStage={handleNavigateToStage}
      />

      {/* Content */}
      <div className="gpo-call-flow__content">
        {showPreview ? (
          <ShowcasePreview
            showcaseData={stageData}
            onEdit={handleNavigateToStage}
            onSubmit={handleSubmit}
          />
        ) : (
          <>
            {/* Stage Header */}
            <div className="gpo-call-flow__stage-header">
              <span className="gpo-call-flow__stage-icon">{currentStageConfig?.icon}</span>
              <div className="gpo-call-flow__stage-info">
                <h2 className="gpo-call-flow__stage-title">{currentStageConfig?.title}</h2>
                <p className="gpo-call-flow__stage-description">{currentStageConfig?.description}</p>
              </div>
            </div>

            {/* Stage Component */}
            {CurrentStageComponent && (
              <CurrentStageComponent
                stageData={stageData[currentStage] || {}}
                onComplete={(data) => handleStageComplete(currentStage, data)}
                onBack={() => currentStage > -4 && setCurrentStage(currentStage - 1)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GPOCallFlow;