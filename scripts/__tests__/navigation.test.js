import { screen, fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

// Mock the initial HTML structure (assuming a basic setup with navigation buttons)
document.body.innerHTML = `
  <div id="page-1">Page 1 Content</div>
  <div id="page-2" style="display: none;">Page 2 Content</div>
  <button id="next-button">Next</button>
`;

describe('Assessment Navigation', () => {
  test('should navigate from page 1 to page 2 when clicking next', () => {
    const page1 = screen.getByText('Page 1 Content');
    const page2 = screen.getByText('Page 2 Content');
    const nextButton = screen.getByRole('button', { name: /Next/i });

    // Initially, only page 1 should be visible
    expect(page1).toBeVisible();
    expect(page2).not.toBeVisible();

    // Simulate click on the next button
    fireEvent.click(nextButton);

    // After clicking next, page 1 should be hidden and page 2 should be visible
    expect(page1).not.toBeVisible();
    expect(page2).toBeVisible();
  });
});