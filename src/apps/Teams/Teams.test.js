import '@testing-library/jest-dom';
import { Axios } from '../../services/api.service';
import { fireEvent, render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
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

    // Mock the get and post request that will occur when we submit
    Axios.get.mockResolvedValueOnce(mockAPI.allTeams);
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


  test('Team deletion is successful', async () => {
    // Get and click the dropdown menu for the CS 150 team
    let teamDropdown = screen.getByTestId('dropdown1');
    fireEvent(
      teamDropdown,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // Get the option to delete and then click it
    fireEvent.click(
      screen.getByText('Delete'),
      {
        bubbles: true,
        cancelable: false
      }
    );

    // Check that the modal is showing
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();

    // Intercept the delete request
    Axios.delete.mockResolvedValueOnce({});
    
    // Click the delete button
    fireEvent.click(
      screen.getAllByText('Delete')[1],
      {bubbles: true, cancelable: false}
    )

    // Check that the team is removed from their list
    await waitForElementToBeRemoved(() => screen.getByText('CS 150'));
  });
  
  test('Leaving a team is successful: user is only member', async () => {
    // Get and click the dropdown menu for the CS 150 team
    let teamDropdown = screen.getByTestId('dropdown1');
    fireEvent(
      teamDropdown,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // Get the option to leave and then click it
    let leaveButton = screen.getByText('Leave');
    fireEvent(
      leaveButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // The user is the only one in this team, so the 'Confirm Delete' modal should be shown
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
    
    // Click the delete button
    let deleteButton = screen.getAllByText('Delete')[1];
    fireEvent(
      deleteButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );


    // Check that the CS 150 team is no longer displayed on the list
    await waitForElementToBeRemoved(() => screen.getByText('CS 150'));
  });

  test('Leaving team is successful: user is not only member', async () => {
    // Get and click the dropdown menu for the CS 360 team
    let teamDropdown = screen.getByTestId('dropdown2');
    fireEvent(
      teamDropdown,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // Get the option to leave and then click it
    let leaveButton = screen.getByText('Leave');
    fireEvent(
      leaveButton,
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );

    // Check that the CS 360 team is no longer displayed on the list
    await waitForElementToBeRemoved(() => screen.getByText('CS 360'));
  });

  test('Verify create modal errors', () => {
    // Click the 'Create Team' button
    fireEvent(
      screen.getByText('Create Team'),
      new MouseEvent('click', {
        bubbles: true,
        cancelable: false
      })
    );
    
    // Change the name input to a team that already exists
    fireEvent.change(
      screen.getByLabelText('Team Name'),
      {target: {value: 'Hollywood Stars'}}
    );

    fireEvent.change(
      screen.getByLabelText('Description'),
      {target: {value: 'Hello World!'}}
    );

    // Intercept the request for all of the teams in the database
    Axios.get.mockResolvedValueOnce(mockAPI.allTeams);

    // Click the submit button
    fireEvent.click(
      screen.getByText('Submit'),
      {
        bubbles: true,
        cancelable: false
      }
    );

    // Expect the duplicate create error to be shown
    expect(screen.getByText("A team with this name already exists. If you'd like, you may join it instead.")).toBeInTheDocument();

  });

  describe('Team join tests', () => {
    beforeEach(() => {
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
    });

    test('Team join is successful', async () => {
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

    test('Verify join modal errors', () => {
      // Change the input to a team the user is already in
      let teamNameInput = screen.getByLabelText('Team Name');
      fireEvent.change(
        teamNameInput,
        { target: { value: 'CS 150' } }
      )
  
      // Get and click the submit button
      let submitButton = screen.getByText('Submit');
      fireEvent(
        submitButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: false
        })
      );
  
      // Check that the error message is shown
      expect(screen.getByText("You're already a member of this team!")).toBeInTheDocument();
  
      // Set the value to a team that doesn't exist
      fireEvent.change(
        teamNameInput,
        { target: { value: 'Nonexistent Team!' } }
      )
  
      // Click the submit button again
      fireEvent(
        submitButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: false
        })
      );
  
      // Check that the new error message is shown
      expect(screen.getByText("No team exists with the name you specified. Please check your spelling and try again.")).toBeInTheDocument();
    });
  });
})
