import { render, screen } from '@testing-library/jsdom';
import '@testing-library/jest-dom';
import { navigateTo } from '../scripts/main.js'; // Assuming navigateTo is in main.js

describe('App Navigation', () => {
  test('should navigate to the first assessment page on load', () => {
    // Mock the DOM environment
    document.body.innerHTML = `
      <div id="app">
        <div id="page-home">Home Page</div>
        <div id="page-assessment-1" style="display: none;">Assessment Page 1</div>
      </div>
    `;

    // Call the navigation function (assuming it's triggered on load or a specific event)
    // For now, we'll call it directly to test the logic
    navigateTo('assessment-1');

    // Assert that the home page is hidden and the first assessment page is visible
    expect(screen.getByText('Home Page')).not.toBeVisible();
    expect(screen.getByText('Assessment Page 1')).toBeVisible();
  });
});