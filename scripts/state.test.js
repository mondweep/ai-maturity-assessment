import { saveResponse, getResponse } from './state.js';

describe('State Management', () => {
  test('should save and retrieve a user response', () => {
    const questionId = 'q1';
    const response = 'answer1';
    saveResponse(questionId, response);
    const retrievedResponse = getResponse(questionId);
    expect(retrievedResponse).toBe(response);
  });
});
