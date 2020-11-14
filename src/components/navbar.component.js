import * as Icon from 'react-feather';
import { Navbar, Nav } from 'react-bootstrap';
import AuthService from '../services/auth.service';

export default function NavigationBar(props) {
  let authService = new AuthService();

  let handleLogout = () => {
    authService.logout();
    this.props.parentCallback(false);
  };

    return (
      <Navbar>
        <Navbar.Brand href="/">Opus</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Nav.Link href="#"><Icon.User/> Profile</Nav.Link>
        <Nav.Link href="/login" onClick={handleLogout}><Icon.LogOut/> Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    )
}