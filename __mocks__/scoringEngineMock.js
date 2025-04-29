// Mock Scoring Engine
export const mockScoringEngine = {
  // Mock scoring weights
  weights: {
    journeyStatus: 0.4,
    goals: 0.3,
    budget: 0.3
  },

  // Mock maturity levels
  maturityLevels: [
    { level: 'beginner', minScore: 0, maxScore: 30, description: 'Starting AI journey' },
    { level: 'intermediate', minScore: 31, maxScore: 60, description: 'Developing AI capabilities' },
    { level: 'advanced', minScore: 61, maxScore: 85, description: 'Advanced AI implementation' },
    { level: 'expert', minScore: 86, maxScore: 100, description: 'Leading AI innovation' }
  ],

  // Mock scoring functions
  calculateJourneyScore: jest.fn().mockImplementation((journeyStatus) => {
    const scores = {
      'not-started': 10,
      'exploring': 30,
      'implementing': 60,
      'scaling': 90
    };
    return scores[journeyStatus.type] || 0;
  }),

  calculateGoalsScore: jest.fn().mockImplementation((selectedGoals) => {
    return selectedGoals.length * 20;
  }),

  calculateBudgetScore: jest.fn().mockImplementation((budgetInfo) => {
    const scores = {
      'low': 20,
      'medium': 50,
      'high': 80
    };
    return scores[budgetInfo.priority] || 0;
  }),

  calculateTotalScore: jest.fn().mockImplementation((assessment) => {
    const journeyScore = mockScoringEngine.calculateJourneyScore(assessment.journeyStatus);
    const goalsScore = mockScoringEngine.calculateGoalsScore(assessment.selectedGoals);
    const budgetScore = mockScoringEngine.calculateBudgetScore(assessment.budgetTimeline);

    return Math.round(
      journeyScore * mockScoringEngine.weights.journeyStatus +
      goalsScore * mockScoringEngine.weights.goals +
      budgetScore * mockScoringEngine.weights.budget
    );
  }),

  determineMaturityLevel: jest.fn().mockImplementation((score) => {
    return mockScoringEngine.maturityLevels.find(
      level => score >= level.minScore && score <= level.maxScore
    ) || mockScoringEngine.maturityLevels[0];
  })
}; 