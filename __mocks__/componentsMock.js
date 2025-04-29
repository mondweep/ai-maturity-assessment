// Mock UI Components
import React from 'react';

// Mock QuestionRenderer
export const MockQuestionRenderer = ({ question, value, onChange, error }) => (
  <div data-testid="question-renderer">
    <label>{question.text}</label>
    {error && <div className="error">{error}</div>}
    <input
      type="text"
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      data-testid={`question-input-${question.id}`}
    />
  </div>
);

// Mock ProgressBar
export const MockProgressBar = ({ currentStep, totalSteps }) => (
  <div data-testid="progress-bar">
    <div className="progress-fill" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
    <div className="progress-text">
      Step {currentStep} of {totalSteps}
    </div>
  </div>
);

// Mock NavigationControls
export const MockNavigationControls = ({ onBack, onNext, canGoBack, canGoNext }) => (
  <div data-testid="navigation-controls">
    <button
      onClick={onBack}
      disabled={!canGoBack}
      data-testid="back-button"
    >
      Back
    </button>
    <button
      onClick={onNext}
      disabled={!canGoNext}
      data-testid="next-button"
    >
      Next
    </button>
  </div>
);

// Mock Card
export const MockCard = ({ title, children }) => (
  <div data-testid="card" className="card">
    {title && <div className="card-header">{title}</div>}
    <div className="card-content">{children}</div>
  </div>
);

// Mock GoalCard
export const MockGoalCard = ({ goal, isSelected, onToggle }) => (
  <div
    data-testid={`goal-card-${goal.id}`}
    className={`goal-card ${isSelected ? 'selected' : ''}`}
    onClick={onToggle}
  >
    <h3>{goal.title}</h3>
    <p>{goal.description}</p>
    <div className="selection-indicator">
      {isSelected ? '✓' : '+'}
    </div>
  </div>
);

// Mock ScoreDisplay
export const MockScoreDisplay = ({ score, maxScore = 100 }) => (
  <div data-testid="score-display" className="score-display">
    <div className="score-circle">
      <div className="score-value">{score}</div>
      <div className="score-max">/{maxScore}</div>
    </div>
  </div>
);

// Mock RecommendationItem
export const MockRecommendationItem = ({ recommendation, index }) => (
  <div data-testid={`recommendation-${index}`} className="recommendation-item">
    <div className="recommendation-number">{index + 1}</div>
    <div className="recommendation-content">
      <h3>{recommendation.title}</h3>
      <p>{recommendation.description}</p>
    </div>
  </div>
); 