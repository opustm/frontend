import React from 'react';

class SignUpForm extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    picture: 'default',
    theme: 'lightMode'
  };

  handle_change = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState(prevstate => {
      const newState = { ...prevstate };
      newState[name] = value;
      return newState;
    });
  };

  render() {
    return (
      <form onSubmit={e => this.props.handle_signup(e, this.state)}>
        <h4>Sign Up</h4>
        <label htmlFor="username">Username
          <input
            type="text"
            name="username"
            value={this.state.username}
            onChange={this.handle_change}
          />
        </label>
        <label htmlFor="password">Password
          <input
            type="password"
            name="password"
            value={this.state.password}
            onChange={this.handle_change}
          />
        </label>
        <label htmlFor="username">Email
          <input
            type="email"
            name="email"
            value={this.state.email}
            onChange={this.handle_change}
          />
        </label>
        <label htmlFor="first_name">First Name
          <input
            type="text"
            name="first_name"
            value={this.state.first_name}
            onChange={this.handle_change}
          />
        </label>
        <label htmlFor="last_name">Last Name
          <input
            type="text"
            name="last_name"
            value={this.state.last_name}
            onChange={this.handle_change}
          />
        </label>
        <label htmlFor="phone">Phone Number
          <input
            type="number"
            name="phone"
            value={this.state.phone}
            onChange={this.handle_change}
          />
        </label>
        <p>
          <input type="submit" />
        </p>
      </form>
    );
  }
}

export default SignUpForm;