import '@testing-library/jest-dom';
import { Axios } from '../services/api.service';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../services/test.service';
import About from './About';

jest.mock('../services/api.service');

beforeEach(() => {
  render(<About />);
})

test('Check that About renders correctly', () => {
  expect(screen.getByText('Opus')).toBeInTheDocument();
  expect(screen.getByText('Josh Van Sant')).toBeInTheDocument();
});