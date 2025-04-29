// Mock Test Utilities
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { mockAssessmentContext } from './assessmentContextMock';
import { mockScoringEngine } from './scoringEngineMock';
import { mockValidationEngine } from './validationEngineMock';
import { mockPersistenceEngine } from './persistenceEngineMock';

// Mock wrapper component for testing with context
export const MockContextWrapper = ({ children }) => (
  <div data-testid="mock-context-wrapper">
    {children}
  </div>
);

// Mock render function with context
export const renderWithContext = (ui, { contextValue = mockAssessmentContext, ...options } = {}) => {
  return render(ui, {
    wrapper: ({ children }) => (
      <MockContextWrapper>
        {children}
      </MockContextWrapper>
    ),
    ...options
  });
};

// Mock test data
export const mockTestData = {
  // Mock assessment state
  assessment: {
    currentStep: 'demographics',
    organization: {
      industry: 'technology',
      companySize: '51-200'
    },
    journeyStatus: {
      type: 'exploring',
      responses: {}
    },
    selectedGoals: [
      {
        id: 'automate-operations',
        title: 'Automate Operations',
        priority: 'high'
      }
    ],
    budgetTimeline: {
      budget: 'medium',
      timeline: 'medium',
      priority: 'medium'
    }
  },

  // Mock user interactions
  userInteractions: {
    selectOption: (element, value) => {
      fireEvent.change(element, { target: { value } });
    },
    clickButton: (element) => {
      fireEvent.click(element);
    },
    typeText: (element, text) => {
      fireEvent.change(element, { target: { value: text } });
    }
  },

  // Mock validation results
  validationResults: {
    valid: {
      isValid: true,
      errors: {}
    },
    invalid: {
      isValid: false,
      errors: {
        field: 'Error message'
      }
    }
  },

  // Mock scoring results
  scoringResults: {
    score: 75,
    maturityLevel: 'intermediate',
    recommendations: [
      {
        id: 'rec1',
        title: 'Start with Basic Automation',
        description: 'Begin with simple process automation',
        priority: 'high'
      }
    ]
  }
};

// Mock test helpers
export const testHelpers = {
  // Mock async function
  mockAsync: (value) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(value);
      }, 0);
    });
  },

  // Mock error function
  mockError: (message) => {
    throw new Error(message);
  },

  // Mock console methods
  mockConsole: {
    log: jest.spyOn(console, 'log').mockImplementation(),
    error: jest.spyOn(console, 'error').mockImplementation(),
    warn: jest.spyOn(console, 'warn').mockImplementation()
  },

  // Mock localStorage
  mockLocalStorage: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  },

  // Mock window methods
  mockWindow: {
    location: {
      href: '',
      reload: jest.fn()
    },
    localStorage: {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    }
  },

  // Mock fetch
  mockFetch: (response) => {
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(response)
      })
    );
  },

  // Mock IntersectionObserver
  mockIntersectionObserver: () => {
    global.IntersectionObserver = class IntersectionObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  },

  // Mock ResizeObserver
  mockResizeObserver: () => {
    global.ResizeObserver = class ResizeObserver {
      constructor(callback) {
        this.callback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
};

// Mock test matchers
export const customMatchers = {
  toBeInTheDocument: (element) => {
    return element !== null;
  },
  toHaveValue: (element, value) => {
    return element.value === value;
  },
  toBeDisabled: (element) => {
    return element.disabled;
  },
  toHaveClass: (element, className) => {
    return element.classList.contains(className);
  }
}; 