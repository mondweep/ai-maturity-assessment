/**
 * Generates a unique identifier.
 * For simplicity in this example, it returns a fixed string.
 * In a real application, use a library like 'uuid'.
 * @returns {string} A unique session ID.
 */
export const generateUniqueId = () => {
  // In a real app, use something like uuidv4():
  // import { v4 as uuidv4 } from 'uuid';
  // return uuidv4();
  return 'mock-session-id-from-implementation'; // Use a distinct value for clarity
};

/**
 * Debounces a function call.
 * @param {Function} func - The function to debounce.
 * @param {number} delay - The debounce delay in milliseconds.
 * @returns {Function} The debounced function.
 */
export const debounce = (func, delay) => {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};