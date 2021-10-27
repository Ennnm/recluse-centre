import React, { useState } from 'react';
import {
  useLocation,
} from 'react-router-dom';
// Custom imports
import * as successes from '../../modules/successes.mjs';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function LoginPage() {
  const query = useQuery();
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

  return (
    <div className="container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1">
          <p className="mb-0">
            <a href="/"><small>« Back to Home</small></a>
          </p>
          <hr />
        </div>
        <div className="col-12 py-3">
          <form>
            <div className="row">
              <div className="col-12">
                <h4 className="mb-3 index-header">Log In</h4>
              </div>
              <div className="col-12">
                <p className="mb-3">
                  Do not have an account yet? Register
                  {' '}
                  <a href="/signup">here.</a>
                </p>
              </div>
              <RegisterSuccessAlert success={query.get('registersuccess')} />
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  Some error message
                </div>
              </div>
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="userName">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  className="form-control is-invalid"
                  id="userName"
                  name="username"
                  placeholder="e.g. chee_kean"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="invalid-feedback">Username invalid feedback</div>
              </div>
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="password">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  className="form-control is-invalid"
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="invalid-feedback">Password invalid feedback</div>
              </div>
            </div>
            <hr className="mb-4" />
            <button className="btn btn-primary btn-lg btn-block" type="submit">
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// eslint-disable-next-line react/prop-types
function RegisterSuccessAlert({ success }) {
  if (success === 'true') {
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
