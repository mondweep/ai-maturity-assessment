# AI Maturity Assessment Application - Context and State Management

This document contains pseudocode for the context and state management of the AI Maturity Assessment application, including the context provider, state initialization, and state update functions.

## 1. Assessment Context Types

```javascript
// Define types for the assessment state
interface Organization {
  industry: string;
  companySize: string;
}

interface JourneyStatus {
  type: "not-started" | "exploring" | "implementing" | "scaling";
  responses: Record<string, any>;
}

interface Goal {
  id: string;
  title: string;
  priority?: "low" | "medium" | "high" | "critical";
  timeframe?: string;
}

interface BudgetTimeline {
  budget: string;
  timeline: string;
  priority: "low" | "medium" | "high" | "critical";
}

interface AssessmentState {
  // Current step in the assessment
  currentStep: string;
  
  // Organization demographics
  organization: Organization;
  
  // Current AI journey status
  journeyStatus: JourneyStatus;
  
  // Selected goals for AI implementation
  selectedGoals: Goal[];
  
  // Available goals configuration
  availableGoals: any[];
  
  // Detailed responses to qualifying questions for selected goals
  goalDetails: Record<string, any>;
  
  // Budget and timeline information
  budgetTimeline: BudgetTimeline;
  
  // Whether the assessment is complete
  isComplete: boolean;
}

interface AssessmentContextType {
  // The current state of the assessment
  state: AssessmentState;
  
  // Functions to update various parts of the state
  updateCurrentStep: (step: string) => void;
  updateOrganization: (organization: Organization) => void;
  updateJourneyStatus: (journeyStatus: JourneyStatus) => void;
  updateJourneyResponses: (responses: Record<string, any>) => void;
  updateSelectedGoals: (goals: Goal[]) => void;
  updateGoalDetails: (details: Record<string, any>) => void;
  updateBudgetTimeline: (budgetTimeline: BudgetTimeline) => void;
  completeAssessment: () => void;
  resetAssessment: () => void;
}
```

## 2. Assessment Context Provider

```javascript
// Create the assessment context
const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

// Initial state for the assessment
const initialState: AssessmentState = {
  currentStep: "demographics",
  organization: {
    industry: "",
    companySize: ""
  },
  journeyStatus: {
    type: "not-started",
    responses: {}
  },
  selectedGoals: [],
  availableGoals: [
    // Available goals configuration would be defined here
    // This would match the structure in the GoalsSelectionPage
  ],
  goalDetails: {},
  budgetTimeline: {
    budget: "",
    timeline: "",
    priority: "medium"
  },
  isComplete: false
};

// Assessment context provider component
function AssessmentProvider({ children }) {
  // Initialize state with the initial state
  const [state, setState] = useState<AssessmentState>(initialState);
  
  // Function to update the current step
  function updateCurrentStep(step: string) {
    setState(prevState => ({
      ...prevState,
      currentStep: step
    }));
    // TEST: Current step is updated correctly
  }
  
  // Function to update organization demographics
  function updateOrganization(organization: Organization) {
    setState(prevState => ({
      ...prevState,
      organization
    }));
    // TEST: Organization data is updated correctly
  }
  
  // Function to update journey status
  function updateJourneyStatus(journeyStatus: JourneyStatus) {
    setState(prevState => ({
      ...prevState,
      journeyStatus
    }));
    // TEST: Journey status is updated correctly
  }
  
  // Function to update journey responses
  function updateJourneyResponses(responses: Record<string, any>) {
    setState(prevState => ({
      ...prevState,
      journeyStatus: {
        ...prevState.journeyStatus,
        responses
      }
    }));
    // TEST: Journey responses are updated correctly
  }
  
  // Function to update selected goals
  function updateSelectedGoals(goals: Goal[]) {
    setState(prevState => ({
      ...prevState,
      selectedGoals: goals
    }));
    // TEST: Selected goals are updated correctly
  }
  
  // Function to update goal details
  function updateGoalDetails(details: Record<string, any>) {
    setState(prevState => ({
      ...prevState,
      goalDetails: details
    }));
    // TEST: Goal details are updated correctly
  }
  
  // Function to update budget and timeline
  function updateBudgetTimeline(budgetTimeline: BudgetTimeline) {
    setState(prevState => ({
      ...prevState,
      budgetTimeline
    }));
    // TEST: Budget and timeline are updated correctly
  }
  
  // Function to mark the assessment as complete
  function completeAssessment() {
    setState(prevState => ({
      ...prevState,
      isComplete: true
    }));
    // TEST: Assessment is marked as complete
  }
  
  // Function to reset the assessment to initial state
  function resetAssessment() {
    setState(initialState);
    // TEST: Assessment state is reset to initial values
  }
  
  // Create the context value object
  const contextValue: AssessmentContextType = {
    state,
    updateCurrentStep,
    updateOrganization,
    updateJourneyStatus,
    updateJourneyResponses,
    updateSelectedGoals,
    updateGoalDetails,
    updateBudgetTimeline,
    completeAssessment,
    resetAssessment
  };
  
  return (
    <AssessmentContext.Provider value={contextValue}>
      {children}
    </AssessmentContext.Provider>
  );
  // TEST: Context provider renders children with context value
}

// Custom hook to use the assessment context
function useAssessmentContext() {
  const context = useContext(AssessmentContext);
  
  if (context === undefined) {
    throw new Error("useAssessmentContext must be used within an AssessmentProvider");
  }
  
  return context;
  // TEST: Hook returns context or throws appropriate error
}
```

## 3. Navigation Functions

```javascript
// Function to navigate to a specific step
function goToStep(step: string) {
  const { updateCurrentStep } = useAssessmentContext();
  
  // Update the current step in the context
  updateCurrentStep(step);
  
  // Scroll to top of page
  window.scrollTo(0, 0);
  // TEST: Navigation updates current step and scrolls to top
}

// Function to get the next step based on current step
function getNextStep(currentStep: string, state: AssessmentState): string {
  switch (currentStep) {
    case "demographics":
      return "journey-status";
    case "journey-status":
      return "journey-questions";
    case "journey-questions":
      return "goals-selection";
    case "goals-selection":
      return "qualifying-questions";
    case "qualifying-questions":
      return "budget-timeline";
    case "budget-timeline":
      return "results";
    default:
      return "demographics";
  }
  // TEST: Next step is correctly determined based on current step
}

// Function to get the previous step based on current step
function getPreviousStep(currentStep: string, state: AssessmentState): string {
  switch (currentStep) {
    case "journey-status":
      return "demographics";
    case "journey-questions":
      return "journey-status";
    case "goals-selection":
      return "journey-questions";
    case "qualifying-questions":
      return "goals-selection";
    case "budget-timeline":
      return "qualifying-questions";
    case "results":
      return "budget-timeline";
    default:
      return "demographics";
  }
  // TEST: Previous step is correctly determined based on current step
}

// Function to navigate to the next step
function goToNextStep() {
  const { state, updateCurrentStep } = useAssessmentContext();
  const nextStep = getNextStep(state.currentStep, state);
  
  updateCurrentStep(nextStep);
  window.scrollTo(0, 0);
  // TEST: Navigation to next step works correctly
}

// Function to navigate to the previous step
function goToPreviousStep() {
  const { state, updateCurrentStep } = useAssessmentContext();
  const previousStep = getPreviousStep(state.currentStep, state);
  
  updateCurrentStep(previousStep);
  window.scrollTo(0, 0);
  // TEST: Navigation to previous step works correctly
}
```

## 4. Persistence Functions

```javascript
// Function to save assessment state to local storage
function saveAssessmentState(state: AssessmentState) {
  try {
    localStorage.setItem('aiMaturityAssessment', JSON.stringify(state));
    return true;
    // TEST: Assessment state is saved to local storage successfully
  } catch (error) {
    console.error('Error saving assessment state:', error);
    return false;
    // TEST: Error is handled gracefully when saving fails
  }
}

// Function to load assessment state from local storage
function loadAssessmentState(): AssessmentState | null {
  try {
    const savedState = localStorage.getItem('aiMaturityAssessment');
    
    if (savedState) {
      return JSON.parse(savedState);
      // TEST: Assessment state is loaded from local storage successfully
    }
    
    return null;
  } catch (error) {
    console.error('Error loading assessment state:', error);
    return null;
    // TEST: Error is handled gracefully when loading fails
  }
}

// Function to clear saved assessment state from local storage
function clearSavedAssessmentState() {
  try {
    localStorage.removeItem('aiMaturityAssessment');
    return true;
    // TEST: Saved assessment state is cleared from local storage successfully
  } catch (error) {
    console.error('Error clearing assessment state:', error);
    return false;
    // TEST: Error is handled gracefully when clearing fails
  }
}

// Enhanced AssessmentProvider with persistence
function AssessmentProviderWithPersistence({ children }) {
  // Initialize state with saved state or initial state
  const [state, setState] = useState<AssessmentState>(() => {
    const savedState = loadAssessmentState();
    return savedState || initialState;
  });
  
  // Save state to local storage whenever it changes
  useEffect(() => {
    saveAssessmentState(state);
    // TEST: State is saved whenever it changes
  }, [state]);
  
  // Rest of the provider implementation would be the same as before
  // ...
}
```

## 5. Main Application Component

```javascript
// Main application component
function AIMaturityAssessment() {
  return (
    <AssessmentProvider>
      <div className="ai-maturity-assessment">
        <header className="assessment-header">
          <h1>AI Maturity Assessment</h1>
        </header>
        
        <main className="assessment-content">
          <AssessmentStepRenderer />
        </main>
        
        <footer className="assessment-footer">
          <p>© 2025 AI Maturity Assessment</p>
        </footer>
      </div>
    </AssessmentProvider>
  );
  // TEST: Application renders with assessment provider and step renderer
}

// Component to render the current assessment step
function AssessmentStepRenderer() {
  const { state } = useAssessmentContext();
  
  // Render the appropriate component based on the current step
  switch (state.currentStep) {
    case "demographics":
      return <DemographicsPage />;
    case "journey-status":
      return <JourneyStatusPage />;
    case "journey-questions":
      return <JourneyQuestionsPage />;
    case "goals-selection":
      return <GoalsSelectionPage />;
    case "qualifying-questions":
      return <QualifyingQuestionsPage />;
    case "budget-timeline":
      return <BudgetTimelinePage />;
    case "results":
      return <ResultsPage />;
    default:
      return <DemographicsPage />;
  }
  // TEST: Correct page component is rendered based on current step
}