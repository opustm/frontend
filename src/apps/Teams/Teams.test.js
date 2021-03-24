import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { act, fireEvent, render, screen } from '@testing-library/react';
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
// Leave team
// Verify modal errors for both create and join

describe('Tests with successful API data', () => {
  beforeEach(() => {
    Axios.get.mockResolvedValueOnce(mockAPI.userTeams).mockResolvedValueOnce(mockAPI.userTeams);
    render(
      <Router>
        <Teams userInfo={mockAPI.userInfo} />
      </Router>
    )
  })
  
  test('Teams component correctly renders data', async () => {
    let foundText = screen.getByText('CS 150');
    expect(foundText).toBeInTheDocument();
  });

  test('Team creation is successful', () => {
    let createButton = screen.getByText('Create Team');
    // Click the create button
    fireEvent(
      createButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );
    expect(screen.getByText('Team Name')).toBeInTheDocument();
  });

//   test('Team deletion is successful', () => {

//   });

//   test('Team join is successful', () => {

//   });
  
//   test('Leaving a team is successful', () => {

//   });

//   test('Verify create modal errors', () => {

//   });

//   test('Verify join modal errors', () => {

//   });
})
