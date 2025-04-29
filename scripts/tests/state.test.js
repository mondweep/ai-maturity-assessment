import { saveResponse, getResponse } from '../state.js';

describe('State Management', () => {
  beforeEach(() => {
    // Clear local storage before each test
    localStorage.clear();
  });

  test('should save and retrieve a user response', () => {
    const questionId = 'q1';
    const response = 'answer1';
    saveResponse(questionId, response);
    const retrievedResponse = getResponse(questionId);
    expect(retrievedResponse).toBe(response);
  });
});
