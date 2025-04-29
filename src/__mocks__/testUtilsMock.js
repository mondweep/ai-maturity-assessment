import React from 'react';
import { render } from '@testing-library/react';
import { AssessmentProvider } from '../context/AssessmentContext';

const defaultInitialState = {
  assessment: {
    currentStep: 'demographics',
    organization: {
      industry: '',
      companySize: '',
      role: ''
    },
    journeyStatus: 'not_started',
    errors: {}
  }
};

export const renderWithContext = (ui, { initialState = {}, ...renderOptions } = {}) => {
  const mergedState = {
    ...defaultInitialState,
    ...initialState
  };
  
  const Wrapper = ({ children }) => (
    <AssessmentProvider initialState={mergedState}>
      {children}
    </AssessmentProvider>
  );
  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

export const mockTestData = {
  demographics: {
    industry: 'technology',
    companySize: '51-200',
    role: 'CTO'
  },
  validAssessment: {
    currentStep: 'demographics',
    organization: {
      industry: 'technology',
      companySize: '51-200',
      role: 'CTO'
    },
    journeyStatus: 'in_progress',
    errors: {}
  },
  completedAssessment: {
    currentStep: 'budget',
    organization: {
      industry: 'technology',
      companySize: '51-200',
      role: 'CTO'
    },
    journeyStatus: 'completed',
    errors: {}
  }
}; 