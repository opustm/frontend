import * as Icon from 'react-feather';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import AuthService from '../services/auth.service';


export default function NavigationBar(props) {
  let authService = new AuthService();

  let handleLogout = () => {
    authService.logout();
    this.props.parentCallback(false);
  };

  // Links in the dropdown will change to be something like:
  // href={`/users/${this.state.userId}`}
  // So that it only gets the logged in user's data
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
            <NavDropdown.Item>User Z</NavDropdown.Item>
          </NavDropdown>
          <Nav.Link href="/login" onClick={handleLogout}><Icon.LogOut/> Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    )
}