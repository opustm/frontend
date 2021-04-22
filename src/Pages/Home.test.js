import '@testing-library/jest-dom';
import { Axios } from '../services/api.service';
import {
  fireEvent,
  render,
  screen,
  wait,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../services/test.service';
import Home from './Home';

jest.mock('../services/api.service');

describe('Test user without teams', () => {
  beforeEach(() => {
    Axios.get.mockResolvedValue({ data: [] });
    render(
      <Router>
        <Home userInfo={mockAPI.userInfo} />
      </Router>
    );
  });

  test('Home page loads successfully', async () => {
    expect(screen.getByText('Welcome, Test'));
    expect(screen.getByText('Join a Team!')).toBeInTheDocument();

    // Close out of the modal
    fireEvent(
      screen.getAllByText('Close')[1],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );
  });
});
