import React, { useState, useEffect } from 'react';
import {Container, Dropdown, Row, Col, Jumbotron, Button, ButtonGroup} from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Link } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import './teams.css';
import { Redirect } from 'react-router-dom';

const Teams = () => {
  const [teams,setTeams] = useState([0]);
  useEffect(() => {
    async function fetchTeams() {
      const request = await api.get(urls.teams.fetchAll);
      setTeams(request.data);
      return request;
    }
    try{
      fetchTeams();
    }
    catch (err) {
      <Redirect to="/404"/>
    }
  }, []); // Dependencies need to be included in useEffect

  let teamsView =      
    <Container className="teams-container">        
      {teams.map((item,index) => {
        return (
          <div key={index} className="team-element">
          <Row>
            <Link to="#">
            <img 
              alt='team avatar'
              className="team-photo avatar"
              src="https://via.placeholder.com/40/555555?text=T"/>
              <h4>{item.name}</h4>
            </Link>
            <Dropdown>
              <Dropdown.Toggle variant="outline-primary">
                <Icon.FiSettings/>
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item href="#">Edit</Dropdown.Item>
                <Dropdown.Item href="#">Leave</Dropdown.Item>
                <Dropdown.Item href="#">Delete</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Row>
          </div>
        )
      })}
    </Container>

  return (
    <Container fluid>
      <Col sm={12} md={{span: 10, offset: 1}}>
        <Jumbotron>
          <h1>Teams</h1>
          <p>
            View or modify your current teams. Create or join a new team. <Link to="/docs">Need more info? Read the docs.</Link>
          </p>
          <Row>
            <ButtonGroup className="mr-2">
              <Button variant="primary"><Icon.FiUsers/> Create Team</Button>
            </ButtonGroup>
            <ButtonGroup className='mr-2'>
              <Button variant="success"><Icon.FiPlus/> Join Team</Button>
            </ButtonGroup>
          </Row>
        </Jumbotron>
        {teams? teamsView : <p>It's empty here. You are not a member of any teams yet. Create or Join a team above.</p>}
      </Col>
    </Container>
  )
}

export default Teams;