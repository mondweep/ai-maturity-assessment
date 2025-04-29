import '@testing-library/jest-dom';

describe('Test Setup', () => {
  test('setup is working', () => {
    expect(true).toBe(true);
  });

  test('sessionStorage mock is working', () => {
    window.sessionStorage.setItem('test', 'value');
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('test', 'value');
  });
}); 