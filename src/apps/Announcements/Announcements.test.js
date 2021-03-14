import '@testing-library/jest-dom';
import { Axios, API_ENDPOINTS } from '../../services/api.service';
import { fireEvent, render, screen } from '@testing-library/react';
import mockAPI from '../../services/test.service';
import Announcements from './Announcements';

jest.mock('../../services/api.service');
// TODO
// DONE ---- Send data back on page load / intercept those API calls
//    DONE --- GET from /users/{id}/team, /events/user/{id}, /announcements/user/{id}, in that order
// DONE ---- Ensure the returned data is in the table
// Test creation (record added to table, toast appears) -- will cover 109-143, 162, 220, 229, 234-258, 299-310
//    POST to /announcements/
// Test deletion (record removed from table) -- will cover 163-172
//    DELETE to /announcements/
// Test filtering (both by priority and by team) -- priority covers 187-190, 311-317, 329
//    Make sure certain records appear/disappear

const matchData = {
  params: {}
}

beforeEach(() => {
  // Intercept the API calls (might be able to move this into a beforeEach() block along with the render)
  Axios.get.mockResolvedValueOnce(mockAPI.userTeams).mockResolvedValueOnce(mockAPI.userEvents).mockResolvedValueOnce(mockAPI.userAnnouncements);

  // Render the Announcements component
  render(<Announcements userInfo={mockAPI.userInfo} match={matchData}/>);
})

test('Renders Announcements component', () => {
  // Check that the user.fetchTeams route was called
  expect(API_ENDPOINTS.user.fetchTeams).toHaveBeenCalledTimes(1);

  // Check that the page loads
  expect(screen.getByText('Priority Legend:')).toBeInTheDocument();
  expect(screen.getByText('Creator')).toBeInTheDocument();

  // Check that the dummy announcement is displayed
  expect(screen.getByText('Bob Ross')).toBeInTheDocument();
});

test('Modal remains open on bad data', () => {
  // Open up the create modal
  fireEvent(
    screen.getByText('Create Announcement'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Verify that the create modal opens
  expect(screen.getByText('* indicates required field')).toBeInTheDocument();

  // Try to submit the form without entering any data
  fireEvent(
    screen.getByText('Submit'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  )

  // Verify that the error alert is displayed and the modal is still open
  expect(screen.getByText("Error: You've entered invalid data or forgotten to fill out one of the fields.")).toBeInTheDocument();
  expect(screen.getByText('Create an announcement')).toBeInTheDocument();
});

test('Announcement creation adds record to table', () => {
  // Open up the create modal
  fireEvent(
    screen.getByText('Create Announcement'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );
  
  const createData = {
    id: 3,
    team: 1,
    priority: 3,
    duration: 2,
    announcement: 'Cookies in the breakroom!'
  }

  // Set the teamInput value to be 1, since that's the ID value of the team we should select
  let teamInput = screen.getByLabelText('Select Team *');
  fireEvent.change(
    teamInput,
    { target: { value: createData.team } }
  )

  // Set the priority to 3 (low priority)
  let priorityInput = screen.getByLabelText('Select Priority *');
  fireEvent.change(
    priorityInput,
    { target: { value: createData.priority} }
  )
  
  // Set the announcement duration
  let durationInput = screen.getByLabelText('Announcement Duration in Hours (Minimum: 1) *')
  fireEvent.change(
    durationInput,
    { target: { value: createData.duration} }
  )

  // Set the announcement text
  let announcementInput = screen.getByLabelText('Announcement *');
  fireEvent.change(
    announcementInput,
    { target: { value: createData.announcement} }
  )
  
  // Mock the POST call that will get triggered on form submission
  Axios.post.mockResolvedValueOnce({data: createData});

  // Try submitting with valid data
  fireEvent(
    screen.getByText('Submit'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  )

  // Make sure the modal closed
  expect(screen.getByText('* indicates required field')).not.toBeInTheDocument();

  // Check that the new record is in the table
  expect(screen.getByText('Cookies in the breakroom!')).toBeInTheDocument();
});

test('Deletes announcement from table', () => {
  // Get all of the delete buttons in the table
  let deleteButtons = screen.getAllByTestId('deleteButton');
  let numRows = deleteButtons.length;
  console.log(numRows);

  // Intercept the delete request and return that the resource was successfully deleted
  Axios.delete.mockResolvedValueOnce({status: 200})
  
  // Click on the first one
  fireEvent(
    deleteButtons[0],
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })   
  )
  // There should now be one less row in the table than there was before we clicked a delete button
  deleteButtons = screen.getAllByTestId('deleteButton');
  console.log(deleteButtons);
  expect(deleteButtons.length).toEqual(numRows - 1);
})

// test('Priority and Team Filters work', () => {

// })