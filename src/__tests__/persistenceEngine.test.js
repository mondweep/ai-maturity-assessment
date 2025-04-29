import { mockPersistenceEngine } from '../__mocks__/persistenceEngineMock';

describe('Persistence Engine', () => {
  beforeEach(() => {
    window.sessionStorage.clear();
    jest.clearAllMocks();
  });

  test('should save assessment correctly', () => {
    const assessment = {
      currentStep: 'demographics',
      organization: {
        industry: 'technology',
        companySize: '51-200'
      },
      journeyStatus: {
        type: 'exploring',
        responses: {}
      }
    };

    mockPersistenceEngine.saveAssessment(assessment);
    
    expect(window.sessionStorage.getItem('assessmentState'))
      .toBe(JSON.stringify(assessment));
  });

  test('should load assessment correctly', () => {
    const assessment = {
      currentStep: 'demographics',
      organization: {
        industry: 'technology',
        companySize: '51-200'
      }
    };

    window.sessionStorage.setItem('assessmentState', JSON.stringify(assessment));
    
    const loadedAssessment = mockPersistenceEngine.loadAssessment();
    expect(loadedAssessment).toEqual(assessment);
  });

  test('should clear assessment correctly', () => {
    const assessment = {
      currentStep: 'demographics',
      organization: {
        industry: 'technology',
        companySize: '51-200'
      }
    };

    window.sessionStorage.setItem('assessmentState', JSON.stringify(assessment));
    
    mockPersistenceEngine.clearAssessment();
    expect(window.sessionStorage.getItem('assessmentState')).toBeNull();
  });

  test('should manage session ID correctly', () => {
    const sessionId = 'test-session-123';
    
    mockPersistenceEngine.saveSessionId(sessionId);
    expect(window.sessionStorage.getItem('sessionId')).toBe(sessionId);
    
    const loadedSessionId = mockPersistenceEngine.loadSessionId();
    expect(loadedSessionId).toBe(sessionId);
  });

  test('should handle storage events correctly', () => {
    const event = {
      key: 'assessmentState',
      newValue: JSON.stringify({
        currentStep: 'demographics',
        organization: {
          industry: 'technology',
          companySize: '51-200'
        }
      })
    };
    
    const handled = mockPersistenceEngine.handleStorageEvent(event);
    expect(handled).toBe(true);
  });

  test('should check storage availability correctly', () => {
    const isAvailable = mockPersistenceEngine.isStorageAvailable();
    expect(isAvailable).toBe(true);
  });

  test('should handle errors gracefully', () => {
    // Mock storage error
    jest.spyOn(window.sessionStorage, 'setItem')
      .mockImplementationOnce(() => { throw new Error('Storage error'); });

    const assessment = {
      currentStep: 'demographics',
      organization: {
        industry: 'technology',
        companySize: '51-200'
      }
    };

    const result = mockPersistenceEngine.saveAssessment(assessment);
    expect(result).toBe(false);
  });
}); 