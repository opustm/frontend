import React, { Component } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { widgetDetails } from './widget.service';
import './widget.css';

export default class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount() {
    let newState = widgetDetails(this.props.appTitle);
    this.setState(newState);
  }

  // A generic widget will have the following:
  // A title: Announcements, Contacts, Teams, etc
  // A link: /announcements/, /contacts/, /teams/, etc
  // A mini-table containing three 'relevant items'
  //      * Announcements: Three recent announcements
  //      * Contacts: Three contacts (maybe people you've talked w/ recently)
  //      * And so on. Essentially a preview of things you should be aware of
  // A user passes in a prop, maybe called 'appTitle' (this.props.appTitle)
  // We also have a config/service file that contains directions for what to do for each title
  // i.e. makes calls to the correct endpoints and returns the data
  // This way, all the widget has to do is tell the service 'I need an announcements widget', and then we render it here
  // After we've done that, we can drop any type of widget we want into any other component

  render() {
    return (
      <Container>
        <Link to={`${this.props.appTitle}`} className='widgetLink'>
          <Card>
            <Card.Header>{this.state.title}</Card.Header>
            <Card.Body>{this.state.description}</Card.Body>
          </Card>
        </Link>
      </Container>
    )
  }
}