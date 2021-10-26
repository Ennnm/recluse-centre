import React, { useState } from 'react';
import axios from 'axios';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [realname, setRealname] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setUsername(inputName);
  };

  const handleRealnameChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setRealname(inputName);
  };

  const handlePasswordChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setPassword(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const data = {
      realName: realname,
      username,
      password,
    };

    axios
      .post('/signup', data)
      .then((response) => {
        // handle success
        console.log('is success');
        console.log(response);
      })
      .catch((error) => {
        // handle error
        console.log('is error');
        console.log(error);
      });
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
                <h4 className="mb-3 index-header">Register</h4>
              </div>
              <div className="col-12">
                <p className="mb-3">
                  Already have an account? Log in
                  {' '}
                  <a href="/login">here.</a>
                </p>
              </div>
              <div className="col-12">
                <div className="alert alert-danger" role="alert">
                  Test
                </div>
              </div>
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="userName">
                  <strong>Username</strong>
                </label>
                <input
                  type="text"
                  className="
                    form-control
                    is-invalid
                  "
                  id="userName"
                  name="username"
                  placeholder="e.g. chee_kean"
                  value={username}
                  onChange={handleUsernameChange}
                />
                <div className="invalid-feedback">Test</div>
              </div>
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="realName">
                  <strong>Real Name</strong>
                </label>
                <input
                  type="text"
                  className="
                    form-control
                    is-invalid
                  "
                  id="realName"
                  name="realname"
                  placeholder="e.g. Chee Kean"
                  value={realname}
                  onChange={handleRealnameChange}
                />
                <div className="invalid-feedback">Test</div>
              </div>
              <div className="col-12 mb-3">
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                <label htmlFor="password">
                  <strong>Password</strong>
                </label>
                <input
                  type="password"
                  className="
                    form-control
                    is-invalid
                  "
                  id="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <div className="invalid-feedback">Test</div>
              </div>
            </div>
            <hr className="mb-4" />
            <button className="btn btn-primary btn-lg btn-block" type="submit" onClick={handleSubmit}>
              Register
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
