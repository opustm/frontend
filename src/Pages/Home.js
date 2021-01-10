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
                        <Widget appTitle='announcements'></Widget>                       
                    </Col>
                    <Col>
                        <Widget appTitle='calendar'></Widget>
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <Widget appTitle='contacts'></Widget>
                    </Col>
                    <Col>
                        <Widget appTitle='teams'></Widget>
                    </Col>
                </Row>
            </Container>
        )
    }
}
