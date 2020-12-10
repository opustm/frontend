import React, { useState, useEffect } from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import '../stylesheets/Error.css';

const Error = (props) => 
    <div>
        <Container>
        <img 
            src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
            alt="Not found animation"/>
        <h2>Looks like you're lost.</h2>
        <p>The page you are looking for is not available.</p>
        <Link to="/">
            <Button>
                Go Home
            </Button>
        </Link>
        </Container>
    </div>

export default Error;