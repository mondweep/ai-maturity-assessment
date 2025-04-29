export class ValidationEngine {
  validateDemographics(data) {
    const errors = {};
    let isValid = true;

    if (!data.industry) {
      errors.industry = 'Industry is required';
      isValid = false;
    }

    if (!data.companySize) {
      errors.companySize = 'Company size is required';
      isValid = false;
    }

    if (!data.role) {
      errors.role = 'Role is required';
      isValid = false;
    }

    return { isValid, errors };
  }

  validateJourneyStatus(data) {
    const errors = {};
    let isValid = true;

    if (!data.type) {
      errors.type = 'Journey status type is required';
      isValid = false;
    }

    if (!data.description && data.type !== 'not-started') {
      errors.description = 'Description is required for selected journey status';
      isValid = false;
    }

    return { isValid, errors };
  }

  validateGoals(goals) {
    const errors = {};
    let isValid = true;

    if (!Array.isArray(goals)) {
      errors.goals = 'Goals must be an array';
      isValid = false;
    } else if (goals.length === 0) {
      errors.goals = 'At least one goal must be selected';
      isValid = false;
    } else {
      goals.forEach((goal, index) => {
        if (!goal.id || !goal.title) {
          errors[`goal_${index}`] = 'Invalid goal format';
          isValid = false;
        }
      });
    }

    return { isValid, errors };
  }

  validateBudget(data) {
    const errors = {};
    let isValid = true;

    if (!data.range) {
      errors.range = 'Budget range is required';
      isValid = false;
    }

    if (!data.timeline) {
      errors.timeline = 'Timeline is required';
      isValid = false;
    }

    return { isValid, errors };
  }

  validateStep(step, data) {
    switch (step) {
      case 'demographics':
        return this.validateDemographics(data);
      case 'journey-status':
        return this.validateJourneyStatus(data);
      case 'goals':
        return this.validateGoals(data);
      case 'budget':
        return this.validateBudget(data);
      default:
        return { isValid: false, errors: { step: 'Invalid step' } };
    }
  }
}

export const validationEngine = new ValidationEngine(); 