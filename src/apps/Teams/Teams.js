import React, { useState, useEffect } from 'react';
import {Container, Dropdown, Row, Col, Jumbotron, Button, ButtonGroup} from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Link, Redirect } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import './teams.css';

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
                      <Dropdown.Item href="#">Delete</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                  </div>
                </Col>
              </li> 
            </div>
          )
        })}
      </ul>
    </Container>

  return (
    <Container fluid>
      <Col sm={12} md={{span: 10, offset: 1}}>
        <Jumbotron>
          <h1>Teams</h1>
          <p>
            View or modify your current teams. Create or join a new team. <Link to="/docs">Need more info? Read the docs.</Link>
          </p>
          <div>
            <ButtonGroup className="mr-2">
              <Button variant="primary"><Icon.FiUsers/> Create Team</Button>
            </ButtonGroup>
            <ButtonGroup className='mr-2'>
              <Button variant="success"><Icon.FiPlus/> Join Team</Button>
            </ButtonGroup>
          </div>
        </Jumbotron>
        {teams? teamsView : <p>It's empty here. You are not a member of any teams yet. Create or Join a team above.</p>}
      </Col>
    </Container>
  )
}

export default Teams;