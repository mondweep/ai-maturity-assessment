import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider, useAssessment } from '../../context/AssessmentContext';

// Test component that displays state
const TestComponent = () => {
  const { assessment, dispatch } = useAssessment();
  
  return (
    <div>
      <div data-testid="current-step">{assessment.currentStep || 'demographics'}</div>
      <div data-testid="industry">{assessment.organization?.industry || ''}</div>
      <div data-testid="company-size">{assessment.organization?.companySize || ''}</div>
      <div data-testid="journey-status">{assessment.journeyStatus?.type || ''}</div>
      <div data-testid="budget-range">{assessment?.budgetInfo?.range}</div>
      <div data-testid="timeline">{assessment?.budgetInfo?.timeline}</div>
      <button onClick={() => dispatch({ 
        type: 'UPDATE_ORGANIZATION', 
        payload: { industry: 'tech', companySize: '51-200' }
      })}>
        Update Demographics
      </button>
      <button onClick={() => dispatch({ 
        type: 'UPDATE_JOURNEY_STATUS', 
        payload: { type: 'exploring' }
      })}>
        Update Journey Status
      </button>
    </div>
  );
};

// Helper function to render with provider
const renderWithContext = (ui) => {
  return render(
    <AssessmentProvider>
      {ui}
    </AssessmentProvider>
  );
};

describe('Assessment State Management', () => {
  beforeEach(() => {
    // Reset mocks before each test
    window.sessionStorage.clear();
  });

  describe('Demographics State', () => {
    test('updates demographics state correctly', () => {
      renderWithContext(<TestComponent />);
      
      // Update demographics
      fireEvent.click(screen.getByText('Update Demographics'));
      
      // Verify state is updated
      expect(screen.getByTestId('industry')).toHaveTextContent('tech');
      expect(screen.getByTestId('company-size')).toHaveTextContent('51-200');
    });
  });

  describe('Journey Status State', () => {
    test('updates journey status state correctly', () => {
      renderWithContext(<TestComponent />);
      
      // Update journey status
      fireEvent.click(screen.getByText('Update Journey Status'));
      
      // Verify state is updated
      expect(screen.getByTestId('journey-status')).toHaveTextContent('exploring');
    });
  });

  describe('State Persistence', () => {
    test('persists state in session storage', () => {
      // Mock sessionStorage
      const mockSetItem = jest.spyOn(window.sessionStorage, 'setItem');
      
      renderWithContext(<TestComponent />);
      
      // Update state
      fireEvent.click(screen.getByText('Update Demographics'));
      
      // Verify session storage was updated
      expect(mockSetItem).toHaveBeenCalledWith(
        'assessmentState',
        expect.stringContaining('"industry":"tech"')
      );
    });
  });
}); 