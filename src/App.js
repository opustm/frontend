import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login.component';
import Team from './components/team.component';
import Home from './components/home.component';
import About from './components/about.component';
import Profile from './components/profile.component'

export default function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  let callbackFunction = (childData) => {
    setLoggedIn(childData);
  };
    return (
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/users/:userID" component={Profile}></Route>
          <Route path="/login">
            {loggedIn === true ? <Home /> : <Login parentCallback={callbackFunction}/>}
          </Route>
          <Route path="/teams">
            {loggedIn === true ? <Team parentCallback={callbackFunction}/> : <Redirect to="/login" />}
          </Route>
          <Route path="/">
            {loggedIn === true ? <Home /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    );
  }
  
