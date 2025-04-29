import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssessmentProvider } from '../../context/AssessmentContext';
import AssessmentFlow from '../../components/AssessmentFlow';

const renderWithProvider = (ui, { initialState = {} } = {}) => {
  return render(
    <AssessmentProvider initialState={initialState}>
      {ui}
    </AssessmentProvider>
  );
};

describe('AssessmentFlow', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  const defaultState = {
    currentStep: 'demographics',
    errors: {},
    organization: {
      industry: '',
      companySize: '',
      role: ''
    },
    journeyStatus: {
      type: 'not_started',
      description: '',
      completedSteps: []
    }
  };

  test('renders demographics step by default', () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    expect(screen.getByTestId('step-content-demographics')).toBeInTheDocument();
  });

  test('shows progress bar with correct width', () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar.querySelector('.progress')).toHaveStyle({ width: '25%' });
  });

  test('shows validation errors when submitting empty form', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/industry is required/i)).toBeInTheDocument();
      expect(screen.getByText(/company size is required/i)).toBeInTheDocument();
      expect(screen.getByText(/role is required/i)).toBeInTheDocument();
    });
  });

  test('allows navigation between steps', async () => {
    renderWithProvider(<AssessmentFlow />, {
      initialState: {
        ...defaultState,
        currentStep: 'security',
        organization: {
          industry: 'technology',
          companySize: '1-50',
          role: 'CTO'
        },
        journeyStatus: {
          type: 'in_progress',
          description: '',
          completedSteps: ['demographics']
        }
      }
    });

    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    expect(screen.getByTestId('step-content-demographics')).toBeInTheDocument();
  });

  test('marks steps as complete when finished', async () => {
    renderWithProvider(<AssessmentFlow />, {
      initialState: {
        ...defaultState,
        organization: {
          industry: 'technology',
          companySize: '1-50',
          role: 'CTO'
        },
        journeyStatus: {
          type: 'in_progress',
          description: 'Demographics completed',
          completedSteps: ['demographics']
        }
      }
    });

    const demographicsStep = screen.getByTestId('step-indicator-demographics');
    expect(demographicsStep).toHaveClass('step complete');
  });

  test('updates journey status when progressing', async () => {
    renderWithProvider(<AssessmentFlow />, {
      initialState: {
        ...defaultState,
        organization: {
          industry: 'technology',
          companySize: '1-50',
          role: 'CTO'
        }
      }
    });

    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
      const demographicsStep = screen.getByTestId('step-indicator-demographics');
      expect(demographicsStep).toHaveClass('step complete');
    });
  });
}); 