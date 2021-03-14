import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../../services/test.service';
import Teams from './Teams';

jest.mock('../../services/api.service');

// TODO
// Intercept the following on component render:
//    1. GET user teams
// Team creation
//    Intercept corresponding POST, check that new team is displayed
// Team deletion
//    Intercept corresponding DELETE, check that the team was removed

beforeEach(() => {
  Axios.get.mockResolvedValueOnce(mockAPI.userTeams);
  render(
    <Router>
      <Teams userInfo={mockAPI.userInfo} />
    </Router>
  )
})

test('Teams component correctly renders data', () => {
  expect(screen.getByText('CS 150')).toBeInTheDocument();
});

// test('Team creation is successful', () => {

// })

// test('Team deletion is successful', () => {

// });