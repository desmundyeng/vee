// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// jsdom does not implement ResizeObserver, which Recharts' ResponsiveContainer
// relies on. Provide a no-op polyfill so components that render charts can mount
// during tests.
class ResizeObserverStub {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = ResizeObserverStub;
}
