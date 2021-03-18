import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import mockAPI from '../../services/test.service';
import Calendar from './Calendar';

jest.mock('../../services/api.service');

// TODO
// Intercept the following on render:
//    1. GET user teams
//    2. GET user contacts
//    3. GET user events
// Test create
//    Trigger the errors described in createDataIsInvalid (line 165)
//    Successfully create, intercept the corresponding POST, check table for record
// Test delete
//    Intercept the delete request and remove the row from the table
// Test filtering by team

const matchData = {
  params: {}
}

beforeEach(() => {
  Axios.get.mockResolvedValueOnce(mockAPI.userTeams).mockResolvedValueOnce(mockAPI.userContacts).mockResolvedValueOnce(mockAPI.userEvents);
  render(<Calendar userInfo={mockAPI.userInfo} match={matchData} />)
})

test('Calendar loads events correctly', () => {
  // Verify that the component loads the mock data correctly
  expect(screen.getByText('Introduction to CS')).toBeInTheDocument();
  expect(screen.getByText('Our first class meeting for CS 150')).toBeInTheDocument();
})

test('Create a new event', () => {
  // Open up the create modal
  fireEvent(
    screen.getByText('Create Event'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Get the input fields and set the new values
  let nameInput = screen.getByLabelText('Name *');

  let startInput = screen.getByLabelText('Event Start *');

  let endInput = screen.getByLabelText('Event End *');

  let teamInput = screen.getByLabelText('Team');

  let participantInput = screen.getByLabelText('Invite Participants');

  let detailInput = screen.getByLabelText('Details *');

  expect(true).toBeTruthy();
});

test('Delete an event', async () => {
  // Get all of the delete buttons
  let deleteButtons = screen.getAllByTestId('deleteButton');
  let initialNumRows = deleteButtons.length;

  // Prepare Axios to intercept the delete request
  Axios.delete.mockResolvedValueOnce({status: 200});

  // Click the first delete button to trigger a delete event.
  fireEvent(
    deleteButtons[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  )

  // Check that there is one less row in the table than there was on render
  await waitForElementToBeRemoved(() => deleteButtons[0]);

  // console.log(deleteButtons);
  // expect(deleteButtons.length).toEqual(initialNumRows - 1);
  expect(screen.getByText('haaaaaaaaaaaa')).toBeInTheDocument();
});