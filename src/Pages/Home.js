import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Widget from '../components/Widget/widget.component';

// Check to delete expired announcements once you navigate to this page.
// let now = new Date(Date.now()).toISOString();
//if (now > announcement.end) {
//   this.deleteAnnouncement(announcement);
// return <tr></tr>;

export default class Home extends Component {
    constructor(props) {
        super(props);
        document.title = "Opus | Dashboard"
        this.state = {
        }
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
