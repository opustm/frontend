import React, { Component } from 'react';
import { Container, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { widgetDetails } from './widget.service';
import './widget.css';

export default class Widget extends Component {
  constructor(props) {
    super(props);
    this.state = {
      title:  '',
      description: '',
      icon: '',
      data: []
    }
  }

  componentDidMount() {
    let t = this;
    async function getDetails(appTitle, userInfo, teamFilter) {
      let newState = await widgetDetails(appTitle, userInfo, teamFilter);
      t.setState(newState);
    }
    getDetails(this.props.appTitle, this.props.userInfo, this.props.teamFilter);
  }

  // A generic widget will have the following:
  // A title: Announcements, Contacts, Teams, etc
  // A link: /announcements/, /contacts/, /teams/, etc
  // A mini-table containing three 'relevant items'
  //      * Announcements: Three recent announcements
  //      * Contacts: Three contacts (maybe people you've talked w/ recently)
  //      * And so on. Essentially a preview of things you should be aware of
  // A user passes in a prop called 'appTitle'
  // We also have a config/service file that contains directions for what to do for each title
  // i.e. makes calls to the correct endpoints and returns the data
  // This way, all the widget has to do is tell the service 'I need an announcements widget', and then we render it here
  // After we've done that, we can drop any type of widget we want into any other component

  render() {
    return (
      <Container>
        <Link to={this.props.teamFilter ? `/${this.props.appTitle}/${this.props.teamFilter}` : `${this.props.appTitle}`} className='widgetLink'>
          <Card>
            <Card.Header>{this.state.icon} {this.state.title}</Card.Header>
            <Card.Body>
              {this.state.description}
              <ListGroup>
                {this.state.data.length !== 0 ? this.state.data.map((item, idx) => {
                  if (this.props.appTitle === 'teams') {
                    return (<Link to={`/teams/${item}`}>
                      <ListGroup.Item key={idx}>{item}</ListGroup.Item>
                    </Link>
                    );
                  }
                  else{
                    return (<ListGroup.Item key={idx}>{item}</ListGroup.Item>);
                  }
                }): <ListGroup.Item>No data to display</ListGroup.Item>}
              </ListGroup>
            </Card.Body>
          </Card>
        </Link>
      </Container>
    )
  }
}