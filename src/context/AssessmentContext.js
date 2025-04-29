import React, { createContext, useContext, useState, useEffect } from 'react';
import { generateUniqueId } from '../utils/helpers';

// Constants
const STORAGE_KEY = 'assessment';
const STATE_STORAGE_KEY_PREFIX = 'assessmentState_';

// Initial state
const defaultState = {
  currentStep: 'demographics',
  organization: {
    industry: '',
    companySize: '',
    role: ''
  },
  security: {},
  goals: {},
  budget: {
    range: '',
    timeline: ''
  },
  errors: {},
  journeyStatus: {
    type: 'not_started',
    description: '',
    demographics: 'incomplete',
    assessment: 'incomplete',
    results: 'incomplete',
    recommendations: 'incomplete',
    completedSteps: []
  }
};

// Action types
const ActionTypes = {
  SET_DEMOGRAPHICS: 'SET_DEMOGRAPHICS',
  SET_JOURNEY_STATUS: 'SET_JOURNEY_STATUS',
  SET_JOURNEY_RESPONSES: 'SET_JOURNEY_RESPONSES',
  SET_GOALS: 'SET_GOALS',
  SET_QUALIFYING_RESPONSES: 'SET_QUALIFYING_RESPONSES',
  SET_BUDGET_INFO: 'SET_BUDGET_INFO',
  SET_MATURITY_SCORE: 'SET_MATURITY_SCORE',
  SET_RECOMMENDATIONS: 'SET_RECOMMENDATIONS',
  SET_CURRENT_STEP: 'SET_CURRENT_STEP',
  RESET_STATE: 'RESET_STATE'
};

// Create context
const AssessmentContext = createContext();

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
};

export const AssessmentProvider = ({ children, initialState }) => {
  const [assessment, setAssessment] = useState(() => {
    try {
      const savedState = window.sessionStorage.getItem(STORAGE_KEY);
      if (savedState) {
        const parsedState = JSON.parse(savedState);
        return {
          ...defaultState,
          ...parsedState
        };
      }
      const mergedState = {
        ...defaultState,
        ...(initialState || {})
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(mergedState));
      return mergedState;
    } catch (error) {
      console.error('Failed to initialize assessment state:', error);
      const fallbackState = {
        ...defaultState,
        ...(initialState || {})
      };
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(fallbackState));
      return fallbackState;
    }
  });

  const updateAssessment = (updater) => {
    try {
      setAssessment((prev) => {
        const newState = typeof updater === 'function' ? updater(prev) : updater;
        window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
        return newState;
      });
    } catch (error) {
      console.error('Failed to update assessment state:', error);
    }
  };

  const value = {
    assessment,
    setAssessment: updateAssessment,
    defaultState
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export function useAssessmentState() {
  const { assessment, setAssessment } = useAssessment();
  return { state: assessment, setAssessment };
}

export function useAssessmentActions() {
  const { setAssessment } = useAssessment();
  
  return {
    updateOrganization: (data) => 
      setAssessment((prev) => ({
        ...prev,
        organization: { ...prev.organization, ...data }
      })),
    updateJourneyStatus: (data) =>
      setAssessment((prev) => ({
        ...prev,
        journeyStatus: { ...prev.journeyStatus, ...data }
      })),
    updateSelectedGoals: (goals) =>
      setAssessment((prev) => ({
        ...prev,
        selectedGoals: goals
      })),
    updateBudgetTimeline: (data) =>
      setAssessment((prev) => ({
        ...prev,
        budget: { ...prev.budget, ...data }
      })),
    goToPage: (page) =>
      setAssessment((prev) => ({
        ...prev,
        currentStep: page
      })),
    setError: (error) =>
      setAssessment((prev) => ({
        ...prev,
        errors: error
      })),
    resetAssessment: () => {
      window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
      setAssessment(defaultState);
    }
  };
}

export default AssessmentContext;