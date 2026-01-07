/**
 * GPS Lab Platform - ProjectWizard Component
 * 
 * Multi-step wizard for guided project creation with
 * problem validation, market research, and team setup.
 * 
 * @module components/project/ProjectCreation/ProjectWizard
 */

import React, { useState, useCallback } from 'react';
import './ProjectWizard.css';

/**
 * Get beacon color for stage
 */
const getBeaconColor = (stage) => {
  const colors = {
    1: 'var(--beacon-red, #e74c3c)',
    2: 'var(--beacon-orange, #f39c12)',
    3: 'var(--beacon-yellow, #f1c40f)',
    4: 'var(--beacon-green, #2ecc71)',
    5: 'var(--beacon-blue, #3498db)',
    6: 'var(--beacon-indigo, #9b59b6)',
    7: 'var(--beacon-purple, #8e44ad)'
  };
  return colors[stage] || 'var(--gps-primary, #00d4ff)';
};

/**
 * Wizard steps configuration
 */
const WIZARD_STEPS = [
  {
    id: 'problem',
    title: 'Define the Problem',
    description: 'Start by clearly articulating the problem you want to solve',
    icon: '🔍'
  },
  {
    id: 'audience',
    title: 'Target Audience',
    description: 'Identify who experiences this problem most',
    icon: '👥'
  },
  {
    id: 'solution',
    title: 'Your Solution',
    description: 'Describe your proposed approach',
    icon: '💡'
  },
  {
    id: 'validation',
    title: 'Validation',
    description: 'How will you test your assumptions?',
    icon: '✓'
  },
  {
    id: 'team',
    title: 'Team & Resources',
    description: 'What skills and resources do you need?',
    icon: '🚀'
  }
];

/**
 * ProjectWizard Component
 */
const ProjectWizard = ({
  onComplete,
  onCancel,
  isLoading = false,
  initialData = {},
  className = '',
  ...props
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Problem
    problemTitle: initialData.problemTitle || '',
    problemDescription: initialData.problemDescription || '',
    problemScale: initialData.problemScale || '',
    problemEvidence: initialData.problemEvidence || '',
    
    // Audience
    primaryAudience: initialData.primaryAudience || '',
    audienceSize: initialData.audienceSize || '',
    audiencePainPoints: initialData.audiencePainPoints || '',
    existingSolutions: initialData.existingSolutions || '',
    
    // Solution
    solutionDescription: initialData.solutionDescription || '',
    uniqueValue: initialData.uniqueValue || '',
    keyFeatures: initialData.keyFeatures || [],
    solutionType: initialData.solutionType || '',
    
    // Validation
    assumptions: initialData.assumptions || '',
    validationMethod: initialData.validationMethod || '',
    successMetrics: initialData.successMetrics || '',
    timeline: initialData.timeline || '',
    
    // Team
    teamNeeds: initialData.teamNeeds || [],
    resources: initialData.resources || '',
    budget: initialData.budget || '',
    projectName: initialData.projectName || ''
  });
  const [errors, setErrors] = useState({});
  const [featureInput, setFeatureInput] = useState('');
  
  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  }, [errors]);
  
  const handleAddFeature = useCallback(() => {
    const feature = featureInput.trim();
    if (feature && formData.keyFeatures.length < 5 && !formData.keyFeatures.includes(feature)) {
      setFormData(prev => ({ ...prev, keyFeatures: [...prev.keyFeatures, feature] }));
      setFeatureInput('');
    }
  }, [featureInput, formData.keyFeatures]);
  
  const handleRemoveFeature = useCallback((featureToRemove) => {
    setFormData(prev => ({
      ...prev,
      keyFeatures: prev.keyFeatures.filter(f => f !== featureToRemove)
    }));
  }, []);
  
  const handleToggleTeamNeed = useCallback((need) => {
    setFormData(prev => ({
      ...prev,
      teamNeeds: prev.teamNeeds.includes(need)
        ? prev.teamNeeds.filter(n => n !== need)
        : [...prev.teamNeeds, need]
    }));
  }, []);
  
  const validateStep = (stepIndex) => {
    const newErrors = {};
    const step = WIZARD_STEPS[stepIndex];
    
    switch (step.id) {
      case 'problem':
        if (!formData.problemTitle.trim()) {
          newErrors.problemTitle = 'Problem title is required';
        }
        if (!formData.problemDescription.trim()) {
          newErrors.problemDescription = 'Problem description is required';
        }
        break;
      case 'audience':
        if (!formData.primaryAudience.trim()) {
          newErrors.primaryAudience = 'Primary audience is required';
        }
        break;
      case 'solution':
        if (!formData.solutionDescription.trim()) {
          newErrors.solutionDescription = 'Solution description is required';
        }
        break;
      case 'validation':
        if (!formData.validationMethod.trim()) {
          newErrors.validationMethod = 'Validation method is required';
        }
        break;
      case 'team':
        if (!formData.projectName.trim()) {
          newErrors.projectName = 'Project name is required';
        }
        break;
      default:
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, WIZARD_STEPS.length - 1));
    }
  };
  
  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    
    if (onComplete) {
      await onComplete(formData);
    }
  };
  
  const currentStepConfig = WIZARD_STEPS[currentStep];
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;
  
  const classNames = [
    'project-wizard',
    isLoading && 'project-wizard--loading',
    className
  ].filter(Boolean).join(' ');
  
  return (
    <div className={classNames} {...props}>
      {/* Header */}
      <header className="project-wizard__header">
        <div className="project-wizard__header-content">
          <span className="project-wizard__step-icon">{currentStepConfig.icon}</span>
          <div>
            <h2 className="project-wizard__title">{currentStepConfig.title}</h2>
            <p className="project-wizard__description">{currentStepConfig.description}</p>
          </div>
        </div>
        
        {/* Progress */}
        <div className="project-wizard__progress">
          <div className="project-wizard__progress-bar">
            <div 
              className="project-wizard__progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="project-wizard__progress-text">
            Step {currentStep + 1} of {WIZARD_STEPS.length}
          </span>
        </div>
      </header>
      
      {/* Step Navigation */}
      <nav className="project-wizard__nav">
        {WIZARD_STEPS.map((step, index) => (
          <button
            key={step.id}
            type="button"
            className={`project-wizard__nav-item ${currentStep === index ? 'project-wizard__nav-item--active' : ''} ${currentStep > index ? 'project-wizard__nav-item--completed' : ''}`}
            onClick={() => index <= currentStep && setCurrentStep(index)}
            disabled={index > currentStep}
          >
            <span className="project-wizard__nav-icon">{step.icon}</span>
            <span className="project-wizard__nav-label">{step.title}</span>
          </button>
        ))}
      </nav>
      
      {/* Content */}
      <div className="project-wizard__content">
        {/* Step 1: Problem */}
        {currentStep === 0 && (
          <div className="project-wizard__step">
            <div className="project-wizard__field">
              <label className="project-wizard__label">
                Problem Title <span className="project-wizard__required">*</span>
              </label>
              <input
                type="text"
                value={formData.problemTitle}
                onChange={(e) => handleChange('problemTitle', e.target.value)}
                placeholder="Give your problem a clear, concise title"
                className={`project-wizard__input ${errors.problemTitle ? 'project-wizard__input--error' : ''}`}
              />
              {errors.problemTitle && (
                <span className="project-wizard__error">{errors.problemTitle}</span>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">
                Problem Description <span className="project-wizard__required">*</span>
              </label>
              <textarea
                value={formData.problemDescription}
                onChange={(e) => handleChange('problemDescription', e.target.value)}
                placeholder="Describe the problem in detail. What pain does it cause? Why does it matter?"
                className={`project-wizard__textarea ${errors.problemDescription ? 'project-wizard__textarea--error' : ''}`}
              />
              {errors.problemDescription && (
                <span className="project-wizard__error">{errors.problemDescription}</span>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Scale of Impact</label>
              <select
                value={formData.problemScale}
                onChange={(e) => handleChange('problemScale', e.target.value)}
                className="project-wizard__select"
              >
                <option value="">Select scale...</option>
                <option value="local">Local (Community/City)</option>
                <option value="regional">Regional (State/Province)</option>
                <option value="national">National</option>
                <option value="global">Global</option>
              </select>
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Evidence</label>
              <textarea
                value={formData.problemEvidence}
                onChange={(e) => handleChange('problemEvidence', e.target.value)}
                placeholder="What evidence do you have that this problem exists? Statistics, research, personal experience..."
                className="project-wizard__textarea project-wizard__textarea--short"
              />
            </div>
          </div>
        )}
        
        {/* Step 2: Audience */}
        {currentStep === 1 && (
          <div className="project-wizard__step">
            <div className="project-wizard__field">
              <label className="project-wizard__label">
                Primary Audience <span className="project-wizard__required">*</span>
              </label>
              <input
                type="text"
                value={formData.primaryAudience}
                onChange={(e) => handleChange('primaryAudience', e.target.value)}
                placeholder="Who experiences this problem most? Be specific."
                className={`project-wizard__input ${errors.primaryAudience ? 'project-wizard__input--error' : ''}`}
              />
              {errors.primaryAudience && (
                <span className="project-wizard__error">{errors.primaryAudience}</span>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Estimated Audience Size</label>
              <select
                value={formData.audienceSize}
                onChange={(e) => handleChange('audienceSize', e.target.value)}
                className="project-wizard__select"
              >
                <option value="">Select size...</option>
                <option value="hundreds">Hundreds</option>
                <option value="thousands">Thousands</option>
                <option value="tens-of-thousands">Tens of Thousands</option>
                <option value="hundreds-of-thousands">Hundreds of Thousands</option>
                <option value="millions">Millions</option>
              </select>
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Key Pain Points</label>
              <textarea
                value={formData.audiencePainPoints}
                onChange={(e) => handleChange('audiencePainPoints', e.target.value)}
                placeholder="What specific frustrations or challenges does your audience face?"
                className="project-wizard__textarea"
              />
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Existing Solutions</label>
              <textarea
                value={formData.existingSolutions}
                onChange={(e) => handleChange('existingSolutions', e.target.value)}
                placeholder="What solutions currently exist? Why aren't they sufficient?"
                className="project-wizard__textarea project-wizard__textarea--short"
              />
            </div>
          </div>
        )}
        
        {/* Step 3: Solution */}
        {currentStep === 2 && (
          <div className="project-wizard__step">
            <div className="project-wizard__field">
              <label className="project-wizard__label">
                Solution Description <span className="project-wizard__required">*</span>
              </label>
              <textarea
                value={formData.solutionDescription}
                onChange={(e) => handleChange('solutionDescription', e.target.value)}
                placeholder="Describe your proposed solution. How will it solve the problem?"
                className={`project-wizard__textarea ${errors.solutionDescription ? 'project-wizard__textarea--error' : ''}`}
              />
              {errors.solutionDescription && (
                <span className="project-wizard__error">{errors.solutionDescription}</span>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Unique Value Proposition</label>
              <textarea
                value={formData.uniqueValue}
                onChange={(e) => handleChange('uniqueValue', e.target.value)}
                placeholder="What makes your solution different and better than alternatives?"
                className="project-wizard__textarea project-wizard__textarea--short"
              />
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Key Features (max 5)</label>
              <div className="project-wizard__feature-input">
                <input
                  type="text"
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                  placeholder="Add a key feature..."
                  className="project-wizard__input"
                  disabled={formData.keyFeatures.length >= 5}
                />
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="project-wizard__add-btn"
                  disabled={formData.keyFeatures.length >= 5 || !featureInput.trim()}
                >
                  Add
                </button>
              </div>
              {formData.keyFeatures.length > 0 && (
                <ul className="project-wizard__feature-list">
                  {formData.keyFeatures.map((feature, index) => (
                    <li key={index} className="project-wizard__feature-item">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFeature(feature)}
                        className="project-wizard__feature-remove"
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Solution Type</label>
              <div className="project-wizard__options">
                {['Product', 'Service', 'Platform', 'App', 'Content', 'Other'].map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`project-wizard__option ${formData.solutionType === type ? 'project-wizard__option--selected' : ''}`}
                    onClick={() => handleChange('solutionType', type)}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Step 4: Validation */}
        {currentStep === 3 && (
          <div className="project-wizard__step">
            <div className="project-wizard__field">
              <label className="project-wizard__label">Key Assumptions</label>
              <textarea
                value={formData.assumptions}
                onChange={(e) => handleChange('assumptions', e.target.value)}
                placeholder="What assumptions are you making about the problem, audience, or solution?"
                className="project-wizard__textarea"
              />
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">
                Validation Method <span className="project-wizard__required">*</span>
              </label>
              <textarea
                value={formData.validationMethod}
                onChange={(e) => handleChange('validationMethod', e.target.value)}
                placeholder="How will you test your assumptions? Surveys, interviews, prototypes..."
                className={`project-wizard__textarea ${errors.validationMethod ? 'project-wizard__textarea--error' : ''}`}
              />
              {errors.validationMethod && (
                <span className="project-wizard__error">{errors.validationMethod}</span>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Success Metrics</label>
              <textarea
                value={formData.successMetrics}
                onChange={(e) => handleChange('successMetrics', e.target.value)}
                placeholder="How will you measure success? What KPIs will you track?"
                className="project-wizard__textarea project-wizard__textarea--short"
              />
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Timeline</label>
              <select
                value={formData.timeline}
                onChange={(e) => handleChange('timeline', e.target.value)}
                className="project-wizard__select"
              >
                <option value="">Select timeline...</option>
                <option value="1-month">1 Month</option>
                <option value="3-months">3 Months</option>
                <option value="6-months">6 Months</option>
                <option value="1-year">1 Year</option>
                <option value="ongoing">Ongoing</option>
              </select>
            </div>
          </div>
        )}
        
        {/* Step 5: Team */}
        {currentStep === 4 && (
          <div className="project-wizard__step">
            <div className="project-wizard__field">
              <label className="project-wizard__label">
                Project Name <span className="project-wizard__required">*</span>
              </label>
              <input
                type="text"
                value={formData.projectName}
                onChange={(e) => handleChange('projectName', e.target.value)}
                placeholder="Give your project a memorable name"
                className={`project-wizard__input ${errors.projectName ? 'project-wizard__input--error' : ''}`}
              />
              {errors.projectName && (
                <span className="project-wizard__error">{errors.projectName}</span>
              )}
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Skills Needed</label>
              <div className="project-wizard__skills">
                {['Technical', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance', 'Legal', 'Research'].map(skill => (
                  <button
                    key={skill}
                    type="button"
                    className={`project-wizard__skill ${formData.teamNeeds.includes(skill) ? 'project-wizard__skill--selected' : ''}`}
                    onClick={() => handleToggleTeamNeed(skill)}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Resources Needed</label>
              <textarea
                value={formData.resources}
                onChange={(e) => handleChange('resources', e.target.value)}
                placeholder="What other resources do you need? Equipment, software, partnerships..."
                className="project-wizard__textarea project-wizard__textarea--short"
              />
            </div>
            
            <div className="project-wizard__field">
              <label className="project-wizard__label">Estimated Budget</label>
              <select
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                className="project-wizard__select"
              >
                <option value="">Select budget...</option>
                <option value="bootstrap">Bootstrap ($0-100)</option>
                <option value="small">Small ($100-1,000)</option>
                <option value="medium">Medium ($1,000-10,000)</option>
                <option value="large">Large ($10,000-100,000)</option>
                <option value="enterprise">Enterprise ($100,000+)</option>
              </select>
            </div>
            
            {/* Summary Preview */}
            <div className="project-wizard__summary">
              <h4 className="project-wizard__summary-title">Project Summary</h4>
              <div className="project-wizard__summary-content">
                <p><strong>Problem:</strong> {formData.problemTitle || 'Not specified'}</p>
                <p><strong>Audience:</strong> {formData.primaryAudience || 'Not specified'}</p>
                <p><strong>Solution:</strong> {formData.solutionType || 'Not specified'}</p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Actions */}
      <footer className="project-wizard__footer">
        <div className="project-wizard__footer-left">
          {onCancel && currentStep === 0 && (
            <button
              type="button"
              onClick={onCancel}
              className="project-wizard__cancel-btn"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}
          {currentStep > 0 && (
            <button
              type="button"
              onClick={handlePrev}
              className="project-wizard__back-btn"
              disabled={isLoading}
            >
              ← Back
            </button>
          )}
        </div>
        
        <div className="project-wizard__footer-right">
          {currentStep < WIZARD_STEPS.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              className="project-wizard__next-btn"
            >
              Continue →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              className="project-wizard__submit-btn"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="project-wizard__spinner" />
                  Creating...
                </>
              ) : (
                'Create Project 🚀'
              )}
            </button>
          )}
        </div>
      </footer>
    </div>
  );
};

export default ProjectWizard;