import { saveResponse, getResponse } from './state.js';

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const startPage = document.getElementById('start-page');
    const questionPage = document.getElementById('question-page');
    const resultsPage = document.getElementById('results-page');
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options-container');
    const qualifyingQuestionContainer = document.getElementById('qualifying-question-container');
    const qualifyingQuestionLabel = document.getElementById('qualifying-question-label');
    const qualifyingInput = document.getElementById('qualifying-input');
    const startButton = document.getElementById('start-button');
    const nextButton = document.getElementById('next-button');
    const prevButton = document.getElementById('prev-button');
    const scoreDisplay = document.getElementById('score-display');
    const scoreInterpretation = document.getElementById('score-interpretation');
    const restartButton = document.getElementById('restart-button');

    // --- Assessment Data ---
    const questions = [
        {
            id: 'q1',
            text: 'How would you describe your organization\'s current use of AI?',
            options: [
                { text: 'Exploring possibilities, minimal implementation.', value: 1, requiresQualifying: false },
                { text: 'Piloting AI in specific departments/projects.', value: 2, requiresQualifying: false },
                { text: 'AI integrated into some core processes.', value: 3, requiresQualifying: false },
                { text: 'AI is central to operations and strategy.', value: 4, requiresQualifying: false },
            ],
            qualifyingQuestion: null,
        },
        {
            id: 'q2',
            text: 'What is the primary goal for AI adoption in your organization?',
            options: [
                { text: 'Improve Efficiency / Automate Operations', value: 2, requiresQualifying: true, qualifyingType: 'number', qualifyingLabel: 'Estimate manual hours spent per week on tasks AI could automate:' },
                { text: 'Enhance Customer Experience', value: 3, requiresQualifying: true, qualifyingType: 'text', qualifyingLabel: 'Describe a key customer interaction AI could improve:' },
                { text: 'Develop New Products/Services', value: 4, requiresQualifying: true, qualifyingType: 'text', qualifyingLabel: 'Outline a potential new AI-driven product/service:' },
                { text: 'Gain Competitive Advantage', value: 3, requiresQualifying: true, qualifyingType: 'text', qualifyingLabel: 'Identify a competitor\'s AI use case you aim to surpass:' },
                { text: 'Improve Decision Making', value: 2, requiresQualifying: true, qualifyingType: 'text', qualifyingLabel: 'Which key business decision could benefit most from AI insights?' },
                { text: 'Not actively pursuing AI goals currently.', value: 1, requiresQualifying: false },
            ],
            qualifyingQuestion: null, // Placeholder, handled by options
        },
        {
            id: 'q3',
            text: 'How is data managed and utilized for AI initiatives?',
            options: [
                { text: 'Data is siloed, limited accessibility for AI.', value: 1, requiresQualifying: false },
                { text: 'Some data consolidation, basic analytics in place.', value: 2, requiresQualifying: false },
                { text: 'Centralized data lake/warehouse, used for BI/some AI.', value: 3, requiresQualifying: false },
                { text: 'Mature data governance, real-time data pipelines for AI.', value: 4, requiresQualifying: false },
            ],
            qualifyingQuestion: null,
        },
        {
            id: 'q4',
            text: 'What level of AI expertise exists within your organization?',
            options: [
                { text: 'Limited awareness, reliance on external consultants.', value: 1, requiresQualifying: false },
                { text: 'Some internal champions, basic AI/ML understanding.', value: 2, requiresQualifying: false },
                { text: 'Dedicated data science/AI team, developing models.', value: 3, requiresQualifying: false },
                { text: 'Deep expertise, contributing to AI research/innovation.', value: 4, requiresQualifying: false },
            ],
            qualifyingQuestion: null,
        },
        {
            id: 'q5',
            text: 'How is AI integrated into your organizational strategy and culture?',
            options: [
                { text: 'AI is not a strategic priority.', value: 1, requiresQualifying: false },
                { text: 'Discussed, but no formal strategy or budget.', value: 2, requiresQualifying: false },
                { text: 'AI initiatives included in strategic planning, dedicated budget.', value: 3, requiresQualifying: false },
                { text: 'AI is a core pillar of strategy, fostering an AI-first culture.', value: 4, requiresQualifying: false },
            ],
            qualifyingQuestion: null,
        }
    ];

    // --- State Management ---
    let currentQuestionIndex = 0;

    // --- Functions ---

    function showPage(page) {
        startPage.classList.add('hidden');
        questionPage.classList.add('hidden');
        resultsPage.classList.add('hidden');
        page.classList.remove('hidden');
    }

    function renderQuestion() {
        const question = questions[currentQuestionIndex];
        questionText.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}: ${question.text}`;
        optionsContainer.innerHTML = ''; // Clear previous options
        qualifyingQuestionContainer.classList.add('hidden'); // Hide qualifying by default
        qualifyingInput.value = ''; // Clear previous input
        nextButton.disabled = true; // Disable next until an option is selected

        question.options.forEach((option, index) => {
            const optionId = `q${currentQuestionIndex}_option${index}`;
            const li = document.createElement('label');
            li.setAttribute('for', optionId); // Use label for better accessibility

            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = `q${currentQuestionIndex}_options`;
            radio.id = optionId;
            radio.value = option.value;
            radio.dataset.requiresQualifying = option.requiresQualifying;
            radio.dataset.qualifyingType = option.qualifyingType || '';
            radio.dataset.qualifyingLabel = option.qualifyingLabel || '';

            // Check if this option was previously selected
            const currentAnswer = userAnswers[question.id];
            if (currentAnswer && currentAnswer.value === option.value) {
                radio.checked = true;
                nextButton.disabled = !isQualifyingComplete(question.id); // Re-enable next if qualifying is done or not needed
                if (option.requiresQualifying) {
                    showQualifyingQuestion(option.qualifyingLabel, option.qualifyingType, currentAnswer.qualifyingAnswer);
                }
            }

            radio.addEventListener('change', handleOptionChange);

            li.appendChild(radio);
            li.appendChild(document.createTextNode(option.text));
            optionsContainer.appendChild(li);
        });

        prevButton.disabled = currentQuestionIndex === 0;
    }

    function handleOptionChange(event) {
        const selectedRadio = event.target;
        const questionId = questions[currentQuestionIndex].id;
        const requiresQualifying = selectedRadio.dataset.requiresQualifying === 'true';
        const qualifyingLabel = selectedRadio.dataset.qualifyingLabel;
        const qualifyingType = selectedRadio.dataset.qualifyingType;
        const selectedValue = parseInt(selectedRadio.value);

        // Use the new saveResponse function
        saveResponse(questionId, selectedValue, null);

        if (requiresQualifying) {
            showQualifyingQuestion(qualifyingLabel, qualifyingType, null); // Show qualifying, clear previous answer
            nextButton.disabled = true; // Disable next until qualifying is filled
        } else {
            qualifyingQuestionContainer.classList.add('hidden');
            qualifyingInput.value = ''; // Clear any previous qualifying input
            nextButton.disabled = false; // Enable next immediately
        }
    }

    function showQualifyingQuestion(label, type, previousAnswer) {
        qualifyingQuestionLabel.textContent = label;
        qualifyingInput.type = type === 'number' ? 'number' : 'text';
        qualifyingInput.placeholder = type === 'number' ? 'Enter a number' : 'Enter your response';
        qualifyingInput.value = previousAnswer !== null ? previousAnswer : ''; // Restore previous answer if exists
        qualifyingQuestionContainer.classList.remove('hidden');
        qualifyingInput.focus();
        // Re-validate next button status based on input
        handleQualifyingInputChange();
    }

    function handleQualifyingInputChange() {
        const questionId = questions[currentQuestionIndex].id;
        const currentAnswer = userAnswers[questionId];

        if (currentAnswer) { // Ensure an option requiring qualifying is selected
            const qualifyingValue = qualifyingInput.value.trim();
            // Use the new saveResponse function, preserving the main value
            saveResponse(questionId, currentAnswer.value, qualifyingValue);
            nextButton.disabled = qualifyingValue === ''; // Enable next only if qualifying has input
        } else {
            nextButton.disabled = true; // Should not happen if logic is correct, but safety check
        }
    }

     function isQualifyingComplete(questionId) {
        const answer = userAnswers[questionId];
        if (!answer) return false; // No answer yet

        const question = questions.find(q => q.id === questionId);
        const selectedOption = question.options.find(opt => opt.value === answer.value);

        if (!selectedOption || !selectedOption.requiresQualifying) {
            return true; // Qualifying not required or option not found (shouldn't happen)
        }

        // Qualifying is required, check if it has a non-empty answer
        return answer.qualifyingAnswer !== null && String(answer.qualifyingAnswer).trim() !== '';
    }


    function calculateScore() {
        let totalScore = 0;
        let maxPossibleScore = 0;

        questions.forEach(question => {
            const answer = userAnswers[question.id];
            if (answer) {
                totalScore += answer.value;
            }
            // Find max value for this question
            const maxOptionValue = Math.max(...question.options.map(opt => opt.value));
            maxPossibleScore += maxOptionValue;
        });

        // Normalize score to a percentage or a defined scale (e.g., 0-100)
        const percentageScore = maxPossibleScore > 0 ? Math.round((totalScore / maxPossibleScore) * 100) : 0;
        return percentageScore;
    }

    function getInterpretation(score) {
        if (score >= 80) {
            return "Leading: Your organization demonstrates a high level of AI maturity, leveraging AI strategically across operations.";
        } else if (score >= 60) {
            return "Advancing: AI is integrated into several areas, showing good progress and strategic alignment.";
        } else if (score >= 40) {
            return "Developing: AI initiatives are underway, but there's room for broader integration and strategic focus.";
        } else {
            return "Exploring: Your organization is in the early stages of AI adoption. Focus on building foundational capabilities.";
        }
    }

    function showResults() {
        const finalScore = calculateScore();
        scoreDisplay.textContent = `${finalScore}%`;
        scoreInterpretation.textContent = getInterpretation(finalScore);
        showPage(resultsPage);
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        userAnswers = {}; // Reset answers
        renderQuestion();
        showPage(questionPage);
    });

    nextButton.addEventListener('click', () => {
        // Ensure qualifying answer is stored if needed before moving
        const questionId = questions[currentQuestionIndex].id;
        const selectedRadio = optionsContainer.querySelector(`input[name="q${currentQuestionIndex}_options"]:checked`);
        if (selectedRadio && selectedRadio.dataset.requiresQualifying === 'true') {
             if (qualifyingInput.value.trim() === '') {
                // Optionally show an error message or just keep button disabled
                console.error("Qualifying answer required.");
                return; // Prevent moving next
            }
            userAnswers[questionId].qualifyingAnswer = qualifyingInput.value.trim();
        }


        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    });

    prevButton.addEventListener('click', () => {
        if (currentQuestionIndex > 0) {
            currentQuestionIndex--;
            renderQuestion();
        }
    });

     qualifyingInput.addEventListener('input', handleQualifyingInputChange);


    restartButton.addEventListener('click', () => {
        showPage(startPage);
    });

    // --- Initial Setup ---
    showPage(startPage);
});
