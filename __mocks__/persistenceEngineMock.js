// Mock Persistence Engine
export const mockPersistenceEngine = {
  // Mock storage
  storage: new Map(),

  // Mock storage keys
  storageKeys: {
    assessmentState: 'aiMaturityAssessment',
    sessionId: 'aiMaturitySessionId'
  },

  // Mock persistence functions
  saveAssessment: jest.fn().mockImplementation((assessment) => {
    try {
      mockPersistenceEngine.storage.set(
        mockPersistenceEngine.storageKeys.assessmentState,
        JSON.stringify(assessment)
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving assessment:', error);
      return { success: false, error };
    }
  }),

  loadAssessment: jest.fn().mockImplementation(() => {
    try {
      const savedAssessment = mockPersistenceEngine.storage.get(
        mockPersistenceEngine.storageKeys.assessmentState
      );
      return savedAssessment ? JSON.parse(savedAssessment) : null;
    } catch (error) {
      console.error('Error loading assessment:', error);
      return null;
    }
  }),

  clearAssessment: jest.fn().mockImplementation(() => {
    try {
      mockPersistenceEngine.storage.delete(
        mockPersistenceEngine.storageKeys.assessmentState
      );
      return { success: true };
    } catch (error) {
      console.error('Error clearing assessment:', error);
      return { success: false, error };
    }
  }),

  saveSessionId: jest.fn().mockImplementation((sessionId) => {
    try {
      mockPersistenceEngine.storage.set(
        mockPersistenceEngine.storageKeys.sessionId,
        sessionId
      );
      return { success: true };
    } catch (error) {
      console.error('Error saving session ID:', error);
      return { success: false, error };
    }
  }),

  loadSessionId: jest.fn().mockImplementation(() => {
    try {
      return mockPersistenceEngine.storage.get(
        mockPersistenceEngine.storageKeys.sessionId
      ) || null;
    } catch (error) {
      console.error('Error loading session ID:', error);
      return null;
    }
  }),

  clearSessionId: jest.fn().mockImplementation(() => {
    try {
      mockPersistenceEngine.storage.delete(
        mockPersistenceEngine.storageKeys.sessionId
      );
      return { success: true };
    } catch (error) {
      console.error('Error clearing session ID:', error);
      return { success: false, error };
    }
  }),

  // Mock storage event handlers
  handleStorageEvent: jest.fn().mockImplementation((event) => {
    if (event.key === mockPersistenceEngine.storageKeys.assessmentState) {
      // Handle assessment state change
      return true;
    }
    return false;
  }),

  // Mock storage availability check
  isStorageAvailable: jest.fn().mockImplementation(() => {
    try {
      const testKey = '__storage_test__';
      mockPersistenceEngine.storage.set(testKey, testKey);
      mockPersistenceEngine.storage.delete(testKey);
      return true;
    } catch (error) {
      return false;
    }
  })
}; 