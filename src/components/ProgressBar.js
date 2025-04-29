import React from 'react';
import { useAssessment } from '../context/AssessmentContext';

function ProgressBar() {
  const { state } = useAssessment();
  
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
  const progress = ((currentIndex + 1) / steps.length) * 100;
  
  return (
    <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
      <div 
        className="progress-bar-fill" 
        style={{ width: `${progress}%` }}
        aria-label={`Progress: ${Math.round(progress)}%`}
      />
    </div>
  );
}

export default ProgressBar; 