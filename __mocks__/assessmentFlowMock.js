// Mock Assessment Flow
export const mockAssessmentFlow = {
  // Mock step definitions
  steps: [
    {
      id: 'demographics',
      title: 'Company Information',
      description: 'Tell us about your organization',
      questions: [
        {
          id: 'industry',
          type: 'select',
          label: 'What industry is your organization in?',
          options: [
            { value: 'healthcare', label: 'Healthcare' },
            { value: 'finance', label: 'Finance' },
            { value: 'manufacturing', label: 'Manufacturing' },
            { value: 'retail', label: 'Retail' },
            { value: 'technology', label: 'Technology' }
          ]
        },
        {
          id: 'companySize',
          type: 'select',
          label: 'What is your company size?',
          options: [
            { value: '1-50', label: '1-50 employees' },
            { value: '51-200', label: '51-200 employees' },
            { value: '201-1000', label: '201-1000 employees' },
            { value: '1000+', label: '1000+ employees' }
          ]
        }
      ]
    },
    {
      id: 'journey-status',
      title: 'AI Journey Status',
      description: 'Where are you in your AI journey?',
      questions: [
        {
          id: 'journeyStatus',
          type: 'radio',
          label: 'Select your current AI journey status',
          options: [
            { value: 'not-started', label: 'Not Started', description: 'No AI initiatives yet' },
            { value: 'exploring', label: 'Exploring', description: 'Researching AI opportunities' },
            { value: 'implementing', label: 'Implementing', description: 'Active AI implementation' },
            { value: 'scaling', label: 'Scaling', description: 'Expanding AI across organization' }
          ]
        }
      ]
    },
    {
      id: 'goals-selection',
      title: 'AI Goals',
      description: 'What are your AI implementation goals?',
      questions: [
        {
          id: 'goals',
          type: 'checkbox',
          label: 'Select your AI goals',
          options: [
            {
              value: 'automate-operations',
              label: 'Automate Operations',
              description: 'Reduce manual work through AI automation'
            },
            {
              value: 'enhance-customer-experience',
              label: 'Enhance Customer Experience',
              description: 'Improve customer interactions using AI'
            },
            {
              value: 'improve-decision-making',
              label: 'Improve Decision Making',
              description: 'Use AI for better business decisions'
            }
          ]
        }
      ]
    },
    {
      id: 'budget-info',
      title: 'Budget and Timeline',
      description: 'What resources do you have available?',
      questions: [
        {
          id: 'budget',
          type: 'select',
          label: 'What is your budget range?',
          options: [
            { value: 'low', label: 'Low (<$10K)' },
            { value: 'medium', label: 'Medium ($10K-$50K)' },
            { value: 'high', label: 'High ($50K+)' }
          ]
        },
        {
          id: 'timeline',
          type: 'select',
          label: 'What is your implementation timeline?',
          options: [
            { value: 'short', label: 'Short (0-3 months)' },
            { value: 'medium', label: 'Medium (3-6 months)' },
            { value: 'long', label: 'Long (6+ months)' }
          ]
        }
      ]
    }
  ],

  // Mock navigation functions
  getNextStep: jest.fn().mockImplementation((currentStep) => {
    const currentIndex = mockAssessmentFlow.steps.findIndex(step => step.id === currentStep);
    return currentIndex < mockAssessmentFlow.steps.length - 1 
      ? mockAssessmentFlow.steps[currentIndex + 1].id 
      : null;
  }),

  getPreviousStep: jest.fn().mockImplementation((currentStep) => {
    const currentIndex = mockAssessmentFlow.steps.findIndex(step => step.id === currentStep);
    return currentIndex > 0 
      ? mockAssessmentFlow.steps[currentIndex - 1].id 
      : null;
  }),

  isFirstStep: jest.fn().mockImplementation((step) => {
    return step === mockAssessmentFlow.steps[0].id;
  }),

  isLastStep: jest.fn().mockImplementation((step) => {
    return step === mockAssessmentFlow.steps[mockAssessmentFlow.steps.length - 1].id;
  }),

  getStepIndex: jest.fn().mockImplementation((step) => {
    return mockAssessmentFlow.steps.findIndex(s => s.id === step);
  }),

  getStepById: jest.fn().mockImplementation((stepId) => {
    return mockAssessmentFlow.steps.find(step => step.id === stepId);
  }),

  getStepProgress: jest.fn().mockImplementation((currentStep) => {
    const currentIndex = mockAssessmentFlow.getStepIndex(currentStep);
    return {
      current: currentIndex + 1,
      total: mockAssessmentFlow.steps.length,
      percentage: Math.round(((currentIndex + 1) / mockAssessmentFlow.steps.length) * 100)
    };
  })
}; 