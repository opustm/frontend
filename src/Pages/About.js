import React, { useState, useEffect, useRef } from "react";
import BIRDS from "vanta/dist/vanta.birds.min";
import { Container, Button, Nav, Row } from "react-bootstrap";
import { descriptions } from "../services/description.service";
import * as Icon from "react-icons/fi";
import * as THREE from 'three';
import "../stylesheets/About.css";
import display1 from "../static/images/img1.png";
import display2 from "../static/images/img2.png";
document.title = "Opus Team";

export default function About(props) {
  const [vantaEffect, setVantaEffect] = useState(0);
  const myRef = useRef(null);
  useEffect(() => {
    if (!vantaEffect) {
      setVantaEffect(
        BIRDS({
          el: myRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          backgroundColor: 0xffffff,
          color1: 0xa4ff,
          color2: 0x59ff00,
          colorMode: "lerpGradient",
          birdSize: 1.50,
          wingSpan: 25.00,
          speedLimit: 3.00,
          separation: 77.00,
          alignment: 41.00,
          cohesion: 33.00,
          quantity: 4.00
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);
  return (
    <Container fluid>
      <div ref={myRef}>  

      <Nav className="justify-content-between site-header sticky-top py-1">
      <a class="py-2" href="https://opustm.herokuapp.com">
      <img width="36" height="36" alt="Opus Logo" src="https://opustm.github.io/docs/images/logo64.png" class="d-block mx-auto"/>
        </a>
        <Nav.Item>
        <Row>
          <Nav.Link href="https://opustm.github.io/docs">
            <Button variant="link">Documentation</Button>
          </Nav.Link>
          <Nav.Link href="/login">
            <Button variant="success">Login</Button>
          </Nav.Link>
        </Row>
        </Nav.Item>
      </Nav>

        <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center">
          <div className="position-relative overflow-hidden p-3 p-md-5 m-md-3 text-center">
            <div className="col-md-5 p-lg-5 mx-auto my-5">
              <h1 className="display-4 font-weight-normal">Opus</h1>
              <p className="lead font-weight-normal">
                Fast, open source, scalable collaboration tool for small teams.
              </p>
              <a className="btn btn-lg btn-outline-primary" href="/login">
                Get Started
              </a>
            </div>
          </div>
        </div>
      </div>

        <Container>
      <hr className="featurette-divider" />


      <Container>
      <div className="row featurette">
        <div className="col-md-7">
          <h2 className="featurette-heading">
            Why we built this.{" "}
            <span className="text-muted">A message from the development team.</span>
          </h2>
          <p className="lead">
            {descriptions.pages.About.body}
          </p>
        </div>
        <div className="col-md-5">
          <img
            className="featurette-image img-fluid mx-auto"
            src={display1}
            alt="Generic placeholder"
          />
        </div>
      </div>

      </Container>
      <div className="row featurette">
        <div className="col-md-7 order-md-2">
          <h2 className="featurette-heading">
            Free and Open Source (FOSS).{" "}
            <span className="text-muted">Meet the features.</span>
          </h2>
          <p className="lead">
          <ul>
            {descriptions.pages.About.featureList.map((item) => 
                <li>{item}</li>
            )}
          </ul>
          </p>
        </div>
        <div className="col-md-5 order-md-1">
          <img
            className="featurette-image img-fluid mx-auto"
            src={display2}
            alt="Generic placeholder"
          />
        </div>
      </div>


      <hr className="featurette-divider" />
      <Container>
      <div className="row">
        {descriptions.pages.About.developers.map((dev) => {
          return (
            <div className="col-md-4">
              <h2>{dev[0]}</h2>
              <p>{dev[1]}</p>
              <a href={dev[3]} target="blank">
                <Icon.FiGithub style={{ marginLeft: "10px" }} />
              </a>
              <a href={dev[2]} target="blank">
                <Icon.FiLinkedin style={{ marginLeft: "10px" }} />
              </a>
            </div>
          );
        })}
      </div>
      <hr className="featurette-divider" />
      </Container>

        </Container>
      <hr className="featurette-divider" />
      
      <footer className="container py-5">
        <div className="row">
          <div className="col-12 col-md">
            <img
              src="https://opustm.github.io/docs/images/logo64.png"
              width="24"
              height="24"
              alt="Opus Logo"
            />
            <small className="d-block mb-3 text-muted">&copy; 2020-2021</small>
          </div>
          <div className="col-6 col-md">
            <h5>Features</h5>
            <ul className="list-unstyled text-small">
              <li>
                <a className="text-muted" href="google.com">
                  Cool stuff
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Random feature
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Team feature
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Stuff for developers
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Another one
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Last time
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>Resources</h5>
            <ul className="list-unstyled text-small">
              <li>
                <a className="text-muted" href="google.com">
                  Resource
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Resource name
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Another resource
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Final resource
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>Resources</h5>
            <ul className="list-unstyled text-small">
              <li>
                <a className="text-muted" href="google.com">
                  Business
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Education
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Government
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Gaming
                </a>
              </li>
            </ul>
          </div>
          <div className="col-6 col-md">
            <h5>About</h5>
            <ul className="list-unstyled text-small">
              <li>
                <a className="text-muted" href="google.com">
                  Team
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Locations
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Privacy
                </a>
              </li>
              <li>
                <a className="text-muted" href="google.com">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
      </footer>
    </Container>
  );
}
