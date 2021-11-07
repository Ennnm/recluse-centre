/* eslint-disable react/prop-types, jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import axios from 'axios';
// Custom imports
import { getRandomColor } from '../../../utils.mjs';
import * as errors from '../../modules/errors.mjs';
import * as successes from '../../modules/successes.mjs';

function GlobalSettingsErrorAlert({ errorMessage }) {
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

function GlobalSettingsSuccessAlert({ successMessage }) {
  if (successMessage.trim() !== '') {
    return (
      <div className="col-12">
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      </div>
    );
  }

  return null;
}

export default function SettingsPage({
  prevRealName, prevUsername, prevDescription, userId,
}) {
  const [globalErrorMessage, setGlobalErrorMessage] = useState('');
  const [globalSuccessMessage, setGlobalSuccessMessage] = useState('');
  const [usernameInvalidMessage, setUsernameInvalidMessage] = useState('');
  const [nameInvalidMessage, setNameInvalidMessage] = useState('');
  const [descriptionInvalidMessage, setDescriptionInvalidMessage] = useState('');

  const [username, setUsername] = useState(prevUsername);
  const [realname, setRealname] = useState(prevRealName);
  const [description, setDescription] = useState(prevDescription);

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

  const handleDescriptionChange = (event) => {
    // Retrieve input field value from JS event object.
    const inputName = event.target.value;
    // Log input field value to verify what we typed.
    setDescription(inputName);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    let usernameInvalid = '';
    let nameInvalid = '';
    let descriptionInvalid = '';

    const data = {
      realName: realname,
      username,
      description,
    };

    axios
      .put(`/user/${userId}/update`, data)
      .then((response) => {
        if (response.data.error) {
          window.scrollTo(0, 0);

          if (response.data.error === errors.SETTINGS_INPUT_VALIDATION_ERROR_MESSAGE) {
            if (response.data.username_invalid) {
              usernameInvalid = response.data.username_invalid;
            }

            if (response.data.realname_invalid) {
              nameInvalid = response.data.realname_invalid;
            }

            if (response.data.description_invalid) {
              descriptionInvalid = response.data.description_invalid;
            }
          }

          setUsernameInvalidMessage(usernameInvalid);
          setNameInvalidMessage(nameInvalid);
          setDescriptionInvalidMessage(descriptionInvalid);
          setGlobalErrorMessage(errors.SETTINGS_GLOBAL_ERROR_MESSAGE);
          setGlobalSuccessMessage('');
        } else {
          window.scrollTo(0, 0);
          setGlobalErrorMessage('');
          setUsernameInvalidMessage('');
          setNameInvalidMessage('');
          setDescriptionInvalidMessage('');
          setGlobalSuccessMessage(successes.SETTINGS_SUCCESS_MESSAGE);
        }
      })
      .catch(() => {
        // handle error
        window.scrollTo(0, 0);
        setGlobalErrorMessage(errors.SETTINGS_GLOBAL_ERROR_MESSAGE);
      });
  };

  return (
    <div className="settings-container container-fluid pt-5">
      <div className="row w-100 pt-3">
        <div className="col-12 pt-1 py-3">
          <form>
            <div className="row">
              <div className="col-12">
                <h3 className="mb-3 index-header font-bold text-lg text-white">Settings</h3>
              </div>
              <GlobalSettingsErrorAlert errorMessage={globalErrorMessage} />
              <GlobalSettingsSuccessAlert successMessage={globalSuccessMessage} />
              <div className="row d-flex align-items-center">
                <div className="col-7 col-md-9 col-lg-10">
                  <div className="col-12 mb-3">
                    <label htmlFor="userName">
                      <strong className="text-blue-50">Username</strong>
                    </label>
                    <input
                      type="text"
                      className={
                    `form-control${
                      usernameInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                      id="userName"
                      name="username"
                      placeholder="e.g. chee_kean"
                      value={username}
                      onChange={handleUsernameChange}
                    />
                    <div className="invalid-feedback text-red-300">{usernameInvalidMessage}</div>
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="realName">
                      <strong className="text-blue-50">Real Name</strong>
                    </label>
                    <input
                      type="text"
                      className={
                    `form-control${
                      nameInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                      id="realName"
                      name="realname"
                      placeholder="e.g. Chee Kean"
                      value={realname}
                      onChange={handleRealnameChange}
                    />
                    <div className="invalid-feedback text-red-300">{nameInvalidMessage}</div>
                  </div>
                  <div className="col-12 mb-3">
                    <label htmlFor="description" className="text-blue-50">
                      <strong>Description</strong>
                      {' '}
                      (Tell us more about yourself!)
                    </label>
                    <textarea
                      className={
                    `form-control${
                      descriptionInvalidMessage.trim() !== '' ? ' is-invalid' : ''
                    }`
                  }
                      id="description"
                      name="text"
                      rows="4"
                      maxLength="640"
                      placeholder="eg. I enjoy long walks on the beach at sunset."
                      onChange={handleDescriptionChange}
                    >
                      {description}
                    </textarea>
                    <div className="invalid-feedback text-red-300">{descriptionInvalidMessage}</div>
                  </div>
                </div>
                <div className="col-5 col-md-3 col-lg-2">
                  <div className="card">
                    <div className="card-img-top bg-gray-300 border-b border-gray-600">
                      <img className="img-fluid" src={`https://avatars.dicebear.com/api/big-smile/${userId + 1}.svg`} alt="This is you!" />
                    </div>
                    <div className="card-body">
                      <p className="card-text text-center">This is you!</p>
                    </div>
                  </div>
                </div>

              </div>

            </div>
            <hr className="mb-4" />
            <button
              className="btn btn-primary btn-lg btn-block"
              type="submit"
              onClick={handleSubmit}
            >
              Change Profile
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
