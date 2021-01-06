import React, { useState, useEffect } from 'react';
import { Container, Table, Row, Col, Button, Modal, Form, FormControl } from 'react-bootstrap';
import { useInput } from '../../services/forms.service';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Redirect } from 'react-router-dom';
import * as Icon from 'react-icons/fi';


function Announcements(props) {
    // For filtering the announcements by team:
    // Get all of the announcements for a user to begin with and save those, that way we don't have to make API call after API call
    // Once we have them, we'll include a dropdown that allows the user to display only the announcements related to the selected team
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [userTeams, setUserTeams] = useState([0]);
    const [teamFilter, setTeamFilter] = useState('All');
    const dummyAnnouncements = [
        {
            id: 0,
            announcement: 'Hello Opus',
            clique: 1,
            event: 'DummyEvent',
            priority: 'high',
            creator: 'God'
        },
        {
            id: 99,
            announcement: 'Goodbye Opus',
            clique: 1,
            event: 'DummyEvent2',
            priority: 'medium',
            creator: 'Patrick Mahomes'
        },
        {
            id: 100,
            announcement: 'No show',
            clique: 2,
            event: 'DummyEvent3',
            priority: 'low',
            creator: 'Kelly Oubre Jr.'
        }
    ]
    const [announcements, setAnnouncements] = useState(dummyAnnouncements);
    const [teamDict, setTeamDict] = useState({});
    const { value:announcementTeam, bind:bindAnnouncementTeam, reset:resetAnnouncementTeam} = useInput('');
    const { value:announcementBody, bind:bindAnnouncementBody, reset:resetAnnouncementBody} = useInput('');

    const colorDict = {
        'high': 'table-danger',
        'medium': 'table-warning',
        'low': 'table-success'
    }

    useEffect(() => {
        async function fetchTeams() {
          const request = await api.get(urls.teams.fetchByUsername(props.userInfo.username));
        //   let userAnnouncements = []
        //   for (let team of userTeams) {
        //       const request = await api.get(urls.announcement.fetchByTeam(team.name));
        //       userAnnouncements.concat(request.data);
        //   }
          setUserTeams(request.data);
          return request;
        //   setAnnouncements(userAnnouncements);
        }

        try{
          fetchTeams();
          createTeamDict();
        }
        catch (err) {
          <Redirect to="/404"/>
        }
      }, []);

    let createTeamDict = () => {
        let newDict = {};
        for (let team of userTeams) {
            newDict[team.name] = team.id;
        }
        setTeamDict(newDict);
    }

    let handleCreate = (evt) => {
        evt.preventDefault();
        let body = {
            announcement: announcementBody,
            clique: 1,
            event: 'DummyEvent2',
            priority: 'medium',
            creator: props.userInfo.id
        };
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
                        <Form.Control as="select" {...bindAnnouncementTeam}>
                            {userTeams.map((team) => {
                                return <option key={team.id}>{team.name}</option>
                            })}
                        </Form.Control>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Announcement</Form.Label>
                        <Form.Control as="textarea" placeholder="Type your announcement here..." {...bindAnnouncementBody}></Form.Control>
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
                    <h4>Filter by Team: </h4>
                    <FormControl as="select" onChange={(e) => {setTeamFilter(e.target.value)}}>
                        <option>All</option>
                        {userTeams.map((team) => {
                            return <option key={team.id}>{team.name}</option>;
                        })}
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
                        <th>Associated Event</th>
                    </tr>
                </thead>
                <tbody>
                    {announcements.map((announcement) => {
                        if (teamFilter === 'All') {
                            return (
                                <tr key={announcement.id} className={colorDict[announcement.priority]}>
                                    <td>{announcement.priority}</td>
                                    <td>{announcement.clique}</td>
                                    <td>{announcement.creator}</td>
                                    <td>{announcement.announcement}</td>
                                    <td>{announcement.event}</td>
                                </tr>
                            )
                        }
                        else {
                            return '';
                        }
                    })}
                </tbody>
            </Table>
            <Button onClick={() => {console.log(announcements)}}>Announcements</Button>
            <Button onClick={() => {console.log(userTeams)}}>Teams</Button>
            <Button onClick={() => {console.log(teamDict)}}>Team Dict</Button>
        </Container>

    )
}

export default Announcements;