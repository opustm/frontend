import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login.component';
import Team from './components/team.component';
import Home from './components/home.component';
import About from './components/about.component';
import Profile from './components/profile.component'
import AuthService from './services/auth.service';

export default function App() {
  let authService = new AuthService();
  let [loggedIn, setLoggedIn] = useState(localStorage.getItem('token' ? true : false));
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
          <Route path="/login" component={() => {return localStorage.getItem('token') ? <Redirect to='/' /> : <Login onLoggedInChange={handleLoginChange}/>}}>
          </Route>
          <Route path="/users/:userID" component={(props) => {return localStorage.getItem('token') ? <Profile {...props} /> : <Redirect to="/login"/>}}>
          </Route>
          <Route path="/teams" component={() => {return localStorage.getItem('token') ? <Team /> : <Redirect to="/login" />}}>
          </Route>
          <Route path="/" component={() => {return localStorage.getItem('token') ? <Home /> : <Redirect to="/login" />}}>
          </Route>
        </Switch>
      </Router>
    );
  }
  
