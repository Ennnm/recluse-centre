/* eslint-disable react/prop-types */
import React from 'react';
// CUSTOM IMPORTS
import PrivateWrapper from '../../routes/PrivateWrapper.jsx';
import GridElem from './Grid.jsx';
import Chat from '../Chat/Chat.jsx';
import { socket } from '../../contexts/sockets.mjs';

export default function GridWrapper({
  handleChatFocused,
  handleChatUnfocused,
  isChatFocused,
  isLoggedIn,
}) {
  return (
    <PrivateWrapper isLoggedIn={isLoggedIn}>
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
    </PrivateWrapper>
  );
}
