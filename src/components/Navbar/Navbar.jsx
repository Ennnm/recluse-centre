import React, { useState } from 'react';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import {
  Redirect,
} from 'react-router-dom';
import axios from 'axios';

export default function Navbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const handleCloseOffCanvas = () => setShowOffcanvas(false);
  const handleShowOffCanvas = (e) => {
    e.preventDefault();
    setShowOffcanvas(true);
  };

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
    <>
      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <div className="row w-100">
            <div className="col-3">
              <a
                className="navbar-menu"
                href="/show-offcanvas"
                role="button"
                onClick={handleShowOffCanvas}
              >
                <FontAwesomeIcon icon={faBars} />
              </a>
            </div>
            <div className="col-9 text-end">
              <form
                className="d-inline-block"
              >
                <button
                  className="btn btn-danger"
                  type="submit"
                  onClick={handleLogoutSubmit}
                >
                  Log Out
                </button>
              </form>
              <a className="btn btn-success" href="/login" role="button">Log In</a>
            </div>
          </div>
        </div>
      </nav>
      <Offcanvas className="text-white bg-dark" show={showOffcanvas} onHide={handleCloseOffCanvas}>
        <div className="d-flex flex-column flex-shrink-0">
          <Offcanvas.Header>
            <Offcanvas.Title>The Recluse Centre</Offcanvas.Title>
            <CloseButton variant="white" onClick={handleCloseOffCanvas} />
          </Offcanvas.Header>
          <Offcanvas.Body>
            <ul className="nav nav-pills flex-column mb-auto">
              <li className="nav-item">
                <a href="/" className="nav-link text-white" aria-current="page">
                  Home
                </a>
              </li>
            </ul>
          </Offcanvas.Body>
        </div>
      </Offcanvas>
      {isLoggedOut && (<Redirect to="/login" />)}
    </>
  );
}
