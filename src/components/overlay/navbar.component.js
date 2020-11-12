import * as Icon from 'react-feather';
import { Navbar, Nav } from 'react-bootstrap';

export default function NavigationBar(props) {
    return (
        <Navbar>
        <Navbar.Brand href="#home">Opus</Navbar.Brand>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
        <Nav.Link href="#"><Icon.User/> Profile</Nav.Link>
        <Nav.Link href="/login"><Icon.LogOut/> Logout</Nav.Link>
        </Navbar.Collapse>
      </Navbar>
    )
}