module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  // Add any other Jest configurations needed for your project
  // For example, moduleNameMapper: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  //   '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
   // },
  transform: {
    '^.+\\.js$': 'babel-jest', // If using Babel
  },
  roots: ['<rootDir>/ai-maturity-assessment'],
  testMatch: [
    '<rootDir>/ai-maturity-assessment/**/*.test.js'
  ],
  modulePathIgnorePatterns: [
    '<rootDir>/.vscode/extensions',
    '<rootDir>/.npm',
    '<rootDir>/Downloads',
    '<rootDir>/.cursor',
    '<rootDir>/.windsurf',
    '<rootDir>/Library/Unity',
    '<rootDir>/CRM',
    '<rootDir>/Codex-MCP',
    '<rootDir>/DxSure/AI-Discovery',
    '<rootDir>/DxSure/DCC',
    '<rootDir>/SocialMediaPostApp',
    '<rootDir>/Documents/GitHub',
    '<rootDir>/Documents/LearningReact',
    '<rootDir>/seldon-server',
    '<rootDir>/seldon',
    '<rootDir>/bridgeconnectbiz-code',
    '<rootDir>/Documents/weather-station-gcp-mongoose-os-master',
    '<rootDir>/Documents/GitHub/weather-station-gcp-mongoose-os',
    '<rootDir>/.nvm/test/fast/Unit tests/mocks/project_dirs/nested-both/package.json',
    '<rootDir>/.nvm/test/fast/Unit tests/mocks/project_dirs/nested-pkg/package.json',
    '<rootDir>/.nvm/test/fast/Unit tests/mocks/project_dirs/no-nesting-pkg/package.json'
  ]
  // collectCoverage: true,
  // coverageDirectory: 'coverage',
  // coverageReporters: ['json', 'lcov', text, clover],
};
