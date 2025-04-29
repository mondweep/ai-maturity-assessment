// Mock Test Setup
import '@testing-library/jest-dom';
import { mockAssessmentContext } from './assessmentContextMock';
import { mockScoringEngine } from './scoringEngineMock';
import { mockValidationEngine } from './validationEngineMock';
import { mockPersistenceEngine } from './persistenceEngineMock';
import { mockAssessmentFlow } from './assessmentFlowMock';
import { testHelpers } from './testUtilsMock';

// Mock global objects
global.console = {
  ...console,
  log: jest.fn(),
  error: jest.fn(),
  warn: jest.fn()
};

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
global.sessionStorage = sessionStorageMock;

// Mock fetch
global.fetch = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock window.scrollTo
window.scrollTo = jest.fn();

// Mock window.location
delete window.location;
window.location = {
  href: '',
  reload: jest.fn()
};

// Mock window.history
window.history.pushState = jest.fn();
window.history.replaceState = jest.fn();

// Mock window.requestAnimationFrame
window.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 0));

// Mock window.cancelAnimationFrame
window.cancelAnimationFrame = jest.fn();

// Mock window.getComputedStyle
window.getComputedStyle = jest.fn(() => ({
  getPropertyValue: jest.fn()
}));

// Mock window.getBoundingClientRect
Element.prototype.getBoundingClientRect = jest.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100
}));

// Mock window.scrollIntoView
Element.prototype.scrollIntoView = jest.fn();

// Mock window.focus
Element.prototype.focus = jest.fn();

// Mock window.blur
Element.prototype.blur = jest.fn();

// Mock window.click
Element.prototype.click = jest.fn();

// Mock window.select
Element.prototype.select = jest.fn();

// Mock window.setSelectionRange
Element.prototype.setSelectionRange = jest.fn();

// Mock window.createRange
window.createRange = jest.fn(() => ({
  setStart: jest.fn(),
  setEnd: jest.fn(),
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document
  }
}));

// Mock window.getSelection
window.getSelection = jest.fn(() => ({
  removeAllRanges: jest.fn(),
  addRange: jest.fn()
}));

// Mock window.URL
window.URL.createObjectURL = jest.fn();
window.URL.revokeObjectURL = jest.fn();

// Mock window.FileReader
window.FileReader = jest.fn(() => ({
  readAsDataURL: jest.fn(),
  readAsText: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  abort: jest.fn(),
  onload: null,
  onerror: null,
  onabort: null,
  onprogress: null,
  result: null,
  error: null,
  readyState: 0
}));

// Mock window.Blob
window.Blob = jest.fn();

// Mock window.FormData
window.FormData = jest.fn(() => ({
  append: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
  getAll: jest.fn(),
  has: jest.fn(),
  set: jest.fn(),
  forEach: jest.fn()
}));

// Mock window.Headers
window.Headers = jest.fn(() => ({
  append: jest.fn(),
  delete: jest.fn(),
  get: jest.fn(),
  has: jest.fn(),
  set: jest.fn(),
  forEach: jest.fn()
}));

// Mock window.Request
window.Request = jest.fn();

// Mock window.Response
window.Response = jest.fn();

// Mock window.AbortController
window.AbortController = jest.fn(() => ({
  signal: {},
  abort: jest.fn()
}));

// Mock window.AbortSignal
window.AbortSignal = jest.fn();

// Mock window.performance
window.performance = {
  now: jest.fn(),
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
  clearMeasures: jest.fn(),
  getEntriesByType: jest.fn(),
  getEntriesByName: jest.fn()
};

// Mock window.performance.timing
window.performance.timing = {
  navigationStart: 0,
  loadEventEnd: 0,
  domComplete: 0,
  domContentLoadedEventEnd: 0,
  domContentLoadedEventStart: 0,
  domInteractive: 0,
  domLoading: 0,
  fetchStart: 0,
  loadEventStart: 0,
  redirectEnd: 0,
  redirectStart: 0,
  requestStart: 0,
  responseEnd: 0,
  responseStart: 0,
  unloadEventEnd: 0,
  unloadEventStart: 0
};

// Mock window.performance.memory
window.performance.memory = {
  jsHeapSizeLimit: 0,
  totalJSHeapSize: 0,
  usedJSHeapSize: 0
};

// Mock window.performance.navigation
window.performance.navigation = {
  type: 0,
  redirectCount: 0,
  toJSON: jest.fn()
};

// Mock window.performance.timeOrigin
window.performance.timeOrigin = 0;

// Mock window.performance.getEntries
window.performance.getEntries = jest.fn();

// Mock window.performance.getEntriesByType
window.performance.getEntriesByType = jest.fn();

// Mock window.performance.getEntriesByName
window.performance.getEntriesByName = jest.fn();

// Mock window.performance.clearResourceTimings
window.performance.clearResourceTimings = jest.fn();

// Mock window.performance.setResourceTimingBufferSize
window.performance.setResourceTimingBufferSize = jest.fn();

// Mock window.performance.mark
window.performance.mark = jest.fn();

// Mock window.performance.clearMarks
window.performance.clearMarks = jest.fn();

// Mock window.performance.measure
window.performance.measure = jest.fn();

// Mock window.performance.clearMeasures
window.performance.clearMeasures = jest.fn();

// Mock window.performance.getEntriesByType
window.performance.getEntriesByType = jest.fn();

// Mock window.performance.getEntriesByName
window.performance.getEntriesByName = jest.fn();

// Mock window.performance.getEntries
window.performance.getEntries = jest.fn();

// Mock window.performance.now
window.performance.now = jest.fn();

// Mock window.performance.timeOrigin
window.performance.timeOrigin = 0;

// Mock window.performance.toJSON
window.performance.toJSON = jest.fn();

// Mock window.performance.timing
window.performance.timing = {
  navigationStart: 0,
  loadEventEnd: 0,
  domComplete: 0,
  domContentLoadedEventEnd: 0,
  domContentLoadedEventStart: 0,
  domInteractive: 0,
  domLoading: 0,
  fetchStart: 0,
  loadEventStart: 0,
  redirectEnd: 0,
  redirectStart: 0,
  requestStart: 0,
  responseEnd: 0,
  responseStart: 0,
  unloadEventEnd: 0,
  unloadEventStart: 0
};

// Mock window.performance.memory
window.performance.memory = {
  jsHeapSizeLimit: 0,
  totalJSHeapSize: 0,
  usedJSHeapSize: 0
};

// Mock window.performance.navigation
window.performance.navigation = {
  type: 0,
  redirectCount: 0,
  toJSON: jest.fn()
};

// Mock window.performance.timeOrigin
window.performance.timeOrigin = 0;

// Mock window.performance.getEntries
window.performance.getEntries = jest.fn();

// Mock window.performance.getEntriesByType
window.performance.getEntriesByType = jest.fn();

// Mock window.performance.getEntriesByName
window.performance.getEntriesByName = jest.fn();

// Mock window.performance.clearResourceTimings
window.performance.clearResourceTimings = jest.fn();

// Mock window.performance.setResourceTimingBufferSize
window.performance.setResourceTimingBufferSize = jest.fn();

// Mock window.performance.mark
window.performance.mark = jest.fn();

// Mock window.performance.clearMarks
window.performance.clearMarks = jest.fn();

// Mock window.performance.measure
window.performance.measure = jest.fn();

// Mock window.performance.clearMeasures
window.performance.clearMeasures = jest.fn();

// Mock window.performance.getEntriesByType
window.performance.getEntriesByType = jest.fn();

// Mock window.performance.getEntriesByName
window.performance.getEntriesByName = jest.fn();

// Mock window.performance.getEntries
window.performance.getEntries = jest.fn();

// Mock window.performance.now
window.performance.now = jest.fn();

// Mock window.performance.timeOrigin
window.performance.timeOrigin = 0;

// Mock window.performance.toJSON
window.performance.toJSON = jest.fn(); 