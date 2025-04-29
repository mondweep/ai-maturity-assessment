// Mock Assessment Context
export const mockAssessmentState = {
  currentStep: 'demographics',
  organization: {
    industry: '',
    companySize: ''
  },
  journeyStatus: {
    type: 'not-started',
    responses: {}
  },
  selectedGoals: [],
  availableGoals: [
    {
      id: 'automate-operations',
      title: 'Automate Operations',
      description: 'Reduce manual work through AI automation',
      category: 'Operational',
      impactLevel: 'High',
      implementationComplexity: 'Medium'
    },
    {
      id: 'enhance-customer-experience',
      title: 'Enhance Customer Experience',
      description: 'Improve customer interactions using AI',
      category: 'Customer-facing',
      impactLevel: 'High',
      implementationComplexity: 'Medium'
    }
  ],
  goalDetails: {},
  budgetTimeline: {
    budget: '',
    timeline: '',
    priority: 'medium'
  },
  isComplete: false,
  errors: {}
};

export const mockAssessmentContext = {
  state: mockAssessmentState,
  updateCurrentStep: jest.fn(),
  updateOrganization: jest.fn(),
  updateJourneyStatus: jest.fn(),
  updateJourneyResponses: jest.fn(),
  updateSelectedGoals: jest.fn(),
  updateGoalDetails: jest.fn(),
  updateBudgetTimeline: jest.fn(),
  completeAssessment: jest.fn(),
  resetAssessment: jest.fn(),
  setErrors: jest.fn(),
  clearErrors: jest.fn()
}; 