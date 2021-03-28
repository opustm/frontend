import '@testing-library/jest-dom';
import { Axios } from '../services/api.service';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import mockAPI from '../services/test.service';
import Login from './Login';

jest.mock('../services/api.service');

beforeEach(() => {
  Axios.get.mockResolvedValueOnce(mockAPI.allUsers);
  render(<Login loggedIn={false}/>)
});

test('Renders login component correctly', () => {
  expect(screen.getByText('Create Teams')).toBeInTheDocument();
  expect(screen.getByText('Customize your Profile')).toBeInTheDocument();
});

test('Test register errors', () => {
  // Click the register button
  fireEvent(
    screen.getByText("Don't have an account yet? Click here to register."),
    new MouseEvent('click', {
      bubbles: true,
      cancelable: false
    })
  );

  // Ensure the modal opened
  expect(screen.getByText('Register New User')).toBeInTheDocument();

  // Click the submit button
  fireEvent(
    screen.getByText('Create Account'),
    new MouseEvent('click',{
      bubbles: true,
      cancelable: false
    })
  );

  // Make sure the errors appear
  expect(screen.getByText('All fields are required')).toBeInTheDocument();
  expect(screen.getByText('Password is missing one or more requirements')).toBeInTheDocument();

  // Attempt to create a new user with a duplicate username
  fireEvent.change(
    screen.getByTestId('usernameInput'),
    { target: {value: 'ronweasley'}}
  );

  // Click the submit button
  fireEvent(
    screen.getByText('Create Account'),
    new MouseEvent('click',{
      bubbles: true,
      cancelable: false
    })
  );

  // Check that the username warning appears
  expect(screen.getByText('Username already taken. Please choose another one.')).toBeInTheDocument();

  // Attempt to create a new user with a duplicate username
  fireEvent.change(
    screen.getByTestId('phoneInput'),
    { target: {value: '123-456-7890'}}
  );

  // Click the submit button
  fireEvent(
    screen.getByText('Create Account'),
    new MouseEvent('click',{
      bubbles: true,
      cancelable: false
    })
  );  
});

test('Test bad login', () => {

});

