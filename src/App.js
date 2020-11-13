import React, {useState} from 'react';
import { BrowserRouter as Router, Link, Route, Switch, Redirect } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import Login from './components/login/login.component';
import Groups from './components/team/team.component';
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
        <nav>
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
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/about">
            <About />
          </Route>
          <Route path="/login">
            <Login parentCallback={callbackFunction}/>
          </Route>
          <Route path="/groups">
            {loggedIn === true ? <Groups parentCallback={callbackFunction}/> : <Redirect to="/login" />}
          </Route>
          <Route path="/">
            {loggedIn === true ? <Home /> : <Redirect to="/login" />}
          </Route>
        </Switch>
      </Router>
    );
  }
  
