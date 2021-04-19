import React, { Component } from 'react';
import { Container, Jumbotron, Spinner, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import {
  Axios as api,
  API_ENDPOINTS as urls
} from '../../services/api.service';
import BootstrapTable from 'react-bootstrap-table-next';
import './Contacts.css';

const columns = [
  { dataField: 'meet', text: 'Get In Touch!' },
  { dataField: 'firstName', text: 'First Name', sort: true },
  { dataField: 'lastName', text: 'Last Name', sort: true },
  { dataField: 'username', text: 'Username', sort: true },
  { dataField: 'email', text: 'Email', sort: true },
  { dataField: 'phoneNumber', text: 'Phone Number', sort: true },
  { dataField: 'sharedTeams', text: 'Shared Teams', sort: true }
];

export default class Contacts extends Component {
  constructor(props) {
    super(props);
    document.title = 'Opus | Contacts';
    this.state = {
      contactObjects: [],
      teamIds: new Set(),
      showSpinner: true
    };
  }

  componentDidMount() {
    this.getUserTeams();
  }

  async getUserTeams() {
    let teamRequest = await api.get(
      urls.user.fetchTeams(this.props.userInfo.id)
    );
    let teams = teamRequest.data;
    let teamIdSet = new Set();
    teams.forEach(team => {
      teamIdSet.add(team.id);
    });
    this.setState({ teamIds: teamIdSet }, () => {
      this.getUserContacts();
    });
  }

  async getUserContacts() {
    let contactRequest = await api.get(
      urls.user.fetchContacts(this.props.userInfo.id)
    );
    let contacts = contactRequest.data;
    let contactObjects = [];
    for (let contact of contacts) {
      let object = {
        meet: (
          <span>
            <Link to="/calendar">
              <Icon.FiCalendar />
            </Link>
          </span>
        ),
        firstName: contact.first_name,
        lastName: contact.last_name,
        username: (
          <Link
            to={{
              pathname: `/user/${contact.username}`,
              state: { userId: contact.id }
            }}
          >
            {contact.username}
          </Link>
        ),
        email: contact.email,
        phoneNumber: contact.phone,
        sharedTeams: await this.checkSharedTeams(contact)
      };
      contactObjects.push(object);
    }

    this.setState({
      contactObjects: contactObjects,
      showSpinner: false
    });
  }

  async checkSharedTeams(singleContact) {
    let contactTeamRequest = await api.get(
      urls.user.fetchTeams(singleContact.id)
    );
    let contactTeams = contactTeamRequest.data;
    let toReturn = '';
    for (let team of contactTeams) {
      if (this.state.teamIds.has(team.id)) {
        toReturn += team.name + ', ';
      }
    }
    toReturn = toReturn.slice(0, -2);
    return toReturn;
  }

  render() {
    return (
      <Container fluid>
        <Jumbotron>
          <h1>
            Contacts
            <OverlayTrigger
              overlay={<Tooltip>Anyone that you share a team with is in your contacts.
                You may visit their profile page by clicking on their username.
              </Tooltip>}
              placement={'right'}
            >
              <Icon.FiHelpCircle size={20} style={{'marginLeft': '5px'}} />
            </OverlayTrigger>
          </h1>
          <p>
            You have {this.state.contactObjects.length} contact
            {this.state.contactObjects.length === 1 ? '' : 's'}.
          </p>
        </Jumbotron>
        {this.state.showSpinner ? (
          <Spinner animation="border" role="status" />
        ) : (
          <></>
        )}
        <BootstrapTable
          keyField="id"
          data={this.state.contactObjects}
          columns={columns}
          className="contactsTable"
        />
      </Container>
    );
  }
}
