import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import mockAPI from '../../services/test.service';
import Teams from './Teams';

jest.mock('../../services/api.service');

// TODO
// Intercept the following on component render:
//    1. GET user teams
// Team creation
//    Intercept corresponding POST, check that new team is displayed
// Team deletion
//    Intercept corresponding DELETE, check that the team was removed
// Leave team
// Verify modal errors for both create and join

describe('Tests with successful API data', () => {
  beforeEach(() => {
    Axios.get.mockResolvedValue(mockAPI.userTeams);
    render(
      <Router>
        <Teams userInfo={mockAPI.userInfo} updateTeams={() => {}}/>
      </Router>
    )
  })
  
  test('Teams component correctly renders data', async () => {
    let foundText = screen.getByText('CS 150');
    expect(foundText).toBeInTheDocument();
  });

  test('Team creation is successful', async () => {
    let createButton = screen.getByText('Create Team');
    // Click the create button
    fireEvent(
      createButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );
    expect(screen.getByText('Team Name')).toBeInTheDocument();

    const createData = {
      id: 2,
      name: 'CS Students',
      description: 'A group for all comp sci students at Luther'
    }

    // Get the input for the team name and set the value
    let teamInput = screen.getByLabelText('Team Name');
    fireEvent.change(
      teamInput,
      { target: { value: createData.name } }
    )

    // Get the input for the description and set the value
    let descriptionInput = screen.getByLabelText('Description');
    fireEvent.change(
      descriptionInput,
      { target: { value: createData.description } }
    )

    // Mock the post request that will occur when we submit
    Axios.post.mockResolvedValueOnce({data: createData});

    // Get the submit button and click it
    let submitButton = screen.getByText('Submit');
    fireEvent(
      submitButton,
      new MouseEvent('click',{
        bubbles: true,
        cancelable: false
      })
    );

    // Verify that the new team name is in the document
    await waitFor(() => {expect(screen.getByText('CS Students')).toBeInTheDocument()})
  });


//   test('Team deletion is successful', () => {

//   });

  test('Team join is successful', async () => {
    // Click the 'Join Team' button
    let joinButton = screen.getByText('Join Team');
    fireEvent(
      joinButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // Verify that the modal opened
    expect(screen.getByText('Join a Team')).toBeInTheDocument();

    // Change the input
    let teamNameInput = screen.getByLabelText('Team Name');
    fireEvent.change(
      teamNameInput,
      { target: { value: 'Hollywood Stars' } }
    )

    // Intercept the necessary requests
    Axios.get.mockResolvedValueOnce(mockAPI.allTeams);
    Axios.put.mockResolvedValueOnce({
      data: {
        id: 2,
        name: 'Hollywood Stars'
      }
    })

    // Get and click the submit button
    let submitButton = screen.getByText('Submit');
    fireEvent(
      submitButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // Check for the team in the user's team list
    await waitFor(() => {expect(screen.getByText('Hollywood Stars')).toBeInTheDocument()});
  });
  
//   test('Leaving a team is successful', () => {

//   });

//   test('Verify create modal errors', () => {

//   });

//   test('Verify join modal errors', () => {

//   });
})
