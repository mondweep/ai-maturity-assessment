export class RecommendationEngine {
  generateRecommendations(assessment) {
    if (!assessment) {
      return [];
    }

    const recommendations = [];

    // Add template recommendations based on maturity level
    const templateRecommendations = this.getTemplateRecommendations(assessment);
    recommendations.push(...templateRecommendations);

    // Add goal-specific recommendations
    if (assessment.selectedGoals && assessment.selectedGoals.length > 0) {
      const goalRecommendations = this.getGoalRecommendations(assessment.selectedGoals);
      recommendations.push(...goalRecommendations);
    }

    // Filter recommendations based on budget and timeline
    return this.filterRecommendations(recommendations, assessment);
  }

  getTemplateRecommendations(assessment) {
    const recommendations = [];
    const maturityLevel = this.getMaturityLevel(assessment);

    switch (maturityLevel) {
      case 'Initial':
        recommendations.push({
          id: 'rec1',
          title: 'Establish AI Foundation',
          description: 'Begin with basic AI education and awareness training for key stakeholders.',
          priority: 'high',
          category: 'Education',
          cost: 'low',
          timeframe: 'short'
        });
        break;
      case 'Basic':
        recommendations.push({
          id: 'rec2',
          title: 'Data Strategy Development',
          description: 'Develop a comprehensive data strategy and governance framework.',
          priority: 'high',
          category: 'Strategy',
          cost: 'medium',
          timeframe: 'medium'
        });
        break;
      case 'Developing':
        recommendations.push({
          id: 'rec3',
          title: 'AI Pilot Projects',
          description: 'Implement pilot projects in key business areas.',
          priority: 'medium',
          category: 'Implementation',
          cost: 'medium',
          timeframe: 'medium'
        });
        break;
      case 'Intermediate':
        recommendations.push({
          id: 'rec4',
          title: 'Scale AI Solutions',
          description: 'Scale successful pilot projects across the organization.',
          priority: 'high',
          category: 'Scale',
          cost: 'high',
          timeframe: 'long'
        });
        break;
      case 'Advanced':
        recommendations.push({
          id: 'rec5',
          title: 'Innovation Leadership',
          description: 'Lead industry innovation through advanced AI applications.',
          priority: 'medium',
          category: 'Innovation',
          cost: 'high',
          timeframe: 'long'
        });
        break;
    }

    return recommendations;
  }

  getGoalRecommendations(selectedGoals) {
    return selectedGoals.map(goal => ({
      id: `goal-${goal.id}`,
      title: this.getGoalRecommendationTitle(goal),
      description: this.getGoalRecommendationDescription(goal),
      priority: this.getRecommendationPriority(goal),
      category: this.getGoalCategory(goal),
      cost: this.getEstimatedCost(goal),
      timeframe: this.getEstimatedTimeframe(goal)
    }));
  }

  getGoalRecommendationTitle(goal) {
    switch (goal.title.toLowerCase()) {
      case 'automate operations':
        return 'Implement Process Automation';
      case 'improve customer experience':
        return 'AI-Powered Customer Service';
      case 'enhance decision making':
        return 'Predictive Analytics Implementation';
      default:
        return `${goal.title} Enhancement`;
    }
  }

  getGoalRecommendationDescription(goal) {
    switch (goal.title.toLowerCase()) {
      case 'automate operations':
        return 'Implement RPA and AI-driven process automation for key operational workflows.';
      case 'improve customer experience':
        return 'Deploy AI chatbots and personalization engines to enhance customer interactions.';
      case 'enhance decision making':
        return 'Implement predictive analytics and decision support systems.';
      default:
        return `Strategic implementation plan for ${goal.title}.`;
    }
  }

  getRecommendationPriority(goal) {
    // Priority logic based on goal type and impact
    return 'high';
  }

  getGoalCategory(goal) {
    switch (goal.title.toLowerCase()) {
      case 'automate operations':
        return 'Automation';
      case 'improve customer experience':
        return 'Customer Service';
      case 'enhance decision making':
        return 'Analytics';
      default:
        return 'Technology';
    }
  }

  getEstimatedCost(goal) {
    // Cost estimation logic
    return 'medium';
  }

  getEstimatedTimeframe(goal) {
    // Timeframe estimation logic
    return 'medium';
  }

  filterRecommendations(recommendations, assessment) {
    if (!assessment.budgetInfo) {
      return recommendations;
    }

    const { range: budgetRange, timeline } = assessment.budgetInfo;

    return recommendations.filter(rec => {
      // Filter based on budget range
      if (budgetRange === '0-50k' && rec.cost === 'high') {
        return false;
      }
      if (budgetRange === '50k-200k' && rec.cost === 'very-high') {
        return false;
      }

      // Filter based on timeline
      if (timeline === '0-6m' && rec.timeframe === 'long') {
        return false;
      }
      if (timeline === '6m-1y' && rec.timeframe === 'very-long') {
        return false;
      }

      return true;
    });
  }

  getMaturityLevel(assessment) {
    const { journeyStatus } = assessment;
    if (!journeyStatus || !journeyStatus.type) {
      return 'Initial';
    }

    switch (journeyStatus.type) {
      case 'not-started':
        return 'Initial';
      case 'planning':
        return 'Basic';
      case 'in-progress':
        return 'Developing';
      case 'advanced':
        return 'Advanced';
      default:
        return 'Initial';
    }
  }
}

export const recommendationEngine = new RecommendationEngine(); 