import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../../services/test.service';
import Contacts from './Contacts';

jest.mock('../../services/api.service');

beforeEach(() => {
  // Mock Axios to intercept the following requests:
  // 1. GET user teams
  // 2. GET user contacts
  // 3. n GET requests where n is the length of user contacts (in this case, twice)
  Axios.get.mockResolvedValueOnce(mockAPI.userTeams).mockResolvedValueOnce(mockAPI.userContacts).mockResolvedValueOnce(mockAPI.contactTeams.goldblum).mockResolvedValueOnce(mockAPI.contactTeams.vanWinkle);
  render(
    <Router>
      <Contacts userInfo={mockAPI.userInfo} />
    </Router>
  )
})

test('Contacts renders correctly', () => {
  // Verify that the user's contacts are in the table
  expect(screen.getByText('Jeff')).toBeInTheDocument();
  expect(screen.getByText('Van Winkle')).toBeInTheDocument();

  // Verify that the shared teams are correct -- only CS 150 should appear since it's the only shared team
  // Note: getBy will return an error if not found, but queryBy will return an empty list
  // Because of this, it's useful to use queryBy when you're expecting something to NOT be in the document
  expect(screen.getAllByText('CS 150').length).toEqual(2);
  expect(screen.queryByText('Hollywood Stars')).toBeNull();
  expect(screen.queryByText('Old People')).toBeNull();
})