/* eslint-disable react/prop-types, react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { SocketContext, socket } from '../contexts/sockets.mjs';

// wrappers
import PrivateWrapper from './PrivateWrapper.jsx';
// auth pages
import Login from '../components/Login/LoginPage.jsx';
import Register from '../components/Register/RegisterPage.jsx';
// main pages
import Index from '../components/Index/IndexPage.jsx';
// error pages
import Error404 from '../components/Error/Error404Page.jsx';
// others
import EditWorld from '../components/World/EditWorld.jsx';
import GridWrapper from '../components/World/GridWrapper.jsx';
import Settings from '../components/Settings/SettingsPage.jsx';

export const ContextRoute = ({
  contextComponent,
  component,
  handleChatFocused,
  handleChatUnfocused,
  isChatFocused,
  hasNavbar,
  isAuthPage,
  isLoggedIn,
  handleSetNavbar,
  handleSetNoNavbar,
  setIsAuthPage,
  username,
  userId,
  realName,
  ...rest
}) => {
  const { Provider } = contextComponent;
  const Component = component;

  useEffect(() => {
    // getting background from db, refresh all react worlds on new edit?
    if (hasNavbar) {
      handleSetNavbar();
    } else {
      handleSetNoNavbar();
    }

    if (isAuthPage) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, []);

  return (
    <Route {...rest}>
      <Provider value={socket}>
        <Component
          username={username}
          realName={realName}
          userId={userId}
          handleChatFocused={handleChatFocused}
          handleChatUnfocused={handleChatUnfocused}
          isChatFocused={isChatFocused}
          isLoggedIn={isLoggedIn}
        />
      </Provider>
    </Route>
  );
};

function NavbarWrapper({
  isAuthPage,
  setIsAuthPage,
  handleSetNavbar,
  children,
}) {
  useEffect(() => {
    handleSetNavbar();

    if (isAuthPage) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, []);

  return <>{children}</>;
}

function NoNavbarWrapper({
  isAuthPage,
  setIsAuthPage,
  handleSetNoNavbar,
  children,
}) {
  useEffect(() => {
    handleSetNoNavbar();

    if (isAuthPage) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, []);

  return <>{children}</>;
}

export default function Routes({
  username,
  realName,
  userId,
  description,
  handleChatFocused,
  handleChatUnfocused,
  handleSetNavbar,
  handleSetNoNavbar,
  isChatFocused,
  isLoggedIn,
  setIsLoggedIn,
  isJustLoggedOut,
  setIsAuthPage,
}) {
  return (
    <Router>
      <Switch>
        <ContextRoute
          exact
          path="/world"
          contextComponent={SocketContext}
          component={GridWrapper}
          handleChatFocused={handleChatFocused}
          handleChatUnfocused={handleChatUnfocused}
          isChatFocused={isChatFocused}
          hasNavbar
          isAuthPage={false}
          isLoggedIn={isLoggedIn}
          handleSetNavbar={handleSetNavbar}
          handleSetNoNavbar={handleSetNoNavbar}
          setIsAuthPage={setIsAuthPage}
          username={username}
          realName={realName}
          userId={userId}
        />
        <Route
          exact
          path={['/', '/home', '/main']}
          render={() => (
            <NoNavbarWrapper
              isAuthPage={false}
              setIsAuthPage={setIsAuthPage}
              handleSetNoNavbar={handleSetNoNavbar}
            >
              <Index isLoggedIn={isLoggedIn} />
            </NoNavbarWrapper>
          )}
        />
        <Route
          path="/edit"
          render={() => (
            <NavbarWrapper
              isAuthPage={false}
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <EditWorld />
            </NavbarWrapper>
          )}
        />
        <Route
          path="/signup"
          render={() => (
            <NavbarWrapper
              isAuthPage
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Register isLoggedIn={isLoggedIn} />
            </NavbarWrapper>
          )}
        />
        <Route
          path="/settings"
          render={() => (
            <NavbarWrapper
              isAuthPage={false}
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <PrivateWrapper isLoggedIn={isLoggedIn}>
                <Settings
                  prevUsername={username}
                  prevRealName={realName}
                  prevDescription={description}
                  userId={userId}
                />
              </PrivateWrapper>
            </NavbarWrapper>
          )}
        />
        <Route
          path="/login"
          render={() => (
            <NavbarWrapper
              isAuthPage
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
            </NavbarWrapper>
          )}
        />
        <Route
          path="/sessionexpired"
          render={() => (
            <NavbarWrapper
              isAuthPage
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Login
                sessionExpired
                isLoggedIn={isLoggedIn}
                setIsLoggedIn={setIsLoggedIn}
              />
            </NavbarWrapper>
          )}
        />
        <Route
          path="*"
          render={() => (
            <NavbarWrapper
              isAuthPage={false}
              setIsAuthPage={setIsAuthPage}
              handleSetNavbar={handleSetNavbar}
            >
              <Error404 />
            </NavbarWrapper>
          )}
        />
      </Switch>
      {isJustLoggedOut && <Redirect to="/" />}
    </Router>
  );
}
