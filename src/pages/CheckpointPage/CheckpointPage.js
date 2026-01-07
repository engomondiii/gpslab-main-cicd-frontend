/**
 * GPS Lab Platform - CheckpointPage
 * 
 * Main page component for checkpoint evaluation.
 * Orchestrates the entire checkpoint flow from intro to results.
 * 
 * @module pages/CheckpointPage/CheckpointPage
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CheckpointArena from '../../components/checkpoint/CheckpointArena/CheckpointArena';
import CheckpointEvaluationPanel from '../../components/checkpoint/CheckpointEvaluation/CheckpointEvaluationPanel';
import CheckpointResultsScreen from '../../components/checkpoint/CheckpointResults/CheckpointResultsScreen';
import CheckpointFeedback from '../../components/checkpoint/CheckpointFeedback/CheckpointFeedback';
import './CheckpointPage.css';

/**
 * Mock checkpoint data for demonstration
 */
const MOCK_CHECKPOINT = {
  id: 'cp-stage-1',
  title: 'Stage 1 Checkpoint',
  description: 'Demonstrate your understanding of problem identification and customer discovery fundamentals.',
  stage: 1,
  passingScore: 70,
  timeLimit: 1800, // 30 minutes in seconds
  instructions: [
    'Read each criteria carefully before scoring',
    'Provide honest self-assessment based on your work',
    'Add notes to explain your reasoning where helpful',
    'You can pause and resume if needed'
  ],
  tips: [
    'Focus on demonstrating evidence of learning, not perfection',
    'Quality of reflection matters more than quantity',
    'Reference specific examples from your missions'
  ],
  rubric: [
    {
      id: 'criteria-1',
      title: 'Problem Understanding',
      description: 'Demonstrates clear understanding of the problem being addressed and its significance.',
      weight: 25,
      levelDescriptions: {
        1: 'Problem statement is vague or unclear',
        2: 'Basic problem understanding with some gaps',
        3: 'Clear problem understanding with good context',
        4: 'Exceptional insight into problem nuances and root causes'
      }
    },
    {
      id: 'criteria-2',
      title: 'Customer Discovery',
      description: 'Shows evidence of customer research and understanding of target users.',
      weight: 25,
      levelDescriptions: {
        1: 'Little to no customer research evident',
        2: 'Some customer insights but limited depth',
        3: 'Good customer research with clear persona understanding',
        4: 'Comprehensive research with deep customer empathy'
      }
    },
    {
      id: 'criteria-3',
      title: 'Solution Approach',
      description: 'Presents a logical and feasible approach to solving the identified problem.',
      weight: 25,
      levelDescriptions: {
        1: 'Solution is unclear or not feasible',
        2: 'Basic solution with some feasibility concerns',
        3: 'Well-reasoned solution with clear implementation path',
        4: 'Innovative solution with strong feasibility analysis'
      }
    },
    {
      id: 'criteria-4',
      title: 'Reflection & Growth',
      description: 'Demonstrates self-awareness, learning, and growth mindset.',
      weight: 25,
      levelDescriptions: {
        1: 'Limited reflection on learning process',
        2: 'Some reflection but lacks depth',
        3: 'Good reflection with clear growth insights',
        4: 'Exceptional metacognition and growth orientation'
      }
    }
  ]
};

/**
 * Mock mission data
 */
const MOCK_MISSION = {
  id: 'mission-1',
  title: 'GPS 101: Foundation'
};

/**
 * CheckpointPage Component
 */
const CheckpointPage = () => {
  const { checkpointId } = useParams();
  const navigate = useNavigate();
  
  // State
  const [checkpoint, setCheckpoint] = useState(null);
  const [mission, setMission] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Evaluation state
  const [scores, setScores] = useState({});
  const [feedback, setFeedback] = useState({});
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  
  // AI Feedback state
  const [aiFeedback, setAiFeedback] = useState({});
  const [isAILoading, setIsAILoading] = useState(false);
  
  // Mentor Feedback state
  const [mentor, setMentor] = useState(null);
  const [mentorFeedback, setMentorFeedback] = useState({});
  
  // Load checkpoint data
  useEffect(() => {
    const loadCheckpoint = async () => {
      setIsLoading(true);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Use mock data for now
        setCheckpoint(MOCK_CHECKPOINT);
        setMission(MOCK_MISSION);
      } catch (err) {
        setError('Failed to load checkpoint');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCheckpoint();
  }, [checkpointId]);
  
  // Handle score change
  const handleScoreChange = useCallback((criteriaId, score) => {
    setScores(prev => ({
      ...prev,
      [criteriaId]: score
    }));
  }, []);
  
  // Handle feedback change
  const handleFeedbackChange = useCallback((criteriaId, text) => {
    setFeedback(prev => ({
      ...prev,
      [criteriaId]: text
    }));
  }, []);
  
  // Handle evaluation submission
  const handleSubmit = useCallback(async (evaluationData) => {
    console.log('Submitting evaluation:', evaluationData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return evaluationData;
  }, []);
  
  // Handle evaluation completion
  const handleComplete = useCallback(async (result) => {
    console.log('Evaluation complete:', result);
    
    // Calculate detailed results
    const detailedResult = {
      ...result,
      passed: result.scorePercentage >= checkpoint.passingScore,
      rewards: result.passed ? {
        xp: 250,
        baraka: 50,
        badge: result.scorePercentage >= 90 ? 'Stage 1 Excellence' : null
      } : {},
      weakAreas: checkpoint.rubric
        .filter(c => (result.scores[c.id] || 0) < 3)
        .map(c => ({ title: c.title, score: result.scores[c.id] })),
      studyRecommendations: [
        { title: 'Customer Discovery Deep Dive', type: 'Study Mission' },
        { title: 'Problem Framing Workshop', type: 'Interactive' }
      ],
      retryOptions: {
        r2r: 2,
        pr2r: 1
      },
      nextStage: result.passed ? {
        number: 2,
        title: 'Solution Validation'
      } : null
    };
    
    setEvaluationResult(detailedResult);
    
    // Generate AI feedback
    if (detailedResult.passed || detailedResult.scorePercentage >= 50) {
      generateAIFeedback(detailedResult);
    }
  }, [checkpoint]);
  
  // Generate AI feedback
  const generateAIFeedback = useCallback(async (result) => {
    setIsAILoading(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const feedback = {
      summary: `You demonstrated ${result.passed ? 'solid' : 'developing'} competency in Stage ${checkpoint.stage} skills. Your strongest area was problem understanding, and there's opportunity to deepen your customer discovery approach.`,
      strengths: [
        'Clear articulation of the core problem',
        'Logical approach to solution development',
        'Good self-awareness in reflections'
      ],
      improvements: [
        'Deepen customer research with more direct interviews',
        'Strengthen evidence-based reasoning in solution approach',
        'Connect learning points to specific next actions'
      ],
      suggestions: [
        'Review the Customer Discovery module before your next mission',
        'Practice the "5 Whys" technique for deeper problem analysis',
        'Schedule a mentor session to discuss your approach'
      ],
      encouragement: result.passed 
        ? "Great progress! You're building a solid foundation for the challenges ahead."
        : "Keep pushing forward. Every attempt brings you closer to mastery."
    };
    
    setAiFeedback(feedback);
    setIsAILoading(false);
  }, [checkpoint]);
  
  // Navigation handlers
  const handleBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  const handleContinue = useCallback(() => {
    if (evaluationResult?.passed && evaluationResult?.nextStage) {
      navigate(`/missions/stage-${evaluationResult.nextStage.number}`);
    } else {
      navigate('/dashboard');
    }
  }, [navigate, evaluationResult]);
  
  const handleRetry = useCallback(() => {
    // Reset evaluation state
    setScores({});
    setFeedback({});
    setEvaluationResult(null);
    setShowFeedback(false);
    setAiFeedback({});
  }, []);
  
  const handleStudy = useCallback((recommendation) => {
    console.log('Navigate to study:', recommendation);
    navigate('/study-forge');
  }, [navigate]);
  
  const handleViewDetails = useCallback(() => {
    setShowFeedback(true);
  }, []);
  
  const handleExit = useCallback(() => {
    navigate('/dashboard');
  }, [navigate]);
  
  // Loading state
  if (isLoading) {
    return (
      <div className="checkpoint-page checkpoint-page--loading">
        <div className="checkpoint-page__loader">
          <div className="checkpoint-page__loader-spinner" />
          <p>Loading checkpoint...</p>
        </div>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div className="checkpoint-page checkpoint-page--error">
        <div className="checkpoint-page__error">
          <h2>Unable to Load Checkpoint</h2>
          <p>{error}</p>
          <button onClick={handleBack}>Go Back</button>
        </div>
      </div>
    );
  }
  
  // Show feedback view
  if (showFeedback && evaluationResult) {
    return (
      <div className="checkpoint-page checkpoint-page--feedback">
        <div className="checkpoint-page__feedback-header">
          <button
            type="button"
            onClick={() => setShowFeedback(false)}
            className="checkpoint-page__back-btn"
          >
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd"/>
            </svg>
            Back to Results
          </button>
        </div>
        
        <div className="checkpoint-page__feedback-content">
          <CheckpointFeedback
            checkpoint={checkpoint}
            aiFeedback={aiFeedback}
            mentorFeedback={mentorFeedback}
            mentor={mentor}
            criteriaFeedback={checkpoint.rubric.map(c => ({
              criteriaId: c.id,
              title: c.title,
              score: scores[c.id],
              feedback: feedback[c.id] || c.levelDescriptions[scores[c.id]] || ''
            }))}
            isAILoading={isAILoading}
            onAskAI={(question) => console.log('AI Question:', question)}
            onScheduleSession={() => console.log('Schedule session')}
            onSendMentorMessage={(msg) => console.log('Send message:', msg)}
            onThankMentor={() => console.log('Thank mentor')}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="checkpoint-page">
      <CheckpointArena
        checkpoint={checkpoint}
        mission={mission}
        onBack={handleBack}
        onSubmit={handleSubmit}
        onComplete={handleComplete}
      >
        {/* Evaluation Panel - passed as children to arena */}
        {!evaluationResult ? (
          <CheckpointEvaluationPanel
            checkpoint={checkpoint}
            scores={scores}
            feedback={feedback}
            onScoreChange={handleScoreChange}
            onFeedbackChange={handleFeedbackChange}
          />
        ) : (
          <CheckpointResultsScreen
            checkpoint={checkpoint}
            result={evaluationResult}
            onContinue={handleContinue}
            onRetry={handleRetry}
            onStudy={handleStudy}
            onViewDetails={handleViewDetails}
            onExit={handleExit}
          />
        )}
      </CheckpointArena>
    </div>
  );
};

export default CheckpointPage;