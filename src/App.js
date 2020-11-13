import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login/login.component';
import Team from './components/team/team.component';
import Home from './components/home/home.component';
import About from './components/about/about.component';

export default function App() {
  let [loggedIn, setLoggedIn] = useState(false);
  let callbackFunction = (childData) => {
    console.log(`Child data = ${childData}`);
    setLoggedIn(childData);
  };
  console.log(`Logged in = ${loggedIn}`);
    return (
      <Router>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
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
  
