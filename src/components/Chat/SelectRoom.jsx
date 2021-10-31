import React, { useState } from 'react';
// CUSTOM IMPORTS
import Chat from './Chat2.jsx';

// eslint-disable-next-line react/prop-types
export default function SelectRoom({ socket }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');
  const [showChat, setShowChat] = useState(false);

  const joinRoom = () => {
    if (username.trim() !== '' && room.trim() !== '') {
      // eslint-disable-next-line react/prop-types
      socket.emit('chat:join', room);
      setShowChat(true);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  const renderInterface = () => {
    if (showChat) {
      return (
        <div className="chat-container">
          <Chat socket={socket} username={username} room={room} />
        </div>
      );
    }

    return (
      <div className="join-chat-container">
        <h3>Join A Chat</h3>
        <input type="text" placeholder="John ..." onChange={handleUsernameChange} />
        <input type="text" placeholder="Room ID ..." onChange={handleRoomChange} />
        <button type="button" onClick={joinRoom}>Join a Room</button>
      </div>
    );
  };

  return (
    <div className="pt-5">
      <div className="pt-3 container">
        {renderInterface()}
      </div>
    </div>
  );
}
