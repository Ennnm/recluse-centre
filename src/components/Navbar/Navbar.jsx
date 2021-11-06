/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

function NavbarButtons({ isLoggedIn, isAuthPage, handleLogoutSubmit }) {
  if (!isAuthPage) {
    if (isLoggedIn) {
      return (
        <form
          className="d-inline-block"
        >
          <button
            className="btn text-white bg-red-400 hover:bg-red-300"
            type="submit"
            onClick={handleLogoutSubmit}
          >
            Log Out
          </button>
        </form>
      );
    }

    return (
      <a className="btn text-white bg-green-400 hover:bg-green-300" href="/login" role="button">Log In</a>
    );
  }

  return null;
}

export default function Navbar({
  isLoggedIn, isAuthPage, hasNavbar, handleLogoutSubmit,
}) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffcanvas(false);
  const handleShowOffCanvas = (e) => {
    e.preventDefault();
    setShowOffcanvas(true);
  };

  if (hasNavbar) {
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
                <NavbarButtons
                  isLoggedIn={isLoggedIn}
                  isAuthPage={isAuthPage}
                  handleLogoutSubmit={handleLogoutSubmit}
                />
              </div>
            </div>
          </div>
        </nav>
        <Offcanvas className="text-white bg-dark" show={showOffcanvas} onHide={handleCloseOffCanvas}>
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
        </Offcanvas>
      </>
    );
  }
  return null;
}
