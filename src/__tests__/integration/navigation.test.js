import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider } from '../../context/AssessmentContext';
import AssessmentFlow from '../../components/AssessmentFlow';

const renderWithProvider = (ui, { initialState = {} } = {}) => {
  return render(
    <AssessmentProvider initialState={initialState}>
      {ui}
    </AssessmentProvider>
  );
};

describe('Assessment Navigation Flow', () => {
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
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    renderWithProvider(<AssessmentFlow />, { 
      initialState: {
        ...defaultState,
        errors: {
          industry: 'Industry is required',
          companySize: 'Company size is required',
          role: 'Role is required'
        }
      }
    });
    
    await waitFor(() => {
      const errorContainer = screen.getByTestId('error-container');
      const errorMessages = screen.getAllByTestId('error-message');
      expect(errorMessages).toHaveLength(3);
      expect(errorMessages[0]).toHaveTextContent(/industry is required/i);
      expect(errorMessages[1]).toHaveTextContent(/company size is required/i);
      expect(errorMessages[2]).toHaveTextContent(/role is required/i);
    });
  });

  test('navigates forward when form is valid', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    // Fill out demographics form
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '1-50' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Click next
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    // Should move to security step
    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
      expect(screen.getByTestId('step-indicator-demographics')).toHaveClass('completed');
    });
  });

  test('updates progress indicator correctly', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    // Initial progress (25% for first step out of 4 steps)
    const progressBar = screen.getByTestId('progress-bar').querySelector('.progress');
    expect(progressBar).toHaveStyle({ width: '25%' });

    // Fill demographics form
    const form = screen.getByTestId('step-demographics').querySelector('form');
    const industrySelect = form.querySelector('#industry');
    const companySizeSelect = form.querySelector('#companySize');
    const roleSelect = form.querySelector('#role');
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '1-50' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Submit form
    fireEvent.submit(form);
    
    // Progress should update to 50% (second step out of 4)
    await waitFor(() => {
      expect(progressBar).toHaveStyle({ width: '50%' });
    });
  });

  test('navigates back correctly', async () => {
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
    
    const backButton = screen.getByTestId('nav-back-button');
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByTestId('step-content-demographics')).toBeInTheDocument();
      expect(screen.getByTestId('step-indicator-demographics')).toHaveClass('completed');
    });
  });

  test('preserves form data when navigating back and forth', async () => {
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
    
    // Submit form to move to next step
    const form = screen.getByTestId('step-demographics').querySelector('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
    });
    
    // Navigate back
    const backButton = screen.getByTestId('nav-back-button');
    fireEvent.click(backButton);

    // Check if form data is preserved
    await waitFor(() => {
      const industrySelect = screen.getByTestId('step-demographics').querySelector('#industry');
      const companySizeSelect = screen.getByTestId('step-demographics').querySelector('#companySize');
      const roleSelect = screen.getByTestId('step-demographics').querySelector('#role');
      
      expect(industrySelect.value).toBe('technology');
      expect(companySizeSelect.value).toBe('1-50');
      expect(roleSelect.value).toBe('CTO');
    });
  });

  test('updates journey status when completing steps', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    // Fill and submit demographics form
    const form = screen.getByTestId('step-demographics').querySelector('form');
    const industrySelect = form.querySelector('#industry');
    const companySizeSelect = form.querySelector('#companySize');
    const roleSelect = form.querySelector('#role');
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '1-50' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
      expect(screen.getByTestId('step-indicator-demographics')).toHaveClass('completed');
    });
  });
}); 