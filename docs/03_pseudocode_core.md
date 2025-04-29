# AI Maturity Assessment Application - Core Pseudocode

This document contains pseudocode for the core components of the AI Maturity Assessment application, including the main application flow, state management, and navigation logic.

## 1. Application Structure

```
AppRoot
├── AssessmentProvider (state management)
├── Router
│   ├── DemographicsPage
│   ├── JourneyStatusPage
│   ├── JourneyQuestionsPage
│   ├── GoalsSelectionPage
│   ├── QualifyingQuestionsPage
│   ├── BudgetInfoPage
│   ├── ResultsPage
│   └── ErrorPage
└── SharedComponents
    ├── Navigation
    ├── ProgressIndicator
    ├── QuestionRenderer
    ├── ValidationErrors
    └── MaturityScoreDisplay
```

## 2. Core Application Flow

```javascript
// Main application flow
function AppRoot() {
  // Initialize assessment state
  const assessmentState = useAssessmentState();
  
  // TEST: App initializes with empty assessment state
  // TEST: App loads saved state from storage if available
  
  return (
    <AssessmentProvider value={assessmentState}>
      <Header />
      <ProgressIndicator />
      <Router>
        <Route path="/demographics" component={DemographicsPage} />
        <Route path="/journey-status" component={JourneyStatusPage} />
        <Route path="/journey-questions" component={JourneyQuestionsPage} />
        <Route path="/goals-selection" component={GoalsSelectionPage} />
        <Route path="/qualifying-questions" component={QualifyingQuestionsPage} />
        <Route path="/budget-info" component={BudgetInfoPage} />
        <Route path="/results" component={ResultsPage} />
        <Route path="/error" component={ErrorPage} />
        <Redirect from="/" to="/demographics" />
      </Router>
      <Footer />
    </AssessmentProvider>
  );
}
```

## 3. State Management

```javascript
// Assessment state management
function useAssessmentState() {
  // Initialize state with default values
  const [state, setState] = useState({
    currentStep: "demographics",
    organization: {
      industry: "",
      companySize: ""
    },
    journeyStatus: {
      type: "",
      responses: {}
    },
    selectedGoals: [],
    qualifyingResponses: {},
    budgetInfo: {
      budgetRange: "",
      timeframeMonths: 0,
      resourcesAvailable: "",
      budgetApproved: false
    },
    results: {
      maturityScore: 0,
      maturityLevel: "",
      recommendations: []
    },
    sessionId: generateUniqueId(),
    lastUpdated: new Date()
  });

  // Initialize from localStorage if available
  useEffect(() => {
    const savedState = localStorage.getItem("assessmentState");
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        setState(parsedState);
        // TEST: Saved state is correctly loaded from storage
      } catch (error) {
        console.error("Error loading saved state:", error);
        // TEST: Error handling when saved state is invalid
      }
    }
  }, []);

  // Save state to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("assessmentState", JSON.stringify(state));
      // TEST: State is correctly saved to storage
    } catch (error) {
      console.error("Error saving state:", error);
      // TEST: Error handling when state cannot be saved
    }
  }, [state]);

  // Update organization demographics
  function updateOrganization(organization) {
    setState(prevState => ({
      ...prevState,
      organization,
      lastUpdated: new Date()
    }));
    // TEST: Organization data is correctly updated
  }

  // Update journey status
  function updateJourneyStatus(journeyStatus) {
    setState(prevState => ({
      ...prevState,
      journeyStatus,
      lastUpdated: new Date()
    }));
    // TEST: Journey status is correctly updated
  }

  // Update journey question responses
  function updateJourneyResponses(responses) {
    setState(prevState => ({
      ...prevState,
      journeyStatus: {
        ...prevState.journeyStatus,
        responses: {
          ...prevState.journeyStatus.responses,
          ...responses
        }
      },
      lastUpdated: new Date()
    }));
    // TEST: Journey responses are correctly updated
  }

  // Update selected goals
  function updateSelectedGoals(selectedGoals) {
    setState(prevState => ({
      ...prevState,
      selectedGoals,
      lastUpdated: new Date()
    }));
    // TEST: Selected goals are correctly updated
  }

  // Update qualifying responses
  function updateQualifyingResponses(goalId, responses) {
    setState(prevState => ({
      ...prevState,
      qualifyingResponses: {
        ...prevState.qualifyingResponses,
        [goalId]: {
          ...(prevState.qualifyingResponses[goalId] || {}),
          ...responses
        }
      },
      lastUpdated: new Date()
    }));
    // TEST: Qualifying responses are correctly updated for the specified goal
  }

  // Update budget information
  function updateBudgetInfo(budgetInfo) {
    setState(prevState => ({
      ...prevState,
      budgetInfo,
      lastUpdated: new Date()
    }));
    // TEST: Budget information is correctly updated
  }

  // Calculate maturity score and generate recommendations
  function calculateResults() {
    const maturityScore = calculateMaturityScore(state);
    const maturityLevel = determineMaturityLevel(maturityScore);
    const recommendations = generateRecommendations(state, maturityScore);

    setState(prevState => ({
      ...prevState,
      results: {
        maturityScore,
        maturityLevel,
        recommendations
      },
      lastUpdated: new Date()
    }));
    // TEST: Results are correctly calculated and updated
  }

  // Navigate to a specific step
  function goToStep(step) {
    setState(prevState => ({
      ...prevState,
      currentStep: step,
      lastUpdated: new Date()
    }));
    // TEST: Current step is correctly updated
  }

  // Reset the assessment
  function resetAssessment() {
    setState({
      currentStep: "demographics",
      organization: {
        industry: "",
        companySize: ""
      },
      journeyStatus: {
        type: "",
        responses: {}
      },
      selectedGoals: [],
      qualifyingResponses: {},
      budgetInfo: {
        budgetRange: "",
        timeframeMonths: 0,
        resourcesAvailable: "",
        budgetApproved: false
      },
      results: {
        maturityScore: 0,
        maturityLevel: "",
        recommendations: []
      },
      sessionId: generateUniqueId(),
      lastUpdated: new Date()
    });
    // TEST: Assessment state is correctly reset to initial values
  }

  return {
    state,
    updateOrganization,
    updateJourneyStatus,
    updateJourneyResponses,
    updateSelectedGoals,
    updateQualifyingResponses,
    updateBudgetInfo,
    calculateResults,
    goToStep,
    resetAssessment
  };
}
```

## 4. Navigation Logic

```javascript
// Navigation component
function Navigation({ currentStep }) {
  const { goToStep } = useAssessmentContext();
  const { canNavigateBack, canNavigateForward, previousStep, nextStep } = useNavigationLogic(currentStep);

  // TEST: Navigation displays correctly based on current step
  // TEST: Navigation buttons are enabled/disabled based on navigation logic

  return (
    <div className="navigation">
      <button 
        onClick={() => goToStep(previousStep)} 
        disabled={!canNavigateBack}
        className="back-button"
      >
        Back
      </button>
      <button 
        onClick={() => goToStep(nextStep)} 
        disabled={!canNavigateForward}
        className="next-button"
      >
        {currentStep === "qualifying-questions" ? "Continue to Budget" : 
         currentStep === "budget-info" ? "Calculate Results" : "Next"}
      </button>
    </div>
  );
}

// Navigation logic
function useNavigationLogic(currentStep) {
  const { state } = useAssessmentContext();
  
  // Define step sequence
  const steps = [
    "demographics",
    "journey-status",
    "journey-questions",
    "goals-selection",
    "qualifying-questions",
    "budget-info",
    "results"
  ];
  
  // Get current step index
  const currentIndex = steps.indexOf(currentStep);
  
  // Determine previous and next steps
  const previousStep = currentIndex > 0 ? steps[currentIndex - 1] : null;
  const nextStep = currentIndex < steps.length - 1 ? steps[currentIndex + 1] : null;
  
  // Check if navigation is allowed
  const canNavigateBack = currentIndex > 0;
  const canNavigateForward = validateCurrentStep(state, currentStep);
  
  // TEST: Previous and next steps are correctly determined based on current step
  // TEST: Navigation validation correctly determines if forward navigation is allowed
  
  return {
    canNavigateBack,
    canNavigateForward,
    previousStep,
    nextStep
  };
}

// Validate if the current step is complete and forward navigation is allowed
function validateCurrentStep(state, currentStep) {
  switch (currentStep) {
    case "demographics":
      return isValidDemographics(state.organization);
    
    case "journey-status":
      return isValidJourneyStatus(state.journeyStatus);
    
    case "journey-questions":
      return isValidJourneyResponses(state.journeyStatus.responses);
    
    case "goals-selection":
      return isValidGoalsSelection(state.selectedGoals);
    
    case "qualifying-questions":
      return isValidQualifyingResponses(state.selectedGoals, state.qualifyingResponses);
    
    case "budget-info":
      return isValidBudgetInfo(state.budgetInfo);
    
    case "results":
      return false; // No forward navigation from results
    
    default:
      return false;
  }
  
  // TEST: Each step validation function correctly determines if step is complete
}
```

## 5. Progress Indicator

```javascript
// Progress indicator component
function ProgressIndicator() {
  const { state } = useAssessmentContext();
  const currentStep = state.currentStep;
  
  // Define steps for the progress indicator
  const steps = [
    { id: "demographics", label: "Company Info" },
    { id: "journey-status", label: "AI Journey" },
    { id: "journey-questions", label: "Current Status" },
    { id: "goals-selection", label: "Goals" },
    { id: "qualifying-questions", label: "Details" },
    { id: "budget-info", label: "Budget" },
    { id: "results", label: "Results" }
  ];
  
  // Calculate progress percentage
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  const progressPercentage = ((currentIndex) / (steps.length - 1)) * 100;
  
  // TEST: Progress percentage is correctly calculated based on current step
  // TEST: Progress indicator displays correct steps and highlights current step
  
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      <div className="progress-steps">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`progress-step ${currentIndex === index ? 'active' : ''} ${currentIndex > index ? 'completed' : ''}`}
          >
            <div className="step-indicator">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

## 6. Error Handling

```javascript
// Error boundary component
function ErrorBoundary({ children }) {
  const [hasError, setHasError] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null);
  
  // Handle errors in child components
  function handleCatch(error, info) {
    setHasError(true);
    setErrorInfo(info);
    logError(error, info);
    // TEST: Error boundary correctly catches and handles errors
  }
  
  // Reset error state
  function resetError() {
    setHasError(false);
    setErrorInfo(null);
    // TEST: Error state is correctly reset
  }
  
  // Display error UI or children
  if (hasError) {
    return (
      <div className="error-container">
        <h2>Something went wrong</h2>
        <p>We're sorry, but there was an error loading this page.</p>
        <button onClick={resetError}>Try Again</button>
        <button onClick={() => window.location.href = "/"}>Start Over</button>
      </div>
    );
  }
  
  return children;
}

// Log error to monitoring service
function logError(error, info) {
  // In a real implementation, this would send the error to a monitoring service
  console.error("Error in assessment application:", error);
  console.error("Component stack:", info.componentStack);
  // TEST: Errors are correctly logged
}
```

## 7. Validation Functions

```javascript
// Validate demographics data
function isValidDemographics(organization) {
  return (
    organization &&
    organization.industry && organization.industry.trim() !== "" &&
    organization.companySize && organization.companySize.trim() !== ""
  );
  // TEST: Demographics validation correctly identifies valid and invalid data
}

// Validate journey status
function isValidJourneyStatus(journeyStatus) {
  return (
    journeyStatus &&
    journeyStatus.type && journeyStatus.type.trim() !== ""
  );
  // TEST: Journey status validation correctly identifies valid and invalid data
}

// Validate journey responses
function isValidJourneyResponses(responses) {
  // Get required questions for the selected journey status
  const requiredQuestions = getRequiredQuestionsForJourneyStatus(journeyStatus.type);
  
  // Check if all required questions have responses
  return requiredQuestions.every(questionId => {
    return responses[questionId] !== undefined && responses[questionId] !== "";
  });
  // TEST: Journey responses validation correctly identifies valid and invalid data
}

// Validate goals selection
function isValidGoalsSelection(selectedGoals) {
  return selectedGoals && selectedGoals.length > 0;
  // TEST: Goals selection validation correctly identifies valid and invalid data
}

// Validate qualifying responses
function isValidQualifyingResponses(selectedGoals, qualifyingResponses) {
  // Check if each selected goal has all required qualifying questions answered
  return selectedGoals.every(goal => {
    // Get required questions for this goal
    const requiredQuestions = getRequiredQuestionsForGoal(goal.id);
    
    // Check if all required questions have responses
    return requiredQuestions.every(questionId => {
      const goalResponses = qualifyingResponses[goal.id] || {};
      return goalResponses[questionId] !== undefined && goalResponses[questionId] !== "";
    });
  });
  // TEST: Qualifying responses validation correctly identifies valid and invalid data
}

// Validate budget information
function isValidBudgetInfo(budgetInfo) {
  return (
    budgetInfo &&
    budgetInfo.budgetRange && budgetInfo.budgetRange.trim() !== "" &&
    budgetInfo.timeframeMonths && budgetInfo.timeframeMonths > 0 &&
    budgetInfo.resourcesAvailable && budgetInfo.resourcesAvailable.trim() !== ""
  );
  // TEST: Budget information validation correctly identifies valid and invalid data
}
```

## 8. Helper Functions

```javascript
// Generate a unique ID for the session
function generateUniqueId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
  // TEST: Function generates unique IDs
}

// Get required questions for a journey status
function getRequiredQuestionsForJourneyStatus(statusType) {
  // In a real implementation, this would fetch the required questions from a configuration
  // or API based on the journey status type
  const requiredQuestionsByStatus = {
    "not-started": ["ns-q1", "ns-q2"],
    "exploring": ["ex-q1", "ex-q2", "ex-q3"],
    "implementing": ["im-q1", "im-q2", "im-q3", "im-q4"],
    "scaling": ["sc-q1", "sc-q2", "sc-q3", "sc-q4", "sc-q5"]
  };
  
  return requiredQuestionsByStatus[statusType] || [];
  // TEST: Function returns correct required questions for each journey status
}

// Get required questions for a goal
function getRequiredQuestionsForGoal(goalId) {
  // In a real implementation, this would fetch the required questions from a configuration
  // or API based on the goal ID
  const requiredQuestionsByGoal = {
    "automate-operations": ["ao-q1", "ao-q2", "ao-q3"],
    "enhance-customer-experience": ["ce-q1", "ce-q2"],
    "improve-decision-making": ["dm-q1", "dm-q2", "dm-q3"],
    "develop-new-products": ["np-q1", "np-q2", "np-q3", "np-q4"],
    "optimize-resource-allocation": ["ra-q1", "ra-q2"]
  };
  
  return requiredQuestionsByGoal[goalId] || [];
  // TEST: Function returns correct required questions for each goal
}
```

## 9. Component Integration

```javascript
// Main application component integration
function App() {
  return (
    <ErrorBoundary>
      <AppRoot />
    </ErrorBoundary>
  );
  // TEST: Application components are correctly integrated
}