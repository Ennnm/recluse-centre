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
import SelectRoom from '../components/Chat/SelectRoom.jsx';
import Chat from '../components/Chat/Chat.jsx';

export const ContextRoute = ({
  contextComponent,
  component,
  handleChatFocused,
  handleChatUnfocused,
  isChatFocused,
  hasNavbar,
  handleSetNavbar,
  handleSetNoNavbar,
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

function NavbarWrapper({ handleSetNavbar, children }) {
  useEffect(() => {
    // getting background from db, refresh all react worlds on new edit?
    handleSetNavbar();
  }, []);

  return (
    <>
      {children}
    </>
  );
}

function NoNavbarWrapper({ handleSetNoNavbar, children }) {
  useEffect(() => {
    // getting background from db, refresh all react worlds on new edit?
    handleSetNoNavbar();
  }, []);

  return (
    <>
      {children}
    </>
  );
}

export default function Routes({
  handleChatFocused,
  handleChatUnfocused,
  handleSetNavbar,
  handleSetNoNavbar,
  isChatFocused,
  isLoggedOut,
}) {
  return (
    <Router>
      <Switch>
        <ContextRoute
          exact
          path="/"
          contextComponent={SocketContext}
          component={Grid}
          handleChatFocused={handleChatFocused}
          handleChatUnfocused={handleChatUnfocused}
          isChatFocused={isChatFocused}
          hasNavbar
          handleSetNavbar={handleSetNavbar}
          handleSetNoNavbar={handleSetNoNavbar}
        />
        <Route
          path={['/home', '/main']}
          render={
            () => (
              <NoNavbarWrapper handleSetNoNavbar={handleSetNoNavbar}>
                <Index socket={socket} />
              </NoNavbarWrapper>
            )
          }
        />
        <Route
          path="/edit"
          render={
            () => (
              <NavbarWrapper handleSetNavbar={handleSetNavbar}>
                <EditWorld />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/signup"
          render={
            () => (
              <NavbarWrapper handleSetNavbar={handleSetNavbar}>
                <Register />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/login"
          render={
            () => (
              <NavbarWrapper handleSetNavbar={handleSetNavbar}>
                <Login />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/sessionexpired"
          render={
            () => (
              <NavbarWrapper handleSetNavbar={handleSetNavbar}>
                <Login sessionExpired />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="/selectroom"
          render={
            () => (
              <NavbarWrapper handleSetNavbar={handleSetNavbar}>
                <SelectRoom socket={socket} />
              </NavbarWrapper>
            )
          }
        />
        <Route
          path="*"
          render={
            () => (
              <NavbarWrapper handleSetNavbar={handleSetNavbar}>
                <Error404 />
              </NavbarWrapper>
            )
          }
        />
      </Switch>
      {isLoggedOut && <Redirect to="/login" />}
    </Router>
  );
}
