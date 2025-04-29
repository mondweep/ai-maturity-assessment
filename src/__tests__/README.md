# Test Organization

This directory contains all tests for the AI Maturity Assessment application. Tests are organized by feature and type.

## Directory Structure

```
src/__tests__/
├── components/         # Component-specific tests
├── pages/             # Page-level tests
├── context/           # Context/state management tests
├── utils/             # Utility function tests
├── integration/       # Integration tests
└── e2e/              # End-to-end tests
```

## Test Categories

1. **Unit Tests** (`components/`, `utils/`)
   - Test individual components and functions
   - Focus on isolated functionality
   - Mock dependencies

2. **Integration Tests** (`integration/`)
   - Test component interactions
   - Test data flow between components
   - Test state management

3. **Page Tests** (`pages/`)
   - Test complete page functionality
   - Test navigation flows
   - Test form submissions

4. **Context Tests** (`context/`)
   - Test state management
   - Test data persistence
   - Test state transitions

5. **E2E Tests** (`e2e/`)
   - Test complete user flows
   - Test cross-page interactions
   - Test real user scenarios

## Testing Guidelines

1. **Naming Convention**
   - Test files: `*.test.js` or `*.spec.js`
   - Test suites: `describe('ComponentName', () => {})`
   - Test cases: `test('should do something specific', () => {})`

2. **Test Structure**
   - Arrange: Set up test data and conditions
   - Act: Perform the action being tested
   - Assert: Verify the results

3. **Best Practices**
   - One assertion per test when possible
   - Use meaningful test descriptions
   - Mock external dependencies
   - Clean up after tests
   - Use test utilities from `setupTests.js`

4. **Coverage Requirements**
   - Minimum 80% coverage for all metrics
   - Focus on critical paths
   - Include edge cases
   - Test error conditions

## Running Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- path/to/test.js

# Run tests in watch mode
npm test -- --watch
``` 