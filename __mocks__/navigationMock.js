// Mock Navigation and Routing
import React from 'react';

// Mock useNavigate hook
export const mockUseNavigate = () => {
  const navigate = jest.fn();
  return navigate;
};

// Mock useLocation hook
export const mockUseLocation = () => ({
  pathname: '/demographics',
  search: '',
  hash: '',
  state: null
});

// Mock useParams hook
export const mockUseParams = () => ({});

// Mock useRouteMatch hook
export const mockUseRouteMatch = () => ({
  path: '/',
  url: '/',
  params: {},
  isExact: true
});

// Mock Router component
export const MockRouter = ({ children }) => (
  <div data-testid="router">{children}</div>
);

// Mock Route component
export const MockRoute = ({ path, component: Component }) => (
  <div data-testid={`route-${path}`}>
    <Component />
  </div>
);

// Mock Link component
export const MockLink = ({ to, children }) => (
  <a href={to} data-testid={`link-${to}`}>
    {children}
  </a>
);

// Mock navigation steps
export const navigationSteps = [
  { id: 'demographics', path: '/demographics', label: 'Company Info' },
  { id: 'journey-status', path: '/journey-status', label: 'AI Journey' },
  { id: 'journey-questions', path: '/journey-questions', label: 'Current Status' },
  { id: 'goals-selection', path: '/goals-selection', label: 'Goals' },
  { id: 'qualifying-questions', path: '/qualifying-questions', label: 'Details' },
  { id: 'budget-info', path: '/budget-info', label: 'Budget' },
  { id: 'results', path: '/results', label: 'Results' }
]; 