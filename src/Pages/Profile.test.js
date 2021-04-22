import '@testing-library/jest-dom';
import { Axios } from '../services/api.service';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../services/test.service';
import Profile from './Profile';

jest.mock('../services/api.service');
// jest.mock("react-router-dom", () => ({
//   ...jest.requireActual("react-router-dom"),
//   useLocation: () => ({
//     pathname: "localhost:3000/user/testUser",
//     state: {userId: 1}
//   })
// }));

beforeEach(() => {
  Axios.get.mockResolvedValueOnce(mockAPI.userInfoData);
  render(
    <Router>
      <Profile
        userInfo={mockAPI.userInfo}
        location={{ state: { userId: 1 } }}
      />
    </Router>
  );
});

test('Profile renders correctly', () => {
  expect(screen.getByText('Test User')).toBeInTheDocument();
});

test('Editing is successful', async () => {
  const newUserInfo = {
    data: {
      first_name: 'Pierre',
      last_name: 'Jean Claude',
      username: 'pjc',
      phone: '8888888',
      bio: 'Un baguette',
      email: 'pierre@france.gov'
    }
  };
  // Click the edit button
  fireEvent(
    screen.getByText('Edit your profile'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Check that edit mode is engaged
  expect(screen.getByText('Edit Profile Color:')).toBeInTheDocument();

  // Change the value of the first name field
  fireEvent.change(screen.getByLabelText('First Name:'), {
    target: { value: newUserInfo.data.first_name }
  });

  // Change the value of the last name field
  fireEvent.change(screen.getByLabelText('Last Name:'), {
    target: { value: newUserInfo.data.last_name }
  });

  // Change the value of the username field
  fireEvent.change(screen.getByLabelText('Username:'), {
    target: { value: newUserInfo.data.username }
  });

  // Change the value of the phone field
  fireEvent.change(screen.getByLabelText('Phone:'), {
    target: { value: newUserInfo.data.phone }
  });

  // Change the value of the email field
  fireEvent.change(screen.getByLabelText('Email:'), {
    target: { value: newUserInfo.data.email }
  });

  // Change the value of the bio field
  fireEvent.change(screen.getByLabelText('Bio:'), {
    target: { value: newUserInfo.data.bio }
  });

  // Intercept the put request
  Axios.put.mockResolvedValueOnce(newUserInfo);

  // Click the submit button
  fireEvent(
    screen.getByText('Save Changes'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Check that the user's first name has been updated
  expect(screen.getByText('Pierre Jean Claude')).toBeInTheDocument();
  await waitFor(() =>
    expect(screen.getByText('Email: pierre@france.gov')).toBeInTheDocument()
  );
  expect(screen.queryByText('Test User')).toBeNull();
});

test('Cancel edit is successful', () => {
  // Click the edit button
  fireEvent(
    screen.getByText('Edit your profile'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Check that edit mode is engaged
  expect(screen.getByText('Edit Profile Color:')).toBeInTheDocument();

  // Change the value of the first name field
  fireEvent.change(screen.getByLabelText('First Name:'), {
    target: { value: 'This is gibberish!' }
  });

  // Click the cancel button
  fireEvent(
    screen.getByText('Cancel'),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Make sure the old data is still there and the new data is not
  expect(screen.queryByText('This is gibberish!')).toBeNull();
  expect(screen.getByText('Test User')).toBeInTheDocument();
});
