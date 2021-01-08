import React, { Component } from 'react';
import { Container, Table, Row, Col, Button, Modal, Form, FormControl, Toast, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import * as Icon from 'react-icons/fi';


export default class Announcements extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Announcements";
        this.state = {
            showCreateModal: false,
            userTeams: [],
            userAnnouncements: [],
            teamToIdDict: {},
            idToTeamDict: {},
            announcementBody: '',
            announcementTeam: 0,
            announcementPriority: 0,
            showCreatedToast: false,
            announcementCreatorDict: {},
            creationError: false,
            teamFilter: 'All',
            priorityDict: {
                1: ['High', 'table-danger'],
                2: ['Medium', 'table-warning'],
                3: ['Low', 'table-success']
            },
        }
    }

    componentDidMount() {
        if (this.props.userInfo.username) {
            this.fetchData();
        }
    }

    async fetchData() {
        let teamIds = this.props.userInfo.cliques;
        let teams = []
        let newTeamDict = {};
        let newIdDict = {};
        for (let id of teamIds) {
            const request = await api.get(urls.teams.fetchById(id));
            teams.push(request.data);
            newTeamDict[request.data.name] = id;
            newIdDict[id] = request.data.name;
        }
        this.setState({
            teamToIdDict: newTeamDict,
            idToTeamDict: newIdDict,
            userTeams: teams
        }, () => {this.fetchAnnouncements()});
    }

    async fetchAnnouncements() {
        let announcements = [];
        let creatorIdToName = {};
        for (let team of this.state.userTeams) {
            const request = await api.get(urls.announcement.fetchByTeam(team.name));
            announcements = announcements.concat(request.data);
            for (let a of request.data) {
                if (!creatorIdToName.hasOwnProperty(a.creator)) {
                    const creatorRequest = await api.get(urls.user.fetchById(a.creator));
                    creatorIdToName[a.creator] = [`${creatorRequest.data.first_name} ${creatorRequest.data.last_name}`, creatorRequest.data.username];
                }
            }
        }
        this.setState({
            userAnnouncements: announcements,
            announcementCreatorDict: creatorIdToName
        });
    }

    async handleCreate(evt) {
        evt.preventDefault();
        if (!this.createDataIsInvalid()) {
            this.setState({showCreateModal: false})
            let body = {
                announcement: this.state.announcementBody,
                clique: this.state.announcementTeam,
                event: 1,
                priority: this.state.announcementPriority,
                creator: this.props.userInfo.id
            };
            let request = await api.post(urls.announcement.fetchAll, body);
            let newAnnouncements = this.state.userAnnouncements;
            newAnnouncements.push(body);
            this.setState({
                userAnnouncements: newAnnouncements,
                showCreatedToast: true
            });
        }
        else {
            console.warn('Error creating announcement.');
        }
    }

    createDataIsInvalid() {
        if (!this.state.announcementBody || this.state.announcementTeam === 0 || ![1,2,3].includes(this.state.announcementPriority)) {
            this.setState({creationError: true});
            return true;
        }
        return false;
    }

    render() {
        return (
            <Container fluid>
                <Modal show={this.state.showCreateModal} onHide={() => {this.setState({showCreateModal: false})}}>
                    <Modal.Header>
                        <Modal.Title>Create an announcement</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={(e) => {this.handleCreate(e)}}>
                            <Form.Group>
                                <Form.Label>Select Team</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementTeam: e.target.value})}}>
                                    <option selected disabled hidden>Choose a team</option>
                                    {this.state.userTeams.map((team) => {
                                        return <option key={team.id} value={team.id}>{team.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Priority</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementPriority: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose a priority</option>
                                    <option value={1}>High</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>Low</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Announcement</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    placeholder="Type your announcement here..."
                                    value={this.state.announcementBody}
                                    onChange={(e) => {this.setState({announcementBody: e.target.value})}}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Alert variant='danger' hidden={!this.state.creationError}>One or more required fields was missing. Try again!</Alert>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Row>
                    <Col>
                        <h1>Announcements</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button style={{'marginTop': '10px', 'marginBottom': '10px'}} onClick={() => {this.setState({showCreateModal: true})}}><Icon.FiPlusCircle style={{'marginTop' : '-3px'}} /> Create Announcement</Button>
                    </Col>
                    <Col>
                        <Toast onClose={() => this.setState({showCreatedToast: false})} show={this.state.showCreatedToast} delay={3000} autohide>
                            <Toast.Header>
                                <img
                                src="holder.js/20x20?text=%20"
                                className="rounded mr-2"
                                alt=""
                                />
                                <strong className="mr-auto">Opus Announcements</strong>
                                <small>Just now</small>
                            </Toast.Header>
                            <Toast.Body>Announcement for team "{this.state.idToTeamDict[this.state.announcementTeam]}" created successfully</Toast.Body>
                        </Toast>
                    </Col>
                    <Col>
                        <Row>
                            <h6 style={{'marginTop': '15px'}}>Filter by Team: </h6>
                            <FormControl style={{'marginTop': '10px', 'marginBottom': '10px', 'marginLeft': '10px'}} as="select" onChange={(e) => {this.setState({teamFilter: e.target.value})}}>
                                <option>All</option>
                                {this.state.userTeams.map((team) => {
                                    return <option key={team.id}>{team.name}</option>;
                                })}
                            </FormControl>
                        </Row>
                    </Col>
                </Row>
                <Table bordered>
                    <thead>
                        <tr key={-1}>
                            <th>Priority</th>
                            <th>Team</th>
                            <th>Creator</th>
                            <th>Message</th>
                            <th>Associated Event</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.userAnnouncements.map((announcement) => {
                            let name = this.state.idToTeamDict[announcement.clique];
                            if (this.state.teamFilter === 'All' || this.state.teamFilter === name) {
                                return (
                                    <tr key={announcement.id} className={this.state.priorityDict[announcement.priority][1]}>
                                        <td>{this.state.priorityDict[announcement.priority][0]}</td>
                                        <td>{this.state.idToTeamDict[announcement.clique]}</td>
                                        <td>
                                            <Link style={{'color':'white'}} to={`/user/${this.state.announcementCreatorDict[announcement.creator][1]}`}>
                                                {this.state.announcementCreatorDict[announcement.creator][0]}
                                            </Link>
                                        </td>
                                        <td>{announcement.announcement}</td>
                                        <td>{announcement.event}</td>
                                    </tr>
                                )
                            }
                            else {
                                return <tr></tr>;
                            }
                        })}
                    </tbody>
                </Table>
            </Container>
        )
    }
}