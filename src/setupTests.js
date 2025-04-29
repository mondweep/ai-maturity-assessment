// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { AssessmentProvider } from './context/AssessmentContext';
import React from 'react';

// Mock sessionStorage
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Reset mocks before each test
beforeEach(() => {
  mockSessionStorage.clear();
  jest.clearAllMocks();
});

// Global test utilities
global.renderWithProvider = (ui) => {
  return render(
    <AssessmentProvider>
      {ui}
    </AssessmentProvider>
  );
}; 