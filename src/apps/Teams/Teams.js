import React, { useState, useEffect } from 'react';
import { useInput } from './../../services/forms.service.js';
import {
  Container,
  Spinner,
  Dropdown,
  Row,
  Col,
  Jumbotron,
  Button,
  Modal,
  Form,
  Alert,
  Tooltip,
  OverlayTrigger
} from 'react-bootstrap';
import {
  Axios as api,
  API_ENDPOINTS as urls
} from '../../services/api.service';
import { Link, Redirect } from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import './teams.css';

let createFormPlaceholderData = {
  name: 'New Team Name',
  description: '',
  teamType: 'team',
  picture: 'https://via.placeholder.com/40/5555555?text=T',
  members: [],
  managers: [],
  owners: [],
  relatedTeams: []
};

const Teams = props => {
  const [teams, setTeams] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showConfirmDeleteModal, setShowConfirmDeleteModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [emptyTeam, setEmptyTeam] = useState(false);
  const [toDelete, setToDelete] = useState();
  const [joinError, setJoinError] = useState(false);
  const [duplicateJoin, setDuplicateJoin] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [showSpinner, setShowSpinner] = useState(true);
  const {
    value: teamName,
    bind: bindTeamName,
    reset: resetTeamName
  } = useInput('');
  const {
    value: teamDescription,
    bind: bindTeamDescription,
    reset: resetTeamDescription
  } = useInput('');
  const { value: toJoin, bind: bindToJoin, reset: resetToJoin } = useInput('');
  document.title = 'Opus | Teams';

  useEffect(() => {
    async function fetchTeams() {
      const request = await api.get(urls.user.fetchTeams(props.userInfo.id));
      let teamIds = teams.map(team => {
        return team.id;
      });
      let requestIds = new Set(
        request.data.map(team => {
          return team.id;
        })
      );
      for (let id of teamIds) {
        if (!requestIds.has(id)) {
          setTeams(request.data);
          break;
        }
      }
      for (let id of requestIds) {
        if (!teamIds.includes(id)) {
          setTeams(request.data);
          break;
        }
      }
      setShowSpinner(false);
    }
    try {
      fetchTeams();
    } catch (err) {
      <Redirect to="/404" />;
    }
  }, [props.userInfo.id, teams]);

  function handleDelete(toDelete) {
    setToDelete(toDelete);
    setEmptyTeam(false);
    setShowConfirmDeleteModal(true);
  }

  async function deleteTeam(teamID) {
    await api.delete(urls.teams.fetchById(teamID));
    let newTeams = teams.filter(team => {
      return team.id !== teamID;
    });
    props.updateTeams(newTeams);
    setTeams(newTeams);
  }

  async function createTeam() {
    setCreateError(false);
    let teamsRequest = await api.get(urls.teams.fetchAll());
    let allTeams = teamsRequest.data;
    let duplicateCreate = false;
    for (let team of allTeams) {
      if (team.name === teamName) {
        duplicateCreate = true;
        break;
      }
    }
    if (!duplicateCreate) {
      setCreateError(false);
      setShowCreateModal(false);
      let response = await api.post(
        urls.teams.fetchAll(),
        createFormPlaceholderData
      );
      let newTeams = teams.concat(response.data);
      props.updateTeams(newTeams);
      setTeams(newTeams);
      resetTeamName();
      resetTeamDescription();
    }
    else {
      setCreateError(true);
    }
  }

  async function handleJoin() {
    // Don't let a user join a team that they're already in
    let teamNames = teams.map(team => {
      return team.name;
    });
    if (teamNames.includes(toJoin)) {
      setDuplicateJoin(true);
      setJoinError(false);
    } else {
      setDuplicateJoin(false);
      let teamRequest = await api.get(urls.teams.fetchAll());
      let toJoinObject;
      for (let team of teamRequest.data) {
        if (team.name === toJoin) {
          toJoinObject = team;
          break;
        }
      }
      if (toJoinObject) {
        let toPut = toJoinObject;
        ['members', 'managers', 'owners'].forEach(level => {
          toPut[level] = toJoinObject[level].map(user => {
            return user.id;
          });
        });
        toPut.members.push(props.userInfo.id);
        let putRequest = await api.put(
          urls.teams.fetchById(toJoinObject.id),
          toPut
        );
        let newTeams = teams;
        newTeams.push(putRequest.data);
        setTeams(newTeams);
        props.updateTeams(newTeams);
        handleCloseJoin();
      } else {
        setJoinError(true);
      }
    }
  }

  function handleCloseJoin() {
    setShowJoinModal(false);
    resetToJoin();
    setJoinError(false);
    setDuplicateJoin(false);
  }

  const handleSubmit = () => {
    createFormPlaceholderData.name = teamName;
    createFormPlaceholderData.description = teamDescription;
    createFormPlaceholderData.owners = [props.userInfo.id];
    createTeam();
  };

  async function handleLeave(teamToLeave) {
    for (let type of ['members', 'managers', 'owners']) {
      let group = teamToLeave[type].map(user => {
        return user.id;
      });
      if (group.includes(props.userInfo.id)) {
        group = group.filter(id => {
          return id !== props.userInfo.id;
        });
      }
      teamToLeave[type] = group;
    }

    if (
      !teamToLeave.members.length &&
      !teamToLeave.managers.length &&
      !teamToLeave.owners.length
    ) {
      // Team is empty, and will be deleted if the user leaves
      setToDelete(teamToLeave);
      setEmptyTeam(true);
      setShowConfirmDeleteModal(true);
    } else {
      // Team contains other members, so remove the team from the user's list and update the backend
      await api.put(urls.teams.fetchById(teamToLeave.id), teamToLeave);
      let newTeams = teams.filter(team => {
        return team.id !== teamToLeave.id;
      });
      props.updateTeams(newTeams);
      setTeams(newTeams);
    }
  }

  let createTeamModal = (
    <Modal
      show={showCreateModal}
      onHide={() => {
        setCreateError(false);
        setShowCreateModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Create a New Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId='teamName'>
                <Form.Label>Team Name</Form.Label>
                <Form.Control type="text" {...bindTeamName} />
              </Form.Group>
              <Form.Group controlId='description'>
                <Form.Label>Description</Form.Label>
                <Form.Control type="text" {...bindTeamDescription} />
              </Form.Group>
              <Alert hidden={!createError} variant='danger'>{`A team with this name already exists. If you'd like, you may join it instead.`}</Alert>
              <Button
                onClick={() => {
                  handleSubmit();
                }}
              >
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );

  let joinTeamModal = (
    <Modal
      show={showJoinModal}
      onHide={() => {
        handleCloseJoin();
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Join a Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Row>
            <Col>
              <Form.Group controlId='toJoin'>
                <Form.Label>Team Name</Form.Label>
                <Form.Control type="text" {...bindToJoin} />
              </Form.Group>
              <small>(Try joining CS491)</small>
            </Col>
          </Row>
        </Form>
        <Alert
          hidden={!joinError}
          variant="danger"
        >{`No team exists with the name you specified. Please check your spelling and try again.`}</Alert>
        <Alert
          hidden={!duplicateJoin}
          variant="danger"
        >{`You're already a member of this team!`}</Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => {handleJoin()}}>
          Submit
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            handleCloseJoin();
          }}
        >
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );

  let confirmDeleteModal = (
    <Modal
      show={showConfirmDeleteModal}
      onHide={() => {
        setShowConfirmDeleteModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5>This will delete the team permanently! Do you want to proceed?</h5>
        <small>
          {emptyTeam
            ? 'You are seeing this message because you are the only member in this team.'
            : ''}
        </small>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setShowConfirmDeleteModal(false);
            setEmptyTeam(false);
            setToDelete();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={() => {
            deleteTeam(toDelete.id);
          }}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );

  let teamsView = (
    <ul>
      {teams.map((item, index) => {
        return (
          <div key={index} className="team-element">
            <li className="col-12 d-flex width-full border-bottom color-border-secondary">
              <Col md={1} lg={1} className="d-flex justify-content-center">
                <Link
                  to={{
                    pathname: `/teams/${item.name}`,
                    state: { teamId: item.id }
                  }}
                >
                  <img
                    className="team-photo avatar"
                    alt="Team logo"
                    src={`https://via.placeholder.com/40/555555/FFFFFF?text=${item.name[0].toUpperCase()}`}
                  />
                </Link>
              </Col>
              <Col md={10} lg={9}>
                <Row>
                  <div className="d-inline-block mb-1">
                    <h4 className="wb-break-all">
                      <Link
                        to={{
                          pathname: `teams/${item.name}`,
                          state: { teamId: item.id }
                        }}
                      >
                        {item.name}
                      </Link>
                    </h4>
                  </div>
                </Row>
                <Row className="small">{item.description}</Row>
              </Col>
              <Col md={1} lg={1} className="text-right">
                <div className="d-inline-block mb-1">
                  <Dropdown>
                    <Dropdown.Toggle variant="small primary" data-testid={`dropdown${item.id}`}>
                      <Icon.FiSettings />
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <Dropdown.Item
                        onClick={() => {
                          handleLeave(item);
                        }}
                      >
                        Leave
                      </Dropdown.Item>
                      <Dropdown.Item
                        onClick={() => {
                          handleDelete(item);
                        }}
                      >
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </Col>
            </li>
          </div>
        );
      })}
    </ul>
  );

  return (
    <Container fluid>
      <Jumbotron>
        <h1>
          Teams
          <OverlayTrigger
            overlay={<Tooltip>Teams enable collaboration between members.
              Upon joining or creating a team, you will be able to see that team's announcements, events, and members.
            </Tooltip>}
            placement={'right'}
          >
            <Icon.FiHelpCircle size={20} style={{'marginLeft': '5px'}} />
          </OverlayTrigger>
        </h1>
        <p>
          View or modify your current teams. Create or join a new team.{' '}
          <Link to="/docs">Need more info? Read the docs.</Link>
        </p>
        <div>
          <Button
            variant="primary"
            onClick={() => {
              setShowCreateModal(true);
            }}
          >
            <Icon.FiPlusCircle /> Create Team
          </Button>
          <Button
            style={{ marginLeft: '5px' }}
            onClick={() => {
              setShowJoinModal(true);
            }}
          >
            <Icon.FiUsers /> Join Team
          </Button>
        </div>
      </Jumbotron>
      <Col sm={12} md={{ span: 10, offset: 1 }}>
        {createTeamModal}
        {confirmDeleteModal}
        {joinTeamModal}

        <Container className="teams-container">
          {showSpinner ? (
            <div className="text-center">
              <Spinner animation="border" role="status" />
            </div>
          ) : (
            <></>
          )}
          {teams[0] ? teamsView : <></>}
          {!showSpinner && !teams[0] ? (
            <p className="text-center">
              You aren't in any teams right now. Create or join one!
            </p>
          ) : (
            <></>
          )}
        </Container>
      </Col>
    </Container>
  );
};

export default Teams;
