/* eslint-disable react/prop-types */
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuoteRight, faQuoteLeft } from '@fortawesome/free-solid-svg-icons';
// CUSTOM IMPORTS
import { World } from '../World/utils.mjs';
import IndexDummyGrid from './IndexDummyGrid.jsx';
import IndexBaseGrid from './IndexBaseGrid.jsx';
import { setWorldFromId } from '../World/axiosRequests.mjs';

function IndexButtons({ isLoggedIn }) {
  if (isLoggedIn) {
    return (
      <a className="btn text-white bg-green-400 hover:bg-green-300 btn-lg me-3" href="/world" role="button">Enter</a>
    );
  }

  return (
    <>
      <a className="btn text-white bg-green-400 hover:bg-green-300 btn-lg me-3" href="/login" role="button">Log In</a>
      <a className="btn text-white bg-blue-400 hover:bg-blue-300 btn-lg" href="/signup" role="button">Sign Up</a>
    </>
  );
}

// eslint-disable-next-line react/prop-types
export default function IndexPage({ isLoggedIn }) {
  const [world, setWorld] = useState(null);
  const handleUpdateWorld = () => {
    setWorldFromId(setWorld, 2);
  };

  useEffect(() => {
    document.body.classList.add('index-body');

    handleUpdateWorld();

    return () => {
      document.body.classList.remove('index-body');
    };
  }, [world]);

  return (
    <>
      <div className="landing-wrapper d-flex align-items-center justify-content-center">
        <div className="col-11 col-md-6">
          <div className="card w-100">
            <div className="card-body">
              {
                (world && world.worldState && world.worldState.board)
                && (<IndexBaseGrid world={world} />)
              }
              <IndexDummyGrid />
              <blockquote className="callout quote EN">
                <FontAwesomeIcon className="quote-before" icon={faQuoteLeft} />
                I love to be alone. I never found the companion that was so companionable as
                solitude.
                <cite> - Henry David Thoreau</cite>
                <FontAwesomeIcon className="quote-after" icon={faQuoteRight} />
              </blockquote>
            </div>
          </div>
          <div className="d-flex justify-content-end pt-3">
            <IndexButtons isLoggedIn={isLoggedIn} />
          </div>
        </div>
      </div>
    </>
  );
}
