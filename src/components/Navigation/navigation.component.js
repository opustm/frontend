import React, {useState} from 'react';
import * as Icon from 'react-icons/fi';
import {Link} from 'react-router-dom';
import {SidebarApps} from './navigation.data';
import * as BS from 'react-bootstrap';
import './navigation.css';

function Navigation(props){
    const [sidebar, setSidebar]= useState(false)
    const showSidebar = () => setSidebar(!sidebar)
    return (
        <>
            <div className="navbar">
                <BS.Navbar>
                    <Link to="#" className="menu-bars">
                        <Icon.FiMenu onClick={showSidebar}/>
                    </Link>
                    <BS.Navbar.Toggle/>
                    <BS.Navbar.Collapse className="justify-content-end">
                    <BS.Nav.Link href="#"><Icon.FiUser/>Profile</BS.Nav.Link>
                    <div onClick={() => {props.onLoggedInChange(false)}}>
                    <Link to='/login'>
                        <Icon.FiLogOut/> Logout
                    </Link>
                    </div>
                    </BS.Navbar.Collapse>
                </BS.Navbar>
            </div>
            <nav className={sidebar ? "nav-menu active" : 'nav-menu'}>
                <ul className="nav-menu-items">
                    <li className="navbar-toggle">
                        <Link to="#" className="menu-bars">
                            <Icon.FiX/>
                        </Link>
                    </li>
                    {SidebarApps.map((item,index) => {
                       return (
                           <li key={index} className={item.cName}>
                               <Link to={item.path}>
                                   {item.icon}
                                   <span>{item.title}</span>
                               </Link>
                           </li>
                       ) 
                    })}
                </ul>
            </nav>
        </>
    );
}

export default Navigation;