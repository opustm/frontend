import React, { Component } from 'react';
import { Container, Jumbotron, Row, Col, Button, Modal, Form, FormControl, Toast, Alert, Spinner } from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import * as Icon from 'react-icons/fi';
import './Announcements.css';

const columns = [
    { dataField: 'x', text: '' },
    { dataField: 'priority', text: 'Priority', sort: true },
    { dataField: 'team', text: 'Team', sort: true },
    { dataField: 'creator', text: 'Creator', sort: true },
    { dataField: 'message', text: 'Message', sort: true },
    { dataField: 'event', text: 'Associated Event', sort: true },
    { dataField: 'expires', text: 'Expires', sort: true }
]

export default class Announcements extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Announcements";
        this.state = {
            showCreateModal: false,
            showSpinner: true,
            userTeams: [],
            userAnnouncements: [],
            announcementObjects: [],
            displayedAnnouncements: [],
            idToTeamDict: {},
            teamEvents: [],
            idToEventDict: {},
            announcementBody: '',
            announcementTeam: -1,
            announcementEvent: null,
            announcementPriority: 0,
            announcementDuration: 0,
            showCreatedToast: false,
            creationError: false,
            teamFilter: this.props.match.params.teamUsername ? this.props.match.params.teamUsername : 'All',
            priorityFilter: 0,
            priorityDict: {
                0: ['All'],
                1: ['High', '#e74c3c'],
                2: ['Medium', '#f39c12'],
                3: ['Low', '#18bc9c']
            },
            styleDict: {
                'High': 'table-danger',
                'Medium': 'table-warning',
                'Low': 'table-success'
            }
        }
    }

    componentDidMount() {
        this.fetchData();
    }

    async fetchData() {
        let idToEvent = {};
        let idToTeam = {};
        const request = await api.get(urls.user.fetchTeams(this.props.userInfo.id));
        let teams = request.data;
        teams.forEach((team) => {idToTeam[team.id] = team.name});

        const eventRequest = await api.get(urls.event.fetchByUser(this.props.userInfo.id));
        let teamEvents = eventRequest.data.filter((event) => {return event.team});
        teamEvents.forEach((event) => {idToEvent[event.id] = event});

        this.setState({
            userTeams: teams,
            teamEvents: teamEvents,
            idToEventDict: idToEvent,
            idToTeamDict: idToTeam
        }, () => {this.fetchAnnouncements()});
    }

    async fetchAnnouncements() {
        const announcementRequest = await api.get(urls.announcement.fetchByUser(this.props.userInfo.id));
        let announcements = announcementRequest.data;
        let tableObjects = [];
        announcements.forEach((announcement) => {
            let object = {
                x: <Icon.FiXCircle data-testid="deleteButton" className='deleteButton' size={20} onClick={() => {this.deleteAnnouncement(announcement)}}/>,
                priority: this.state.priorityDict[announcement.priority][0],
                team: announcement.team.name,
                creator: `${announcement.creator.first_name} ${announcement.creator.last_name}`,
                message: announcement.announcement,
                event: announcement.event ? this.state.idToEventDict[announcement.event]["name"] : 'N/A',
                expires: this.parseEnd(announcement.end)
            };
            tableObjects.push(object);
        })
        this.setState({
            userAnnouncements: announcements,
            announcementObjects: tableObjects,
            showSpinner: false
        }, () => {this.handleTeamFilter(this.state.teamFilter)});
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
                team: this.state.announcementTeam,
                event: this.state.announcementEvent,
                priority: this.state.announcementPriority,
                creator: this.props.userInfo.id,
                end: isoExpiration,
                acknowledged: [this.props.userInfo.id]
            };
            let request = await api.post(urls.announcement.fetchAll(), body);
            body.id = request.data.id;
            let newAnnouncements = this.state.userAnnouncements;
            newAnnouncements.push(body);

            let tableObject = {
                x: <Icon.FiXCircle data-testid="deleteButton" className='deleteButton' size={20} onClick={() => {this.deleteAnnouncement(body)}}/>,
                priority: this.state.priorityDict[this.state.announcementPriority][0],
                team: this.state.idToTeamDict[this.state.announcementTeam],
                creator: `${this.props.userInfo.first_name} ${this.props.userInfo.last_name}`,
                message: this.state.announcementBody,
                event: this.state.announcementEvent ? this.state.idToEventDict[this.state.announcementEvent]['name'] : 'N/A',
                expires: this.parseEnd(isoExpiration)
            }
            let tableObjects = this.state.announcementObjects;
            tableObjects.push(tableObject);
            let displayed = this.state.displayedAnnouncements;
            if ((tableObject.priority === this.state.priorityDict[this.state.priorityFilter][0] || this.state.priorityFilter === 0) && (tableObject.team === this.state.teamFilter || this.state.teamFilter === 'All')) {
                displayed.push(tableObject);
            }
            this.setState({
                userAnnouncements: newAnnouncements,
                showCreatedToast: true,
                showCreateModal: false,
                announcementBody: '',
                announcementObjects: tableObjects,
                displayedAnnouncements: displayed
            });
        }
        else {
            console.warn('Error creating announcement.');
            this.setState({announcementBody: ''});
        }
    }

    createDataIsInvalid() {
        if (!this.state.announcementBody || this.state.announcementTeam === -1 || ![1,2,3].includes(this.state.announcementPriority) || this.state.announcementDuration < 1) {
            this.setState({creationError: true});
            return true;
        }
        return false;
    }

    async deleteAnnouncement(announcementToDelete) {
        await api.delete(urls.announcement.fetchById(announcementToDelete.id));
        let filtered = this.state.userAnnouncements.filter((announcement) => {return announcement !== announcementToDelete;});
        let filteredObjects = this.state.announcementObjects.filter((object) => {return (object.message !== announcementToDelete.announcement)})
        let filteredDisplayed = this.state.displayedAnnouncements.filter((object) => {return (object.message !== announcementToDelete.announcement)})
        this.setState({
            userAnnouncements: filtered,
            announcementObjects: filteredObjects,
            displayedAnnouncements: filteredDisplayed
        });
    }

    handleTeamFilter(team) {
        let filtered = this.state.announcementObjects.filter((object) => {
            return (object.team === team || team === 'All') && (object.priority === this.state.priorityDict[this.state.priorityFilter][0] || this.state.priorityFilter === 0)});
        this.setState({
            teamFilter: team,
            displayedAnnouncements: filtered
        });
    }

    handlePriorityFilter(priority) {
        let priorityName = this.state.priorityDict[parseInt(priority)][0];
        let filtered = this.state.announcementObjects.filter((object) => {
            return (object.priority === priorityName || priorityName === 'All') && (object.team === this.state.teamFilter || this.state.teamFilter === 'All') });
        this.setState({
            displayedAnnouncements: filtered,
            priorityFilter: parseInt(priority)
        });
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
                            <Form.Group controlId="teamSelect">
                                <Form.Label>Select Team *</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementTeam: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose a team</option>
                                    {this.state.userTeams.map((team) => {
                                        return <option key={team.id} value={team.id}>{team.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="eventSelect">
                                <Form.Label>Select Event</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementEvent: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose an event</option>
                                    {this.state.announcementTeam ? this.state.teamEvents.filter((event) => {
                                        return event.team.id === this.state.announcementTeam
                                    }).map((event) => {
                                        return <option key={event.id} value={event.id}>{event.name}</option>
                                    }) : <option disabled>You must select a team first</option>
                                }
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="prioritySelect">
                                <Form.Label>Select Priority *</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.setState({announcementPriority: parseInt(e.target.value)})}}>
                                    <option selected disabled hidden>Choose a priority</option>
                                    <option value={1}>High</option>
                                    <option value={2}>Medium</option>
                                    <option value={3}>Low</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="durationInput">
                                <Form.Label>Announcement Duration in Hours (Minimum: 1) *</Form.Label>
                                <Form.Control type="number" onChange={(e) => {this.setState({announcementDuration: parseInt(e.target.value)})}} />
                            </Form.Group>
                            <Form.Group controlId="announcementInput">
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


                <Jumbotron>
                    <Row>
                        <Col>
                            <h1>Announcements</h1>
                            <p>
                                View or modify your announcements. Make announcements to your team or groups.
                            </p>
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
                        {Object.keys(this.state.priorityDict).map((key) => {
                            if (key !== '0') {
                                let lis = this.state.priorityDict[key];
                                return (
                                    <Row key={key}>
                                        <Icon.FiSquare style={{'fill': lis[1], 'color': lis[1]}}/>
                                        {lis[0]}
                                    </Row>
                                )
                            } else {return ''}
                        })}
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
                        <Row >
                            <h6 style={{'marginTop': '15px'}}>Filter by Priority: </h6>
                        </Row>
                        <Row style={{marginRight: '10px'}}>
                            <FormControl as="select" onChange={(e) => {this.handlePriorityFilter(e.target.value)}}>
                                {Object.keys(this.state.priorityDict).map((priorityKey) => {
                                    return <option key={priorityKey} value={priorityKey}>{this.state.priorityDict[priorityKey][0]}</option>
                                })}
                            </FormControl>
                        </Row>
                    </Col>
                    <Col>
                        <Row style={{marginRight: '10px'}}>
                            <h6 style={{'marginTop': '15px'}}>Filter by Team: </h6>
                        </Row>
                        <Row style={{marginRight: '10px'}}>
                            <FormControl as="select" onChange={(e) => {this.handleTeamFilter(e.target.value)}}>
                                <option>All</option>
                                {this.state.userTeams.map((team) => {
                                    return <option selected={team.name === this.state.teamFilter} key={team.id}>{team.name}</option>;
                                })}
                            </FormControl>
                        </Row>
                    </Col>
                </Row>
                </Jumbotron>
                {this.state.showSpinner ? 
                    <Spinner animation="border" role="status"/> :
                    <></>
                }
                <BootstrapTable keyField='id' data={ this.state.displayedAnnouncements } columns={ columns } rowClasses={(row) => {return this.state.styleDict[row.priority]} }/>
            </Container>
            
        )
    }
}