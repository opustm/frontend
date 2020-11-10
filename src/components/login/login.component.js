
import React, { Component } from 'react';
import Nav from './nav.component';
import SignUpForm from './signupform.component';
import {Container, Row, Col, Form, Button, Modal} from 'react-bootstrap';
import '../../stylesheets/Login.css';
// import '../../stylesheets/App.css';

// Comment Out Local API Host Before Deployment
const API_HOST = 'http://localhost:8000/'
// const API_HOST = 'https://opustm-api-staging.herokuapp.com/';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayed_form: '',
      logged_in: localStorage.getItem('token') ? true : false,
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      phone: '',
      picture: '',
      theme: '',
      password: '',
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

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  handle_login = (e, data) => {
    console.log('called handle login');
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
        console.log(json);
        if (json.user) {
          localStorage.setItem('token', json.token);
          this.setState({
            logged_in: true,
            displayed_form: '',
            username: json.user.username,
            first_name: json.user.first_name,
            loginError: false
          });
        } else {
          this.setState({
            logged_in: false,
            displayed_form: 'login',
            loginError: true
          });
        }
      });
  };

  handle_signup = (e, data) => {
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

  handle_logout = () => {
    localStorage.removeItem('token');
    this.setState({ logged_in: false, username: '' });
  };

  display_form = form => {
    this.setState({
      displayed_form: form
    });
  };

  handleClose = () => this.setState({showModal: false});
  handleShow = () => this.setState({showModal: true});

  render() {
    // let form;
    // switch (this.state.displayed_form) {
    //   case 'login':
    //     form = <LoginForm handle_login={this.handle_login} />;
    //     break;
    //   case 'signup':
    //     form = <SignUpForm handle_signup={this.handle_signup} />;
    //     break;
    //   default:
    //     form = null;
    // }

    // BELOW was in return
    // <div className="registrationDiv">
    //     <h1>Welcome to Opus Team Management!</h1>
    //     <h3>
    //       {this.state.logged_in
    //         ? `Hello, ${this.state.username}. Your first name is ${this.state.first_name}.`
    //         : 'Please Log In or Sign Up'}
    //     </h3>
    //     <h4>
    //         {this.state.loginError
    //         ? 'No user exists with those credentials. Please try again.'
    //         : ''}
    //     </h4>
    //     <Nav
    //       logged_in={this.state.logged_in}
    //       display_form={this.display_form}
    //       handle_logout={this.handle_logout}
    //     />
    //     {form}
    //   </div>

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
                    onChange={this.handle_change}
                    value={this.state.username}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password" 
                    name="password"
                    onChange={this.handle_change}
                    value={this.state.password}
                  />
                  <Form.Text>
                    <a className='loginLink' href="https://google.com">Forgot your password?</a>
                  </Form.Text>
                </Form.Group>
                <Button
                  onClick={e => this.handle_login(e, this.state)}
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
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.handleClose}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
    
      </Container>
    );
  }
}

export default Login;