import React, { useEffect, useState } from 'react';
// Add {useState} for login validation
import * as Icon from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { SidebarApps } from './navigation.data';
import { Dropdown } from 'react-bootstrap';
import { IconContext } from 'react-icons';
import {
  Axios as api,
  API_ENDPOINTS as urls
} from '../../services/api.service';
import './navigation.css';

// TO DO:
// Render the most recent teams only? i.e. the last six a user interacted with

function Navigation(props) {
  const showSidebar = () => props.setSidebar(!sidebar);
  const [teams, setTeams] = useState(props.userTeams);
  let sidebar = props.sidebar;
  useEffect(() => {
    async function fetchTeams() {
      let teamRequest = await api.get(urls.user.fetchTeams(props.userInfo.id));
      let newTeamIds = new Set(
        teamRequest.data.map(team => {
          return team.id;
        })
      );
      let currentTeamIds = teams.map(team => {
        return team.id;
      });
      // JS doesn't have an equality operator for sets or lists, so we're stuck with the code below
      let equalSize = newTeamIds.size === currentTeamIds.length;
      let equal;
      if (equalSize) {
        equal = currentTeamIds.every(e => newTeamIds.has(e));
      }
      if (!equal) {
        setTeams(teamRequest.data);
      }
    }
    fetchTeams();
  });

  return (
    <>
      <IconContext.Provider value={{ color: '#000000' }}>
        <nav className={sidebar ? 'nav-menu active' : 'nav-menu'}>
          <ul className="nav-menu-items">
            <span className="navbar-toggle" />
            {SidebarApps.map((item, index) => {
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
            {teams.map((team, index) => {
              return (
                <li key={index} className="nav-text team">
                  <Link
                    to={{
                      pathname: `/teams/${team.name}/`,
                      state: { teamId: team.id }
                    }}
                  >
                    <img
                      src={`https://via.placeholder.com/50/18BC9C/FFFFFF?text=${team.name[0].toUpperCase()}`}
                      alt="Team's profile avatar"
                      className="avatar nav-menu-photo"
                    />
                    <span>{team.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
      <IconContext.Provider value={{ color: '#FFFFFF' }}>
        <div className="navbar site-header sticky-top py-1">
          <Link to="#" className="menu-bars">
            <Icon.FiMenu onClick={showSidebar} />
          </Link>
          <Link to="#" className="nav-text nav-title">
            Opus Team
          </Link>
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary">
              <Icon.FiUser
                id="profileMenuIcon"
                size={25}
                color="white"
              ></Icon.FiUser>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Link
                className="dropdown-item"
                to={{
                  pathname: props ? `/user/${props.userInfo.username}` : '',
                  state: { userId: props.userInfo.id }
                }}
              >
                <Icon.FiUser color="#7b8a8b" className="dropdownIcon" />
                View Profile
              </Link>
              <Dropdown.Item
                onClick={() => {
                  localStorage.removeItem('token');
                  props.onLoggedInChange(false);
                }}
                href="/"
              >
                <Icon.FiLogOut color="#7b8a8b" className="dropdownIcon" />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </IconContext.Provider>
    </>
  );
}

export default Navigation;
