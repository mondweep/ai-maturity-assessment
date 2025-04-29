import React from 'react';
import { useAssessment } from '../context/AssessmentContext';

function Navigation() {
  const { state, setCurrentStep } = useAssessment();

  const handleBack = () => {
    const steps = [
      'demographics',
      'journey_status',
      'journey_questions',
      'goals',
      'qualifying_questions',
      'budget',
      'results'
    ];
    
    const currentIndex = steps.indexOf(state.currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  return (
    <div className="navigation">
      <div className="nav-buttons">
        {state.currentStep !== 'demographics' && (
          <button 
            onClick={handleBack} 
            className="button button-secondary"
            aria-label="Go back to previous step"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

export default Navigation; 