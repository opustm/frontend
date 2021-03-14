import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { render, screen } from '@testing-library/react';
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
})