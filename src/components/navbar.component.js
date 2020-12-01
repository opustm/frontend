import * as Icon from 'react-feather';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function NavigationBar(props) {
    return (
      <Navbar>
        <Link to='/' className='navbar-brand'>Opus</Link>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Nav.Link href="#"><Icon.User/> Profile</Nav.Link>
        <div onClick={() => {props.onLoggedInChange(false)}}>
          <Link to='/login'>
            <Icon.LogOut/> Logout
          </Link>
        </div>
        </Navbar.Collapse>
      </Navbar>
    )
}