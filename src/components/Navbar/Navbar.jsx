import React, { useState } from 'react';
import { Offcanvas, CloseButton } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const handleCloseOffCanvas = () => setShowOffcanvas(false);
  const handleShowOffCanvas = (e) => {
    e.preventDefault();
    setShowOffcanvas(true);
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
                action="/logout?_method=DELETE"
                method="POST"
              >
                <input className="btn btn-danger" type="submit" value="Log Out" />
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
    </>
  );
}
