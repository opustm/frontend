import { API_CONFIG as api } from './api.service';

const API_HOST = api.baseURL();

export default class AuthService {
  async login(data) {
    data = {
      username: data.username,
      password: data.password
    };
    let state;
    await fetch(API_HOST + 'tokenAuth/', {
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
          localStorage.setItem('user', json.user.username);
          state = {
            ...json.user,
            logged_in: true,
            loginError: false
          };
        } else {
          state = {
            logged_in: false,
            loginError: true
          };
        }
      });
    return state;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  async signup(data) {
    let state;
    await fetch(API_HOST + 'register/', {
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
          username: json.username,
          first_name: json.first_name,
          loginError: false
        };
      });

    return state;
  }

  async getCurrentUser(token) {
    let state;
    await fetch(API_HOST + 'currentUser/', {
      headers: {
        Authorization: `JWT ${token}`
      }
    })
      .then(res => res.json())
      .then(json => {
        state = {
          ...json,
          logged_in: true
        };
      });

    return state;
  }
}
