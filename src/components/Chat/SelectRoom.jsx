import React, { useState } from 'react';

// eslint-disable-next-line react/prop-types
export default function SelectRoom({ socket }) {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('');

  const joinRoom = () => {
    if (username.trim() !== '' && room.trim() !== '') {
      // eslint-disable-next-line react/prop-types
      socket.emit('chat:join', room);
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleRoomChange = (event) => {
    setRoom(event.target.value);
  };

  return (
    <div className="pt-5">
      <div className="pt-3 container">
        <h3>Join A Chat</h3>
        <input type="text" placeholder="John ..." onChange={handleUsernameChange} />
        <input type="text" placeholder="Room ID ..." onChange={handleRoomChange} />
        <button type="button" onClick={joinRoom}>Join a Room</button>
      </div>
    </div>
  );
}
