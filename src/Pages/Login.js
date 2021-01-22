import React, { Component } from 'react';

import {Container, Row, Col, Form, Button, Modal, Alert} from 'react-bootstrap';
import * as Icon from 'react-icons/fi';
import InputColor from 'react-input-color';

import '../stylesheets/Login.css';
import AuthService from '../services/auth.service';


export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authService: new AuthService(),
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      bio: '',
      picture: '#000000',
      theme: 'light',
      cliques: [],
      signupError: false,
      signupErrorMessages: [],
      loginError: false,
      showModal: false,
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      let token = localStorage.getItem('token');
      let newState = this.state.authService.getCurrentUser(token);
      this.setState(newState);
    }
  }

  handleChange = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  async handleLogin(e, data) {
    e.preventDefault();
    let state = await this.state.authService.login(data);
    this.setState(state);
    this.props.onLoggedInChange(this.state.logged_in);
  }

  async handleSignup(e, data) {
    if (this.dataIsValid()) {
      this.handleClose();
      e.preventDefault();
      let state = await this.state.authService.signup(data);
      this.setState(state);
    }
  }

  dataIsValid() {
    console.log('validating');
    let errors = [];
    let passwordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");
    if (!this.state.first_name || !this.state.last_name || !this.state.phone || !this.state.email || !this.state.username || !this.state.password) {
      errors.push('All fields are required');
    }
    if (!passwordRegex.test(this.state.password)) {
      errors.push('Password is missing one or more requirements');
    }
    if (this.state.phone.includes('-' || this.state.phone.includes(' '))) {
      errors.push('Do not use dashes in the phone field');
    }
    this.setState({
      signupError: errors.length ? true : false,
      signupErrorMessages: errors
    });
    return (errors.length ? false : true);
    
  }

  handleClose = () => this.setState({showModal: false});
  handleShow = () => this.setState({showModal: true});

  handleColorChange(e) {
    this.setState({
      picture: e.hex
    });
  }

  render() {
    return (
      <Container fluid>
        <Row className='loginRow'>
          <Col id='leftLogin'>
            <Row>
              <Col md={{offset:2}}>
                <p className='vertShift'>This text will tell the user what our product is!</p>
              </Col>
            </Row>
          </Col>
          <Col id='rightLogin'>
            <Col lg={{span: 9, offset: 1}}>
              <h1 className='vertShift'>Opus Team Management</h1>
              <br/>
              <Form>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    onChange={this.handleChange}
                    value={this.state.username}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password" 
                    name="password"
                    onChange={this.handleChange}
                    value={this.state.password}
                  />
                  <Form.Text>
                    <a className='loginLink' href="https://google.com">Forgot your password?</a>
                  </Form.Text>
                </Form.Group>
                <Button
                
                  onClick={e => this.handleLogin(e, this.state)}
                  id="loginSubmit"
                >SIGN IN</Button>
              </Form>
              <hr />
              <Container fluid>
                <Row>
                  <Col md={{offset : 2}}>
                    <Button className='loginLink' id='register' onClick={this.handleShow}>Don't have an account yet? Click here to register.</Button>
                  </Col>
                </Row>
                <Row>
                  <Col md={{offset : 3}}>
                    <p id='copyright'>&#169; Opus Team Management, 2020</p>
                  </Col>
                </Row>
              </Container>
            </Col>
          </Col>
        </Row>
        <Modal show={this.state.showModal} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Register New User</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="first_name"
                      value={this.state.first_name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="last_name"
                      value={this.state.last_name}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group>
                    <Form.Label>Phone Number
                      <Container>
                        <Row>
                          <small>(Do not include dashes)</small>
                        </Row>
                      </Container>
                    </Form.Label>
                    <Form.Control
                      type="number"
                      name="phone"
                      value={this.state.phone}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group>
                    <Form.Label>Email
                      <Container>
                        <Row>
                          <small>(Format: test@example.com)</small>
                        </Row>
                      </Container>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      value={this.state.email}
                      onChange={this.handleChange}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handleChange}
                />
              </Form.Group>
              <small>Password must be at least 8 characters, contain one lowercase letter, one uppercase letter, one number, and one special character (!@#$%^&*)</small>
              <Alert style={{marginTop:'10px'}}variant='danger' hidden={!this.state.signupError}>
                {this.state.signupError ? this.state.signupErrorMessages.map((error) => {return <li>{error}</li>}) : ''}
              </Alert>
              <hr />
              <p id='iconP'>Pick a color for your avatar:</p>
              <Row>
                <Col lg={{offset: 4, span: 3}}>
                  <Icon.FiUser size={60} color={this.state.picture} />
                </Col>
                <Col>
                  <InputColor
                    style={{'marginTop': '15px'}}
                    initialValue="#000000"
                    onChange={e => this.handleColorChange(e)}
                    placement="right"
                  />
                  <p>Click Me!</p>
                </Col>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={e => this.handleSignup(e, this.state)}>
              Create Account
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    );
  }
}
