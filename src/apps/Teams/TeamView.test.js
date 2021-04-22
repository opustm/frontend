import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../../services/test.service';
import TeamView from './TeamView';

jest.mock('../../services/api.service');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: 'localhost:3000/teams/CS 150',
    state: { teamId: 1 }
  })
}));

// Intercept the following on render
//    - Fetch team details by id

beforeEach(() => {
  Axios.get.mockResolvedValue(mockAPI.team1);
  render(
    <Router>
      <TeamView userInfo={mockAPI.userInfo} updateTeams={() => {}} />
    </Router>
  );
});

test('Ensure team data is rendered correctly', () => {
  expect(screen.getByText('CS 150')).toBeInTheDocument();
  expect(screen.getByText('This is a test team')).toBeInTheDocument();
  expect(screen.getByText('Joe Bob')).toBeInTheDocument();
});

test('Successfully add member to team', async () => {
  // Click on the 'Add Member' button.
  fireEvent(
    screen.getByText('Add Member'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Check that the modal opened
  expect(screen.getByText('Add a Member')).toBeInTheDocument();

  // Get and change the input value to be a username
  let usernameInput = screen.getByLabelText('Enter username');
  fireEvent.change(usernameInput, { target: { value: 'ronweasley' } });

  // Intercept the API requests that will be fired upon submission
  Axios.get.mockResolvedValueOnce(mockAPI.allUsers);
  Axios.put.mockResolvedValueOnce(mockAPI.newTeam);

  // Get and click the submit button
  fireEvent(
    screen.getByText('Invite Member'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Check that the new member is now displayed in the members list
  await waitFor(() => {
    expect(screen.getByText('Ron Weasley')).toBeInTheDocument();
  });
});

test('Successfully remove member from team', async () => {
  // Click the dropdown for Joe Bob
  fireEvent.click(screen.getByTestId('dropdown101'), {
    bubbles: true,
    cancelable: false
  });

  // Intercept the put request that will occur
  let newData = mockAPI.team1;
  newData.members = [];
  Axios.put.mockResolvedValue(newData);

  // Remove the member
  fireEvent.click(screen.getByText('Remove'), {
    bubbles: true,
    cancelable: false
  });

  await waitForElementToBeRemoved(() => screen.getByText('Joe Bob'));
});

test('Successfully delete team', async () => {
  // Get and click the settings gear
  fireEvent(
    screen.getByTestId('teamSettings'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Get and click the delete button
  fireEvent(
    screen.getByText('Delete'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Check that the confirm delete modal is shown
  expect(screen.getByText('Confirm Delete')).toBeInTheDocument();

  // Get and click the delete button
  fireEvent(
    screen.getByText('Delete Team'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );
});
