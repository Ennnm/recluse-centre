import React from 'react';
import {
  BrowserRouter as Router, Switch, Route, Redirect,
} from 'react-router-dom';

// auth pages
import Login from '../components/Login/LoginPage.jsx';
import Register from '../components/Register/RegisterPage.jsx';
// main pages
import GridElem from '../components/World/Grid.jsx';
// error pages
import Error404 from '../components/Error/Error404Page.jsx';
// others
import EditWorld from '../components/World/EditWorld.jsx';

function Grid() {
  return (
    <div className="pt-5">
      <h1>Hello Grid</h1>
      <GridElem />
    </div>
  );
}

// eslint-disable-next-line react/prop-types
export default function Routes({ isLoggedOut }) {
  return (
    <Router>
      <Switch>
        <Route exact path={['/', '/home', '/main']} component={Grid} />
        <Route path="/edit" component={EditWorld} />
        <Route path="/signup" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/sessionexpired" render={() => (<Login sessionExpired />)} />
        <Route path="*" component={Error404} />
      </Switch>
      {isLoggedOut && (<Redirect to="/login" />)}
    </Router>
  );
}
