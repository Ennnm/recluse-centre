import React, { useState } from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';
import axios from 'axios';

// component partials
import Navbar from './components/Navbar/Navbar.jsx';

// auth pages
import Login from './components/Login/LoginPage.jsx';
import Register from './components/Register/RegisterPage.jsx';
// main pages
import GridElem from './components/World/Grid.jsx';
// error pages
import Error404 from './components/Error/Error404Page.jsx';

import EditWorld from './components/World/EditWorld.jsx';

function Grid() {
  return (
    <div className="pt-5">
      <h1>Hello Grid</h1>
      <GridElem />
    </div>
  );
}

export default function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleLogoutSubmit = (event) => {
    event.preventDefault();

    axios
      .delete('/logout')
      .then((response) => {
        if (response.data.error) {
          console.log('logout error:', response.data.error);
        } else {
          setIsLoggedOut(true);
        }
      })
      .catch((error) => {
        // handle error
        console.log('logout error:', error);
      });
  };

  return (
    <Router>
      <Navbar handleLogoutSubmit={handleLogoutSubmit} />
      <Switch>
        <Route exact path={['/', '/home', '/main']} component={Grid} />
        <Route path="/edit" component={EditWorld} />
        <Route path="/signup" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="*" component={Error404} />
      </Switch>
      {isLoggedOut && (<Redirect to="/login" />)}
    </Router>
  );
}
