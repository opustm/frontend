import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import {Container, Row, Col, Form, Button, Modal} from 'react-bootstrap';
import '../../stylesheets/Login.css';
import APIHost from '../../services/api/api.service'

const API_HOST = APIHost();

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      password: '',
      picture: 'default',
      theme: 'light',
      loginError: false,
      showModal: false
    };
  }

  componentDidMount() {
    if (this.state.logged_in) {
      fetch(API_HOST+'main/current_user/', {
        headers: {
          Authorization: `JWT ${localStorage.getItem('token')}`
        }
      })
        .then(res => res.json())
        .then(json => {
          this.setState({ username: json.username });
        });
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

  handleLogin = (e, data) => {
    e.preventDefault();
    fetch(API_HOST+'token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      if (json.user) {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          first_name: json.user.first_name,
          loginError: false
        });
        this.props.parentCallback(this.state.logged_in);
      } else {
        this.setState({
          logged_in: false,
          displayed_form: 'login',
          loginError: true
        });
      }
    });
  };

  handleSignup = (e, data) => {
    this.handleClose();
    e.preventDefault();
    fetch(API_HOST+'main/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(res => res.json())
      .then(json => {
        localStorage.setItem('token', json.token);
        this.setState({
          logged_in: true,
          displayed_form: '',
          username: json.username,
          first_name: json.first_name,
          loginError: false
        });
      });
  };

  handleClose = () => this.setState({showModal: false});
  handleShow = () => this.setState({showModal: true});

  render() {
    return (
      <Container fluid>
        <Row>
          <Col id='leftLogin'>
            <Row>
              <Col md={{offset:2}}>
                <p className='vertShift'>Some BS text about what this project is I guess</p>
              </Col>
            </Row>
          </Col>
          <Col id='rightLogin'>
            <Col lg={{span: 9, offset: 1}}>
              <h1 className='vertShift'>Opus Team Management</h1>
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
                >Submit</Button>
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
                    <Form.Label>Phone Number</Form.Label>
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
                    <Form.Label>Email</Form.Label>
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
