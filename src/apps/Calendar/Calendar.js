import React, { Component } from 'react';
import {
  Container,
  Jumbotron,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Alert,
  Spinner
} from 'react-bootstrap';
import BootstrapTable from 'react-bootstrap-table-next';
import {
  Axios as api,
  API_ENDPOINTS as urls
} from '../../services/api.service';
import * as Icon from 'react-icons/fi';
import './Calendar.css';

const columns = [
  { dataField: 'x', text: '' },
  { dataField: 'name', text: 'Name', sort: true },
  { dataField: 'team', text: 'Team', sort: true },
  { dataField: 'time', text: 'Time', sort: true },
  { dataField: 'details', text: 'Details', sort: true }
];

export default class Calendar extends Component {
  constructor(props) {
    super(props);
    document.title = 'Opus | Calendar';
    this.state = {
      showCreateModal: false,
      userTeams: [],
      eventObjects: [],
      displayedEvents: [],
      eventName: '',
      eventDetails: '',
      eventTeam: null,
      eventAnnouncement: 0,
      eventPicture: '',
      eventStart: 0,
      eventEnd: 0,
      eventInvited: [],
      eventFilter: this.props.match.params.teamUsername
        ? this.props.match.params.teamUsername
        : 'All',
      creationError: null,
      createAnnouncement: false,
      announcementBody: '',
      teamIdToMembersDict: {},
      selectedTeamMembers: [],
      idToTeamDict: {},
      teamToIdDict: {},
      showSpinner: true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  async fetchData() {
    const teamRequest = await api.get(
      urls.user.fetchTeams(this.props.userInfo.id)
    );
    let teams = teamRequest.data;
    const contactsRequest = await api.get(
      urls.user.fetchContacts(this.props.userInfo.id)
    );
    let allMembers = contactsRequest.data;
    let membersDict = {};
    let newIdDict = {};

    teams.forEach(team => {
      let teamMembers = team.members.concat(team.managers.concat(team.owners));
      membersDict[team.id] = teamMembers;
      newIdDict[team.id] = team.name;
    });

    this.setState(
      {
        userTeams: teams,
        teamIdToMembersDict: membersDict,
        selectedTeamMembers: allMembers,
        idToTeamDict: newIdDict
      },
      () => {
        this.fetchEvents();
      }
    );
  }

  async fetchEvents() {
    const userRequest = await api.get(
      urls.event.fetchByUser(this.props.userInfo.id)
    );
    let events = userRequest.data;

    let tableEvents = [];
    events.forEach(event => {
      let tableObject = {
        x: (
          <Icon.FiXCircle
            data-testid="deleteButton"
            className="deleteButton"
            onClick={() => {
              this.deleteEvent(event);
            }}
            size={20}
          />
        ),
        name: event.name,
        team: event.team ? event.team.name : 'N/A',
        time: `${this.parseDate(event.start)} -- ${this.parseDate(event.end)}`,
        details: event.details
      };
      tableEvents.push(tableObject);
    });
    this.setState(
      {
        eventObjects: tableEvents,
        showSpinner: false
      },
      () => {
        this.handleFilter(this.state.eventFilter);
      }
    );
  }

  handleChooseTeam(e) {
    let teamId = parseInt(e.target.value);
    this.setState({
      eventTeam: teamId,
      selectedTeamMembers: this.state.teamIdToMembersDict[teamId]
    });
  }

  async handleCreate(evt) {
    evt.preventDefault();
    let start = new Date(this.state.eventStart);
    let end = new Date(this.state.eventEnd);
    let team = this.state.eventTeam;
    let us = this.state.eventTeam ? null : this.props.userInfo.id;

    if (!this.createDataIsInvalid()) {
      this.setState({ showCreateModal: false });
      let body = {
        name: this.state.eventName,
        start: start.toISOString(),
        end: end.toISOString(),
        details: this.state.eventDetails,
        picture: 'event.jpg',
        team: team,
        user: us,
        invited: []
      };

      let request = await api.post(urls.event.fetchAll(), body);
      body.id = request.data.id;
      let tableEvent = {
        x: (
          <Icon.FiXCircle
            data-testid="deleteButton"
            className="deleteButton"
            onClick={() => {
              this.deleteEvent(body);
            }}
            size={20}
          />
        ),
        name: this.state.eventName,
        team: team ? this.state.idToTeamDict[team] : 'N/A',
        time: `${this.parseDate(start.toISOString())} -- ${this.parseDate(
          end.toISOString()
        )}`,
        details: this.state.eventDetails
      };
      let tableObjects = this.state.eventObjects;
      tableObjects.push(tableEvent);
      if (
        tableEvent.name === this.state.eventFilter ||
        this.state.eventFilter === 'All'
      ) {
        let events = this.state.displayedEvents;
        events.push(tableEvent);
        this.setState({ displayedEvents: events });
      }
      this.setState({ eventObjects: tableObjects });

      this.setState({
        eventDetails: '',
        eventPicture: '',
        eventName: ''
      });
    } else {
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
      errorMessage.push('Event End must be after Event Start.');
    }
    this.setState({
      creationError: errorMessage.length ? errorMessage : false
    });
    return errorMessage.length;
  }

  async deleteEvent(eventToDelete) {
    await api.delete(urls.event.fetchById(eventToDelete.id));
    let filteredObjects = this.state.eventObjects.filter(event => {
      return event.details !== eventToDelete.details;
    });
    let filteredDisplay = this.state.displayedEvents.filter(event => {
      return event.details !== eventToDelete.details;
    });
    this.setState({
      displayedEvents: filteredDisplay,
      eventObjects: filteredObjects
    });
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

  handleFilter(filter) {
    let filtered = this.state.eventObjects.filter(object => {
      return object.team === filter || filter === 'All';
    });
    this.setState({
      displayedEvents: filtered,
      eventFilter: filter
    });
  }

  render() {
    return (
      <Container fluid>
        <Jumbotron>
          <Modal
            show={this.state.showCreateModal}
            onHide={() => {
              this.setState({ showCreateModal: false });
            }}
          >
            <Modal.Header>
              <Modal.Title>Create an event</Modal.Title>
            </Modal.Header>
            <small style={{ paddingLeft: '10px', paddingTop: '10px' }}>
              * indicates required field
            </small>
            <Modal.Body>
              <Form
                onSubmit={e => {
                  this.handleCreate(e);
                }}
              >
                <Form.Group controlId="nameInput">
                  <Form.Label>Name *</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Event name"
                    onChange={e => {
                      this.setState({ eventName: e.target.value });
                    }}
                  ></Form.Control>
                </Form.Group>
                <Form.Group controlId="eventStartInput">
                  <Form.Label>Event Start *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    onChange={e => {
                      this.setState({ eventStart: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="eventEndInput">
                  <Form.Label>Event End *</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    onChange={e => {
                      this.setState({ eventEnd: e.target.value });
                    }}
                  />
                </Form.Group>
                <Form.Group controlId="teamInput">
                  <Form.Label>Team</Form.Label>
                  <Form.Control
                    as="select"
                    onChange={e => {
                      this.handleChooseTeam(e);
                    }}
                  >
                    <option selected disabled hidden>
                      Choose a team for this event
                    </option>
                    {this.state.userTeams.map((team, idx) => {
                      return (
                        <option key={idx} value={team.id}>
                          {team.name}
                        </option>
                      );
                    })}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="formControlsSelectMultiple">
                  <Form.Label>Invite Participants</Form.Label>
                  <Form.Control
                    as="select"
                    multiple
                    onChange={e => {
                      this.setState({ eventInvited: e.target.value });
                    }}
                  >
                    {this.state.selectedTeamMembers ? this.state.selectedTeamMembers.map((member, idx) => {
                      return member.id !== this.props.userInfo.id ? (
                        <option key={idx}>{member.username}</option>
                      ) : (
                        <></>
                      );
                    }): ''}
                  </Form.Control>
                </Form.Group>
                <Form.Group controlId="detailInput">
                  <Form.Label>Details *</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder="Type event details here..."
                    value={this.state.eventDetails}
                    onChange={e => {
                      this.setState({ eventDetails: e.target.value });
                    }}
                  ></Form.Control>
                </Form.Group>
                <Alert variant="danger" hidden={!this.state.creationError}>
                  {this.state.creationError
                    ? this.state.creationError.map((msg, idx) => {
                        return <li key={idx}>{msg}</li>;
                      })
                    : ''}
                </Alert>
                <Button type="submit">Submit</Button>
              </Form>
            </Modal.Body>
          </Modal>

          <Row>
            <Col>
              <h1>Calendar</h1>
              <p>
                You have {this.state.eventObjects.length} event
                {this.state.eventObjects.length === 1 ? '' : 's'} on your
                calendar.
              </p>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button
                style={{ marginTop: '10px', marginBottom: '10px' }}
                onClick={() => {
                  this.setState({ showCreateModal: true });
                }}
              >
                <Icon.FiPlusCircle style={{ marginTop: '-3px' }} /> Create Event
              </Button>
            </Col>
            <Col>
              <Row>
                <h5 style={{ marginTop: '15px' }}>Select Calendar: </h5>
                <Form.Control
                  style={{
                    marginTop: '10px',
                    marginBottom: '10px',
                    marginLeft: '10px'
                  }}
                  as="select"
                  onChange={e => {
                    this.handleFilter(e.target.value);
                  }}
                >
                  <option>All</option>
                  {this.state.userTeams.map(team => {
                    return (
                      <option
                        key={team.id}
                        selected={team.name === this.state.eventFilter}
                        value={team.name}
                      >
                        {team.name} Team
                      </option>
                    );
                  })}
                  <option value="N/A">Events without an associated team</option>
                </Form.Control>
              </Row>
            </Col>
          </Row>
        </Jumbotron>
        {this.state.showSpinner ? (
          <Spinner animation="border" role="status" />
        ) : (
          <></>
        )}
        <BootstrapTable
          keyField="id"
          data={this.state.displayedEvents}
          columns={columns}
        />
      </Container>
    );
  }
}
