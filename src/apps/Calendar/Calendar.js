import React, { Component } from 'react';
import { Container, Table, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import * as Icon from 'react-icons/fi';
import './Calendar.css';

const $ = require('jquery');
$.DataTable = require('datatables.net');

export default class Calendar extends Component{
    constructor(props) {
        super(props);
        document.title = "Opus | Calendar";
        this.state = {
            showCreateModal: false,
            userTeams: [],
            userEvents: [],
            eventName: '',
            eventDetails: '',
            eventTeam: null,
            eventAnnouncement: 0,
            eventPicture: '',
            eventStart: 0,
            eventEnd: 0,
            eventInvited: [],
            eventFilter: this.props.match.params.teamUsername ? this.props.match.params.teamUsername : 'All',
            creationError: null,
            createAnnouncement: false,
            announcementBody: '',
            teamIdToMembersDict: {},
            selectedTeamMembers: [],
            idToTeamDict: {},
        }
    }
    

    componentDidMount() {
        if (this.props.userInfo.username) {
            this.fetchData();
        }
    }

    async fetchData(){
        //Fetching team data is unecessary if events can be filtered by teamid instead of teamname in API
        let teamIds = this.props.userInfo.cliques;       
        let teams = [];
        let membersDict = {};
        let allMembers = [];
        let newIdDict = {};
        for (let id of teamIds) {
            const request = await api.get(urls.teams.fetchById(id));
            teams.push(request.data);
            newIdDict[id] = request.data.name;
            const members = await api.get(urls.teams.fetchMembersById(id));
            membersDict[id] = members.data;
        }
        for (let teamid in membersDict){
            let teamMembersArray=membersDict[teamid];
            for (let member of teamMembersArray) {
                allMembers.push(member);
            }
        }

        this.setState({
            userTeams: teams,
            teamIdToMembersDict: membersDict,
            selectedTeamMembers: allMembers,
            idToTeamDict: newIdDict
        }, () => {this.fetchEvents()});
    }

    async fetchEvents() {
        let teamEventsDict = {};
        let events = []
        for (let team of this.state.userTeams) {
            const request2 = await api.get(urls.event.fetchByTeam(team.name));
            teamEventsDict[team.id] = request2.data;
            events = events.concat(request2.data);
        }
        const request3 = await api.get(urls.event.fetchByUsername(this.props.userInfo.username));
        events = events.concat(request3.data);
        this.setState({
            userEvents: events,
        }, () => {$('#sort_test').DataTable({
            paging: false,
            info: false,
            order: [ 3, 'asc' ],
        });});
    }

    handleChooseTeam(e){
        this.setState({
            eventTeam: parseInt(e.target.value),
            selectedTeamMembers: this.state.teamIdToMembersDict[parseInt(e.target.value)]
        });
    }

    async handleCreate(evt) {
        evt.preventDefault();
        let start = new Date(this.state.eventStart);
        let end = new Date(this.state.eventEnd);
        let team = this.state.eventTeam;
        let us = this.state.eventTeam ? null : this.props.userInfo.id;

        if (!this.createDataIsInvalid()) {
            this.setState({showCreateModal: false})
            let body = {
                name: this.state.eventName,
                start: start.toISOString(),
                end: end.toISOString(),
                details: this.state.eventDetails,
                picture: "event.jpg",
                clique: team,
                user: us,
                invited: [],
                notGoing: [],
            };

            let request = await api.post(urls.event.fetchAll, body);
            body.id = request.data.id;
            let newEventsList = this.state.userEvents;
            newEventsList.push(body);
            if (this.state.createAnnouncement){
                let body2 = {
                    announcement: `Generated announcement for event: ${this.state.eventName}`,
                    clique: this.state.eventTeam,
                    event: body.id,
                    priority: 3,
                    creator: this.props.userInfo.id,
                    end: end.toISOString(),
                    acknowledged: [this.props.userInfo.id]
                };
                let request2 = await api.post(urls.announcement.fetchAll, body2);
            }
            this.setState({
                userEvents: newEventsList,
                eventDetails: '',
                eventPicture: '',
                eventName: ''
            });
        }
        else {
            console.warn('Error creating event.');
        }
    }

    createDataIsInvalid() {
        let now = new Date(Date.now());
        let start = new Date(this.state.eventStart);
        let end = new Date(this.state.eventEnd);
        let errorMessage = [];

        if (!this.state.eventName) {
            errorMessage.push('Event Name is a required field.');
        }
        if (!this.state.eventDetails) {
            errorMessage.push('Event Details is a required field.');
        }
        if (!this.state.eventStart) {
            errorMessage.push('Event Start is a required field.');
        }
        if (!this.state.eventEnd) {
            errorMessage.push('Event End is a required field.');
        }
        if (now > start && this.state.eventStart) {
            errorMessage.push('Event cannot start in the past.');
        }
        if (end < start && this.state.eventStart && this.state.eventEnd) {
            errorMessage.push('Event end must be after event start.');
        }
        this.setState({creationError: errorMessage.length ? errorMessage : false});
        return errorMessage.length;
    }

    async deleteEvent(eventToDelete) {
        const deleteRequest = await api.delete(urls.event.fetchById(eventToDelete.id));
        let filtered = this.state.userEvents.filter((event) => {return event !== eventToDelete});
        this.setState({userEvents: filtered});
    }

    parseDate(isoDate) {
        let splitDate = isoDate.split('T');
        let expirationTime = splitDate[1].split('.')[0];
        if (expirationTime.includes('Z')) {
            expirationTime = expirationTime.slice(0, -1);
        }
        let toReturn = `${splitDate[0]} ${expirationTime} UTC`;
        return toReturn;
    }

    handleFilter(e){
        let filter = e.target.value === '-1' ? -1 : e.target.value;
        this.setState({eventFilter: filter});
    }

    render(){
        return(
            <Container fluid>
                <Modal show={this.state.showCreateModal} onHide={() => {this.setState({showCreateModal: false})}}>
                    <Modal.Header>
                        <Modal.Title>
                            Create an event
                        </Modal.Title>
                    </Modal.Header>
                    <small style={{'paddingLeft': '10px', 'paddingTop': '10px'}}>* indicates required field</small>
                    <Modal.Body>
                        <Form onSubmit={(e) => {this.handleCreate(e)}}>
                            <Form.Group>
                                <Form.Label>Name *</Form.Label>
                                <Form.Control 
                                    type="text"
                                    placeholder="Event name"
                                    onChange={(e) => {this.setState({eventName: e.target.value})}}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Event Start *</Form.Label>
                                <Form.Control type="datetime-local" onChange={(e) => {this.setState({eventStart: e.target.value})}} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Event End *</Form.Label>
                                <Form.Control type="datetime-local" onChange={(e) => {this.setState({eventEnd: e.target.value})}} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Team</Form.Label>
                                <Form.Control as="select" onChange={(e) => {this.handleChooseTeam(e)}}>
                                    <option selected disabled hidden>Choose a team for this event</option>
                                    {this.state.userTeams.map((team) => {
                                        return <option key={team.id} value={team.id}>{team.name}</option>
                                    })}
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId="formControlsSelectMultiple">
                                <Form.Label>Invite Participants</Form.Label>
                                <Form.Control as="select" multiple onChange={(e) => {this.setState({eventInvited: e.target.value})}}>
                                {this.state.selectedTeamMembers.map((member) => {
                                    if (member.id !== this.props.userInfo.id) {
                                        return <option key={member.id} value={member.id}>{member.username}</option>
                                    }
                                    return <></>;
                                })}
                                </Form.Control>
                            </Form.Group> 
                            <Form.Group>
                                <Form.Label>Details *</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    placeholder="Type event details here..."
                                    value={this.state.eventDetails}
                                    onChange={(e) => {this.setState({eventDetails: e.target.value})}}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Alert variant='danger' hidden={!this.state.creationError}>
                                {this.state.creationError ? this.state.creationError.map((msg)=>{return <li>{msg}</li>}) : ''}
                            </Alert>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Modal.Body>
                </Modal>

                <Row>
                    <Col>
                        <h1>Calendar</h1>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Button style={{'marginTop': '10px', 'marginBottom': '10px'}} onClick={() => {this.setState({showCreateModal: true})}}><Icon.FiPlusCircle style={{'marginTop' : '-3px'}} /> Create Event</Button>
                    </Col>
                    <Col>
                        <Row>
                            <h5 style={{'marginTop': '15px'}}>Select Calendar: </h5>
                            <Form.Control style={{'marginTop': '10px', 'marginBottom': '10px', 'marginLeft': '10px'}} as="select" onChange={(e) => {this.handleFilter(e)}}>
                                <option>All</option>
                                {this.state.userTeams.map((team) => {
                                    return <option key={team.id} selected={team.name === this.state.eventFilter} value={team.name}>{team.name} Team</option>;
                                })}
                                <option value={-1}>Events without an associated team</option>
                            </Form.Control>
                        </Row>
                    </Col>
                </Row>              

                <Table bordered id="sort_test">
                    <thead>
                        <tr key={-1}>
                            <th></th>
                            <th>Name<Icon.FiChevronUp className='sortArrows'/><Icon.FiChevronDown /></th>
                            <th>Team<Icon.FiChevronUp className='sortArrows'/><Icon.FiChevronDown /></th>
                            <th>Time<Icon.FiChevronUp className='sortArrows'/><Icon.FiChevronDown /></th>
                            <th>Details<Icon.FiChevronUp className='sortArrows'/><Icon.FiChevronDown /></th>
                        </tr>
                    </thead>

                    <tbody>
                        {this.state.userEvents.map((event) => {
                            let teamId = event.clique ? this.state.idToTeamDict[event.clique] : -1;
                            if (this.state.eventFilter === 'All' || this.state.eventFilter === teamId) {
                                return (
                                    <tr key={event.id}>
                                        <td><Icon.FiXCircle onClick={() => {this.deleteEvent(event)}} size={20}></Icon.FiXCircle></td>
                                        <td>{event.name}</td>
                                        <td>{event.clique ? this.state.idToTeamDict[event.clique] : 'N/A'}</td>
                                        <td>{`${this.parseDate(event.start)} - ${this.parseDate(event.end)}`}</td>
                                        <td>{event.details}</td>
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