import React, {Component} from 'react';
import { Container, Row, Col, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import * as Icon from 'react-feather';

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
      editingInfo: false,
      updateError: false
    }
  }

  componentDidMount() {
    this.getUserData(this.props.match.params.username);
  }

  handleEdit() {
    this.setState({editingInfo: true});
  }

  async getUserData(username) {
    let userRoute = API_HOST + `userDetails/${username}`;
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
  }

  async editUserData(userInfo) {
    let body = {
      "username": userInfo.username,
      "cliques": [1],
      "phone": "1123581321",
      "picture": "#0EDD12"
    }
    console.log(body);
    let userRoute = API_HOST  + `userDetails/${userInfo.username}/`;
    try {
      let response = await axios.put(userRoute, body);
      console.log(response);
      this.setState(response.data);
    }
    catch (error) {
      this.setState({updateError: true});
      console.log(error);
    }
  }

  render() {
    return (
      <Container fluid>
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
                <h3>{this.state.first_name + ' '+ this.state.last_name}</h3>
                {this.props.userInfo.username === this.state.username ? 
                  <p id='editProfile' onClick={() => {this.handleEdit()}}>
                    <Icon.Settings/>
                    Edit your profile 
                  </p>
                    : ''}
              <Button onClick={() => {this.editUserData(this.props.userInfo)}}>Send PUT to API</Button>
            </Col>
            <Col>
                <h5 className="reduceHeaderMargin">Username: {this.state.username}</h5>
                <h5>Phone: {this.state.phone}</h5>
                <h5>Email: {this.state.email}</h5>
                <Link to='/chat' >
                  <Icon.MessageSquare />
                  <p>Chat</p>
                </Link>
                <Link to='/calendar'>
                  <Icon.Calendar />
                  <p>Meet</p>
                </Link>
            </Col>
          </Row>
        }
      </Container>
    )
  }
}