import { Container, Row, Jumbotron, Button, Col, Form, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import * as Icon from 'react-feather';
import NavigationBar from '../overlay/navbar.component';

// Team
// Group

export default function Groups(props) {
  let logoutCallback = (navbarData) => {
    this.props.parentCallback(navbarData);
  }
    return (
      <Container fluid>
        <Row>
          <Col>
            <NavigationBar parentCallback={logoutCallback}/>
          </Col>
        </Row>
        <Row>
          <Col>
            <Jumbotron>
              <h1>Create or Join a Team</h1>
              <p>
                Instructions erspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, tium doloremque laudantium, tot
              </p>
                <Form.Row>
                <Col>
                  <p>
                    <Button variant="success"><Icon.Plus/> New Team</Button>
                  </p>
                </Col>
                <Col>
                  <Form.Control type="text" placeholder="Enter a code or link"/>
                </Col>
                <Col>
                  <Button variant="primary" type="submit">Join</Button>
                </Col>
                </Form.Row>
            </Jumbotron>
          </Col>
        </Row>
        <Row>
          <Col>
          <Card>
          <Card.Header><Card.Title>Your Teams</Card.Title>
          <small>You are a member in the following teams</small>
          </Card.Header>
          <Card.Body>
            <ListGroup className="list-group-flush">
            <ListGroupItem>Cras justo odio</ListGroupItem>
            <ListGroupItem>Dapibus ac facilisis in</ListGroupItem>
            <ListGroupItem>Vestibulum at eros</ListGroupItem>
            </ListGroup>
          </Card.Body>
        </Card>
          </Col>
        </Row>
      </Container>
    )
}
