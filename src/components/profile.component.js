import React, {Component} from 'react';
import { Container, Row, Col, Spinner } from 'react-bootstrap';
import * as Icon from 'react-feather';

import NavigationBar from './navbar.component';
import APIHost from '../services/api.service';
import AuthService from '../services/auth.service';
import '../stylesheets/Profile.css';

const API_HOST = APIHost();
const axios = require('axios').default;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: true,
      profileExists: false,
      authService: new AuthService(),
      currentUser: {}
    }
  }

  componentDidMount() {
    console.log(this.props.loggedIn);
    let userToken = localStorage.getItem('token');
    this.awaitCurrentUserData(userToken);
    this.getUserData(this.props.match.params.userID);
  }

  async awaitCurrentUserData(token) {
    let currentUserData = await this.state.authService.getCurrentUser(token);
    this.setState({currentUser: currentUserData});
  }

  // users/userID or user/username
  async getUserData(userID) {
    let userRoute = API_HOST + `users/${userID}`;
    try {
      let response = await axios.get(userRoute);
      let data = response.data;
      this.setState({
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        picture: data.picture,
        phone: data.phone,
        profileExists: true,
        showSpinner: false
      });
    }

    catch (error) {
      this.setState({
        profileExists: false,
        showSpinner: false
      });
    }
    console.log(this.state);
  }

  render() {
    return (
    <Container>
      <Row>
        <Col>
          <NavigationBar></NavigationBar>
        </Col>
      </Row>
      {
        this.state.showSpinner ?
        <Row>
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Row>
        :
        !this.state.profileExists ? 
        <Row>
          <h4>Oops. This page doesn't match any existing users -- try again.</h4>
        </Row> :
        <Row>
          <Col>
              <Icon.User color={this.state.picture === 'default' ? 'black' : this.state.picture} size={100} strokeWidth={1} />
            <Row>
              <h3>{this.state.first_name + ' '+ this.state.last_name}</h3>
              <p>Member since [date here]</p>
              {this.state.currentUser.username === this.state.username ? <p>Hey! This is your page!</p> : ''}
            </Row>
          </Col>
          <Col>
              <h5 className="reduceHeaderMargin">Username: {this.state.username}</h5>
              <h5>Phone: {this.state.phone}</h5>
              <h5>Email: {this.state.email}</h5>
              <Icon.MessageSquare />
              <p>Chat</p>
              <Icon.Calendar />
              <p>Meet</p>
          </Col>
        </Row>
      }
    </Container>
    )
  }
}