import React, { Component } from 'react';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';

import Login from './components/login/login.component';
import Groups from './components/team/team.component';
import Home from './components/home/home.component';
import About from './components/about/about.component';

export default function App() {
    return (
      <div>
        <Router>
            {/* <nav>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About</Link>
                </li>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/groups">Groups</Link>
                </li>
              </ul>
            </nav> */}
    
            {/* A <Switch> looks through its children <Route>s and
                renders the first one that matches the current URL. */}
            <Switch>
              <Route path="/about">
                <About />
              </Route>
              <Route path="/login">
                <Login />
              </Route>
              <Route path="/team">
                <Groups />
              </Route>
              <Route path="/">
                <Home />
              </Route>
            </Switch>

        </Router>
      </div>
    );
  }
  
