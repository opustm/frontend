import React, { Component } from 'react';
import { Container, Jumbotron, Row, Col } from 'react-bootstrap';
import Widget from '../components/Widget/widget.component';
import { Axios as api, API_ENDPOINTS as urls } from '../services/api.service';


export default class Home extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Dashboard"
        this.state = {
        }
    }

    componentDidMount() {
        let t = this;
        async function checkExpired() {
            for (let id of t.props.userInfo.cliques) {
                let request = await api.get(urls.teams.fetchById(id));
                let teamName = request.data.name;
                let announcementRequest = await api.get(urls.announcement.fetchByTeam(teamName));
                for (let announcement of announcementRequest.data) {
                    let now = new Date(Date.now()).toISOString();
                    if (now > announcement.end) {
                        await api.delete(urls.announcement.fetchById(announcement.id));
                    }
                }
            }
        }
        checkExpired();
    }

    render() {
        return (
            <Container fluid>
                <Jumbotron>
                    <h1>Welcome, {this.props.userInfo.first_name}</h1>
                    <p>You have no new events as of now. Your next event is on <strong>Feb 4, 2021.</strong></p>
                </Jumbotron>
                <Row>
                    <Col>
                        <Widget appTitle='announcements' userInfo={this.props.userInfo}></Widget>
                    </Col>
                    <Col>
                        <Widget appTitle='calendar' userInfo={this.props.userInfo}></Widget>
                    </Col>
                </Row>
                <Row style={{'marginTop': '15px'}}>
                    <Col>
                        <Widget appTitle='contacts' userInfo={this.props.userInfo}></Widget>
                    </Col>
                    <Col>
                        <Widget appTitle='teams' userInfo={this.props.userInfo}></Widget>
                    </Col>
                </Row>
            </Container>
        )
    }
}
