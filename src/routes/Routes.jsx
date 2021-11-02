/* eslint-disable react/prop-types, react/jsx-props-no-spreading */
import React from 'react';
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
  ...rest
}) => {
  const { Provider } = contextComponent;
  const Component = component;

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
        {/* <div className="d-flex align-items-stretch chat-wrapper">
            <Chat
              handleChatFocused={handleChatFocused}
              handleChatUnfocused={handleChatUnfocused}
              socket={socket}
              username="Some Test"
              room={1}
            />
          </div> */}
      </div>
    </div>
  );
}

export default function Routes({
  handleChatFocused,
  handleChatUnfocused,
  isChatFocused,
  isLoggedOut,
}) {
  return (
    <Router>
      <Switch>
        <ContextRoute
          exact
          path={['/', '/home', '/main']}
          contextComponent={SocketContext}
          component={Grid}
          handleChatFocused={handleChatFocused}
          handleChatUnfocused={handleChatUnfocused}
          isChatFocused={isChatFocused}
        />
        <Route path="/edit" component={EditWorld} />
        <Route path="/signup" component={Register} />
        <Route path="/login" component={Login} />
        <Route path="/sessionexpired" render={() => <Login sessionExpired />} />
        <Route
          path="/selectroom"
          render={() => <SelectRoom socket={socket} />}
        />
        <Route path="*" component={Error404} />
      </Switch>
      {isLoggedOut && <Redirect to="/login" />}
    </Router>
  );
}
