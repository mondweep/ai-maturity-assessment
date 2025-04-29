# AI Maturity Assessment Application - Styling Pseudocode

This document contains pseudocode for the CSS styling of the AI Maturity Assessment application, including layout, components, and responsive design.

## 1. Global Styles

```css
/* Variables */
:root {
  /* Colors */
  --primary-color: #4a6fdc;
  --primary-light: #e0e7ff;
  --primary-dark: #3a56a7;
  --secondary-color: #34d399;
  --secondary-light: #d1fae5;
  --secondary-dark: #059669;
  --neutral-100: #f3f4f6;
  --neutral-200: #e5e7eb;
  --neutral-300: #d1d5db;
  --neutral-400: #9ca3af;
  --neutral-500: #6b7280;
  --neutral-600: #4b5563;
  --neutral-700: #374151;
  --neutral-800: #1f2937;
  --neutral-900: #111827;
  --error-color: #ef4444;
  --warning-color: #f59e0b;
  --success-color: #10b981;
  
  /* Typography */
  --font-family-base: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  --font-family-heading: var(--font-family-base);
  --font-size-xs: 0.75rem;   /* 12px */
  --font-size-sm: 0.875rem;  /* 14px */
  --font-size-base: 1rem;    /* 16px */
  --font-size-lg: 1.125rem;  /* 18px */
  --font-size-xl: 1.25rem;   /* 20px */
  --font-size-2xl: 1.5rem;   /* 24px */
  --font-size-3xl: 1.875rem; /* 30px */
  --font-size-4xl: 2.25rem;  /* 36px */
  
  /* Spacing */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.25rem;  /* 20px */
  --spacing-6: 1.5rem;   /* 24px */
  --spacing-8: 2rem;     /* 32px */
  --spacing-10: 2.5rem;  /* 40px */
  --spacing-12: 3rem;    /* 48px */
  --spacing-16: 4rem;    /* 64px */
  
  /* Borders */
  --border-radius-sm: 0.125rem; /* 2px */
  --border-radius-md: 0.25rem;  /* 4px */
  --border-radius-lg: 0.5rem;   /* 8px */
  --border-radius-xl: 1rem;     /* 16px */
  --border-radius-full: 9999px;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  
  /* Transitions */
  --transition-fast: 150ms;
  --transition-normal: 300ms;
  --transition-slow: 500ms;
  
  /* Layout */
  --container-width: 1200px;
  --content-width: 800px;
}

/* Reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  line-height: 1.5;
  color: var(--neutral-800);
  background-color: var(--neutral-100);
}

h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-family-heading);
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: var(--spacing-4);
  color: var(--neutral-900);
}

h1 {
  font-size: var(--font-size-3xl);
}

h2 {
  font-size: var(--font-size-2xl);
}

h3 {
  font-size: var(--font-size-xl);
}

p {
  margin-bottom: var(--spacing-4);
}

a {
  color: var(--primary-color);
  text-decoration: none;
  transition: color var(--transition-fast) ease-in-out;
}

a:hover {
  color: var(--primary-dark);
  text-decoration: underline;
}

button {
  cursor: pointer;
}

/* Focus styles for accessibility */
:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

/* Container */
.container {
  max-width: var(--container-width);
  margin: 0 auto;
  padding: 0 var(--spacing-4);
}

.content-container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: var(--spacing-8) var(--spacing-4);
}
```

## 2. Layout Styles

```css
/* Main layout */
.ai-maturity-assessment {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.assessment-header {
  background-color: var(--primary-color);
  color: white;
  padding: var(--spacing-4) 0;
  box-shadow: var(--shadow-md);
}

.assessment-header h1 {
  color: white;
  margin: 0;
  text-align: center;
}

.assessment-content {
  flex: 1;
  padding: var(--spacing-8) 0;
}

.assessment-footer {
  background-color: var(--neutral-800);
  color: var(--neutral-200);
  padding: var(--spacing-6) 0;
  text-align: center;
  font-size: var(--font-size-sm);
}

/* Card layout */
.card {
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-md);
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-6);
}

.card-header {
  margin-bottom: var(--spacing-4);
  padding-bottom: var(--spacing-4);
  border-bottom: 1px solid var(--neutral-200);
  font-weight: 600;
  font-size: var(--font-size-xl);
}

.card-content {
  margin-bottom: var(--spacing-4);
}

/* Two-column layout */
.two-column-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-6);
}

@media (min-width: 768px) {
  .two-column-layout {
    grid-template-columns: 1fr 1fr;
  }
}

/* Grid layout */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
}
```

## 3. Form Styles

```css
/* Form elements */
.form-group {
  margin-bottom: var(--spacing-6);
}

label {
  display: block;
  margin-bottom: var(--spacing-2);
  font-weight: 500;
  color: var(--neutral-700);
}

.required-indicator {
  color: var(--error-color);
  margin-left: var(--spacing-1);
}

input[type="text"],
input[type="email"],
input[type="number"],
input[type="password"],
textarea,
select {
  width: 100%;
  padding: var(--spacing-3);
  border: 1px solid var(--neutral-300);
  border-radius: var(--border-radius-md);
  font-family: var(--font-family-base);
  font-size: var(--font-size-base);
  transition: border-color var(--transition-fast) ease-in-out;
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="number"]:focus,
input[type="password"]:focus,
textarea:focus,
select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px var(--primary-light);
  outline: none;
}

input[type="text"].error,
input[type="email"].error,
input[type="number"].error,
input[type="password"].error,
textarea.error,
select.error {
  border-color: var(--error-color);
}

.error-message {
  color: var(--error-color);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-1);
}

/* Radio and checkbox options */
.radio-options,
.checkbox-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-3);
}

.radio-option,
.checkbox-option {
  display: flex;
  align-items: center;
}

.radio-option input,
.checkbox-option input {
  margin-right: var(--spacing-2);
}

/* Scale input */
.scale-input {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2);
}

.scale-input input[type="range"] {
  width: 100%;
  margin: var(--spacing-2) 0;
}

.scale-labels {
  display: flex;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

.scale-value {
  text-align: center;
  font-weight: 600;
  color: var(--primary-color);
}

/* Form actions */
.form-actions {
  display: flex;
  justify-content: space-between;
  margin-top: var(--spacing-8);
}

@media (max-width: 640px) {
  .form-actions {
    flex-direction: column-reverse;
    gap: var(--spacing-4);
  }
  
  .form-actions button {
    width: 100%;
  }
}
```

## 4. Button Styles

```css
/* Buttons */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-3) var(--spacing-6);
  border-radius: var(--border-radius-md);
  font-weight: 500;
  font-size: var(--font-size-base);
  text-align: center;
  cursor: pointer;
  transition: all var(--transition-fast) ease-in-out;
  border: none;
}

.primary-button {
  composes: button;
  background-color: var(--primary-color);
  color: white;
}

.primary-button:hover {
  background-color: var(--primary-dark);
  text-decoration: none;
}

.primary-button:focus {
  box-shadow: 0 0 0 3px var(--primary-light);
}

.primary-button:disabled {
  background-color: var(--neutral-400);
  cursor: not-allowed;
}

.secondary-button {
  composes: button;
  background-color: white;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
}

.secondary-button:hover {
  background-color: var(--primary-light);
  text-decoration: none;
}

.secondary-button:focus {
  box-shadow: 0 0 0 3px var(--primary-light);
}

.secondary-button:disabled {
  color: var(--neutral-400);
  border-color: var(--neutral-400);
  cursor: not-allowed;
}

.text-button {
  composes: button;
  background-color: transparent;
  color: var(--primary-color);
  padding: var(--spacing-2) var(--spacing-3);
}

.text-button:hover {
  background-color: var(--primary-light);
  text-decoration: none;
}

.retry-button {
  composes: button;
  background-color: var(--neutral-200);
  color: var(--neutral-700);
  padding: var(--spacing-2) var(--spacing-4);
  font-size: var(--font-size-sm);
}

.retry-button:hover {
  background-color: var(--neutral-300);
}
```

## 5. Component-Specific Styles

```css
/* Progress bar */
.progress-container {
  margin-bottom: var(--spacing-8);
}

.progress-bar {
  height: 8px;
  background-color: var(--neutral-200);
  border-radius: var(--border-radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background-color: var(--primary-color);
  transition: width var(--transition-normal) ease-in-out;
}

.progress-text {
  margin-top: var(--spacing-2);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
}

/* Question container */
.question-container {
  margin-bottom: var(--spacing-8);
}

.question-label {
  font-weight: 600;
  margin-bottom: var(--spacing-3);
}

.question-description {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-3);
}

/* Goal cards */
.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-4);
  margin-bottom: var(--spacing-6);
}

.goal-card {
  position: relative;
  background-color: white;
  border: 2px solid var(--neutral-200);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-5);
  cursor: pointer;
  transition: all var(--transition-fast) ease-in-out;
}

.goal-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.goal-card.selected {
  border-color: var(--primary-color);
  background-color: var(--primary-light);
}

.goal-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-3);
}

.goal-card h3 {
  margin-bottom: var(--spacing-2);
}

.selection-indicator {
  position: absolute;
  top: var(--spacing-3);
  right: var(--spacing-3);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--border-radius-full);
  font-size: var(--font-size-sm);
  background-color: var(--neutral-200);
  color: var(--neutral-700);
}

.goal-card.selected .selection-indicator {
  background-color: var(--primary-color);
  color: white;
}

/* Goal section */
.goal-section {
  margin-bottom: var(--spacing-8);
  padding-bottom: var(--spacing-6);
  border-bottom: 1px solid var(--neutral-200);
}

.goal-section:last-child {
  border-bottom: none;
}

/* Score display */
.score-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: var(--spacing-8);
}

.score-circle {
  position: relative;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-4);
  background-color: white;
  box-shadow: var(--shadow-md);
}

.score-circle.beginner {
  border: 10px solid var(--warning-color);
}

.score-circle.intermediate {
  border: 10px solid var(--primary-color);
}

.score-circle.advanced {
  border: 10px solid var(--secondary-color);
}

.score-circle.expert {
  border: 10px solid #8b5cf6; /* Purple */
}

.score-value {
  font-size: 3rem;
  font-weight: 700;
  color: var(--neutral-900);
  line-height: 1;
}

.score-max {
  font-size: var(--font-size-lg);
  color: var(--neutral-500);
}

.score-category {
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--neutral-800);
}

/* Score breakdown */
.score-breakdown {
  width: 100%;
  margin-top: var(--spacing-6);
  padding: var(--spacing-4);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
}

.score-categories {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-3);
}

@media (min-width: 640px) {
  .score-categories {
    grid-template-columns: repeat(3, 1fr);
  }
}

.score-category {
  padding: var(--spacing-3);
  background-color: var(--neutral-100);
  border-radius: var(--border-radius-md);
  text-align: center;
}

.category-label {
  font-size: var(--font-size-sm);
  color: var(--neutral-600);
  margin-bottom: var(--spacing-1);
}

.category-score {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--primary-color);
}

/* Recommendations */
.recommendations-section {
  margin-top: var(--spacing-8);
}

.recommendations-list {
  list-style: none;
  padding: 0;
}

.recommendation-item {
  display: flex;
  margin-bottom: var(--spacing-6);
  background-color: white;
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.recommendation-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  background-color: var(--primary-color);
  color: white;
  font-size: var(--font-size-xl);
  font-weight: 700;
}

.recommendation-content {
  flex: 1;
  padding: var(--spacing-4);
}

.recommendation-content h3 {
  margin-bottom: var(--spacing-2);
}

.action-items {
  margin-top: var(--spacing-3);
}

.action-items h4 {
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  color: var(--neutral-600);
  margin-bottom: var(--spacing-2);
}

.action-items ul {
  padding-left: var(--spacing-4);
}

.action-items li {
  margin-bottom: var(--spacing-2);
}

/* Loading indicator */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-8);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--primary-light);
  border-top-color: var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-4);
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-message {
  color: var(--neutral-600);
}

/* Error message */
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--spacing-6);
  background-color: var(--neutral-100);
  border-radius: var(--border-radius-lg);
  border: 1px solid var(--error-color);
}

.error-icon {
  font-size: var(--font-size-3xl);
  margin-bottom: var(--spacing-3);
}

.error-message {
  text-align: center;
  margin-bottom: var(--spacing-4);
  color: var(--error-color);
}
```

## 6. Responsive Design

```css
/* Base responsive adjustments */
@media (max-width: 640px) {
  .content-container {
    padding: var(--spacing-4);
  }
  
  h1 {
    font-size: var(--font-size-2xl);
  }
  
  h2 {
    font-size: var(--font-size-xl);
  }
  
  .card {
    padding: var(--spacing-4);
  }
  
  .recommendation-item {
    flex-direction: column;
  }
  
  .recommendation-number {
    width: 100%;
    padding: var(--spacing-2);
  }
}

/* Tablet adjustments */
@media (min-width: 641px) and (max-width: 1024px) {
  .content-container {
    padding: var(--spacing-6);
  }
  
  .goals-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Print styles */
@media print {
  body {
    font-size: 12pt;
    line-height: 1.3;
    background: white;
    color: black;
  }
  
  .assessment-header,
  .assessment-footer,
  .form-actions,
  .navigation-controls {
    display: none;
  }
  
  .card,
  .goal-card,
  .recommendation-item {
    break-inside: avoid;
    page-break-inside: avoid;
    box-shadow: none;
    border: 1px solid #ddd;
  }
  
  a {
    text-decoration: underline;
    color: black;
  }
  
  .score-circle {
    border-width: 5px;
    box-shadow: none;
  }
}
```

## 7. Animations and Transitions

```css
/* Fade in animation */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Page transitions */
.page-enter {
  opacity: 0;
  transform: translateX(20px);
}

.page-enter-active {
  opacity: 1;
  transform: translateX(0);
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

.page-exit {
  opacity: 1;
  transform: translateX(0);
}

.page-exit-active {
  opacity: 0;
  transform: translateX(-20px);
  transition: opacity var(--transition-normal), transform var(--transition-normal);
}

/* Button hover effects */
.button-hover-effect {
  position: relative;
  overflow: hidden;
}

.button-hover-effect::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  transition: width 0.3s ease-out, height 0.3s ease-out;
}

.button-hover-effect:hover::after {
  width: 300%;
  height: 300%;
}
```

## 8. Accessibility Enhancements

```css
/* Skip to content link for keyboard users */
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: var(--primary-color);
  color: white;
  padding: var(--spacing-2) var(--spacing-4);
  z-index: 100;
  transition: top 0.3s;
}

.skip-link:focus {
  top: 0;
}

/* Focus visible utility */
.focus-visible:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.focus-visible:focus:not(:focus-visible) {
  outline: none;
}

/* High contrast mode adjustments */
@media (prefers-contrast: high) {
  :root {
    --primary-color: #0000cc;
    --primary-light: #ccccff;
    --error-color: #cc0000;
    --success-color: #006600;
  }
  
  input, 
  select, 
  button {
    border-width: 2px;
  }
  
  .goal-card,
  .card,
  .recommendation-item {
    border-width: 2px;
  }
}

/* Reduced motion preferences */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
  
  .page-enter-active,
  .page-exit-active {
    transition: none !important;
  }
}