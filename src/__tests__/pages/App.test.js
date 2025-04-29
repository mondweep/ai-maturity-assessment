import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../../App';
import { AssessmentProvider } from '../../context/AssessmentContext';

// Use the global renderWithProvider from setupTests.js
const { renderWithProvider } = global;

describe('App Component', () => {
  test('renders the application with provider', () => {
    renderWithProvider(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  test('renders the initial assessment page', () => {
    renderWithProvider(<App />);
    expect(screen.getByRole('heading', { name: /Welcome to the AI Maturity Assessment/i })).toBeInTheDocument();
  });

  test('renders the assessment progress indicator', () => {
    renderWithProvider(<App />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders the assessment navigation', () => {
    renderWithProvider(<App />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('renders the assessment content area', () => {
    renderWithProvider(<App />);
    expect(screen.getByRole('region', { name: /assessment content/i })).toBeInTheDocument();
  });
}); 