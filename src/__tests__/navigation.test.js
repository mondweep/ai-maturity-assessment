import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AssessmentProvider } from '../__mocks__/AssessmentContextMock';
import AssessmentFlow from '../components/AssessmentFlow';

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
      const errorMessages = screen.getAllByTestId('error-message');
      expect(errorMessages.length).toBe(3);
      expect(errorMessages[0]).toHaveTextContent(/industry is required/i);
      expect(errorMessages[1]).toHaveTextContent(/company size is required/i);
      expect(errorMessages[2]).toHaveTextContent(/role is required/i);
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
    });
  });

  test('updates progress indicator correctly', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    // Initial progress (25% for first step out of 4 steps)
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar.querySelector('.progress')).toHaveStyle({ width: '25%' });

    // Fill demographics
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '1-50' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Submit form
    const nextButton = screen.getByTestId('nav-next-button');
    fireEvent.click(nextButton);
    
    // Progress should update to 50% (second step out of 4)
    await waitFor(() => {
      expect(progressBar.querySelector('.progress')).toHaveStyle({ width: '50%' });
    });
  });

  test('preserves form data when navigating back and forth', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    // Fill demographics form
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '1-50' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Navigate to next step
    const nextButton = screen.getByTestId('nav-next-button');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
    });
    
    // Navigate back
    const backButton = screen.getByTestId('nav-back-button');
    fireEvent.click(backButton);
    
    // Check if form data is preserved
    await waitFor(() => {
      const industrySelect = screen.getByLabelText(/industry/i);
      const companySizeSelect = screen.getByLabelText(/company size/i);
      const roleSelect = screen.getByLabelText(/role/i);
      
      expect(industrySelect).toHaveValue('technology');
      expect(companySizeSelect).toHaveValue('1-50');
      expect(roleSelect).toHaveValue('CTO');
    });
  });

  test('updates journey status when completing steps', async () => {
    renderWithProvider(<AssessmentFlow />, { initialState: defaultState });
    
    // Fill demographics form
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '1-50' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Navigate to next step
    const nextButton = screen.getByTestId('nav-next-button');
    fireEvent.click(nextButton);
    
    await waitFor(() => {
      expect(screen.getByTestId('step-content-security')).toBeInTheDocument();
      expect(screen.getByTestId('step-indicator-demographics')).toHaveClass('completed');
    });
  });
});