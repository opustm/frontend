import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Widget from '../components/Widget/widget.component';

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
                        <Widget appTitle='announcements' userTeams={this.props.userInfo.cliques}></Widget>
                    </Col>
                    <Col>
                        <Widget appTitle='calendar' userTeams={this.props.userInfo.cliques}></Widget>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Widget appTitle='contacts' userTeams={this.props.userInfo.cliques}></Widget>
                    </Col>
                    <Col>
                        <Widget appTitle='teams' userTeams={this.props.userInfo.cliques}></Widget>
                    </Col>
                </Row>
            </Container>
        )
    }
}
