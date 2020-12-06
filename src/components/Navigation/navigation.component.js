import React, {useState} from 'react';
import * as Icon from 'react-icons/fi';
import {Link} from 'react-router-dom';
import {SidebarApps,SidebarTeams} from './navigation.data';
import {IconContext} from 'react-icons';
import './navigation.css';

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
                                    <img src={item.photo} className="avatar nav-menu-photo"/>
                                    <span>{item.title}</span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </nav>
            </IconContext.Provider>
            <IconContext.Provider value={{"color":"#FFFFFF"}}>
            <div className="navbar">
                <Link to="#" className="menu-bars">
                    <Icon.FiMenu onClick={showSidebar}/>
                </Link>
                <Link to="#" className="nav-text nav-title">
                    Opus Team
                </Link>
                <Link to="#" className="menu-photo">
                    <img 
                        src="https://via.placeholder.com/40/2D9CDB?text=B" 
                        className="avatar" 
                        onClick={() => {props.onLoggedInChange(false)}}
                    />
                </Link>
            </div>
            </IconContext.Provider>
        </>
    );
}

export default Navigation;