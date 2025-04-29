import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import DemographicsPage from '../pages/DemographicsPage';
import SecurityPage from '../pages/SecurityPage';
import GoalsPage from '../pages/GoalsPage';
import BudgetPage from '../pages/BudgetPage';

const AssessmentFlow = () => {
  const { assessment, setAssessment } = useAssessment();
  const { currentStep, errors = {} } = assessment || {};

  const steps = ['demographics', 'security', 'goals', 'budget'];
  const currentStepIndex = steps.indexOf(currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      const nextStep = steps[currentStepIndex + 1];
      setAssessment(prev => ({
        ...prev,
        currentStep: nextStep,
        journeyStatus: {
          ...prev.journeyStatus,
          type: 'in_progress',
          completedSteps: [...new Set([...(prev.journeyStatus?.completedSteps || []), currentStep])]
        }
      }));
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      const previousStep = steps[currentStepIndex - 1];
      setAssessment(prev => ({
        ...prev,
        currentStep: previousStep
      }));
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'demographics':
        return <DemographicsPage onNext={handleNext} />;
      case 'security':
        return <SecurityPage onNext={handleNext} onBack={handleBack} />;
      case 'goals':
        return <GoalsPage onNext={handleNext} onBack={handleBack} />;
      case 'budget':
        return <BudgetPage onNext={handleNext} onBack={handleBack} />;
      default:
        return <div>Invalid step</div>;
    }
  };

  return (
    <div className="assessment-flow">
      <div className="progress-container" data-testid="progress-bar">
        <div 
          className="progress" 
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>

      <div className="step-indicators">
        {steps.map((step, index) => (
          <div
            key={step}
            data-testid={`step-indicator-${step}`}
            className={`step-indicator ${currentStep === step ? 'active' : ''} ${
              assessment?.journeyStatus?.completedSteps?.includes(step) ? 'completed' : ''
            }`}
          />
        ))}
      </div>

      <div data-testid={`step-content-${currentStep}`} className="step-content">
        {renderStep()}
      </div>

      {/* Only show error container if there are errors */}
      {Object.keys(errors).length > 0 && (
        <div className="error-container" data-testid="error-container">
          {Object.entries(errors).map(([field, message]) => (
            <div key={field} data-testid="error-message" className="error-message">
              {message}
            </div>
          ))}
        </div>
      )}

      <div className="navigation-buttons">
        {currentStepIndex > 0 && (
          <button
            data-testid="nav-back-button"
            className="back-button"
            onClick={handleBack}
            type="button"
          >
            Back
          </button>
        )}
        {currentStepIndex < steps.length - 1 && (
          <button
            data-testid="nav-next-button"
            className="next-button"
            onClick={handleNext}
            type="button"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
};

export default AssessmentFlow; 