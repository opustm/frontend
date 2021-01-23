import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { descriptions } from '../services/description.service';
import * as Icon from 'react-icons/fi';

export default function About(props) {
    return (
        <div style={{height: '90%'}}>
            <div className="navbar">
                <Link to="#" className="nav-text nav-title" style={{marginLeft: '45%'}}>
                    Opus Team
                </Link>
            </div>
            <Container fluid>
                <Row style={{height: '100%'}}>
                    <Col style={{backgroundColor: '#00CFAA', height: '100%'}}>
                        <Container>
                            <Row style={{marginTop: '15px'}}><h3>Meet the developers!</h3></Row>
                            {descriptions.pages.About.developers.map((dev) => {
                                return (
                                    <Row style={{marginBottom: '15px', marginTop: '15px'}}>
                                        <Col style={{marginLeft: '-15px'}}>                                        
                                            <h5>
                                                {dev[0]}
                                                    <a href={dev[3]} target='blank'>
                                                        <Icon.FiGithub style={{marginLeft: '10px'}}/>
                                                    </a>
                                                    <a href={dev[2]} target='blank'>
                                                        <Icon.FiLinkedin />
                                                    </a>
                                            </h5>
                                            <p>{dev[1]}</p>
                                        </Col>
                                    </Row>
                                )
                            })}
                        </Container>
                    </Col>
                    <Col>
                        <h3 style={{paddingTop: '15px'}}>About Opus</h3>
                        <p style={{textAlign: 'justify', textJustify: 'inter-word'}}>{descriptions.pages.About.body}</p>
                        {descriptions.pages.About.featureList.map((featureDesc) => {
                            return <li style={{marginTop: '10px'}}>{featureDesc}</li>
                        })}
                        <Container>
                            <div className="d-flex justify-content-center" >
                                <Button style={{marginTop: '40px'}} onClick={() => {window.location.href='/login'}}>Click Here to Get Started!</Button>
                            </div>
                            <Row style={{marginTop: '50px'}}>
                                <Col className="d-flex justify-content-center">
                                    <Icon.FiHome size={30}/>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Icon.FiCalendar size={30}/>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Icon.FiTarget size={30}/>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Icon.FiMessageSquare size={30}/>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Icon.FiBook size={30}/>
                                </Col>
                                <Col className="d-flex justify-content-center">
                                    <Icon.FiRss size={30}/>
                                </Col>
                            </Row>
                            <Row className="d-flex justify-content-center">
                                <p id='copyright'>&#169; Opus Team Management, 2020</p>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
        </div>
        
    )
    
}
