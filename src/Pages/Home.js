import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
                        const deleteRequest = await api.delete(urls.announcement.fetchById(announcement.id));
                    }
                }
            }
        }
        checkExpired();
    }

    render() {
        return (
            <Container>
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
