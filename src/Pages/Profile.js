import React, {Component} from 'react';
import { Container, Row, Col, Spinner, Button, Form } from 'react-bootstrap';
import InputColor from 'react-input-color';
import { Link } from 'react-router-dom';
import * as Icon from 'react-icons/fi';

import { Axios as api, API_ENDPOINTS as urls } from '../services/api.service';
import AuthService from '../services/auth.service';
import '../stylesheets/Profile.css';


export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: true,
      profileExists: false,
      authService: new AuthService(),
      editingInfo: false,
      updateError: false,
    }
  }

  componentDidMount() {
    console.log(this.props.location.state)
    this.getUserData(this.props.match.params.username);
  }

  beginEditing() {
    let oldState = this.state;
    this.setState({
      editingInfo: true,
      oldState: oldState
    });
  }

  async getUserData(username) {
    try {
      let response = await api.get(urls.user.fetchByUsername(username));
      let data = response.data;
      this.setState({
        username: data.username,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        picture: data.picture,
        phone: data.phone,
        bio: data.bio,
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

  async editUserData() {
    // Remove cliques since we removed it from the backend
    let body = {
      "username": this.state.username,
      "cliques": this.props.userInfo.cliques,
      "phone": this.state.phone,
      "email": this.state.email,
      "first_name": this.state.first_name,
      "last_name": this.state.last_name,
      "picture": this.state.picture,
      "bio": this.state.bio
    }
    try {
      let response = await api.put(urls.user.fetchByUsername(this.state.username), body);
      this.setState(response.data);
    }
    catch (error) {
      this.setState({updateError: true});
    }
    this.setState({editingInfo: false});
  }

  handleUserEdit(e, whichInput) {
    switch (whichInput) {
      case 'first_name':
        this.setState({first_name: e.target.value});
        break;

      case 'last_name':
        this.setState({last_name: e.target.value});
        break;

      case 'username':
        this.setState({username: e.target.value});
        break;

      case 'phone':
        this.setState({phone: e.target.value});
        break;

      case 'email':
        this.setState({email: e.target.value});
        break;

      case 'picture':
        this.setState({picture: e.hex});
        break;

      case 'bio':
        this.setState({bio: e.target.value});
        break;

      default:
        console.warn('How did you get here?');
        break;
    }
  }

  cancelChanges() {
    this.setState(this.state.oldState);
    this.setState({editingInfo: false});
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
            <Col md={{offset: 1, span: 4}}>
              <Icon.FiUser id='profilePicture' color={this.state.picture === 'default' ? 'black' : this.state.picture} size={350} strokeWidth={1} />
              <h3 id='username'>{this.state.first_name + ' '+ this.state.last_name}</h3>
              <Container>
                <Row>
                  <Col md={{span: 3}}>
                    <Link to='/chat' >
                      <Icon.FiMessageSquare size={30} strokeWidth={1.5}/>
                      <p>Chat</p>
                    </Link>
                  </Col>
                  <Col md={{span: 3}}>
                    <Link to='/calendar'>
                      <Icon.FiCalendar size={30} strokeWidth={1.5}/>
                      <p>Meet</p>
                    </Link>
                  </Col>
                  <Col md={{span: 4}}>
                    {this.props.userInfo.username === this.state.username ? 
                      <div id='editProfile' onClick={() => {this.beginEditing()}}>
                        <Icon.FiSettings id='settingsIcon' size={30} strokeWidth={1.5}/>
                        <p>
                          Edit your profile 
                        </p> 
                      </div>
                      : ''}
                  </Col>
                </Row>
              </Container>
            </Col>
            <Col>
              {this.state.editingInfo ?
                <Form>
                  <Form.Group>
                    <Form.Label>First Name: </Form.Label>
                    <Form.Control value={this.state.first_name} onChange={(e) => {this.handleUserEdit(e, 'first_name')}}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Last Name: </Form.Label>
                    <Form.Control value={this.state.last_name} onChange={(e) => {this.handleUserEdit(e, 'last_name')}}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Username: </Form.Label>
                    <Form.Control value={this.state.username} onChange={(e) => {this.handleUserEdit(e, 'username')}}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Phone: </Form.Label>
                    <Form.Control value={this.state.phone} onChange={(e) => {this.handleUserEdit(e, 'phone')}}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Email: </Form.Label>
                    <Form.Control value={this.state.email} onChange={(e) => {this.handleUserEdit(e, 'email')}}></Form.Control>
                  </Form.Group>
                  <Form.Group>
                    <Form.Label>Bio: </Form.Label>
                    <Form.Control value={this.state.bio} onChange={(e) => {this.handleUserEdit(e, 'bio')}}></Form.Control>
                  </Form.Group>
                  <Container>
                    <Row>
                      <p>Edit Profile Color: </p>
                      <InputColor
                        initialValue={this.state.picture}
                        onChange={e => this.handleUserEdit(e, 'picture')}
                        placement="right"
                      />
                    </Row>
                  </Container>
                  <Button id='saveChangesButton' onClick={() => {this.editUserData()}}>Save Changes</Button>
                  <Button variant='secondary' onClick={() => {this.cancelChanges()}}>Cancel</Button>
                </Form>
              :

              <div>
                <h5 className="reduceHeaderMargin">Username: {this.state.username}</h5>
                <h5>Phone: {this.state.phone}</h5>
                <h5>Email: {this.state.email}</h5>
                <p>About: {this.state.bio}</p>
              </div>
              }
            </Col>
          </Row>
        }
      </Container>
    )
  }
}