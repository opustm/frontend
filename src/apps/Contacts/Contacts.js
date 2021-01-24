import React, { Component } from 'react';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';


export default class Contacts extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Contacts"
        this.state = {
            allContacts: [],
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
        this.props.userInfo.cliques.forEach(async (cliqueId)=> {
            let memberResponse = await api.get(urls.teams.fetchMembersById(cliqueId));
            let newContacts = this.state.allContacts.concat(memberResponse.data);
            this.setState({allContacts: newContacts});
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
            toReturn = toReturn.slice(0, -2);
        }
        return toReturn;
    }

    render() {
        return (
            this.props.userInfo.username ?
            <Container fluid>
                <h1>Contacts</h1>
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Get in touch!</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Shared Teams</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.allContacts.map((singleContact) => {
                            if (singleContact.username !== this.props.userInfo.username) {
                                return (
                                    <tr key={singleContact.id}>
                                        <td>
                                            <Link to='/chat'>
                                                <Icon.FiMessageSquare />
                                            </Link>
                                            <Link to='/calendar'>
                                                <Icon.FiCalendar />
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/user/${singleContact.username}`}>
                                                {singleContact.first_name}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/user/${singleContact.username}`}>
                                                {singleContact.last_name}
                                            </Link>
                                        </td>
                                        <td>
                                            <Link to={`/user/${singleContact.username}`}>
                                                {singleContact.username}
                                            </Link>
                                        </td>
                                        <td>{singleContact.email}</td>
                                        <td>{singleContact.phone}</td>
                                        <td>
                                            {this.checkSharedTeams(singleContact)}
                                        </td>
                                    </tr>
                                )
                            }
                            return <tr key={0}></tr>;
                        })}
                    </tbody>
                </Table>
            </Container> :
            <h4>Log in to view your contacts</h4>
        )
    }
}