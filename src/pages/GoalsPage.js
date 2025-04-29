import React, { useState } from 'react';
import { useAssessment } from '../context/AssessmentContext';

const goals = [
  {
    id: 'automate_operations',
    label: 'Automate Operations',
    description: 'Reduce manual work and improve efficiency through automation.'
  },
  {
    id: 'enhance_customer_experience',
    label: 'Enhance Customer Experience',
    description: 'Improve customer satisfaction and engagement through AI-powered insights.'
  },
  {
    id: 'improve_decision_making',
    label: 'Improve Decision Making',
    description: 'Make better business decisions with AI-driven analytics and predictions.'
  },
  {
    id: 'develop_new_products',
    label: 'Develop New Products',
    description: 'Create innovative AI-powered products and services.'
  }
];

function GoalsPage() {
  const { state, setGoals, setCurrentStep } = useAssessment();
  const [errors, setErrors] = useState({});
  const [selectedGoals, setSelectedGoals] = useState(state.selectedGoals || []);

  const handleGoalToggle = (goalId) => {
    setSelectedGoals(prev => {
      if (prev.includes(goalId)) {
        return prev.filter(id => id !== goalId);
      } else {
        return [...prev, goalId];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate at least one goal is selected
    if (selectedGoals.length === 0) {
      setErrors({ goals: 'Please select at least one goal' });
      return;
    }

    // Update state
    setGoals(selectedGoals);
    setCurrentStep('qualifying_questions');
  };

  return (
    <div className="page goals-page">
      <h2>Select your AI goals</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="goals-list">
            {goals.map(goal => (
              <div 
                key={goal.id}
                className={`goal-option ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
              >
                <label className="goal-label">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal.id)}
                    onChange={() => handleGoalToggle(goal.id)}
                    aria-invalid={!!errors.goals}
                    aria-describedby={errors.goals ? 'goals-error' : undefined}
                  />
                  <div className="goal-content">
                    <h3>{goal.label}</h3>
                    <p>{goal.description}</p>
                  </div>
                </label>
              </div>
            ))}
          </div>
          {errors.goals && (
            <div id="goals-error" className="form-error">
              {errors.goals}
            </div>
          )}
        </div>

        <div className="nav-buttons">
          <button type="submit" className="button button-primary">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

export default GoalsPage; 