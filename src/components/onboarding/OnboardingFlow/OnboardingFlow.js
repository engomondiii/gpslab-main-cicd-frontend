/**
 * GPS Lab Platform - OnboardingFlow Component
 * 
 * Complete onboarding flow orchestrator.
 * Manages step progression through welcome, tutorial, language, and profile setup.
 * 
 * @module components/onboarding/OnboardingFlow
 */

import React, { useState, useCallback, useMemo } from 'react';
import WelcomeScreen from '../WelcomeScreen/WelcomeScreen';
import TutorialSlides from '../TutorialSlides/TutorialSlides';
import LanguageSelection from '../LanguageSelection/LanguageSelection';
import ProfileSetupForm from '../ProfileSetup/ProfileSetupForm';
import './OnboardingFlow.css';

/**
 * Onboarding steps
 */
const ONBOARDING_STEPS = {
  WELCOME: 'welcome',
  TUTORIAL: 'tutorial',
  LANGUAGE: 'language',
  PROFILE: 'profile',
  COMPLETE: 'complete'
};

/**
 * Step order
 */
const STEP_ORDER = [
  ONBOARDING_STEPS.WELCOME,
  ONBOARDING_STEPS.TUTORIAL,
  ONBOARDING_STEPS.LANGUAGE,
  ONBOARDING_STEPS.PROFILE
];

/**
 * OnboardingFlow Component
 */
const OnboardingFlow = ({
  user = {},
  onComplete,
  onSkip,
  initialStep = ONBOARDING_STEPS.WELCOME,
  initialLanguage = 'en',
  className = '',
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [isLoading, setIsLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    language: initialLanguage,
    profile: {}
  });
  
  /**
   * Get current step index
   */
  const currentStepIndex = useMemo(() => {
    return STEP_ORDER.indexOf(currentStep);
  }, [currentStep]);
  
  /**
   * Progress percentage
   */
  const progress = useMemo(() => {
    return ((currentStepIndex + 1) / STEP_ORDER.length) * 100;
  }, [currentStepIndex]);
  
  /**
   * Go to next step
   */
  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEP_ORDER.length) {
      setCurrentStep(STEP_ORDER[nextIndex]);
    } else {
      setCurrentStep(ONBOARDING_STEPS.COMPLETE);
    }
  }, [currentStepIndex]);
  
  /**
   * Go to previous step
   */
  const prevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEP_ORDER[prevIndex]);
    }
  }, [currentStepIndex]);
  
  /**
   * Handle welcome continue
   */
  const handleWelcomeContinue = useCallback(() => {
    nextStep();
  }, [nextStep]);
  
  /**
   * Handle tutorial complete
   */
  const handleTutorialComplete = useCallback(() => {
    nextStep();
  }, [nextStep]);
  
  /**
   * Handle tutorial skip
   */
  const handleTutorialSkip = useCallback(() => {
    nextStep();
  }, [nextStep]);
  
  /**
   * Handle language selection
   */
  const handleLanguageSelect = useCallback((language) => {
    setOnboardingData(prev => ({ ...prev, language }));
  }, []);
  
  /**
   * Handle language continue
   */
  const handleLanguageContinue = useCallback((language) => {
    setOnboardingData(prev => ({ ...prev, language }));
    nextStep();
  }, [nextStep]);
  
  /**
   * Handle profile submit
   */
  const handleProfileSubmit = useCallback(async (profileData) => {
    setIsLoading(true);
    
    try {
      // Combine all onboarding data
      const completeData = {
        ...onboardingData,
        profile: profileData,
        completedAt: new Date().toISOString()
      };
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Call completion handler
      await onComplete?.(completeData);
      
      setCurrentStep(ONBOARDING_STEPS.COMPLETE);
    } catch (error) {
      console.error('Profile setup error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onboardingData, onComplete]);
  
  /**
   * Handle skip onboarding
   */
  const handleSkip = useCallback(() => {
    onSkip?.();
  }, [onSkip]);
  
  /**
   * Render current step
   */
  const renderStep = () => {
    switch (currentStep) {
      case ONBOARDING_STEPS.WELCOME:
        return (
          <WelcomeScreen
            userName={user.firstName || user.displayName}
            onContinue={handleWelcomeContinue}
          />
        );
        
      case ONBOARDING_STEPS.TUTORIAL:
        return (
          <TutorialSlides
            onComplete={handleTutorialComplete}
            onSkip={handleTutorialSkip}
            showSkip={true}
          />
        );
        
      case ONBOARDING_STEPS.LANGUAGE:
        return (
          <LanguageSelection
            initialLanguage={onboardingData.language}
            onSelect={handleLanguageSelect}
            onContinue={handleLanguageContinue}
            onBack={prevStep}
          />
        );
        
      case ONBOARDING_STEPS.PROFILE:
        return (
          <ProfileSetupForm
            initialData={{
              displayName: user.displayName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
              ...onboardingData.profile
            }}
            onSubmit={handleProfileSubmit}
            onBack={prevStep}
            isLoading={isLoading}
          />
        );
        
      case ONBOARDING_STEPS.COMPLETE:
        return (
          <div className="onboarding-flow__complete">
            <div className="onboarding-flow__complete-content">
              <div className="onboarding-flow__complete-icon">
                <svg viewBox="0 0 64 64" fill="currentColor">
                  <circle cx="32" cy="32" r="28" opacity="0.2"/>
                  <path d="M26 32l4 4 8-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
              </div>
              <h2 className="onboarding-flow__complete-title">You're All Set!</h2>
              <p className="onboarding-flow__complete-text">
                Your GPS journey begins now. Ready to tackle your first mission?
              </p>
              <button
                type="button"
                onClick={() => window.location.href = '/dashboard'}
                className="onboarding-flow__complete-btn"
              >
                Go to Dashboard
                <svg viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"/>
                </svg>
              </button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  const classNames = ['onboarding-flow', className].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Progress Bar (hidden on welcome and complete) */}
      {currentStep !== ONBOARDING_STEPS.WELCOME && currentStep !== ONBOARDING_STEPS.COMPLETE && (
        <div className="onboarding-flow__progress">
          <div className="onboarding-flow__progress-track">
            <div 
              className="onboarding-flow__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="onboarding-flow__progress-steps">
            {STEP_ORDER.map((step, index) => (
              <div
                key={step}
                className={`onboarding-flow__progress-step ${
                  index <= currentStepIndex 
                    ? 'onboarding-flow__progress-step--completed' 
                    : ''
                } ${
                  index === currentStepIndex 
                    ? 'onboarding-flow__progress-step--active' 
                    : ''
                }`}
              >
                <span className="onboarding-flow__progress-dot" />
                <span className="onboarding-flow__progress-label">
                  {step.charAt(0).toUpperCase() + step.slice(1)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skip Button (only on welcome) */}
      {currentStep === ONBOARDING_STEPS.WELCOME && onSkip && (
        <button
          type="button"
          onClick={handleSkip}
          className="onboarding-flow__skip"
        >
          Skip Onboarding
        </button>
      )}
      
      {/* Step Content */}
      <div className="onboarding-flow__content">
        {renderStep()}
      </div>
    </div>
  );
};

export { ONBOARDING_STEPS, STEP_ORDER };
export default OnboardingFlow;