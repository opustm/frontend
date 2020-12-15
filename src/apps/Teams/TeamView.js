import React, { useState, useEffect } from 'react';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Container, ListGroup, Dropdown, ButtonGroup, Button, Row, Col, Jumbotron, Image } from 'react-bootstrap';
import { Link, Redirect, useParams } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
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
            console.log("Members", request.data);
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


    let groupsView = 
        <p>This team has groups.</p>
  
    
    return (
            <Container fluid>
                <Col sm={12} md={{span: 10, offset: 1}}>
                    <Jumbotron>
                        <Row>
                        <Col md={3} lg={2} className="text-center">
                            <Image roundedCircle
                                src="https://via.placeholder.com/80/0ea055?text=T"
                                alt="Team Profile"
                                />
                        </Col>
                        <Col md={9} lg={10}>
                            <div className="team-view-title">
                                <h1>{details? details.name: null} </h1>
                                <p>This team is a team for so and so purposes </p>
                            </div>

                            <Row>
                                <Col>
                                    <Button variant="success"><Icon.FiUserPlus/> Invite Member</Button>
                                </Col>
                                <Col className="text-right">
                                <div className="d-inline-block mb-1">
                                    <Dropdown>
                                    <Dropdown.Toggle variant="small primary">
                                    <Icon.FiSettings/>
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                    <Dropdown.Item href="#">Edit</Dropdown.Item>
                                    <Dropdown.Item href="#">Leave</Dropdown.Item>
                                    <Dropdown.Item>Delete</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                                </div>
                                </Col>  
                            </Row>
                        </Col>
                        </Row>
                    </Jumbotron>
                    <Container>
                        {members?        
                        <div className="members-div">
                        <ListGroup>
                            {members.map((item,index) => {
                                return (
                                    <ListGroup.Item key={index} className="member-element">
                                        <p>{item.first_name} {item.last_name}</p>
                                    </ListGroup.Item>                        
                                )
                            })}
                        </ListGroup>
                    </div>
                    : <p>The team does not have any members yet</p>}
                    </Container>
                    <Container>
                        {groups? groupsView: <p>This team does not have any groups.</p>}
                    </Container>
                </Col>
            </Container>
        )
}

export default TeamView;