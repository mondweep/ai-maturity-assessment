import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Assessment Navigation', () => {
  beforeEach(() => {
    // Set up a basic HTML structure for testing
    document.body.innerHTML = `
      <div id="app">
        <div id="page-1" class="assessment-page">
          <h1>Welcome to the Assessment</h1>
          <button id="next-button">Next</button>
        </div>
        <div id="page-2" class="assessment-page" style="display: none;">
          <h1>Question 1</h1>
          <button id="prev-button">Previous</button>
        </div>
      </div>
    `;
  });

  test('should display the first page on load', () => {
    const firstPage = screen.getByText('Welcome to the Assessment');
    expect(firstPage).toBeVisible();
  });
});