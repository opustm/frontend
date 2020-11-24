import React, {Component} from 'react';
import Navbar from './navbar.component';
import { Container, Button } from 'react-bootstrap';
import APIHost from '../services/api.service';

const API_HOST = APIHost();
const axios = require('axios').default;

export default class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profileExists: false
    }
  }

  componentDidMount() {
    this.getUserData(this.props.match.params.userID);
  }

  getUserData(userID) {
    let userRoute = `http://localhost:8000/main/users/${userID}`;
    axios.get(userRoute).then((response) => {
      try {
        let data = response.data;
        this.setState({
          username: data.username,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          picture: data.picture,
          phone: data.phone,
          profileExists: true
        })
      }
      catch (error) {
        console.log(error);
        this.setState({
          profileExists: false
        })
      }
    })
  }

  render() {
    return (
      !this.state.profileExists ? 
      <Container>
        <Navbar></Navbar>
        <h2>Error: A user with this ID doesn't exist. Try again.</h2>
      </Container> :

      <Container>
        <Navbar />
        <div>
          <p>User Id is {this.props.match.params.userID}</p>
          <p>username: {this.state.username}</p>
          <p>first_name: {this.state.first_name}</p>
          <p>last_name: {this.state.last_name}</p>
          <p>email: {this.state.email}</p>
          <p>phone: {this.state.phone}</p>
        </div>
      </Container>
    )
  }
}