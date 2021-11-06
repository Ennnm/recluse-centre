import React, { useState } from 'react';
import axios from 'axios';

// component partials
import Navbar from './components/Navbar/Navbar.jsx';
import Routes from './routes/Routes.jsx';

export default function App() {
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [isChatFocused, setIsChatFocused] = useState(false);
  const [hasNavbar, setHasNavbar] = useState(true);

  // need useEffect for this?

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

  const handleChatFocused = () => {
    setIsChatFocused(true);
  };

  const handleChatUnfocused = () => {
    setIsChatFocused(false);
  };

  const handleSetNavbar = () => {
    setHasNavbar(true);
  };

  const handleSetNoNavbar = () => {
    setHasNavbar(false);
  };

  return (
    <>
      <Navbar hasNavbar={hasNavbar} handleLogoutSubmit={handleLogoutSubmit} />
      <Routes
        isChatFocused={isChatFocused}
        handleChatFocused={handleChatFocused}
        handleChatUnfocused={handleChatUnfocused}
        handleSetNavbar={handleSetNavbar}
        handleSetNoNavbar={handleSetNoNavbar}
        isLoggedOut={isLoggedOut}
      />
    </>
  );
}
