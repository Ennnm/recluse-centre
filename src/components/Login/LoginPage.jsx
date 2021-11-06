import React, { useState } from 'react';
import { useLocation, Redirect } from 'react-router-dom';
import axios from 'axios';
// Custom imports
import * as successes from '../../modules/successes.mjs';
import * as errors from '../../modules/errors.mjs';
import * as cookie from '../../modules/cookie.mjs';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

// eslint-disable-next-line react/prop-types
function GlobalLoginErrorAlert({ errorMessage }) {
  // eslint-disable-next-line react/prop-types
  if (errorMessage.trim() !== '') {
    return (
      <div className="col-12">
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      </div>
    );
  }

  return null;
}

// eslint-disable-next-line react/prop-types
export default function LoginPage({ sessionExpired, socket }) {
  const query = useQuery();
  const [isLoggedIn, setIsLoggedIn] = useState(cookie.hasLoginCookie());
  const [globalErrorMessage, setGlobalErrorMessage] = useState(
    sessionExpired ? errors.SESSION_EXPIRED_ERROR_MESSAGE : '',
  );
  const [usernameInvalidMessage, setUsernameInvalidMessage] = useState('');
  const [passwordInvalidMessage, setPasswordInvalidMessage] = useState('');

  const [username, setUsername] = useState(query.get('username') || '');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setUsername(inputName);
  };

  const handlePasswordChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setPassword(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let usernameInvalid = '';
    let passwordInvalid = '';

    const data = {
      username,
      password,
    };

    axios
      .post('/login', data)
      .then((response) => {
        if (response.data.error) {
          window.scrollTo(0, 0);

          if (
            response.data.error === errors.LOGIN_INPUT_VALIDATION_ERROR_MESSAGE
          ) {
            if (response.data.username_invalid) {
              usernameInvalid = response.data.username_invalid;
            }

            if (response.data.password_invalid) {
              passwordInvalid = response.data.password_invalid;
            }
          }

          setUsernameInvalidMessage(usernameInvalid);
          setPasswordInvalidMessage(passwordInvalid);
          setGlobalErrorMessage(errors.LOGIN_GLOBAL_ERROR_MESSAGE);
        } else {
          setIsLoggedIn(true);
        }
      })
      .catch(() => {
        // handle error
        window.scrollTo(0, 0);
        setGlobalErrorMessage(errors.LOGIN_GLOBAL_ERROR_MESSAGE);
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <p className="mb-0">
            <a className="text-blue-300 hover:text-blue-400 hover:underline" href="/">
              <small>« Back to Home</small>
            </a>
          </p>
          <hr />
        </div>
        <div className="col-12 py-3">
          <form>
            <div className="row">
              <div className="col-12">
                <h3 className="mb-3 index-header font-bold text-lg text-white">Log In</h3>
              </div>
              <div className="col-12">
                <p className="mb-3 text-blue-50">
                  Do not have an account yet? Register
                  {' '}
                  <a className="text-blue-300 hover:text-blue-400 hover:underline" href="/signup">here</a>
                  .
                </p>
              </div>
              <RegisterSuccessAlert
                success={query.get('registersuccess')}
                error={globalErrorMessage.trim() !== ''}
              />
              <GlobalLoginErrorAlert errorMessage={globalErrorMessage} />
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="userName">
                  <strong className="text-blue-50">Username</strong>
                </label>
                <input
                  type="text"
                  className={`form-control${
                    usernameInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                  }`}
                  id="userName"
                  name="username"
                  placeholder="e.g. chee_kean"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="invalid-feedback text-red-300">{usernameInvalidMessage}</div>
              </div>
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="password">
                  <strong className="text-blue-50">Password</strong>
                </label>
                <input
                  type="password"
                  className={`form-control${
                    passwordInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                  }`}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="invalid-feedback text-red-300">{passwordInvalidMessage}</div>
              </div>
            </div>
            <hr className="mb-4" />
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              onClick={handleSubmit}
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function RegisterSuccessAlert({ success, error }) {
  if (success === 'true' && !error) {
    return (
      <div className="col-12">
        <div className="alert alert-success" role="alert">
          {successes.LOGIN_REGISTER_SUCCESS_MESSAGE}
        </div>
      </div>
    );
  }

  return null;
}
