import React, { useState, useEffect } from 'react';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Container, Card, ListGroup, Dropdown, Button, Row, Col, Jumbotron, Image } from 'react-bootstrap';
import { Link, Redirect, useParams } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import './teams.css';

const TeamSettings = (props) => {
    let teamUsername = useParams().teamUsername;
    const [members,setMembers] = useState();
    const [groups,setGroups] = useState();

    useEffect(() => {

    });

    return (
        <h1>This is the Team Settings Page</h1>
    )
}

export default TeamSettings;