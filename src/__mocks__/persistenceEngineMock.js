export const mockPersistenceEngine = {
  saveAssessment: jest.fn().mockResolvedValue(true),
  loadAssessment: jest.fn().mockResolvedValue(null),
  clearAssessment: jest.fn().mockResolvedValue(true),
  saveSessionId: jest.fn().mockImplementation((sessionId) => {
    window.sessionStorage.setItem('sessionId', sessionId);
    return true;
  }),
  loadSessionId: jest.fn().mockImplementation(() => {
    return window.sessionStorage.getItem('sessionId');
  }),
  handleStorageEvent: jest.fn().mockReturnValue(true),
  isStorageAvailable: jest.fn().mockReturnValue(true),
  save: jest.fn().mockResolvedValue(true),
  load: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(true),
  delete: jest.fn().mockResolvedValue(true)
}; 