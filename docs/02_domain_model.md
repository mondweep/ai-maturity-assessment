# AI Maturity Assessment Application - Domain Model

## Core Entities and Relationships

This document outlines the core entities, their attributes, relationships, and data structures for the AI Maturity Assessment application.

## 1. Entity Definitions

### 1.1 Organization
Represents the organization being assessed.

**Attributes:**
- `id`: Unique identifier
- `industry`: Industry sector (e.g., Healthcare, Finance, Manufacturing)
- `companySize`: Size category (e.g., 1-50, 51-200, 201-1000, 1000+)
- `createdAt`: Timestamp of when the organization record was created

**Relationships:**
- Has one Assessment
- Has many Goals (through Assessment)

### 1.2 Assessment
Represents the overall assessment process.

**Attributes:**
- `id`: Unique identifier
- `organizationId`: Reference to the Organization
- `status`: Current status (e.g., 'in-progress', 'completed')
- `currentStep`: Current step in the assessment flow
- `maturityScore`: Calculated AI maturity score (0-100)
- `maturityLevel`: Interpreted level (e.g., 'Beginner', 'Intermediate', 'Advanced')
- `startedAt`: Timestamp when assessment was started
- `completedAt`: Timestamp when assessment was completed
- `sessionId`: Unique session identifier for state management

**Relationships:**
- Belongs to one Organization
- Has one JourneyStatus
- Has many Responses
- Has many SelectedGoals
- Has many Recommendations

### 1.3 JourneyStatus
Represents the organization's current AI journey status.

**Attributes:**
- `id`: Unique identifier
- `assessmentId`: Reference to the Assessment
- `statusType`: Type of journey status (e.g., 'Not Started', 'Exploring', 'Implementing', 'Scaling')
- `description`: Detailed description of the status
- `nextSteps`: Suggested next steps based on status

**Relationships:**
- Belongs to one Assessment
- Has many JourneyQuestions

### 1.4 JourneyQuestion
Represents questions specific to a journey status.

**Attributes:**
- `id`: Unique identifier
- `journeyStatusId`: Reference to the JourneyStatus
- `questionText`: The actual question text
- `questionType`: Type of question (e.g., 'multiple-choice', 'scale', 'text')
- `required`: Whether the question is required
- `order`: Display order of the question

**Relationships:**
- Belongs to one JourneyStatus
- Has many PossibleAnswers (for multiple-choice questions)
- Has many Responses

### 1.5 PossibleAnswer
Represents possible answers for multiple-choice questions.

**Attributes:**
- `id`: Unique identifier
- `questionId`: Reference to the Question
- `answerText`: The text of the answer
- `scoreValue`: Numeric value for scoring
- `order`: Display order of the answer

**Relationships:**
- Belongs to one Question

### 1.6 Goal
Represents potential AI goals that an organization can select.

**Attributes:**
- `id`: Unique identifier
- `name`: Name of the goal (e.g., 'Automate Operations', 'Enhance Customer Experience')
- `description`: Detailed description of the goal
- `category`: Category of the goal (e.g., 'Operational', 'Customer-facing', 'Strategic')
- `impactLevel`: Potential impact level (e.g., 'Low', 'Medium', 'High')
- `implementationComplexity`: Complexity of implementation (e.g., 'Low', 'Medium', 'High')

**Relationships:**
- Has many QualifyingQuestions
- Has many SelectedGoals

### 1.7 QualifyingQuestion
Represents questions asked for each selected goal.

**Attributes:**
- `id`: Unique identifier
- `goalId`: Reference to the Goal
- `questionText`: The actual question text
- `questionType`: Type of question (e.g., 'multiple-choice', 'scale', 'text')
- `required`: Whether the question is required
- `order`: Display order of the question
- `scoreImpact`: How much the answer impacts the maturity score

**Relationships:**
- Belongs to one Goal
- Has many PossibleAnswers (for multiple-choice questions)
- Has many Responses

### 1.8 SelectedGoal
Represents goals selected by an organization during assessment.

**Attributes:**
- `id`: Unique identifier
- `assessmentId`: Reference to the Assessment
- `goalId`: Reference to the Goal
- `priority`: Priority level assigned by the organization (e.g., 'Low', 'Medium', 'High')
- `timeframe`: Expected implementation timeframe (e.g., '0-3 months', '3-6 months', '6+ months')

**Relationships:**
- Belongs to one Assessment
- Belongs to one Goal
- Has many Responses (through QualifyingQuestions)

### 1.9 Response
Represents a user's response to a question.

**Attributes:**
- `id`: Unique identifier
- `assessmentId`: Reference to the Assessment
- `questionId`: Reference to the Question (could be JourneyQuestion or QualifyingQuestion)
- `questionType`: Type of question being answered (for polymorphic relationships)
- `answerValue`: The actual answer value
- `answerType`: Type of answer (e.g., 'selected-choice', 'scale-value', 'text')
- `scoreContribution`: How much this response contributes to the overall score
- `timestamp`: When the response was recorded

**Relationships:**
- Belongs to one Assessment
- Belongs to one Question (polymorphic)

### 1.10 BudgetInfo
Represents budget information provided by the organization.

**Attributes:**
- `id`: Unique identifier
- `assessmentId`: Reference to the Assessment
- `budgetRange`: Budget range (e.g., '<$10K', '$10K-$50K', '$50K-$200K', '$200K+')
- `timeframeMonths`: Expected implementation timeframe in months
- `resourcesAvailable`: Resources available for implementation (e.g., 'Internal team', 'External consultants', 'Both')
- `budgetApproved`: Whether budget has been approved

**Relationships:**
- Belongs to one Assessment

### 1.11 Recommendation
Represents a recommendation based on assessment results.

**Attributes:**
- `id`: Unique identifier
- `assessmentId`: Reference to the Assessment
- `title`: Short title of the recommendation
- `description`: Detailed description of the recommendation
- `priority`: Priority level (e.g., 'Low', 'Medium', 'High')
- `category`: Category of recommendation (e.g., 'Technology', 'Process', 'People')
- `implementationComplexity`: Complexity of implementation (e.g., 'Low', 'Medium', 'High')
- `estimatedTimeframe`: Estimated implementation timeframe
- `potentialImpact`: Potential impact of implementing the recommendation
- `relatedGoalIds`: References to related Goals

**Relationships:**
- Belongs to one Assessment
- Related to many Goals

## 2. State Transitions

### 2.1 Assessment Flow States
1. **Demographics Collection**
   - Initial state
   - Collects organization industry and size
   - Transitions to Journey Status Selection when demographics are complete

2. **Journey Status Selection**
   - Collects current AI journey status
   - Transitions to Journey Questions when status is selected

3. **Journey Questions**
   - Presents questions based on selected journey status
   - Transitions to Goals Selection when journey questions are complete

4. **Goals Selection**
   - Allows selection of AI goals (green box options)
   - Transitions to Qualifying Questions when goals are selected

5. **Qualifying Questions**
   - Presents questions for each selected goal
   - Transitions to Budget Info when qualifying questions are complete

6. **Budget Info**
   - Collects budget range and timeline information
   - Transitions to Results when budget info is complete

7. **Results**
   - Displays maturity score and recommendations
   - Final state

### 2.2 Scoring Process States
1. **Data Collection**
   - Gather all responses from the assessment

2. **Weighted Calculation**
   - Apply weights to different response categories
   - Calculate raw score

3. **Normalization**
   - Normalize score to 0-100 scale

4. **Level Assignment**
   - Assign maturity level based on score range

5. **Recommendation Generation**
   - Generate recommendations based on score and responses

## 3. Data Structures

### 3.1 Assessment State
```typescript
interface AssessmentState {
  currentStep: AssessmentStep;
  organization: {
    industry: string;
    companySize: string;
  };
  journeyStatus: {
    type: JourneyStatusType;
    responses: Record<string, any>;
  };
  selectedGoals: {
    id: string;
    priority: string;
    timeframe: string;
    qualifyingResponses: Record<string, any>;
  }[];
  budgetInfo: {
    budgetRange: string;
    timeframeMonths: number;
    resourcesAvailable: string;
    budgetApproved: boolean;
  };
  results: {
    maturityScore: number;
    maturityLevel: string;
    recommendations: Recommendation[];
  };
  sessionId: string;
  lastUpdated: Date;
}
```

### 3.2 Question Types
```typescript
type QuestionType = 'multiple-choice' | 'scale' | 'text' | 'boolean';

interface BaseQuestion {
  id: string;
  questionText: string;
  questionType: QuestionType;
  required: boolean;
  order: number;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: 'multiple-choice';
  possibleAnswers: {
    id: string;
    text: string;
    scoreValue: number;
  }[];
  allowMultiple: boolean;
}

interface ScaleQuestion extends BaseQuestion {
  questionType: 'scale';
  minValue: number;
  maxValue: number;
  minLabel: string;
  maxLabel: string;
  step: number;
}

interface TextQuestion extends BaseQuestion {
  questionType: 'text';
  maxLength?: number;
  placeholder?: string;
}

interface BooleanQuestion extends BaseQuestion {
  questionType: 'boolean';
  trueLabel: string;
  falseLabel: string;
  trueValue: number;
  falseValue: number;
}
```

### 3.3 Scoring Algorithm Data Structure
```typescript
interface ScoringConfig {
  journeyStatusWeights: Record<JourneyStatusType, number>;
  goalCategoryWeights: Record<string, number>;
  questionTypeWeights: Record<QuestionType, number>;
  maturityLevels: {
    level: string;
    minScore: number;
    maxScore: number;
    description: string;
  }[];
}
```

## 4. Business Rules and Invariants

### 4.1 Assessment Validation Rules
- An assessment must have organization information before proceeding
- Journey status must be selected before answering journey questions
- At least one goal must be selected before proceeding to qualifying questions
- All required questions must be answered before proceeding to the next step
- Budget information must be provided before generating results

### 4.2 Scoring Rules
- Maturity score must be between 0 and 100
- Responses to required questions have higher weight in scoring
- Journey status affects the baseline score
- More ambitious goals with concrete plans increase the maturity score
- Contradictory answers reduce confidence in the score
- Budget readiness affects implementation recommendations

### 4.3 UI State Management Rules
- Assessment state must be persisted to allow resuming
- Navigation between steps must validate completion of previous steps
- User can go back to previous steps and modify answers
- When answers are modified, dependent questions may need to be re-answered
- Score and recommendations must be recalculated when answers change

## 5. Domain Events

### 5.1 Assessment Events
- `AssessmentStarted`: Triggered when a new assessment begins
- `StepCompleted`: Triggered when a step in the assessment is completed
- `ResponseRecorded`: Triggered when a user responds to a question
- `GoalSelected`: Triggered when a user selects a goal
- `AssessmentCompleted`: Triggered when all steps are completed
- `ScoreCalculated`: Triggered when the maturity score is calculated
- `RecommendationsGenerated`: Triggered when recommendations are generated

### 5.2 Event Flow
1. User starts assessment → `AssessmentStarted`
2. User provides demographics → `StepCompleted` (Demographics)
3. User selects journey status → `StepCompleted` (Journey Status)
4. User answers journey questions → multiple `ResponseRecorded` events
5. User completes journey questions → `StepCompleted` (Journey Questions)
6. User selects goals → multiple `GoalSelected` events
7. User completes goals selection → `StepCompleted` (Goals Selection)
8. User answers qualifying questions → multiple `ResponseRecorded` events
9. User completes qualifying questions → `StepCompleted` (Qualifying Questions)
10. User provides budget info → `StepCompleted` (Budget Info)
11. System calculates score → `ScoreCalculated`
12. System generates recommendations → `RecommendationsGenerated`
13. User views results → `AssessmentCompleted`