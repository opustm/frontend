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
            teamEvents: [],
            idToEventDict: {},
            announcementBody: '',
            announcementTeam: 0,
            announcementEvent: null,
            announcementPriority: 0,
            announcementDuration: 0,
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
        let events = []
        let idToEvent = {};

        for (let id of teamIds) {
            const request = await api.get(urls.teams.fetchById(id));
            teams.push(request.data);
            newTeamDict[request.data.name] = id;
            newIdDict[id] = request.data.name;
        }

        for (let id of teamIds) {
            const request2 = await api.get(urls.event.fetchTeamEvents(newIdDict[id]));
            let dataarray = request2.data;
            for (let event of dataarray){
                let eventid=event["id"];
                events.push(event);
                idToEvent[eventid]=event;
            }
        }

        this.setState({
            teamToIdDict: newTeamDict,
            idToTeamDict: newIdDict,
            userTeams: teams,
            teamEvents: events,
            idToEventDict: idToEvent
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
            // Date.now() gets current time as ms from 1/1/1970, 3600000 * hours = announcement duration in milliseconds
            // Create new Date object with their sum to get the expiration date in ISO 8601 format
            let expirationDate = new Date(Date.now() + (3600000 * this.state.announcementDuration));
            let isoExpiration = expirationDate.toISOString();
            let body = {
                announcement: this.state.announcementBody,
                clique: this.state.announcementTeam,
                event: this.state.announcementEvent,
                priority: this.state.announcementPriority,
                creator: this.props.userInfo.id,
                end: isoExpiration,
                acknowledged: [this.props.userInfo.id]
            };
            let request = await api.post(urls.announcement.fetchAll, body);
            body.id = request.data.id;
            let newAnnouncements = this.state.userAnnouncements;
            newAnnouncements.push(body);
            this.setState({
                userAnnouncements: newAnnouncements,
                showCreatedToast: true,
                announcementBody: ''
            });
        }
        else {
            console.warn('Error creating announcement.');
            this.setState({announcementBody: ''});
        }
    }

    createDataIsInvalid() {
        if (!this.state.announcementBody || this.state.announcementTeam === 0 || ![1,2,3].includes(this.state.announcementPriority) || this.state.announcementDuration < 1) {
            this.setState({creationError: true});
            return true;
        }
        return false;
    }

    async deleteAnnouncement(announcementToDelete) {
        await api.delete(urls.announcement.fetchById(announcementToDelete.id));
        let filtered = this.state.userAnnouncements.filter((announcement) => {return announcement !== announcementToDelete;});
        this.setState({userAnnouncements: filtered});
    }

    parseEnd(isoDate) {
        let splitDate = isoDate.split('T');
        let expirationTime = splitDate[1].split('.')[0];
        if (expirationTime.includes('Z')) {
            expirationTime = expirationTime.slice(0, -1);
        }
        let toReturn = `${splitDate[0]} ${expirationTime} UTC`;
        return toReturn;
    }

    render() {
        return (
            <Container fluid>
                <Modal show={this.state.showCreateModal} onHide={() => {this.setState({showCreateModal: false})}}>
                    <Modal.Header>
                        <Modal.Title>
                            Create an announcement
                        </Modal.Title>
                    </Modal.Header>
                    <small style={{'paddingLeft': '10px', 'paddingTop': '10px'}}>* indicates required field</small>
                    <Modal.Body>
                        <Form onSubmit={(e) => {this.handleCreate(e)}}>
                            <Form.Group>
                                <Form.Label>Select Team *</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementTeam: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose a team</option>
                                    {this.state.userTeams.map((team) => {
                                        return <option key={team.id} value={team.id}>{team.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Event</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementEvent: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose an event</option>
                                    {this.state.teamEvents.map((event) => {
                                        return <option key={event.id} value={event.id}>{event.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Select Priority *</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementPriority: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose a priority</option>
                                    <option value={1}>High</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>Low</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Announcement Duration in Hours (Minimum: 1) *</Form.Label>
                                <Form.Control type="number" onChange={(e) => {this.setState({announcementDuration: parseInt(e.target.value)})}} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Announcement *</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    placeholder="Type your announcement here..."
                                    value={this.state.announcementBody}
                                    onChange={(e) => {this.setState({announcementBody: e.target.value})}}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Alert variant='danger' hidden={!this.state.creationError}>Error: You've entered invalid data or forgotten to fill out one of the fields.</Alert>
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
                        <Row>
                            <h5 style={{'marginTop': '10px'}}>Priority Legend:</h5>
                        </Row>
                        <Row>
                            <Icon.FiSquare style={{'fill': '#e74c3c', 'color': '#e74c3c', 'marginTop': '5px'}}></Icon.FiSquare>
                            {this.state.priorityDict[1][0]}
                        </Row>
                        <Row>
                            <Icon.FiSquare style={{'fill': '#f39c12', 'color': '#f39c12', 'marginTop': '5px'}}></Icon.FiSquare>
                            {this.state.priorityDict[2][0]}
                        </Row>
                        <Row>
                            <Icon.FiSquare style={{'fill': '#18bc9c', 'color': '#18bc9c', 'marginTop': '5px'}}></Icon.FiSquare>
                            {this.state.priorityDict[3][0]}
                        </Row>
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
                            <th></th>
                            <th>Team</th>
                            <th>Creator</th>
                            <th>Message</th>
                            <th>Associated Event</th>
                            <th>Expires</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.userAnnouncements.map((announcement) => {
                            let name = this.state.idToTeamDict[announcement.clique];
                            if (this.state.teamFilter === 'All' || this.state.teamFilter === name) {
                                let now = new Date(Date.now()).toISOString();
                                if (now > announcement.end) {
                                    this.deleteAnnouncement(announcement);
                                    return <tr></tr>;
                                }
                                else {
                                    return (
                                        <tr key={announcement.id} className={this.state.priorityDict[announcement.priority][1]}>
                                            <td><Icon.FiXCircle onClick={() => {this.deleteAnnouncement(announcement)}} size={20} style={{'marginRight': '-20px'}}></Icon.FiXCircle></td>
                                            <td>{this.state.idToTeamDict[announcement.clique]}</td>
                                            <td>
                                                <Link style={{'color':'white'}} to={`/user/${this.state.announcementCreatorDict[announcement.creator][1]}`}>
                                                    {this.state.announcementCreatorDict[announcement.creator][0]}
                                                </Link>
                                            </td>
                                            <td>{announcement.announcement}</td>
                                            <td>{announcement.event ? this.state.idToEventDict[announcement.event]["name"] : 'N/A'}</td>
                                            <td>{announcement.end ? this.parseEnd(announcement.end) : 'Never'}</td>
                                        </tr>
                                    )
                                }
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