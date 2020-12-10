import React, { useState, useEffect } from 'react';
import {Container, Dropdown, DropdownButton, Row, Col, Jumbotron, Form, Button, Card, Table, ButtonGroup} from 'react-bootstrap';
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
      console.log(request.data);
      return request;
    }
    try{
      fetchTeams();
    }
    catch (err) {
      <Redirect to="/404"/>
    }
  }, []); // Dependencies need to be included in useEffect

  return (
    <Container fluid>
      <Col sm={12} md={{span: 10, offset: 1}}>
        <Jumbotron>
          <h1>Opus Teams</h1>
          <p>
            View or modify your current teams. Create or join a new team. It's all here. <Link to="/docs">Need more info? Read the docs.</Link>
          </p>
          
          <p>
            <ButtonGroup className="mr-2">
              <Button variant="primary"><Icon.FiUsers/> Create Team</Button>
            </ButtonGroup>
            <ButtonGroup className='mr-2'>
              <Button variant="success"><Icon.FiPlus/> Join Team</Button>
            </ButtonGroup>
          </p>
        </Jumbotron>
        <Container className="teams-container">
          
          {teams.map((item,index) => {
            return (
              <div key={index} class="team-element border-bottom">
              <Row>
                <h4><Link to="#">{item.name}</Link></h4>
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
      </Col>
    </Container>
  )
}

export default Teams;