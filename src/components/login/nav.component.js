import React from 'react';
import "../../stylesheets/Nav.css"

function Nav(props) {
  const logged_out_nav = (
    <div>
      <ul>
        <button className='navButton' onClick={() => props.display_form('login')}>Login</button>
        <button className='navButton' onClick={() => props.display_form('signup')}>Signup</button>
      </ul>
    </div>
  );

  const logged_in_nav = (
    <ul>
      <button onClick={props.handle_logout}>Logout</button>
    </ul>
  );
  return <div id='loginDiv'>{props.logged_in ? logged_in_nav : logged_out_nav}</div>;
}

export default Nav;