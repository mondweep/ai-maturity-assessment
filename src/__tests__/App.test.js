import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';
import { AssessmentProvider } from '../context/AssessmentContext';

describe('AI Maturity Assessment Application', () => {
  test('renders the initial assessment page', () => {
    render(
      <AssessmentProvider>
        <App />
      </AssessmentProvider>
    );
    // Check for initial page content
    expect(screen.getByTestId('assessment-container')).toBeInTheDocument();
  });
});