import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './stylesheets/App.css'

// Services
import AuthService from './services/auth.service';

// Components
import Navigation from './components/Navigation/navigation.component';

// Pages
import Login from './pages/Login';
import About from './pages/About';
import Dashboard from './pages/Home';
import Error from './pages/NotFound';

// Apps
import Teams from './apps/Teams/Teams';
import Calendar from './apps/Calendar/Calendar';
import Chat from './apps/Chat/Chat';
import Contacts from './apps/Contacts/Contacts';
import Announcements from './apps/Announcements/Announcements';

export default function App() {
  let authService = new AuthService();
  let [loggedIn, setLoggedIn] = useState(false);
  let [sidebarToggled,setSidebar] = useState(true)
  
  let handleLoginChange = (isLoggedIn) => {
    if (!isLoggedIn) {
      authService.logout();
    }
    setLoggedIn(isLoggedIn);
  }

    return (
      <Router>
        <Navigation 
          sidebar={sidebarToggled}
          setSidebar={setSidebar}
          onLoggedInChange={handleLoginChange}/>
        <Switch>
          <Route path="/login">
            {loggedIn ? <Redirect to='/' /> : <Login loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/>}
          </Route>
          <div className={sidebarToggled? "page sidebar-toggled":"page"}>
            <Route path="/" exact component={Dashboard}/>
            <Route path="/about" exact component={About}/>
            <Route path="/404" exact component={Error}/>
            <Route path="/calendar" exact component={Calendar}/>
            <Route path="/teams" exact component={Teams}/>
            <Route path="/chat" exact component={Chat}/>
            <Route path="/contacts" exact component={Contacts}/>
            <Route path="/announcements" exact component={Announcements}/>
          </div>
        </Switch>
      </Router>
    );
  }
  
