import {Container, Jumbotron, Button, Form, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import * as Icon from 'react-feather';

// Team
// Group

export default function Team(props) {
    return (
      <Container fluid>
            <Jumbotron>
              <h1>Create or Join a Team</h1>
              <p>
                Instructions erspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, tium doloremque laudantium, tot
              </p>
                <Form.Row>
                  <p>
                    <Button variant="success"><Icon.Plus/> New Team</Button>
                  </p>
                  <Form.Control type="text" placeholder="Enter a code or link"/>
                  <Button variant="primary" type="submit">Join</Button>
                </Form.Row>
            </Jumbotron>
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
      </Container>
    )
}
