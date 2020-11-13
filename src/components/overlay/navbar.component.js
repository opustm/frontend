import * as Icon from 'react-feather';
import { Navbar, Nav } from 'react-bootstrap';

export default function NavigationBar(props) {

  let handleLogout = () => {
    localStorage.removeItem('token');
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