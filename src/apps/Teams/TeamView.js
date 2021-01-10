import React, { useState, useEffect } from 'react';
import { Axios as api, API_ENDPOINTS as urls } from '../../services/api.service';
import { Container, Card, ListGroup, Dropdown, Button, Row, Col, Jumbotron, Image } from 'react-bootstrap';
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
        }
        async function fetchMembers() {
            const request = await api.get(
                urls.teams.fetchMembers(teamUsername)
            );
            setMembers(request.data);
        }
        async function fetchGroups() {
            const request = await api.get(
                urls.teams.fetchRelatedTeams(teamUsername)
            );
            if (request.data) setGroups(request.data);
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
                                    <Dropdown.Item><Link to={`${teamUsername}/settings`}>Settings</Link></Dropdown.Item>
                                    <Dropdown.Item>Leave</Dropdown.Item>
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
                        <Row>
                            <Col md={8} lg={8} sm={12}>
                                <Card>
                                    <Card.Header>
                                        Members
                                    </Card.Header>
                                    <Card.Body>
                                    {members?        
                                        <div className="members-div">
                                        <ListGroup>
                                            {members.map((item,index) => {
                                                return (
                                                    <ListGroup.Item key={index} className="member-element">
                                                        <Row>
                                                            <Col className="text-center" sm={4} md={4}>
                                                                <Link to={`/user/${item.username}`}>
                                                                <Image roundedCircle
                                                                    src="https://via.placeholder.com/40/AF34BB?text=U"
                                                                    alt="user profile"/>
                                                                </Link>
                                                            </Col>
                                                            <Col sm={6} md={6}>
                                                                <Link to={`/user/${item.username}`}>
                                                                    <p>{item.first_name} {item.last_name}</p>
                                                                </Link>
                                                            </Col>
                                                            <Col sm={2} md={2}>
                                                                <Dropdown>
                                                                    <Dropdown.Toggle variant="small">
                                                                        <Icon.FiSettings/>
                                                                        </Dropdown.Toggle>
                                                                        <Dropdown.Menu>
                                                                        <Dropdown.Item href="#">Permissions</Dropdown.Item>
                                                                        <Dropdown.Item href="#">Remove</Dropdown.Item>
                                                                    </Dropdown.Menu>
                                                                </Dropdown>
                                                            </Col>
                                                        </Row>
                                                    </ListGroup.Item>                        
                                                )
                                            })}
                                        </ListGroup>
                                        </div>
                                    : <p>The team does not have any members yet</p>}
                                    </Card.Body>
                                </Card>
                            </Col>
                            <Col md={4} lg={4} sm={12}>
                            <Card>
                                <Card.Header>
                                    Groups
                                </Card.Header>
                                <Card.Body className="text-center">
                                {groups?        
                                  <p>This team has {groups.length} group(s).</p>
                                : <p>The team does not have any groups yet</p>}
                                </Card.Body>
                            </Card>
                            </Col>
                        </Row>
                    </Container>
                </Col>
            </Container>
        )
}

export default TeamView;