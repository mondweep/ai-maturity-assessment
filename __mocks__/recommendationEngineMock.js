// Mock Recommendation Engine
export const mockRecommendationEngine = {
  // Mock recommendation templates
  recommendationTemplates: {
    beginner: [
      {
        id: 'beginner-1',
        title: 'Start with Basic Automation',
        description: 'Begin with simple process automation to build AI capabilities',
        priority: 'high',
        category: 'Technology',
        implementationComplexity: 'Low',
        estimatedTimeframe: '3-6 months',
        potentialImpact: 'Medium'
      },
      {
        id: 'beginner-2',
        title: 'Build AI Awareness',
        description: 'Educate team members about AI capabilities and opportunities',
        priority: 'medium',
        category: 'People',
        implementationComplexity: 'Low',
        estimatedTimeframe: '1-3 months',
        potentialImpact: 'High'
      }
    ],
    intermediate: [
      {
        id: 'intermediate-1',
        title: 'Expand AI Implementation',
        description: 'Scale successful AI initiatives across departments',
        priority: 'high',
        category: 'Process',
        implementationComplexity: 'Medium',
        estimatedTimeframe: '6-12 months',
        potentialImpact: 'High'
      }
    ],
    advanced: [
      {
        id: 'advanced-1',
        title: 'Develop AI Strategy',
        description: 'Create comprehensive AI strategy aligned with business goals',
        priority: 'high',
        category: 'Strategy',
        implementationComplexity: 'High',
        estimatedTimeframe: '12+ months',
        potentialImpact: 'Very High'
      }
    ]
  },

  // Mock recommendation generation functions
  generateRecommendations: jest.fn().mockImplementation((assessment) => {
    const { maturityLevel } = assessment;
    const templates = mockRecommendationEngine.recommendationTemplates[maturityLevel] || [];
    
    // Add goal-specific recommendations
    const goalRecommendations = assessment.selectedGoals.map(goal => ({
      id: `goal-${goal.id}`,
      title: `Implement ${goal.title}`,
      description: `Focus on implementing ${goal.title} to achieve your goals`,
      priority: 'high',
      category: goal.category,
      implementationComplexity: goal.implementationComplexity,
      estimatedTimeframe: '6-12 months',
      potentialImpact: goal.impactLevel,
      relatedGoalIds: [goal.id]
    }));

    return [...templates, ...goalRecommendations];
  }),

  getRecommendationPriority: jest.fn().mockImplementation((recommendation, assessment) => {
    const { maturityLevel, selectedGoals } = assessment;
    
    // Prioritize recommendations based on maturity level and selected goals
    if (maturityLevel === 'beginner' && recommendation.implementationComplexity === 'Low') {
      return 'high';
    }
    
    if (selectedGoals.some(goal => recommendation.relatedGoalIds?.includes(goal.id))) {
      return 'high';
    }
    
    return recommendation.priority;
  }),

  filterRecommendations: jest.fn().mockImplementation((recommendations, assessment) => {
    const { budgetTimeline } = assessment;
    
    // Filter recommendations based on budget and timeline
    return recommendations.filter(recommendation => {
      if (budgetTimeline.priority === 'low' && recommendation.implementationComplexity === 'High') {
        return false;
      }
      
      if (budgetTimeline.timeline === 'short' && recommendation.estimatedTimeframe.includes('12+')) {
        return false;
      }
      
      return true;
    });
  })
}; 