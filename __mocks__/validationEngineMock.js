// Mock Validation Engine
export const mockValidationEngine = {
  // Mock validation rules
  validationRules: {
    demographics: {
      industry: { required: true, message: 'Please select an industry' },
      companySize: { required: true, message: 'Please select company size' }
    },
    journeyStatus: {
      type: { required: true, message: 'Please select journey status' }
    },
    goals: {
      selectedGoals: { 
        required: true, 
        min: 1, 
        message: 'Please select at least one goal' 
      }
    },
    budget: {
      budget: { required: true, message: 'Please select budget range' },
      timeline: { required: true, message: 'Please select timeline' }
    }
  },

  // Mock validation functions
  validateDemographics: jest.fn().mockImplementation((demographics) => {
    const errors = {};
    
    if (!demographics.industry) {
      errors.industry = mockValidationEngine.validationRules.demographics.industry.message;
    }
    
    if (!demographics.companySize) {
      errors.companySize = mockValidationEngine.validationRules.demographics.companySize.message;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }),

  validateJourneyStatus: jest.fn().mockImplementation((journeyStatus) => {
    const errors = {};
    
    if (!journeyStatus.type) {
      errors.type = mockValidationEngine.validationRules.journeyStatus.type.message;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }),

  validateGoals: jest.fn().mockImplementation((selectedGoals) => {
    const errors = {};
    
    if (!selectedGoals || selectedGoals.length === 0) {
      errors.selectedGoals = mockValidationEngine.validationRules.goals.selectedGoals.message;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }),

  validateBudget: jest.fn().mockImplementation((budgetInfo) => {
    const errors = {};
    
    if (!budgetInfo.budget) {
      errors.budget = mockValidationEngine.validationRules.budget.budget.message;
    }
    
    if (!budgetInfo.timeline) {
      errors.timeline = mockValidationEngine.validationRules.budget.timeline.message;
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }),

  validateStep: jest.fn().mockImplementation((step, data) => {
    switch (step) {
      case 'demographics':
        return mockValidationEngine.validateDemographics(data);
      case 'journey-status':
        return mockValidationEngine.validateJourneyStatus(data);
      case 'goals-selection':
        return mockValidationEngine.validateGoals(data);
      case 'budget-info':
        return mockValidationEngine.validateBudget(data);
      default:
        return { isValid: true, errors: {} };
    }
  })
}; 