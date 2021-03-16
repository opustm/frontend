import React, {useState} from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './stylesheets/App.css'
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';

// Services
import AuthService from './services/auth.service';
// import { AppData } from './services/data.service';

// Components
import Navigation from './components/Navigation/navigation.component';

// Pages
import Login from './Pages/Login';
import About from './Pages/About';
import Home from './Pages/Home';
import Error from './Pages/NotFound';
import Profile from './Pages/Profile';

// Apps
import Teams from './apps/Teams/Teams';
import TeamView from './apps/Teams/TeamView';
import TeamSettings from './apps/Teams/TeamSettings';
import Calendar from './apps/Calendar/Calendar';
import Scheduler from './apps/Scheduler/Scheduler';
import Chat from './apps/Chat/Chat';
import Contacts from './apps/Contacts/Contacts';
import Announcements from './apps/Announcements/Announcements';

// Main Application
export default function App() {
  let authService = new AuthService();
  let [loggedIn, setLoggedIn] = useState(false);
  let [sidebarToggled,setSidebar] = useState(true)
  let [userData, setUserData] = useState({noUser: 'notLoggedIn'});
  let [userTeams, setUserTeams] = useState([]);
  
  let handleLoginChange = async (isLoggedIn) => {
    if (!isLoggedIn) {
      authService.logout();
    }
    await getUserData();
    setLoggedIn(isLoggedIn);
  }

  let getUserData = async () => {
    let userToken = localStorage.getItem('token');
    if (userToken) {
      let data = await authService.getCurrentUser(userToken);
      setUserData(data);
    }
  }

  let updateTeams = (newTeams) => {
    setUserTeams(newTeams);
  }

  let teamViewUpdate = (teamToRemove) => {
    let newTeams = userTeams.filter((team) => {return team.id !== teamToRemove});
    setUserTeams(newTeams);
  }

    return (
      // React Dynamic Routing
      <Router>
        {loggedIn ? 
          <Navigation 
            sidebar={sidebarToggled}
            setSidebar={setSidebar}
            onLoggedInChange={handleLoginChange}
            userTeams={userTeams}
            userInfo={userData}/> : <></>
          }
        <Switch>
            <Route path="/login">
              {loggedIn ? <Redirect to='/' /> : <Login loggedIn={loggedIn} onLoggedInChange={handleLoginChange}/>}
            </Route>
            <Route path="/about" exact component={About}/>
            <Route path="/404" exact component={Error}/>
          {loggedIn ? 
            <div className={sidebarToggled? "page sidebar-toggled":"page"}>
              <Route path="/" exact component={() => {return <Home userInfo={userData}/>}}/>
              <Route path="/calendar/:teamUsername?" exact component={(props) => {return <Calendar {...props} userInfo={userData}/>}}/>
              <Route path="/scheduler" exact component={Scheduler}/>
              <Route path="/teams" exact component={(props) => {return <Teams userInfo={userData} updateTeams={updateTeams}/>}}/>
              <Route path="/chat" exact component={Chat}/>
              <Route path="/contacts" exact component={() => {return <Contacts userInfo={userData}/>}}/>
              <Route path="/announcements/:teamUsername?" exact component={(props) => {return <Announcements {...props} userInfo={userData}/>}}/>
              <Route path="/user/:username" component={(props) => {return <Profile {...props} userInfo={userData} />}}/>
              <Route path="/teams/:teamUsername/settings" exact component={TeamSettings}/>
              <Route path="/teams/:teamUsername" exact component={(props) => {return <TeamView userInfo={userData} updateTeams={teamViewUpdate}/>}}/>
            </div>
            : <Redirect to='/about' />
          }
        </Switch>
      </Router>
    );
  }
  
