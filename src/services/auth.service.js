import APIHost from './api.service';

const API_HOST = APIHost();

export default class AuthService {
  async login(data) {
    let state;
    await fetch(API_HOST+'token-auth/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      if (json.user) {
        localStorage.setItem('token', json.token);
        state = {
          logged_in: true,
          displayed_form: '',
          username: json.user.username,
          first_name: json.user.first_name,
          loginError: false
        }
      }
      else {
        state = {
          logged_in: false,
          displayed_form: 'login',
          loginError: true
        }
      }
    });
    return state;
  }

  logout() {
    localStorage.removeItem('token');
  }

  async signup(data) {
    let state;
    await fetch(API_HOST+'main/users/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(json => {
      localStorage.setItem('token', json.token);
      state = {
        logged_in: true,
        displayed_form: '',
        username: json.username,
        first_name: json.first_name,
        loginError: false
      };
    });

    return state;
  }

}