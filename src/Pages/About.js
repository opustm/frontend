import { Container, Button, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { descriptions } from '../services/description.service';
import * as Icon from 'react-icons/fi';
import "../stylesheets/About.css";
document.title = "Opus Team";

export default function About(props) {
    return (
        <Container>
            <Nav className="justify-content-end site-header sticky-top py-1">
            <Nav.Item>
                <Nav.Link href="https://opustm.github.io/docs">
                    <Button variant="link">Documentation</Button>
                </Nav.Link>
            </Nav.Item>
            <Nav.Item>
                <Nav.Link href="/login"><Button variant="success">Login</Button></Nav.Link>
            </Nav.Item>
            </Nav>
            <div className="colorful position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center bg-light">
            <div className=" position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center">
                <div className="col-md-5 p-lg-5 mx-auto my-5">
                <h1 className="display-4 font-weight-normal">Opus</h1>
                <p className="lead font-weight-normal">Open Source Workforce Management for Small Teams</p>
                <a className="btn btn-lg btn-outline-light" href="/login">Get Started</a>
                </div>
                </div>
            </div>



            <hr className="featurette-divider"/>


            <div className="row featurette">
                <div className="col-md-7">
                    <h2 className="featurette-heading">First featurette heading. <span className="text-muted">It'll blow your mind.</span></h2>
                    <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
                </div>
                <div className="col-md-5">
                    <img className="featurette-image img-fluid mx-auto" src="" alt="Generic placeholder"/>
                </div>
            </div>

            <div className="row featurette">
                <div className="col-md-7 order-md-2">
                <h2 className="featurette-heading">Oh yeah, it's that good. <span className="text-muted">See for yourself.</span></h2>
                <p className="lead">Donec ullamcorper nulla non metus auctor fringilla. Vestibulum id ligula porta felis euismod semper. Praesent commodo cursus magna, vel scelerisque nisl consectetur. Fusce dapibus, tellus ac cursus commodo.</p>
            </div>
                <div className="col-md-5 order-md-1">
                <img className="featurette-image img-fluid mx-auto" src="../../static/images/work.png" alt="Generic placeholder"/>
                </div>
            </div>

            <hr className="featurette-divider"/>


            <div className="row">
          <div className="col-md-4">
            <h2>Heading</h2>
            <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
            <p><a className="btn btn-secondary" href="google.com" role="button">View details &raquo;</a></p>
          </div>
          <div className="col-md-4">
            <h2>Heading</h2>
            <p>Donec id elit non mi porta gravida at eget metus. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. </p>
            <p><a className="btn btn-secondary" href="google.com" role="button">View details &raquo;</a></p>
          </div>
          <div className="col-md-4">
            <h2>Heading</h2>
            <p>Donec sed odio dui. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Vestibulum id ligula porta felis euismod semper. Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum nibh, ut fermentum massa justo sit amet risus.</p>
            <p><a className="btn btn-secondary" href="google.com" role="button">View details &raquo;</a></p>
          </div>
        </div>
            
        <hr className="featurette-divider"/>

    <footer className="container py-5">
      <div className="row">
        <div className="col-12 col-md">
          <img src="https://opustm.github.io/docs/images/logo64.png" width="24" height="24" alt="Opus Logo"/>
          <small className="d-block mb-3 text-muted">&copy; 2020-2021</small>
        </div>
        <div className="col-6 col-md">
          <h5>Features</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="google.com">Cool stuff</a></li>
            <li><a className="text-muted" href="google.com">Random feature</a></li>
            <li><a className="text-muted" href="google.com">Team feature</a></li>
            <li><a className="text-muted" href="google.com">Stuff for developers</a></li>
            <li><a className="text-muted" href="google.com">Another one</a></li>
            <li><a className="text-muted" href="google.com">Last time</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Resources</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="google.com">Resource</a></li>
            <li><a className="text-muted" href="google.com">Resource name</a></li>
            <li><a className="text-muted" href="google.com">Another resource</a></li>
            <li><a className="text-muted" href="google.com">Final resource</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>Resources</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="google.com">Business</a></li>
            <li><a className="text-muted" href="google.com">Education</a></li>
            <li><a className="text-muted" href="google.com">Government</a></li>
            <li><a className="text-muted" href="google.com">Gaming</a></li>
          </ul>
        </div>
        <div className="col-6 col-md">
          <h5>About</h5>
          <ul className="list-unstyled text-small">
            <li><a className="text-muted" href="google.com">Team</a></li>
            <li><a className="text-muted" href="google.com">Locations</a></li>
            <li><a className="text-muted" href="google.com">Privacy</a></li>
            <li><a className="text-muted" href="google.com">Terms</a></li>
          </ul>
        </div>
      </div>
    </footer>

        </Container>
    )
    
}


        // <div style={{height: '90%'}}
        //     <Container fluid>
        //         <Row style={{height: '100%'}}>
        //             <Col style={{backgroundColor: '#00CFAA', height: '100%'}}>
        //                 <Container>
        //                     <Row style={{marginTop: '15px'}}><h3>Meet the developers!</h3></Row>
        //                     {descriptions.pages.About.developers.map((dev) => {
        //                         return (
        //                             <Row style={{marginBottom: '15px', marginTop: '15px'}}>
        //                                 <Col style={{marginLeft: '-15px'}}>                                        
        //                                     <h5>
        //                                         {dev[0]}
        //                                             <a href={dev[3]} target='blank'>
        //                                                 <Icon.FiGithub style={{marginLeft: '10px'}}/>
        //                                             </a>
        //                                             <a href={dev[2]} target='blank'>
        //                                                 <Icon.FiLinkedin />
        //                                             </a>
        //                                     </h5>
        //                                     <p>{dev[1]}</p>
        //                                 </Col>
        //                             </Row>
        //                         )
        //                     })}
        //                 </Container>
        //             </Col>
        //             <Col>
        //                 <h3 style={{paddingTop: '15px'}}>About Opus</h3>
        //                 <p style={{textAlign: 'justify', textJustify: 'inter-word'}}>{descriptions.pages.About.body}</p>
        //                 {descriptions.pages.About.featureList.map((featureDesc) => {
        //                     return <li style={{marginTop: '10px'}}>{featureDesc}</li>
        //                 })}
        //                 <Container>
        //                     <div className="d-flex justify-content-center" >
        //                         <Button style={{marginTop: '40px'}} onClick={() => {window.location.href='/login'}}>Click Here to Get Started!</Button>
        //                     </div>
        //                     <Row style={{marginTop: '50px'}}>
        //                         <Col className="d-flex justify-content-center">
        //                             <Icon.FiHome size={30}/>
        //                         </Col>
        //                         <Col className="d-flex justify-content-center">
        //                             <Icon.FiCalendar size={30}/>
        //                         </Col>
        //                         <Col className="d-flex justify-content-center">
        //                             <Icon.FiTarget size={30}/>
        //                         </Col>
        //                         <Col className="d-flex justify-content-center">
        //                             <Icon.FiMessageSquare size={30}/>
        //                         </Col>
        //                         <Col className="d-flex justify-content-center">
        //                             <Icon.FiBook size={30}/>
        //                         </Col>
        //                         <Col className="d-flex justify-content-center">
        //                             <Icon.FiRss size={30}/>
        //                         </Col>
        //                     </Row>
        //                     <Row className="d-flex justify-content-center">
        //                         <p id='copyright'>&#169; Opus Team Management, 2020</p>
        //                     </Row>
        //                 </Container>
        //             </Col>
        //         </Row>
        //     </Container>
        // </div>