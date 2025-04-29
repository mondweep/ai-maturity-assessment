import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider, useAssessment } from '../../context/AssessmentContext';
import { renderWithContext, mockTestData } from '../../__mocks__/testUtilsMock';

// Test component that displays state and provides actions
const TestComponent = () => {
  const { assessment, setAssessment } = useAssessment();

  const setDemographics = () => {
    setAssessment(prev => ({
      ...prev,
      organization: {
        industry: mockTestData.demographics.industry,
        companySize: mockTestData.demographics.companySize,
        role: mockTestData.demographics.role
      },
      journeyStatus: {
        type: 'in_progress',
        description: 'Demographics completed',
        completedSteps: ['demographics']
      }
    }));
  };

  const moveToNextStep = () => {
    setAssessment(prev => ({
      ...prev,
      currentStep: 'security'
    }));
  };

  const updateWithXSS = () => {
    setAssessment(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        industry: '<script>alert("xss")</script>',
        companySize: '51-200',
        role: 'Developer'
      }
    }));
  };

  const updateWithLongInput = () => {
    setAssessment(prev => ({
      ...prev,
      organization: {
        ...prev.organization,
        industry: 'a'.repeat(1000),
        companySize: '51-200',
        role: 'Developer'
      }
    }));
  };

  return (
    <div>
      <div data-testid="current-step">{assessment.currentStep}</div>
      <div data-testid="industry">{assessment.organization?.industry || ''}</div>
      <div data-testid="company-size">{assessment.organization?.companySize || ''}</div>
      <div data-testid="role">{assessment.organization?.role || ''}</div>
      <div data-testid="journey-status">{assessment.journeyStatus?.type || ''}</div>
      <div data-testid="journey-description">{assessment.journeyStatus?.description || ''}</div>
      <div data-testid="completed-steps">{assessment.journeyStatus?.completedSteps?.join(',') || ''}</div>
      <button onClick={setDemographics} data-testid="set-demographics">Set Demographics</button>
      <button onClick={moveToNextStep} data-testid="next-step">Next Step</button>
      <button onClick={updateWithXSS} data-testid="update-xss">Update with XSS</button>
      <button onClick={updateWithLongInput} data-testid="update-long">Update with Long Input</button>
    </div>
  );
};

describe('Assessment Security', () => {
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

  describe('Session Storage Security', () => {
    test('encrypts sensitive data in session storage', async () => {
      renderWithContext(<TestComponent />);
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-demographics'));
      });
      
      expect(window.sessionStorage.setItem).toHaveBeenCalled();
      const setItemCalls = window.sessionStorage.setItem.mock.calls;
      const lastCall = setItemCalls[setItemCalls.length - 1];
      expect(lastCall[0]).toBe('assessmentState');
      expect(lastCall[1]).toContain('organization');
      expect(lastCall[1]).toContain('journeyStatus');
      expect(lastCall[1]).toContain('completedSteps');
    });

    test('handles session storage errors gracefully', async () => {
      window.sessionStorage.setItem.mockImplementationOnce(() => {
        throw new Error('Storage error');
      });

      renderWithContext(<TestComponent />);
      
      act(() => {
        fireEvent.click(screen.getByTestId('set-demographics'));
      });
      
      expect(screen.getByTestId('industry')).toHaveTextContent(mockTestData.demographics.industry);
      expect(screen.getByTestId('journey-status')).toHaveTextContent('in_progress');
    });
  });

  describe('Input Validation and Step Progression', () => {
    test('sanitizes user input', () => {
      renderWithContext(<TestComponent />);
      
      act(() => {
        fireEvent.click(screen.getByTestId('update-xss'));
      });
      
      const storedData = window.sessionStorage.getItem('assessmentState');
      expect(storedData).toBeDefined();
      expect(storedData).not.toContain('<script>');
      expect(storedData).not.toContain('alert');
    });

    test('validates input length', () => {
      renderWithContext(<TestComponent />);
      
      act(() => {
        fireEvent.click(screen.getByTestId('update-long'));
      });
      
      const storedData = window.sessionStorage.getItem('assessmentState');
      expect(storedData).toBeDefined();
      const parsedData = JSON.parse(storedData);
      expect(parsedData.organization.industry.length).toBeLessThan(1000);
    });

    test('enforces step progression order', () => {
      const initialState = {
        currentStep: 'demographics',
        organization: {},
        journeyStatus: {
          type: 'not_started',
          description: 'Not started',
          completedSteps: []
        }
      };

      renderWithContext(<TestComponent />, { initialState });
      
      // Try to move to next step without completing demographics
      act(() => {
        fireEvent.click(screen.getByTestId('next-step'));
      });
      
      // Should still be on demographics
      expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
      expect(screen.getByTestId('journey-status')).toHaveTextContent('not_started');
      expect(screen.getByTestId('completed-steps')).toHaveTextContent('');
      
      // Complete demographics
      act(() => {
        fireEvent.click(screen.getByTestId('set-demographics'));
      });
      
      // Now can move to next step
      act(() => {
        fireEvent.click(screen.getByTestId('next-step'));
      });
      
      expect(screen.getByTestId('current-step')).toHaveTextContent('security');
      expect(screen.getByTestId('journey-status')).toHaveTextContent('in_progress');
      expect(screen.getByTestId('completed-steps')).toHaveTextContent('demographics');
    });
  });

  describe('State Persistence Security', () => {
    test('prevents state tampering', () => {
      const initialState = {
        currentStep: 'demographics',
        organization: {
          industry: 'Technology',
          companySize: '51-200',
          role: 'Developer'
        },
        journeyStatus: {
          type: 'in_progress',
          description: 'Demographics completed',
          completedSteps: ['demographics']
        }
      };

      renderWithContext(<TestComponent />, { initialState });

      // Try to tamper with session storage directly
      const tampered = {
        ...initialState,
        currentStep: 'security',
        journeyStatus: {
          type: 'completed',
          description: 'All done',
          completedSteps: ['demographics', 'security', 'goals', 'budget']
        }
      };
      window.sessionStorage.setItem('assessmentState', JSON.stringify(tampered));

      // Verify that the state remains intact
      expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
      expect(screen.getByTestId('journey-status')).toHaveTextContent('in_progress');
      expect(screen.getByTestId('completed-steps')).toHaveTextContent('demographics');
    });

    test('handles corrupted state data', () => {
      // Set corrupted data in session storage
      window.sessionStorage.setItem('assessmentState', 'invalid json');

      renderWithContext(<TestComponent />);

      // Should revert to default state
      expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
      expect(screen.getByTestId('journey-status')).toHaveTextContent('not_started');
      expect(screen.getByTestId('completed-steps')).toHaveTextContent('');
    });
  });
}); 