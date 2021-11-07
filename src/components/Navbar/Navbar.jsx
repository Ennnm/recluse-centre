/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons';

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

function NavbarProfile({
  isLoggedIn, username, realName, userId,
}) {
  if (isLoggedIn) {
    return (
      <div className="offcanvas-body-bottom">
        <a href="/settings" className="row d-flex align-items-center text-white text-decoration-none" id="dropdownUser1" data-bs-toggle="dropdown" aria-expanded="false">
          <div className="col-10 d-flex align-items-center">
            <img src={`https://avatars.dicebear.com/api/big-smile/${userId + 1}.svg`} alt="" width="32" height="32" className="rounded-circle me-2" />
            <p className="m-0 text-truncated-parent">
              <strong>{realName}</strong>
              {' '}
              <span>
                (
                {username}
                )
              </span>
            </p>
          </div>
          <div className="col-2 d-flex justify-content-end"><FontAwesomeIcon icon={faCog} /></div>
        </a>
      </div>
    );
  }

  return null;
}

export default function Navbar({
  username, realName, userId, isLoggedIn, isAuthPage, hasNavbar, handleLogoutSubmit,
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
            <div className="d-flex flex-column">
              <ul className={`offcanvas-body-top nav nav-pills flex-column mb-auto${isLoggedIn ? ' is-logged-in' : ''}`}>
                <li className="nav-item">
                  <a href="/" className="nav-link text-white" aria-current="page">
                    Home
                  </a>
                </li>
                {
                  isLoggedIn && (
                    <li className="nav-item">
                      <a href="/world" className="nav-link text-white" aria-current="page">
                        World
                      </a>
                    </li>
                  )
                }
              </ul>
              <NavbarProfile
                isLoggedIn={isLoggedIn}
                username={username}
                realName={realName}
                userId={userId}
              />
            </div>
          </Offcanvas.Body>
        </Offcanvas>
      </>
    );
  }
  return null;
}
