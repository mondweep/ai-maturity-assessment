// Mock API Services
export const mockApi = {
  // Mock data for industries
  industries: [
    { id: 'healthcare', name: 'Healthcare' },
    { id: 'finance', name: 'Finance' },
    { id: 'manufacturing', name: 'Manufacturing' },
    { id: 'retail', name: 'Retail' },
    { id: 'technology', name: 'Technology' }
  ],

  // Mock data for company sizes
  companySizes: [
    { id: '1-50', name: '1-50 employees' },
    { id: '51-200', name: '51-200 employees' },
    { id: '201-1000', name: '201-1000 employees' },
    { id: '1000+', name: '1000+ employees' }
  ],

  // Mock data for journey statuses
  journeyStatuses: [
    { id: 'not-started', name: 'Not Started', description: 'No AI initiatives yet' },
    { id: 'exploring', name: 'Exploring', description: 'Researching AI opportunities' },
    { id: 'implementing', name: 'Implementing', description: 'Active AI implementation' },
    { id: 'scaling', name: 'Scaling', description: 'Expanding AI across organization' }
  ],

  // Mock functions
  saveAssessment: jest.fn().mockResolvedValue({ success: true }),
  loadAssessment: jest.fn().mockResolvedValue(null),
  calculateScore: jest.fn().mockResolvedValue(75),
  generateRecommendations: jest.fn().mockResolvedValue([
    {
      id: 'rec1',
      title: 'Start with Basic Automation',
      description: 'Begin with simple process automation',
      priority: 'high',
      category: 'Technology',
      implementationComplexity: 'Low',
      estimatedTimeframe: '3-6 months',
      potentialImpact: 'Medium',
      relatedGoalIds: ['automate-operations']
    }
  ])
}; 