import React from 'react';
import { useAssessment } from '../context/AssessmentContext';
import mockScoringEngine from '../__mocks__/scoringEngineMock';

const ResultsPage = () => {
  const { assessment } = useAssessment();
  const score = mockScoringEngine.calculateTotalScore(assessment);
  const maturityLevel = mockScoringEngine.determineMaturityLevel(score);

  return (
    <div data-testid="step-results">
      <h2>Your AI Maturity Assessment Results</h2>
      
      <div className="results-container">
        <div className="score-section">
          <h3>Overall Score</h3>
          <div className="score">{score}%</div>
        </div>

        <div className="maturity-section">
          <h3>Maturity Level</h3>
          <div className="maturity-level">{maturityLevel.level}</div>
          <p className="maturity-description">{maturityLevel.description}</p>
        </div>

        <div className="details-section">
          <h3>Assessment Details</h3>
          <div className="detail-item">
            <strong>Industry:</strong> {assessment?.organization?.industry}
          </div>
          <div className="detail-item">
            <strong>Company Size:</strong> {assessment?.organization?.companySize}
          </div>
          <div className="detail-item">
            <strong>Role:</strong> {assessment?.organization?.role}
          </div>
          <div className="detail-item">
            <strong>Journey Status:</strong> {assessment?.journeyStatus?.type}
          </div>
          <div className="detail-item">
            <strong>Budget Range:</strong> {assessment?.budgetInfo?.range}
          </div>
          <div className="detail-item">
            <strong>Timeline:</strong> {assessment?.budgetInfo?.timeline}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 