import React, { useState, useEffect } from 'react';
import axios from 'axios';

// component partials
import { io } from 'socket.io-client';
import Navbar from './components/Navbar/Navbar.jsx';
import Routes from './routes/Routes.jsx';

export default function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [socket, setSocket] = useState();

  // need useEffect for this?
  useEffect(() => {
    setSocket(io());
  }, []);
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
      <Navbar handleLogoutSubmit={handleLogoutSubmit} />
      <Routes isLoggedOut={isLoggedOut} socket={socket} />
    </>
  );
}
