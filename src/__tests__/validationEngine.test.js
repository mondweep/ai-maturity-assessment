import { mockValidationEngine } from '../../__mocks__/validationEngineMock';
import { mockTestData } from '../../__mocks__/testUtilsMock';

describe('Validation Engine', () => {
  // Test demographics validation
  test('should validate demographics correctly', () => {
    // Test valid demographics
    const validDemographics = {
      industry: 'technology',
      companySize: '51-200'
    };
    const validResult = mockValidationEngine.validateDemographics(validDemographics);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toEqual({});

    // Test invalid demographics
    const invalidDemographics = {
      industry: '',
      companySize: ''
    };
    const invalidResult = mockValidationEngine.validateDemographics(invalidDemographics);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toHaveProperty('industry');
    expect(invalidResult.errors).toHaveProperty('companySize');
  });

  // Test journey status validation
  test('should validate journey status correctly', () => {
    // Test valid journey status
    const validJourneyStatus = {
      type: 'exploring'
    };
    const validResult = mockValidationEngine.validateJourneyStatus(validJourneyStatus);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toEqual({});

    // Test invalid journey status
    const invalidJourneyStatus = {
      type: ''
    };
    const invalidResult = mockValidationEngine.validateJourneyStatus(invalidJourneyStatus);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toHaveProperty('type');
  });

  // Test goals validation
  test('should validate goals correctly', () => {
    // Test valid goals
    const validGoals = [
      { id: 'goal1' },
      { id: 'goal2' }
    ];
    const validResult = mockValidationEngine.validateGoals(validGoals);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toEqual({});

    // Test invalid goals
    const invalidGoals = [];
    const invalidResult = mockValidationEngine.validateGoals(invalidGoals);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toHaveProperty('selectedGoals');
  });

  // Test budget validation
  test('should validate budget correctly', () => {
    // Test valid budget
    const validBudget = {
      budget: 'medium',
      timeline: 'medium'
    };
    const validResult = mockValidationEngine.validateBudget(validBudget);
    expect(validResult.isValid).toBe(true);
    expect(validResult.errors).toEqual({});

    // Test invalid budget
    const invalidBudget = {
      budget: '',
      timeline: ''
    };
    const invalidResult = mockValidationEngine.validateBudget(invalidBudget);
    expect(invalidResult.isValid).toBe(false);
    expect(invalidResult.errors).toHaveProperty('budget');
    expect(invalidResult.errors).toHaveProperty('timeline');
  });

  // Test step validation
  test('should validate steps correctly', () => {
    // Test demographics step
    const demographicsResult = mockValidationEngine.validateStep('demographics', {
      industry: 'technology',
      companySize: '51-200'
    });
    expect(demographicsResult.isValid).toBe(true);

    // Test journey status step
    const journeyStatusResult = mockValidationEngine.validateStep('journey-status', {
      type: 'exploring'
    });
    expect(journeyStatusResult.isValid).toBe(true);

    // Test goals step
    const goalsResult = mockValidationEngine.validateStep('goals-selection', [
      { id: 'goal1' }
    ]);
    expect(goalsResult.isValid).toBe(true);

    // Test budget step
    const budgetResult = mockValidationEngine.validateStep('budget-info', {
      budget: 'medium',
      timeline: 'medium'
    });
    expect(budgetResult.isValid).toBe(true);
  });

  // Test validation rules
  test('should apply validation rules correctly', () => {
    const rules = mockValidationEngine.validationRules;

    // Test demographics rules
    expect(rules.demographics.industry.required).toBe(true);
    expect(rules.demographics.companySize.required).toBe(true);

    // Test journey status rules
    expect(rules.journeyStatus.type.required).toBe(true);

    // Test goals rules
    expect(rules.goals.selectedGoals.required).toBe(true);
    expect(rules.goals.selectedGoals.min).toBe(1);

    // Test budget rules
    expect(rules.budget.budget.required).toBe(true);
    expect(rules.budget.timeline.required).toBe(true);
  });

  // Test error messages
  test('should provide appropriate error messages', () => {
    const rules = mockValidationEngine.validationRules;

    // Test demographics error messages
    expect(rules.demographics.industry.message).toBe('Please select an industry');
    expect(rules.demographics.companySize.message).toBe('Please select company size');

    // Test journey status error message
    expect(rules.journeyStatus.type.message).toBe('Please select journey status');

    // Test goals error message
    expect(rules.goals.selectedGoals.message).toBe('Please select at least one goal');

    // Test budget error messages
    expect(rules.budget.budget.message).toBe('Please select budget range');
    expect(rules.budget.timeline.message).toBe('Please select timeline');
  });

  // Test validation consistency
  test('should maintain validation consistency', () => {
    const assessment = mockTestData.assessment;
    
    // Validate multiple times
    const result1 = mockValidationEngine.validateStep('demographics', assessment.organization);
    const result2 = mockValidationEngine.validateStep('demographics', assessment.organization);
    const result3 = mockValidationEngine.validateStep('demographics', assessment.organization);
    
    // Verify results are consistent
    expect(result1).toEqual(result2);
    expect(result2).toEqual(result3);
  });
}); 