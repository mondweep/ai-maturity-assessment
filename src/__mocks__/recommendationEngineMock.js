export const mockRecommendationEngine = {
  generateRecommendations: jest.fn().mockImplementation((assessment) => {
    if (!assessment || !assessment.maturityLevel) return [];
    
    const recommendations = [
      {
        id: 'rec1',
        title: 'Implement Security Best Practices',
        description: 'Establish security protocols and best practices.',
        category: 'Security',
        priority: 'high',
        estimatedCost: 50000,
        estimatedTimeline: 3
      },
      {
        id: 'rec2',
        title: 'Enhance Data Management',
        description: 'Improve data handling and storage practices.',
        category: 'Data',
        priority: 'medium',
        estimatedCost: 75000,
        estimatedTimeline: 6
      }
    ];

    // Add goal-specific recommendation if applicable
    if (assessment.goals?.includes('automation')) {
      recommendations.push({
        id: 'goal-automation',
        title: 'Automate Operations',
        description: 'Implement automation tools and workflows.',
        category: 'Technology',
        priority: 'high',
        estimatedCost: 100000,
        estimatedTimeline: 9
      });
    }

    return recommendations;
  }),

  getRecommendationPriority: jest.fn().mockImplementation((recommendation, assessment) => {
    if (!recommendation || !assessment) return 'low';
    if (recommendation.category === 'Security') return 'high';
    if (assessment.budget?.amount > 100000) return 'high';
    return 'medium';
  }),

  filterRecommendations: jest.fn().mockImplementation((recommendations, assessment) => {
    if (!recommendations || !assessment) return [];
    return recommendations.filter(rec => {
      const withinBudget = !assessment.budget?.amount || rec.estimatedCost <= assessment.budget.amount;
      const withinTimeline = !assessment.timeline || rec.estimatedTimeline <= assessment.timeline;
      return withinBudget && withinTimeline;
    });
  })
}; 