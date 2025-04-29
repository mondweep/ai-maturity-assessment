import React, { createContext, useContext, useState } from 'react';

const AssessmentContext = createContext();

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider = ({ children, initialState = {} }) => {
  const [assessment, setAssessment] = useState({
    currentStep: 'demographics',
    errors: {},
    organization: {
      industry: '',
      companySize: '',
      role: ''
    },
    journeyStatus: {
      type: 'not_started',
      description: '',
      completedSteps: []
    },
    ...initialState
  });

  return (
    <AssessmentContext.Provider value={{ assessment, setAssessment }}>
      {children}
    </AssessmentContext.Provider>
  );
}; 