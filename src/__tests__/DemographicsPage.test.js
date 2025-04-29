import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AssessmentProvider } from '../context/AssessmentContext';
import DemographicsPage from '../pages/DemographicsPage';

const mockOnNext = jest.fn();

const defaultState = {
  currentStep: 'demographics',
  organization: {
    industry: '',
    companySize: '',
    role: ''
  },
  errors: {},
  journeyStatus: {
    type: 'not_started',
    description: '',
    demographics: 'incomplete',
    assessment: 'incomplete',
    results: 'incomplete',
    recommendations: 'incomplete',
    completedSteps: []
  }
};

const renderWithProvider = (ui, { initialState = defaultState } = {}) => {
  window.sessionStorage.clear();
  window.sessionStorage.setItem('assessment', JSON.stringify(initialState));
  
  return render(
    <AssessmentProvider initialState={initialState}>
      {ui}
    </AssessmentProvider>
  );
};

describe('DemographicsPage', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  test('renders demographics form correctly', () => {
    renderWithProvider(<DemographicsPage onNext={mockOnNext} />);
    
    expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/company size/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/role/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  test('validates form inputs correctly', async () => {
    renderWithProvider(<DemographicsPage onNext={mockOnNext} />);
    
    const form = screen.getByTestId('step-demographics').querySelector('form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(screen.getByText('Invalid industry selection')).toBeInTheDocument();
      expect(screen.getByText('Invalid company size selection')).toBeInTheDocument();
      expect(screen.getByText('Invalid role selection')).toBeInTheDocument();
    });
    
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  test('submits form with valid data', async () => {
    renderWithProvider(<DemographicsPage onNext={mockOnNext} />);
    
    const form = screen.getByTestId('step-demographics').querySelector('form');
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '51-200' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    fireEvent.submit(form);
    
    await waitFor(() => {
      const storedState = JSON.parse(window.sessionStorage.getItem('assessment'));
      expect(storedState.organization).toEqual({
        industry: 'technology',
        companySize: '51-200',
        role: 'CTO'
      });
      expect(storedState.journeyStatus.demographics).toBe('complete');
      expect(storedState.journeyStatus.completedSteps).toContain('demographics');
      expect(mockOnNext).toHaveBeenCalled();
    });
  });

  test('persists form state correctly', () => {
    const initialState = {
      ...defaultState,
      organization: {
        industry: 'technology',
        companySize: '51-200',
        role: 'CTO'
      }
    };
    
    renderWithProvider(<DemographicsPage onNext={mockOnNext} />, { initialState });
    
    expect(screen.getByLabelText(/industry/i)).toHaveValue('technology');
    expect(screen.getByLabelText(/company size/i)).toHaveValue('51-200');
    expect(screen.getByLabelText(/role/i)).toHaveValue('CTO');
  });

  test('handles errors correctly', () => {
    const initialState = {
      ...defaultState,
      errors: {
        industry: 'Invalid industry selection',
        companySize: 'Invalid company size selection',
        role: 'Invalid role selection'
      }
    };
    
    renderWithProvider(<DemographicsPage onNext={mockOnNext} />, { initialState });
    
    const errorMessages = screen.getAllByRole('alert');
    expect(errorMessages).toHaveLength(3);
    expect(errorMessages[0]).toHaveTextContent('Invalid industry selection');
    expect(errorMessages[1]).toHaveTextContent('Invalid company size selection');
    expect(errorMessages[2]).toHaveTextContent('Invalid role selection');
  });

  test('updates journey status on successful submission', async () => {
    renderWithProvider(<DemographicsPage onNext={mockOnNext} />);
    
    const form = screen.getByTestId('step-demographics').querySelector('form');
    const industrySelect = screen.getByLabelText(/industry/i);
    const companySizeSelect = screen.getByLabelText(/company size/i);
    const roleSelect = screen.getByLabelText(/role/i);
    
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    fireEvent.change(companySizeSelect, { target: { value: '51-200' } });
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    fireEvent.submit(form);
    
    await waitFor(() => {
      const storedState = JSON.parse(window.sessionStorage.getItem('assessment'));
      expect(storedState.journeyStatus.demographics).toBe('complete');
      expect(storedState.currentStep).toBe('security');
      expect(storedState.journeyStatus.type).toBe('in_progress');
      expect(storedState.journeyStatus.completedSteps).toContain('demographics');
      expect(mockOnNext).toHaveBeenCalled();
    });
  });
}); 