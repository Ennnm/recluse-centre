import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { io } from 'socket.io-client';
import { SocketContext, socket } from '../contexts/sockets.mjs';

// auth pages

import Login from '../components/Login/LoginPage.jsx';
import Register from '../components/Register/RegisterPage.jsx';
// main pages
import GridElem from '../components/World/Grid.jsx';
// error pages
import Error404 from '../components/Error/Error404Page.jsx';
// others
import EditWorld from '../components/World/EditWorld.jsx';

export const ContextRoute = ({ contextComponent, component, ...rest }) => {
  const { Provider } = contextComponent;
  const Component = component;

  return (
    <Route {...rest}>
      <Provider value={socket}>
        <Component />
      </Provider>
    </Route>
  );
};

function Grid() {
  return (
    <div className="pt-5">
      <h1>Hello Grid</h1>
      <GridElem socket={{ socket }} />
    </div>
  );
}

// eslint-disable-next-line react/prop-types
export default function Routes({ isLoggedOut }) {
  return (
    <Router>
      <Switch>
        <ContextRoute
          exact
          path={['/', '/home', '/main']}
          contextComponent={SocketContext}
          component={Grid}
        />
        <Route path="/edit" component={EditWorld} />
        <Route path="/signup" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/sessionexpired" render={() => <Login sessionExpired />} />
        <Route path="*" component={Error404} />
      </Switch>
      {isLoggedOut && <Redirect to="/login" />}
    </Router>
  );
}
