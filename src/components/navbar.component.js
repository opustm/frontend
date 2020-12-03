import React from 'react';
import * as Icon from 'react-feather';
import { Navbar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import AuthService from '../services/auth.service';

export default function NavigationBar(props) {
  let authService = new AuthService();
  return (
    <Navbar>
      <Link to='/' className='navbar-brand'>Opus</Link>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
      <Link to={`/user/${props.currentUsername}`}><Icon.User/>Profile</Link>
      <div onClick={() => {authService.logout()}}>
        <Link to='/login'>
          <Icon.LogOut/> Logout
        </Link>
      </div>
      </Navbar.Collapse>
    </Navbar>
  )
}
