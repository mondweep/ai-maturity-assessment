import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider, useAssessmentState } from '../AssessmentContext';
import * as helpers from '../../utils/helpers'; // Import helpers to mock

// Mock the helpers module
jest.mock('../../utils/helpers', () => ({
  generateUniqueId: jest.fn(),
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
const TestComponent = () => {
  const { sessionId, assessmentState, isLoading } = useAssessmentState();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div data-testid="session-id">{sessionId}</div>
      <div data-testid="current-page">{assessmentState.currentPage}</div>
      <div data-testid="answers">{JSON.stringify(assessmentState.answers)}</div>
      <div data-testid="is-complete">{String(assessmentState.isComplete)}</div>
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
    expect(screen.getByTestId('session-id')).toHaveTextContent('test-unique-id');
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
    expect(screen.getByTestId('session-id')).toHaveTextContent('existing-session-id');
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
    expect(screen.getByTestId('current-page')).toHaveTextContent('0');
    expect(screen.getByTestId('answers')).toHaveTextContent('{}');
    expect(screen.getByTestId('is-complete')).toHaveTextContent('false');
    // Check if state was attempted to be loaded for this session
    expect(mockSessionStorage.getItem).toHaveBeenCalledWith('assessmentState_session-without-state');
  });

  test('should load existing state from sessionStorage for the session ID', async () => {
    const existingState = {
      currentPage: 2,
      answers: { q1: 'a', q2: 'b' },
      scores: { category1: 5 },
      maturityLevel: 'Intermediate',
      qualifyingAnswers: { qual1: true },
      isComplete: false,
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
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('answers')).toHaveTextContent(JSON.stringify({ q1: 'a', q2: 'b' }));
    expect(screen.getByTestId('is-complete')).toHaveTextContent('false');
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
    expect(screen.getByTestId('current-page')).toHaveTextContent('0');
    expect(screen.getByTestId('answers')).toHaveTextContent('{}');
    expect(screen.getByTestId('is-complete')).toHaveTextContent('false');

    // Check if the error was logged
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to parse stored assessment state:",
      expect.any(Error)
    );

    consoleErrorSpy.mockRestore(); // Restore console.error
  });
test('should update answers state and save to sessionStorage on updateAnswer', async () => {
  const sessionId = 'test-session-update-answer';
  mockSessionStorage.setItem('assessmentSessionId', sessionId);

  let dispatch;
  const TestComponentWithAction = () => {
    const state = useAssessmentState();
    dispatch = state.dispatch; // Expose dispatch for testing
    return <TestComponent />;
  };

  render(
    <AssessmentProvider>
      <TestComponentWithAction />
    </AssessmentProvider>
  );

  // Wait for initial loading
  await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

  // Initial state check
  expect(screen.getByTestId('answers')).toHaveTextContent('{}');

  // Dispatch updateAnswer action
  act(() => {
    dispatch({ type: 'UPDATE_ANSWER', payload: { questionId: 'q1', answer: 'a' } });
  });

  // Check updated state
  await waitFor(() => {
    expect(screen.getByTestId('answers')).toHaveTextContent(JSON.stringify({ q1: 'a' }));
  });

  // Check if state was saved (debounced function is mocked to run immediately)
  await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"answers":{"q1":"a"}') // Check if the updated state is saved
      );
    });
});

test('should update qualifyingAnswers state and save to sessionStorage on updateQualifyingAnswer', async () => {
  const sessionId = 'test-session-update-qualifying';
  mockSessionStorage.setItem('assessmentSessionId', sessionId);

  let dispatch;
  const TestComponentWithAction = () => {
    const state = useAssessmentState();
    dispatch = state.dispatch; // Expose dispatch for testing
    return <TestComponent />;
  };

  render(
    <AssessmentProvider>
      <TestComponentWithAction />
    </AssessmentProvider>
  );

  // Wait for initial loading
  await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

  // Initial state check
  expect(screen.getByTestId('qualifyingAnswers')).toHaveTextContent('{}');

  // Dispatch updateQualifyingAnswer action
  act(() => {
    dispatch({ type: 'UPDATE_QUALIFYING_ANSWER', payload: { questionId: 'qf1', answer: true } });
  });

  // Check updated state
  await waitFor(() => {
    expect(screen.getByTestId('qualifyingAnswers')).toHaveTextContent(JSON.stringify({ qf1: true }));
  });

  // Check if state was saved
   await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"qualifyingAnswers":{"qf1":true}') // Check if the updated state is saved
      );
    });
});

// Add more tests for goToPage, calculateScores, state saving etc.

  test('should update organization state and save to sessionStorage on updateOrganization', async () => {
    const sessionId = 'test-session-update-org';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);

    let dispatch;
    const TestComponentWithAction = () => {
      const state = useAssessmentState();
      dispatch = state.dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const newOrgData = { industry: 'Tech', companySize: '51-200' };
    act(() => {
      dispatch({ type: 'UPDATE_ORGANIZATION', payload: newOrgData });
    });

    // Check updated state (Need to add organization data to TestComponent or use a different check)
    // For now, just check if save was called with updated data
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"organization":{"industry":"Tech","companySize":"51-200"}')
      );
    });
  });

  test('should update journey status and save to sessionStorage on updateJourneyStatus', async () => {
    const sessionId = 'test-session-update-journey';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);

    let dispatch;
    const TestComponentWithAction = () => {
      const state = useAssessmentState();
      dispatch = state.dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    const newJourneyStatus = { type: 'exploring', responses: { q1: 'yes' } };
    act(() => {
      dispatch({ type: 'UPDATE_JOURNEY_STATUS', payload: newJourneyStatus });
    });

    // Check if save was called with updated data
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"journeyStatus":{"type":"exploring","responses":{"q1":"yes"}}')
      );
    });
  });

  test('should update selected goals and save to sessionStorage on updateSelectedGoals', async () => {
    const sessionId = 'test-session-update-goals';
    mockSessionStorage.setItem('assessmentSessionId', sessionId);

    let dispatch;
    const TestComponentWithAction = () => {
      const state = useAssessmentState();
      dispatch = state.dispatch;
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
      const state = useAssessmentState();
      dispatch = state.dispatch;
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
      const state = useAssessmentState();
      dispatch = state.dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    expect(screen.getByTestId('current-page')).toHaveTextContent('0');

    act(() => {
      dispatch({ type: 'GO_TO_PAGE', payload: 3 });
    });

    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('3');
    });

    // Check if save was called with updated data
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"currentPage":3')
      );
    });
  });

  test('should reset state and save to sessionStorage on resetAssessment', async () => {
    const sessionId = 'test-session-reset';
    const initialState = { currentPage: 2, answers: { q1: 'a' }, isComplete: false };
    mockSessionStorage.setItem('assessmentSessionId', sessionId);
    mockSessionStorage.setItem(`assessmentState_${sessionId}`, JSON.stringify(initialState));


    let dispatch;
    const TestComponentWithAction = () => {
      const state = useAssessmentState();
      dispatch = state.dispatch;
      return <TestComponent />;
    };

    render(
      <AssessmentProvider>
        <TestComponentWithAction />
      </AssessmentProvider>
    );
    await waitFor(() => expect(screen.queryByText('Loading...')).not.toBeInTheDocument());

    // Verify initial loaded state
    expect(screen.getByTestId('current-page')).toHaveTextContent('2');
    expect(screen.getByTestId('answers')).toHaveTextContent(JSON.stringify({ q1: 'a' }));

    act(() => {
      dispatch({ type: 'RESET_ASSESSMENT' });
    });

    // Check reset state
    await waitFor(() => {
      expect(screen.getByTestId('current-page')).toHaveTextContent('0');
      expect(screen.getByTestId('answers')).toHaveTextContent('{}');
      expect(screen.getByTestId('is-complete')).toHaveTextContent('false');
    });

    // Check if reset state was saved
    await waitFor(() => {
      expect(mockSessionStorage.setItem).toHaveBeenCalledWith(
        `assessmentState_${sessionId}`,
        expect.stringContaining('"currentPage":0,"answers":{},"isComplete":false') // Check default state values
      );
    });
  });

});