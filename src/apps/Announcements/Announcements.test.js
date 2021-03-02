import '@testing-library/jest-dom';
import * as axios from 'axios';
import { fireEvent, render, screen } from '@testing-library/react';
import Announcements from './Announcements';

test('Renders Announcements component', () => {
  const userInfo = {
    id: "8687a8ac-7dac-4229-9275-ece5dff77150",
    username: "Test1",
    first_name: 'Test',
    last_name: 'User'
  }
  const matchData = {
    params: {}
  }
  render(<Announcements userInfo={userInfo} match={matchData}/>);
  
  expect(screen.getByText('Priority Legend:')).toBeInTheDocument();
  expect(screen.getByText('Creator')).toBeInTheDocument();

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

  let teamInput = screen.getByLabelText('Select Team *');
  // console.log(teamInput);

  // TODO
  // Test creation (record added to table, toast appears)
  // Test deletion (record removed from table)
  // Test filtering (both by priority and by team)
  // 
})