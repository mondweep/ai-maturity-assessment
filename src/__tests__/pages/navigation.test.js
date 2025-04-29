import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { renderWithContext } from '../../__mocks__/testUtilsMock';
import AssessmentFlow from '../../components/AssessmentFlow';

describe('Assessment Navigation Flow', () => {
  // Test initial render
  test('renders demographics page initially', () => {
    renderWithContext(<AssessmentFlow />);
    expect(screen.getByTestId('step-demographics')).toBeInTheDocument();
  });

  // Test navigation between steps
  test('navigates through steps correctly', async () => {
    renderWithContext(<AssessmentFlow />);
    
    // Fill demographics
    const industrySelect = screen.getByLabelText('What industry is your organization in?');
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    
    const companySizeSelect = screen.getByLabelText('What is your company size?');
    fireEvent.change(companySizeSelect, { target: { value: '51-200' } });
    
    const roleSelect = screen.getByLabelText('What is your role?');
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    // Navigate to next step
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    // Verify we're on the journey status step
    expect(screen.getByTestId('step-journey-status')).toBeInTheDocument();
    
    // Select journey status
    const journeyTypeSelect = screen.getByLabelText('Select your current AI journey status:');
    fireEvent.change(journeyTypeSelect, { target: { value: 'exploring' } });
    
    // Navigate to next step
    fireEvent.click(nextButton);
    
    // Verify we're on the budget step
    expect(screen.getByTestId('step-budget')).toBeInTheDocument();
    
    // Fill budget info
    const budgetSelect = screen.getByLabelText('What is your budget range?');
    fireEvent.change(budgetSelect, { target: { value: 'medium' } });
    
    const timelineSelect = screen.getByLabelText('What is your implementation timeline?');
    fireEvent.change(timelineSelect, { target: { value: 'medium' } });
    
    // Navigate to results
    fireEvent.click(nextButton);
    
    // Verify results page
    expect(screen.getByTestId('step-results')).toBeInTheDocument();
  });

  // Test validation
  test('prevents navigation if required fields are missing', () => {
    renderWithContext(<AssessmentFlow />);
    
    // Try to navigate without filling required fields
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    // Should show error message
    expect(screen.getByTestId('error-message')).toBeInTheDocument();
  });

  // Test back navigation
  test('navigates back correctly', () => {
    renderWithContext(<AssessmentFlow />);
    
    // Fill demographics and navigate forward
    const industrySelect = screen.getByLabelText('What industry is your organization in?');
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    
    const companySizeSelect = screen.getByLabelText('What is your company size?');
    fireEvent.change(companySizeSelect, { target: { value: '51-200' } });
    
    const roleSelect = screen.getByLabelText('What is your role?');
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    // Navigate back
    const backButton = screen.getByTestId('back-button');
    fireEvent.click(backButton);
    
    // Should be back on demographics
    expect(screen.getByTestId('step-demographics')).toBeInTheDocument();
  });

  // Test progress indicator
  test('updates progress indicator correctly', () => {
    renderWithContext(<AssessmentFlow />);
    
    // Check initial progress
    const progressBar = screen.getByTestId('progress-bar');
    expect(progressBar).toHaveStyle({ width: '25%' });
    
    // Fill demographics and navigate forward
    const industrySelect = screen.getByLabelText('What industry is your organization in?');
    fireEvent.change(industrySelect, { target: { value: 'technology' } });
    
    const companySizeSelect = screen.getByLabelText('What is your company size?');
    fireEvent.change(companySizeSelect, { target: { value: '51-200' } });
    
    const roleSelect = screen.getByLabelText('What is your role?');
    fireEvent.change(roleSelect, { target: { value: 'CTO' } });
    
    const nextButton = screen.getByTestId('next-button');
    fireEvent.click(nextButton);
    
    // Check updated progress
    expect(progressBar).toHaveStyle({ width: '50%' });
  });
}); 