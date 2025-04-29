# AI Maturity Assessment Application - Requirements

## Project Overview

The AI Maturity Assessment application is designed to guide users through an assessment process that evaluates their organization's current AI maturity level and provides recommendations for advancement. The application follows a structured flow with branching paths based on user responses, ultimately calculating an AI maturity score and providing tailored recommendations.

## Functional Requirements

### 1. User Interface
- **FR1.1**: The application must have a clean, simple UX with appropriate CSS styling
- **FR1.2**: The application must be responsive and accessible across devices
- **FR1.3**: The application must provide clear navigation between assessment steps
- **FR1.4**: The application must visually indicate progress through the assessment

### 2. Assessment Flow
- **FR2.1**: The application must guide users through a sequential assessment journey
- **FR2.2**: The application must collect demographic information (industry, company size)
- **FR2.3**: The application must assess current AI journey status with branching paths
- **FR2.4**: The application must present assessment questions based on previous answers
- **FR2.5**: The application must allow users to select goals from predefined options
- **FR2.6**: The application must ask qualifying questions for each selected goal
- **FR2.7**: The application must collect budget and timeline information
- **FR2.8**: The application must calculate and display an AI maturity score
- **FR2.9**: The application must provide recommendations based on assessment results

### 3. Qualifying Questions
- **FR3.1**: For "Automate Operations" goal, the application must ask about manual hours spent
- **FR3.2**: For each green box option, the application must ask relevant qualifying questions
- **FR3.3**: Qualifying questions must adapt based on previous answers

### 4. Scoring and Recommendations
- **FR4.1**: The application must calculate an AI maturity score based on all collected data
- **FR4.2**: The application must generate tailored recommendations based on the score and responses
- **FR4.3**: The application must display the maturity score on a clear scale
- **FR4.4**: The application must provide actionable next steps based on the assessment

### 5. Data Management
- **FR5.1**: The application must store user responses during the assessment session
- **FR5.2**: The application must handle state management for the multi-step process
- **FR5.3**: The application must validate all user inputs
- **FR5.4**: The application must allow users to review and edit their responses before submission

## Non-Functional Requirements

### 1. Performance
- **NFR1.1**: The application must load each assessment step in under 2 seconds
- **NFR1.2**: The application must calculate and display results within 3 seconds of submission

### 2. Usability
- **NFR2.1**: The application must be intuitive with minimal learning curve
- **NFR2.2**: The application must provide clear instructions at each step
- **NFR2.3**: The application must use consistent design patterns throughout

### 3. Reliability
- **NFR3.1**: The application must maintain state if the user refreshes the page
- **NFR3.2**: The application must handle input errors gracefully
- **NFR3.3**: The application must work across modern browsers (Chrome, Firefox, Safari, Edge)

### 4. Security
- **NFR4.1**: The application must secure any collected data
- **NFR4.2**: The application must comply with relevant data protection regulations

## Edge Cases and Constraints

### Edge Cases
- **EC1**: User leaves assessment midway and returns later
- **EC2**: User selects contradictory goals or responses
- **EC3**: User attempts to skip required questions
- **EC4**: User enters invalid data formats
- **EC5**: User has no prior AI experience but wants advanced recommendations
- **EC6**: Assessment is started on one device and continued on another

### Constraints
- **CON1**: The application must work without requiring user accounts
- **CON2**: The assessment must be completable within 15 minutes
- **CON3**: The application must not require external APIs for core functionality
- **CON4**: The application must work without requiring installation of additional software

## Acceptance Criteria

### Demographic Collection
- **AC1.1**: User can select their industry from a predefined list
- **AC1.2**: User can specify their company size from predefined ranges
- **AC1.3**: User cannot proceed without providing demographic information

### AI Journey Status
- **AC2.1**: User can select their current AI journey status
- **AC2.2**: Different follow-up questions appear based on selected journey status
- **AC2.3**: User can navigate back to change their journey status selection

### Goals Selection
- **AC3.1**: User can select multiple goals from the available options
- **AC3.2**: Relevant qualifying questions appear for each selected goal
- **AC3.3**: User must answer all qualifying questions for selected goals

### Maturity Score
- **AC4.1**: System calculates a maturity score on a defined scale (e.g., 0-100)
- **AC4.2**: Score is visually represented with clear indicators of maturity level
- **AC4.3**: Recommendations are provided based on the calculated score

### User Experience
- **AC5.1**: User can navigate forward and backward through the assessment
- **AC5.2**: User can see their progress through the assessment
- **AC5.3**: User receives clear feedback upon assessment completion