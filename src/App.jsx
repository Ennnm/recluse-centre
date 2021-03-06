import React, { useState } from 'react';
import axios from 'axios';

// component partials
import Navbar from './components/Navbar/Navbar.jsx';
import Routes from './routes/Routes.jsx';
// CUSTOM IMPORTS
import { hasLoginCookie, getCookie } from './modules/cookie.mjs';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(hasLoginCookie());
  const [isChatFocused, setIsChatFocused] = useState(false);
  const [hasNavbar, setHasNavbar] = useState(true);
  const [isAuthPage, setIsAuthPage] = useState(false);
  const [isJustLoggedOut, setIsJustLoggedOut] = useState(false);
  const [username, setUsername] = useState(getCookie('username').trim());
  const [realName, setRealName] = useState(getCookie('realName').trim().split('%20').join(' '));
  const [description, setDescription] = useState(getCookie('description').trim().split('%20').join(' '));
  const [userId, setUserId] = useState(Number(getCookie('userId').trim()));

  // need useEffect for this?

  const handleLogoutSubmit = (event) => {
    event.preventDefault();

    axios
      .delete('/logout')
      .then((response) => {
        if (response.data.error) {
          console.log('logout error:', response.data.error);
        } else {
          setIsLoggedIn(false);
          setIsJustLoggedOut(true);
          setUsername('');
          setRealName('');
          setUserId(0);
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

  const handleSetIsAuthPage = (bool) => {
    setIsAuthPage(bool);
  };

  return (
    <>
      <Navbar
        username={username}
        userId={userId}
        realName={realName}
        isLoggedIn={isLoggedIn}
        isAuthPage={isAuthPage}
        hasNavbar={hasNavbar}
        handleLogoutSubmit={handleLogoutSubmit}
      />
      <Routes
        username={username}
        realName={realName}
        description={description}
        userId={userId}
        isChatFocused={isChatFocused}
        isLoggedIn={isLoggedIn}
        isJustLoggedOut={isJustLoggedOut}
        setIsLoggedIn={setIsLoggedIn}
        handleChatFocused={handleChatFocused}
        handleChatUnfocused={handleChatUnfocused}
        handleSetNavbar={handleSetNavbar}
        handleSetNoNavbar={handleSetNoNavbar}
        setIsAuthPage={handleSetIsAuthPage}
        setUserId={setUserId}
        setUsername={setUsername}
        setRealName={setRealName}
        setDescription={setDescription}
      />
    </>
  );
}
