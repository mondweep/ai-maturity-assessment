let userAnswers = {}; // Store { qId: { value: number, qualifyingAnswer: string|number|null } }

function saveResponse(questionId, value, qualifyingAnswer) {
    userAnswers[questionId] = { value: value, qualifyingAnswer: qualifyingAnswer !== null ? qualifyingAnswer : null };
    localStorage.setItem('userAnswers', JSON.stringify(userAnswers)); // Persist to local storage
}

function getResponse(questionId) {
    // Retrieve userAnswers from local storage
    const storedAnswers = localStorage.getItem('userAnswers');
    userAnswers = storedAnswers ? JSON.parse(storedAnswers) : {};
    return userAnswers[questionId] || null;
}

export { saveResponse, getResponse };
