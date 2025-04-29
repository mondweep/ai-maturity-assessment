import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App'; // Assuming App.js is the main entry point
import { AssessmentProvider } from '../context/AssessmentContext'; // Import the provider

// Mock sessionStorage for testing persistence if needed
const mockSessionStorage = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'sessionStorage', {
  value: mockSessionStorage,
});

// Helper function to render App with provider
const renderApp = () => {
  return render(
    <AssessmentProvider>
      <App />
    </AssessmentProvider>
  );
};

describe('Assessment Navigation Flow', () => {
  beforeEach(() => {
    // Clear storage and mocks before each test
    mockSessionStorage.clear();
    jest.clearAllMocks();
    // Mock initial session ID generation if needed
    jest.spyOn(require('../utils/helpers'), 'generateUniqueId').mockReturnValue('test-nav-session');
  });

  test('renders the initial Demographics page', async () => {
    renderApp();
    // Wait for any initial loading
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());
    // Check for a heading specific to the Demographics page (based on pseudocode)
    // THIS WILL FAIL until DemographicsPage is implemented
    expect(screen.getByRole('heading', { name: /Tell us about your organization/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Industry/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Company Size/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Continue/i })).toBeInTheDocument();
  });

  test('prevents navigation from Demographics page with invalid input', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check that we are still on the Demographics page
    expect(screen.getByRole('heading', { name: /Tell us about your organization/i })).toBeInTheDocument();
    // Check for validation errors (based on pseudocode)
    // THIS WILL FAIL until validation is implemented
    expect(await screen.findByText(/Please select your industry/i)).toBeInTheDocument();
    expect(await screen.findByText(/Please select your company size/i)).toBeInTheDocument();
  });

  test('navigates from Demographics to Journey Status page with valid input', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });

    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check for the heading of the Journey Status page (based on pseudocode)
    // THIS WILL FAIL until JourneyStatusPage is implemented and navigation works
    expect(await screen.findByRole('heading', { name: /Where are you in your AI journey?/i })).toBeInTheDocument();
  });

  test('navigates back from Journey Status to Demographics page', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Simulate navigation to Journey Status first
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });

    // Find and click the 'Back' button (assuming it exists)
    // THIS WILL FAIL until the Back button and its functionality are implemented
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check if we are back on the Demographics page
    expect(await screen.findByRole('heading', { name: /Tell us about your organization/i })).toBeInTheDocument();
    // Check if the previous input is still there (state persistence)
    expect(screen.getByLabelText(/Industry/i)).toHaveValue('technology');
    expect(screen.getByLabelText(/Company Size/i)).toHaveValue('51-200');
  });

  test('prevents navigation from Journey Status page if no status selected', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate past Demographics
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });

    // Click Continue without selecting a status
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check we are still on the Journey Status page and see an error
    // THIS WILL FAIL until JourneyStatusPage and validation are implemented
    expect(screen.getByRole('heading', { name: /Where are you in your AI journey?/i })).toBeInTheDocument();
    expect(await screen.findByText(/Please select your current AI journey status/i)).toBeInTheDocument();
  });

  test('navigates from Journey Status to Journey Questions page after selecting status', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate past Demographics
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });

    // Select a status (assuming clickable cards based on pseudocode)
    // THIS WILL FAIL until JourneyStatusPage is implemented
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div')); // Click the card containing the heading

    // Click Continue
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check for the heading of the Journey Questions page
    // THIS WILL FAIL until JourneyQuestionsPage is implemented and navigation works
    expect(await screen.findByRole('heading', { name: /Tell us more about your AI journey/i })).toBeInTheDocument();
    // Check if questions specific to 'exploring' status are rendered (example)
    // expect(screen.getByText(/What AI tools are you experimenting with?/i)).toBeInTheDocument();
  });

   test('navigates back from Journey Questions to Journey Status page', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate past Demographics
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Navigate past Journey Status
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Wait for Journey Questions page
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });

    // Click Back button
    // THIS WILL FAIL until JourneyQuestionsPage and Back button are implemented
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check we are back on Journey Status page
    expect(await screen.findByRole('heading', { name: /Where are you in your AI journey?/i })).toBeInTheDocument();
    // Check if the previously selected status is still selected (state persistence)
    // expect(screen.getByRole('heading', { name: /Exploring/i }).closest('div')).toHaveClass('selected');
  });

  test('prevents navigation from Journey Questions if required questions unanswered', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate past Demographics & Journey Status
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Wait for Journey Questions page
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });

    // Click Continue without answering questions
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check we are still on Journey Questions page and see errors
    // THIS WILL FAIL until JourneyQuestionsPage, questions, and validation are implemented
    expect(screen.getByRole('heading', { name: /Tell us more about your AI journey/i })).toBeInTheDocument();
    // Assuming a required question exists (based on pseudocode structure)
    // expect(await screen.findByText(/Please answer this question/i)).toBeInTheDocument();
  });

  test('navigates from Journey Questions to Goals Selection page with valid input', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate past Demographics & Journey Status (select 'exploring')
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Wait for Journey Questions page
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });

    // Answer required questions (assuming a text input for simplicity)
    // THIS WILL FAIL until JourneyQuestionsPage and questions are implemented
    // const questionInput = screen.getByLabelText(/What AI tools are you experimenting with?/i);
    // fireEvent.change(questionInput, { target: { value: 'Testing tools' } });

    // Click Continue
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check for the heading of the Goals Selection page
    // THIS WILL FAIL until GoalsSelectionPage is implemented and navigation works
    expect(await screen.findByRole('heading', { name: /Select your AI goals/i })).toBeInTheDocument();
  });

   test('navigates back from Goals Selection to Journey Questions page', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate past Demographics, Journey Status, Journey Questions
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions allows navigation
    // fireEvent.change(screen.getByLabelText(/What AI tools are you experimenting with?/i), { target: { value: 'Testing tools' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Wait for Goals Selection page
    await screen.findByRole('heading', { name: /Select your AI goals/i });

    // Click Back button
    // THIS WILL FAIL until GoalsSelectionPage and Back button are implemented
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check we are back on Journey Questions page
    expect(await screen.findByRole('heading', { name: /Tell us more about your AI journey/i })).toBeInTheDocument();
    // Check if previous answers are still there (state persistence)
    // expect(screen.getByLabelText(/What AI tools are you experimenting with?/i)).toHaveValue('Testing tools');
  });

  test('prevents navigation from Goals Selection if no goals selected', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions allows navigation
    // fireEvent.change(screen.getByLabelText(/What AI tools are you experimenting with?/i), { target: { value: 'Testing tools' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Wait for Goals Selection page
    await screen.findByRole('heading', { name: /Select your AI goals/i });

    // Click Continue without selecting goals
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check we are still on Goals Selection page and see an error
    // THIS WILL FAIL until GoalsSelectionPage and validation are implemented
    expect(screen.getByRole('heading', { name: /Select your AI goals/i })).toBeInTheDocument();
    expect(await screen.findByText(/Please select at least one goal/i)).toBeInTheDocument();
  });

  test('navigates from Goals Selection to Qualifying Questions page after selecting goals', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions allows navigation
    // fireEvent.change(screen.getByLabelText(/What AI tools are you experimenting with?/i), { target: { value: 'Testing tools' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i }));

    // Wait for Goals Selection page
    await screen.findByRole('heading', { name: /Select your AI goals/i });

    // Select a goal (assuming clickable cards)
    // THIS WILL FAIL until GoalsSelectionPage is implemented
    const automateGoal = screen.getByRole('heading', { name: /Automate Operations/i });
    fireEvent.click(automateGoal.closest('div')); // Click the card

    // Click Continue
    const continueButton = screen.getByRole('button', { name: /Continue/i });
    fireEvent.click(continueButton);

    // Check for the heading of the Qualifying Questions page
    // THIS WILL FAIL until QualifyingQuestionsPage is implemented and navigation works
    expect(await screen.findByRole('heading', { name: /Tell us more about your selected goals/i })).toBeInTheDocument(); // Assuming this heading
    // Check if qualifying questions for the selected goal are rendered
    // expect(screen.getByText(/How many hours per week does your team spend on manual tasks/i)).toBeInTheDocument();
  });

  test('navigates back from Qualifying Questions to Goals Selection page', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Qualifying Questions
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demographics -> Journey Status
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    const exploringOption = screen.getByRole('heading', { name: /Exploring/i });
    fireEvent.click(exploringOption.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey Status -> Journey Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions allows navigation
    // fireEvent.change(screen.getByLabelText(/What AI tools are you experimenting with?/i), { target: { value: 'Testing tools' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey Questions -> Goals Selection
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    const automateGoal = screen.getByRole('heading', { name: /Automate Operations/i });
    fireEvent.click(automateGoal.closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals Selection -> Qualifying Questions

    // Wait for Qualifying Questions page
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });

    // Click Back button
    // THIS WILL FAIL until QualifyingQuestionsPage and Back button are implemented
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check we are back on Goals Selection page
    expect(await screen.findByRole('heading', { name: /Select your AI goals/i })).toBeInTheDocument();
    // Check if the previously selected goal is still selected (state persistence)
    // expect(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div')).toHaveClass('selected');
  });

  test('prevents navigation from Qualifying Questions if required questions unanswered', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Qualifying Questions
    // (Simplified navigation for brevity)
    // Assume user selected 'Automate Operations' goal
    // TODO: Refactor navigation setup into a helper function
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying

    // Wait for Qualifying Questions page
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });

    // Click Continue without answering qualifying questions
    // Note: Button text might change here based on pseudocode (Continue to Budget)
    const continueButton = screen.getByRole('button', { name: /Continue to Budget/i });
    fireEvent.click(continueButton);

    // Check we are still on Qualifying Questions page and see errors
    // THIS WILL FAIL until QualifyingQuestionsPage, questions, and validation are implemented
    expect(screen.getByRole('heading', { name: /Tell us more about your selected goals/i })).toBeInTheDocument();
    // Assuming a required question exists for the selected goal
    // expect(await screen.findByText(/Please answer this question/i)).toBeInTheDocument(); // Or more specific error
  });

  test('navigates from Qualifying Questions to Budget Info page with valid input', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Qualifying Questions
    // (Simplified navigation)
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying

    // Wait for Qualifying Questions page
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });

    // Answer required qualifying questions (assuming a scale input for 'Automate Operations')
    // THIS WILL FAIL until QualifyingQuestionsPage and questions are implemented
    // const hoursInput = screen.getByLabelText(/How many hours per week/i);
    // fireEvent.change(hoursInput, { target: { value: '10' } });

    // Click Continue
    const continueButton = screen.getByRole('button', { name: /Continue to Budget/i });
    fireEvent.click(continueButton);

    // Check for the heading of the Budget Info page
    // THIS WILL FAIL until BudgetInfoPage is implemented and navigation works
    expect(await screen.findByRole('heading', { name: /Budget and Timeline/i })).toBeInTheDocument(); // Assuming this heading
  });

  test('navigates back from Budget Info to Qualifying Questions page', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Budget Info
    // (Simplified navigation)
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });
    // Assume answering qualifying questions
    // const hoursInput = screen.getByLabelText(/How many hours per week/i);
    // fireEvent.change(hoursInput, { target: { value: '10' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue to Budget/i })); // Qualifying -> Budget

    // Wait for Budget Info page
    await screen.findByRole('heading', { name: /Budget and Timeline/i });

    // Click Back button
    // THIS WILL FAIL until BudgetInfoPage and Back button are implemented
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check we are back on Qualifying Questions page
    expect(await screen.findByRole('heading', { name: /Tell us more about your selected goals/i })).toBeInTheDocument();
    // Check if previous answers are still there (state persistence)
    // expect(screen.getByLabelText(/How many hours per week/i)).toHaveValue('10');
  });

  test('prevents navigation from Budget Info if required fields missing', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Budget Info
    // (Simplified navigation for brevity)
    // TODO: Refactor navigation setup into a helper function
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });
    // Assume answering qualifying questions
    fireEvent.click(screen.getByRole('button', { name: /Continue to Budget/i })); // Qualifying -> Budget

    // Wait for Budget Info page
    await screen.findByRole('heading', { name: /Budget and Timeline/i });

    // Click Continue without filling budget info
    // Note: Button text might change here based on pseudocode (Calculate Results)
    const calculateButton = screen.getByRole('button', { name: /Calculate Results/i });
    fireEvent.click(calculateButton);

    // Check we are still on Budget Info page and see errors
    // THIS WILL FAIL until BudgetInfoPage, fields, and validation are implemented
    expect(screen.getByRole('heading', { name: /Budget and Timeline/i })).toBeInTheDocument();
    // Assuming required fields based on pseudocode
    // expect(await screen.findByText(/Please select a budget range/i)).toBeInTheDocument();
    // expect(await screen.findByText(/Please select a timeframe/i)).toBeInTheDocument();
  });

  test('prevents navigation from Budget Info if required fields missing', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Budget Info
    // (Simplified navigation for brevity)
    // TODO: Refactor navigation setup into a helper function
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });
    // Assume answering qualifying questions
    fireEvent.click(screen.getByRole('button', { name: /Continue to Budget/i })); // Qualifying -> Budget

    // Wait for Budget Info page
    await screen.findByRole('heading', { name: /Budget and Timeline/i });

    // Click Continue without filling budget info
    // Note: Button text might change here based on pseudocode (Calculate Results)
    const calculateButton = screen.getByRole('button', { name: /Calculate Results/i });
    fireEvent.click(calculateButton);

    // Check we are still on Budget Info page and see errors
    // THIS WILL FAIL until BudgetInfoPage, fields, and validation are implemented
    expect(screen.getByRole('heading', { name: /Budget and Timeline/i })).toBeInTheDocument();
    // Assuming required fields based on pseudocode
    // expect(await screen.findByText(/Please select a budget range/i)).toBeInTheDocument();
    // expect(await screen.findByText(/Please select a timeframe/i)).toBeInTheDocument();
  });

  test('navigates from Budget Info to Results page with valid input', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through previous steps to Budget Info
    // (Simplified navigation)
     fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });
    // Assume answering qualifying questions
    fireEvent.click(screen.getByRole('button', { name: /Continue to Budget/i })); // Qualifying -> Budget

    // Wait for Budget Info page
    await screen.findByRole('heading', { name: /Budget and Timeline/i });

    // Fill in budget info (assuming select fields based on pseudocode)
    // THIS WILL FAIL until BudgetInfoPage and fields are implemented
    // fireEvent.change(screen.getByLabelText(/Budget Range/i), { target: { value: '10k-50k' } });
    // fireEvent.change(screen.getByLabelText(/Timeframe/i), { target: { value: '3-6m' } });

    // Click Calculate Results
    const calculateButton = screen.getByRole('button', { name: /Calculate Results/i });
    fireEvent.click(calculateButton);

    // Check for the heading of the Results page
    // THIS WILL FAIL until ResultsPage is implemented and navigation/calculation works
    expect(await screen.findByRole('heading', { name: /Your AI Maturity Results/i })).toBeInTheDocument(); // Assuming this heading
    // Check if score and recommendations are displayed
    // expect(screen.getByText(/Your Score:/i)).toBeInTheDocument();
    // expect(screen.getByText(/Recommendations/i)).toBeInTheDocument();
  });

   test('navigates back from Results page to Budget Info page', async () => {
    renderApp();
    await waitFor(() => expect(screen.queryByText(/Loading/i)).not.toBeInTheDocument());

    // Navigate through all steps to Results page
    // (Simplified navigation)
    fireEvent.change(screen.getByLabelText(/Industry/i), { target: { value: 'technology' } });
    fireEvent.change(screen.getByLabelText(/Company Size/i), { target: { value: '51-200' } });
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Demo -> Journey
    await screen.findByRole('heading', { name: /Where are you in your AI journey?/i });
    fireEvent.click(screen.getByRole('heading', { name: /Exploring/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Journey -> Questions
    await screen.findByRole('heading', { name: /Tell us more about your AI journey/i });
    // Assume answering questions
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Questions -> Goals
    await screen.findByRole('heading', { name: /Select your AI goals/i });
    fireEvent.click(screen.getByRole('heading', { name: /Automate Operations/i }).closest('div'));
    fireEvent.click(screen.getByRole('button', { name: /Continue/i })); // Goals -> Qualifying
    await screen.findByRole('heading', { name: /Tell us more about your selected goals/i });
    // Assume answering qualifying questions
    fireEvent.click(screen.getByRole('button', { name: /Continue to Budget/i })); // Qualifying -> Budget
    await screen.findByRole('heading', { name: /Budget and Timeline/i });
    // Assume filling budget info
    // fireEvent.change(screen.getByLabelText(/Budget Range/i), { target: { value: '10k-50k' } });
    // fireEvent.change(screen.getByLabelText(/Timeframe/i), { target: { value: '3-6m' } });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Results/i })); // Budget -> Results

    // Wait for Results page
    await screen.findByRole('heading', { name: /Your AI Maturity Results/i });

    // Click Back button
    // THIS WILL FAIL until ResultsPage and Back button are implemented
    const backButton = screen.getByRole('button', { name: /Back/i });
    fireEvent.click(backButton);

    // Check we are back on Budget Info page
    expect(await screen.findByRole('heading', { name: /Budget and Timeline/i })).toBeInTheDocument();
    // Check if previous answers are still there (state persistence)
    // expect(screen.getByLabelText(/Budget Range/i)).toHaveValue('10k-50k');
    // expect(screen.getByLabelText(/Timeframe/i)).toHaveValue('3-6m');
  });

  // Add tests for score calculation, recommendation generation, localStorage persistence

});