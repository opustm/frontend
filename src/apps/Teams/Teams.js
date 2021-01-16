import React, { useState, useEffect } from 'react';
import { useInput } from './../../services/forms.service.js';
import { AppData } from '../../services/data.service';
import {Container, Spinner, Dropdown, Row, Col, Jumbotron, Button, ButtonGroup, Modal, Form} from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Link, Redirect } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import './teams.css';

// 
// Data Processing Variables
// 

let createFormPlaceholderData = {
  name: "New Team Name",
  cliqueType: "sub",
  picture: "https://via.placeholder.com/40/5555555?text=T",
  permissions: [],
  relatedCliques: [],
}

let showInvitationModal = {
  username: "",

}

// let joinFormPlaceholderData = {
//   name:null,
// }

const Teams = () => {
  const [teams,setTeams] = useState([0]);
  const [showCreateModal, setShowCreateModal]= useState(false);
  // const [showJoinModal, setShowJoinModal] = useState(false);
  const { value:teamName, bind:bindTeamName, reset:resetTeamName } = useInput('');
  document.title = "Opus | Teams"

  // 
  // Functions
  // 

  useEffect(() => {
    async function fetchTeams() {
      // const request = await api.get(urls.teams.fetchAll());
      const request = await api.get(urls.teams.fetchByUsername(AppData.user()))
      setTeams(request.data);
      return request;
    }
    try{
      fetchTeams();
    }
    catch (err) {
      <Redirect to="/404"/>
    }
  }, [teams]);

  async function deleteTeam(teamID) {
    await api.delete(
      urls.teams.fetchById(teamID)
    )
    .then(function (response) {
      <Redirect to="/teams"/>
    })
  }

  async function createTeam(){
    await api.post(
      urls.teams.fetchAll, createFormPlaceholderData
    )
  }

  const handleSubmit = (evt) => {
    evt.preventDefault();
    createFormPlaceholderData.name = teamName;
    createTeam()
    resetTeamName();
  }

  // 
  // Internal Components
  // 

  let createTeamModal =
    <Modal show={showCreateModal} onHide={() => {setShowCreateModal(false)}}>
      <Modal.Header closeButton>
        <Modal.Title>Create a New Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group>
                <Form.Label>Team Name</Form.Label>
                <Form.Control
                  type="text"
                  {...bindTeamName}/>
              </Form.Group>
              <Button type="submit" onClick={() => {setShowCreateModal(false)}}>
                Create Team
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>

  // let joinTeamModal = 
  //   <Modal show={showJoinModal} onHide={setShowJoinModal(false)}>
  //   </Modal>

  // 
  // List of Teams
  // 

  let teamsView =      
    <ul>
      {teams.map((item,index) => {
        return (
          <div key={index} className="team-element">
            <li className="col-12 d-flex width-full border-bottom color-border-secondary">
              <Col md={1} lg={1} className="d-flex justify-content-center">
                <Link to={`/teams/${item.name}`}>
                  <img 
                    className="team-photo avatar"
                    alt="Team logo"
                    src="https://via.placeholder.com/40/555555?text=T"/>
                </Link>
              </Col>
              <Col md={10} lg={9}>
                <Row>
                  <div className="d-inline-block mb-1">
                    <h4 className="wb-break-all">
                      <Link to={`teams/${item.name}`}>
                        {item.name}
                      </Link>
                    </h4>
                  </div>
                </Row>
                <Row className="small">
                  This is a description for the team {item.name}
                </Row>
              </Col>
              <Col md={1} lg={1} className="text-right">
                <div className="d-inline-block mb-1">
                  <Dropdown>
                  <Dropdown.Toggle variant="small primary">
                    <Icon.FiSettings/>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                    <Dropdown.Item href="#">Leave</Dropdown.Item>
                    <Dropdown.Item onClick={() => {deleteTeam(`${item.id}`)}}>Delete</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
                </div>
              </Col>
            </li> 
          </div>
        )
      })}
    </ul>

  // 
  // Main Render Function
  // 

  return (
    <Container fluid>
      <Col sm={12} md={{span: 10, offset: 1}}>
        {createTeamModal}
        <Jumbotron>
          <h1>Teams</h1>
          <p>
            View or modify your current teams. Create or join a new team. <Link to="/docs">Need more info? Read the docs.</Link>
          </p>
          <div>
            <ButtonGroup className="mr-2">
              <Button variant="primary" onClick={() => {setShowCreateModal(true)}}><Icon.FiUsers/> Create Team</Button>
            </ButtonGroup>
            <ButtonGroup className='mr-2'>
              <Button variant="success"><Icon.FiPlus/> Join Team</Button>
            </ButtonGroup>
          </div>
        </Jumbotron>
        <Container className="teams-container">        
        {teams[0]? 
            teamsView: <div className="text-center"><Spinner animation="border" role="status"/></div>}
        </Container> 
      </Col>
    </Container>
  )
}

export default Teams;