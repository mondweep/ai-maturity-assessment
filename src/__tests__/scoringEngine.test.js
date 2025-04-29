import { mockScoringEngine } from '../__mocks__/scoringEngineMock';

describe('Scoring Engine', () => {
  // Test journey score calculation
  test('should calculate journey score correctly', () => {
    const journeyStatus = { type: 'implementing' };
    const score = mockScoringEngine.calculateJourneyScore(journeyStatus);
    expect(score).toBe(60);
  });

  // Test goals score calculation
  test('should calculate goals score correctly', () => {
    const selectedGoals = [
      { id: 'automate-operations', priority: 'high' },
      { id: 'improve-security', priority: 'medium' },
      { id: 'reduce-costs', priority: 'low' }
    ];
    const score = mockScoringEngine.calculateGoalsScore(selectedGoals);
    expect(score).toBe(60); // High: 30, Medium: 20, Low: 10
  });

  // Test budget score calculation
  test('should calculate budget score correctly', () => {
    const budgetInfo = {
      budget: 'high',
      timeline: 'medium',
      priority: 'low'
    };
    const score = mockScoringEngine.calculateBudgetScore(budgetInfo);
    expect(score).toBe(40); // (30 + 20 + 10) / 1.5
  });

  // Test total score calculation
  test('should calculate total score correctly', () => {
    const assessment = {
      selectedGoals: [
        { id: 'automate-operations', priority: 'high' },
        { id: 'improve-security', priority: 'medium' }
      ],
      budgetTimeline: {
        budget: 'high',
        timeline: 'medium',
        priority: 'low'
      },
      organization: {
        industry: 'technology',
        companySize: '51-200'
      }
    };

    const score = mockScoringEngine.calculateTotalScore(assessment);
    expect(score).toBe(66); // (60 * 0.6) + (40 * 0.4)
  });

  // Test maturity level determination
  test('should determine maturity level correctly', () => {
    expect(mockScoringEngine.determineMaturityLevel(85)).toBe('advanced');
    expect(mockScoringEngine.determineMaturityLevel(65)).toBe('intermediate');
    expect(mockScoringEngine.determineMaturityLevel(35)).toBe('beginner');
  });

  // Test edge cases
  test('should handle edge cases correctly', () => {
    // Test with no journey status
    const noJourneyScore = mockScoringEngine.calculateJourneyScore({});
    expect(noJourneyScore).toBe(0);

    // Test with no goals
    const noGoalsScore = mockScoringEngine.calculateGoalsScore([]);
    expect(noGoalsScore).toBe(0);

    // Test with no budget info
    const noBudgetScore = mockScoringEngine.calculateBudgetScore({});
    expect(noBudgetScore).toBe(0);

    // Test with no assessment
    const noAssessmentScore = mockScoringEngine.calculateTotalScore(null);
    expect(noAssessmentScore).toBe(0);
  });

  // Test scoring weights
  test('should apply scoring weights correctly', () => {
    const assessment = {
      journeyStatus: { type: 'implementing' }, // 60
      selectedGoals: ['automation'], // 40
      budgetInfo: { priority: 'medium' } // 60
    };

    const expectedScore = Math.round(
      (60 * 0.4) + (40 * 0.3) + (60 * 0.3)
    );

    const score = mockScoringEngine.calculateTotalScore(assessment);
    expect(score).toBe(expectedScore);
  });

  // Test scoring consistency
  test('should maintain scoring consistency', () => {
    const assessment = {
      journeyStatus: { type: 'implementing' },
      selectedGoals: ['automation', 'efficiency'],
      budgetInfo: { priority: 'high' }
    };

    const score1 = mockScoringEngine.calculateTotalScore(assessment);
    const score2 = mockScoringEngine.calculateTotalScore(assessment);
    expect(score1).toBe(score2);
  });
}); 