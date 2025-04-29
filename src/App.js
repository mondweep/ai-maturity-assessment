import React from 'react';
import { useAssessment } from './context/AssessmentContext';
import DemographicsPage from './pages/DemographicsPage';
import JourneyStatusPage from './pages/JourneyStatusPage';
import BudgetPage from './pages/BudgetPage';
import ResultsPage from './pages/ResultsPage';

function App() {
  const { assessment } = useAssessment();
  const { currentStep = 'demographics' } = assessment || {};

  const renderPage = () => {
    switch (currentStep) {
      case 'demographics':
        return <DemographicsPage />;
      case 'journey_status':
        return <JourneyStatusPage />;
      case 'budget':
        return <BudgetPage />;
      case 'results':
        return <ResultsPage />;
      default:
        return <DemographicsPage />;
    }
  };

  const getProgress = () => {
    switch (currentStep) {
      case 'demographics':
        return 25;
      case 'journey_status':
        return 50;
      case 'budget':
        return 75;
      case 'results':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Welcome to the AI Maturity Assessment</h1>
      </header>
      <nav role="navigation">
        <ul>
          <li>Step 1: Demographics</li>
          <li>Step 2: Journey Status</li>
          <li>Step 3: Budget</li>
          <li>Step 4: Results</li>
        </ul>
      </nav>
      <main className="app-content">
        <div role="region" aria-label="assessment content">
          <div role="progressbar" aria-valuenow={getProgress()} aria-valuemin="0" aria-valuemax="100">
            <div style={{ width: `${getProgress()}%` }} />
          </div>
          {renderPage()}
        </div>
      </main>
    </div>
  );
}

export default App; 