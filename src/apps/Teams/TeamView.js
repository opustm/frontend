import React, { useState, useEffect } from 'react';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Container, Col, Jumbotron } from 'react-bootstrap';
import { Link, Redirect, useParams } from 'react-router-dom';
import './teams.css';

const TeamView = (props) => {
    const [details,setDetails] = useState();
    const [members,setMembers] = useState();
    const [groups,setGroups] = useState();
    let teamUsername = useParams().teamUsername;
    
    useEffect(() => {
        async function fetchDetails() {
            const request = await api.get(
                urls.teams.fetchDetails(teamUsername)
                );
            setDetails(request.data);
            console.log("Details", request.data);
        }
        async function fetchMembers() {
            const request = await api.get(
                urls.teams.fetchMembers(teamUsername)
            );
            setMembers(request.data);
            console.log("Members", request.members);
        }
        async function fetchGroups() {
            const request = await api.get(
                urls.teams.fetchRelatedTeams(teamUsername)
            );
            setGroups(request.data);
            console.log("Groups", request.data);
        }
        try {
            fetchDetails();
            fetchMembers();
            fetchGroups();
        }
        catch (err) {
            <Redirect to="/404"/>
        }
    }, [teamUsername]);
    
    let detailsView = 
        <Container>Details</Container>

    let membersView = 
        <Container>Members</Container>

    let basePage =
        <div className="page">
            <Container fluid>
                <Col sm={12} md={{span: 10, offset: 1}}>
                    <Jumbotron>
                        <h1>{details.name? details.name: null}</h1>
                        <p>This is a team for so and so and so purposes. </p>
                    </Jumbotron>
                </Col>

            </Container>
        </div>

    return (
        <div>
            {basePage}
        </div>
    )
}

export default TeamView;