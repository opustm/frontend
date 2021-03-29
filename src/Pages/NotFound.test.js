import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NotFound from './NotFound';

test('404 Page renders correctly', () => {
  render(
    <Router>
      <NotFound />
    </Router>
  )

  expect(screen.getByText("Looks like you're lost")).toBeInTheDocument();
})