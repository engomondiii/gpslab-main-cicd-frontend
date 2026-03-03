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

// Showcase Preview (if available - otherwise will show simple preview)
// import ShowcasePreview from '../GPOShowcase/ShowcasePreview';

// Utilities
import { buildShowcaseSummary, isGPOCallComplete, calculateGPOProgress } from '../../../utils/helpers/gpo.helper';
import { validateAllGPOStages } from '../../../utils/validators/gpo.validator';
import { formatStageCompletionMessage } from '../../../utils/formatters/gpo.formatter';

import './GPOCallFlow.css';

/**
 * Simple Showcase Preview Component
 * TODO: Replace with full ShowcasePreview component when available
 */
const SimpleShowcasePreview = ({ showcaseData, onEdit, onSubmit }) => {
  return (
    <div style={{ padding: '24px' }}>
      <div style={{ 
        padding: '24px', 
        background: 'linear-gradient(135deg, rgba(0,212,255,0.1), rgba(42,157,143,0.1))',
        borderRadius: '12px',
        marginBottom: '24px'
      }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', marginBottom: '12px' }}>
          🎉 Your Problem Showcase is Ready!
        </h2>
        <p style={{ color: '#8b949e', lineHeight: '1.8' }}>
          You've completed all 5 stages. Review your showcase below, then submit to make it live.
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '12px' }}>Summary</h3>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <li>✅ Introduction Complete</li>
          <li>✅ Problem Statement Complete</li>
          <li>✅ Impact Story Complete</li>
          <li>✅ Vision Statement Complete</li>
          <li>✅ Call to Action Complete</li>
        </ul>
      </div>

      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
        <button
          type="button"
          onClick={() => onEdit(-4)}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#1b263b',
            backgroundColor: '#ffffff',
            border: '2px solid #d0d7de',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          ← Edit Stages
        </button>
        <button
          type="button"
          onClick={onSubmit}
          style={{
            padding: '12px 24px',
            fontSize: '16px',
            fontWeight: '600',
            color: '#0d1117',
            background: 'linear-gradient(135deg, #00d4ff, #2a9d8f)',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          🚀 Submit Showcase
        </button>
      </div>
    </div>
  );
};

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
   * Calculate progress using utility
   */
  const progress = calculateGPOProgress(completedStages);

  /**
   * Check if all stages are complete
   */
  const allStagesComplete = isGPOCallComplete(completedStages);

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

    // Show completion message
    const message = formatStageCompletionMessage(stageNumber);
    console.log(message);

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
      // Validate all stages before submission
      const { valid, stageErrors } = validateAllGPOStages(stageData);
      
      if (!valid) {
        console.error('Validation errors:', stageErrors);
        alert('Please complete all required fields in all stages before submitting.');
        return;
      }

      // Build showcase summary using utility
      const showcaseSummary = buildShowcaseSummary(stageData);
      
      console.log('Submitting Problem Showcase:', showcaseSummary);
      
      // Call completion handler
      onComplete?.(showcaseSummary);
      
      // Navigate to success page
      navigate('/gpo-call/success', { state: { showcaseData: showcaseSummary } });
    } catch (error) {
      console.error('Failed to submit showcase:', error);
      alert('An error occurred while submitting. Please try again.');
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
          <SimpleShowcasePreview
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