/* eslint-disable react/prop-types */
import React, { useState } from 'react';
// CUSTOM IMPORTS
import PrivateWrapper from '../../routes/PrivateWrapper.jsx';
import GridElem from './Grid.jsx';
import Chat from '../Chat/Chat.jsx';
import { socket } from '../../contexts/sockets.mjs';

function KeybindAlert({ showAlert, setShowAlert }) {
  if (showAlert) {
    return (
      <div className="grid-alert alert bg-yellow-200 bg-opacity-75 alert-dismissible fade show" role="alert">
        <div className="row align-items-center">
          <div className="col-4 d-flex justify-content-center">
            <div className="grouped-keys-block me-3">
              <div className="key__button">W</div>
              <div className="key__button">A</div>
              <div className="key__button">S</div>
              <div className="key__button">D</div>
            </div>
            <div className="flex align-items-center">
              <p className="m-0 text-sm">Move your characters!</p>
            </div>
          </div>
          <div className="col-4 d-flex justify-content-center">
            <div className="flex align-items-center"><div className="key__button me-3">E</div></div>
            <div className="flex align-items-center">
              <p className="m-0 text-sm">Interact with an object or character when standing next to one!</p>
            </div>
          </div>
          <div className="col-4 d-flex justify-content-center">
            <div className="key__button me-3">B</div>
            <div className="flex align-items-center">
              <p className="m-0 text-sm">Begin building something!</p>
            </div>
          </div>
        </div>
        <button type="button" className="close" aria-label="Close" onClick={() => { setShowAlert(false); }}>
          <span className="text-2xl" aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  return null;
}

export default function GridWrapper({
  handleChatFocused,
  handleChatUnfocused,
  isChatFocused,
  isLoggedIn,
}) {
  const [openKeybindAlert, setOpenKeybindAlert] = useState(true);
  return (
    <PrivateWrapper isLoggedIn={isLoggedIn}>
      <KeybindAlert showAlert={openKeybindAlert} setShowAlert={setOpenKeybindAlert} />
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
