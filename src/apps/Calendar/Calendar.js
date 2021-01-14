import React, { Component } from 'react';
import { Container, Table, Row, Col, Button, Modal, Form, Alert } from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import * as Icon from 'react-icons/fi';


export default class Calendar extends Component{
    constructor(props) {
        super(props);
        document.title = "Opus | Calendar";
        this.state = {
            showCreateModal: false,
            userTeams: [],
            userTeamEventsDict: {},
            userTeamEvents:[],
            userUserEvents:[],
            eventName: '',
            eventDetails: '',
            eventTeam: null,
            eventAnnouncement: 0,
            eventPicture: '',
            eventStart: 0,
            eventEnd: 0,
            eventInvited: [],
            eventFilter: 'All',
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
        let teams=[];
        let membersDict={};
        let allMembers=[];
        let newIdDict = {};
        for (let id of teamIds) {
            const request = await api.get(urls.teams.fetchById(id));
            teams.push(request.data);
            newIdDict[id]=request.data.name;
            const members = await api.get(urls.teams.fetchMembersById(id));
            membersDict[id]=members.data;
        }
        for(let teamid in membersDict){
            let teamMembersArray=membersDict[teamid];
            for (let member of teamMembersArray) {
                allMembers.push(member);
            }
        }
        
        this.setState({
            userTeams: teams,
            teamIdToMembersDict: membersDict,
            selectedTeamMembers: allMembers,
            idtoTeamDict: newIdDict
        }, () => {this.fetchEvents()});
    }

    async fetchEvents() {
        let teamEventsDict = {};
        let teamEvents = [];
        let userEvents = [];
        for (let team of this.state.userTeams) {
            const request2 = await api.get(urls.event.fetchByTeam(team.name));
            teamEventsDict[team.id]=request2.data;
            teamEvents=request2.data;
        }
        const request3 = await api.get(urls.event.fetchByUsername(this.props.userInfo.username));
        userEvents=request3.data;
        this.setState({
            userUserEvents: userEvents,
            userTeamEventsDict: teamEventsDict,
            userTeamEvents: teamEvents
        });
    }

    handleChooseTeam(e){
        this.setState({eventTeam: parseInt(e.target.value)});
        this.setState({selectedTeamMembers: this.state.teamIdToMembersDict[parseInt(e.target.value)]});
    }

    async handleCreate(evt) {
        evt.preventDefault();
        //2021-01-11T12:22
        let s=this.state.eventStart;
        let start = new Date(s.substring(0,4), s.substring(5,7),s.substring(8,10),s.substring(11,13),s.substring(14), "00");
        let e=this.state.eventEnd;
        let end = new Date(e.substring(0,4), e.substring(5,7),e.substring(8,10),e.substring(11,13),e.substring(14), "00");
        let tem=this.state.eventTeam;
        let us = null;
        if (this.state.eventTeam === 0){
            tem=null;
            us = this.props.userInfo.id;
        }


        
        if (!this.createDataIsInvalid()) {
            this.setState({showCreateModal: false})
            let body = {
                name: this.state.eventName,
                start: start.toISOString(),
                end: end.toISOString(),
                details: this.state.eventDetails,
                picture: "event.jpg",
                clique: tem,
                user: us,
                invited: [],
                notGoing: [],
            };

            let request = await api.post(urls.event.fetchAll, body);
            body.id = request.data.id;
            let newEvents = this.state.userTeamEventsDict;
            newEvents[this.state.eventTeam]=(body);
            let newEventsList = this.state.userTeamEvents;
            newEventsList.push(body);
            if (this.state.createAnnouncement){
                let body2 = {
                    announcement: `generated announcement for event: ${this.state.eventName}`,
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
                userTeamEventsDict: newEvents,
                userTeamEvents: newEventsList,
                eventDetails: '',
                eventPicture: '',
                eventName: ''
            });
        }
        else {
            console.warn('Error creating event.');
            this.setState({eventBody: ''});
        }
    }

    //will need to improve validation
    createDataIsInvalid() {
        if (!this.state.eventDetails) {
            this.setState({creationError: true});
            return true;
        }
        return false;
    }

    async deleteTeamEvent(eventToDelete) {
        const deleteRequest = await api.delete(urls.event.fetchById(eventToDelete.id));
        let filtered = this.state.userTeamEvents.filter((event) => {return event !== eventToDelete;});
        this.setState({userTeamEvents: filtered});
    }

    async deleteUserEvent(eventToDelete) {
        const deleteRequest = await api.delete(urls.event.fetchById(eventToDelete.id));
        let filtered = this.state.userUserEvents.filter((event) => {return event !== eventToDelete;});
        this.setState({userUserEvents: filtered});
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
        this.setState({eventFilter: e.target.value});
        this.forceUpdate()//not sure if this is the best way to reload the table event info.
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
                                <Form.Label>Name*</Form.Label>
                                <Form.Control 
                                    type="text"
                                    placeholder="Event name"
                                    onChange={(e) => {this.setState({eventName: e.target.value})}}>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Event Start*</Form.Label>
                                <Form.Control type="datetime-local" onChange={(e) => {this.setState({eventStart: e.target.value})}} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Event End*</Form.Label>
                                <Form.Control type="datetime-local" onChange={(e) => {this.setState({eventEnd: e.target.value})}} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Team *</Form.Label>
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
                                {/* <option selected disabled hidden>Choose participants</option> */}
                                {this.state.selectedTeamMembers.map((member) => {
                                    return <option key={member.id} value={member.id}>{member.username}</option>
                                })}
                                </Form.Control>
                            </Form.Group> 
                            <Form.Group>
                                <Form.Label>Details</Form.Label>
                                <Form.Control 
                                    as="textarea"
                                    placeholder="Type event details here..."
                                    value={this.state.eventDetails}
                                    onChange={(e) => {this.setState({eventDetails: e.target.value})}}
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
                                <option style={{textTransform: 'capitalize'}} value={this.props.userInfo.id}>{this.props.userInfo.username} User</option>
                                {this.state.userTeams.map((team) => {
                                    return <option style={{textTransform: 'capitalize'}} key={team.id} value={team.name}>{team.name} Team</option>;
                                })}
                            </Form.Control>
                        </Row>
                    </Col>
                </Row>              

                <Table bordered id="sort_test">
                    <thead>
                        <tr key={-1}>
                            <th>Date</th>
                            <th>Event</th>
                            <th>X</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr></tr>
                        {this.state.userTeamEvents.map((event) => {
                            let st='table-primary';
                            if (event.start.substring[6]==="2"){
                                st='table-primary';
                            }
                            let teamName=null;
                            if (event.clique != null){
                                teamName = this.state.idToTeamDict[event.clique];
                            }

                            if (this.state.eventFilter === 'All' || this.state.eventFilter === teamName) {
                                return (
                                    <tr key={event.id} className={st}>
                                        <td>{event.start.substring(5,10)}</td>
                                        <td>{event.name}<br/><p>{event.start.substring(11,16)}-{event.end.substring(11,16)}</p></td>
                                        <td><Icon.FiXCircle onClick={() => {this.deleteTeamEvent(event)}} size={20}></Icon.FiXCircle></td>
                                    </tr>
                                )
                            }
                            else {
                                return <tr></tr>;
                            }
                        })}
                        {this.state.userUserEvents.map((userEvent) => {
                            let st='table-primary';
                            if (userEvent.start.substring[6]==="2"){
                                st='table-primary';
                            }
                            if (this.state.eventFilter === 'All' || this.state.eventFilter === this.props.userInfo.id) {
                                return (
                                    <tr key={userEvent.id} className={st}>
                                        <td>{userEvent.start.substring(5,10)}</td>
                                        <td>{userEvent.name}<br/><p>{userEvent.start.substring(11,16)}-{userEvent.end.substring(11,16)}</p></td>
                                        <td><Icon.FiXCircle onClick={() => {this.deleteUserEvent(userEvent)}} size={20}></Icon.FiXCircle></td>
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