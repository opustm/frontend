import React from 'react';
import * as Icon from 'react-feather';
import { Navbar, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavigationBar(props) {
  return (
    <Navbar>
      <Link to='/' className='navbar-brand'>Opus</Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <NavDropdown title='Username Here'>
          <NavDropdown.Item><Icon.User />View Profile</NavDropdown.Item>
          <NavDropdown.Item><Icon.Settings />Edit User Settings</NavDropdown.Item>
          <NavDropdown.Item href='/users/1'>User X</NavDropdown.Item>
          <NavDropdown.Item href='/users/2'>User Y</NavDropdown.Item>
          <NavDropdown.Item href='/users/3'>User Z</NavDropdown.Item>
        </NavDropdown>
      <Link to='/users/7'><Icon.User/> Profile</Link>
      <div onClick={() => {props.onLoggedInChange(false)}}>
        <Link to='/login'>
          <Icon.LogOut/> Logout
        </Link>
      </div>
      </Navbar.Collapse>
    </Navbar>
  )
}
