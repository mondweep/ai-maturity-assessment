import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../scripts/main'; // Assuming the main application component is exported from main.js

describe('Navigation', () => {
  test('renders the initial assessment page', () => {
    render(<App />);
    // Assuming the initial page has a specific heading or text
    expect(screen.getByText(/Welcome to the AI Maturity Assessment/i)).toBeInTheDocument();
  });
});