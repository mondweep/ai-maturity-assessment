import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';

const journeyTypes = [
  { value: 'exploring', label: 'Exploring AI possibilities' },
  { value: 'planning', label: 'Planning AI implementation' },
  { value: 'implementing', label: 'Implementing AI solutions' },
  { value: 'optimizing', label: 'Optimizing AI systems' },
  { value: 'leading', label: 'Leading with AI innovation' }
];

const JourneyStatusPage = () => {
  const { assessment, updateAssessment } = useAssessment();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const journeyType = formData.get('journeyType');

    if (!journeyType) {
      setErrors({ journeyType: 'Please select your journey status' });
      return;
    }

    updateAssessment({
      journeyStatus: { type: journeyType },
      currentStep: 'budget'
    });
  };

  return (
    <div data-testid="step-journey-status">
      <h2>Where are you in your AI journey?</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="journeyType">Select your current AI journey status:</label>
          <select
            id="journeyType"
            name="journeyType"
            className="form-input"
            defaultValue={assessment?.journeyStatus?.type || ''}
            aria-invalid={!!errors.journeyType}
            aria-describedby={errors.journeyType ? 'journey-type-error' : undefined}
          >
            <option value="">Select...</option>
            {journeyTypes.map(type => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.journeyType && (
            <span id="journey-type-error" className="error-message">
              {errors.journeyType}
            </span>
          )}
        </div>

        <div>
          <button type="button" data-testid="back-button" onClick={() => updateAssessment({ currentStep: 'demographics' })}>
            Back
          </button>
          <button type="submit" data-testid="next-button">Next</button>
        </div>
      </form>
    </div>
  );
};

export default JourneyStatusPage; 