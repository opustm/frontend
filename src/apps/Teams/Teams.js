import React, { useState, useEffect } from 'react';
import {Container, Jumbotron, Form, Button, Card, Table} from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import * as Icon from 'react-icons/fi';
import './teams.css';

export default function Teams(props) {
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
      console.log(`Error while fetching Teams ${err}`);
      setTeams([]);
    }
  }, []); // Dependencies need to be included in useEffect

  return (
    <Container fluid>
          <Jumbotron>
            <h1>Create or Join a Team</h1>
            <p>
              Instructions erspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, tium doloremque laudantium, tot
            </p>
              <Form.Row>
                <p>
                  <Button variant="success"><Icon.FiPlus/> New Team</Button>
                </p>
                <Form.Control type="text" placeholder="Enter a code or link"/>
                <Button variant="primary" type="submit">Join</Button>
              </Form.Row>
          </Jumbotron>
        <Card>
        <Card.Header><Card.Title>Your Teams</Card.Title>
        <small>You are a member in the following teams</small>
        </Card.Header>
        <Card.Body>
          <Table striped hover>
            <tbody>
              {teams.map((item,index) => {
                return (
                  <tr key={index}>
                    <td>
                      <img src={item.picture}
                        className="avatar"
                        alt="Team profile avatar"/>
                    </td>
                    <td>
                      {item.name}
                    </td>
                    <td>
                      {item.cliqueType}
                    </td>
                  </tr>
                )})}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  )
}
