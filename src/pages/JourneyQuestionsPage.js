import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';

// Questions based on journey status
const getQuestionsForStatus = (status) => {
  switch (status) {
    case 'not_started':
      return [
        {
          id: 'q1',
          text: 'What is your primary motivation for exploring AI?',
          type: 'text'
        },
        {
          id: 'q2',
          text: 'What are your main concerns about implementing AI?',
          type: 'text'
        }
      ];
    case 'exploring':
      return [
        {
          id: 'q1',
          text: 'What AI tools are you experimenting with?',
          type: 'text'
        },
        {
          id: 'q2',
          text: 'What challenges are you facing in your exploration?',
          type: 'text'
        }
      ];
    case 'implementing':
      return [
        {
          id: 'q1',
          text: 'Which AI solutions are you currently implementing?',
          type: 'text'
        },
        {
          id: 'q2',
          text: 'What metrics are you using to measure success?',
          type: 'text'
        }
      ];
    case 'scaling':
      return [
        {
          id: 'q1',
          text: 'How are you managing AI governance across departments?',
          type: 'text'
        },
        {
          id: 'q2',
          text: 'What strategies are you using to scale AI adoption?',
          type: 'text'
        }
      ];
    default:
      return [];
  }
};

function JourneyQuestionsPage() {
  const { state, setJourneyResponses, setCurrentStep } = useAssessment();
  const [errors, setErrors] = useState({});
  const [responses, setResponses] = useState(state.journeyStatus.responses || {});

  const questions = getQuestionsForStatus(state.journeyStatus.type);

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
    questions.forEach(question => {
      if (!responses[question.id]) {
        newErrors[question.id] = 'This question is required';
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Update state
    setJourneyResponses(responses);
    setCurrentStep('goals');
  };

  return (
    <div className="page journey-questions-page">
      <h2>Tell us more about your AI journey</h2>
      <form onSubmit={handleSubmit}>
        {questions.map(question => (
          <div key={question.id} className="form-group">
            <label htmlFor={question.id} className="form-label">
              {question.text}
            </label>
            <textarea
              id={question.id}
              className="form-input"
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              rows="4"
              aria-invalid={!!errors[question.id]}
              aria-describedby={errors[question.id] ? `${question.id}-error` : undefined}
            />
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

export default JourneyQuestionsPage; 