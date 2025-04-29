import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider, useAssessment } from '../../context/AssessmentContext';

const TestComponent = () => {
  const { assessment, setAssessment } = useAssessment();
  
  return (
    <div>
      <div data-testid="current-step">{assessment.currentStep}</div>
      <div data-testid="organization">{JSON.stringify(assessment.organization)}</div>
      <div data-testid="journey-status">{JSON.stringify(assessment.journeyStatus)}</div>
      <div data-testid="errors">{JSON.stringify(assessment.errors)}</div>
      <button 
        data-testid="update-journey"
        onClick={() => setAssessment(prev => ({
          ...prev,
          journeyStatus: { 
            type: 'exploring',
            description: 'Exploring new opportunities',
            completedSteps: ['demographics']
          }
        }))}
      >
        Update Journey
      </button>
      <button 
        data-testid="update-goals"
        onClick={() => setAssessment(prev => ({
          ...prev,
          selectedGoals: ['efficiency', 'security']
        }))}
      >
        Update Goals
      </button>
      <button 
        data-testid="update-budget"
        onClick={() => setAssessment(prev => ({
          ...prev,
          budget: { range: '100k-500k', timeline: '6-12 months' }
        }))}
      >
        Update Budget
      </button>
      <button 
        data-testid="go-to-page"
        onClick={() => setAssessment(prev => ({
          ...prev,
          currentStep: 'security'
        }))}
      >
        Go To Security
      </button>
      <button 
        data-testid="reset"
        onClick={() => setAssessment(prev => ({
          currentStep: 'demographics',
          organization: { industry: '', companySize: '', role: '' },
          journeyStatus: { type: 'not_started', description: 'Assessment not started', completedSteps: [] },
          errors: null
        }))}
      >
        Reset
      </button>
    </div>
  );
};

describe('AssessmentContext', () => {
  let mockStorage;

  beforeEach(() => {
    mockStorage = {};
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(key => mockStorage[key]),
        setItem: jest.fn((key, value) => {
          mockStorage[key] = value;
        }),
        removeItem: jest.fn(key => {
          delete mockStorage[key];
        }),
        clear: jest.fn(() => {
          mockStorage = {};
        })
      },
      writable: true
    });
  });

  test('should update journey status and save to sessionStorage', async () => {
    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('update-journey'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('journey-status')).toHaveTextContent('exploring');
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
      const setItemCalls = window.sessionStorage.setItem.mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      expect(JSON.parse(lastCall[1])).toHaveProperty('journeyStatus.type', 'exploring');
    });
  });

  test('should update selected goals and save to sessionStorage', async () => {
    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('update-goals'));
    });

    await waitFor(() => {
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
      const setItemCalls = window.sessionStorage.setItem.mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      expect(JSON.parse(lastCall[1])).toHaveProperty('selectedGoals', ['efficiency', 'security']);
    });
  });

  test('should update budget/timeline and save to sessionStorage', async () => {
    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('update-budget'));
    });

    await waitFor(() => {
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
      const setItemCalls = window.sessionStorage.setItem.mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      expect(JSON.parse(lastCall[1])).toHaveProperty('budget.range', '100k-500k');
      expect(JSON.parse(lastCall[1])).toHaveProperty('budget.timeline', '6-12 months');
    });
  });

  test('should update current page and save to sessionStorage', async () => {
    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

    act(() => {
      fireEvent.click(screen.getByTestId('go-to-page'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-step')).toHaveTextContent('security');
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
      const setItemCalls = window.sessionStorage.setItem.mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      expect(JSON.parse(lastCall[1])).toHaveProperty('currentStep', 'security');
    });
  });

  test('should reset state and save to sessionStorage', async () => {
    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

    // First update some values
    act(() => {
      fireEvent.click(screen.getByTestId('update-journey'));
      fireEvent.click(screen.getByTestId('update-goals'));
    });

    // Then reset
    act(() => {
      fireEvent.click(screen.getByTestId('reset'));
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
      expect(screen.getByTestId('journey-status')).toHaveTextContent('not_started');
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
      const setItemCalls = window.sessionStorage.setItem.mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      expect(JSON.parse(lastCall[1])).toEqual({
        currentStep: 'demographics',
        organization: { industry: '', companySize: '', role: '' },
        journeyStatus: { type: 'not_started', description: 'Assessment not started', completedSteps: [] },
        errors: null
      });
    });
  });
}); 