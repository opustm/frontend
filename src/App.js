import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Login from './components/login/login.component';

function App(props) {
    return (
        <Router>
            <Login/>
        </Router>
    )
}

export default App;