/**
 * Generates a unique identifier.
 * For simplicity in this example, it returns a fixed string.
 * In a real application, use a library like 'uuid'.
 * @returns {string} A unique session ID.
 */
export function generateUniqueId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounces a function call.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

// Calculate maturity score based on responses
export function calculateMaturityScore(state) {
  let score = 0;
  const maxScore = 100;

  // Demographics score (10 points)
  if (state.organization.industry && state.organization.companySize) {
    score += 10;
  }

  // Journey status score (20 points)
  if (state.journeyStatus.type) {
    score += 20;
  }

  // Journey responses score (20 points)
  const journeyResponses = Object.keys(state.journeyStatus.responses || {}).length;
  score += Math.min(journeyResponses * 5, 20);

  // Goals score (20 points)
  score += Math.min(state.selectedGoals.length * 5, 20);

  // Qualifying responses score (20 points)
  const qualifyingResponses = Object.keys(state.qualifyingResponses || {}).length;
  score += Math.min(qualifyingResponses * 5, 20);

  // Budget info score (10 points)
  if (state.budgetInfo.range && state.budgetInfo.timeframe) {
    score += 10;
  }

  return Math.min(score, maxScore);
}

// Generate recommendations based on assessment results
export function generateRecommendations(state) {
  const recommendations = [];

  // Add recommendations based on journey status
  if (state.journeyStatus.type === 'not_started') {
    recommendations.push({
      title: 'Start with AI Education',
      description: 'Begin by educating key stakeholders about AI capabilities and potential use cases.',
      priority: 'High',
      category: 'People'
    });
  } else if (state.journeyStatus.type === 'exploring') {
    recommendations.push({
      title: 'Define Clear Use Cases',
      description: 'Identify specific business problems that AI can solve.',
      priority: 'High',
      category: 'Process'
    });
  }

  // Add recommendations based on selected goals
  state.selectedGoals.forEach(goal => {
    if (goal === 'automate_operations') {
      recommendations.push({
        title: 'Process Automation Assessment',
        description: 'Evaluate current manual processes for automation potential.',
        priority: 'Medium',
        category: 'Technology'
      });
    }
  });

  // Add recommendations based on budget
  if (state.budgetInfo.range === '10k-50k') {
    recommendations.push({
      title: 'Start with Pilot Projects',
      description: 'Begin with small, focused AI projects to demonstrate value.',
      priority: 'Medium',
      category: 'Process'
    });
  }

  return recommendations;
}

// Validate form inputs
export function validateInput(value, type) {
  switch (type) {
    case 'required':
      return value && value.trim().length > 0;
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'number':
      return !isNaN(value) && value > 0;
    default:
      return true;
  }
}

// Sanitize user input
export function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Format currency
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount);
}

// Format date
export function formatDate(date) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
}