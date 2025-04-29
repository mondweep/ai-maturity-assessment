import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';

// Questions for each goal
const getQuestionsForGoal = (goalId) => {
  switch (goalId) {
    case 'automate_operations':
      return [
        {
          id: 'q1',
          text: 'How many manual hours could be automated?',
          type: 'number',
          placeholder: 'Enter number of hours'
        }
      ];
    case 'enhance_customer_experience':
      return [
        {
          id: 'q1',
          text: 'What is your current customer satisfaction score?',
          type: 'number',
          placeholder: 'Enter score (0-100)'
        }
      ];
    case 'improve_decision_making':
      return [
        {
          id: 'q1',
          text: 'Which key business decision could benefit most from AI insights?',
          type: 'text',
          placeholder: 'Describe the decision'
        }
      ];
    case 'develop_new_products':
      return [
        {
          id: 'q1',
          text: 'What type of AI-powered product are you considering?',
          type: 'text',
          placeholder: 'Describe the product'
        }
      ];
    default:
      return [];
  }
};

function QualifyingQuestionsPage() {
  const { state, setQualifyingResponses, setCurrentStep } = useAssessment();
  const [errors, setErrors] = useState({});
  const [responses, setResponses] = useState(state.qualifyingResponses || {});

  // Get all questions for selected goals
  const allQuestions = state.selectedGoals.reduce((acc, goalId) => {
    const questions = getQuestionsForGoal(goalId);
    return [...acc, ...questions];
  }, []);

  const handleInputChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate all questions are answered
    const newErrors = {};
    allQuestions.forEach(question => {
      if (!responses[question.id]) {
        newErrors[question.id] = 'This question is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update state
    setQualifyingResponses(responses);
    setCurrentStep('budget');
  };

  return (
    <div className="page qualifying-questions-page">
      <h2>Tell us more about your goals</h2>
      <form onSubmit={handleSubmit}>
        {allQuestions.map(question => (
          <div key={question.id} className="form-group">
            <label htmlFor={question.id} className="form-label">
              {question.text}
            </label>
            {question.type === 'text' ? (
              <textarea
                id={question.id}
                className="form-input"
                value={responses[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                rows="4"
                aria-invalid={!!errors[question.id]}
                aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
              />
            ) : (
              <input
                type="number"
                id={question.id}
                className="form-input"
                value={responses[question.id] || ''}
                onChange={(e) => handleInputChange(question.id, e.target.value)}
                placeholder={question.placeholder}
                aria-invalid={!!errors[question.id]}
                aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
              />
            )}
            {errors[question.id] && (
              <div id={`${question.id}-error`} className="form-error">
                {errors[question.id]}
              </div>
            )}
          </div>
        ))}

        <div className="nav-buttons">
          <button type="submit" className="button button-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default QualifyingQuestionsPage; 