import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'

import Login from './components/login/login.component';
import Groups from './components/groups/group.component';
import Home from './components/home/home.component';
import About from './components/about/about.component';

function App(props) {
    return (
        <BrowserRouter>
            <Switch>
                {/* <h3>Home</h3> */}
                <Login/>
                <Route exact path = "/" component = {Home}>
                </Route>
                <Route path = "login" component = {Login}>
                </Route>
                <Route path = "about" component = {About}/>
                <Route path = "groups" component = {Groups}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App;