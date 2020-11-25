import React, {Component} from 'react';
import * as Icon from 'react-feather';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import AuthService from '../services/auth.service';


export default class NavigationBar extends Component{
  constructor(props) {
    super(props);
    this.state = {
      authService : new AuthService()
    }
  }


  handleLogout = () => {
    this.authService.logout();
    this.props.parentCallback(false);
  };

  // Links in the dropdown will change to be something like:
  // href={`/users/${this.state.userId}`}
  // So that it only gets the logged in user's data
  render() {
    return (
      <Navbar>
        <Navbar.Brand href="/">Opus</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
          <NavDropdown title='Username Here'>
            <NavDropdown.Item><Icon.User />View Profile</NavDropdown.Item>
            <NavDropdown.Item><Icon.Settings />Edit User Settings</NavDropdown.Item>
            <NavDropdown.Item href='/users/1'>User X</NavDropdown.Item>
            <NavDropdown.Item href='/users/2'>User Y</NavDropdown.Item>
            <NavDropdown.Item href='/users/3'>User Z</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/login" onClick={() => {this.handleLogout()}}><Icon.LogOut/> Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    )
  }
}