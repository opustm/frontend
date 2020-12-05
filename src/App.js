import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login.component';
import Team from './components/team.component';
import Home from './components/home.component';
import About from './components/about.component';
import AuthService from './services/auth.service';

export default function App() {
  let authService = new AuthService();
  let [loggedIn, setLoggedIn] = useState(false);
  let handleLoginChange = (isLoggedIn) => {
    if (!isLoggedIn) {
      authService.logout();
    }
    setLoggedIn(isLoggedIn);
  }
  
    return (
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
            <Route path="/login">
              {loggedIn === true ? <Redirect to='/' /> : <Login loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/>}
            </Route>
          <div className="navbar-enabled">
            <Route path="/teams">
              {loggedIn === true ? <Team loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/> : <Redirect to="/login" />}
            </Route>
            <Route path="/">
              {loggedIn === true ? <Home loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/> : <Redirect to="/login" />}
            </Route>
          </div>
        </Switch>
      </Router>
    );
  }
  
