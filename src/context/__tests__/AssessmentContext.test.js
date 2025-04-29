import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider, useAssessment } from '../AssessmentContext';
import * as helpers from '../../utils/helpers'; // Import helpers to mock

// Mock the helpers module
jest.mock('../../utils/helpers', () => ({
  generateUniqueId: jest.fn(() => 'test-unique-id'),
  debounce: jest.fn((fn) => fn), // Mock debounce to execute immediately
}));

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// A simple component to consume and display context values
const TestComponent = ({ onDispatch }) => {
  const { assessment, dispatch } = useAssessment();

  React.useEffect(() => {
    if (onDispatch) {
      onDispatch(dispatch);
    }
  }, [onDispatch]);

  return (
    <div>
      <div data-testid="current-step">{assessment.currentStep}</div>
      <div data-testid="organization">{JSON.stringify(assessment.organization)}</div>
      <div data-testid="journey-status">{JSON.stringify(assessment.journeyStatus)}</div>
      <div data-testid="errors">{JSON.stringify(assessment.errors)}</div>
    </div>
  );
};

describe('AssessmentContext', () => {
  beforeEach(() => {
    // Clear mocks and storage before each test
    mockSessionStorage.clear();
    jest.clearAllMocks();
    // Reset mock implementation details if necessary
    helpers.generateUniqueId.mockReturnValue('test-unique-id');
  });

  test('should initialize with a new session ID if none exists in sessionStorage', async () => {
    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

    // Wait for loading to complete
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Check if generateUniqueId was called
    expect(helpers.generateUniqueId).toHaveBeenCalledTimes(1);

    // Check if the new session ID was set in sessionStorage
    expect(mockSessionStorage.setItem).toHaveBeenCalledWith('assessmentSessionId', 'test-unique-id');

    // Check if the session ID is available in the context
    expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
  });

  test('should load existing session ID from sessionStorage', async () => {
    // Pre-populate sessionStorage
    mockSessionStorage.setItem('assessmentSessionId', 'existing-session-id');

    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

     // Wait for loading to complete
     await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Check if generateUniqueId was NOT called
    expect(helpers.generateUniqueId).not.toHaveBeenCalled();

    // Check if the existing session ID is loaded into the context
    expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
  });

  test('should initialize with default state if no state exists in sessionStorage for the session ID', async () => {
     // Ensure session ID exists but no state
     mockSessionStorage.setItem('assessmentSessionId', 'session-without-state');

    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

     // Wait for loading to complete
     await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Check default state values
    expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
    expect(screen.getByTestId('organization')).toHaveTextContent(JSON.stringify({
      industry: '',
      companySize: '',
      role: ''
    }));
    expect(screen.getByTestId('journey-status')).toHaveTextContent(JSON.stringify({
      type: '',
      description: ''
    }));
    expect(screen.getByTestId('errors')).toHaveTextContent('null');
    // Check if state was attempted to be loaded for this session
    expect(mockSessionStorage.getItem).toHaveBeenCalledWith('assessmentState_session-without-state');
  });

  test('should load existing state from sessionStorage for the session ID', async () => {
    const existingState = {
      currentStep: 'security',
      organization: {
        industry: 'Technology',
        companySize: '100-500',
        role: 'CTO'
      },
      journeyStatus: {
        type: 'in_progress',
        description: 'Assessment in progress'
      },
      errors: null
    };
    const sessionId = 'session-with-state';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);
    mockSessionStorage.setItem(`assessmentState_${sessionId}`, JSON.stringify(existingState));

    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

     // Wait for loading to complete
     await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Check if the loaded state values are reflected
    expect(screen.getByTestId('current-step')).toHaveTextContent('security');
    expect(screen.getByTestId('organization')).toHaveTextContent(JSON.stringify(existingState.organization));
    expect(screen.getByTestId('journey-status')).toHaveTextContent(JSON.stringify(existingState.journeyStatus));
  });

  test('should handle invalid JSON in sessionStorage gracefully', async () => {
    const sessionId = 'session-with-invalid-state';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);
    mockSessionStorage.setItem(`assessmentState_${sessionId}`, 'invalid json');

    // Suppress console.error for this test
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <AssessmentProvider>
        <TestComponent />
      </AssessmentProvider>
    );

     // Wait for loading to complete
     await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Should fall back to default state
    expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
    expect(screen.getByTestId('organization')).toHaveTextContent(JSON.stringify({
      industry: '',
      companySize: '',
      role: ''
    }));
    expect(screen.getByTestId('journey-status')).toHaveTextContent(JSON.stringify({
      type: '',
      description: ''
    }));
    expect(screen.getByTestId('errors')).toHaveTextContent('null');

    // Check if the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to parse stored assessment state:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore(); // Restore console.error
  });

  test('should update organization state and save to sessionStorage on updateOrganization', async () => {
    let dispatchFn;
    const handleDispatch = (dispatch) => {
      dispatchFn = dispatch;
    };

    render(
      <AssessmentProvider>
        <TestComponent onDispatch={handleDispatch} />
      </AssessmentProvider>
    );

    await waitFor(() => expect(dispatchFn).toBeDefined());

    const newOrgData = { industry: 'Healthcare', companySize: '500+', role: 'CIO' };
    act(() => {
      dispatchFn({ type: 'UPDATE_ORGANIZATION', payload: newOrgData });
    });

    await waitFor(() => {
      expect(screen.getByTestId('organization')).toHaveTextContent(JSON.stringify(newOrgData));
    });
  });

  test('should update journey status and save to sessionStorage on updateJourneyStatus', async () => {
    let dispatchFn;
    const handleDispatch = (dispatch) => {
      dispatchFn = dispatch;
    };

    render(
      <AssessmentProvider>
        <TestComponent onDispatch={handleDispatch} />
      </AssessmentProvider>
    );

    await waitFor(() => expect(dispatchFn).toBeDefined());

    const newJourneyStatus = { type: 'exploring', description: 'Exploring new opportunities' };
    act(() => {
      dispatchFn({ type: 'UPDATE_JOURNEY_STATUS', payload: newJourneyStatus });
    });

    await waitFor(() => {
      expect(screen.getByTestId('journey-status')).toHaveTextContent(JSON.stringify(newJourneyStatus));
    });
  });

  test('should update selected goals and save to sessionStorage on updateSelectedGoals', async () => {
    const sessionId = 'test-session-update-goals';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);

    let dispatch;
    const TestComponentWithAction = () => {
      const { assessment, dispatch } = useAssessment();
      dispatch = dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const newGoals = [{ id: 'g1', title: 'Goal 1' }];
    act(() => {
      dispatch({ type: 'UPDATE_SELECTED_GOALS', payload: newGoals });
    });

    // Check if save was called with updated data
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"selectedGoals":[{"id":"g1","title":"Goal 1"}]')
      );
    });
  });

  test('should update budget/timeline and save to sessionStorage on updateBudgetTimeline', async () => {
    const sessionId = 'test-session-update-budget';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);

    let dispatch;
    const TestComponentWithAction = () => {
      const { assessment, dispatch } = useAssessment();
      dispatch = dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const newBudget = { budget: '10k', timeline: '6m', priority: 'high' };
    act(() => {
      dispatch({ type: 'UPDATE_BUDGET_TIMELINE', payload: newBudget });
    });

    // Check if save was called with updated data
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"budgetTimeline":{"budget":"10k","timeline":"6m","priority":"high"}')
      );
    });
  });

   test('should update current page and save to sessionStorage on goToPage', async () => {
    const sessionId = 'test-session-goto-page';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);

    let dispatch;
    const TestComponentWithAction = () => {
      const { assessment, dispatch } = useAssessment();
      dispatch = dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');

    act(() => {
      dispatch({ type: 'GO_TO_PAGE', payload: 'security' });
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-step')).toHaveTextContent('security');
    });

    // Check if save was called with updated data
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"currentStep":"security"')
      );
    });
  });

  test('should reset state and save to sessionStorage on resetAssessment', async () => {
    const sessionId = 'test-session-reset';
    const initialState = { currentStep: 'demographics', organization: { industry: '', companySize: '', role: '' }, journeyStatus: { type: '', description: '' }, errors: null };
    mockSessionStorage.setItem('assessmentSessionId', sessionId);
    mockSessionStorage.setItem(`assessmentState_${sessionId}`, JSON.stringify(initialState));

    let dispatch;
    const TestComponentWithAction = () => {
      const { assessment, dispatch } = useAssessment();
      dispatch = dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Verify initial loaded state
    expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
    expect(screen.getByTestId('organization')).toHaveTextContent(JSON.stringify(initialState.organization));
    expect(screen.getByTestId('journey-status')).toHaveTextContent(JSON.stringify(initialState.journeyStatus));
    expect(screen.getByTestId('errors')).toHaveTextContent(JSON.stringify(initialState.errors));

    act(() => {
      dispatch({ type: 'RESET_ASSESSMENT' });
    });

    // Check reset state
    await waitFor(() => {
      expect(screen.getByTestId('current-step')).toHaveTextContent('demographics');
      expect(screen.getByTestId('organization')).toHaveTextContent(JSON.stringify({
        industry: '',
        companySize: '',
        role: ''
      }));
      expect(screen.getByTestId('journey-status')).toHaveTextContent(JSON.stringify({
        type: '',
        description: ''
      }));
      expect(screen.getByTestId('errors')).toHaveTextContent('null');
    });

    // Check if reset state was saved
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"currentStep":"demographics","organization":{"industry":"","companySize":"","role":""},"journeyStatus":{"type":"","description":""},"errors":null') // Check default state values
      );
    });
  });

});