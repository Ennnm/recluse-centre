import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// auth pages
import Login from './components/Login/LoginPage.jsx';
import Register from './components/Register/RegisterPage.jsx';
// main pages
import GridElem from './components/grid.jsx';
// error pages
import Error404 from './components/Error/Error404Page.jsx';

function Grid() {
  return (
    <>
      <h1>Hello Jia En?</h1>
      <GridElem />
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path={['/', '/home', '/main']} component={Grid} />
        <Route path="/register" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="*" component={Error404} />
      </Switch>
    </Router>
  );
}
