// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

const originalWarn = console.warn;
let warnSpy;

beforeAll(() => {
  warnSpy = jest.spyOn(console, 'warn').mockImplementation((...args) => {
    const firstArg = args[0];
    const isRouterFutureWarning =
      typeof firstArg === 'string' && firstArg.includes('React Router Future Flag Warning');

    if (isRouterFutureWarning) {
      return;
    }

    originalWarn(...args);
  });
});

afterAll(() => {
  if (warnSpy && typeof warnSpy.mockRestore === 'function') {
    warnSpy.mockRestore();
  }
});
