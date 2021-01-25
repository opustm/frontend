import React from 'react';
// Add {useState} for login validation
import * as Icon from 'react-icons/fi';
import {Link} from 'react-router-dom';
import {SidebarApps,SidebarTeams} from './navigation.data';
import {Dropdown} from 'react-bootstrap';
import {IconContext} from 'react-icons';
import './navigation.css';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';
import DropdownItem from 'react-bootstrap/esm/DropdownItem';
import DropdownMenu from 'react-bootstrap/esm/DropdownMenu';

function Navigation(props){
    const showSidebar = () => props.setSidebar(!sidebar)
    let sidebar = props.sidebar;
    return (
        <>
            <IconContext.Provider value={{"color":"#000000"}}>
            <nav className={sidebar ? "nav-menu active" : 'nav-menu'}>
                <ul className="nav-menu-items">
                    <span className="navbar-toggle"/>
                    {SidebarApps.map((item,index) => {
                       return (
                           <li key={index} className={item.cName}>
                               <Link to={item.path}>
                                   {item.icon}
                                   <span>{item.title}</span>
                               </Link>
                           </li>
                       );
                    })}
                    <li className="nav-section">My Teams</li>
                    {SidebarTeams.map((item,index) => {
                        return (
                            <li key={index} className={item.cName}>
                                <Link to={item.path}>
                                    <img src={item.photo} 
                                        alt="Team's profile avatar"
                                        className="avatar nav-menu-photo"/>
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            </IconContext.Provider>
            <IconContext.Provider value={{"color":"#FFFFFF"}}>
            <div className="navbar site-header sticky-top py-1">
                <Link to="#" className="menu-bars">
                    <Icon.FiMenu onClick={showSidebar}/>
                </Link>
                <Link to="#" className="nav-text nav-title">
                    Opus Team
                </Link>
                <Dropdown>
                    <DropdownToggle variant="outline-secondary">
                        <Icon.FiUser id='profileMenuIcon' size={25} color='white'></Icon.FiUser>
                    </DropdownToggle>
                    <DropdownMenu>
                        <Link className='dropdown-item' to={props ? `/user/${props.userInfo.username}` : ''}>
                            <Icon.FiUser color='#7b8a8b' className='dropdownIcon'/>View Profile
                        </Link>
                        <DropdownItem
                            onClick={() => {
                                localStorage.removeItem('token');
                                props.onLoggedInChange(false);
                            }}
                            href='/'
                        >
                            <Icon.FiLogOut color='#7b8a8b' className='dropdownIcon'/>
                            Logout
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            </IconContext.Provider>
        </>
    );
}

export default Navigation;
