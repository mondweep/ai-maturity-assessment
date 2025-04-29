import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';

const budgetRanges = [
  { value: 'low', label: 'Low (Under $50,000)' },
  { value: 'medium', label: 'Medium ($50,000 - $200,000)' },
  { value: 'high', label: 'High (Over $200,000)' }
];

const timelines = [
  { value: 'short', label: 'Short term (0-6 months)' },
  { value: 'medium', label: 'Medium term (6-12 months)' },
  { value: 'long', label: 'Long term (12+ months)' }
];

const BudgetPage = () => {
  const { assessment, updateAssessment } = useAssessment();
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      range: formData.get('budgetRange'),
      timeline: formData.get('timeline')
    };

    // Validate
    const newErrors = {};
    if (!data.range) newErrors.range = 'Budget range is required';
    if (!data.timeline) newErrors.timeline = 'Timeline is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    updateAssessment({
      budgetInfo: data,
      currentStep: 'results'
    });
  };

  return (
    <div data-testid="step-budget">
      <h2>Budget Information</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="budgetRange">What is your budget range?</label>
          <select
            id="budgetRange"
            name="budgetRange"
            className="form-input"
            defaultValue={assessment?.budgetInfo?.range || ''}
            aria-invalid={!!errors.range}
            aria-describedby={errors.range ? 'budget-range-error' : undefined}
          >
            <option value="">Select...</option>
            {budgetRanges.map(range => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          {errors.range && (
            <span id="budget-range-error" className="error-message">
              {errors.range}
            </span>
          )}
        </div>

        <div>
          <label htmlFor="timeline">What is your implementation timeline?</label>
          <select
            id="timeline"
            name="timeline"
            className="form-input"
            defaultValue={assessment?.budgetInfo?.timeline || ''}
            aria-invalid={!!errors.timeline}
            aria-describedby={errors.timeline ? 'timeline-error' : undefined}
          >
            <option value="">Select...</option>
            {timelines.map(timeline => (
              <option key={timeline.value} value={timeline.value}>
                {timeline.label}
              </option>
            ))}
          </select>
          {errors.timeline && (
            <span id="timeline-error" className="error-message">
              {errors.timeline}
            </span>
          )}
        </div>

        <div>
          <button type="button" data-testid="back-button" onClick={() => updateAssessment({ currentStep: 'journey_status' })}>
            Back
          </button>
          <button type="submit" data-testid="next-button">Next</button>
        </div>
      </form>
    </div>
  );
};

export default BudgetPage; 