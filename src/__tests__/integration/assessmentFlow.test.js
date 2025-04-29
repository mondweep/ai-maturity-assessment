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

describe('Assessment Flow Integration', () => {
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
    
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByText(/industry is required/i)).toBeInTheDocument();
      expect(screen.getByText(/company size is required/i)).toBeInTheDocument();
      expect(screen.getByText(/role is required/i)).toBeInTheDocument();
    });
  });

  test('completes full assessment flow', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });

    // Step 1: Demographics
    expect(screen.getByTestId('step-content-demographics')).toBeInTheDocument();
    
    // Fill demographics
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '51-200' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Navigate to next step
    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);
    
    // Step 2: Security
    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar.querySelector('.progress')).toHaveStyle({ width: '50%' });
    });
    
    // Navigate back to demographics
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('step-content-demographics')).toBeInTheDocument();
      const progressBar = screen.getByTestId('progress-bar');
      expect(progressBar.querySelector('.progress')).toHaveStyle({ width: '25%' });
    });
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
    expect(demographicsStep).toHaveClass('complete');
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

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
      const demographicsStep = screen.getByTestId('step-indicator-demographics');
      expect(demographicsStep).toHaveClass('complete');
    });
  });
}); 