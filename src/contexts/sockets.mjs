import { io } from 'socket.io-client';
import React from 'react';
import {
  Route,
} from 'react-router-dom';

export const socket = io();
export const SocketContext = React.createContext();

export const ContextRoute = ({ contextComponent, component, ...rest }) => {
  const { Provider } = contextComponent;
  const Component = component;

  return (
    <Route {...rest}>
      <Provider value={socket}>
        <Component />
      </Provider>
    </Route>
  );
};
