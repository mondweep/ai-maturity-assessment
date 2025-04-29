import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { generateUniqueId, debounce } from '../utils/helpers'; // Assuming helpers.js is in ../utils

const AssessmentContext = createContext();

export const useAssessmentState = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessmentState must be used within an AssessmentProvider');
  }
  return context;
};

const SESSION_STORAGE_KEY = 'assessmentSessionId';
const STATE_STORAGE_KEY_PREFIX = 'assessmentState_';

export const AssessmentProvider = ({ children }) => {
  const [sessionId, setSessionId] = useState(null);
  const [assessmentState, setAssessmentState] = useState({});
  const [isLoading, setIsLoading] = useState(true); // Start loading

  // Initialize sessionId and load state from sessionStorage
  useEffect(() => {
    let storedSessionId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!storedSessionId) {
      storedSessionId = generateUniqueId();
      sessionStorage.setItem(SESSION_STORAGE_KEY, storedSessionId);
    }
    setSessionId(storedSessionId);

    // Load state associated with this session ID
    const storedState = sessionStorage.getItem(`${STATE_STORAGE_KEY_PREFIX}${storedSessionId}`);
    if (storedState) {
      try {
        setAssessmentState(JSON.parse(storedState));
      } catch (error) {
        console.error("Failed to parse stored assessment state:", error);
        // Initialize with default state if parsing fails
        setAssessmentState({
          currentPage: 0,
          answers: {},
          scores: {},
          maturityLevel: null,
          qualifyingAnswers: {},
          isComplete: false,
        });
      }
    } else {
       // Initialize with default state if nothing is stored
       setAssessmentState({
        currentPage: 0,
        answers: {},
        scores: {},
        maturityLevel: null,
        qualifyingAnswers: {},
        isComplete: false,
      });
    }
    setIsLoading(false); // Finished loading
  }, []);

  // Debounced save function
  const saveStateToSessionStorage = useCallback(debounce((id, state) => {
    if (id) {
      try {
        sessionStorage.setItem(`${STATE_STORAGE_KEY_PREFIX}${id}`, JSON.stringify(state));
        console.log('State saved for session:', id);
      } catch (error) {
        console.error("Failed to save assessment state to sessionStorage:", error);
      }
    }
  }, 500), []); // Debounce save by 500ms

  // Update state and save to sessionStorage whenever assessmentState changes
  useEffect(() => {
    if (sessionId && !isLoading) { // Only save after initial load/session ID generation
      saveStateToSessionStorage(sessionId, assessmentState);
    }
  }, [assessmentState, sessionId, isLoading, saveStateToSessionStorage]);

  // Function to update a specific answer
  const updateAnswer = useCallback((questionId, answerValue) => {
    setAssessmentState(prevState => ({
      ...prevState,
      answers: {
        ...prevState.answers,
        [questionId]: answerValue,
      },
    }));
  }, []);

  // Function to update qualifying answer
   const updateQualifyingAnswer = useCallback((questionId, answerValue) => {
    setAssessmentState(prevState => ({
      ...prevState,
      qualifyingAnswers: {
        ...prevState.qualifyingAnswers,
        [questionId]: answerValue,
      },
    }));
  }, []);


  // Function to navigate pages
  const goToPage = useCallback((pageIndex) => {
    setAssessmentState(prevState => ({
      ...prevState,
      currentPage: pageIndex,
    }));
  }, []);

  // Function to calculate scores (placeholder)
  const calculateScores = useCallback(() => {
    // Placeholder: Actual score calculation logic will go here
    console.log("Calculating scores based on:", assessmentState.answers);
    // Example score update (replace with actual logic)
    setAssessmentState(prevState => ({
      ...prevState,
      scores: { /* calculated scores */ },
      maturityLevel: 'Calculated Level', // Replace with actual level calculation
      isComplete: true, // Mark as complete after calculation
    }));
  }, [assessmentState.answers]);


  const value = {
    sessionId,
    assessmentState,
    setAssessmentState, // Provide direct access if needed, but prefer specific updaters
    updateAnswer,
    updateQualifyingAnswer,
    goToPage,
    calculateScores,
    isLoading, // Expose loading state
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};