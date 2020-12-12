import React, { Component } from 'react';
import APIHost from '../../services/api.service';
import { Container, Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';

const API_HOST = APIHost();
const axios = require('axios').default;

export default class Contacts extends Component {
    constructor(props) {
        super(props);
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
            let response = await axios.get(API_HOST + `cliques/${cliqueId}`);
            let cliqueName = response.data.name;
            let memberResponse = await axios.get(API_HOST + `cliqueMembers/${cliqueName}`);
            let newContacts = this.state.allContacts.concat(memberResponse.data);
            this.setState({allContacts: newContacts});
        });
    }

    async createTeamDict() {
        let dict = {};
        let cliqueIds = this.props.userInfo.cliques;
        for (let cliqueId of cliqueIds) {
            let response = await axios.get(API_HOST + `cliques/${cliqueId}`);
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
                                    <tr>
                                        <td>
                                            <Link to='/chat'>
                                                <Icon.MessageSquare />
                                            </Link>
                                            <Link to='/calendar'>
                                                <Icon.Calendar />
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
                            return <></>;
                        })}
                    </tbody>
                </Table>
            </Container> :
            <h4>Log in to view your contacts</h4>
        )
    }
}