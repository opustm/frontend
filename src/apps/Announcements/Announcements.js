import React, { useState, useEffect } from 'react';
import { Container, Table, Row, Col, Button, Modal, Form, FormControl } from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Redirect } from 'react-router-dom';
import * as Icon from 'react-icons/fi';


function Announcements(props) {
    // For filtering the announcements by team:
    // Get all of the announcements for a user to begin with and save those, that way we don't have to make API call after API call
    // Once we have them, we'll include a dropdown that allows the user to display only the announcements related to the selected team
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userTeams, setUserTeams] = useState([0]);

    useEffect(() => {
        async function fetchTeams() {
          const request = await api.get(urls.teams.fetchByUsername(props.userInfo.username));
          setUserTeams(request.data);
          return request;
        }
        try{
          fetchTeams();
        }
        catch (err) {
          <Redirect to="/404"/>
        }
      }, [userTeams, props.userInfo.username]);


    let handleCreate = (evt) => {
        evt.preventDefault();
        console.log('created!');
        console.log(userTeams);
    }

    let createAnnouncementModal = 
        <Modal show={showCreateModal} onHide={() => {setShowCreateModal(false)}}>
            <Modal.Header>
                <Modal.Title>Create an announcement</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleCreate}>
                    <Form.Group>
                        <Form.Label>Select Group</Form.Label>
                        <Form.Control as="select">
                            <option>Test 1</option>
                            <option>Test 1</option>
                            <option>Test 1</option>
                            <option>Test 1</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Announcement</Form.Label>
                        <Form.Control as="textarea" placeholder="Type your announcement here..."></Form.Control>
                    </Form.Group>
                    <Button type="submit" onClick={() => {setShowCreateModal(false)}}>Submit</Button>
                </Form>
            </Modal.Body>
        </Modal>
    return (
        <Container fluid>
            {createAnnouncementModal}
            <Row>
                <Col>
                    <h1>Announcements</h1>
                </Col>
                <Col>
                    <Button onClick={() => {setShowCreateModal(true)}}><Icon.FiPlusCircle /> Create Announcement</Button>
                </Col>
                <Col>
                    
                        <h4>Filter by group: </h4>
                        <FormControl as="select">
                            <option>Team 1</option>
                            <option>Team 2</option>
                        </FormControl>
                    
                </Col>
            </Row>
            <Table striped bordered>
                <thead>
                    <tr>
                        <th>Priority</th>
                        <th>Team</th>
                        <th>Creator</th>
                        <th>Message</th>
                    </tr>
                </thead>
            </Table>
        </Container>

    )
}

export default Announcements;