import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { fireEvent, render, screen, wait, waitForElementToBeRemoved } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../../services/test.service';
import Navigation from './navigation.component';

jest.mock('../../services/api.service');

beforeEach(() => {
  Axios.get.mockResolvedValueOnce(mockAPI.userTeams)
  render(
    <Router>
      <Navigation 
        sidebar={true}
        setSidebar={() => {}}
        onLoggedInChange={() => {}}
        userInfo={mockAPI.userInfo}
        userTeams={mockAPI.userTeams.data}
      />
    </Router>
  )
});

test('Navigation component renders teams correctly', () => {
  expect(screen.getByText('Dashboard')).toBeInTheDocument();
  expect(screen.getByText('CS 150')).toBeInTheDocument();
})