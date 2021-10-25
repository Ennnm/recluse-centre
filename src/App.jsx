import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

// auth pages
import LoginPage from './components/Login/LoginPage.jsx';
import RegisterPage from './components/Register/RegisterPage.jsx';
// main pages
import GridElem from './components/grid.jsx';
// error pages
import Error404Page from './components/Error/Error404Page.jsx';

function Grid() {
  return (
    <div>
      <h1>Hello Jia En?</h1>
      <GridElem />
    </div>
  );
}

function Login() {
  return (
    <LoginPage />
  );
}

function Register() {
  return (
    <RegisterPage />
  );
}

function Error404() {
  return (
    <Error404Page />
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
