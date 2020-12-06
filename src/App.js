import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './stylesheets/App.css'

// Services
import AuthService from './services/auth.service';

// Components
import Navigation from './components/Navigation/navigation.component';

// Pages
import Login from './components/login.component';
import About from './components/about.component';
import Dashboard from './components/home.component';

// Apps
import Teams from './components/apps/Teams/Teams';
import Calendar from './components/apps/Calendar/Calendar';
import Chat from './components/apps/Chat/Chat';
import Contacts from './components/apps/Contacts/Contacts';
import Announcements from './components/apps/Announcements/Announcements';

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
        <Navigation onLoggedInChange={handleLoginChange}/>
        <Switch>
          <Route path="/login">
            {loggedIn ? <Redirect to='/' /> : <Login loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/>}
          </Route>
          <Route path="about" exact component={About}/>
          <Route path="/" exact component={Dashboard}/>
          <Route path="/calendar" exact component={Calendar}/>
          <Route path="/teams" exact component={Teams}/>
          <Route path="/chat" exact component={Chat}/>
          <Route path="/contacts" exact component={Contacts}/>
          <Route path="/announcements" exact component={Announcements}/>
        </Switch>
      </Router>
    );
  }
  
