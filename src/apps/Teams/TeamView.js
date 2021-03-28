import React, { useState, useEffect } from 'react';
import {
  Axios as api,
  API_ENDPOINTS as urls
} from '../../services/api.service';
import { useInput } from '../../services/forms.service';
import {
  Container,
  Modal,
  Card,
  ListGroup,
  Dropdown,
  Button,
  Row,
  Col,
  Jumbotron,
  Image,
  Form
} from 'react-bootstrap';
import {
  Link,
  Redirect,
  useParams,
  useLocation,
  useHistory
} from 'react-router-dom';
import * as Icon from 'react-icons/fi';
import Widget from '../../components/Widget/widget.component';
import './teams.css';

const TeamView = props => {
  const [details, setDetails] = useState();
  const [members, setMembers] = useState();
  const [groups, setGroups] = useState();
  const [showMemberInviteModal, setShowMemberInviteModal] = useState(false);
  const {
    value: inviteeUsername,
    bind: bindInviteeUsername,
    reset: resetInviteeUsername
  } = useInput('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [aboutToDelete, setAboutToDelete] = useState();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGroupName, setNewGroupName] = useState();
  let history = useHistory();
  let teamUsername = useParams().teamUsername;
  let teamId = useLocation().state.teamId;
  document.title = `Opus | Team - ${teamUsername}`;

  useEffect(() => {
    async function fetchDetails() {
      const request = await api.get(urls.teams.fetchById(teamId));
      setDetails(request.data);
      let allMembers = request.data.members.concat(
        request.data.managers.concat(request.data.owners)
      );
      setMembers(allMembers);
      return request;
    }

    try {
      fetchDetails();
      fetchMembers();
    } catch (err) {
      <Redirect to="/404" />;
    }
  }, [teamId]);

  async function inviteMember() {
    let userRequest = await api.get(urls.user.fetchAll());
    let allUsers = userRequest.data;
    let inviteeId;
    for (let user of allUsers) {
      if (user.username === inviteeUsername) {
        inviteeId = user.id;
        break;
      }
    }
    let newMembers = details.members.map(member => {
      return member.id;
    });
    let managerIds = details.managers.map(manager => {
      return manager.id;
    });
    let ownerIds = details.owners.map(owner => {
      return owner.id;
    });
    newMembers.push(inviteeId);
    let newTeamBody = {
      ...details,
      members: newMembers,
      managers: managerIds,
      owners: ownerIds
    };
    let addUserRequest = await api.put(
      urls.teams.fetchById(teamId),
      newTeamBody
    );
    let responseData = addUserRequest.data;
    setDetails(responseData);
    let allMembers = responseData.members.concat(
      responseData.managers.concat(responseData.owners)
    );
    setMembers(allMembers);
  }

  async function removeMember(toRemove) {
    let teamRequest = await api.get(urls.teams.fetchById(teamId));
    let team = teamRequest.data;
    let levels = ['members', 'managers', 'owners'];
    // Filter out the member that's being removed, then map the objects to IDs so that we can make a put request.
    levels.forEach(level => {
      team[level] = team[level]
        .filter(member => {
          return member.id !== toRemove;
        })
        .map(memberObj => {
          return memberObj.id;
        });
    });
    let putResponse = await api.put(urls.teams.fetchById(teamId), team);
    let newData = putResponse.data;
    setDetails(newData);
    let allMembers = newData.members.concat(
      newData.managers.concat(newData.owners)
    );
    setMembers(allMembers);
    // Need to update the navbar if a user removes themselves
    if (toRemove === props.userInfo.id) {
      props.updateTeams(details.id);
      // Delete the team if it's empty. Should give a warning like on the Teams page but I don't want to copy/paste right now.
      if (
        details.members.length +
          details.managers.length +
          details.owners.length <=
        1
      ) {
        await api.delete(urls.teams.fetchById(details.id));
      }
      history.push('/teams');
    }
  }

  const handleSubmit = evt => {
    evt.preventDefault();
    // inviteMemberModalPlaceholder.username = inviteeUsername;
    inviteMember();
    resetInviteeUsername();
  };

  let memberInviteModal = (
    <Modal
      show={showMemberInviteModal}
      onHide={() => {
        setShowMemberInviteModal(false);
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Add a Member</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col>
              <Form.Group controlId="usernameInput">
                <Form.Label>Enter username</Form.Label>
                <Form.Control type="text" {...bindInviteeUsername} />
              </Form.Group>
              <Button
                type="submit"
                variant="success"
                onClick={() => {
                  setShowMemberInviteModal(false);
                }}
              >
                Invite Member
              </Button>
            </Col>
          </Row>
        </Form>
      </Modal.Body>
    </Modal>
  );

  const confirmDelete = groupIdToDelete => {
    setAboutToDelete(groupIdToDelete);
    setShowConfirmModal(true);
  };

  const deleteTeam = async groupIdToDelete => {
    await api.delete(urls.teams.fetchById(groupIdToDelete));
    // If this is true, we're deleting the whole team
    if (groupIdToDelete === details.id) {
      props.updateTeams(details.id);
      history.push('/teams');
    } else {
      setShowConfirmModal(false);
      let newGroups = groups.filter(group => {
        return groupIdToDelete !== group.id;
      });
      setGroups(newGroups);
    }
  };

  const createSubgroup = async () => {
    let body = {
      name: newGroupName,
      workspace: 'irrelevant',
      cliqueType: 'sub',
      picture: 'null.jpeg',
      displayName: newGroupName,
      permissions: [],
      relatedCliques: [details.id]
    };
    setShowCreateModal(false);
    let response = await api.post(urls.teams.fetchAll(), body);
    body['id'] = response.data.id;
    let newGroups = groups;
    newGroups.push(body);
    setGroups(newGroups);
    setNewGroupName('');
  };

  return (
    <Container fluid>
      <Modal
        show={showConfirmModal}
        onHide={() => {
          setShowConfirmModal(false);
        }}
      >
        <Modal.Header>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            {details
              ? aboutToDelete === details.id
                ? `Please confirm that you wish to delete team "${details.name}"`
                : 'Please confirm that you wish to delete this subgroup.'
              : ''}
          </p>
          <small>(This action cannot be undone)</small>
        </Modal.Body>
        <Modal.Footer>
          <Container>
            <Button
              variant="secondary"
              onClick={() => {
                setShowConfirmModal(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                deleteTeam(aboutToDelete);
              }}
            >
              Delete Team
            </Button>
          </Container>
        </Modal.Footer>
      </Modal>

      <Modal
        show={showCreateModal}
        onHide={() => {
          setShowCreateModal(false);
        }}
      >
        <Modal.Header>Create New Subgroup</Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={newGroupName}
                onChange={e => {
                  setNewGroupName(e.target.value);
                }}
              ></Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowCreateModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              createSubgroup();
            }}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      <Col sm={12} md={{ span: 10, offset: 1 }}>
        {memberInviteModal}
        <Jumbotron>
          <Row>
            <Col md={3} lg={2} className="text-center">
              <Image
                roundedCircle
                src={`https://via.placeholder.com/80/18BC9C/FFFFFF?text=${
                  details ? details.name[0].toUpperCase() : ''
                }`}
                alt="Team Profile"
              />
            </Col>
            <Col md={9} lg={10}>
              <div className="team-view-title">
                <h1>{details ? details.name : null} </h1>
                <p>{details ? details.description : ''}</p>
              </div>

              <Row>
                <Col>
                  <Button
                    variant="success"
                    onClick={() => {
                      setShowMemberInviteModal(true);
                    }}
                  >
                    <Icon.FiUserPlus /> Add Member
                  </Button>
                </Col>
                <Col className="text-right">
                  <div className="d-inline-block mb-1">
                    <Dropdown>
                      <Dropdown.Toggle variant="small primary" data-testid="teamSettings">
                        <Icon.FiSettings />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item
                          onClick={() => {
                            removeMember(props.userInfo.id);
                          }}
                        >
                          Leave
                        </Dropdown.Item>
                        <Dropdown.Item
                          onClick={() => {
                            confirmDelete(details.id);
                          }}
                        >
                          Delete
                        </Dropdown.Item>
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
                <Card.Header>Members</Card.Header>
                <Card.Body>
                  {members ? (
                    <div className="members-div">
                      <ListGroup>
                        {members.map((item, index) => {
                          return (
                            <ListGroup.Item
                              key={index}
                              className="member-element"
                            >
                              <Row>
                                <Col className="text-center" sm={4} md={4}>
                                  <Link
                                    to={{
                                      pathname: `/user/${item.username}`,
                                      state: { userId: item.id }
                                    }}
                                  >
                                    <Image
                                      roundedCircle
                                      src={`https://via.placeholder.com/40/AF34BB/FFFFFF?text=${
                                        item.first_name
                                          ? item.first_name[0].toUpperCase()
                                          : ''
                                      }`}
                                      alt="user profile"
                                    />
                                  </Link>
                                </Col>
                                <Col sm={6} md={6}>
                                  <Link
                                    to={{
                                      pathname: `/user/${item.username}`,
                                      state: { userId: item.id }
                                    }}
                                  >
                                    <p>
                                      {`${item.first_name} ${item.last_name}`}
                                    </p>
                                  </Link>
                                </Col>
                                <Col sm={2} md={2}>
                                  <Dropdown>
                                    <Dropdown.Toggle variant="small">
                                      <Icon.FiSettings />
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                      <Dropdown.Item
                                        onClick={() => {
                                          removeMember(item.id);
                                        }}
                                      >
                                        Remove
                                      </Dropdown.Item>
                                    </Dropdown.Menu>
                                  </Dropdown>
                                </Col>
                              </Row>
                            </ListGroup.Item>
                          );
                        })}
                      </ListGroup>
                    </div>
                  ) : (
                    <p>The team does not have any members yet</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
            <Col md={4} lg={4} sm={12}>
              <Card>
                <Card.Header>
                  Groups
                  <Icon.FiPlus
                    className="addIcon"
                    onClick={() => {
                      setShowCreateModal(true);
                    }}
                  />
                </Card.Header>
                <Card.Body className="text-center">
                  {groups ? (
                    <ListGroup>
                      {groups.map(group => {
                        return (
                          <ListGroup.Item className="d-flex justify-content-start">
                            <p>{group.name}</p>
                            <Dropdown>
                              <Dropdown.Toggle variant="small">
                                <Icon.FiSettings />
                              </Dropdown.Toggle>
                              <Dropdown.Menu>
                                <Dropdown.Item
                                  onClick={() => {
                                    confirmDelete(group.id);
                                  }}
                                >
                                  Remove
                                </Dropdown.Item>
                              </Dropdown.Menu>
                            </Dropdown>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  ) : (
                    <p>The team does not have any groups yet</p>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        <Row style={{ marginTop: '15px' }}>
          <Col>
            <Widget
              appTitle="calendar"
              userInfo={props.userInfo}
              teamDetails={details}
              teamId={teamId}
            ></Widget>
          </Col>
          <Col>
            <Widget
              appTitle="announcements"
              userInfo={props.userInfo}
              teamDetails={details}
              teamId={teamId}
            ></Widget>
          </Col>
        </Row>
      </Col>
    </Container>
  );
};

export default TeamView;
