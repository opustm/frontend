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
    screen.getByTestId('registerUsername'),
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
  // Try logging in with a user that doesn't exist
  fireEvent.change(
    screen.getByLabelText('Username'),
    { target: {value: 'fakeUser'}}
  );

  fireEvent.change(
    screen.getByLabelText('Password'),
    { target: {value: 'Password1'}}
  );

  Axios.post.mockResolvedValueOnce({});
  fireEvent.click(
    screen.getByText('SIGN IN'),
    {
      bubbles: true,
      cancelable: false
    }
  )

  // Check that we're still on the same page
  expect(screen.getByText("Don't have an account yet? Click here to register.")).toBeInTheDocument();
});

test('Test successful account creation', () => {
  const newUserData = {
    first_name: 'John',
    last_name: 'Cena',
    phone: '9292992',
    email: 'john@gmail.com',
    username: 'johncena',
    password: 'AndHisNameIs!!999'
  }

  // Open the modal
  fireEvent.click(
    screen.getByText("Don't have an account yet? Click here to register."),
    {
      bubbles: true,
      cancelable: false
    }
  )

  // Enter valid data for all of the inputs
  fireEvent.change(
    screen.getByLabelText('First Name'),
    {target: {value: newUserData.first_name}}
  )

  fireEvent.change(
    screen.getByLabelText('Last Name'),
    {target: {value: newUserData.last_name}}
  )

  fireEvent.change(
    screen.getByTestId('phoneInput'),
    {target: {value: newUserData.phone}}
  )

  fireEvent.change(
    screen.getByTestId('emailInput'),
    {target: {value: newUserData.email}}
  )

  fireEvent.change(
    screen.getByTestId('registerUsername'),
    {target: {value: newUserData.username}}
  )

  fireEvent.change(
    screen.getByTestId('registerPassword'),
    {target: {value: newUserData.password}}
  )

  // Click the button to create an account
  fireEvent.click(
    screen.getByText('Create Account'),
    {
      bubbles: true,
      cancelable: false
    }
  )
})

