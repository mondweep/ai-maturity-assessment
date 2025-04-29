export class ScoringEngine {
  calculateGoalsScore(selectedGoals) {
    if (!Array.isArray(selectedGoals) || selectedGoals.length === 0) {
      return 0;
    }

    // Each goal contributes equally to the total score
    const scorePerGoal = 40 / selectedGoals.length;
    return Math.min(40, selectedGoals.length * scorePerGoal);
  }

  calculateBudgetScore(budgetInfo) {
    if (!budgetInfo || !budgetInfo.range || !budgetInfo.timeline) {
      return 0;
    }

    let score = 0;

    // Score based on budget range
    switch (budgetInfo.range) {
      case '0-50k':
        score += 10;
        break;
      case '50k-200k':
        score += 20;
        break;
      case '200k-500k':
        score += 30;
        break;
      case '500k+':
        score += 40;
        break;
      default:
        score += 0;
    }

    // Score based on timeline
    switch (budgetInfo.timeline) {
      case '0-6m':
        score += 30;
        break;
      case '6m-1y':
        score += 40;
        break;
      case '1y+':
        score += 20;
        break;
      default:
        score += 0;
    }

    return Math.min(80, score);
  }

  calculateTotalScore(assessment) {
    if (!assessment) {
      return 0;
    }

    const goalsScore = this.calculateGoalsScore(assessment.selectedGoals);
    const budgetScore = this.calculateBudgetScore(assessment.budgetInfo);

    // Weights for different components
    const weights = {
      goals: 0.4,
      budget: 0.3,
      journey: 0.3
    };

    // Calculate journey status score
    let journeyScore = 0;
    if (assessment.journeyStatus && assessment.journeyStatus.type) {
      switch (assessment.journeyStatus.type) {
        case 'not-started':
          journeyScore = 20;
          break;
        case 'planning':
          journeyScore = 40;
          break;
        case 'in-progress':
          journeyScore = 60;
          break;
        case 'advanced':
          journeyScore = 80;
          break;
        default:
          journeyScore = 0;
      }
    }

    // Calculate weighted total
    const totalScore = (
      goalsScore * weights.goals +
      budgetScore * weights.budget +
      journeyScore * weights.journey
    );

    return Math.round(totalScore);
  }

  determineMaturityLevel(score) {
    if (score >= 80) {
      return 'Advanced';
    } else if (score >= 60) {
      return 'Intermediate';
    } else if (score >= 40) {
      return 'Developing';
    } else if (score >= 20) {
      return 'Basic';
    } else {
      return 'Initial';
    }
  }
}

export const scoringEngine = new ScoringEngine(); 