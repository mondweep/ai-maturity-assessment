import React from 'react';
import { useAssessment } from '../context/AssessmentContext';

const DemographicsPage = ({ onNext }) => {
  const { assessment, setAssessment } = useAssessment();
  const { organization = {}, errors = {} } = assessment || {};

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const industry = formData.get('industry');
    const companySize = formData.get('companySize');
    const role = formData.get('role');

    const newErrors = {};
    if (!industry) newErrors.industry = 'Invalid industry selection';
    if (!companySize) newErrors.companySize = 'Invalid company size selection';
    if (!role) newErrors.role = 'Invalid role selection';

    if (Object.keys(newErrors).length > 0) {
      setAssessment(prev => ({
        ...prev,
        errors: newErrors
      }));
      return;
    }

    setAssessment(prev => ({
      ...prev,
      organization: {
        industry,
        companySize,
        role
      },
      errors: {},
      journeyStatus: {
        ...prev.journeyStatus,
        demographics: 'complete',
        type: 'in_progress',
        description: 'Demographics completed',
        completedSteps: [...new Set([...(prev.journeyStatus?.completedSteps || []), 'demographics'])]
      },
      currentStep: 'security'
    }));

    if (onNext) {
      onNext();
    }
  };

  return (
    <div data-testid="step-demographics">
      <h2>Demographics</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="industry">What industry is your organization in?</label>
          <select
            id="industry"
            name="industry"
            className="form-input"
            defaultValue={organization.industry || ''}
            aria-invalid={!!errors.industry}
          >
            <option value="">Select...</option>
            <option value="technology">Technology</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="retail">Retail</option>
            <option value="other">Other</option>
          </select>
          {errors.industry && (
            <div className="error-message" role="alert">{errors.industry}</div>
          )}
        </div>

        <div>
          <label htmlFor="companySize">What is your company size?</label>
          <select
            id="companySize"
            name="companySize"
            className="form-input"
            defaultValue={organization.companySize || ''}
            aria-invalid={!!errors.companySize}
          >
            <option value="">Select...</option>
            <option value="1-50">1-50</option>
            <option value="51-200">51-200</option>
            <option value="201-500">201-500</option>
            <option value="501-1000">501-1000</option>
            <option value="1000+">1000+</option>
          </select>
          {errors.companySize && (
            <div className="error-message" role="alert">{errors.companySize}</div>
          )}
        </div>

        <div>
          <label htmlFor="role">What is your role?</label>
          <select
            id="role"
            name="role"
            className="form-input"
            defaultValue={organization.role || ''}
            aria-invalid={!!errors.role}
          >
            <option value="">Select...</option>
            <option value="CTO">CTO</option>
            <option value="CIO">CIO</option>
            <option value="IT Director">IT Director</option>
            <option value="IT Manager">IT Manager</option>
            <option value="Other">Other</option>
          </select>
          {errors.role && (
            <div className="error-message" role="alert">{errors.role}</div>
          )}
        </div>

        <div>
          <button type="submit" data-testid="next-button">Next</button>
        </div>
      </form>
    </div>
  );
};

export default DemographicsPage; 