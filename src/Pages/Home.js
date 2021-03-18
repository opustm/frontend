import React, { Component } from 'react';
import { Container, Jumbotron, Row, Col, Modal, Button } from 'react-bootstrap';
import { Axios as api, API_ENDPOINTS as urls } from '../services/api.service';
import { descriptions } from '../services/description.service';
import Widget from '../components/Widget/widget.component';


export default class Home extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Dashboard"
        this.state = {
            today: '',
            showModal: false
        }
    }

    componentDidMount() {
        let t = this;
        async function checkExpired() {
            let announcementRequest = await api.get(urls.announcement.fetchByUser(t.props.userInfo.id));
            for (let announcement of announcementRequest.data) {
                let now = new Date(Date.now()).toISOString();
                if (now > announcement.end) {
                    await api.delete(urls.announcement.fetchById(announcement.id));
                }
            }
        }
        async function getTeams() {
            let teamRequest = await api.get(urls.user.fetchTeams(t.props.userInfo.id));
            if (!teamRequest.data.length) {
                t.setState({showModal: true});
            }
        }
        checkExpired();
        getTeams();
        let now = new Date(Date.now());
        this.setState({today: now.toString().slice(4,15)});
    }

    render() {
        return (
            <Container fluid>
                <Modal show={this.state.showModal} onHide={() => {this.setState({showModal: false})}}>
                    <Modal.Header closeButton>
                        <Modal.Title>Join a Team!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>{descriptions.pages.Home.joinMessage}</p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => {this.setState({showModal: false})}}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>

                <Jumbotron>
                    <h1>Welcome, {this.props.userInfo.first_name}</h1>
                    <p>It is currently <strong>{this.state.today}</strong>. Check your calendar for upcoming events.</p>
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
