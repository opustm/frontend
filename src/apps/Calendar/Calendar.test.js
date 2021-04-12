import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import {
  fireEvent,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved
} from '@testing-library/react';
import mockAPI from '../../services/test.service';
import Calendar from './Calendar';

jest.mock('../../services/api.service');

const matchData = {
  params: {}
};

beforeEach(() => {
  Axios.get
    .mockResolvedValueOnce(mockAPI.userTeams)
    .mockResolvedValueOnce(mockAPI.userContacts)
    .mockResolvedValueOnce(mockAPI.userEvents);
  render(<Calendar userInfo={mockAPI.userInfo} match={matchData} />);
});

test('Calendar loads events correctly', () => {
  // Verify that the component loads the mock data correctly
  expect(screen.getByText('Introduction to CS')).toBeInTheDocument();
  expect(
    screen.getByText('Our first class meeting for CS 150')
  ).toBeInTheDocument();
});

test('Create a new event', async () => {
  // Open up the create modal
  fireEvent(
    screen.getByText('Create Event'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Get the input fields and set the new values
  fireEvent.change(
    screen.getByLabelText('Name *'),
    {target: {value: mockAPI.newEvent.name}}
  )
  
  fireEvent.change(
    screen.getByLabelText('Event Start *'),
    {target: {value: mockAPI.newEvent.start}}
  )

  fireEvent.change(
    screen.getByLabelText('Event End *'),
    {target: {value: mockAPI.newEvent.end}}
  )

  fireEvent.change(
    screen.getByLabelText('Team'),
    {target: {value: mockAPI.newEvent.team}}
  )

  fireEvent.change(
    screen.getByLabelText('Invite Participants'),
    {target: {value: ''}}
  )

  fireEvent.change(
    screen.getByLabelText('Details *'),
    {target: {value: mockAPI.newEvent.details}}
  )

  // Intercept the post request and submit the data
  Axios.post.mockResolvedValueOnce({data: {id: mockAPI.newEvent.id}});
  fireEvent.click(
    screen.getByText('Submit'),
    {
      bubbles: true,
      cancelable: false
    }
  )

  // Check that the new event is in the table
  await waitFor(() => {expect(screen.getByText('Event 3')).toBeInTheDocument()})
});

test('Delete an event', async () => {
  // Get all of the delete buttons
  let deleteButtons = screen.getAllByTestId('deleteButton');
  let initialNumRows = deleteButtons.length;

  // Prepare Axios to intercept the delete request
  Axios.delete.mockResolvedValueOnce({ status: 200 });

  // Click the first delete button to trigger a delete event.
  fireEvent.click(
    deleteButtons[0],
    {
      bubbles: true,
      cancelable: false
    }
  );
});

test('Test modal errors', () => {
  // Open up the create modal
  fireEvent.click(
    screen.getByText('Create Event'),
    {
      bubbles: true,
      cancelable: false
    }
  );

  // Click the submit button without entering anything
  fireEvent.click(
    screen.getByText('Submit'),
    {
      bubbles: true,
      cancelable: false
    }
  )

  // Check that the errors are shown
  expect(screen.getByText('Event Name is a required field.')).toBeInTheDocument();
  expect(screen.getByText('Event Details is a required field.')).toBeInTheDocument();
  expect(screen.getByText('Event Start is a required field.')).toBeInTheDocument();
  expect(screen.getByText('Event End is a required field.')).toBeInTheDocument();

  // Set the start to be in the past
  fireEvent.change(
    screen.getByLabelText('Event Start *'),
    {target: {value: '2021-04-07T11:22'}}
  )

  // Set the end to be before the start
  fireEvent.change(
    screen.getByLabelText('Event End *'),
    {target: {value: '2021-04-02T11:22'}}
  )

  // Try submitting again
  fireEvent.click(
    screen.getByText('Submit'),
    {
      bubbles: true,
      cancelable: false
    }
  )

  // Check for the other errors
  expect(screen.getByText('Event cannot start in the past.')).toBeInTheDocument();
  expect(screen.getByText('Event End must be after Event Start.')).toBeInTheDocument();
})
