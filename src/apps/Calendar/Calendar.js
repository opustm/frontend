import React, { Component } from 'react';
import { Container, Table, Row, Col, Button, Modal, Form, FormControl, Toast, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import * as Icon from 'react-icons/fi';

export default class Calendar extends Component{
    constructor(props) {
        super(props);
        document.title = "Opus | Calendar";
        this.state = {
            showCreateModal: false,
            userTeamEvents: {},
            idToTeamDict: {},
            eventName: '',
            eventDetails: '',
            eventTeam: 0,
            eventAnnouncement: 0,
            eventPicture: '',
            eventStart: 0,
            eventEnd: 0,
            eventInvited: [],
            eventFilter: 'All',
            createAnnouncement: false,
            announcementBody: ''
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
        let newIdDict = {};        
        for (let id of teamIds) {
            const request = await api.get(urls.teams.fetchById(id));
            teams.push(request.data);
            newIdDict[id] = request.data.name;
        }
        this.setState({
            idToTeamDict: newIdDict
        }, () => {this.fetchEvents()});
    }

    async fetchEvents() {
        let teamIds = this.props.userInfo.cliques;
        let teamEvents = {};

        for (let id of teamIds) {
            const request2 = await api.get(urls.teams.fetchTeamEvents(newIdDict[id]));
            teamEvents[id]=request2.data;
        }

        const userEventRequest = await api.get(urls.events.fetchUserSoloEvents(this.props.userInfo.username))
        this.setState({
            userEvents: userEventRequest.data,
            userTeamEvents: teamEvents,
        });
    }

    async handleCreate(evt) {
        evt.preventDefault();
        if (!this.createDataIsInvalid()) {
            this.setState({showCreateModal: false})
            let startdt=new Date(Date.now());
            let enddt=new Date(Date.now());
            let body = {
                name: this.state.eventName,
                start: startdt,
                end: enddt,
                details: this.state.eventDetails,
                picture: this.state.eventPicture,
                clique: this.state.eventTeam,
                invited: this.state.eventInvited,
                notGoing: [],
            };
            let request = await api.post(urls.events.fetchAll, body);
            body.id = request.data.id;
            let newEvents = this.state.userTeamEvents;
            newEvents[this.state.eventTeam]=(body);

            if (this.state.createAnnouncement){
                let body2 = {
                    announcement: `generated announcement for event: ${this.state.eventName}`,
                    clique: this.state.eventTeam,
                    event: body.id,
                    priority: 3,
                    creator: this.props.userInfo.id,
                    end: startdt,
                    acknowledged: [this.props.userInfo.id]
                };
                let request2 = await api.post(urls.announcement.fetchAll, body2);
            }
            this.setState({
                userTeamEvents: newEvents,
                showCreatedToast: true,
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

    async deleteEvent(eventToDelete) {
        const deleteRequest = await api.delete(urls.event.fetchById(eventToDelete.id));
        let filtered = this.state.teamEvents.filter((event) => {return event !== eventToDelete;});
        this.setState({teamEvents: filtered});
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

} 