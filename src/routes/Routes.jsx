/* eslint-disable react/prop-types, react/jsx-props-no-spreading */
import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { SocketContext, socket } from '../contexts/sockets.mjs';

// auth pages
import Login from '../components/Login/LoginPage.jsx';
import Register from '../components/Register/RegisterPage.jsx';
// main pages
import Index from '../components/Index/IndexPage.jsx';
import GridElem from '../components/World/Grid.jsx';
// error pages
import Error404 from '../components/Error/Error404Page.jsx';
// others
import EditWorld from '../components/World/EditWorld.jsx';
import Chat from '../components/Chat/Chat.jsx';

export const ContextRoute = ({
  contextComponent,
  component,
  handleChatFocused,
  handleChatUnfocused,
  isChatFocused,
  hasNavbar,
  isAuthPage,
  handleSetNavbar,
  handleSetNoNavbar,
  setIsAuthPage,
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
          handleChatFocused={handleChatFocused}
          handleChatUnfocused={handleChatUnfocused}
          isChatFocused={isChatFocused}
        />
      </Provider>
    </Route>
  );
};

function NavbarWrapper({
  isAuthPage, setIsAuthPage, handleSetNavbar, children,
}) {
  useEffect(() => {
    handleSetNavbar();

    if (isAuthPage) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}

function NoNavbarWrapper({
  isAuthPage, setIsAuthPage, handleSetNoNavbar, children,
}) {
  useEffect(() => {
    handleSetNoNavbar();

    if (isAuthPage) {
      setIsAuthPage(true);
    } else {
      setIsAuthPage(false);
    }
  }, []);

  return (
    <>
      {children}
    </>
  );
}

function PrivateWrapper({ isLoggedIn, children }) {
  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  return children;
}

function Grid({ handleChatFocused, handleChatUnfocused, isChatFocused }) {
  return (
    <div className="pt-5 main-wrapper">
      <div className="mt-1 main-container">
        <div className="grid-wrapper">
          <GridElem isChatFocused={isChatFocused} room={1} />
        </div>
        <div className="chat-wrapper">
          <Chat
            handleChatFocused={handleChatFocused}
            handleChatUnfocused={handleChatUnfocused}
            socket={socket}
            username="Some Test"
            room={1}
          />
        </div>
      </div>
    </div>
  );
}

export default function Routes({
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
          component={Grid}
          handleChatFocused={handleChatFocused}
          handleChatUnfocused={handleChatUnfocused}
          isChatFocused={isChatFocused}
          hasNavbar
          isAuthPage={false}
          handleSetNavbar={handleSetNavbar}
          handleSetNoNavbar={handleSetNoNavbar}
          setIsAuthPage={setIsAuthPage}
        />
        <Route
          exact
          path={['/', '/home', '/main']}
          render={
            () => (
              <NoNavbarWrapper
                isAuthPage={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNoNavbar={handleSetNoNavbar}
              >
                <Index isLoggedIn={isLoggedIn} />
              </NoNavbarWrapper>
            )
          }
        />
        <Route
          path="/edit"
          render={
            () => (
              <NavbarWrapper
                isAuthPage={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <EditWorld />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/signup"
          render={
            () => (
              <NavbarWrapper
                isAuthPage
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <Register isLoggedIn={isLoggedIn} />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/login"
          render={
            () => (
              <NavbarWrapper
                isAuthPage
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/sessionexpired"
          render={
            () => (
              <NavbarWrapper
                isAuthPage
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <Login sessionExpired isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="*"
          render={
            () => (
              <NavbarWrapper
                isAuthPage={false}
                setIsAuthPage={setIsAuthPage}
                handleSetNavbar={handleSetNavbar}
              >
                <Error404 />
              </NavbarWrapper>
            )
          }
        />
      </Switch>
      {isJustLoggedOut && <Redirect to="/" />}
    </Router>
  );
}
