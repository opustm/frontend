import React, {Component} from 'react';
import Navbar from './navbar.component';
import { Container, Button } from 'react-bootstrap';
import APIHost from '../services/api.service';

const API_HOST = APIHost();
const axios = require('axios').default;

export default class Profile extends Component {

  getUserData() {
    let userRoute = API_HOST + 'main/users/';
    axios.get(userRoute, {
      params: {
        id: 1
      }
    }).then((response) => {
      console.log(response);
    })
  }

  render() {
    console.log(this.props);
    return (
      <Container>
        <Navbar />
        <div>
          <p>Hello</p>
          <p>User Id is {this.props.match.params.userID}</p>
        </div>
        <Button onClick={this.getUserData}>Summon the API God</Button>
      </Container>
      // <Container>
      //   <Navbar></Navbar>
      //   <div>
      //     <p>{this.props.userData.username}</p>
      //     <p>{this.props.userData.firstName}</p>
      //     <p>{this.props.userData.lastName}</p>
      //   </div>
      // </Container>
    )
  }
}