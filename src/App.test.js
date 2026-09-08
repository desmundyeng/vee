import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the VEE heading', () => {
  render(<App />);
  const heading = screen.getByText(/Validation, Estimation, and Editing \(VEE\)/i);
  expect(heading).toBeInTheDocument();
});
