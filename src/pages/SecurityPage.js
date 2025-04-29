import React from 'react';
import { useAssessment } from '../context/AssessmentContext';

const SecurityPage = ({ onNext, onPrevious }) => {
  const { assessment, dispatch } = useAssessment();

  const handleNext = () => {
    dispatch({
      type: 'UPDATE_JOURNEY_STATUS',
      payload: {
        type: 'in_progress',
        description: 'Security assessment completed'
      }
    });
    onNext();
  };

  return (
    <div className="security-page" data-testid="step-security">
      <h2>Security Assessment</h2>
      <div className="form-group">
        {/* Security form fields will go here */}
      </div>
      <div className="button-group">
        <button onClick={onPrevious} data-testid="back-button">
          Back
        </button>
        <button onClick={handleNext} data-testid="next-button">
          Next
        </button>
      </div>
    </div>
  );
};

export default SecurityPage; 