# AI Maturity Assessment Application - Components Pseudocode

This document contains pseudocode for the reusable components used throughout the AI Maturity Assessment application.

## 1. Question Renderer Component

The QuestionRenderer component is responsible for rendering different types of questions based on their configuration.

```javascript
// Question renderer component
function QuestionRenderer({ question, value, onChange, error }) {
  // Render appropriate input based on question type
  function renderQuestionInput() {
    switch (question.type) {
      case "text":
        return (
          <input
            type="text"
            id={question.id}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={error ? "error" : ""}
          />
        );
        
      case "textarea":
        return (
          <textarea
            id={question.id}
            value={value}
            onChange={e => onChange(e.target.value)}
            rows={4}
            className={error ? "error" : ""}
          />
        );
        
      case "multiple-choice":
        return (
          <div className="radio-options">
            {question.options.map(option => (
              <div key={option.id} className="radio-option">
                <input
                  type="radio"
                  id={option.id}
                  name={question.id}
                  value={option.id}
                  checked={value === option.id}
                  onChange={() => onChange(option.id)}
                />
                <label htmlFor={option.id}>{option.text}</label>
              </div>
            ))}
          </div>
        );
        
      case "checkbox":
        // Handle array of values for checkboxes
        const selectedValues = value ? (Array.isArray(value) ? value : [value]) : [];
        
        return (
          <div className="checkbox-options">
            {question.options.map(option => (
              <div key={option.id} className="checkbox-option">
                <input
                  type="checkbox"
                  id={option.id}
                  value={option.id}
                  checked={selectedValues.includes(option.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      // Add to selected values
                      onChange([...selectedValues, option.id]);
                    } else {
                      // Remove from selected values
                      onChange(selectedValues.filter(v => v !== option.id));
                    }
                  }}
                />
                <label htmlFor={option.id}>{option.text}</label>
              </div>
            ))}
          </div>
        );
        
      case "scale":
        return (
          <div className="scale-input">
            <input
              type="range"
              id={question.id}
              min={question.min || 0}
              max={question.max || 10}
              step={question.step || 1}
              value={value || question.min || 0}
              onChange={e => onChange(parseInt(e.target.value))}
              className={error ? "error" : ""}
            />
            <div className="scale-labels">
              <span className="min-label">{question.minLabel || question.min || 0}</span>
              <span className="max-label">{question.maxLabel || question.max || 10}</span>
            </div>
            <div className="scale-value">{value || question.min || 0}</div>
          </div>
        );
        
      case "dropdown":
        return (
          <select
            id={question.id}
            value={value}
            onChange={e => onChange(e.target.value)}
            className={error ? "error" : ""}
          >
            <option value="">Select an option</option>
            {question.options.map(option => (
              <option key={option.id} value={option.id}>
                {option.text}
              </option>
            ))}
          </select>
        );
        
      default:
        return <div>Unsupported question type: {question.type}</div>;
    }
    // TEST: Correct input type is rendered based on question type
  }
  
  return (
    <div className="question-container">
      <label htmlFor={question.id} className="question-label">
        {question.text}
        {question.required && <span className="required-indicator">*</span>}
      </label>
      
      {question.description && (
        <div className="question-description">{question.description}</div>
      )}
      
      {renderQuestionInput()}
      
      {error && <div className="error-message">{error}</div>}
    </div>
  );
  // TEST: Question is rendered with all necessary elements (label, input, error)
}
```

## 2. Progress Bar Component

The ProgressBar component shows the user's progress through the assessment.

```javascript
// Progress bar component
function ProgressBar({ currentStep, totalSteps }) {
  // Calculate progress percentage
  const progressPercentage = Math.round((currentStep / totalSteps) * 100);
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="progress-text">
        Step {currentStep} of {totalSteps} ({progressPercentage}%)
      </div>
    </div>
  );
  // TEST: Progress bar correctly displays current step and percentage
}
```

## 3. Navigation Controls Component

The NavigationControls component provides consistent navigation buttons throughout the assessment.

```javascript
// Navigation controls component
function NavigationControls({ 
  onBack, 
  onNext, 
  onSubmit, 
  canGoBack = true, 
  canGoNext = true, 
  isLastStep = false,
  isSubmitting = false
}) {
  return (
    <div className="navigation-controls">
      {canGoBack && (
        <button 
          type="button" 
          onClick={onBack} 
          className="secondary-button"
          disabled={isSubmitting}
        >
          Back
        </button>
      )}
      
      {isLastStep ? (
        <button 
          type={onSubmit ? "submit" : "button"} 
          onClick={onSubmit}
          className="primary-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      ) : (
        <button 
          type={onNext ? "button" : "submit"} 
          onClick={onNext}
          className="primary-button"
          disabled={!canGoNext || isSubmitting}
        >
          Continue
        </button>
      )}
    </div>
  );
  // TEST: Correct buttons are rendered based on navigation state
}
```

## 4. Card Component

The Card component provides a consistent container for content.

```javascript
// Card component
function Card({ title, children, className = "" }) {
  return (
    <div className={`card ${className}`}>
      {title && <div className="card-header">{title}</div>}
      <div className="card-content">{children}</div>
    </div>
  );
  // TEST: Card renders with title and content
}
```

## 5. Goal Card Component

The GoalCard component displays a selectable goal card.

```javascript
// Goal card component
function GoalCard({ goal, isSelected, onToggle }) {
  return (
    <div 
      className={`goal-card ${isSelected ? "selected" : ""}`}
      onClick={onToggle}
    >
      <div className="goal-icon">{goal.icon}</div>
      <h3>{goal.title}</h3>
      <p>{goal.description}</p>
      <div className="selection-indicator">
        {isSelected ? "✓" : "+"}
      </div>
    </div>
  );
  // TEST: Goal card renders with correct selected state
}
```

## 6. Score Display Component

The ScoreDisplay component visualizes the maturity score.

```javascript
// Score display component
function ScoreDisplay({ score, maxScore = 100 }) {
  // Determine score category
  function getScoreCategory(score) {
    if (score < 30) return "beginner";
    if (score < 60) return "intermediate";
    if (score < 85) return "advanced";
    return "expert";
  }
  
  const scoreCategory = getScoreCategory(score);
  
  // Get label for score category
  function getScoreCategoryLabel(category) {
    switch(category) {
      case "beginner": return "Beginning";
      case "intermediate": return "Developing";
      case "advanced": return "Advanced";
      case "expert": return "Expert";
      default: return "";
    }
  }
  
  return (
    <div className="score-display">
      <div className={`score-circle ${scoreCategory}`}>
        <div className="score-value">{score}</div>
        <div className="score-max">/{maxScore}</div>
      </div>
      <div className="score-category">
        {getScoreCategoryLabel(scoreCategory)}
      </div>
    </div>
  );
  // TEST: Score display correctly shows score value and category
}
```

## 7. Recommendation Item Component

The RecommendationItem component displays a single recommendation.

```javascript
// Recommendation item component
function RecommendationItem({ recommendation, index }) {
  return (
    <div className="recommendation-item">
      <div className="recommendation-number">{index + 1}</div>
      <div className="recommendation-content">
        <h3>{recommendation.title}</h3>
        <p>{recommendation.description}</p>
        {recommendation.actionItems && (
          <div className="action-items">
            <h4>Action Items:</h4>
            <ul>
              {recommendation.actionItems.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
  // TEST: Recommendation item displays title, description and action items
}
```

## 8. Loading Indicator Component

The LoadingIndicator component shows a loading state.

```javascript
// Loading indicator component
function LoadingIndicator({ message = "Loading..." }) {
  return (
    <div className="loading-container">
      <div className="spinner"></div>
      <div className="loading-message">{message}</div>
    </div>
  );
  // TEST: Loading indicator displays with message
}
```

## 9. Error Message Component

The ErrorMessage component displays error messages.

```javascript
// Error message component
function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-message">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Try Again
        </button>
      )}
    </div>
  );
  // TEST: Error message displays with retry button when provided
}