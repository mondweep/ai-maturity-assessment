import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App'; // Assuming the main component is App.js

describe('AI Maturity Assessment Application', () => {
  test('renders the initial assessment page', () => {
    render(<App />);
    // This test will fail because the App component and its content don't exist yet.
    // We expect to find a heading or some text from the first page.
    // Replace with actual text from the first page once implemented.
    expect(screen.getByText(/Welcome to the AI Maturity Assessment/i)).toBeInTheDocument();
  });
});