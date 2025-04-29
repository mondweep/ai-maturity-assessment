# AI Maturity Assessment Application - Pages Pseudocode

This document contains pseudocode for the individual pages and components of the AI Maturity Assessment application, including the question rendering logic and user interactions.

## 1. Demographics Page

```javascript
// Demographics page component
function DemographicsPage() {
  const { state, updateOrganization } = useAssessmentContext();
  const [formData, setFormData] = useState({
    industry: state.organization.industry || "",
    companySize: state.organization.companySize || ""
  });
  const [errors, setErrors] = useState({});
  
  // Handle input changes
  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: ""
      }));
    }
    // TEST: Form data is updated when input changes
  }
  
  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    
    // Validate form data
    const validationErrors = validateDemographics(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // TEST: Validation errors are displayed when form is invalid
      return;
    }
    
    // Update organization data in assessment state
    updateOrganization(formData);
    
    // Navigate to next step
    goToStep("journey-status");
    // TEST: Navigation occurs after successful form submission
  }
  
  return (
    <div className="demographics-page">
      <h1>Tell us about your organization</h1>
      <p>This information helps us provide more relevant recommendations.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="industry">Industry</label>
          <select 
            id="industry"
            name="industry"
            value={formData.industry}
            onChange={handleInputChange}
            className={errors.industry ? "error" : ""}
          >
            <option value="">Select your industry</option>
            <option value="healthcare">Healthcare</option>
            <option value="finance">Finance</option>
            <option value="retail">Retail</option>
            <option value="manufacturing">Manufacturing</option>
            <option value="technology">Technology</option>
            <option value="education">Education</option>
            <option value="government">Government</option>
            <option value="other">Other</option>
          </select>
          {errors.industry && <div className="error-message">{errors.industry}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="companySize">Company Size</label>
          <select 
            id="companySize"
            name="companySize"
            value={formData.companySize}
            onChange={handleInputChange}
            className={errors.companySize ? "error" : ""}
          >
            <option value="">Select your company size</option>
            <option value="1-50">1-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-1000">201-1000 employees</option>
            <option value="1001+">1001+ employees</option>
          </select>
          {errors.companySize && <div className="error-message">{errors.companySize}</div>}
        </div>
        
        <button type="submit" className="primary-button">Continue</button>
      </form>
    </div>
  );
}

// Validate demographics data
function validateDemographics(data) {
  const errors = {};
  
  if (!data.industry) {
    errors.industry = "Please select your industry";
  }
  
  if (!data.companySize) {
    errors.companySize = "Please select your company size";
  }
  
  return errors;
  // TEST: Validation correctly identifies missing fields
}
```

## 2. Journey Status Page

```javascript
// Journey status page component
function JourneyStatusPage() {
  const { state, updateJourneyStatus } = useAssessmentContext();
  const [selectedStatus, setSelectedStatus] = useState(state.journeyStatus.type || "");
  const [error, setError] = useState("");
  
  // Journey status options
  const journeyStatusOptions = [
    {
      id: "not-started",
      title: "Not Started",
      description: "We haven't begun implementing AI in our organization yet.",
      icon: "🔍"
    },
    {
      id: "exploring",
      title: "Exploring",
      description: "We're researching AI solutions and possibly running pilots.",
      icon: "🧪"
    },
    {
      id: "implementing",
      title: "Implementing",
      description: "We're actively implementing AI solutions in specific areas.",
      icon: "🚀"
    },
    {
      id: "scaling",
      title: "Scaling",
      description: "We have AI solutions in production and are scaling them across the organization.",
      icon: "📈"
    }
  ];
  
  // Handle status selection
  function handleStatusSelect(statusId) {
    setSelectedStatus(statusId);
    setError("");
    // TEST: Selected status is updated when a status is selected
  }
  
  // Handle continue button click
  function handleContinue() {
    if (!selectedStatus) {
      setError("Please select your current AI journey status");
      // TEST: Error is displayed when no status is selected
      return;
    }
    
    // Update journey status in assessment state
    updateJourneyStatus({
## 3. Journey Questions Page

```javascript
// Journey questions page component
function JourneyQuestionsPage() {
  const { state, updateJourneyResponses } = useAssessmentContext();
  const [responses, setResponses] = useState(state.journeyStatus.responses || {});
  const [errors, setErrors] = useState({});
  
  // Get questions based on selected journey status
  const questions = getJourneyQuestions(state.journeyStatus.type);
  
  // Handle response change
  function handleResponseChange(questionId, value) {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));
    
    // Clear error for this question if it exists
    if (errors[questionId]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [questionId]: ""
      }));
    }
    // TEST: Responses are updated when input changes
  }
  
  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    
    // Validate responses
    const validationErrors = validateResponses(questions, responses);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // TEST: Validation errors are displayed when form is invalid
      return;
    }
    
    // Update journey responses in assessment state
    updateJourneyResponses(responses);
    
    // Navigate to next step
    goToStep("goals-selection");
    // TEST: Navigation occurs after successful form submission
  }
  
  return (
    <div className="journey-questions-page">
      <h1>Tell us more about your AI journey</h1>
      <p>Answer these questions to help us understand your current situation better.</p>
      
      <form onSubmit={handleSubmit}>
        {questions.map(question => (
          <QuestionRenderer
            key={question.id}
            question={question}
            value={responses[question.id] || ""}
            onChange={value => handleResponseChange(question.id, value)}
            error={errors[question.id]}
          />
        ))}
        
        <div className="form-actions">
          <button type="button" onClick={() => goToStep("journey-status")} className="secondary-button">
            Back
          </button>
          <button type="submit" className="primary-button">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

// Get journey questions based on status
function getJourneyQuestions(statusType) {
  // In a real implementation, this would fetch questions from a configuration or API
  const questionsByStatus = {
    "not-started": [
      {
        id: "ns-q1",
        text: "What's your primary motivation for exploring AI?",
        type: "multiple-choice",
        required: true,
        options: [
          { id: "ns-q1-a1", text: "Improving operational efficiency" },
          { id: "ns-q1-a2", text: "Enhancing customer experience" },
          { id: "ns-q1-a3", text: "Keeping up with competitors" },
          { id: "ns-q1-a4", text: "Creating new products or services" },
          { id: "ns-q1-a5", text: "Reducing costs" }
        ]
      },
      {
        id: "ns-q2",
        text: "What's your biggest concern about implementing AI?",
        type: "multiple-choice",
        required: true,
        options: [
          { id: "ns-q2-a1", text: "Cost of implementation" },
          { id: "ns-q2-a2", text: "Lack of expertise" },
          { id: "ns-q2-a3", text: "Integration with existing systems" },
          { id: "ns-q2-a4", text: "Data quality or availability" },
          { id: "ns-q2-a5", text: "Regulatory compliance" }
        ]
      }
    ],
    "exploring": [
      // Questions for "exploring" status
      // Similar structure to "not-started" questions
    ],
    "implementing": [
      // Questions for "implementing" status
    ],
    "scaling": [
      // Questions for "scaling" status
    ]
  };
  
  return questionsByStatus[statusType] || [];
  // TEST: Correct questions are returned for each journey status
}

// Validate responses
function validateResponses(questions, responses) {
  const errors = {};
  
  questions.forEach(question => {
    if (question.required && (!responses[question.id] || responses[question.id] === "")) {
      errors[question.id] = `Please answer this question`;
    }
  });
  
  return errors;
  // TEST: Validation correctly identifies unanswered required questions
}
```

## 4. Goals Selection Page

```javascript
// Goals selection page component
function GoalsSelectionPage() {
  const { state, updateSelectedGoals } = useAssessmentContext();
  const [selectedGoals, setSelectedGoals] = useState(state.selectedGoals || []);
  const [error, setError] = useState("");
  
  // Available goals
  const availableGoals = [
    {
      id: "automate-operations",
      title: "Automate Operations",
      description: "Use AI to automate manual processes and increase operational efficiency.",
      icon: "⚙️",
      qualifyingQuestions: [
        {
          id: "ao-q1",
          text: "How many hours per week does your team spend on manual tasks that could potentially be automated?",
          type: "scale",
          required: true,
          min: 0,
          max: 40,
          step: 1
        },
        // More qualifying questions...
      ]
    },
    {
      id: "enhance-customer-experience",
      title: "Enhance Customer Experience",
      description: "Leverage AI to provide personalized and improved customer experiences.",
      icon: "👥",
      qualifyingQuestions: [
        // Qualifying questions for this goal
      ]
    },
    {
      id: "improve-decision-making",
      title: "Improve Decision Making",
      description: "Use AI for data analysis and insights to support better business decisions.",
      icon: "📊",
      qualifyingQuestions: [
        // Qualifying questions for this goal
      ]
    },
    {
      id: "develop-new-products",
      title: "Develop New Products",
      description: "Create innovative AI-powered products and services.",
      icon: "💡",
      qualifyingQuestions: [
        // Qualifying questions for this goal
      ]
    },
    {
      id: "optimize-resource-allocation",
      title: "Optimize Resource Allocation",
      description: "Use AI to optimize allocation of resources like budget, staff, and inventory.",
      icon: "📈",
      qualifyingQuestions: [
        // Qualifying questions for this goal
      ]
    }
  ];
  
  // Toggle goal selection
  function toggleGoalSelection(goal) {
    if (isGoalSelected(goal.id)) {
      // Remove goal if already selected
      setSelectedGoals(prevSelectedGoals => 
        prevSelectedGoals.filter(g => g.id !== goal.id)
      );
    } else {
      // Add goal if not already selected
      setSelectedGoals(prevSelectedGoals => [
        ...prevSelectedGoals,
        {
          id: goal.id,
          title: goal.title,
          priority: "medium", // Default priority
          timeframe: "3-6 months" // Default timeframe
        }
      ]);
    }
    setError("");
    // TEST: Selected goals are correctly toggled
  }
  
  // Check if a goal is selected
  function isGoalSelected(goalId) {
    return selectedGoals.some(goal => goal.id === goalId);
  }
  
  // Handle continue button click
  function handleContinue() {
    if (selectedGoals.length === 0) {
      setError("Please select at least one goal");
      // TEST: Error is displayed when no goals are selected
      return;
    }
    
    // Update selected goals in assessment state
    updateSelectedGoals(selectedGoals);
    
    // Navigate to next step
    goToStep("qualifying-questions");
    // TEST: Navigation occurs after successful goal selection
  }
  
  return (
    <div className="goals-selection-page">
      <h1>Select your AI goals</h1>
      <p>Choose the goals that align with your organization's AI strategy.</p>
      
      <div className="goals-grid">
        {availableGoals.map(goal => (
          <div 
            key={goal.id}
            className={`goal-card ${isGoalSelected(goal.id) ? "selected" : ""}`}
            onClick={() => toggleGoalSelection(goal)}
          >
            <div className="goal-icon">{goal.icon}</div>
            <h3>{goal.title}</h3>
            <p>{goal.description}</p>
            <div className="selection-indicator">
              {isGoalSelected(goal.id) ? "✓" : "+"}
            </div>
          </div>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="form-actions">
        <button type="button" onClick={() => goToStep("journey-questions")} className="secondary-button">
          Back
        </button>
        <button type="button" onClick={handleContinue} className="primary-button">
          Continue
        </button>
      </div>
    </div>
  );
}
```
      type: selectedStatus,
      responses: {}
    });
    
    // Navigate to next step
    goToStep("journey-questions");
    // TEST: Navigation occurs after successful status selection
  }
  
  return (
    <div className="journey-status-page">
      <h1>Where are you in your AI journey?</h1>
      <p>Select the option that best describes your organization's current AI status.</p>
      
      <div className="status-options">
        {journeyStatusOptions.map(option => (
          <div 
            key={option.id}
            className={`status-option ${selectedStatus === option.id ? "selected" : ""}`}
            onClick={() => handleStatusSelect(option.id)}
          >
            <div className="status-icon">{option.icon}</div>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
          </div>
        ))}
      </div>
      
      {error && <div className="error-message">{error}</div>}
      
      <button 
        onClick={handleContinue}
        className="primary-button"
      >
        Continue
      </button>
    </div>
  );
}
## 5. Qualifying Questions Page

```javascript
// Qualifying questions page component
function QualifyingQuestionsPage() {
  const { state, updateGoalDetails } = useAssessmentContext();
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  
  // Get all qualifying questions for selected goals
  const allQuestions = getAllQualifyingQuestions(state.selectedGoals, state.availableGoals);
  
  // Initialize responses from state if available
  useEffect(() => {
    if (state.goalDetails && Object.keys(state.goalDetails).length > 0) {
      setResponses(state.goalDetails);
    } else {
      // Initialize empty responses
      const initialResponses = {};
      allQuestions.forEach(question => {
        initialResponses[question.id] = "";
      });
      setResponses(initialResponses);
    }
    // TEST: Responses are initialized correctly from state or with empty values
  }, []);
  
  // Handle response change
  function handleResponseChange(questionId, value) {
    setResponses(prevResponses => ({
      ...prevResponses,
      [questionId]: value
    }));
    
    // Clear error for this question if it exists
    if (errors[questionId]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [questionId]: ""
      }));
    }
    // TEST: Responses are updated when input changes
  }
  
  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    
    // Validate responses
    const validationErrors = validateQualifyingResponses(allQuestions, responses);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // TEST: Validation errors are displayed when form is invalid
      return;
    }
    
    // Update goal details in assessment state
    updateGoalDetails(responses);
    
    // Navigate to next step
    goToStep("budget-timeline");
    // TEST: Navigation occurs after successful form submission
  }
  
  return (
    <div className="qualifying-questions-page">
      <h1>Tell us more about your goals</h1>
      <p>Answer these questions to help us understand your specific needs better.</p>
      
      <form onSubmit={handleSubmit}>
        {state.selectedGoals.map(goal => (
          <div key={goal.id} className="goal-section">
            <h2>{goal.title}</h2>
            
            {getQuestionsForGoal(goal.id, allQuestions).map(question => (
              <QuestionRenderer
                key={question.id}
                question={question}
                value={responses[question.id] || ""}
                onChange={value => handleResponseChange(question.id, value)}
                error={errors[question.id]}
              />
            ))}
          </div>
        ))}
        
        <div className="form-actions">
          <button type="button" onClick={() => goToStep("goals-selection")} className="secondary-button">
            Back
          </button>
          <button type="submit" className="primary-button">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

// Get all qualifying questions for selected goals
function getAllQualifyingQuestions(selectedGoals, availableGoals) {
  const allQuestions = [];
  
  selectedGoals.forEach(selectedGoal => {
    const goalConfig = availableGoals.find(g => g.id === selectedGoal.id);
    if (goalConfig && goalConfig.qualifyingQuestions) {
      allQuestions.push(...goalConfig.qualifyingQuestions);
    }
  });
  
  return allQuestions;
  // TEST: All qualifying questions for selected goals are returned
}

// Get questions for a specific goal
function getQuestionsForGoal(goalId, allQuestions) {
  return allQuestions.filter(question => question.id.startsWith(goalId));
  // TEST: Questions are correctly filtered by goal ID
}

// Validate qualifying responses
function validateQualifyingResponses(questions, responses) {
  const errors = {};
  
  questions.forEach(question => {
    if (question.required && (!responses[question.id] || responses[question.id] === "")) {
      errors[question.id] = `Please answer this question`;
    }
  });
  
  return errors;
  // TEST: Validation correctly identifies unanswered required questions
}
```

## 6. Budget and Timeline Page

```javascript
// Budget and timeline page component
function BudgetTimelinePage() {
  const { state, updateBudgetTimeline } = useAssessmentContext();
  const [formData, setFormData] = useState({
    budget: state.budgetTimeline?.budget || "",
    timeline: state.budgetTimeline?.timeline || "",
    priority: state.budgetTimeline?.priority || "medium"
  });
  const [errors, setErrors] = useState({});
  
  // Budget options
  const budgetOptions = [
    { id: "under-10k", label: "Under $10,000" },
    { id: "10k-50k", label: "$10,000 - $50,000" },
    { id: "50k-100k", label: "$50,000 - $100,000" },
    { id: "100k-500k", label: "$100,000 - $500,000" },
    { id: "over-500k", label: "Over $500,000" }
  ];
  
  // Timeline options
  const timelineOptions = [
    { id: "0-3-months", label: "0-3 months" },
    { id: "3-6-months", label: "3-6 months" },
    { id: "6-12-months", label: "6-12 months" },
    { id: "1-2-years", label: "1-2 years" },
    { id: "over-2-years", label: "Over 2 years" }
  ];
  
  // Priority options
  const priorityOptions = [
    { id: "low", label: "Low" },
    { id: "medium", label: "Medium" },
    { id: "high", label: "High" },
    { id: "critical", label: "Critical" }
  ];
  
  // Handle input changes
  function handleInputChange(field, value) {
    setFormData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [field]: ""
      }));
    }
    // TEST: Form data is updated when input changes
  }
  
  // Handle form submission
  function handleSubmit(event) {
    event.preventDefault();
    
    // Validate form data
    const validationErrors = validateBudgetTimeline(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // TEST: Validation errors are displayed when form is invalid
      return;
    }
    
    // Update budget and timeline in assessment state
    updateBudgetTimeline(formData);
    
    // Navigate to next step
    goToStep("results");
    // TEST: Navigation occurs after successful form submission
  }
  
  return (
    <div className="budget-timeline-page">
      <h1>Budget and Timeline</h1>
      <p>Tell us about your investment plans for AI implementation.</p>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>What is your estimated budget for AI implementation?</label>
          <div className="radio-options">
            {budgetOptions.map(option => (
              <div key={option.id} className="radio-option">
                <input
                  type="radio"
                  id={`budget-${option.id}`}
                  name="budget"
                  value={option.id}
                  checked={formData.budget === option.id}
                  onChange={() => handleInputChange("budget", option.id)}
                />
                <label htmlFor={`budget-${option.id}`}>{option.label}</label>
              </div>
            ))}
          </div>
          {errors.budget && <div className="error-message">{errors.budget}</div>}
        </div>
        
        <div className="form-group">
          <label>What is your expected timeline for implementation?</label>
          <div className="radio-options">
            {timelineOptions.map(option => (
              <div key={option.id} className="radio-option">
                <input
                  type="radio"
                  id={`timeline-${option.id}`}
                  name="timeline"
                  value={option.id}
                  checked={formData.timeline === option.id}
                  onChange={() => handleInputChange("timeline", option.id)}
                />
                <label htmlFor={`timeline-${option.id}`}>{option.label}</label>
              </div>
            ))}
          </div>
          {errors.timeline && <div className="error-message">{errors.timeline}</div>}
        </div>
        
        <div className="form-group">
          <label>What is the priority level for this initiative?</label>
          <div className="radio-options">
            {priorityOptions.map(option => (
              <div key={option.id} className="radio-option">
                <input
                  type="radio"
                  id={`priority-${option.id}`}
                  name="priority"
                  value={option.id}
                  checked={formData.priority === option.id}
                  onChange={() => handleInputChange("priority", option.id)}
                />
                <label htmlFor={`priority-${option.id}`}>{option.label}</label>
              </div>
            ))}
          </div>
          {errors.priority && <div className="error-message">{errors.priority}</div>}
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => goToStep("qualifying-questions")} className="secondary-button">
            Back
          </button>
          <button type="submit" className="primary-button">
            Continue
          </button>
        </div>
      </form>
    </div>
  );
}

// Validate budget and timeline data
function validateBudgetTimeline(data) {
  const errors = {};
  
  if (!data.budget) {
    errors.budget = "Please select an estimated budget";
  }
  
  if (!data.timeline) {
    errors.timeline = "Please select an expected timeline";
  }
  
  if (!data.priority) {
    errors.priority = "Please select a priority level";
  }
  
  return errors;
  // TEST: Validation correctly identifies missing selections
}
```

## 7. Results Page

```javascript
// Results page component
function ResultsPage() {
  const { state } = useAssessmentContext();
  const [score, setScore] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  
  // Calculate score and recommendations when component mounts
  useEffect(() => {
    const calculatedScore = calculateMaturityScore(state);
    setScore(calculatedScore);
    
    const generatedRecommendations = generateRecommendations(state, calculatedScore);
    setRecommendations(generatedRecommendations);
    // TEST: Score and recommendations are calculated on component mount
  }, []);
  
  // Handle restart assessment
  function handleRestart() {
    resetAssessment();
    goToStep("demographics");
    // TEST: Assessment is reset and user is navigated to first step
  }
  
  // Handle download report
  function handleDownloadReport() {
    const reportData = {
      organization: state.organization,
      journeyStatus: state.journeyStatus,
      selectedGoals: state.selectedGoals,
      goalDetails: state.goalDetails,
      budgetTimeline: state.budgetTimeline,
      score,
      recommendations
    };
    
    generatePDF(reportData);
    // TEST: PDF report is generated with all assessment data
  }
  
  return (
    <div className="results-page">
      <h1>Your AI Maturity Assessment Results</h1>
      
      {score !== null ? (
        <>
          <div className="score-section">
            <h2>Your AI Maturity Score</h2>
            <div className="score-display">
              <div className="score-value">{score}</div>
              <div className="score-label">out of 100</div>
            </div>
            
            <div className="score-breakdown">
              <h3>Score Breakdown</h3>
              <div className="score-categories">
                <div className="score-category">
                  <div className="category-label">Current Implementation</div>
                  <div className="category-score">{calculateImplementationScore(state)}/40</div>
                </div>
                <div className="score-category">
                  <div className="category-label">Strategic Alignment</div>
                  <div className="category-score">{calculateStrategyScore(state)}/30</div>
                </div>
                <div className="score-category">
                  <div className="category-label">Resource Readiness</div>
                  <div className="category-score">{calculateReadinessScore(state)}/30</div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="recommendations-section">
            <h2>Recommendations</h2>
            <ul className="recommendations-list">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="recommendation-item">
                  <h3>{recommendation.title}</h3>
                  <p>{recommendation.description}</p>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="actions-section">
            <button onClick={handleDownloadReport} className="primary-button">
              Download Full Report
            </button>
            <button onClick={handleRestart} className="secondary-button">
              Start New Assessment
            </button>
          </div>
        </>
      ) : (
        <div className="loading">Calculating your results...</div>
      )}
    </div>
  );
}

// Calculate overall maturity score
function calculateMaturityScore(state) {
  // Implementation score (40% of total)
  const implementationScore = calculateImplementationScore(state);
  
  // Strategy score (30% of total)
  const strategyScore = calculateStrategyScore(state);
  
  // Readiness score (30% of total)
  const readinessScore = calculateReadinessScore(state);
  
  // Calculate total score (weighted sum)
  const totalScore = implementationScore + strategyScore + readinessScore;
  
  return Math.round(totalScore);
  // TEST: Overall score is correctly calculated from component scores
}

// Calculate implementation score (40% of total)
function calculateImplementationScore(state) {
  let score = 0;
  
  // Score based on journey status
  switch(state.journeyStatus.type) {
    case "not-started":
      score += 0;
      break;
    case "exploring":
      score += 10;
      break;
    case "implementing":
      score += 25;
      break;
    case "scaling":
      score += 35;
      break;
  }
  
  // Additional points based on journey responses
  // This would be more detailed in a real implementation
  const journeyResponses = state.journeyStatus.responses || {};
  if (Object.keys(journeyResponses).length > 0) {
    score += 5;
  }
  
  // Cap at 40 points maximum
  return Math.min(score, 40);
  // TEST: Implementation score is correctly calculated based on journey status
}

// Calculate strategy score (30% of total)
function calculateStrategyScore(state) {
  let score = 0;
  
  // Score based on selected goals
  if (state.selectedGoals && state.selectedGoals.length > 0) {
    // Base points for having goals
    score += 10;
    
    // Additional points based on number of goals (up to 3 goals)
    score += Math.min(state.selectedGoals.length, 3) * 3;
  }
  
  // Score based on goal details/qualifying questions
  if (state.goalDetails && Object.keys(state.goalDetails).length > 0) {
    score += 5;
  }
  
  // Score based on priority
  if (state.budgetTimeline?.priority === "high" || state.budgetTimeline?.priority === "critical") {
    score += 5;
  }
  
  // Cap at 30 points maximum
  return Math.min(score, 30);
  // TEST: Strategy score is correctly calculated based on goals and priorities
}

// Calculate readiness score (30% of total)
function calculateReadinessScore(state) {
  let score = 0;
  
  // Score based on budget
  if (state.budgetTimeline?.budget) {
    switch(state.budgetTimeline.budget) {
      case "under-10k":
        score += 2;
        break;
      case "10k-50k":
        score += 5;
        break;
      case "50k-100k":
        score += 8;
        break;
      case "100k-500k":
        score += 12;
        break;
      case "over-500k":
        score += 15;
        break;
    }
  }
  
  // Score based on timeline
  if (state.budgetTimeline?.timeline) {
    switch(state.budgetTimeline.timeline) {
      case "0-3-months":
        score += 15;
        break;
      case "3-6-months":
        score += 12;
        break;
      case "6-12-months":
        score += 8;
        break;
      case "1-2-years":
        score += 5;
        break;
      case "over-2-years":
        score += 2;
        break;
    }
  }
  
  // Cap at 30 points maximum
  return Math.min(score, 30);
  // TEST: Readiness score is correctly calculated based on budget and timeline
}

// Generate recommendations based on assessment data
function generateRecommendations(state, score) {
  const recommendations = [];
  
  // Basic recommendation based on overall score
  if (score < 30) {
    recommendations.push({
      title: "Establish AI Foundations",
      description: "Focus on building AI literacy within your organization and identifying specific use cases where AI can provide value."
    });
  } else if (score < 60) {
    recommendations.push({
      title: "Expand AI Capabilities",
      description: "Begin implementing AI solutions in targeted areas while developing a more comprehensive AI strategy."
    });
  } else if (score < 85) {
    recommendations.push({
      title: "Scale AI Initiatives",
      description: "Expand successful AI implementations across the organization and establish governance frameworks for AI."
    });
  } else {
    recommendations.push({
      title: "Optimize AI Operations",
      description: "Focus on continuous improvement of AI systems and exploring cutting-edge AI applications."
    });
  }
  
  // Additional recommendations based on journey status
  switch(state.journeyStatus.type) {
    case "not-started":
      recommendations.push({
        title: "Begin with Education",
        description: "Invest in AI literacy for key stakeholders and identify potential AI champions within your organization."
      });
      break;
    case "exploring":
      recommendations.push({
        title: "Move from Exploration to Pilots",
        description: "Select 1-2 high-value use cases and implement focused pilot projects to demonstrate AI value."
      });
      break;
    // Additional cases for other journey statuses
  }
  
  // Recommendations based on selected goals
  if (state.selectedGoals) {
    state.selectedGoals.forEach(goal => {
      switch(goal.id) {
        case "automate-operations":
          recommendations.push({
            title: "Automation Strategy",
            description: "Identify repetitive, rule-based processes that consume significant time and prioritize these for automation."
          });
          break;
        case "enhance-customer-experience":
          recommendations.push({
            title: "Customer Experience Enhancement",
            description: "Implement AI-driven personalization and predictive analytics to anticipate customer needs and improve satisfaction."
          });
          break;
        // Additional cases for other goals
      }
    });
  }
  
  // Limit to 5 recommendations maximum
  return recommendations.slice(0, 5);
  // TEST: Appropriate recommendations are generated based on assessment data
}
```