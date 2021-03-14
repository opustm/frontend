import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Contacts from './Contacts';

jest.mock('../../services/api.service');
const teamData = {data: [{id: 1, name: 'CS 150'}]};

const userInfo = {
  id: "12345",
  username: "testUser",
  first_name: 'Test',
  last_name: 'User'
}

const userContacts = {
  data: [
    {
      id: 100,
      first_name: 'Jeff',
      last_name: 'Goldblum',
      username: 'jgoldblum',
      email: 'goldblum@hotmail.com',
      phone: '09876',
    },
    {
      id: 101,
      first_name: 'Rip',
      last_name: 'Van Winkle',
      username: 'vanwinkle',
      email: 'rvw@yahoo.com',
      phone: '54321',
    }
  ]
}

const goldblumTeams = {
  data: [
    {
      id: 1,
      name: 'CS 150'
    },
    {
      id: 2,
      name: 'Hollywood Stars'
    }
  ]
}

const vanWinkleTeams = {
  data: [
    {
      id: 1,
      name: 'CS 150'
    },
    {
      id: 3,
      name: 'Old People'
    },
  ]
}

beforeEach(() => {
  // Mock Axios to intercept the following requests:
  // 1. GET user teams
  // 2. GET user contacts
  // 3. n GET requests where n is the length of user contacts (in this case, twice)
  Axios.get.mockResolvedValueOnce(teamData).mockResolvedValueOnce(userContacts).mockResolvedValueOnce(goldblumTeams).mockResolvedValueOnce(vanWinkleTeams);
  render(
    <Router>
      <Contacts userInfo={userInfo} />
    </Router>
  )
})

test('Contacts renders correctly', () => {
  // Verify that the user's contacts are in the table
  expect(screen.getByText('Jeff')).toBeInTheDocument();
  expect(screen.getByText('Rip')).toBeInTheDocument();

  // Verify that the shared teams are correct -- only CS 150 should appear since it's the only shared team
  // Note: getBy will return an error if not found, but queryBy will return an empty list
  // Because of this, it's useful to use queryBy when you're expecting something to NOT be in the document
  expect(screen.getAllByText('CS 150').length).toEqual(2);
  expect(screen.queryByText('Hollywood Stars')).toBeNull();
  expect(screen.queryByText('Old People')).toBeNull();
})