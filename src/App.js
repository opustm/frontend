import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login.component';
import Team from './components/team.component';
import Home from './components/home.component';
import About from './components/about.component';
import AuthService from './services/auth.service';
import Navigation from './components/Navigation/navigation.component';

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
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            {loggedIn === true ? <Redirect to='/' /> : <Login loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/>}
          </Route>
          <div className="navbar-enabled">
            {loggedIn === true ? <Navigation/> : <Redirect to="/login"/>}
            <Route path="/">
              <Home/>
            </Route>
            <Route path="/teams">
              <Team/>
            </Route>
          </div>
        </Switch>
      </Router>
    );
  }
  
