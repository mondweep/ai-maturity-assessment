export const mockScoringEngine = {
  calculateJourneyScore: jest.fn().mockImplementation((journeyStatus) => {
    if (!journeyStatus || !journeyStatus.type) return 0;
    switch (journeyStatus.type) {
      case 'implementing': return 60;
      case 'planning': return 40;
      case 'not_started': return 20;
      default: return 0;
    }
  }),

  calculateGoalsScore: jest.fn().mockImplementation((selectedGoals) => {
    if (!selectedGoals || !selectedGoals.length) return 0;
    return selectedGoals.reduce((total, goal) => {
      switch (goal.priority) {
        case 'high': return total + 30;
        case 'medium': return total + 20;
        case 'low': return total + 10;
        default: return total;
      }
    }, 0);
  }),

  calculateBudgetScore: jest.fn().mockImplementation((budgetInfo) => {
    if (!budgetInfo) return 0;
    let score = 0;
    if (budgetInfo.amount > 100000) score += 30;
    if (budgetInfo.timeline < 6) score += 20;
    if (budgetInfo.priority === 'high') score += 10;
    return Math.round(score / 1.5);
  }),

  calculateTotalScore: jest.fn().mockImplementation((assessment) => {
    if (!assessment) return 0;
    const journeyScore = mockScoringEngine.calculateJourneyScore(assessment.journeyStatus);
    const budgetScore = mockScoringEngine.calculateBudgetScore(assessment.budget);
    return Math.round((journeyScore * 0.6) + (budgetScore * 0.4));
  }),

  determineMaturityLevel: jest.fn().mockImplementation((score) => {
    if (score >= 80) return 'advanced';
    if (score >= 50) return 'intermediate';
    return 'beginner';
  })
}; 