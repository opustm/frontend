import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Login from './components/login/login.component';
import Groups from './components/groups/group.component';
import Home from './components/home/home.component';
import About from './components/about/about.component';

function App(props) {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path = "/" component = {Home}>
                    <h3>Home</h3>
                </Route>
                <Route path = "login" component = {Login}/>
                <Route path = "about" component = {About}/>
                <Route path = "groups" component = {Groups}/>
            </Switch>
        </BrowserRouter>
    )
}

export default App;