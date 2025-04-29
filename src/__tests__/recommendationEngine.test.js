import { mockRecommendationEngine } from '../../__mocks__/recommendationEngineMock';
import { mockTestData } from '../../__mocks__/testUtilsMock';

describe('Recommendation Engine', () => {
  // Test recommendation generation
  test('should generate recommendations correctly', () => {
    const assessment = {
      maturityLevel: 'beginner',
      selectedGoals: [
        {
          id: 'automate-operations',
          title: 'Automate Operations',
          category: 'Technology',
          implementationComplexity: 'Low',
          impactLevel: 'High'
        }
      ]
    };

    const recommendations = mockRecommendationEngine.generateRecommendations(assessment);
    
    // Verify recommendations structure
    expect(recommendations).toHaveLength(3); // 2 template + 1 goal-specific
    expect(recommendations[0]).toHaveProperty('id');
    expect(recommendations[0]).toHaveProperty('title');
    expect(recommendations[0]).toHaveProperty('description');
    expect(recommendations[0]).toHaveProperty('priority');
    expect(recommendations[0]).toHaveProperty('category');
    expect(recommendations[0]).toHaveProperty('implementationComplexity');
    expect(recommendations[0]).toHaveProperty('estimatedTimeframe');
    expect(recommendations[0]).toHaveProperty('potentialImpact');
  });

  // Test recommendation prioritization
  test('should prioritize recommendations correctly', () => {
    const assessment = {
      maturityLevel: 'beginner',
      selectedGoals: [
        {
          id: 'automate-operations',
          title: 'Automate Operations',
          category: 'Technology',
          implementationComplexity: 'Low',
          impactLevel: 'High'
        }
      ]
    };

    const recommendation = {
      id: 'rec1',
      title: 'Start with Basic Automation',
      description: 'Begin with simple process automation',
      priority: 'medium',
      category: 'Technology',
      implementationComplexity: 'Low',
      estimatedTimeframe: '3-6 months',
      potentialImpact: 'Medium'
    };

    const priority = mockRecommendationEngine.getRecommendationPriority(recommendation, assessment);
    expect(priority).toBe('high');
  });

  // Test recommendation filtering
  test('should filter recommendations based on budget and timeline', () => {
    const assessment = {
      budgetTimeline: {
        priority: 'low',
        timeline: 'short'
      }
    };

    const recommendations = [
      {
        id: 'rec1',
        title: 'Basic Automation',
        implementationComplexity: 'Low',
        estimatedTimeframe: '3-6 months'
      },
      {
        id: 'rec2',
        title: 'Advanced Implementation',
        implementationComplexity: 'High',
        estimatedTimeframe: '12+ months'
      }
    ];

    const filteredRecommendations = mockRecommendationEngine.filterRecommendations(recommendations, assessment);
    expect(filteredRecommendations).toHaveLength(1);
    expect(filteredRecommendations[0].id).toBe('rec1');
  });

  // Test recommendation templates
  test('should use correct recommendation templates', () => {
    const templates = mockRecommendationEngine.recommendationTemplates;
    
    // Verify templates for each maturity level
    expect(templates).toHaveProperty('beginner');
    expect(templates).toHaveProperty('intermediate');
    expect(templates).toHaveProperty('advanced');
    
    // Verify template structure
    const beginnerTemplate = templates.beginner[0];
    expect(beginnerTemplate).toHaveProperty('id');
    expect(beginnerTemplate).toHaveProperty('title');
    expect(beginnerTemplate).toHaveProperty('description');
    expect(beginnerTemplate).toHaveProperty('priority');
    expect(beginnerTemplate).toHaveProperty('category');
    expect(beginnerTemplate).toHaveProperty('implementationComplexity');
    expect(beginnerTemplate).toHaveProperty('estimatedTimeframe');
    expect(beginnerTemplate).toHaveProperty('potentialImpact');
  });

  // Test goal-specific recommendations
  test('should generate goal-specific recommendations', () => {
    const assessment = {
      selectedGoals: [
        {
          id: 'automate-operations',
          title: 'Automate Operations',
          category: 'Technology',
          implementationComplexity: 'Low',
          impactLevel: 'High'
        }
      ]
    };

    const recommendations = mockRecommendationEngine.generateRecommendations(assessment);
    
    // Verify goal-specific recommendation
    const goalRecommendation = recommendations.find(rec => rec.id.startsWith('goal-'));
    expect(goalRecommendation).toBeDefined();
    expect(goalRecommendation.title).toContain('Automate Operations');
    expect(goalRecommendation.category).toBe('Technology');
    expect(goalRecommendation.implementationComplexity).toBe('Low');
    expect(goalRecommendation.potentialImpact).toBe('High');
  });

  // Test recommendation consistency
  test('should maintain recommendation consistency', () => {
    const assessment = mockTestData.assessment;
    
    // Generate recommendations multiple times
    const recommendations1 = mockRecommendationEngine.generateRecommendations(assessment);
    const recommendations2 = mockRecommendationEngine.generateRecommendations(assessment);
    const recommendations3 = mockRecommendationEngine.generateRecommendations(assessment);
    
    // Verify recommendations are consistent
    expect(recommendations1).toEqual(recommendations2);
    expect(recommendations2).toEqual(recommendations3);
  });

  // Test edge cases
  test('should handle edge cases correctly', () => {
    // Test with no maturity level
    const noLevelAssessment = {
      selectedGoals: []
    };
    const noLevelRecommendations = mockRecommendationEngine.generateRecommendations(noLevelAssessment);
    expect(noLevelRecommendations).toHaveLength(0);

    // Test with no goals
    const noGoalsAssessment = {
      maturityLevel: 'beginner',
      selectedGoals: []
    };
    const noGoalsRecommendations = mockRecommendationEngine.generateRecommendations(noGoalsAssessment);
    expect(noGoalsRecommendations).toHaveLength(2); // Only template recommendations

    // Test with invalid maturity level
    const invalidLevelAssessment = {
      maturityLevel: 'invalid',
      selectedGoals: []
    };
    const invalidLevelRecommendations = mockRecommendationEngine.generateRecommendations(invalidLevelAssessment);
    expect(invalidLevelRecommendations).toHaveLength(0);
  });
}); 