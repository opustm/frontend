import React, { Component } from 'react';
import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import {getContacts} from '../../services/contacts.service';
import BootstrapTable from 'react-bootstrap-table-next';
import './Contacts.css';

const columns = [
    { dataField: 'meet', text: 'Get In Touch!'},
    { dataField: 'firstName', text: 'First Name', sort: true},
    { dataField: 'lastName', text: 'Last Name', sort: true},
    { dataField: 'username', text: 'Username', sort: true},
    { dataField: 'email', text: 'Email', sort: true},
    { dataField: 'phoneNumber', text: 'Phone Number', sort: true},
    { dataField: 'sharedTeams', text: 'Shared Teams', sort: true},
]


export default class Contacts extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Contacts"
        this.state = {
            allContacts: [],
            contactObjects : [],
            teamDict: {}
        }
    }

    componentDidMount() {
        if (this.props.userInfo.username) {
            this.getUserContacts();
            this.createTeamDict();
        }
    }

    async getUserContacts() {
        let contacts = await getContacts(this.props.userInfo);
        let contactObjects = [];
        contacts.forEach((contact) => {
            if (contact.id !== this.props.userInfo.id) {
                let object = {
                    meet: (
                        <span>
                            <Link to='/chat'>
                                <Icon.FiMessageSquare />
                            </Link>
                            <Link to='/calendar'>
                                <Icon.FiCalendar />
                            </Link>
                        </span>
                        ),
                    firstName: contact.first_name,
                    lastName: contact.last_name,
                    username: <Link to={`/user/${contact.username}`}>{contact.username}</Link>,
                    email: contact.email,
                    phoneNumber: contact.phone,
                    sharedTeams: this.checkSharedTeams(contact)
                };
                contactObjects.push(object);
            }
        })
        this.setState({
            allContacts: contacts,
            contactObjects: contactObjects
        });
    }

    async createTeamDict() {
        let dict = {};
        let cliqueIds = this.props.userInfo.cliques;
        for (let cliqueId of cliqueIds) {
            let response = await api.get(urls.teams.fetchById(cliqueId));
            let cliqueName = response.data.name;
            dict[cliqueId] = cliqueName;
        }
        this.setState({teamDict: dict});
    }

    checkSharedTeams(singleContact) {
        let toReturn = '';
        for (let id of singleContact.cliques) {
            if (id in this.state.teamDict) {
                toReturn += this.state.teamDict[id] + ', ';
            }
        }
        toReturn = toReturn.slice(0, -2);
        return toReturn;
    }

    render() {
        return (
            this.props.userInfo.username ?
            <Container fluid>
                <h1>Contacts</h1>
                <BootstrapTable keyField='id' data={ this.state.contactObjects } columns={ columns } className='contactsTable' />
            </Container> :
            <h4>Log in to view your contacts</h4>
        )
    }
}